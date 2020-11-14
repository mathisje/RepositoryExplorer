import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import useSortedApiList from '../hooks/useSortedApiList'
import Details from './Details';
import ErrorView from './ErrorView';
import LoadingView from './LoadingView';
import {compareReposByOpenIssues, Repo} from '../util'

const DEFAULT_ORG = 'netflix';
const DEFAULT_URL = `https://api.github.com/orgs/${DEFAULT_ORG}/repos`;
const REPO_DISPLAY_PROPERTIES: Record<string, string> = {
    forks_count: 'Forks',
    language: 'Language',
    name: 'Name',
    open_issues_count: 'Open Issues',
    watchers_count: 'Watchers',
};

function ReposPage() {
    const {data, error, loading} = useSortedApiList<Repo>({
        compareFunction: compareReposByOpenIssues,
        initialUrl: DEFAULT_URL
    });
    const [activeRepo, setActiveRepo] = useState<Repo | null>(null);
    console.log('repos', data);
    const repos = data || [] as Repo[];
    const commitsUrl = `/commits?org=${DEFAULT_ORG}&repo=${activeRepo ?.name || ''}`;
    const successView = (
        <>
        <div className="details-container">
            <div className="detail-actions">
                {activeRepo && <Link to={commitsUrl}><Button>View Commits</Button></Link>}
            </div>
            <Details item={activeRepo} propertiesToDisplay={REPO_DISPLAY_PROPERTIES}/>
        </div>
        <div className="list-container">
            <ListGroup>
                {
                    repos.map((repo: Repo) => {
                        return (
                            <ListGroup.Item
                                action
                                active={activeRepo === repo}
                                key={repo.id}
                                onClick={() => setActiveRepo(repo)}
                            >
                                {repo.name}
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

export default ReposPage;