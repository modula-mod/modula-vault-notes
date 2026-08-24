# Changelog

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
