import {
  ReposListForOrgResponseData,
  ReposListCommitsResponseData,
} from '@octokit/types';
import {ValuesType} from 'utility-types';

export type Repo = ValuesType<ReposListForOrgResponseData>;
export type Commit = ValuesType<ReposListCommitsResponseData>;
export type CompareFunction<T> = (first: T, second: T) => 1 | -1 | 0;

/** This comparison function compares two repo entities from the GitHub API and returns a score of:
 *
 * -1 if the first repo has more open issues than the second,
 * 1 if the first repo has fewer open issues than the second,
 * or 0 if they are tied
 *
 * This kind of comparison function can be passed to Array.prototype.sort to sort the array */
export const compareReposByOpenIssues: CompareFunction<Repo> = (first: Repo, second: Repo): 1 | -1 | 0 => {
  if (first.open_issues_count > second.open_issues_count) {
    return -1;
  }
  if (second.open_issues_count > first.open_issues_count) {
    return 1;
  }
  return 0;
};
