import {
    ReposListForOrgResponseData,
    ReposListCommitsResponseData,
} from '@octokit/types';
import { ValuesType } from 'utility-types';

export type Repo = ValuesType<ReposListForOrgResponseData>;
export type Commit = ValuesType<ReposListCommitsResponseData>;
export type CompareFunction<T> = (first: T, second: T) => 1 | -1 | 0;

export const compareReposByOpenIssues: CompareFunction<Repo> = (first: Repo, second: Repo): 1 | -1 | 0 => {
    if (first.open_issues_count > second.open_issues_count) {
        return -1;
    }
    if (second.open_issues_count > first.open_issues_count) {
        return 1;
    }
    return 0;
};
