# Vault Notes

Vault Notes is a portable notes core and a governed extension host. It works without optional products. Its records are designed for a future offline queue, but the 2.0 RC does not advertise offline operation until GreenField provides a generic cursor, tombstone, and client-mutation contract. AI, voice, formatting, automation, connectors, functions, tools, and widgets attach through declared Modula Module Standard 2.1 extension points and capability grants; they do not import Vault Notes internals or access its database directly.

Canonical source repository for `digital.modula.vault-notes`.

The 2.0 candidate frontend is a statically compiled multi-surface application. Its entrypoint only registers application composition; screens, product components, feature boundaries, hooks, and truthful capability fallbacks live under `frontend/`. See `docs/architecture/frontend.md`.

There is one Vault Notes product. This GitHub repository name does not have to
equal the module ID.

Vault Notes is the first complete independently versioned module for Modula
Module Standard 2.1. It proves the Standard outside the main app through an
external repository, immutable release package, Greenfield registry import,
generic record persistence and declarative module host rendering.

## Identity

- product: Vault Notes
- module ID: `digital.modula.vault-notes`
- publisher: Modula
- slug: `vault-notes`
- module version: `2.0.0-rc.1`
- product standard: MPS 1.0 (`modula.product.json` is canonical)
- standard version: `2.1.0`
- manifest schema version: `2.1.0`
- data schema version: `1.0.0`
- candidate release identity: `vault-notes-v2.0.0-rc.1` (not published)
- product-owned frontend source: typed TSX compiled to a validated artifact (immutable release lines; earlier tags are never mutated)

Legacy module ID `modula.vault-notes` is a migration alias only. It must not
appear as a second Product Hub product.

Legacy source `modula-mod/modula-module-vault-notes` is archive/redirect only.

## Scope

Vault Notes 2.0 RC preserves the 1.8 document and data-schema contract while adding templates, daily notes, typed properties, stable references and backlinks, deterministic related notes, graph data, attachment metadata, revision restore, saved searches, richer filters, portable import/export, sensitive-note policy, and generic local-intelligence requests. The product frontend adds pinned and recent collections plus the candidate settings surface. Optional AI is supplied by separate governed capabilities; core Vault does not execute a provider or send note content remotely.

GreenField sync, share links, media upload binding, generic widgets, revision APIs, and local-intelligence execution are explicitly not claimed by this candidate. They require reusable platform contracts, not Vault-specific host branches.

## Verification

Run:

```sh
pnpm install --frozen-lockfile
pnpm frontend:build
pnpm build
pnpm test
pnpm test:scale
pnpm verify
```

MPS (from `modula-product-standard`):

```sh
pnpm mps verify /path/to/modula-vault-notes
pnpm mps-frontend preview /path/to/modula-vault-notes --path /note/example-note
```

The package consumes `@modula/module-standard`, `@modula/module-validator` and
`@modula/module-sdk` from the external Standard repository. It does not copy
Standard source into this repository.
