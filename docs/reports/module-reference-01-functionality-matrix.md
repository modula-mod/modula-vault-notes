# MODULE-REFERENCE-01 functionality matrix

Vault Notes (`digital.modula.vault-notes`) route and action inventory for the flagship reference module. Classifications below are from source, the compiled Product UI artifact, and the generic host implementations that were read for this mission. They are not live-account or device results.

NATIVE VERIFICATION was not executed. No iOS simulator, Android emulator, or signed-in Greenfield account was run. Do not read a compiled route as a PASS.

## Versions read

| Repository | Role | Commit read |
| --- | --- | --- |
| `modula-mod/modula-vault-notes` | Module under test. Launch tip. | `c9e902e85e63f8846d147a70333f9e93eb3087da` |
| `modula-mod/modula-vault-notes` | Published GitHub release `vault-notes-v2.0.2` | `bd5440278831cf97dfa2a6882125d207af013def` |
| `modula-mod/modula-module-standard` | Module Standard. Tag `mms-v2.1.0`, the pin in `module.manifest.json`. | `d5a99a4bf1dec789b4d96df5182ae3a95a87f3d7` |
| `modula-mod/modula-module-standard` | `main` at the time it was cloned (not the product pin). | `eebf12c7df0583a5051fc584170f7f3a9f6d946c` |
| `modula-mod/modula-latest` | Greenfield host and registry. `main`. | `f4f70bfa761556ce9460cbd7ade2c2dfabf9c38c` |
| `modula-mod/modula-native` | Native ModuleHost. `main`. | `e50fc3916fb4738b7c63b7bed92bef49a8076eb8` |
| `modula-mod/modula-product-standard` | Product UI compiler and MPS verifier. CI pin in `.github/workflows/verify.yml`. | `3d450e87c44816af1be742ecac0b829a72fb1e1f` (named by the workflow; the repository was not readable from this environment) |

Authoritative product contract: `modula.product.json` (MPS 1.0). `modula.module.json` and `module.manifest.json` are Module Standard 2.1 and Greenfield compatibility adapters (`docs/LEGACY-MANIFESTS.md`). Product UI source is `frontend/` compiled to `frontend/frontend.manifest.json` by `@modula/product-ui` from `modula-product-standard`. This module does not ship a second SDK.

This change proposes module version **2.0.3**. It does not publish a release and does not retag `vault-notes-v2.0.2`.

## What would be installed

There are three different "installed" surfaces. They are not the same set of screens.

1. **Declarative Product UI, when a verified frontend is activated.** Native `ModuleRuntimeController.prepare` sets `runtimeKind` to `declarativeProductUI` only when the cached release's `frontendMediaType` is `application/vnd.modula.frontend+json` and `ProductUIDocument.parse` succeeds (`ios/Modula/ModuleRuntime/ModuleRuntimeController.swift`). Greenfield `GreenfieldProductFrontendService.resolve` returns `source: "mps"` only when `greenfield_mps_ingestions` has a row for that release (`services/greenfield-api/src/product-standard/frontend-service.ts`). The artifact for that path is `frontend/frontend.manifest.json`: 22 routes and 22 views.
2. **Legacy module views, when no MPS ingestion exists.** The same Greenfield service returns `source: "legacy"`. `resolveModuleRouteView` (`src/features/modules/runtime/module-route-resolver.ts`) matches only `path[0]` against a view id suffix, then a collection name, then the first dashboard. `modula.module.json` declares 14 views (home, collection, detail, editor, search, favourites, archived, trash, folders, settings, empty, error, pinned, recent). It does not declare tags, templates, daily note, history, revision, attachments, saved searches, graph, folder detail, or tag detail.
3. **Bundled React Native fallback.** `runtime/src/registry/manifests.json` still registers Vault Notes `1.7.0` with `runtime: "react-native"` and `entry: "vault"`. `ModuleSession.runtimeKind` defaults to `bundledReactNative`. `runtime/src/modules/vault/VaultNotes.tsx` states it is a temporary fallback that owns list, create, and edit only. `docs/architecture/host-bridge.md` says the custom Vault surface owns `/`, `/new`, and note/editor state.

