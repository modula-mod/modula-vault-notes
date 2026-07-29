# Search

Vault Notes contributes `note` and `vault-folder` projections to Greenfield
unified search.

The note projection indexes:

- title;
- plain-text projection;
- tags;
- folder name;
- permitted saved-source title and author;
- created and updated timestamps.

It does not index version-history snapshots, deleted notes as active content,
private attachment data, unsupported structured metadata or secrets.

All search documents are account-scoped by default.
