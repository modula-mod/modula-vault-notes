# Document Format

Vault Notes does not store only HTML or Markdown. Notes use a portable document
model:

```ts
interface VaultStructuredDocument {
  schemaVersion: "1.0.0";
  blocks: VaultDocumentBlock[];
}
```

Supported block types are paragraph, heading, bullet-list, numbered-list,
checklist, quote, code, divider, callout, link-preview, image-reference and
file-reference. Supported inline marks are bold, italic, strikethrough, code and
link.

Every block has a stable block ID. Unknown blocks render as unsupported content
instead of crashing. Malformed blocks, unsafe URLs, oversized documents and
excessive nesting fail validation.
