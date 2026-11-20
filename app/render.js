// Rendering helpers for Leonida Legend: grade labels, source citations and trophy row/detail
// markup. Kept separate from app.js so the tracker logic stays small and readable.

export const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

export const GRADE_LABEL = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export function gradeCounts(trophies, earned) {
  const counts = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const t of trophies) {
    counts[t.grade][1] += 1;
    if (earned.has(t.id)) counts[t.grade][0] += 1;
  }
  return counts;
}

export function isMasked(trophy, earned, spoilerOn) {
  // Spoiler rule: story trophies stay hidden until earned while the setting is on.
  return spoilerOn && trophy.kind === 'story' && !earned.has(trophy.id);
}

export function displayName(trophy, earned, spoilerOn) {
  return isMasked(trophy, earned, spoilerOn) ? 'Hidden story trophy' : trophy.name;
}

export function displayDescription(trophy, earned, spoilerOn) {
  return isMasked(trophy, earned, spoilerOn)
    ? 'Story trophy — earn it to reveal its official name and description.'
    : trophy.description;
}

export function sourceNodes(trophy, doc) {
  // Render each citation beside the guide: a real link when the source has a URL,
  // plain text for the in-game official list. The app itself fetches nothing.
  const frag = doc.createElement('span');
  frag.className = 'sources';
  const label = doc.createElement('span');
  label.className = 'sources-label';
  label.textContent = 'Sources: ';
  frag.append(label);
  (trophy.sources || []).forEach((s, i) => {
    if (i > 0) frag.append(doc.createTextNode(' · '));
    if (s && s.url) {
      const a = doc.createElement('a');
      a.href = s.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = s.name;
      frag.append(a);
    } else {
      const span = doc.createElement('span');
      span.textContent = (s && s.name) || String(s);
      frag.append(span);
    }
  });
  return frag;
}

export function el(doc, tag, className, text) {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}
