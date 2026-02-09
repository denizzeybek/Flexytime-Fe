Commit only the currently staged files with a meaningful English commit message. Do NOT stage any additional files.

Steps:
1. Run `git diff --cached` to review what is currently staged
2. If nothing is staged, inform the user and stop
3. Run `git log --oneline -5` to see recent commit style
4. Analyze the staged changes and generate a concise, meaningful English commit message
5. Create the commit with the generated message (do NOT run `git add`)

The commit message should:
- Be concise (1-2 sentences)
- Focus on the "why" rather than the "what"
- Follow conventional commit style when appropriate (feat:, fix:, chore:, refactor:, etc.)
- End with: Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
