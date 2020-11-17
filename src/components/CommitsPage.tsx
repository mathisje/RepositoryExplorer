import React, { useState } from 'react';
import { useLocation } from 'react-router';
import ListGroup from 'react-bootstrap/ListGroup';
import useSortedApiList from '../hooks/useSortedApiList'
import Details, { DisplayItem } from './Details';
import ErrorView from './ErrorView';
import LoadingView from './LoadingView';
import { Commit } from '../util';

const COMMIT_DISPLAY_ITEMS: Array<DisplayItem> = [
  { label:'Author', path: 'author.login' },
  { label:'Message', path: 'commit.message' },
];

/** This component represents the page that fetches commit data for a repo from the GitHub API and displays it to the
 *  user in an unsorted list. The user can click any of the commits to get additional information for that commit */
function CommitsPage() {

  /* Get data from the query params for the page */
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const org = searchParams.get('org');
  const repo = searchParams.get('repo');

  const launchUrl = `https://api.github.com/repos/${org}/${repo}/commits?per_page=100`;
  const { data, error, loading } = useSortedApiList<Commit>({ launchUrl });

  /* The currently selected commit, or null if none is selected */
  const [ activeCommit, setActiveCommit ] = useState<any>(null);
  const commits = data || [] as Commit[];
  const successView = (
    <>
      <div className="details-container">
        <Details entity={activeCommit} entityName="commit" instructions={COMMIT_DISPLAY_ITEMS}/>
      </div>
      <div className="list-container">
        <ListGroup>
          {
            commits.map((commit: Commit) => {
              return (
                <ListGroup.Item
                  action
                  active={activeCommit === commit}
                  key={commit.sha}
                  onClick={() => setActiveCommit(commit)}
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

  /* Display either a loading view, an error view, or the success view to the user */
  return (
    <div className="page">
      {error && <ErrorView error={error}/>}
      {loading && <LoadingView/>}
      {!loading && !error && successView}
    </div>
  );
}

export default CommitsPage;
