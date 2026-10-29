import {createHash} from 'node:crypto'
import type {VaultDocumentBlock, VaultDocumentBlockType, VaultInlineMarkType, VaultStructuredDocument} from '../types.js'

const BLOCK_TYPES = new Set<VaultDocumentBlockType>([
  'paragraph',
  'heading',
  'bullet-list',
  'numbered-list',
  'checklist',
  'quote',
  'code',
  'divider',
  'callout',
  'link-preview',
  'image-reference',
  'file-reference',
  'audio-reference',
  'note-reference',
  'table',
])
const INLINE_MARKS = new Set<VaultInlineMarkType>(['bold', 'italic', 'underline', 'strikethrough', 'code', 'link', 'note-reference'])
const MAX_BLOCKS = 500
const MAX_BLOCK_TEXT = 20_000
const MAX_DOCUMENT_BYTES = 250_000
const MAX_DEPTH = 12
const ID_PATTERN = /^[A-Za-z0-9._:-]{1,120}$/

export type VaultDocumentValidationResult = {
  valid: boolean
  issues: string[]
  document?: VaultStructuredDocument
}

export function createDocumentFromText(text: string): VaultStructuredDocument {
  return {
    schemaVersion: '1.0.0',
    blocks: text.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => ({
      id: `block-${index + 1}`,
      type: 'paragraph',
      text: paragraph.trim(),
    })),
  }
}

export function validateStructuredDocument(input: unknown): VaultDocumentValidationResult {
  const issues: string[] = []
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {valid: false, issues: ['DOCUMENT_NOT_OBJECT']}
  let encoded: string
  try {
    encoded = JSON.stringify(input)
  } catch {
    return {valid: false, issues: ['DOCUMENT_NOT_SERIALIZABLE']}
  }
  if (Buffer.byteLength(encoded, 'utf8') > MAX_DOCUMENT_BYTES) issues.push('DOCUMENT_TOO_LARGE')
  if (depth(input) > MAX_DEPTH) issues.push('DOCUMENT_TOO_DEEP')
  const document = input as Partial<VaultStructuredDocument>
  if (document.schemaVersion !== '1.0.0') issues.push('UNSUPPORTED_DOCUMENT_SCHEMA')
  if (!Array.isArray(document.blocks)) {
    issues.push('INVALID_BLOCKS')
    return {valid: false, issues}
  }
  if (document.blocks.length > MAX_BLOCKS) issues.push('INVALID_BLOCKS')
  const seen = new Set<string>()
  for (const [index, block] of document.blocks.entries()) validateBlock(block, index, seen, issues)
  return {valid: issues.length === 0, issues, document: issues.length === 0 ? document as VaultStructuredDocument : undefined}
}

