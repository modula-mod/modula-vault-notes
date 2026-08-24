export const VAULT_NOTES_EXTENSION_POINTS = [
  {id: 'digital.modula.vault-notes.home.section', title: 'Home sections', contributionKinds: ['home.section', 'widget']},
  {id: 'digital.modula.vault-notes.editor.toolbar', title: 'Editor toolbar', contributionKinds: ['toolbar.action']},
  {id: 'digital.modula.vault-notes.editor.command', title: 'Editor commands', contributionKinds: ['editor.command']},
  {id: 'digital.modula.vault-notes.editor.attachment', title: 'Editor attachments', contributionKinds: ['editor.attachment']},
  {id: 'digital.modula.vault-notes.note.actions', title: 'Note actions', contributionKinds: ['menu.item']},
  {id: 'digital.modula.vault-notes.note.context-menu', title: 'Note context menu', contributionKinds: ['contextMenu.item']},
  {id: 'digital.modula.vault-notes.note.inspector', title: 'Note inspector', contributionKinds: ['view.section', 'record.decorator']},
  {id: 'digital.modula.vault-notes.note.after-save', title: 'After-save actions', contributionKinds: ['background.action']},
  {id: 'digital.modula.vault-notes.collection.actions', title: 'Collection actions', contributionKinds: ['menu.item']},
  {id: 'digital.modula.vault-notes.search.provider', title: 'Search providers', contributionKinds: ['search.provider']},
  {id: 'digital.modula.vault-notes.composer.tool', title: 'Composer tools', contributionKinds: ['composer.tool']},
  {id: 'digital.modula.vault-notes.settings.section', title: 'Settings sections', contributionKinds: ['settings.section']},
] as const

export const VAULT_NOTES_PRODUCT_CAPABILITIES = [
  'notes.read',
  'notes.create',
  'notes.update',
  'notes.delete',
  'notes.search',
  'notes.collections.read',
  'notes.collections.manage',
  'notes.attachments.read',
  'notes.attachments.create',
  'notes.export',
  'notes.editor.contribute',
  'notes.actions.contribute',
  'notes.events.subscribe',
] as const

export type VaultNotesExtensionPointId = (typeof VAULT_NOTES_EXTENSION_POINTS)[number]['id']
export type VaultNotesProductCapability = (typeof VAULT_NOTES_PRODUCT_CAPABILITIES)[number]
