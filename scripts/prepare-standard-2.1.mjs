#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs'
import {createDefaultModuleSectionVersions, manifestChecksum} from '@modula/module-standard'

const productId = 'digital.modula.vault-notes'
const extensionPoints = [
  {id: `${productId}.home.section`, title: 'Vault Notes home section', contributionKinds: ['home.section', 'widget'], maxContributions: 20},
  {id: `${productId}.editor.toolbar`, title: 'Vault Notes editor toolbar', contributionKinds: ['toolbar.action'], requiredCapability: 'notes.editor.contribute', maxContributions: 20},
  {id: `${productId}.editor.command`, title: 'Vault Notes editor commands', contributionKinds: ['editor.command'], requiredCapability: 'notes.editor.contribute', maxContributions: 40},
  {id: `${productId}.editor.attachment`, title: 'Vault Notes editor attachments', contributionKinds: ['editor.attachment'], requiredCapability: 'notes.attachments.create', maxContributions: 20},
  {id: `${productId}.note.actions`, title: 'Vault Notes note actions', contributionKinds: ['menu.item'], requiredCapability: 'notes.actions.contribute', maxContributions: 40},
  {id: `${productId}.note.context-menu`, title: 'Vault Notes note context menu', contributionKinds: ['contextMenu.item'], requiredCapability: 'notes.actions.contribute', maxContributions: 40},
  {id: `${productId}.note.inspector`, title: 'Vault Notes note inspector', contributionKinds: ['view.section', 'record.decorator'], maxContributions: 20},
  {id: `${productId}.note.after-save`, title: 'Vault Notes after-save actions', contributionKinds: ['background.action'], requiredCapability: 'notes.events.subscribe', maxContributions: 20},
  {id: `${productId}.collection.actions`, title: 'Vault Notes collection actions', contributionKinds: ['menu.item'], requiredCapability: 'notes.actions.contribute', maxContributions: 20},
  {id: `${productId}.search.provider`, title: 'Vault Notes search providers', contributionKinds: ['search.provider'], requiredCapability: 'notes.search', maxContributions: 10},
  {id: `${productId}.composer.tool`, title: 'Vault Notes composer tools', contributionKinds: ['composer.tool'], maxContributions: 20},
  {id: `${productId}.settings.section`, title: 'Vault Notes settings sections', contributionKinds: ['settings.section'], maxContributions: 20},
]

const extensionProduct = moduleVersion => ({
  version: moduleVersion,
  kind: 'module',
  targets: [],
  extensionPoints,
  contributions: [],
  retention: {defaultMode: 'KEEP_DATA', supportsUserChoice: true, metadataNamespace: productId},
  graphPolicy: {maxDepth: 8, maxNodes: 128},
})