No account installation was queried, so this report does not claim which of the three a production account currently activates. The published package identity remains `vault-notes-v2.0.2`.

## Root cause of the subset

The repository declares 22 product routes in `frontend/app/routes.ts`, and the compiled artifact repeats them under `routes`. The installed hosts do not turn that route table, or `navigation.tabs` / `navigation.secondary`, into chrome.

- Native `ProductUIHostView` renders `runtime.currentView` only (`ios/Modula/ModuleRuntime/ProductUIRenderer.swift`). It never reads `navigation`.
- Greenfield `ModuleHost` resolves one URL path with `resolveMpsFrontendRoute` and renders that view (`src/features/modules/runtime/module-host.tsx`). It does not project `frontend.navigation`.
- Product Standard accepts `navigation` as an untyped object (`packages/greenfield-product-standard/src/frontend.ts`, `navigation?: Record<string, unknown>`). Validation does not require a host to render it.

Before this change, the entry view (`NotesScreen`) rendered route.open controls only for New note, Pinned, Favourites, Folders, Tags, Trash, and open-note. Search was a tab. Recent, Archived, Templates, Daily Note, Saved Searches, Attachments, Graph, and Settings existed only in `navigation.secondary`. Revision history and share were declared actions with no control on the note screen. Trash put restore and purge on `recordList.actions`, while the native list dispatcher reads only `recordList.action` (`ProductUIRenderer.recordList`).

That is why a host can compile all 22 routes and still show a short list: Notes, and the five shortcuts on that screen. Parametric screens behind an unlinked parent (history, revision, and anything only reachable from a secondary destination) never become a current view.

A second, independent cut is the compatibility adapter: `module.manifest.json` `contributions.routes` registers five shell paths (`/module/digital.modula.vault-notes`, `/note`, `/folder`, `/search`, `/settings`). Those paths are not the 22 product routes. Legacy resolution cannot see the screens that exist only in the MPS artifact.

## Classification legend

| Token | Meaning in this matrix |
| --- | --- |
| DECLARED | Route exists in `frontend/app/routes.ts` and `frontend/frontend.manifest.json` `routes`. |
| REGISTERED | View id is in the MPS artifact `views` and a route points at it. Adapter registration is called out when it is narrower. |
| REACHABLE | A `route.open` control on an already-reachable view names that route, starting from `entry: home`. Static control graph after this change. Not a runtime click. |
| RENDERED | Not proven. The artifact contains a view. Host renderers have code for the primitives used. No host was executed. |
| INTERACTIVE | Not proven. Actions are bound in the artifact. No host dispatched them. |
| BACKEND-INTEGRATED | The view declares a record, settings, or function binding. No account write was performed. |
| VERIFIED | No. |
| BLOCKED | A host or standard gap still stops the behaviour, or the screen is only partially wired. |

## Route matrix

