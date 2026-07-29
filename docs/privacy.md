# Privacy

Vault Notes records are account-scoped by default. Cross-account discovery,
reads, updates, deletes, exports and search results are forbidden.

Ordinary event payloads, diagnostics, audit metadata, worker logs and error
envelopes must not include complete note contents. Search projections may index
the note title and plain-text projection only for the owning account.

Saved-source provenance stores references and permitted metadata. It must not
copy inaccessible social content into a note.