export function plainTextProjection(document: VaultStructuredDocument): string {
  return document.blocks.map(block => {
    if (block.type === 'divider') return ''
    if (block.type === 'table') return [block.columns ?? [], ...(block.rows ?? [])].flat().join('\t')
    if (block.items?.length) return block.items.join('\n')
    if (block.inlines?.length) return block.inlines.map(item => item.text).join('')
    return block.text ?? block.title ?? block.url ?? ''
  }).join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

export function documentContentHash(document: VaultStructuredDocument): string {
  return createHash('sha256').update(JSON.stringify(document), 'utf8').digest('hex')
}

export function renderBlockPreview(block: Record<string, unknown>): {kind: 'supported' | 'unsupported'; text: string} {
  if (typeof block.type !== 'string' || !BLOCK_TYPES.has(block.type as VaultDocumentBlockType)) {
    return {kind: 'unsupported', text: 'Unsupported content'}
  }
  const valid = validateStructuredDocument({schemaVersion: '1.0.0', blocks: [block]})
  if (!valid.valid) return {kind: 'unsupported', text: 'Unsupported content'}
  const typed = block as VaultDocumentBlock
  return {kind: 'supported', text: typed.text ?? typed.title ?? typed.url ?? ''}
}

function validateBlock(input: unknown, index: number, seen: Set<string>, issues: string[]): void {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    issues.push(`BLOCK_${index}_NOT_OBJECT`)
    return
  }
  const block = input as Partial<VaultDocumentBlock>
  if (typeof block.id !== 'string' || !ID_PATTERN.test(block.id)) issues.push(`BLOCK_${index}_INVALID_ID`)
  else if (seen.has(block.id)) issues.push(`BLOCK_${index}_DUPLICATE_ID`)
  else seen.add(block.id)
  if (typeof block.type !== 'string' || !BLOCK_TYPES.has(block.type as VaultDocumentBlockType)) issues.push(`BLOCK_${index}_UNKNOWN_TYPE`)
  if (block.text !== undefined && (typeof block.text !== 'string' || block.text.length > MAX_BLOCK_TEXT)) issues.push(`BLOCK_${index}_INVALID_TEXT`)
  if (block.level !== undefined && ![1, 2, 3].includes(block.level)) issues.push(`BLOCK_${index}_INVALID_LEVEL`)
  if (block.items !== undefined && (!Array.isArray(block.items) || block.items.length > 200 || !block.items.every(item => typeof item === 'string' && item.length <= 2000))) issues.push(`BLOCK_${index}_INVALID_ITEMS`)
  if (block.checked !== undefined && (!Array.isArray(block.checked) || !block.checked.every(item => typeof item === 'boolean'))) issues.push(`BLOCK_${index}_INVALID_CHECKED`)
  if (Array.isArray(block.checked) && Array.isArray(block.items) && block.checked.length !== block.items.length) issues.push(`BLOCK_${index}_CHECKLIST_LENGTH_MISMATCH`)
  if (block.url !== undefined && !safeUrl(block.url)) issues.push(`BLOCK_${index}_UNSAFE_URL`)
  if (block.attachmentId !== undefined && (typeof block.attachmentId !== 'string' || !ID_PATTERN.test(block.attachmentId))) issues.push(`BLOCK_${index}_INVALID_ATTACHMENT_ID`)
  if (block.sourceRef !== undefined && (typeof block.sourceRef !== 'string' || !/^[A-Za-z0-9._:-]{1,180}$/.test(block.sourceRef))) issues.push(`BLOCK_${index}_INVALID_SOURCE_REFERENCE`)
  if (block.targetNoteId !== undefined && (typeof block.targetNoteId !== 'string' || !ID_PATTERN.test(block.targetNoteId))) issues.push(`BLOCK_${index}_INVALID_NOTE_REFERENCE`)
  if (block.mimeType !== undefined && (typeof block.mimeType !== 'string' || !/^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(block.mimeType))) issues.push(`BLOCK_${index}_INVALID_MIME_TYPE`)
  if (block.durationMs !== undefined && (!Number.isInteger(block.durationMs) || block.durationMs < 0 || block.durationMs > 86_400_000)) issues.push(`BLOCK_${index}_INVALID_DURATION`)
  if (block.columns !== undefined && (!Array.isArray(block.columns) || block.columns.length < 1 || block.columns.length > 50 || !block.columns.every(cell => typeof cell === 'string' && cell.length <= 2000))) issues.push(`BLOCK_${index}_INVALID_COLUMNS`)
  if (block.rows !== undefined && (!Array.isArray(block.rows) || block.rows.length > 1000 || !block.rows.every(row => Array.isArray(row) && Array.isArray(block.columns) && row.length === block.columns.length && row.every(cell => typeof cell === 'string' && cell.length <= 2000)))) issues.push(`BLOCK_${index}_INVALID_ROWS`)
  if (block.type === 'table' && (!block.columns || !block.rows)) issues.push(`BLOCK_${index}_INCOMPLETE_TABLE`)
  if (block.type === 'note-reference' && !block.targetNoteId) issues.push(`BLOCK_${index}_MISSING_NOTE_REFERENCE`)
  if (['image-reference', 'file-reference', 'audio-reference'].includes(String(block.type)) && !block.attachmentId && !block.sourceRef) issues.push(`BLOCK_${index}_MISSING_ATTACHMENT_REFERENCE`)
  if (block.inlines !== undefined) {
    if (!Array.isArray(block.inlines) || block.inlines.length > 1000) issues.push(`BLOCK_${index}_INVALID_INLINES`)
    else {
      for (const [inlineIndex, inline] of block.inlines.entries()) {
        if (!inline || typeof inline !== 'object' || Array.isArray(inline) || typeof inline.text !== 'string') {
          issues.push(`BLOCK_${index}_INLINE_${inlineIndex}_INVALID`)
          continue
        }
        const marks: unknown = inline.marks
        if (marks !== undefined && !Array.isArray(marks)) {
          issues.push(`BLOCK_${index}_INLINE_${inlineIndex}_INVALID_MARKS`)
          continue
        }
        for (const mark of marks ?? []) {
          if (!mark || typeof mark !== 'object' || Array.isArray(mark)) {
            issues.push(`BLOCK_${index}_INLINE_${inlineIndex}_UNKNOWN_MARK`)
            continue
          }
          const candidate = mark as {type?: VaultInlineMarkType; href?: string; noteId?: string}
          if (!INLINE_MARKS.has(candidate.type as VaultInlineMarkType)) issues.push(`BLOCK_${index}_INLINE_${inlineIndex}_UNKNOWN_MARK`)
          if (candidate.type === 'link' && !safeUrl(candidate.href)) issues.push(`BLOCK_${index}_INLINE_${inlineIndex}_UNSAFE_LINK`)
          if (candidate.type === 'note-reference' && (typeof candidate.noteId !== 'string' || !ID_PATTERN.test(candidate.noteId))) issues.push(`BLOCK_${index}_INLINE_${inlineIndex}_INVALID_NOTE_REFERENCE`)
        }
      }
    }
  }
}

function safeUrl(value: unknown): boolean {
  if (typeof value !== 'string' || value.length > 2048) return false
  try {
    const parsed = new URL(value)
    return ['https:', 'http:', 'mailto:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

function depth(value: unknown, level = 0): number {
  if (!value || typeof value !== 'object') return level
  return Math.max(level, ...Object.values(value as Record<string, unknown>).map(child => depth(child, level + 1)))
}

