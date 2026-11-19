const STORAGE_KEY = 'leonida-field-guide-v1';
const FORMAT_VERSION = 1;
const MAX_BACKUP_BYTES = 100000;

function emptyProgress() {
  return { earned: new Set(), spoilers: true };
}

function progressRecord(state) {
  return {
    version: FORMAT_VERSION,
    earned: [...state.earned],
    spoilers: state.spoilers !== false
  };
}

function decodeRecord(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    throw new Error('Choose a valid trophy progress backup.');
  }
  if (!Array.isArray(record.earned)) {
    throw new Error('The backup needs a valid trophy list.');
  }
  if (record.earned.some(name => typeof name !== 'string')) {
    throw new Error('Every entry must be a valid trophy name.');
  }
  if (record.version !== undefined && record.version !== FORMAT_VERSION) {
    throw new Error('This progress backup uses an unsupported version.');
  }
  if (record.spoilers !== undefined && typeof record.spoilers !== 'boolean') {
    throw new Error('The spoiler setting must be true or false.');
  }
  return {
    earned: new Set(record.earned),
    spoilers: record.spoilers
  };
}

export function readProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyProgress();
    const decoded = decodeRecord(JSON.parse(stored));
    return {
      earned: decoded.earned,
      spoilers: decoded.spoilers !== false
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(state) {
  try {
    const record = progressRecord(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}

export function exportProgress(state) {
  const record = {
    ...progressRecord(state),
    application: 'Leonida Field Guide',
    exportedAt: new Date().toISOString()
  };
  const payload = JSON.stringify(record, null, 2) + '\n';
  const blob = new Blob([payload], { type: 'application/json' });
  const objectUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = objectUrl;
  downloadLink.download = 'leonida-progress.json';
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export async function importProgress(file, trophies) {
  if (file.size > MAX_BACKUP_BYTES) {
    throw new Error('This backup is too large for a valid trophy progress file.');
  }
  let record;
  try {
    record = JSON.parse(await file.text());
  } catch {
    throw new Error('Choose a valid trophy progress JSON file.');
  }
  const decoded = decodeRecord(record);
  const officialNames = new Set(trophies.map(trophy => trophy.name));
  for (const name of decoded.earned) {
    if (!officialNames.has(name)) {
      throw new Error('The backup contains a name that is not a valid trophy.');
    }
  }
  return decoded;
}
