#!/usr/bin/env node
import {readFileSync} from 'node:fs'

const html = readFileSync('preview/index.html', 'utf8')
const css = readFileSync('preview/styles.css', 'utf8')
const js = readFileSync('preview/app.js', 'utf8')
const artifact = JSON.parse(readFileSync('frontend/frontend.manifest.json', 'utf8'))

const checks = [
  [artifact.productId === 'digital.modula.vault-notes', 'compiled artifact has canonical product identity'],
  [artifact.releaseVersion === '2.0.2', 'compiled artifact is the 2.0.2 release identity'],
  [artifact.routes.length === 22 && artifact.views.length === 22, 'compiled artifact exposes 22 routes and 22 views'],
  [html.includes('/preview/app.js') && html.includes('/preview/styles.css'), 'preview loads local assets only'],
  [js.includes("fetch('/frontend/frontend.manifest.json'"), 'preview verifies the compiled MPS artifact'],
  [js.includes('Modula Platform — V1 Architecture'), 'preview contains the synthetic hero note'],
  [js.includes('CAPABILITY_UNAVAILABLE'), 'preview documents fail-closed local intelligence'],
  [!/(?:https?:)?\/\//.test(`${html}\n${css}\n${js}`), 'preview makes no external network reference'],
  [!/(?:password|bearer|api[_-]?key)\s*[:=]\s*["'][^"']+/i.test(`${html}\n${css}\n${js}`), 'preview contains no credential-like assignment'],
]

const failed = checks.filter(([ok]) => !ok)
for (const [ok, label] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`)
if (failed.length) process.exit(1)
