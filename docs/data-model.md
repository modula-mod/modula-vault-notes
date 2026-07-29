# Data Model

Vault Notes 1.0 defines these Standard records:

- `note`: structured document, projections, folder, tags, flags, source
  provenance, revision and deletion metadata.
- `folder`: account-scoped folder hierarchy with stable position ordering.
- `tag`: account-scoped tag label with normalized uniqueness.
- `note-link`: internal, related or source links between notes.
- `note-version`: bounded version snapshots for revision recovery.
- `saved-source`: provenance metadata for manual, web, file or Modula social
  sources.

All records are stored by the host through generic module-record persistence.
The module package contains no Vault Notes-specific SQL.
