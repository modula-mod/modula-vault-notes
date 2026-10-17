# Vault Notes 2.0 ModuleHost integration

Candidate: `2.0.0-rc.2` at `12f12e96af83ce66ba7ac737ce344a6282acef84`.
Published main remains `1.8.0` at `d45190e1f47c6802c5f15797a4abb36fa6bfdbe4`.

## Provenance

The flagship candidate binds:

- implementation commit in product/module manifests: `ba88b7e3249a1daf5588800d77742c0876f77427`
- release checkout / `releaseCommit`: `12f12e96af83ce66ba7ac737ce344a6282acef84`

That split is intentional (preview assembly vs provenance bind) and must not be overwritten in place. A changed artifact requires a new RC identity.

`2.0.0` stable publication stays blocked.

## Runtime

Vault 2.0 is a declarative MPS frontend. It runs through the generic Native ModuleHost Product UI renderer. There is no Vault-specific Swift branch.

Required host: `>=1.0.0` and `ui.richText@1`. The host now advertises both.

Signing remains an offline production step. This branch does not print or relocate the Ed25519 key.
