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
const validation = validateModulaModuleManifest(standard)
if (validation.valid) pass('Standard 1.2 manifest validates')
else fail(`Standard manifest invalid: ${validation.issues.map(issue => `${issue.code} ${issue.path}`).join('; ')}`)

for (const [field, value] of Object.entries({standardVersion: '1.2.0', moduleVersion: '1.1.0', manifestSchemaVersion: '1.2.0', dataSchemaVersion: '1.0.0'})) {
  if (standard[field] === value) pass(`${field} is ${value}`)
  else fail(`${field} must be ${value}`)
}

const requiredRecords = ['note', 'folder', 'tag', 'note-link', 'note-version', 'saved-source']
for (const record of requiredRecords) {
  if (standard.records.some(item => item.id === `modula.vault-notes.record.${record}`)) pass(`record ${record} declared`)
  else fail(`record ${record} missing`)
}

const requiredViews = ['home', 'collection', 'detail', 'editor', 'search', 'favourites', 'archived', 'trash', 'folders', 'settings', 'empty', 'error']
for (const view of requiredViews) {
  if (standard.views.some(item => item.id === `modula.vault-notes.view.${view}`)) pass(`view vault-notes.${view} declared`)
  else fail(`view vault-notes.${view} missing`)
}

const actionNames = ['create', 'open', 'update', 'duplicate', 'archive', 'unarchive', 'delete', 'restore', 'delete-permanently', 'pin', 'unpin', 'favourite', 'unfavourite', 'move', 'export']
for (const action of actionNames) {
  const actionId = `modula.vault-notes.action.note.${action}`
  if (standard.actions.some(item => item.id === actionId) && standard.functions.some(item => item.id === actionId.replace('.action.', '.function.'))) pass(`note.${action} action/function declared`)
  else fail(`note.${action} action/function missing`)
}

for (const permission of ['module.records.read', 'module.records.write', 'module.records.delete', 'module.settings.read', 'module.settings.write', 'module.search.publish', 'module.events.emit', 'module.export.create']) {
  if (standard.permissions.some(item => item.id === permission)) pass(`${permission} requested`)
  else fail(`${permission} missing`)
}

for (const permission of ['ai.request', 'ai.stream', 'ai.structured-output', 'ai.context.private']) {
  if (standard.permissions.some(item => item.id === permission && item.required === false)) pass(`${permission} requested optionally`)
  else fail(`${permission} optional request missing`)
}

const actionIds = standard.ai.flatMap(item => item.productActions ?? []).map(item => item.id)
for (const actionId of ['vault-notes.ai.summarise', 'vault-notes.ai.suggest-title', 'vault-notes.ai.rewrite-selection', 'vault-notes.ai.extract-action-items', 'vault-notes.ai.suggest-tags']) {
  if (actionIds.includes(actionId)) pass(`${actionId} AI product action declared`)
  else fail(`${actionId} AI product action missing`)
}
if (!JSON.stringify(standard.ai).match(/providerId|modelId|apiKey|providerUrl|providerPayload/)) pass('AI declarations are provider independent')
else fail('AI declarations contain provider-bound fields')

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