const standard = readJson('modula.module.json')
const requestedVersion = process.argv[2]
const requestedCommit = process.argv[3]
if (requestedVersion) standard.moduleVersion = requestedVersion
standard.schemaVersion = '2.1.0'
standard.standardVersion = '2.1.0'
standard.manifestSchemaVersion = '2.1.0'
standard.description = 'Offline-capable reference notes module exposing governed extension points under Modula Module Standard 2.1.'
standard.compatibility.standard = '^2.1.0'
standard.sectionVersions = createDefaultModuleSectionVersions('2.1.0')
standard.permissions = standard.permissions.filter(permission => !permission.id.startsWith('ai.'))
standard.capabilities = standard.capabilities.filter(capability => capability.id !== 'ai')
standard.ai = []
standard.records = upsertStandardRecords(standard.records)
standard.settings[0].schema = readJson('schemas/vault-settings.v1.schema.json')
standard.settings[0].defaults = vaultSettingsDefaults()
for (const declaration of flagshipFunctionDeclarations()) {
  const functionIndex = standard.functions.findIndex(item => item.id === declaration.function.id)
  if (functionIndex === -1) standard.functions.push(declaration.function)
  else standard.functions[functionIndex] = declaration.function
  const actionIndex = standard.actions.findIndex(item => item.id === declaration.action.id)
  if (actionIndex === -1) standard.actions.push(declaration.action)
  else standard.actions[actionIndex] = declaration.action
}
for (const view of [
  {id: `${productId}.view.pinned`, type: 'collection', title: 'Pinned notes', permissions: ['module.records.read'], layout: {viewKey: 'vault-notes.pinned', sections: ['notes']}},
  {id: `${productId}.view.recent`, type: 'collection', title: 'Recently edited', permissions: ['module.records.read'], layout: {viewKey: 'vault-notes.recent', sections: ['notes']}},
]) if (!standard.views.some(item => item.id === view.id)) standard.views.push(view)
for (const capability of [
  {id: 'imports', required: false, reason: 'Import portable Markdown, plain text, and Vault backups.', degradedBehavior: 'Import remains available only through module helpers.'},
  {id: 'history', required: false, reason: 'List and restore immutable note checkpoints.', degradedBehavior: 'Writes remain revision-safe but history cannot be browsed through the host.'},
  {id: 'offline', required: false, reason: 'Declare offline intent without claiming a sync runtime.', degradedBehavior: 'The module remains online-only.'},
  {id: 'sync', required: false, reason: 'Adopt a future generic cursor and tombstone contract.', degradedBehavior: 'No background synchronization is advertised.'},
  {id: 'widgets', required: false, reason: 'Expose quick capture and note collections after a generic widget registry exists.', degradedBehavior: 'Vault Notes remains route-only.'},
]) if (!standard.capabilities.some(item => item.id === capability.id)) standard.capabilities.push(capability)
standard.exports = {version: '2.1.0', items: [{id: `${productId}.export.portable`, title: 'Portable Vault export', formats: ['json', 'markdown', 'plain-text', 'zip']}]}
standard.imports = {version: '2.1.0', items: [{id: `${productId}.import.markdown`, title: 'Markdown import'}, {id: `${productId}.import.plain-text`, title: 'Plain-text import'}, {id: `${productId}.import.vault-backup`, title: 'Vault backup import'}]}
standard.synchronization = {version: '2.1.0', items: [], metadata: {status: 'blocked-by-platform', requires: ['record.changeFeed', 'record.clientMutationId', 'record.tombstones']}}
standard.widgetRegistry = {version: '2.1.0', items: [], metadata: {status: 'blocked-by-platform'}}
standard.offline = {version: '2.1.0', capable: false, syncStrategy: 'none'}
standard.versioning = {version: '2.1.0', moduleVersion: standard.moduleVersion, standardVersion: '2.1.0', schemaVersion: '1.0.0', manifestVersion: '2.1.0', runtimeVersion: '1.0.0'}
// Module Standard 2.1 has no dedicated RC channel; prerelease candidates use beta.
standard.release.channel = 'beta'
standard.release.reviewStatus = 'in-review'
standard.extensionProduct = extensionProduct(standard.moduleVersion)
if (requestedCommit) standard.release.commitSha = requestedCommit
writeJson('modula.module.json', standard)

