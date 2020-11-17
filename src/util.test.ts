import { compareReposByOpenIssues } from './util'

test('returns a tie when the open issues count is the same', () => {
  const first = { open_issues_count: 5 };
  const second = { open_issues_count: 5 };
  expect(compareReposByOpenIssues(first, second)).toBe(0);
});

test('returns -1 when the first repo has more open issues', () => {
  const first = { open_issues_count: 10 };
  const second = { open_issues_count: 5 };
  expect(compareReposByOpenIssues(first, second)).toBe(-1);
});

test('returns 1 when the first repo has fewer open issues', () => {
  const first = { open_issues_count: 1 };
  const second = { open_issues_count: 5 };
  expect(compareReposByOpenIssues(first, second)).toBe(1);
});
