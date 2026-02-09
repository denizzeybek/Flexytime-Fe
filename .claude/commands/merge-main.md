Merge dev branch into main and push to remote.

Steps:
1. Run `git status` to check for uncommitted changes. If there are any, warn and stop.
2. Run `git checkout main && git pull origin main` to switch to main and pull latest.
3. Run `git merge dev` to merge dev into main. If there are conflicts, stop and inform the user.
4. Run `git push origin main` to push main to remote.
5. Run `git checkout dev` to switch back to dev branch.
6. Report success with the merge result.
