#!/usr/bin/env node
import {createHash} from 'node:crypto'
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs'
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
const check = (condition, message) => condition ? pass(message) : fail(message)

const packageJson = readJson('package.json')
const product = readJson('modula.product.json')
const standard = readJson('modula.module.json')
const greenfield = readJson('module.manifest.json')
const version = packageJson.version
const validation = validateModulaModuleManifest(standard)
check(validation.valid, `Standard 2.1 manifest validates${validation.valid ? '' : `: ${validation.issues.map(issue => `${issue.code} ${issue.path}`).join('; ')}`}`)

for (const [field, value] of Object.entries({standardVersion: '2.1.0', moduleVersion: version, manifestSchemaVersion: '2.1.0', dataSchemaVersion: '1.0.0'})) {
  check(standard[field] === value, `${field} is ${value}`)
}
check(product.identity.id === 'digital.modula.vault-notes' && product.identity.version === version, 'canonical MPS identity matches package version')
check(greenfield.moduleId === product.identity.id && greenfield.version === version, 'Greenfield compatibility identity matches MPS')
check(packageJson.files.includes('frontend'), 'release package includes product-owned frontend')

const frontendPath = product.frontend?.artifact?.path
check(product.frontend?.mode === 'declarative' && frontendPath === 'frontend/frontend.manifest.json', 'declarative frontend artifact is declared')
if (frontendPath && existsSync(join(root, frontendPath))) {
  const frontendBytes = readFileSync(join(root, frontendPath))
  const frontend = JSON.parse(frontendBytes.toString('utf8'))
  const frontendHash = createHash('sha256').update(frontendBytes).digest('hex')
  check(frontendHash === product.frontend.artifact.sha256, 'frontend artifact hash matches product manifest')
  check(frontendHash === product.release.provenance.frontendSha256, 'frontend artifact hash is bound into release provenance')
  check(frontend.schema === 'modula.frontend.1.0' && frontend.frontendSchemaVersion === '1.0.0', 'frontend schema version is supported')
  check(frontend.mpsVersion === product.productStandard, 'frontend MPS version matches product')
  check(frontend.productId === product.identity.id && frontend.releaseVersion === version, 'frontend release identity matches product')
  check(frontend.mode === 'declarative' && frontend.entry === 'home', 'frontend has a declarative home entry')
  const requiredFrontendViews = ['home', 'detail', 'editor', 'search', 'favourites', 'archived', 'trash', 'folders', 'settings']
  for (const id of requiredFrontendViews) check(frontend.views.some(view => view.id === id), `product frontend view declared: ${id}`)
  for (const path of ['/', '/new', '/note/:noteId', '/note/:noteId/edit', '/search', '/favourites', '/archived', '/trash', '/folders', '/settings']) {
    check(frontend.routes.some(route => route.path === path), `product frontend route declared: ${path}`)
  }
  for (const id of ['newNote', 'openNote', 'editNote', 'createNote', 'updateNote', 'deleteNote', 'restoreNote', 'purgeNote', 'shareNote', 'saveSettings']) {
    check(frontend.actions.some(action => action.id === id), `product frontend action declared: ${id}`)
  }
  const editor = frontend.views.find(view => view.id === 'editor')
  const editorFields = editor?.root?.children?.filter(component => component.type === 'field').map(component => component.field?.id) ?? []
  check(editorFields.includes('document') && editorFields.includes('tagIds') && !editorFields.includes('body') && !editorFields.includes('tags'), 'frontend editor writes the canonical Vault Notes record fields')
  const createAction = frontend.actions.find(action => action.id === 'createNote')
  check(createAction?.input?.transforms?.some(transform => transform.source === 'document' && transform.target === 'plainTextProjection' && transform.transform === 'richText.plainText@1'), 'frontend derives the searchable plain-text projection generically')
  const trash = frontend.views.find(view => view.id === 'trash')
  check(trash?.bindings?.some(binding => binding.query?.recordState === 'deleted'), 'trash binds deleted records explicitly')
  check(JSON.stringify(trash?.root).includes('restoreNote') && JSON.stringify(trash?.root).includes('purgeNote'), 'trash lifecycle actions come from the product frontend')
  check(frontend.accessibility?.screenReader === true && frontend.accessibility?.scalableText === true && frontend.accessibility?.keyboardNavigation === true && frontend.accessibility?.reduceMotion === true, 'frontend accessibility declaration is complete')
  check(frontend.capabilities?.required?.includes('ui.richText@1'), 'rich-text editor is a versioned generic host capability')
  const serialized = JSON.stringify(frontend)
  for (const prohibited of ['rawJs', 'rawHtml', 'remoteBundle', 'customComponentName', 'unsafeWebView', 'eval(']) check(!serialized.includes(prohibited), `frontend executable escape hatch absent: ${prohibited}`)
} else {
  fail('compiled frontend artifact exists')
}

