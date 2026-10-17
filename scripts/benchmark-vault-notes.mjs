import {performance} from 'node:perf_hooks'
import {generateVaultFixtureLibrary} from './vault-fixture-generator.mjs'

const sizes = [100, 1_000, 10_000]
const results = []

for (const count of sizes) {
  const createStarted = performance.now()
  const fixture = generateVaultFixtureLibrary(count)
  const createMs = performance.now() - createStarted
  const target = fixture.notes[Math.min(fixture.notes.length - 1, 10)]

  results.push({
    notes: count,
    createMs: rounded(createMs),
    firstPageMs: measure(() => fixture.store.queryNotes({limit: 50})),
    searchMs: measure(() => fixture.store.queryNotes({query: 'cohort 7', limit: 50})),
    tagFilterMs: measure(() => fixture.store.queryNotes({filters: {tagIds: [fixture.tags[0].id]}, limit: 50})),
    backlinkMs: measure(() => fixture.store.backlinks(target.id, 0, 50)),
    graphMs: measure(() => fixture.store.graphData()),
    graphNodes: fixture.store.graphData().nodes.length,
    graphEdges: fixture.store.graphData().edges.length,
  })
}

process.stdout.write(`${JSON.stringify({kind: 'module-local-in-memory-benchmark', measuredAt: new Date().toISOString(), results}, null, 2)}\n`)

function measure(operation) {
  const started = performance.now()
  operation()
  return rounded(performance.now() - started)
}

function rounded(value) {
  return Number(value.toFixed(3))
}
