# Vault Notes frontend architecture

## Purpose

Vault Notes is authored as a substantial product inside the bounded `@modula/product-ui` language. The compiler follows product-local imports and emits one deterministic declarative artifact; ModuleHost never depends on the source directory layout and no React, React Native, web framework, CSS, executable bundle, or Vault-specific host branch is introduced.

Before FLAGSHIP-01R, `frontend/index.tsx` held actions, bindings, screens, routes, states, navigation, settings, and registration in 248 lines. It is now a 29-line registration boundary. The architecture guard reports 83 reachable non-test source files, all under 500 lines.

## Entrypoint and composition

- `frontend/index.tsx`: imports bounded declarations, calls `defineFrontend`, and exports what ModuleHost consumes.
- `frontend/app/VaultApp.tsx`: composes the screen registry.
- `frontend/app/routes.ts`: composes routes from `frontend/lib/routes.ts`.
- `frontend/app/actions.ts`: composes the frontend action registry.
- `frontend/app/navigation.ts`: owns Vault tabs, secondary destinations, and settings placement.
- `frontend/app/context.ts`: owns host range, capabilities, platforms, and accessibility declarations.

Internal components are private. Distribution remains `frontend/frontend.manifest.json`.

## Routes and screens

The artifact contains 22 routes and 22 screens:

- `/`, `/new`, `/note/:noteId`, `/note/:noteId/edit`
- `/note/:noteId/history`, `/note/:noteId/history/:revisionId`
- `/search`, `/pinned`, `/recent`, `/favourites`, `/archived`, `/trash`
- `/folders`, `/folder/:folderId`, `/tags`, `/tag/:tagId`
- `/templates`, `/daily`, `/attachments`, `/saved-searches`, `/graph`, `/settings`

Each data-bound screen declares applicable loading, empty, error, permission-denied, offline, or capability-unavailable states. Empty-state copy remains product-specific.

## Responsibility boundaries

`frontend/screens/` binds routes to feature composition. It does not reimplement domain behavior.

`frontend/components/` owns Vault semantics: note rows/cards/previews, metadata, folders, tags, attachments, templates, revisions, search results, sensitive status, and empty states.

`frontend/features/` owns presentation-specific composition:

- `editor`: form bindings, document fields, toolbar requests, and save composition;
- `notes`: route/record actions and query/filter/sort requirements;
- `search`: controls, filter/sort composition, and privacy copy;
- `templates`: picker and reviewed template/Daily Note function actions;
- `properties`: typed-property display and generic editor capability request;
- `attachments`: metadata, authorized preview, picker, and attach actions;
- `history`: revision list/preview and append-only restore request;
- `links`: backlinks and deterministic related-note surfaces;
- `intelligence`: provider-neutral local capability requests and fail-closed privacy copy;
- `graph`: graph data contract and renderer capability state;
- `projections`: generic table/board projection requirements.

`frontend/hooks/` contains declarative binding factories. `src/` remains authoritative for templates, migration, document validation, search logic, revisions, import/export, intelligence policy, and record behavior.

## Editor boundary

`features/editor/Editor.tsx` owns the form, document field, organization, properties, attachments, privacy, intelligence policy, and save action. `EditorToolbar.tsx` requests generic formatting operations through optional capabilities. Vault does not implement selection state, document transforms, or a private renderer.

Dirty-state lifecycle, autosave status, `expectedRevision`, selection-aware enablement, dynamic typed-property rows, reference autocomplete, and inline attachment placement remain generic contract gaps.

## Product UI support matrix

| Area | Status | Evidence |
| --- | --- | --- |
| stack/row/section/grid/scroll | SUPPORTED | compiled semantic layout and responsive declarations |
| collection/detail/forms | SUPPORTED | record list/detail/form bindings and 22 valid screens |
| search/filter/sort | SUPPORTED-WITH-LIMITATIONS | scalar host query contract; nested properties/references are not expressible |
| tabs/navigation | SUPPORTED-WITH-LIMITATIONS | app navigation works; in-screen tab items/state are not typed |
| menus/context menu | SUPPORTED-WITH-LIMITATIONS | menu primitive exists; contextual anchors/items/selection state do not |
| rich editor | SUPPORTED-WITH-LIMITATIONS | `richText` field exists; command/selection/document APIs are missing |
| editor toolbar | MISSING | no selection-aware generic toolbar contract |
| property grid/editor | MISSING | display works; dynamic typed editors and numeric input are absent |
| attachment gallery | MISSING | metadata/media nodes exist; bind/reorder/cover/gallery lifecycle is absent |
| graph | MISSING | data bindings compile; generic bounded renderer is absent |
| table/board | MISSING | projection requirements exist; render/group primitives are absent |
| command palette | MISSING | no command registry/search/presentation primitive |
| reference autocomplete | MISSING | record-reference fields exist; inline editor autocomplete does not |
| revision browser/diff | MISSING | screens are ready; generic history binding/diff UI is absent |

## Capability detection and compatibility

`ui.richText@1` remains required. Formatting commands, reference picker, property editor, attachment gallery/media picker, revision browser, graph, table, board, local intelligence, and native sharing are optional.

The current `>=1.0.0 <2.0.0` host range remains honest because missing advanced facilities degrade to status/unavailable surfaces rather than blocking bootstrap. Increase the minimum only when an extracted primitive becomes required.

Product-ui can bind capability status but cannot conditionally prune arbitrary child trees. Hosts must consistently disable unavailable capability actions; richer conditional composition is an SDK gap.

## Import direction and guard

Dependencies flow from screens to features/components/hooks, then to product-ui bindings or domain function identifiers. Presentation never imports `src/` implementation code; business logic remains in the packaged domain library.

`scripts/verify-frontend-architecture.mjs` enforces a registration-only entrypoint, complete source reachability, review over 500 lines, and no raw UI-framework or CSS imports.

## Testing

Six frontend suites inspect the compiled artifact for routes, navigation, list/detail composition, editor parity and commands, search/filter/sort, templates/Daily Note, properties, attachments, history, graph states, settings, permissions, errors, capability declarations, and compatibility. Tests exercise what ModuleHost receives rather than executing compiler-only TSX.

## Future extraction

Generic candidates and APIs are recorded in `docs/audits/sdk-extraction-candidates.md`. Extraction requires a neutral non-Vault fixture and host implementations.
