import { useEffect, useState } from 'react';
import parse from 'parse-link-header'
import { CompareFunction } from '../util';

enum State {
  INITIAL,
  FETCHING,
  SORTING,
  ERROR,
  READY,
}

type UseSortedApiListParams<T> = {
  launchUrl?: string,
  compareFunction?: CompareFunction<T>
};
type UseSortedApiListReturnValue<T> = {
  data: Array<T> | null,
  error: Error | null,
  loading: boolean
};

/** Hook to fetch paginated list data from the GitHub API and optionally sort it according a compareFunction. Since
 *  we are sorting on the client, we must fetch the data continuously until all of it is returned to the client. */
function useSortedApiList<T>({launchUrl, compareFunction}: UseSortedApiListParams<T>): UseSortedApiListReturnValue<T> {

  const [ state, setState ] = useState<State>(State.INITIAL);
  const [ data, setData ] = useState<Array<T> | null>(null);
  const [ error, setError ] = useState<Error | null>(null);
  const [ fetchUrl, setFetchUrl ] = useState<string>('');
  const [ list, setList ] = useState<Array<T>>([]);

  /** Effect to initialize the state. When this hook is supplied a new launchUrl, the state is set to FETCHING and all
   *  other values are reset so that we can begin fetching data from the supplied endpoint. Callers may also supply a
   *  falsy value for initialUrl if they are not ready to start fetching data yet */
  useEffect(() => {
    setState(launchUrl ? State.FETCHING : State.INITIAL);
    setData(null);
    setError(null);
    setFetchUrl(launchUrl || '');
    setList([]);
  }, [ launchUrl ]);

  /** After status is set to FETCHING, try to get list data from the GitHub API, and set the status to SORTING (success)
   *  or ERROR (failure). */
  useEffect(() => {
    let errorStatus = false;
    let lastPage = false;
    if (fetchUrl && state === State.FETCHING) {
      fetch(fetchUrl)
      .then(response => {
        if (response.status !== 200) {
          /* For simplicity, treat all non-200s as errors */
          errorStatus = true;
          return response.json();
        }
        /* Try to parse the link to the next page url from the headers and set that url as the new fetch url */
        const parsedLink = parse(response?.headers?.get('link') || '');
        if (parsedLink?.next?.url) {
          setFetchUrl(parsedLink.next.url);
        } else {
          /* Otherwise, this is the last page of data */
          lastPage = true;
        }
        return response.json();
      }).then(newList => {
        if (errorStatus) {
          /* If the server returned a non-200 status, treat the result as an error */
          throw newList;
        }
        /* Update the list with the next page of data and set state to SORTING if it's the last page */
        setList((currentList: Array<T>) => currentList.concat(newList));
        if (lastPage) {
          setState(State.SORTING);
        }
      }).catch((error: Error) => {
        setState(State.ERROR);
        setError(error);
      });
    }
  }, [ fetchUrl, state ]);

  /** Once all of the data has been loaded from the server, sort the list according to the compareFunction provided by
   *  the caller, set the data property returned by the hook to the sorted list, and change state from SORTING to READY */
  useEffect(() => {
    if (state === State.SORTING) {
      const newList = [ ...list ];
      if (compareFunction) {
        newList.sort(compareFunction);
      }
      setData(newList);
      setState(State.READY);
    }
  }, [list, state, compareFunction]);

  /* Return either loading === true or else one of data or error */
  const loading = [ State.INITIAL, State.FETCHING, State.SORTING ].includes(state);

  return { data, error, loading };
}

export default useSortedApiList;
