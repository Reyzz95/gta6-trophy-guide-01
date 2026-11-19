const STORAGE_KEY = 'leonida-field-guide-v1';
export function readProgress() {
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY)); return { earned: new Set(Array.isArray(value?.earned) ? value.earned : []), spoilers: value?.spoilers !== false }; }
  catch { return { earned: new Set(), spoilers: true }; }
}
export function saveProgress(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ earned: [...state.earned], spoilers: state.spoilers })); return true; }
  catch { return false; }
}
export function exportProgress(state) {
  const content = { format: 'leonida-progress-v1', earned: [...state.earned], spoilers: state.spoilers };
  const url = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: 'leonida-trophy-progress.json' });
  link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function importProgress(file, trophies) {
  const content = JSON.parse(await file.text());
  if (!content || typeof content !== 'object') throw new Error('Choose a valid trophy progress file. Nothing was changed.');
  const names = Array.isArray(content) ? content : content.earned;
  const officialNames = new Set(trophies.map(t => t.name));
  if (!Array.isArray(names) || names.some(name => typeof name !== 'string' || !officialNames.has(name))) throw new Error('Choose a valid trophy progress file. Nothing was changed.');
  return { earned: new Set(names), spoilers: typeof content.spoilers === 'boolean' ? content.spoilers : undefined };
}
