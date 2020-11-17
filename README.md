# Repository Explorer Web Application

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To run the project locally, download the code from GitHub, and in the `repository-explorer` directory run `yarn install`
 and `yarn start`. Use the command `yarn test` to run tests.

This is a simple web app to pull a list of repos for the Netflix organization from the GitHub API, sort them by open
 issues, and provide a link to explore the commits for the repo.

One of the most important decisions I have to make is about how to handle pagination. Sorting by open issues is
 not supported at the API layer, according to the documentation. Therefore, I concluded that I need to fetch all of
 the repositories from the paginated API up front, and then sort them on the client. This should be ok for something
 like repositories where even a large organization like Netflix only has two pages of data at 100 results per page.

For the commits page, the situation is different. I assumed that very large result sets were possible (imagine
 something like the Google monorepo), and there is no requirement for client-side sorting. I initially thought that an
 infinite scrolling list that fetches paginated data on the fly would create the best user experience, and prevent
 trying to fetch too much data. However, after getting into the development process, I realized that I could reuse my
 hook for getting data from the repo page, and that the infinite scrolling list did not justify its development cost for
 this project. This implementation has worked for my use case, but it's one of the first issues I would want to address
 if I were to continue work on this project.

The code quality is backed up with static analysis from typescript and a relatively simple test suite. There are unit
 tests for the most interesting display logic in the app, which is the component that converts generic entities from the
 API to the appropriate display format. There are also unit tests for the custom comparison function that is used to
 sort the repos returned from the API. In a larger and more complex application, I would want to isolate my business
 logic away from the display code and into pure functions backed by unit tests. The most complex code in the app is the
 code in the custom hook that fetches paginated data continuously until it is all loaded, and this code is untested,
 which is not ideal. This is another pain point that I would address right away if I were to continue working on this
 project.