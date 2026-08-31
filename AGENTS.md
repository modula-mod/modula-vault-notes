# Vault Notes — agent instructions

This repository is a **Modula product**, not Greenfield core.

## Identity

- Product name: Vault Notes
- Canonical product ID: `digital.modula.vault-notes` (immutable; already published)
- Family: `digital.modula.vault` (root). Do not infer family from the word “Vault”.
- MPS version: **1.0**
- Module Standard profile: **2.1**
- Greenfield protocol: `greenfield.v1`
- Authoritative manifest: `modula.product.json`

`modula.module.json` and `module.manifest.json` are Module Standard 2.1 / Greenfield compatibility adapters for already-published pre-MPS releases. Do not treat them as a second source of truth. Do not invent a second product ID.

Legacy aliases `modula.vault-notes`, `modula.module.vaultNotes`, and `module-vault-notes` resolve to this product. They must not create a second registry entry.

## Architecture

- Frontend mode: `declarative` (no arbitrary remote JS)
- Backend mode: `greenfield-records` (no dedicated product service)
- Storage: Greenfield-hosted records only
- Provider role: `notes.provider` (non-exclusive; Reference Notes may coexist)
- Extension points use MPS grammar `{productId}/{pointName}@{major}`

Do **not** add Greenfield core special cases for this product. New behaviour belongs here or in a family add-on/plugin.

## Security

- No secrets in Git, manifests, artifacts, or logs
- No raw user bearer forwarding
- No cross-product database access
- Permanent delete requires confirmation
- Cross-account reads are release-blocking defects

## Release

Create a new immutable version for packaging changes. Do not mutate `vault-notes-v1.3.0` or earlier tags.

Product-specific UI belongs under `frontend/` and compiles to the validated MPS artifact. Do not implement Vault Notes screens in `modula-latest`; it owns only the generic Shell, Product Host, semantic renderer, and native capability adapters.

Presentation assets in this tree are **provisional / first-party generated**, not founder-approved final branding. Do not mark them as public-stable artwork.

## Verification

```sh
pnpm install --frozen-lockfile
pnpm verify
# From modula-product-standard:
pnpm mps verify /path/to/modula-vault-notes
```

`pnpm mps verify --public` is expected to fail while development artwork remains.
