# Vault Notes

Canonical source repository for `digital.modula.vault-notes`.

There is one Vault Notes product. This GitHub repository name does not have to
equal the module ID.

Vault Notes is the first complete independently versioned module for Modula
Module Standard 1.2. It proves the Standard outside the main app through an
external repository, immutable release package, Greenfield registry import,
generic record persistence and declarative module host rendering.

## Identity

- product: Vault Notes
- module ID: `digital.modula.vault-notes`
- publisher: Modula
- slug: `vault-notes`
- module version: `1.1.0`
- standard version: `1.2.0`
- manifest schema version: `1.2.0`
- data schema version: `1.0.0`
- current tag: `vault-notes-v1.1.0`

Legacy module ID `modula.vault-notes` is a migration alias only. It must not
appear as a second Product Hub product.

Legacy source `modula-mod/modula-module-vault-notes` is archive/redirect only.

## Scope

Vault Notes 1.1 supports notes, folders, tags, structured documents, optimistic
revision updates, soft delete, restore, permanent delete, archive, pin,
favourite, duplicate, export, diagnostics, settings, search projection
metadata, and optional provider-neutral AI product actions.

## Verification

Run:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm verify
```

The package consumes `@modula/module-standard`, `@modula/module-validator` and
`@modula/module-sdk` from the external Standard repository. It does not copy
Standard source into this repository.
