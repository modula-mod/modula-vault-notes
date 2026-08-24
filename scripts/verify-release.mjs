#!/usr/bin/env node
import {readFileSync, readdirSync, statSync} from 'node:fs'
import {join} from 'node:path'
import {validateModulaModuleManifest} from '@modula/module-validator'

const root = process.cwd()
const failures = []

const readJson = path => JSON.parse(readFileSync(join(root, path), 'utf8'))
const pass = message => console.log(`PASS ${message}`)
const fail = message => {
  failures.push(message)
  console.error(`FAIL ${message}`)
}

const standard = readJson('modula.module.json')
const greenfield = readJson('module.manifest.json')
const validation = validateModulaModuleManifest(standard)
if (validation.valid) pass('Standard 2.1 manifest validates')
else fail(`Standard manifest invalid: ${validation.issues.map(issue => `${issue.code} ${issue.path}`).join('; ')}`)

for (const [field, value] of Object.entries({standardVersion: '2.1.0', moduleVersion: '1.2.0', manifestSchemaVersion: '2.1.0', dataSchemaVersion: '1.0.0'})) {
  if (standard[field] === value) pass(`${field} is ${value}`)
  else fail(`${field} must be ${value}`)
}

const requiredRecords = ['note', 'folder', 'tag', 'note-link', 'note-version', 'saved-source']
for (const record of requiredRecords) {
  if (standard.records.some(item => item.id === `digital.modula.vault-notes.record.${record}`)) pass(`record ${record} declared`)
  else fail(`record ${record} missing`)
}

const requiredViews = ['home', 'collection', 'detail', 'editor', 'search', 'favourites', 'archived', 'trash', 'folders', 'settings', 'empty', 'error']
for (const view of requiredViews) {
  if (standard.views.some(item => item.id === `digital.modula.vault-notes.view.${view}`)) pass(`view vault-notes.${view} declared`)
  else fail(`view vault-notes.${view} missing`)
}

const marketplace = greenfield.extensions?.marketplace ?? {}
if (marketplace.category === 'Productivity') pass('Marketplace category is publisher-declared')
else fail('Marketplace category missing')
if (marketplace.ageRating === '4+') pass('Marketplace age rating is publisher-declared')
else fail('Marketplace age rating missing')
if (marketplace.previews?.length === 0) pass('Marketplace previews remain empty until verified media is published')
else fail('Marketplace previews must contain only separately verified media')
if (marketplace.availableViewIds?.length === requiredViews.length) pass('Marketplace listing references all canonical module views')
else fail('Marketplace listing must reference every canonical module view')
if (marketplace.release?.source?.tag === 'vault-notes-v1.2.0' && marketplace.release?.source?.asset === 'modula-vault-notes-1.2.0.tgz') pass('Marketplace release identity is pinned')
else fail('Marketplace release identity missing')
for (const field of ['rating', 'ratingCount', 'chartRank', 'downloadCount']) {
  if (!(field in marketplace)) pass(`runtime Marketplace aggregate is not hardcoded: ${field}`)
  else fail(`runtime Marketplace aggregate must not be declared in the module: ${field}`)
}

const actionNames = ['create', 'open', 'update', 'duplicate', 'archive', 'unarchive', 'delete', 'restore', 'delete-permanently', 'pin', 'unpin', 'favourite', 'unfavourite', 'move', 'export']
for (const action of actionNames) {
  const actionId = `digital.modula.vault-notes.action.note.${action}`
  if (standard.actions.some(item => item.id === actionId) && standard.functions.some(item => item.id === actionId.replace('.action.', '.function.'))) pass(`note.${action} action/function declared`)
  else fail(`note.${action} action/function missing`)
}

for (const permission of ['module.records.read', 'module.records.write', 'module.records.delete', 'module.settings.read', 'module.settings.write', 'module.search.publish', 'module.events.emit', 'module.export.create']) {
  if (standard.permissions.some(item => item.id === permission)) pass(`${permission} requested`)
  else fail(`${permission} missing`)
}

if (standard.ai.length === 0 && !standard.permissions.some(item => item.id.startsWith('ai.'))) pass('optional AI implementation is absent from Vault Notes core')
else fail('Vault Notes core must not declare embedded AI implementation')
const requiredExtensionPoints = [
  'digital.modula.vault-notes.editor.command',
  'digital.modula.vault-notes.note.actions',
  'digital.modula.vault-notes.note.after-save',
  'digital.modula.vault-notes.settings.section',
]
for (const point of requiredExtensionPoints) {
  if (standard.extensionProduct?.extensionPoints?.some(item => item.id === point)) pass(`extension point declared: ${point}`)
  else fail(`extension point missing: ${point}`)
}
if (standard.extensionProduct?.kind === 'module' && standard.extensionProduct.targets.length === 0 && standard.extensionProduct.contributions.length === 0) pass('Vault Notes remains standalone')
else fail('Vault Notes core extension product contract is invalid')

const sourceText = collectText(root)
for (const prohibited of ['src/features/vault-notes', 'app/vault-notes', 'dangerouslySetInnerHTML', 'providerApiKey', 'accessToken', 'refreshToken', 'customSql']) {
  if (!sourceText.includes(prohibited)) pass(`prohibited construct absent: ${prohibited}`)
  else fail(`prohibited construct present: ${prohibited}`)
}
if (!sourceText.includes('packages/module-standard/src')) pass('Standard source is not copied')
else fail('Standard source appears copied into module repo')

if (failures.length) {
  console.error(`Vault Notes release verifier failed: ${failures.length} issue(s)`)
  process.exit(1)
}
console.log('Vault Notes release verifier passed')

function collectText(dir) {
  let output = ''
  for (const entry of readdirSync(dir)) {
    if (['.git', 'node_modules', 'dist', 'release'].includes(entry)) continue
    const path = join(dir, entry)
    const stat = statSync(path)
    if (stat.isDirectory()) output += collectText(path)
    else if (stat.isFile() && /\.(json|ts|md|yml|yaml)$/.test(entry)) output += readFileSync(path, 'utf8')
  }
  return output
}
