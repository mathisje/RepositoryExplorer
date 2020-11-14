import React, {useState} from 'react';
import {useLocation} from 'react-router';
import ListGroup from 'react-bootstrap/ListGroup';
import useSortedApiList from '../hooks/useSortedApiList'
import Details from './Details';
import ErrorView from './ErrorView';
import LoadingView from './LoadingView';
import {Commit} from '../util';

const COMMIT_DISPLAY_PROPERTIES: Record<string, string> = {
    url: 'url',
    message: 'message',
};

function CommitsPage() {
    const {search} = useLocation();
    const searchParams = new URLSearchParams(search);
    const org = searchParams.get('org');
    const repo = searchParams.get('repo');
    const initialUrl = `https://api.github.com/repos/${org}/${repo}/commits`;
    const {data, error, loading} = useSortedApiList<Commit>({initialUrl});
    const [activeCommit, setActiveCommit] = useState<any>(null);
    const commits = data || [] as Commit[];
    const successView = (
        <>
        <div className="details-container">
            <Details item={activeCommit} propertiesToDisplay={COMMIT_DISPLAY_PROPERTIES}/>
        </div>
        <div className="list-container">
            <ListGroup>
                {
                    commits.map((commit: Commit) => {
                        return (
                            <ListGroup.Item
                                action
                                active={activeCommit === commit.commit}
                                key={commit.sha}
                                onClick={() => setActiveCommit(commit.commit)}
                            >
                                {commit.sha}
                            </ListGroup.Item>
                        );
                    })
                }
            </ListGroup>
        </div>
        </>
    );
    return (
        <div className="page">
            {error && <ErrorView error={error}/>}
            {loading && <LoadingView/>}
            {!loading && !error && successView}
        </div>
    );
}

export default CommitsPage;