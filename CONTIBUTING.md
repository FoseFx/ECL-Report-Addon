# CONTRIBUTING

Contributing to this project is easy.
Just follow this basic workflow:

0. Find an issue
   You found a bug or want to improve something?
   Somebody else could already have opened an issue.
   Contribute to the discussion, maybe someone else is already assigned.
1. Open an issue
   So your did not found any issue describing the problem?
   Open one. Contribute to the discussion!
2. Get assigned
   You think you can fix this issue?
   Ask me to get assigned to it.
3. [Work on a solution](CONTRIBUTING.md#working-on-an-issue)
4. Make a pull request
   The CI and codecov will check how healthy your commits are.
5. Request a Code Review
6. Get merged
   Now it's up to me to decide on whether your code gets merged.


## Working on an issue
1. Fork the current codebase (it's only one button click away)
   or [sync](https://help.github.com/en/articles/syncing-a-fork) the existing one of yours
2. Pull the current codebase
3. Create a new branch using
   `git branch <yourname>-<short-rererence-to-issue>`
   like 
   `git branch fosefx-missing-contributing-file`
4. Go to the branch
    `git checkout <branchname>`
5. Develop feature-by-feature
   Keep your commits small
   Don't: `Added CONTRIBUTING and tested faceit.ts and removed other feature`
   Do: `Added CONTRIBUTING`, `Tested faceit.ts`, `Removed feature`
   Keep in mind all commits should be well tested and should pass the linter
6. Push to github
   `git push origin <branchname>`
7. Open Pull Request (github will guide you)
8. (Read code reviews and fix code)
9. Profit.