| Route | View | DECLARED | REGISTERED | REACHABLE | RENDERED | INTERACTIVE | BACKEND-INTEGRATED | VERIFIED | BLOCKED |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | `home` | yes | MPS yes. Adapter view `view.home` yes. Greenfield route yes. | yes, entry | not proven | not proven | `record.query` note, `archived: false`, state `active` | no | no for the list contract. Search on this view is an in-place query, not navigation. |
| `/new` | `newEditor` | yes | MPS yes. Not a Greenfield shell route. | yes, `newNote` on home | not proven | not proven | `record.create` `createNote` | no | Sheet presentation is declared. Native `open` replaces the path; it does not present a sheet. |
| `/note/:noteId` | `detail` | yes | MPS yes. Adapter view `view.detail` yes. Greenfield route is `/note` without an id. | yes, `openNote` on lists | not proven | not proven | `record.detail` note via `noteId` | no | Share depends on host `share`. |
| `/note/:noteId/edit` | `editor` | yes | MPS yes. Adapter view `view.editor` yes. | yes, `editNote` on detail | not proven | not proven | `record.update` `updateNote`, detail binding `noteId` | no | Requires `ui.richText@1`. Offline queue is host-owned. |
| `/note/:noteId/history` | `history` | yes | MPS yes. No adapter view. | yes, `openHistory` on detail | not proven | not proven | `record.query` `note-version`, `filterParam: noteId` | no | Hosts do not apply `filterParam`. See query gap below. |
| `/note/:noteId/history/:revisionId` | `revision` | yes | MPS yes. No adapter view. | yes, `openRevision` on history | not proven | not proven | `record.detail` `note-version` via `revisionId`; `restoreRevision` is `function.invoke` | no | No generic diff/revision browser. Native function runner only performs ids containing `attach`. |
| `/search` | `search` | yes | MPS yes. Adapter view yes. Greenfield route yes. | yes, `openSearch` on home | not proven | not proven | note query, `archived: false`, `searchParam: q` | no | Tab metadata is still not rendered by hosts. The button is the reachable path. |
| `/pinned` | `pinned` | yes | MPS yes. Adapter view yes. Not a Greenfield shell route. | yes, `openPinned` on home | not proven | not proven | note query `pinned: true`, `archived: false` | no | no for the filter contract |
| `/recent` | `recent` | yes | MPS yes. Adapter view yes. | yes, `openRecent` on home | not proven | not proven | same active non-archived note query as home. No recency predicate. | no | Not a distinct recent query. Hosts that sort by `updatedAt` happen to look recent. |
| `/favourites` | `favourites` | yes | MPS yes. Adapter view yes. | yes, `openFavourites` on home | not proven | not proven | note query `favourite: true`, `archived: false` | no | no for the filter contract |
| `/archived` | `archived` | yes | MPS yes. Adapter view yes. | yes, `openArchived` on home | not proven | not proven | note query `archived: true`, state `active` | no | no for the filter contract |
| `/trash` | `trash` | yes | MPS yes. Adapter view yes. | yes, `openTrash` on home | not proven | not proven | note query `recordState: deleted`. `restoreNote` is the row `action`. `purgeNote` is also in `actions`. | no | Native list dispatch ignores `actions`. Purge is not dispatched there. Permanent delete still requires confirmation in the action declaration. |
| `/folders` | `folders` | yes | MPS yes. Adapter view yes. | yes, `openFolders` on home | not proven | not proven | `record.query` folder | no | No create, rename, or delete control in the product frontend. |
| `/folder/:folderId` | `folder` | yes | MPS yes. Adapter has no folder-detail view. Greenfield route `/folder` has no id. | yes, `openFolder` on the folder list | not proven | not proven | folder `record.detail` via `folderId`. Notes use `filterParam: folderId`. | no | Hosts do not apply that filter. Native returns an empty list. Greenfield lists every non-archived note. |
| `/tags` | `tags` | yes | MPS yes. No adapter view. | yes, `openTags` on home | not proven | not proven | `record.query` tag | no | No create or delete control. |
| `/tag/:tagId` | `tag` | yes | MPS yes. No adapter view. | yes, `openTag` on the tag list | not proven | not proven | tag `record.detail` via `tagId`. Notes use `filterParam: tagId`. | no | Same host filter gap as folder. Native's deny list includes `tagId`. |
| `/templates` | `templates` | yes | MPS yes. No adapter view. | yes, `openTemplates` on home | not proven | not proven | `record.query` template. `createFromTemplate` is `function.invoke` on the card, and the list has no row `action`. | no | The selected template id is not a list action parameter. Native does not run this function id. |
| `/daily` | `daily` | yes | MPS yes. No adapter view. | yes, `openDaily` on home | not proven | not proven | `createDailyNote` invokes `note.create-daily`. No record binding. | no | Native `runModuleFunction` rejects ids that do not contain `attach`. |
| `/attachments` | `attachments` | yes | MPS yes. No adapter view. | yes, `openAttachments` on home | not proven | not proven | `record.query` attachment. Form fields `noteId`, `assetId`. `attachToNote` function id contains `attach`. | no | Media picker and gallery capabilities are optional. Bind/reorder/cover lifecycle is not in the screen. |
| `/saved-searches` | `savedSearches` | yes | MPS yes. No adapter view. | yes, `openSavedSearches` on home | not proven | not proven | `record.query` saved-search | no | No create, delete, or apply action. The screen says opening one waits on a host stored-query. |
| `/graph` | `graph` | yes | MPS yes. No adapter view. | yes, `openGraph` on home | not proven | not proven | note and note-link queries plus `ui.graph@1` capability binding | no | `capabilityUnavailable` copy states there is no generic graph renderer. The screen is a status surface. |
| `/settings` | `settings` | yes | MPS yes. Adapter view yes. Greenfield shell route yes. Shell "Module settings" in `ModuleHostScreen` opens host settings, not this route. | yes, `openSettings` on home | not proven | not proven | `settings` binding `vaultNotes.preferences`. `saveSettings` is `settings.update`. | no | Native `settings.update` records the family and does not write settings. Greenfield renders a settings form from the fields. |

