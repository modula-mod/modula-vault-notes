# Privacy

Vault Notes stores user-authored notes, folders, tags, links, versions, attachment metadata, templates, saved searches, typed properties, and saved-source references as **Greenfield-hosted, account-scoped records**.

| Topic | Truth |
| --- | --- |
| Data accessed | Notes the account owner creates or opens |
| Data created | Notes, folders, tags, links, versions, attachment metadata, templates, saved searches, properties, saved-source metadata |
| Network | None by default |
| Backend | Greenfield records only; no product-owned service |
| Transmission | None by default. Sensitive notes require local-only intelligence. Optional capabilities declare their own processors and permissions |
| Retention | Until uninstall `deleteData` or account deletion. Uninstall may `keepData` |
| Export | Versioned JSON backup, Markdown, plain text, and archive layouts; no credentials or signing material |
| Deletion | Soft delete, restore, confirmed permanent delete; uninstall delete-data; account deletion |
| Analytics / telemetry | None |
| Cross-account | Forbidden |

Ordinary events, diagnostics, and logs must not include complete note content.
Attachment records contain opaque asset IDs and metadata only; arbitrary filesystem paths are rejected.
