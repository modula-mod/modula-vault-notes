# Vault Notes

Vault Notes is an offline-capable core module and a governed extension host. It works without optional products. AI, voice, formatting, automation, connectors, functions, tools, and widgets attach through declared Modula Module Standard 2.1 extension points and capability grants; they do not import Vault Notes internals or access its database directly.

Canonical source repository for `digital.modula.vault-notes`.

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
- module version: `1.6.0`
- product standard: MPS 1.0 (`modula.product.json` is canonical)
- standard version: `2.1.0`
- manifest schema version: `2.1.0`
- data schema version: `1.0.0`
- current immutable release: `vault-notes-v1.6.0`
- product-owned frontend source: typed TSX compiled to a validated artifact (immutable release lines; earlier tags are never mutated)

Legacy module ID `modula.vault-notes` is a migration alias only. It must not
appear as a second Product Hub product.

Legacy source `modula-mod/modula-module-vault-notes` is archive/redirect only.

## Scope

Vault Notes 1.6 supports notes, folders, tags, structured documents, optimistic
revision updates, soft delete, restore, permanent delete, archive, pin,
favourite, duplicate, export, diagnostics, settings, search projection
metadata, versioned events, and governed extension points. Optional AI is supplied by the separate Vault AI add-on.

## Verification

Run:

```sh
pnpm install --frozen-lockfile
pnpm frontend:build
pnpm build
pnpm test
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