Static reachability after this change: 22 of 22 declared routes. That count is the control graph in `frontend/tests/reachability.test.ts`. It is not a rendered PASS.

## Actions and data behaviour

| Area | Evidence | Result |
| --- | --- | --- |
| Create note | `createNote` on `/new`, defaults and `richText.plainText@1` transform in the artifact. | Declared. Not executed against an account. |
| Open note | `openNote` on home, search, and collection lists. | Declared and statically reachable. |
| Edit / save | `updateNote` on `/note/:noteId/edit`. | Declared. Host must supply `ui.richText@1` and the record revision. |
| Trash | `deleteNote` is `record.delete` with `confirm: true`, label "Move to Trash". | Declared on the note toolbar. |
| Restore | `restoreNote` is the trash row `action`. | Declared. Native can dispatch a singular `action`. Not executed. |
| Permanent delete | `purgeNote` is `record.purge` with `confirm: true`, on trash `actions`. | Declared. Native list code does not read `actions`. |
| Share | `shareNote` is on the note toolbar. | Declared. Host share implementation was not executed. |
| Settings | Grouped fields match `schemas/vault-settings.v1.schema.json` keys used by the screen. `saveSettings` is bound. | Read/write is host-dependent. Native persistence is not implemented. |
| Search, filter, sort | Home and search compile `search`, `sort`, and `filterParam`. Scalar filters exist for pinned, favourite, archived. | Nested property and reference filters are documented as outside the generic query contract (`frontend/features/notes/filters.ts`). |
| Folders, tags, collections | List and detail routes exist. Pinned, favourites, archived, and trash are filtered collections. | Create/rename/delete for folders and tags are in the Module Standard adapter actions, not in the product frontend. |
| Templates | Template list and `createFromTemplate`. Daily screen and `createDailyNote`. | Function invocation is host-blocked as noted above. |
| Attachments | Metadata form and list. | File bytes stay host-owned. |
| Revisions | History and revision routes, restore action, append-only copy. | Unscoped query plus missing diff UI. |
| Loading, empty, error, offline, permission | Collection screens declare those states through `collectionStates`. Note, editor, settings, daily, graph, and revision declare their own. | Copy is in the artifact. Hosts decide which state they set. Not executed. |
| Permissions | `modula.module.json` requests record read/write/delete, settings read/write, search publish, events, and export. `module.manifest.json` requests the matching record scopes. | Declarations only. No grant was exercised. |
| Install, enable, disable, update, uninstall | `modula.module.json` `lifecycle.allowedTransitions` and `uninstall.requiresConfirmation`. | Packaging contract only. No registry install was performed. |
| Immutable release | Published tag `vault-notes-v2.0.2` was not moved. This branch is 2.0.3. | `main` at `c9e902e` still named source commit `4543b28147a943741756724671194bf64d6aafa6` after later `src/` and `schemas/` edits, so `pnpm verify` failed that check. This branch points product, Module Standard, and Greenfield provenance at the commit that contains the 2.0.3 frontend. |
| Native vs web | Both hosts consume the same artifact and both ignore `navigation`. Web Greenfield pushes routes with Expo Router, so system back can return. Native `ProductUIRuntime.open` replaces `route` and does not keep a stack. | The Notes control is the module-side path back on a replace-style host. |

