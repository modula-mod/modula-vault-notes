# Architecture

Vault Notes is a declarative Standard 1.0 module. The module package declares
record schemas, views, actions, functions, settings, events, search projections,
diagnostics and release metadata. The host owns persistence, permissions,
installation lifecycle, search indexing and rendering.

The module package does not ship arbitrary UI code, SQL, worker code or secrets.
It provides portable contracts and pure validation/runtime helpers used by tests
and release verification.

Primary flow:

1. `modula.module.json` validates against Modula Module Standard 1.0.
2. `module.manifest.json` adapts the release into the Greenfield registry.
3. Greenfield registers schemas, settings, events, search and declarative views.
4. The module host renders `/module/modula.vault-notes` and subpaths.
5. Generic module records store all note data account-scoped.

Deferred systems are extension points only: AI, automations, DIMON, social/file
connectors, native share extensions and collaborative editing are not enabled in
Vault Notes 1.0.
