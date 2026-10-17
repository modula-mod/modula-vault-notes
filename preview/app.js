const state = {
  view: new URLSearchParams(location.search).get('view') || 'home',
  panel: new URLSearchParams(location.search).get('panel') || 'properties',
  commandOpen: new URLSearchParams(location.search).get('command') === '1',
  artifact: null,
}

const notes = [
  {id: 'architecture', title: 'Modula Platform — V1 Architecture', preview: 'The contract freeze, runtime boundaries, recovery model, and Native handoff.', folder: 'Projects / Modula Platform', tags: ['architecture', 'greenfield', 'v1'], updated: 'Just now'},
  {id: 'native', title: 'ModuleHost Native integration', preview: 'Renderer capability map and the first physical-device acceptance path.', folder: 'Projects / Modula Platform', tags: ['native', 'modulehost'], updated: '18 min'},
  {id: 'recovery', title: 'Disaster recovery drill', preview: 'Clean PostgreSQL restore, API boot, worker replay, media and artifacts.', folder: 'Projects / Arch Services', tags: ['operations', 'recovery'], updated: 'Yesterday'},
  {id: 'research', title: 'Local intelligence constraints', preview: 'Nodus executes localOnly requests without remote provider fallback.', folder: 'Research', tags: ['privacy', 'nodus'], updated: 'Mon'},
  {id: 'daily', title: '2026-10-15', preview: 'Closeout checks, Vault preview, contract fixtures, and follow-up notes.', folder: 'Daily Notes', tags: ['daily'], updated: 'Today'},
  {id: 'personal', title: 'Reading list', preview: 'Systems papers, design references, and saved sources.', folder: 'Personal', tags: ['reading'], updated: 'Oct 12'},
]

const icons = {notes: '◫', daily: '◷', projects: '◇', research: '⌁', personal: '○', search: '⌕', graph: '⌘', attachments: '⌑', history: '↺', settings: '⚙'}

async function boot() {
  try {
    const response = await fetch('/frontend/frontend.manifest.json', {cache: 'no-store'})
    if (!response.ok) throw new Error(`artifact HTTP ${response.status}`)
    const artifact = await response.json()
    if (artifact.productId !== 'digital.modula.vault-notes' || artifact.releaseVersion !== '2.0.0-rc.2') {
      throw new Error('preview artifact identity mismatch')
    }
    state.artifact = artifact
    render()
  } catch (error) {
    document.querySelector('#app').innerHTML = `<main class="focused-view"><h1>Preview unavailable</h1><p>${escapeHtml(error instanceof Error ? error.message : String(error))}</p></main>`
  }
}

function render() {
  const app = document.querySelector('#app')
  app.innerHTML = `<div class="preview-shell">${titlebar()}<div class="workspace">${sidebar()}${mainContent()}${inspector()}</div>${commandMenu()}</div>`
  bindEvents()
}

function titlebar() {
  const routeCount = state.artifact?.routes?.length ?? 0
  return `<header class="titlebar">
    <div class="brand"><div class="brand-mark">V</div><span class="brand-copy">Vault Notes 2.0</span><span class="preview-badge">2.0.0-rc.2 · Private preview</span></div>
    <div class="title-actions"><button class="soft-button" data-view="search">${icons.search}<span>Search</span></button><button class="command-button" data-command="open"><span>Command menu</span><span class="key">⌘ K</span></button><span class="preview-badge">${routeCount} MPS routes</span><button class="primary-button" data-view="editor">New note</button></div>
  </header>`
}

function sidebar() {
  return `<aside class="sidebar" aria-label="Vault collections">
    <section class="sidebar-section"><p class="section-label">Workspace</p>
      ${nav('home', icons.notes, 'All Notes', '42')}
      ${nav('daily', icons.daily, 'Daily Notes', '15')}
      ${nav('projects', icons.projects, 'Projects', '12')}
      <button class="nav-item"><span class="nav-icon">↳</span>Modula Platform<span class="nav-count">7</span></button>
      <button class="nav-item"><span class="nav-icon">↳</span>Arch Services<span class="nav-count">5</span></button>
      ${nav('research', icons.research, 'Research', '8')}
      ${nav('personal', icons.personal, 'Personal', '5')}
    </section>
    <section class="sidebar-section"><p class="section-label">Explore</p>
      ${nav('search', icons.search, 'Advanced Search')}
      ${nav('graph', icons.graph, 'Knowledge Graph')}
      ${nav('attachments', icons.attachments, 'Attachments')}
      ${nav('history', icons.history, 'Revision History')}
    </section>
    <section class="sidebar-section"><p class="section-label">Saved searches</p>
      <button class="nav-item"><span class="nav-icon">⌁</span>Architecture + V1<span class="nav-count">6</span></button>
      <button class="nav-item"><span class="nav-icon">⌁</span>Open decisions<span class="nav-count">3</span></button>
    </section>
    <div class="sync-card"><strong><span class="status-dot"></span>GreenField synced</strong><p>Signed cursor current · 0 pending mutations · localOnly respected</p></div>
  </aside>`
}