## Defects by owner

### Module defects fixed here

- Static routes other than the original home shortcuts were not rendered as `route.open` controls, so hosts that ignore `navigation` could not open them.
- Note detail did not bind `openHistory` or `shareNote`, so revision routes were unreachable.
- Non-entry screens had no rendered return to `/`. Native route replacement cannot pop.
- Trash restore lived only on `recordList.actions`. The native dispatcher reads `recordList.action`.

### Module defects still open

- `/recent` is not a different query from the active note list.
- Folder and tag screens cannot express a route-parameter filter in a form either host applies. Removing `filterParam` would show the wrong notes. The screens now say the list depends on the host filter.
- Folder, tag, template, and saved-search creation are not product-frontend actions.
- Saved searches cannot be applied.
- `createFromTemplate` is not a list row action carrying the template id.
- Compatibility adapters still publish 14 views and 5 shell routes. They are not a second product UI and were not expanded into a parallel screen system.

### Generic host defects (not changed from this launch)

- Native and Greenfield ModuleHost do not render `navigation.tabs` or `navigation.secondary`.
- Native `ProductUIRuntime.open` replaces the route and does not implement `backBehavior: "host"` as an in-module pop (`ProductUIRuntime.swift`).
- Native `visibleRecords` returns `[]` when `filterParam` is `folderId`, `tagId`, `references`, or `relatedTo` (`ProductUIRuntime.swift`).
- Greenfield `queryFor` keeps only literal `filters` and drops `filterParam` (`mps-frontend-adapter.ts`). The record query then cannot scope a folder, tag, or note's revisions.
- Native record lists dispatch `node.action` only.
- Native `settings.update` does not call a settings API. `runModuleFunction` rejects function ids that do not contain `attach`.
- Greenfield form and settings layout drops plain buttons (`adaptLayout` `suppressFormControls`). Toolbar actions are preserved. Editor return uses a button so the editor stays free of a formatting toolbar; Greenfield system back is the return path on that screen.
- Bundled `VaultNotes.tsx` is still the runtime when no verified Product UI frontend is cached. It is a host fallback, not this module's declarative UI.
- `resolveModuleRouteView` only inspects the first path segment of legacy views.

### Standard defects

- `navigation` is an opaque object in the Greenfield product-standard frontend type. Hosts can ignore it and still validate.
- `filterParam` is accepted on a record query and is not a required route-parameter binding in the host adapter.
- Product UI compiler authority is `modula-product-standard` at the CI pin above. This environment could not read that repository, so the artifact was updated to the compiler's existing JSON shape (alphabetically sorted keys, `JSON.stringify` indent 2, which round-trips the current file). CI rebuilds the artifact and will show any byte mismatch.

## Fixes in this change

- `LibraryNav` on Notes exposes Search, Recent, Archived, Templates, Daily Note, Saved Searches, Attachments, Graph, and Settings.
- `ReturnHome` (`openHome` → `/`) is on every other screen. Editor and new-note use a button. Other screens use a toolbar, which Greenfield still shows when it strips in-form buttons.
- Note toolbar adds Notes, Revision history, and Share beside Edit and Move to Trash.
- Trash row `action` is `restoreNote`, and `actions` still includes restore and purge.
- Folder, tag, history, and saved-search screens state the host limit instead of claiming an empty collection or a working open.
- `frontend/tests/reachability.test.ts` fails if a declared route is absent from the entry control graph, if a tab or secondary destination is missing from Notes, if a non-entry view has no Notes action, or if history, share, and trash restore are unbound.
