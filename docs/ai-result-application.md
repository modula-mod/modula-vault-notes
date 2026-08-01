# AI Result Application

AI generation and record mutation are separate operations:

1. Generate a suggestion through the host AI gateway.
2. Show preview or diff.
3. Require explicit user approval.
4. Validate execution ownership and expected note revision.
5. Validate the structured result.
6. Apply through the normal note update path.
7. Increment the note revision and create version history.

Rejected, expired, or preview-only suggestions do not enter unified search.
