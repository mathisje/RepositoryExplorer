import {useEffect, useState} from 'react';
import parse from 'parse-link-header'
import {CompareFunction} from '../util';

enum State {
    INITIAL,
    FETCHING,
    SORTING,
    ERROR,
    READY,
}

type UseSortedApiListParams<T> = { initialUrl: string, compareFunction?: CompareFunction<T> };
type UseSortedApiListReturnValue<T> = { data: Array<T> | null, error: Error | null, loading: boolean };

function useSortedApiList<T>({initialUrl, compareFunction}: UseSortedApiListParams<T>): UseSortedApiListReturnValue<T> {

    const [state, setState] = useState<State>(State.INITIAL);
    const [data, setData] = useState<Array<T> | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [fetchUrl, setFetchUrl] = useState('');
    const [list, setList] = useState<Array<T>>([]);

    useEffect(() => {
        if (initialUrl) {
            setState(State.FETCHING);
            setData(null);
            setError(null);
            setFetchUrl(initialUrl);
            setList([]);
        }
    }, [initialUrl]);

    useEffect(() => {
        let errorStatus = false;
        let lastPage = false;
        if (fetchUrl && state === State.FETCHING) {
            fetch(fetchUrl)
                .then(response => {
                    if (response.status !== 200) {
                        errorStatus = true;
                        return response.json();
                    }
                    const parsedLink = parse(response ?.headers ?.get('link') || '');
                    if (parsedLink ?.next ?.url)
                    {
                        setFetchUrl(parsedLink.next.url);
                    }
                    else
                    {
                        lastPage = true;
                    }
                    return response.json();
                }).then(newList => {
                if (errorStatus) {
                    throw newList;
                }
                setList(currentList => currentList.concat(newList));
                if (lastPage) {
                    setState(State.SORTING);
                }
            }).catch((error: Error) => {
                setState(State.ERROR);
                setError(error);
            });
        }
    }, [fetchUrl, state]);

    useEffect(() => {
        if (state === State.SORTING) {
            const newList = [...list];
            if (compareFunction) {
                newList.sort(compareFunction);
            }
            setData(newList);
            setState(State.READY);
        }
    }, [list, state, compareFunction]);

    const loading = [State.INITIAL, State.FETCHING, State.SORTING].includes(state);

    return {data, loading, error};
}

export default useSortedApiList;