const greenfield = readJson('module.manifest.json')
if (requestedVersion) greenfield.version = requestedVersion
greenfield.manifestVersion = 2
greenfield.standardVersion = '2.1.0'
greenfield.sectionVersions = createDefaultModuleSectionVersions('2.1.0')
greenfield.description = 'Offline-capable Vault Notes core with governed extension points and no embedded optional add-ons.'
greenfield.permissions = greenfield.permissions.filter(permission => !permission.permission.startsWith('ai.'))
delete greenfield.ai
if (greenfield.extensions) delete greenfield.extensions.ai
greenfield.contributions.schemas = upsertGreenfieldSchemas(greenfield.contributions.schemas)
greenfield.contributions.functions = upsertGreenfieldFunctions(greenfield.contributions.functions)
greenfield.permissions = upsertGreenfieldPermissions(greenfield.permissions)
if (greenfield.contributions.settings?.[0]) greenfield.contributions.settings[0].schemaRef = 'schemas/vault-settings.v1.schema.json'
greenfield.extensionProduct = extensionProduct(greenfield.version)
if (requestedCommit) greenfield.source.commit = requestedCommit
if (requestedVersion) {
  greenfield.source.releaseTag = `vault-notes-v${requestedVersion}`
  greenfield.source.releaseAssetName = `modula-vault-notes-${requestedVersion}.tgz`
  const marketplaceRelease = greenfield.extensions?.marketplace?.release
  if (marketplaceRelease) {
    marketplaceRelease.publishedAt = '2026-08-24T00:00:00.000Z'
    marketplaceRelease.sizeBytes = null
    marketplaceRelease.notes = [
      'Exposes governed Standard 2.1 extension points while Vault Notes remains fully standalone.',
      'Moves optional AI out of Vault Notes core into the separately versioned Vault AI add-on.',
      'Publishes versioned note and collection events for capability-authorised subscribers.',
    ]
    marketplaceRelease.source = {provider: 'github-release', tag: `vault-notes-v${requestedVersion}`, asset: `modula-vault-notes-${requestedVersion}.tgz`}
  }
  if (greenfield.extensions?.standard) {
    greenfield.extensions.standard.standardVersion = '2.1.0'
    greenfield.extensions.standard.manifestSchemaVersion = '2.1.0'
    greenfield.extensions.standard.standardReleaseTag = 'mms-v2.1.0'
    greenfield.extensions.standard.standardReleaseCommit = 'd5a99a4bf1dec789b4d96df5182ae3a95a87f3d7'
  }
  if (greenfield.extensions?.marketplace) {
    greenfield.extensions.marketplace.availableViewIds = Array.from(new Set([...(greenfield.extensions.marketplace.availableViewIds ?? []), `${productId}.view.pinned`, `${productId}.view.recent`]))
    greenfield.extensions.marketplace.offlineSupport = {state: 'declared', value: false}
    greenfield.extensions.marketplace.syncSupport = {state: 'declared', value: false}
  }
}
if (greenfield.extensions) greenfield.extensions.settingsDefaults = vaultSettingsDefaults()
greenfield.contributions.events = [
  {id: `${productId}.events.note-created-v1`, title: 'Note created', eventType: 'vault.note.created.v1', direction: 'emits'},
  {id: `${productId}.events.note-updated-v1`, title: 'Note updated', eventType: 'vault.note.updated.v1', direction: 'emits'},
  {id: `${productId}.events.note-deleted-v1`, title: 'Note deleted', eventType: 'vault.note.deleted.v1', direction: 'emits'},
  {id: `${productId}.events.note-archived-v1`, title: 'Note archived', eventType: 'vault.note.archived.v1', direction: 'emits'},
  {id: `${productId}.events.collection-created-v1`, title: 'Collection created', eventType: 'vault.collection.created.v1', direction: 'emits'},
  {id: `${productId}.events.collection-updated-v1`, title: 'Collection updated', eventType: 'vault.collection.updated.v1', direction: 'emits'},
]
greenfield.integrity.manifestSha256 = manifestChecksum({...greenfield, integrity: {...greenfield.integrity, manifestSha256: ''}})
writeJson('module.manifest.json', greenfield)

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

function vaultSettingsDefaults() {
  return {
    defaultCollectionView: 'list',
    defaultSort: 'updatedAt',
    autosaveDelayMs: 1200,
    versionHistoryRetention: 25,
    confirmPermanentDeletion: true,
    showWordCount: true,
    showCharacterCount: false,
    includeArchivedNotesInSearch: false,
    defaultExportFormat: 'json',
    newNoteTemplateId: 'system.blank',
    dailyNoteEnabled: true,
    showBacklinks: true,
    searchSensitiveNotes: false,
    intelligencePreference: 'preferLocal',
  }
}

function upsertStandardRecords(records) {
  const note = records.find(item => item.id === `${productId}.record.note`)
  if (note) {
    note.schema.properties = {...note.schema.properties, ...readJson('schemas/note.schema.json').properties}
    const uniqueIndexes = new Map(note.indexes.map(index => [JSON.stringify(index.fields), index]))
    for (const fields of [['dailyDate'], ['sensitive'], ['templateId']]) uniqueIndexes.set(JSON.stringify(fields), {fields})
    note.indexes = Array.from(uniqueIndexes.values())
    note.searchPolicy.indexedFields = Array.from(new Set([...note.searchPolicy.indexedFields, 'canonicalBody', 'dailyDate', 'templateId']))
    note.searchPolicy.sensitiveFields = Array.from(new Set([...note.searchPolicy.sensitiveFields, 'canonicalBody', 'properties']))
  }
  const definitions = [
    ['attachment', 'schemas/attachment.schema.json', [['noteId'], ['kind'], ['createdAt']]],
    ['template', 'schemas/template.schema.json', [['name'], ['system']]],
    ['saved-search', 'schemas/saved-search.schema.json', [['name'], ['updatedAt']]],
  ]
  for (const [name, path, indexes] of definitions) {
    const id = `${productId}.record.${name}`
    if (records.some(item => item.id === id)) continue
    const schema = readJson(path)
    records.push({
      id,
      schema: {type: schema.type, required: schema.required, properties: schema.properties},
      ownership: 'account',
      visibility: 'private',
      indexes: indexes.map(fields => ({fields})),
      uniqueness: {keys: ['id'], scope: 'account'},
      retention: {policy: 'retain'},
      aiPolicy: {allowed: false, context: 'none', policyMode: 'block'},
      searchPolicy: {searchable: name !== 'attachment' ? true : true, indexedFields: schema['x-greenfield'].searchableFields, sensitiveFields: [], visibility: 'private'},
      auditPolicy: {events: [`vault-notes.${name}.updated`], includeRecordBody: false},
      exportPolicy: {allowed: true, formats: ['json']},
    })
  }
  return records
}

