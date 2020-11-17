import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import useSortedApiList from '../hooks/useSortedApiList'
import Details, { DisplayItem } from './Details';
import ErrorView from './ErrorView';
import LoadingView from './LoadingView';
import { compareReposByOpenIssues, Repo } from '../util'

const DEFAULT_ORG = 'netflix';
const DEFAULT_URL = `https://api.github.com/orgs/${DEFAULT_ORG}/repos?per_page=100`;
const REPO_DISPLAY_ITEMS: Array<DisplayItem> = [
  { label:'Name', path: 'name' },
  { label:'Open Issues', path: 'open_issues_count' },
  { label:'Forks', path: 'forks_count' },
  { label:'Language', path: 'language' },
  { label:'License', path: 'license.name' },
  { label:'Watchers', path: 'watchers_count' },
];

/** This component represents the page that fetches repo data from the GitHub API, and displays it to the user in a
 *  sorted list. The user can click any of the repos to get additional information, as well as a link to the commits
 *  for that repo */
function ReposPage() {

  const { data, error, loading } = useSortedApiList<Repo>({
    compareFunction: compareReposByOpenIssues,
    launchUrl: DEFAULT_URL
  });

  /* The currently selected repo, or null if none is selected */
  const [ activeRepo, setActiveRepo ] = useState<Repo | null>(null);

  const repos = data || [] as Repo[];
  const commitsUrl = `/commits?org=${DEFAULT_ORG}&repo=${activeRepo?.name || ''}`;

  /* This is the view that will display for the user when the repos have been successfully fetched and sorted */
  const successView = (
    <>
      <div className="details-container">
        <div className="detail-actions">
          {activeRepo && <Link to={commitsUrl}><Button>View Commits</Button></Link>}
        </div>
        <Details entity={activeRepo} entityName="repo" instructions={REPO_DISPLAY_ITEMS}/>
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

  /* Display either a loading view, an error view, or the success view to the user */
  return (
    <div className="page">
      {error && <ErrorView error={error}/>}
      {loading && <LoadingView/>}
      {!loading && !error && successView}
    </div>
  );
}

export default ReposPage;