function nav(view, icon, label, count = '') {
  return `<button class="nav-item ${state.view === view ? 'active' : ''}" data-view="${view}"><span class="nav-icon">${icon}</span>${label}${count ? `<span class="nav-count">${count}</span>` : ''}</button>`
}

function noteList() {
  return `<section class="notes-pane"><div class="pane-heading"><div><h1>Notes</h1><span class="subtle">42 private records</span></div><button class="icon-button" aria-label="List options">•••</button></div>
    <label class="search-box">${icons.search}<input aria-label="Filter notes" placeholder="Filter notes" /></label>
    <div class="note-list">${notes.map((note, index) => `<article class="note-item ${index === 0 ? 'selected' : ''}" data-view="home"><h3>${note.title}</h3><p>${note.preview}</p><div class="meta-line"><span>${note.folder}</span><span>${note.updated}</span></div></article>`).join('')}</div>
  </section>`
}

function mainContent() {
  if (['search', 'history', 'attachments', 'graph'].includes(state.view)) return focusedView()
  return `${noteList()}${documentView()}`
}

function documentView() {
  return `<main class="document-pane"><div class="document-toolbar"><div class="toolbar"><button class="icon-button">←</button><button class="icon-button"><strong>B</strong></button><button class="icon-button"><em>I</em></button><button class="icon-button">H₂</button><button class="icon-button">☑</button><button class="icon-button">↗</button></div><div class="toolbar"><span class="subtle">Saved · revision 18</span><button class="soft-button" data-view="history">${icons.history} History</button><button class="soft-button">Share</button></div></div>
    <article class="document"><div class="eyebrow">Architecture note</div><h1 class="document-title">Modula Platform — V1 Architecture</h1><div class="document-meta">Updated just now · 1,284 words · Private</div><div class="chips"><span class="chip">#architecture</span><span class="chip">#greenfield</span><span class="chip">#v1</span><span class="chip">Status · Frozen candidate</span></div>
      <div class="document-body"><p>GreenField is the contract boundary beneath Modula Native: identity, trusted distribution, generic records, deterministic sync, governed execution, and recovery are platform responsibilities.</p>
      <div class="callout"><strong>V1 closeout principle</strong><br />Native must be able to trust public behavior without reverse-engineering the server or depending on a Vault-specific backend path.</div>
      <h2>Runtime boundaries</h2><p>The generic ModuleHost consumes a signed release descriptor and semantic Product UI artifact. Vault asks for <a href="#">RichDocumentEditor</a>, <a href="#">ReferencePicker</a>, <a href="#">RevisionBrowser</a>, and <a href="#">AttachmentGallery</a>; the host decides how each capability renders.</p>
      <div class="checklist"><div class="check"><span>✓</span><div><strong>Contract freeze</strong><br /><span class="subtle">DTOs, error codes, cursors, permissions, and compatibility reasons</span></div></div><div class="check"><span>✓</span><div><strong>Recovery proof</strong><br /><span class="subtle">Database, artifacts, media, configuration, API and worker boot</span></div></div><div class="check"><span>✓</span><div><strong>Trust chain</strong><br /><span class="subtle">Immutable artifact digests, signer state, revocation, and provenance</span></div></div></div>
      <h2>Native handoff</h2><p>The first native integration should render this note cache-first, replay offline mutations with stable mutation IDs, and surface revision conflicts without discarding either copy.</p>
      <div class="reference-card"><strong>↗ ModuleHost Native integration</strong><span>Reference · Projects / Modula Platform · updated 18 minutes ago</span></div>
      <div class="reference-card"><strong>⌑ greenfield-v1-topology.pdf</strong><span>PDF · 2.4 MB · SHA-256 verified · authorized media binding</span></div>
      </div></article></main>`
}

function inspector() {
  if (['search', 'history', 'attachments', 'graph'].includes(state.view)) return ''
  return `<aside class="inspector"><div class="inspector-tabs"><button class="tab-button ${state.panel === 'properties' ? 'active' : ''}" data-panel="properties">Properties</button><button class="tab-button ${state.panel === 'backlinks' ? 'active' : ''}" data-panel="backlinks">Backlinks</button><button class="tab-button ${state.panel === 'related' ? 'active' : ''}" data-panel="related">Related</button></div>${inspectorContent()}</aside>`
}

