#!/usr/bin/env node
import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
import {mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs'
import {join} from 'node:path'

const root = process.cwd()
const releaseDir = join(root, 'release')
mkdirSync(releaseDir, {recursive: true})

execFileSync('pnpm', ['build'], {cwd: root, stdio: 'inherit'})
execFileSync('pnpm', ['pack', '--pack-destination', releaseDir], {cwd: root, stdio: 'inherit'})

const packageFile = readdirSync(releaseDir).find(file => file.endsWith('.tgz'))
if (!packageFile) throw new Error('pnpm pack did not create a package artifact')

const manifest = JSON.parse(readFileSync(join(root, 'modula.module.json'), 'utf8'))
const greenfieldManifest = JSON.parse(readFileSync(join(root, 'module.manifest.json'), 'utf8'))
const packageChecksum = sha256(readFileSync(join(releaseDir, packageFile)))
const manifestChecksum = sha256(readFileSync(join(root, 'modula.module.json')))
const greenfieldManifestChecksum = greenfieldManifest.integrity.manifestSha256
const commit = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim()
const tag = 'vault-notes-v1.0.0'

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
  standardReleaseTag: 'mms-v1.0.0',
  standardReleaseCommit: 'ac1bede6e9be6518a21e8248596b99b4099da5c6',
  channel: 'development',
  nextChannel: 'founder-alpha',
  generatedAt: new Date().toISOString(),
}

writeFileSync(join(releaseDir, 'vault-notes-v1.0.0.provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`)
console.log(`package: ${packageFile}`)
console.log(`package sha256: ${packageChecksum}`)
console.log(`release commit: ${commit}`)
console.log(`release tag: ${tag}`)

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}
