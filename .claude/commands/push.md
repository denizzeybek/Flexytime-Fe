Push the current branch to the remote repository.

Steps:
1. Run `git status` to check the current branch and if there are unpushed commits
2. Run `git log --oneline origin/$(git branch --show-current)..HEAD` to show what will be pushed
3. Push to the remote with `git push -u origin $(git branch --show-current)`
