#!/usr/bin/env node
import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {join, resolve} from 'node:path'

const root = process.cwd()
const releaseDir = join(root, 'release')
mkdirSync(releaseDir, {recursive: true})

execFileSync('pnpm', ['build'], {cwd: root, stdio: 'inherit'})
execFileSync('pnpm', ['pack', '--pack-destination', releaseDir], {cwd: root, stdio: 'inherit'})

const manifest = JSON.parse(readFileSync(join(root, 'modula.module.json'), 'utf8'))
const greenfieldManifest = JSON.parse(readFileSync(join(root, 'module.manifest.json'), 'utf8'))
const packageFile = `modula-vault-notes-${manifest.moduleVersion}.tgz`
const packageChecksum = sha256(readFileSync(join(releaseDir, packageFile)))
const manifestChecksum = sha256(readFileSync(join(root, 'modula.module.json')))
const greenfieldManifestChecksum = greenfieldManifest.integrity.manifestSha256
const commit = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim()
const tag = `vault-notes-v${manifest.moduleVersion}`
const standardRoot = resolve(root, '../modula-module-standard')
const standardTag = `mms-v${manifest.standardVersion}`
const standardCommit = execFileSync('git', ['rev-list', '-n', '1', standardTag], {cwd: standardRoot, encoding: 'utf8'}).trim()

const provenance = {
  moduleId: manifest.id,
  moduleVersion: manifest.moduleVersion,
  standardVersion: manifest.standardVersion,
  manifestSchemaVersion: manifest.manifestSchemaVersion,
  dataSchemaVersion: manifest.dataSchemaVersion,
  repository: 'modula-mod/modula-vault-notes',
  releaseCommit: commit,
  releaseTag: tag,
  packageFile,
  manifestChecksum,
  greenfieldManifestChecksum,
  packageChecksum,
  standardReleaseTag: standardTag,
  standardReleaseCommit: standardCommit,
  channel: 'development',
  nextChannel: 'founder-alpha',
  generatedAt: new Date().toISOString(),
}

writeFileSync(join(releaseDir, `${tag}.provenance.json`), `${JSON.stringify(provenance, null, 2)}\n`)
console.log(`package: ${packageFile}`)
console.log(`package sha256: ${packageChecksum}`)
console.log(`release commit: ${commit}`)
console.log(`release tag: ${tag}`)

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}
