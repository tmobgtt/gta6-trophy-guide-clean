// Leonida Legend — GTA VI Trophy Guide & Tracker.
// Offline checklist over the 55 official PS5 trophies: progress saved in localStorage,
// export/import as a file, search, kind and grade filters, hide-earned, a spoiler shield
// that masks story trophies until earned, a six-stage roadmap view and a missables view.
// URL params for shareable views and screenshots: ?view=tracker|roadmap|missables,
// ?open=<id>, ?spoiler=1, ?filter=<kind>, ?demo=1 (seeds a demo earned set).
import { ROADMAP_STAGES } from './roadmap.js';
import { GRADE_LABEL, displayDescription, displayName, el, gradeCounts, isMasked, sourceNodes } from './render.js';

const KEY = 'leonida-legend-progress-v1';
const LEGACY_KEY = 'gta6-trophy-checklist';
const params = new URLSearchParams(location.search);

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));

// --- earned state -----------------------------------------------------------
function loadEarned() {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Entries may be trophy ids (this app) or names (starter checklist); accept both.
    return new Set(parsed.map((v) => (typeof v === 'number' ? v : (trophies.find((t) => t.name === v)?.id))).filter((v) => byId.has(v)));
  } catch {
    return new Set();
  }
}
let earned = loadEarned();
if (params.get('demo') === '1' && !localStorage.getItem(KEY)) {
  earned = new Set([2, 3, 8, 15, 17, 28, 30, 35]);
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}
function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

// --- controls state ---------------------------------------------------------
let view = ['tracker', 'roadmap', 'missables'].includes(params.get('view')) ? params.get('view') : 'tracker';
let kind = params.get('filter') || 'all';
let selectedId = Number(params.get('open')) || null;
const spoilerEl = document.getElementById('spoiler');
// Spoiler shield is opt-in via the toggle, and ?spoiler=1 turns it on (the spoiler screenshot uses it).
spoilerEl.checked = params.get('spoiler') === '1';

const rowsEl = document.getElementById('rows');
const detailEl = document.getElementById('detail');

function matches(t) {
  if (kind === 'missable' && !t.missable) return false;
  if (kind === 'online') return false; // the official PS5 list names no online trophies
  if (kind !== 'all' && kind !== 'missable' && t.kind !== kind) return false;
  const grade = document.getElementById('grade').value;
  if (grade !== 'all' && t.grade !== grade) return false;
  if (document.getElementById('hide-earned').checked && earned.has(t.id)) return false;
  const q = document.getElementById('search').value.trim().toLowerCase();
  if (q && !`${t.name} ${t.description} ${t.target || ''}`.toLowerCase().includes(q)) return false;
  return true;
}

function renderProgress() {
  const pct = Math.round((earned.size / trophies.length) * 100);
  document.getElementById('progress').textContent = `${earned.size} of ${trophies.length} earned · ${pct}%`;
  document.getElementById('bar-fill').style.width = `${pct}%`;
  const c = gradeCounts(trophies, earned);
  document.getElementById('grade-counts').textContent =
    `Platinum ${c.platinum[0]}/${c.platinum[1]} · Gold ${c.gold[0]}/${c.gold[1]} · Silver ${c.silver[0]}/${c.silver[1]} · Bronze ${c.bronze[0]}/${c.bronze[1]} — 1P / 2G / 6S / 46B in the official list`;
}

function badge(text, cls) {
  return el(document, 'span', `badge ${cls}`, text);
}

