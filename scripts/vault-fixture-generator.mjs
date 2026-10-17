import {pathToFileURL} from 'node:url'
import {VaultNotesStore, createDocumentFromText} from '../dist/index.js'

export function generateVaultFixtureLibrary(count, options = {}) {
  if (!Number.isInteger(count) || count < 1 || count > 100_000) throw new Error('count must be an integer between 1 and 100000')
  const store = new VaultNotesStore({
    accountId: options.accountId ?? 'fixture-account',
    actorId: options.actorId ?? 'fixture-actor',
    requestId: 'fixture-request',
    correlationId: 'fixture-correlation',
  })
  const folders = Array.from({length: Math.min(8, Math.max(1, Math.ceil(count / 250)))}, (_, index) => store.createFolder(`Folder ${index + 1}`))
  const tags = Array.from({length: 12}, (_, index) => store.createTag(`tag-${index + 1}`))
  const notes = []

  for (let index = 0; index < count; index += 1) {
    const note = store.createNote({
      title: `Fixture note ${String(index + 1).padStart(5, '0')}`,
      document: createDocumentFromText(`Fixture body ${index + 1}\n\nSearch cohort ${index % 17}`),
      folderId: folders[index % folders.length].id,
      tagIds: [tags[index % tags.length].id, tags[(index + 3) % tags.length].id],
      properties: [
        {id: 'status', name: 'Status', type: 'singleSelect', value: index % 3 === 0 ? 'active' : 'reference'},
        {id: 'priority', name: 'Priority', type: 'number', value: index % 5},
      ],
      sensitive: index % 97 === 0,
      idempotencyKey: `fixture-note-${index}`,
    })
    notes.push(note)

    if (index % 20 === 0) {
      store.attach({
        noteId: note.id,
        assetId: `asset-${index}`,
        name: `attachment-${index}.pdf`,
        mimeType: 'application/pdf',
        size: 1024 + index,
        kind: 'pdf',
        idempotencyKey: `fixture-attachment-${index}`,
      })
    }
    if (index > 0 && index % 10 === 0) store.linkNotes(note.id, notes[index - 1].id)
    if (index % 100 === 0) {
      store.updateNote({
        id: note.id,
        expectedRevision: store.listNotes().find(candidate => candidate.id === note.id).revision,
        document: createDocumentFromText(`Fixture body ${index + 1}\n\nRevision checkpoint`),
        idempotencyKey: `fixture-revision-${index}`,
      })
    }
  }

  return {store, notes, folders, tags}
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const count = Number.parseInt(process.argv[2] ?? '100', 10)
  const fixture = generateVaultFixtureLibrary(count)
  process.stdout.write(`${JSON.stringify({
    notes: fixture.store.listNotes().length,
    folders: fixture.store.listFolders().length,
    tags: fixture.store.listTags().length,
    links: fixture.store.listLinks().length,
    attachments: fixture.store.listAttachments().length,
    revisions: fixture.store.listVersions().length,
  }, null, 2)}\n`)
}