function flagshipFunctionDeclarations() {
  const definitions = [
    ['note.get', 'Get note', ['module.records.read'], false, ['record.read']],
    ['note.search', 'Search notes', ['module.records.read'], true, ['record.query']],
    ['note.list-recent', 'List recent notes', ['module.records.read'], true, ['record.query']],
    ['note.create-daily', 'Create or open daily note', ['module.records.write'], true, ['record.query', 'record.create', 'event.emit']],
    ['note.add-tag', 'Add tag to note', ['module.records.write'], true, ['record.update']],
    ['note.attach', 'Associate attachment metadata', ['module.records.write'], true, ['record.create', 'record.update']],
    ['note.backlinks', 'List note backlinks', ['module.records.read'], true, ['record.query']],
    ['note.graph', 'Build note graph data', ['module.records.read'], true, ['record.query']],
    ['note.restore-revision', 'Restore note revision', ['module.records.write'], true, ['record.update', 'version.snapshot', 'event.emit']],
    ['note.import', 'Import portable notes', ['module.records.write'], true, ['record.create', 'event.emit']],
  ]
  return definitions.map(([name, title, permissions, idempotent, sideEffects]) => {
    const functionId = `${productId}.function.${name}`
    const contract = flagshipFunctionContract(name)
    return {
      function: {
        id: functionId,
        title,
        inputSchema: contract.input,
        outputSchema: contract.output,
        permissions,
        aiCallable: false,
        automationCallable: false,
        idempotent,
        sideEffects,
        timeoutMs: 30000,
        rateLimit: {windowSeconds: 60, maxCalls: 60},
        audit: {event: `vault-notes.${name}`, includeInput: false, includeOutput: false},
        confirmationPolicy: {required: name === 'note.import' || name === 'note.restore-revision', risk: name === 'note.import' || name === 'note.restore-revision' ? 'high' : 'medium'},
      },
      action: {
        id: `${productId}.action.${name}`,
        title,
        functionId,
        permissions,
        confirmationPolicy: {required: name === 'note.import' || name === 'note.restore-revision', policyMode: name === 'note.import' || name === 'note.restore-revision' ? 'require-confirmation' : 'warn'},
        sideEffects,
        audit: {event: `vault-notes.${name}`, includeInput: false},
      },
    }
  })
}

