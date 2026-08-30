#!/usr/bin/env node
import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {join, resolve} from 'node:path'

const root = process.cwd()
const releaseDir = join(root, 'release')
mkdirSync(releaseDir, {recursive: true})

execFileSync('pnpm', ['build'], {cwd: root, stdio: 'inherit'})

const packageJson = readJson('package.json')
const product = readJson('modula.product.json')
const standard = readJson('modula.module.json')
const greenfield = readJson('module.manifest.json')
const version = product.identity.version
if (packageJson.version !== version || standard.moduleVersion !== version || greenfield.version !== version) {
  throw new Error(`Release versions disagree: package=${packageJson.version}, product=${version}, standard=${standard.moduleVersion}, Greenfield=${greenfield.version}`)
}

execFileSync('pnpm', ['pack', '--pack-destination', releaseDir], {cwd: root, stdio: 'inherit'})

const packageFile = `modula-vault-notes-${version}.tgz`
const packageChecksum = sha256(readFileSync(join(releaseDir, packageFile)))
const productManifestChecksum = sha256(readFileSync(join(root, 'modula.product.json')))
const standardManifestChecksum = sha256(readFileSync(join(root, 'modula.module.json')))
const greenfieldManifestChecksum = greenfield.integrity.manifestSha256
const frontendBytes = readFileSync(join(root, product.frontend.artifact.path))
const frontendChecksum = sha256(frontendBytes)
if (frontendChecksum !== product.frontend.artifact.sha256 || frontendChecksum !== product.release.provenance.frontendSha256) {
  throw new Error('Frontend artifact provenance does not match the packaged bytes.')
}

const commit = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim()
const tag = `vault-notes-v${version}`
const standardRoot = resolve(root, '../modula-module-standard')
const standardTag = `mms-v${standard.standardVersion}`
const standardCommit = execFileSync('git', ['rev-list', '-n', '1', standardTag], {cwd: standardRoot, encoding: 'utf8'}).trim()

const provenance = {
  productId: product.identity.id,
  kind: product.identity.kind,
  version,
  mpsVersion: product.productStandard,
  moduleStandardVersion: standard.standardVersion,
  manifestSchemaVersion: standard.manifestSchemaVersion,
  dataSchemaVersion: standard.dataSchemaVersion,
  repository: 'modula-mod/modula-vault-notes',
  releaseCommit: commit,
  releaseTag: tag,
  packageFile,
  packageChecksum,
  productManifestChecksum,
  standardManifestChecksum,
  greenfieldManifestChecksum,
  frontendArtifact: product.frontend.artifact.path,
  frontendChecksum,
  standardReleaseTag: standardTag,
  standardReleaseCommit: standardCommit,
  channel: product.release.channel,
  generatedAt: new Date().toISOString(),
}

writeFileSync(join(releaseDir, `${tag}.provenance.json`), `${JSON.stringify(provenance, null, 2)}\n`)
console.log(JSON.stringify(provenance, null, 2))

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), 'utf8'))
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}
