# Vault Notes

## Purpose

Private notes and knowledge inside Modula. Vault Notes is the canonical MPS example of a full module: identity, presentation, declarative frontend, Greenfield-hosted records, permissions, capabilities, extension points, privacy, and release provenance.

## Users

Modula account holders who want account-scoped notes that remain private by default.

## Product kind

`module` (Module Standard 2.1 profile under MPS 1.0)

## Capabilities

Provides `notes.provider`, create/read/update/search, templates, daily notes, typed properties, stable note relationships, deterministic related-note and graph projections, attachment metadata associations, revision checkpoints, portable import/export, sensitive-note policy, and extension-point contribution capabilities so Formatting, intelligence, and Voice can attach generically.

## Frontend

Product-owned declarative frontend source and immutable compiled artifact. It defines home, collection, detail, editor, search, pinned, recent, favourites, archive, trash, folders, product settings, loading, empty, permission, offline, and unavailable states. The generic host renders it with semantic platform controls; there is no remote JSX execution. Graph, table/board, attachment gallery, audio/PDF preview, revision browser, and split editor remain blocked on generic UI primitives.

## Backend

`greenfield-records`. No dedicated HTTP service.

## Storage

Greenfield-hosted records: note, folder, tag, note-link, note-version, saved-source, attachment metadata, template, and saved search.

## Data

Account-scoped. Uninstall supports keep-data and delete-data. Account deletion deletes product data.

## Extension points

Twelve governed points (home section, editor toolbar/command/attachment, note actions/context menu/inspector/after-save, collection actions, search provider, composer tool, settings section). Target them by MPS IDs, never by parsing the product name.

## Dependencies

None required. Family add-ons/plugins are optional.

## Privacy

See `PRIVACY.md` and `docs/privacy.md`. No analytics. No default network.

## Non-goals

- Not an AI product (that is Vault AI)
- Not a transcription product (that is Vault Voice)
- Not a formatting plugin (that is Vault Formatting)
- Does not require Greenfield core changes for ordinary evolution
- Does not claim offline sync, link sharing, host widgets, or local-intelligence execution before those generic platform contracts exist

## Acceptance

- MPS verify passes
- MPS frontend build and renderer-compatible preview pass
- Artwork remains development-grade until explicit founder/public approval
- Install / enable / open / CRUD / search / disable / uninstall work through the generic host
- Coexists with Reference Notes as a second `notes.provider`
