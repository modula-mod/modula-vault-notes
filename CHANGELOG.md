# Changelog

## 2.0.0 — private preview candidate, not published

- Reconciles Vault Notes with frozen GreenField v1 contracts for settings, sync, history, reverse references, search, media bindings, record sharing, governed functions/actions, and intelligence policy.
- Adds explicit `settings:read` and `settings:write` requests; upgrading from 1.8 requires a real permission review.
- Requests record-scoped media and sharing permissions without treating asset IDs or share IDs as authority.
- Declares signed-cursor background sync, mutation-ID replay, expected-revision conflicts, and bounded tombstone semantics.
- Keeps final `2.0.0` unsigned, unregistered, and unpublished while the RC is visually and functionally reviewed.

## 2.0.0-rc.1 — candidate, not published

- Replaces the single frontend source file with a product-owned multi-surface architecture: 22 routes, 22 screens, reusable Vault components, feature domains, hooks, capability-aware states, and artifact-level frontend tests.
- Reduces `frontend/index.tsx` to the bounded ModuleHost registration boundary and adds a source reachability/file-size architecture guard.
- Adds module surfaces for folders, tags, templates, Daily Note, revisions, attachments, saved searches, graph projection, structured-view status, local intelligence, and grouped settings without host special cases.
- Documents exact `@modula/product-ui` support, limitations, missing primitives, and SDK extraction candidates.
- Adds backward-compatible portable note fields for content format, typed properties, attachments, sensitivity, templates, and daily-note identity.
- Adds deterministic templates, daily-note creation, stable note links, backlinks, related-note ranking, and graph data.
- Adds bounded attachment metadata associations without exposing filesystem paths.
- Adds revision restore that creates a new revision and preserves intervening history.
- Adds rich account-scoped search/filter helpers, saved searches, import, and a versioned portable backup/export contract.
- Adds local-intelligence request contracts with fail-closed `localOnly` handling for sensitive notes.
- Adds Pinned and Recent declarative views and aligns module-owned settings with the published settings schema.
- Does not publish, alter production data, or claim generic sync, sharing, widget, media-upload, or local-intelligence runtime support.

## 1.8.0

- Ship the new Vault Notes product icon (1024 px PNG) and editorial cover (1600x900 JPEG) as hash-bound registry presentation assets.
- Rebuild the declarative product frontend for the 1.8.0 release identity; note behaviour, records, and schemas are unchanged from 1.7.0.

## 1.7.0

- Give New Note and Edit Note distinct product-owned screens and actions.
- Keep the create and update flows compact when rendered by the generic Product Host.
- Preserve structured folder and tag fields for the host's native picker and token controls.

## 1.6.0

- Make note creation compatible with Greenfield-owned record IDs, revisions, and timestamps so the product editor can save without fabricating platform metadata.
- Simplify the product-authored editor copy and structure for the generic mobile Product Host.
- Provide a deterministic empty rich-text document for new notes.

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
