# SDK extraction candidates

These are generic platform candidates, not permission to hide shared primitives in Vault or branch on `digital.modula.vault-notes`.

| Candidate | Vault use | Other module uses | Prototype status | Required API | Recommendation |
| --- | --- | --- | --- | --- | --- |
| `RichDocumentEditor` | note editing | Tasks descriptions, CRM notes, Mail drafts | capability request only | versioned document value, selection, commands, validation, dirty/save/conflict state, accessibility | P0 after neutral fixture |
| `EditorToolbar` | marks/lists/links/callouts/tables | every rich-content product | typed command requests | selection-aware command registry, enablement, shortcuts, adaptive placement | include in document editor contract |
| `PropertyEditor` | typed note properties | CRM fields, databases, Tasks metadata | status/display prototype | schema-driven text/number/boolean/date/select/tags/url/reference inputs | P1 shared primitive |
| `ReferencePicker` | `[[note]]` links | Tasks dependencies, CRM relationships | capability request only | scoped query, label/ID result, autocomplete, permission-safe resolution | P1 shared primitive |
| `AttachmentGallery` | image/PDF/audio/file list | CRM evidence, Tasks files, Mail attachments | metadata/media prototype | authorized refs, bind/unbind, upload state, reorder, cover, preview adapters | P1 with media binding |
| `RevisionBrowser` | list/view/restore checkpoints | any editable record module | screen/component prototype | paged revisions, diff model, restore with current-revision precondition | P1 after history API |
| `Graph` | note-reference network | CRM relationships, Tasks dependencies | data/status prototype | bounded nodes/edges, actions, limits, accessible list fallback | P2 visualization |
| `RecordTable` | property-oriented note view | CRM, inventory, projects | projection contract only | typed columns, pagination, sort/filter, responsive policy | P1/P2 primitive |
| `RecordBoard` | group notes by property/folder/tag | Tasks status, CRM pipeline | projection contract only | grouping, paged lanes, bounded reorder | P1/P2 primitive |
| `CommandMenu` | note/editor actions | all substantial modules | not prototyped | searchable actions, context, permissions, shortcuts, accessibility | P2 primitive |

Vault-owned components that remain module-local: `NoteRow`, `NoteCard`, `NotePreview`, `NoteMetadata`, `SensitiveBadge`, `FolderRow`, `TagChip`, `TemplateCard`, `RevisionRow`, `SearchResultRow`, and `EmptyVault`.