function renderList() {
  rowsEl.replaceChildren();
  const spoilerOn = spoilerEl.checked;
  let shown = 0;
  for (const t of trophies) {
    if (!matches(t)) continue;
    shown += 1;
    const row = el(document, 'div', `row${earned.has(t.id) ? ' earned' : ''}${t.id === selectedId ? ' selected' : ''}`);
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${t.name} earned`);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      save(); render();
    });
    const main = el(document, 'div');
    main.append(el(document, 'div', 'tname', displayName(t, earned, spoilerOn)));
    main.append(el(document, 'div', 'tdesc', displayDescription(t, earned, spoilerOn)));
    if (t.target) main.append(el(document, 'div', 'tdesc', `Target: ${t.target}`));
    const badges = el(document, 'div', 'badges');
    badges.append(badge(GRADE_LABEL[t.grade], t.grade));
    badges.append(badge(t.kind, 'kind'));
    badges.append(badge(`Stage ${t.stage}`, 'stage'));
    if (t.missable) badges.append(badge('MISSABLE', 'miss'));
    row.append(box, main, badges);
    row.addEventListener('click', () => { selectedId = t.id; render(); });
    rowsEl.append(row);
  }
  const empty = document.getElementById('empty');
  empty.hidden = shown !== 0;
  if (kind === 'online') {
    document.getElementById('empty-title').textContent = 'No online trophies in the official list';
    document.getElementById('empty-text').textContent =
      'The official PlayStation 5 list for GTA VI names no online trophies: all 55 are story, collectibles or activities. This filter stays here so the check is honest and instant if a list update ever adds one.';
  } else {
    document.getElementById('empty-title').textContent = 'No trophies match';
    document.getElementById('empty-text').textContent = 'Try a different filter or search.';
  }
  document.getElementById('list-summary').textContent =
    `Showing ${shown} of ${trophies.length} trophies · ${trophies.filter((t) => t.missable).length} flagged missable · spoiler shield ${spoilerOn ? 'ON — story trophies are hidden until earned' : 'off'}`;
}

function renderDetail() {
  const t = byId.get(selectedId);
  detailEl.replaceChildren();
  if (!t) {
    detailEl.append(el(document, 'p', 'detail-hint', 'Select a trophy to read its full guide, target, roadmap stage, missable caution and sources.'));
    return;
  }
  const spoilerOn = spoilerEl.checked;
  detailEl.append(el(document, 'h2', null, displayName(t, earned, spoilerOn)));
  detailEl.append(el(document, 'p', 'official', displayDescription(t, earned, spoilerOn)));
  const meta = el(document, 'p');
  meta.append(badge(GRADE_LABEL[t.grade], t.grade), document.createTextNode(' '), badge(t.kind, 'kind'), document.createTextNode(' '), badge(`Roadmap stage ${t.stage}`, 'stage'));
  if (t.missable) meta.append(document.createTextNode(' '), badge('MISSABLE', 'miss'));
  detailEl.append(meta);
  if (t.target) {
    detailEl.append(el(document, 'h3', null, 'Target'));
    detailEl.append(el(document, 'p', null, t.target));
  }
  detailEl.append(el(document, 'h3', null, 'Guide — in our own words'));
  detailEl.append(el(document, 'p', null, t.guide));
  if (t.missable && t.caution) {
    detailEl.append(el(document, 'h3', null, 'Missable caution'));
    detailEl.append(el(document, 'p', 'caution', t.caution));
  }
  detailEl.append(el(document, 'h3', null, 'Roadmap'));
  const stage = ROADMAP_STAGES.find((s) => s.n === t.stage);
  detailEl.append(el(document, 'p', null, `Stage ${t.stage}: ${stage ? stage.title : ''}`));
  detailEl.append(el(document, 'h3', null, 'Sources'));
  const src = el(document, 'p');
  src.append(sourceNodes(t, document));
  detailEl.append(src);
  const state = el(document, 'p', null, earned.has(t.id) ? 'Status: earned ✓ (saved in your browser)' : 'Status: not yet earned — tick its checkbox when you earn it.');
  detailEl.append(state);
}

function missableItem(t) {
  const box = el(document, 'div', 'miss-item');
  box.append(el(document, 'div', 'tname', `${t.name} — ${GRADE_LABEL[t.grade]} · Stage ${t.stage}`));
  box.append(el(document, 'p', null, `Official: ${t.description}`));
  if (t.caution) box.append(el(document, 'p', null, `Caution: ${t.caution}`));
  const src = el(document, 'p');
  src.append(sourceNodes(t, document));
  box.append(src);
  box.addEventListener('click', () => { selectedId = t.id; setView('tracker'); });
  return box;
}

function renderRoadmap() {
  const wrap = document.getElementById('roadmap');
  wrap.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const items = trophies.filter((t) => t.stage === stage.n);
    const done = items.filter((t) => earned.has(t.id)).length;
    const box = el(document, 'div', 'stage');
    const h = el(document, 'h3');
    h.append(el(document, 'span', 'n', `Stage ${stage.n} — `), document.createTextNode(`${stage.title} `));
    h.append(el(document, 'span', 'count', `(${done}/${items.length} earned)`));
    box.append(h);
    box.append(el(document, 'p', null, stage.summary));
    const chips = el(document, 'div');
    for (const t of items) {
      const chip = el(document, 'span', `tchip${earned.has(t.id) ? ' done' : ''}`, `${earned.has(t.id) ? '✓ ' : ''}${t.name}${t.missable ? ' ⚠' : ''}`);
      chip.addEventListener('click', () => { selectedId = t.id; setView('tracker'); });
      chips.append(chip);
    }
    box.append(chips);
    wrap.append(box);
  }
  const panel = document.getElementById('missables-panel');
  panel.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) panel.append(missableItem(t));
  const list = document.getElementById('missables-list');
  list.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) list.append(missableItem(t));
}

function setView(next) {
  view = next;
  for (const b of document.querySelectorAll('.view-btn')) b.classList.toggle('active', b.dataset.view === view);
  document.getElementById('view-tracker').hidden = view !== 'tracker';
  document.getElementById('view-roadmap').hidden = view !== 'roadmap';
  document.getElementById('view-missables').hidden = view !== 'missables';
  document.getElementById('controls').style.display = view === 'tracker' ? '' : 'none';
  render();
}

function render() {
  renderProgress();
  renderList();
  renderDetail();
  renderRoadmap();
  for (const b of document.querySelectorAll('.view-btn')) b.classList.toggle('active', b.dataset.view === view);
  document.getElementById('view-tracker').hidden = view !== 'tracker';
  document.getElementById('view-roadmap').hidden = view !== 'roadmap';
  document.getElementById('view-missables').hidden = view !== 'missables';
}

// --- wiring -----------------------------------------------------------------
for (const b of document.querySelectorAll('.view-btn')) b.addEventListener('click', () => setView(b.dataset.view));
for (const chip of document.querySelectorAll('#kind-chips .chip')) {
  chip.classList.toggle('active', chip.dataset.kind === kind);
  chip.addEventListener('click', () => {
    kind = chip.dataset.kind;
    for (const c of document.querySelectorAll('#kind-chips .chip')) c.classList.toggle('active', c === chip);
    render();
  });
}
document.getElementById('grade').addEventListener('change', render);
document.getElementById('hide-earned').addEventListener('change', render);
document.getElementById('search').addEventListener('input', render);
spoilerEl.addEventListener('change', render);
document.getElementById('export').addEventListener('click', () => {
  const payload = JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].map((id) => byId.get(id)?.name).filter(Boolean), ids: [...earned] }, null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  a.download = 'leonida-legend-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const list = Array.isArray(parsed) ? parsed : (parsed.ids || parsed.earned || []);
    earned = new Set(list.map((v) => (typeof v === 'number' ? v : (trophies.find((t) => t.name === v)?.id))).filter((v) => byId.has(v)));
    save(); render();
  } catch { /* ignore a file that is not progress JSON */ }
});

setView(view);
render();