function inspectorContent() {
  if (state.panel === 'backlinks') return `<div class="inspector-content"><h2>Backlinks · 3</h2><div class="backlink"><strong>ModuleHost Native integration</strong><p>“...consume the frozen V1 architecture contract...”</p><span class="field-path">document.blocks[4].reference</span></div><div class="backlink"><strong>Disaster recovery drill</strong><p>“Architecture note defines the restore boundary.”</p><span class="field-path">relatedArchitecture</span></div><div class="backlink"><strong>2026-10-15</strong><p>Closeout checklist links the hero note.</p><span class="field-path">document.blocks[2].references[0]</span></div></div>`
  if (state.panel === 'related') return `<div class="inspector-content"><h2>Related notes</h2><div class="backlink"><strong>ModuleHost Native integration</strong><p>8 shared references · architecture, Native</p></div><div class="backlink"><strong>Disaster recovery drill</strong><p>5 shared references · operations, recovery</p></div><div class="backlink"><strong>Local intelligence constraints</strong><p>3 shared references · privacy, Nodus</p></div><p class="subtle">Deterministic relationship score. No remote model request.</p></div>`
  return `<div class="inspector-content"><h2>Properties</h2><dl class="property-grid"><div class="property"><dt>Status</dt><dd><span class="chip">Frozen candidate</span></dd></div><div class="property"><dt>Owner</dt><dd>Modula</dd></div><div class="property"><dt>Area</dt><dd>GreenField</dd></div><div class="property"><dt>Review date</dt><dd>15 Oct 2026</dd></div><div class="property"><dt>Priority</dt><dd>Critical</dd></div><div class="property"><dt>References</dt><dd>7 outgoing · 3 backlinks</dd></div><div class="property"><dt>Attachments</dt><dd>1 PDF · digest verified</dd></div><div class="property"><dt>Policy</dt><dd>preferLocal</dd></div></dl><h2 class="section-spacer">Nodus actions</h2><div class="chips"><button class="soft-button">Summarize</button><button class="soft-button">Extract tasks</button><button class="soft-button">Suggest tags</button></div><p class="subtle">On VPS, localOnly returns CAPABILITY_UNAVAILABLE. No remote fallback.</p></div>`
}

function focusedView() {
  if (state.view === 'search') return searchView()
  if (state.view === 'history') return historyView()
  if (state.view === 'attachments') return attachmentsView()
  return graphView()
}

function searchView() {
  return `<main class="focused-view"><div class="search-stage"><div class="view-header"><div><h1 class="view-title">Search</h1><p class="view-subtitle">Generic GreenField projection with authoritative access checks</p></div><button class="soft-button">Save search</button></div><section class="search-hero"><div class="eyebrow">Advanced search</div><h2>Find anything in your Vault</h2><label class="search-box">${icons.search}<input value="platform architecture" aria-label="Search Vault" /></label><div class="filter-row"><span class="filter-pill active">All notes · 6</span><span class="filter-pill">#architecture</span><span class="filter-pill">Projects</span><span class="filter-pill">Has attachments</span><span class="filter-pill">Updated this week</span></div><div class="results"><div class="search-result"><strong>Modula <mark>Platform</mark> — V1 <mark>Architecture</mark></strong><p>GreenField is the contract boundary beneath Modula Native: identity, trusted distribution...</p><div class="meta-line"><span>Projects / Modula Platform · #architecture #v1</span><span>98%</span></div></div><div class="search-result"><strong>ModuleHost Native integration</strong><p>The first native integration consumes the frozen <mark>platform</mark> contract...</p><div class="meta-line"><span>Projects / Modula Platform · #native</span><span>84%</span></div></div><div class="search-result"><strong>Disaster recovery drill</strong><p>The production <mark>architecture</mark> can be reconstructed from clean storage...</p><div class="meta-line"><span>Projects / Arch Services · #recovery</span><span>73%</span></div></div></div></section></div></main>`
}

function historyView() {
  return `<main class="focused-view"><div class="history-stage"><div class="view-header"><div><h1 class="view-title">Revision history</h1><p class="view-subtitle">Modula Platform — V1 Architecture · immutable history</p></div><button class="soft-button" data-view="home">Back to note</button></div><div class="history-layout"><div><div class="history-item"><strong>Revision 18 · Current</strong><p>Today, 10:42 · Preview Operator<br />Added Native handoff and recovery evidence.</p></div><div class="history-item"><strong>Revision 17</strong><p>Today, 09:18 · Preview Operator<br />Refined trust-chain boundaries.</p></div><div class="history-item"><strong>Revision 12</strong><p>Yesterday, 18:04 · Preview Operator<br />Contract freeze draft.</p></div><div class="history-item"><strong>Revision 1</strong><p>12 Oct, 14:20 · Preview Operator<br />Created note.</p></div></div><section class="revision-preview"><div class="eyebrow">Revision 17</div><h2>Compare with current</h2><p class="subtle">Base revision 16 · resulting revision 17 · mutation ID retained</p><div class="document-body"><h2>Trust chain</h2><p>Every published release carries immutable package and frontend digests.</p><p class="diff-add">+ Signer and release revocation are evaluated again at authorization time.</p><p class="diff-add">+ Provenance is never fabricated during recovery or re-signing.</p></div><button class="primary-button">Restore as revision 19</button><p class="subtle">Restore appends a new revision; revision 17 remains immutable.</p></section></div></div></main>`
}

