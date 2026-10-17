# Vault Notes 2.0 private preview evidence

This evidence is for the local `2.0.0` candidate. The product surface is
labelled **Vault Notes 2.0**, while its technical release identity remains the
pre-release `2.0.0`. It is not signed, registered, published, or installed
in production, and it does not replace `digital.modula.vault-notes@1.8.0`.

The preview server binds only to `127.0.0.1`, loads the compiled declarative
Product UI artifact, rejects any artifact whose product or release identity is
not the expected candidate, and uses synthetic content. It has no external
network references or credentials.

## Demonstrated surfaces

- `01-vault-home-rich-note.png`: workspace, note list, rich hero note, semantic
  editor toolbar, tags, references, and frozen-contract narrative.
- `02-properties.png`: typed properties and local intelligence actions.
- `03-backlinks.png`: generic record relationships with field paths.
- `04-search.png`: generic projected search with explicit authoritative access
  check semantics.
- `05-revision-browser.png`: immutable history, comparison, and append-only
  restore semantics.
- `06-attachments.png`: images, documents, PDF, audio, and JSON media metadata.
- `07-graph.png`: generic relationship graph with inaccessible/deleted records
  omitted.
- `08-command-menu.png`: compact keyboard-driven command surface.

## Product UI contract coverage

The candidate requires `ui.richText@1` and declares optional use of
`ui.richText.commands@1`, `ui.reference-picker@1`, `ui.property-editor@1`,
`ui.attachment-gallery@1`, `media.picker@1`, `ui.revision-browser@1`,
`ui.graph@1`, `ui.table@1`, `ui.board@1`, `ui.local-intelligence@1`, and
`share.native@1`. The compiled artifact contains 22 routes and 22 views.

On the VPS, a `localOnly` intelligence request without a Native host is shown as
`CAPABILITY_UNAVAILABLE`; the preview does not fake execution or fall back to a
remote provider.

## Reproduce

```sh
pnpm frontend:build
pnpm preview:verify
pnpm preview
```

Open `http://127.0.0.1:4178` locally on the VPS or through an SSH tunnel. Do not
bind the preview to a public interface.

## Screenshot SHA-256

```text
98ffe18fbe6058036cf9a3740bc9b6f3ebd4bf78696d8a33c6291266265c5d79  01-vault-home-rich-note.png
98ffe18fbe6058036cf9a3740bc9b6f3ebd4bf78696d8a33c6291266265c5d79  02-properties.png
a4be9512ef3b8384e224cf979294176b4b211f1852260b639e1a1547aef3766c  03-backlinks.png
9e02865521daf2f30b2da8d0db0d220379fec244aed5a3ce29e1814ae6f7f486  04-search.png
b6f7544526e007e6558f61ef130a0cbfc22b624a77950a4c5f19418c4370e6e0  05-revision-browser.png
8a1ca64db6854c6b85f5cffc23017662909b821b086bd21f1895758215f0b8b7  06-attachments.png
6200b2a1b5804c340483a87d1eddf0e3e3c63a82bfdc442128b809f83a43b806  07-graph.png
08f23b9b531f14f99dbcde5e38e97be747ac6703834eb79623aa0063b7156877  08-command-menu.png
```

The two first screenshots intentionally contain the same default Properties
state: the first is the whole home/hero composition and the second is the
explicit Properties acceptance capture.
