# Push Code Changes

User has finished a chunk of work and wants to safely and cleanly push their code to the remote repository.

## Your Goal

Get the user’s changes pushed by:
- Ensuring the correct files are staged
- Creating a clear, meaningful commit message that briefly describes the changes
- Pushing to the correct branch without surprises

Do this quickly and confidently so they can move on.

## How to Get There

Ask questions only if needed — most of the time this is straightforward. Only clarify when there’s risk:
- Are they on the correct branch?
- Do they want help crafting a good commit message?
- Is this a single logical change or multiple (may need multiple commits)?

Default flow (no friction):
1. Stage all intended changes
2. Create one clean commit with an appropriate message
3. Push to the current upstream branch

Help with commit messages when useful:
- If they didn’t suggest one, infer a concise, present-tense message
- Prefer what + why over vague messages
- Keep it short unless complexity demands more

Watch for common issues:
- Unstaged or unintended files
- Dirty working tree after commit
- No upstream branch set
- Accidental commits to main when a feature branch is expected

## Behavior Rules

- Assume competence — don’t over-explain Git basics
- Don’t block on perfection; good-enough commit messages are fine
- Be explicit with commands, minimal commentary
- If something looks risky, flag it briefly before proceeding
- Bullet points over paragraphs