function attachmentsView() {
  const cards = [['▧','greenfield-v1-topology.pdf','PDF · 2.4 MB · digest verified'],['◉','closeout-soak-results.csv','Data · 184 KB · authorized'],['◍','architecture-review.m4a','Audio · 12:48 · metadata ready'],['▤','native-contract-fixtures.json','JSON · 42 KB · 13 fixtures'],['▧','recovery-runbook.pdf','PDF · 1.1 MB · digest verified'],['◫','vault-cover.png','Image · 1.8 MB · bound to note']]
  return `<main class="focused-view"><div class="attachments-stage"><div class="view-header"><div><h1 class="view-title">Attachments</h1><p class="view-subtitle">Authorized record-media bindings · asset IDs never grant access</p></div><button class="primary-button">Attach file</button></div><div class="attachment-grid">${cards.map(card => `<article class="attachment-card"><div class="attachment-thumb">${card[0]}</div><strong>${card[1]}</strong><p>${card[2]}</p></article>`).join('')}</div></div></main>`
}

function graphView() {
  const nodes = [[50,48,'V1 Architecture',true],[25,26,'ModuleHost',false],[75,24,'Recovery drill',false],[19,67,'Product UI',false],[80,70,'Trust chain',false],[49,82,'Nodus privacy',false],[48,14,'Contract freeze',false]]
  const edges = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,3],[2,4],[4,6]]
  return `<main class="focused-view"><div class="view-header"><div><h1 class="view-title">Knowledge graph</h1><p class="view-subtitle">Generic record relationships · inaccessible and deleted notes omitted</p></div><div class="toolbar"><button class="soft-button">1 hop</button><button class="soft-button">Fit graph</button></div></div><section class="graph-stage"><svg viewBox="0 0 1000 620" role="img" aria-label="Vault Notes relationship graph">${edges.map(([a,b]) => `<line class="graph-edge" x1="${nodes[a][0]*10}" y1="${nodes[a][1]*6.2}" x2="${nodes[b][0]*10}" y2="${nodes[b][1]*6.2}" />`).join('')}${nodes.map(([x,y,label,hero]) => `<g><circle class="graph-node ${hero ? 'hero' : ''}" cx="${x*10}" cy="${y*6.2}" r="${hero ? 54 : 38}"/><text class="graph-label ${hero ? 'hero' : ''}" x="${x*10}" y="${y*6.2+4}">${label}</text></g>`).join('')}</svg></section></main>`
}

function commandMenu() {
  if (!state.commandOpen) return ''
  return `<div class="command-overlay" data-command="close"><section class="command-dialog" role="dialog" aria-modal="true" aria-label="Vault command menu"><input class="command-input" value="" placeholder="Search commands and notes…" autofocus /><div class="command-list"><div class="command-item selected"><span>＋</span><strong>Create new note</strong><span>⌘ N</span></div><div class="command-item"><span>⌕</span><strong>Search Vault</strong><span>⌘ F</span></div><div class="command-item"><span>↗</span><strong>Open “ModuleHost Native integration”</strong><span>Return</span></div><div class="command-item"><span>✦</span><strong>Summarize current note with Nodus</strong><span>localOnly</span></div><div class="command-item"><span>↺</span><strong>Open revision history</strong><span>18 revisions</span></div></div><div class="command-hint"><span>↑ ↓ Navigate · ↵ Open</span><span>Esc Close</span></div></section></div>`
}

function bindEvents() {
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.view)))
  document.querySelectorAll('[data-panel]').forEach(button => button.addEventListener('click', () => { state.panel = button.dataset.panel; render() }))
  document.querySelectorAll('[data-command="open"]').forEach(button => button.addEventListener('click', () => { state.commandOpen = true; render() }))
  document.querySelectorAll('[data-command="close"]').forEach(overlay => overlay.addEventListener('click', event => { if (event.target === overlay) { state.commandOpen = false; render() } }))
  document.onkeydown = event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); state.commandOpen = true; render() }
    if (event.key === 'Escape' && state.commandOpen) { state.commandOpen = false; render() }
  }
}

function navigate(view) {
  const url = new URL(location.href)
  url.searchParams.set('view', view)
  if (view !== 'home') url.searchParams.delete('panel')
  history.pushState({}, '', url)
  state.view = view
  state.commandOpen = false
  render()
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]))
}

boot()
