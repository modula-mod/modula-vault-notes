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
}
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
