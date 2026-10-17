import {createDocumentFromText} from '../document/index.js'
import type {VaultNoteProperty, VaultStructuredDocument, VaultTemplateRecord} from '../types.js'

const TEMPLATE_EPOCH = '2026-10-08T00:00:00.000Z'

type TemplateSeed = {
  id: string
  name: string
  description: string
  titlePattern: string
  body: string
  properties?: VaultNoteProperty[]
}

const TEMPLATE_SEEDS: TemplateSeed[] = [
  {id: 'blank', name: 'Blank Note', description: 'An empty note.', titlePattern: 'Untitled', body: ''},
  {id: 'meeting', name: 'Meeting Notes', description: 'Agenda, decisions, and action items.', titlePattern: 'Meeting — {{date}}', body: '## Agenda\n\n## Notes\n\n## Decisions\n\n## Action items'},
  {id: 'daily', name: 'Daily Note', description: 'A dated daily planning and reflection note.', titlePattern: '{{date}}', body: '## Priorities\n\n## Notes\n\n## Reflection'},
  {id: 'project', name: 'Project Note', description: 'Project outcome, status, and next actions.', titlePattern: 'Project — Untitled', body: '## Outcome\n\n## Status\n\n## Next actions'},
  {id: 'research', name: 'Research Note', description: 'Question, evidence, and conclusions.', titlePattern: 'Research — Untitled', body: '## Question\n\n## Sources\n\n## Findings\n\n## Conclusions'},
  {id: 'checklist', name: 'Checklist', description: 'A focused checklist.', titlePattern: 'Checklist — {{date}}', body: 'Checklist'},
  {id: 'journal', name: 'Journal', description: 'A private dated reflection.', titlePattern: 'Journal — {{date}}', body: '## Today\n\n## Gratitude\n\n## Tomorrow'},
  {id: 'idea', name: 'Idea', description: 'Capture and develop an idea.', titlePattern: 'Idea — Untitled', body: '## Idea\n\n## Why it matters\n\n## First experiment'},
]

export const VAULT_SYSTEM_TEMPLATES: readonly VaultTemplateRecord[] = TEMPLATE_SEEDS.map(seed => ({
  id: `system.${seed.id}`,
  name: seed.name,
  description: seed.description,
  titlePattern: seed.titlePattern,
  document: seed.id === 'checklist'
    ? {schemaVersion: '1.0.0', blocks: [{id: 'checklist-1', type: 'checklist', items: ['First item'], checked: [false]}]}
    : createDocumentFromText(seed.body),
  properties: {version: '1.0.0', values: seed.properties ?? []},
  system: true,
  createdAt: TEMPLATE_EPOCH,
  updatedAt: TEMPLATE_EPOCH,
}))

export function instantiateVaultTemplate(template: VaultTemplateRecord, date = new Date()): {title: string; document: VaultStructuredDocument; properties: VaultNoteProperty[]} {
  const day = date.toISOString().slice(0, 10)
  return {
    title: template.titlePattern.replaceAll('{{date}}', day),
    document: structuredClone(template.document),
    properties: structuredClone(template.properties.values),
  }
}

export function vaultSystemTemplate(id: string): VaultTemplateRecord | undefined {
  return VAULT_SYSTEM_TEMPLATES.find(template => template.id === id)
}