const requiredRecords = ['note', 'folder', 'tag', 'note-link', 'note-version', 'saved-source']
for (const record of requiredRecords) {
  check(standard.records.some(item => item.id === `digital.modula.vault-notes.record.${record}`), `record ${record} declared`)
}

const requiredLegacyViews = ['home', 'collection', 'detail', 'editor', 'search', 'favourites', 'archived', 'trash', 'folders', 'settings', 'empty', 'error']
for (const view of requiredLegacyViews) {
  check(standard.views.some(item => item.id === `digital.modula.vault-notes.view.${view}`), `compatibility view vault-notes.${view} declared`)
}

const marketplace = greenfield.extensions?.marketplace ?? {}
check(marketplace.category === 'Productivity', 'Marketplace category is publisher-declared')
check(marketplace.ageRating === '4+', 'Marketplace age rating is publisher-declared')
check(marketplace.previews?.length === 0, 'Marketplace previews remain empty until verified media is published')
check(marketplace.availableViewIds?.length === requiredLegacyViews.length, 'Marketplace compatibility listing references all canonical module views')
check(marketplace.release?.source?.tag === `vault-notes-v${version}` && marketplace.release?.source?.asset === `modula-vault-notes-${version}.tgz`, 'Marketplace release identity is pinned')
for (const field of ['rating', 'ratingCount', 'chartRank', 'downloadCount']) check(!(field in marketplace), `runtime Marketplace aggregate is not hardcoded: ${field}`)

const actionNames = ['create', 'open', 'update', 'duplicate', 'archive', 'unarchive', 'delete', 'restore', 'delete-permanently', 'pin', 'unpin', 'favourite', 'unfavourite', 'move', 'export']
for (const action of actionNames) {
  const actionId = `digital.modula.vault-notes.action.note.${action}`
  check(standard.actions.some(item => item.id === actionId) && standard.functions.some(item => item.id === actionId.replace('.action.', '.function.')), `note.${action} action/function declared`)
}

for (const permission of ['module.records.read', 'module.records.write', 'module.records.delete', 'module.settings.read', 'module.settings.write', 'module.search.publish', 'module.events.emit', 'module.export.create']) {
  check(standard.permissions.some(item => item.id === permission), `${permission} requested`)
}

check(standard.ai.length === 0 && !standard.permissions.some(item => item.id.startsWith('ai.')), 'optional AI implementation is absent from Vault Notes core')
check(!existsSync(join(root, 'dist/ai')), 'compiled release contains no stale embedded AI artifacts')
for (const point of ['digital.modula.vault-notes.editor.command', 'digital.modula.vault-notes.note.actions', 'digital.modula.vault-notes.note.after-save', 'digital.modula.vault-notes.settings.section']) {
  check(standard.extensionProduct?.extensionPoints?.some(item => item.id === point), `compatibility extension point declared: ${point}`)
}
check(standard.extensionProduct?.kind === 'module' && standard.extensionProduct.targets.length === 0 && standard.extensionProduct.contributions.length === 0, 'Vault Notes remains standalone')

const sourceText = collectText(root)
for (const prohibited of ['src/features/vault-notes', 'app/vault-notes', 'dangerouslySetInnerHTML', 'providerApiKey', 'accessToken', 'refreshToken', 'customSql']) {
  check(!sourceText.includes(prohibited), `prohibited construct absent: ${prohibited}`)
}
check(!sourceText.includes('packages/module-standard/src'), 'Standard source is not copied')

if (failures.length) {
  console.error(`Vault Notes release verifier failed: ${failures.length} issue(s)`)
  process.exit(1)
}
console.log('Vault Notes release verifier passed')

function collectText(dir) {
  let output = ''
  for (const entry of readdirSync(dir)) {
    if (['.git', 'node_modules', 'dist', 'release', 'verify-release.mjs'].includes(entry)) continue
    const path = join(dir, entry)
    const stat = statSync(path)
    if (stat.isDirectory()) output += collectText(path)
    else if (stat.isFile() && /\.(json|ts|md|mjs|yml|yaml)$/.test(entry)) output += readFileSync(path, 'utf8')
  }
  return output
}
