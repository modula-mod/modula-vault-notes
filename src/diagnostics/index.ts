import type {VaultFolderRecord, VaultNoteRecord, VaultNoteVersionRecord, VaultTagRecord} from '../types.js'

export type VaultNotesDiagnosticsInput = {
  notes: VaultNoteRecord[]
  folders: VaultFolderRecord[]
  tags: VaultTagRecord[]
  versions: VaultNoteVersionRecord[]
  searchProjectionLagSeconds: number
  failedActions: number
  exportFailures: number
}

export function vaultNotesDiagnostics(input: VaultNotesDiagnosticsInput) {
  const trashed = input.notes.filter(note => Boolean(note.deletedAt)).length
  const unhealthy = input.failedActions > 0 || input.exportFailures > 0
  return {
    overall: unhealthy ? 'degraded' : 'healthy',
    manifest: {status: 'healthy'},
    compatibility: {status: 'healthy'},
    permissions: {status: 'healthy'},
    recordSchemas: {status: 'healthy'},
    dataSchema: {status: 'healthy', version: '1.0.0'},
    runtime: {status: unhealthy ? 'degraded' : 'healthy'},
    searchProjection: {
      status: input.searchProjectionLagSeconds > 30 ? 'degraded' : 'healthy',
      details: {
        indexedNotes: input.notes.length - trashed,
        lagSeconds: input.searchProjectionLagSeconds,
      },
    },
    settings: {status: 'healthy'},
    exports: {status: input.exportFailures > 0 ? 'degraded' : 'healthy'},
    counts: {
      notes: input.notes.length,
      folders: input.folders.length,
      tags: input.tags.length,
      trashedNotes: trashed,
      versions: input.versions.length,
      failedActions: input.failedActions,
      exportFailures: input.exportFailures,
      dataSchemaVersion: '1.0.0',
    },
  }
}
