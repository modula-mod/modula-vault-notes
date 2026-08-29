# Privacy

Vault Notes stores user-authored notes, folders, tags, links, versions, and saved-source references as **Greenfield-hosted, account-scoped records**.

| Topic | Truth |
| --- | --- |
| Data accessed | Notes the account owner creates or opens |
| Data created | Notes, folders, tags, links, versions, saved-source metadata |
| Network | None by default |
| Backend | Greenfield records only; no product-owned service |
| Transmission | None by default. Optional family add-ons (AI/Voice) declare their own processors |
| Retention | Until uninstall `deleteData` or account deletion. Uninstall may `keepData` |
| Export | JSON export via Greenfield |
| Deletion | Soft delete, restore, confirmed permanent delete; uninstall delete-data; account deletion |
| Analytics / telemetry | None |
| Cross-account | Forbidden |

Ordinary events, diagnostics, and logs must not include complete note content.
