#!/usr/bin/env node
import {execFileSync} from 'node:child_process'
import {existsSync} from 'node:fs'
import {dirname, join, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const candidates = [
  process.env.MODULA_PRODUCT_STANDARD_ROOT,
  resolve(root, '../modula-product-standard'),
  resolve(root, '../../modula-product-standard'),
].filter(Boolean)
const standardRoot = candidates.find(candidate => existsSync(join(candidate, 'packages/product-frontend/package.json')))

if (!standardRoot) {
  throw new Error('Modula Product Standard checkout not found. Set MODULA_PRODUCT_STANDARD_ROOT.')
}

const cli = join(standardRoot, 'packages/product-frontend/dist/cli.js')
if (existsSync(cli)) {
  execFileSync(process.execPath, [cli, 'build', root], {stdio: 'inherit', cwd: standardRoot})
} else {
  execFileSync('pnpm', ['--dir', standardRoot, 'mps-frontend', 'build', root], {
    stdio: 'inherit',
    env: {...process.env, PNPM_PM_ON_FAIL: 'ignore'},
  })
}
