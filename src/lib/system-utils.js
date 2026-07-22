const path = require('path');

const POWER_DEFAULTS = Object.freeze({
  idleTimeout: 0,
  powerButtonAction: 'ask',
  lidAction: 'suspend',
  lidExternalAction: 'suspend',
  lidDockedAction: 'ignore'
});

function commandResult(error, stdout, stderr) {
  const cleanStdout = String(stdout || '').trim();
  const cleanStderr = String(stderr || '').trim();
  const diagnostic = [cleanStdout, cleanStderr].filter(Boolean).join('\n');
  return {
    ok: !error,
    message: error ? diagnostic || String(error?.message || error).trim() : cleanStdout || cleanStderr,
    stdout: cleanStdout,
    stderr: cleanStderr,
    code: error?.code ?? 0
  };
}

function rpmSignatureIsValid(result) {
  return Boolean(result?.ok && /Signature[^\n]*:\s*OK\s*$/im.test(String(result.message || '')));
}

function cleanBrowserUserAgent(userAgent) {
  return String(userAgent || '')
    .replace(/\s+(?:Electron|fedora-tv-os)\/[^\s]+/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function isSecureWebUrl(value) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function contentProviderForUrl(value) {
  try {
    const hostname = new URL(value).hostname.toLowerCase().replace(/^www\./, '');
    if (hostname === 'youtu.be' || hostname === 'youtube.com' || hostname.endsWith('.youtube.com')) return 'youtube';
    if (hostname === 'vkvideo.ru' || hostname.endsWith('.vkvideo.ru')) return 'vkvideo';
    if (hostname === 'rutube.ru' || hostname.endsWith('.rutube.ru')) return 'rutube';
    if (hostname === 'twitch.tv' || hostname.endsWith('.twitch.tv')) return 'twitch';
    if (hostname === 'google.com' || hostname.endsWith('.google.com')) return 'browser';
    return null;
  } catch {
    return null;
  }
}

function buildContentSearchUrl(appUrl, query) {
  const provider = contentProviderForUrl(appUrl);
  const search = String(query || '').replace(/\s+/g, ' ').trim().slice(0, 160);
  if (!provider || !search) return '';
  const encoded = encodeURIComponent(search);
  if (provider === 'youtube') return `https://www.youtube.com/results?search_query=${encoded}`;
  if (provider === 'vkvideo') return `https://vkvideo.ru/search?q=${encoded}`;
  if (provider === 'rutube') return `https://rutube.ru/search/?query=${encoded}`;
  if (provider === 'twitch') return `https://www.twitch.tv/search?term=${encoded}`;
  return `https://www.google.com/search?q=${encoded}`;
}

function normalizeWeatherCity(value) {
  const city = String(value || '').replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim();
  if (city.length < 2 || city.length > 64) return '';
  return city;
}

function isInsideFileBrowserRoots(candidatePath, roots) {
  if (typeof candidatePath !== 'string' || !path.isAbsolute(candidatePath) || !Array.isArray(roots)) return false;
  return roots.some((root) => {
    if (typeof root?.path !== 'string' || !path.isAbsolute(root.path)) return false;
    const rootPath = path.resolve(root.path);
    const relative = path.relative(rootPath, path.resolve(candidatePath));
    return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
  });
}

function fileKind(filePath, directory) {
  if (directory) return 'folder';
  const extension = path.extname(filePath).toLowerCase();
  if (['.mp4', '.mkv', '.webm', '.avi', '.mov', '.m4v'].includes(extension)) return 'video';
  if (['.mp3', '.ogg', '.flac', '.wav', '.m4a', '.aac'].includes(extension)) return 'audio';
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'].includes(extension)) return 'image';
  if (['.pdf', '.txt', '.md', '.doc', '.docx', '.odt', '.rtf'].includes(extension)) return 'document';
  if (['.zip', '.tar', '.gz', '.bz2', '.xz', '.7z', '.rar'].includes(extension)) return 'archive';
  return 'file';
}

function parseVolume(output) {
  const match = String(output).match(/Volume:\s+([0-9.]+)/i);
  return { volume: match ? Math.round(Number(match[1]) * 100) : 0, muted: /\[MUTED\]/i.test(output) };
}

function parseWpctlSinks(output) {
  const sinks = [];
  let inSinks = false;
  for (const originalLine of String(output).replace(/\x1b\[[0-9;]*m/g, '').split(/\r?\n/)) {
    if (/\bSinks:\s*$/.test(originalLine)) { inSinks = true; continue; }
    if (inSinks && /\b(?:Sources|Filters|Streams):\s*$/.test(originalLine)) break;
    if (!inSinks) continue;
    const line = originalLine.replace(/^[\s│├└─]+/, '');
    const match = line.match(/^(\*)?\s*(\d+)\.\s+(.+?)\s*$/);
    if (!match) continue;
    const name = match[3].replace(/\s+\[vol:.*$/i, '').trim();
    if (name) sinks.push({ id: Number(match[2]), name, default: Boolean(match[1]) });
  }
  return sinks;
}

function parseBluetoothDeviceLines(output) {
  const devices = new Map();
  for (const line of String(output || '').split(/\r?\n/)) {
    const match = line.trim().match(/^Device\s+([0-9A-F]{2}(?::[0-9A-F]{2}){5})\s+(.+)$/i);
    if (match) devices.set(match[1].toUpperCase(), match[2].trim());
  }
  return devices;
}

function normalizeBluetoothError(message) {
  const detail = String(message || '');
  if (/AuthenticationFailed|AuthenticationCanceled|AuthenticationRejected/i.test(detail)) {
    return 'Сопряжение не удалось. Переведите устройство в режим подключения и попробуйте снова.';
  }
  if (/not available|not connected|le-connection-abort-by-local|page-timeout/i.test(detail)) {
    return 'Устройство не отвечает. Убедитесь, что оно рядом и находится в режиме подключения.';
  }
  if (/InProgress|Operation already in progress/i.test(detail)) return 'Подключение уже выполняется.';
  return detail.trim() || 'Не удалось подключить устройство Bluetooth.';
}

function normalizeDisplayMode(mode = {}) {
  const width = Math.round(Number(mode.width) || 0);
  const height = Math.round(Number(mode.height) || 0);
  const refresh = Number(mode.refresh) || 0;
  return {
    width,
    height,
    refresh,
    preferred: Boolean(mode.preferred),
    current: Boolean(mode.current),
    id: `${width}x${height}@${refresh.toFixed(3)}`
  };
}

function normalizeDisplayOutput(output = {}) {
  const position = output.position || {};
  const adaptiveValue = output.adaptive_sync ?? output.adaptiveSync;
  return {
    name: String(output.name || '').slice(0, 128),
    description: String(output.description || [output.make, output.model].filter(Boolean).join(' ') || output.name || '').slice(0, 240),
    make: String(output.make || '').slice(0, 120),
    model: String(output.model || '').slice(0, 120),
    enabled: output.enabled !== false,
    x: Math.round(Number(position.x ?? output.x) || 0),
    y: Math.round(Number(position.y ?? output.y) || 0),
    scale: Math.max(0.5, Math.min(3, Number(output.scale) || 1)),
    transform: String(output.transform || 'normal'),
    adaptiveSync: adaptiveValue == null ? null : adaptiveValue === true || adaptiveValue === 'enabled',
    modes: Array.isArray(output.modes) ? output.modes.map(normalizeDisplayMode).filter((mode) => mode.width && mode.height) : []
  };
}

function validateDisplayCandidate(candidate, displayState) {
  const output = displayState.outputs.find((item) => item.name === String(candidate?.output || ''));
  if (!output) return { error: 'Выбранный дисплей больше недоступен.' };
  const enabled = candidate?.enabled !== false;
  if (!enabled && output.enabled && displayState.outputs.filter((item) => item.enabled).length <= 1) {
    return { error: 'Нельзя отключить единственный активный дисплей.' };
  }
  const modeId = String(candidate?.mode || '');
  const mode = output.modes.find((item) => item.id === modeId)
    || output.modes.find((item) => item.current)
    || output.modes.find((item) => item.preferred);
  if (enabled && !mode) return { error: 'Для дисплея не найден поддерживаемый видеорежим.' };
  const scale = Math.max(0.5, Math.min(3, Number(candidate?.scale) || output.scale || 1));
  const transforms = ['normal', '90', '180', '270', 'flipped', 'flipped-90', 'flipped-180', 'flipped-270'];
  const transform = transforms.includes(candidate?.transform) ? candidate.transform : output.transform;
  const x = Math.max(-32768, Math.min(32768, Math.round(Number(candidate?.x) || 0)));
  const y = Math.max(-32768, Math.min(32768, Math.round(Number(candidate?.y) || 0)));
  const adaptiveSync = output.adaptiveSync == null ? null : Boolean(candidate?.adaptiveSync);
  return { output, enabled, mode, scale, transform, x, y, adaptiveSync };
}

function splitNmcliLine(line) {
  const values = [];
  let value = '';
  let escaped = false;
  for (const character of String(line || '')) {
    if (escaped) { value += character; escaped = false; }
    else if (character === '\\') escaped = true;
    else if (character === ':') { values.push(value); value = ''; }
    else value += character;
  }
  if (escaped) value += '\\';
  values.push(value);
  return values;
}

function validatePowerSettings(candidate = {}, defaults = POWER_DEFAULTS) {
  const idleTimeout = [0, 5, 10, 20, 30, 60, 120].includes(Number(candidate.idleTimeout)) ? Number(candidate.idleTimeout) : 0;
  const powerActions = ['ask', 'poweroff', 'suspend', 'ignore'];
  const lidActions = ['suspend', 'poweroff', 'ignore'];
  return {
    idleTimeout,
    powerButtonAction: powerActions.includes(candidate.powerButtonAction) ? candidate.powerButtonAction : defaults.powerButtonAction,
    lidAction: lidActions.includes(candidate.lidAction) ? candidate.lidAction : defaults.lidAction,
    lidExternalAction: lidActions.includes(candidate.lidExternalAction) ? candidate.lidExternalAction : defaults.lidExternalAction,
    lidDockedAction: lidActions.includes(candidate.lidDockedAction) ? candidate.lidDockedAction : defaults.lidDockedAction
  };
}

module.exports = {
  POWER_DEFAULTS,
  buildContentSearchUrl,
  cleanBrowserUserAgent,
  commandResult,
  contentProviderForUrl,
  fileKind,
  isInsideFileBrowserRoots,
  isSecureWebUrl,
  normalizeWeatherCity,
  normalizeBluetoothError,
  normalizeDisplayMode,
  normalizeDisplayOutput,
  parseBluetoothDeviceLines,
  parseVolume,
  parseWpctlSinks,
  rpmSignatureIsValid,
  splitNmcliLine,
  validateDisplayCandidate,
  validatePowerSettings
};
