#!/usr/bin/env node
import {createServer} from 'node:http'
import {createReadStream, existsSync, statSync} from 'node:fs'
import {extname, join, normalize, resolve} from 'node:path'

const root = resolve(import.meta.dirname, '..')
const host = '127.0.0.1'
const port = Number.parseInt(process.env.VAULT_PREVIEW_PORT ?? '4178', 10)
const mediaTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
])

const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', `http://${host}:${port}`).pathname
  const requested = pathname === '/' ? '/preview/index.html' : pathname
  const path = normalize(join(root, requested))
  if (!path.startsWith(`${root}/`) || !existsSync(path) || !statSync(path).isFile()) {
    response.writeHead(404, {'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store'})
    response.end('Not found')
    return
  }
  response.writeHead(200, {
    'content-type': mediaTypes.get(extname(path)) ?? 'application/octet-stream',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'no-referrer',
    'content-security-policy': "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  })
  createReadStream(path).pipe(response)
})

server.listen(port, host, () => {
  console.log(`Vault Notes 2.0 private preview: http://${host}:${port}`)
  console.log('Loopback only. Use an SSH tunnel for private remote access.')
})
