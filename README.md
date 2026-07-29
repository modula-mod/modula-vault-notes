# Vault Notes

Vault Notes is the first complete independently versioned module for Modula
Module Standard 1.0. It proves the Standard outside the main app through an
external repository, immutable release package, Greenfield registry import,
generic record persistence and declarative module host rendering.

## Identity

- module ID: `modula.vault-notes`
- slug: `vault-notes`
- module version: `1.0.0`
- standard version: `1.0.0`
- manifest schema version: `1.0.0`
- data schema version: `1.0.0`

## Scope

Vault Notes 1.0 supports notes, folders, tags, structured documents, optimistic
revision updates, soft delete, restore, permanent delete, archive, pin,
favourite, duplicate, export, diagnostics, settings and search projection
metadata. AI, automations, DIMON, connectors, collaborative editing and
end-to-end encryption claims are deferred.

## Verification

Run:

```sh
pnpm install
pnpm verify
pnpm release:package
```

The package consumes `@modula/module-standard`, `@modula/module-validator` and
`@modula/module-sdk` from the external Standard 1.0 repository. It does not copy
Standard source into this repository.
