# Changelog

## 1.5.0

- Replaces hand-authored frontend JSON with typed TSX product source compiled by `@modula/product-ui-compiler`.
- Keeps the installed artifact deterministic and declarative; raw TSX is never packaged or executed by the host.

## 1.4.0

- Move the complete Vault Notes experience into a product-owned MPS frontend artifact.
- Add deterministic routes and views for notes, detail/edit, search, favourites, archive, trash, folders, and product settings.
- Bind the compiled frontend hash into product release provenance and package the source plus immutable artifact.
- Continue using Greenfield-hosted records and the generic Modula Product Host; no product-specific shell implementation or arbitrary remote code is introduced.

## 1.3.0

- Add canonical MPS 1.0-RC `modula.product.json` as the product source of truth.
- Declare Vault family `digital.modula.vault`, provider role `notes.provider`, and MPS extension-point IDs.
- Add AGENTS.md, PRODUCT.md, PRIVACY.md, and provisional first-party presentation assets. Artwork is not founder-approved final branding.
- Keep Module Standard 2.1 `modula.module.json` and Greenfield `module.manifest.json` as compatibility adapters for historical releases.

## 1.2.0

- Evolve the manifest to Modula Module Standard 2.1 and declare twelve governed extension points.
- Remove embedded AI declarations and source; optional AI is now owned by the separate Vault AI add-on.
- Publish versioned Vault Notes events for declarative extension subscribers.

## Unreleased

- Align source identity with the canonical Product Hub module ID
  `digital.modula.vault-notes`. This is not a new product version and does not
  invent 1.2.0. Tagged current release remains `vault-notes-v1.1.0`.
- README states this repository is the canonical source for
  `digital.modula.vault-notes`.

## 1.1.0

- Declare optional provider-neutral AI product actions for summaries, title suggestions, selection rewrites, action-item extraction and tag suggestions.
- Add immutable prompt definitions and result schemas.
- Keep Vault Notes operational without AI permissions or provider availability.

## 1.0.0

- Initial Vault Notes Standard 1.0 reference module.
- Declares note, folder, tag, note-link, note-version and saved-source records.
- Adds declarative views, actions, settings, events, search projection metadata,
  diagnostics and immutable release packaging.
