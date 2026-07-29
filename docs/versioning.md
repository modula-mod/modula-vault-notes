# Versioning

Vault Notes declares four independent versions:

- `standardVersion`: Modula Module Standard compatibility.
- `moduleVersion`: feature-level Vault Notes release version.
- `manifestSchemaVersion`: manifest representation version.
- `dataSchemaVersion`: persisted record schema version.

Initial release values are all `1.0.0`.

Feature-only changes update `moduleVersion`. Persisted record changes update
`dataSchemaVersion`. Manifest representation changes update
`manifestSchemaVersion`. Standard compatibility changes update
`standardVersion` and may require a breaking module version.