function flagshipFunctionContract(name) {
  const string = {type: 'string', minLength: 1}
  const recordId = {recordId: {...string, maxLength: 180}}
  const idempotencyKey = {idempotencyKey: {...string, maxLength: 180}}
  const cursor = {type: ['string', 'null'], maxLength: 180}
  const limit = {type: 'integer', minimum: 1, maximum: 100}
  const note = {type: 'object', required: ['id', 'title', 'revision'], properties: {id: string, title: {type: 'string'}, revision: {type: 'integer', minimum: 1}}}
  const notePage = {type: 'object', required: ['items', 'nextCursor'], properties: {items: {type: 'array', items: note}, nextCursor: cursor}}
  const contracts = {
    'note.get': {input: objectSchema(recordId, ['recordId']), output: note},
    'note.search': {input: objectSchema({query: {type: 'string', maxLength: 1000}, filters: {type: 'object'}, cursor, limit, includeSensitive: {type: 'boolean'}}, []), output: notePage},
    'note.list-recent': {input: objectSchema({cursor, limit}, []), output: notePage},
    'note.create-daily': {input: objectSchema({date: {type: 'string', format: 'date'}, templateId: {...string, maxLength: 180}, ...idempotencyKey}, ['idempotencyKey']), output: note},
    'note.add-tag': {input: objectSchema({...recordId, tagId: {...string, maxLength: 180}, ...idempotencyKey}, ['recordId', 'tagId', 'idempotencyKey']), output: note},
    'note.attach': {input: objectSchema({...recordId, assetId: {...string, maxLength: 180}, name: {...string, maxLength: 255}, mimeType: {...string, maxLength: 180}, size: {type: 'integer', minimum: 0, maximum: 1073741824}, kind: {enum: ['image', 'pdf', 'document', 'audio', 'file']}, durationMs: {type: 'integer', minimum: 0}, ...idempotencyKey}, ['recordId', 'assetId', 'name', 'mimeType', 'size', 'idempotencyKey']), output: {type: 'object', required: ['id', 'noteId', 'assetId'], properties: {id: string, noteId: string, assetId: string}}},
    'note.backlinks': {input: objectSchema({...recordId, cursor, limit}, ['recordId']), output: {type: 'object', required: ['items', 'nextCursor'], properties: {items: {type: 'array', items: {type: 'object', required: ['sourceNoteId', 'targetNoteId'], properties: {sourceNoteId: string, targetNoteId: string}}}, nextCursor: cursor}}},
    'note.graph': {input: objectSchema({includeArchived: {type: 'boolean'}}, []), output: {type: 'object', required: ['nodes', 'edges'], properties: {nodes: {type: 'array', items: {type: 'object'}}, edges: {type: 'array', items: {type: 'object'}}}}},
    'note.restore-revision': {input: objectSchema({...recordId, revision: {type: 'integer', minimum: 1}, expectedCurrentRevision: {type: 'integer', minimum: 1}, ...idempotencyKey}, ['recordId', 'revision', 'expectedCurrentRevision', 'idempotencyKey']), output: note},
    'note.import': {input: objectSchema({format: {enum: ['markdown', 'plain-text', 'vault-backup']}, content: {type: ['string', 'object']}, ...idempotencyKey}, ['format', 'content', 'idempotencyKey']), output: {type: 'object', required: ['imported'], properties: {imported: {type: 'integer', minimum: 0}, skipped: {type: 'integer', minimum: 0}}}},
  }
  return contracts[name]
}

function objectSchema(properties, required) {
  return {type: 'object', additionalProperties: false, required, properties}
}

function upsertGreenfieldSchemas(schemas) {
  for (const [name, title] of [['attachment', 'Vault attachment metadata schema'], ['template', 'Vault template schema'], ['saved-search', 'Vault saved search schema']]) {
    const id = `${productId}.schemas.${name}`
    if (!schemas.some(item => item.id === id)) schemas.push({id, title, schemaRef: `schemas/${name}.schema.json`, collection: name, defaultVisibility: 'private'})
  }
  return schemas
}

function upsertGreenfieldFunctions(functions) {
  const schemaByName = {'note.attach': 'schemas/attachment.schema.json', 'note.import': 'schemas/vault-export.v1.schema.json'}
  for (const {function: declaration} of flagshipFunctionDeclarations()) {
    if (functions.some(item => item.functionId === declaration.id)) continue
    const name = declaration.id.slice(`${productId}.function.`.length)
    functions.push({
      id: `${productId}.functions.${name.replaceAll('.', '-')}`,
      title: declaration.title,
      functionId: declaration.id,
      mode: 'declarative',
      inputSchemaRef: schemaByName[name] ?? 'schemas/note.schema.json',
      outputSchemaRef: name === 'note.attach' ? 'schemas/attachment.schema.json' : 'schemas/note.schema.json',
      executionRequired: false,
    })
  }
  return functions
}

function upsertGreenfieldPermissions(permissions) {
  const collections = ['attachment', 'template', 'saved-search']
  for (const collection of collections) {
    for (const [operation, risk, reason] of [
      ['read', 'low', `Read account-scoped ${collection} records.`],
      ['write', 'medium', `Create and update account-scoped ${collection} records.`],
      ['delete', 'high', `Delete account-scoped ${collection} records.`],
    ]) {
      const permission = `records:module.${productId}.${collection}:${operation}`
      if (!permissions.some(item => item.permission === permission)) permissions.push({permission, reason, risk})
    }
  }
  return permissions
}
