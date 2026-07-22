const { app, BrowserWindow, WebContentsView, ipcMain, globalShortcut, session, dialog, nativeImage, components, powerMonitor, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const { execFile, spawn } = require('child_process');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let browserView;
let browserVisible = false;
let keyboardVisible = false;
let browserFullscreen = false;
let browserMediaPlaying = false;
let updateState = { status: 'idle', version: app.getVersion(), progress: 0, message: '' };
let updateCheckInProgress = false;
let downloadedUpdatePath = null;
let updateInstallInProgress = false;
let mediaComponentsReady = Promise.resolve(false);
let protectedMediaVersion = null;
let systemAppMode = false;
let confirmationVisible = false;
let idleActionInProgress = false;
let lastIdleActionAt = 0;
let pendingLauncherAction = process.argv.includes('--poweroff') ? 'poweroff' : null;
const isDev = process.argv.includes('--dev');
const isTvSession = process.argv.includes('--tv-session') || process.env.FEDORA_TV_SESSION === '1';
const updatesEnabled = app.isPackaged;
const BROWSER_TOOLBAR_HEIGHT = 70;
const KEYBOARD_HEIGHT = 292;
const KEYBOARD_VIEWPORT_RATIO = 0.48;
const WEB_PARTITION = 'persist:fedora-tv';
const POWER_DEFAULTS = {
  idleTimeout: 0,
  powerButtonAction: 'ask',
  lidAction: 'suspend',
  lidExternalAction: 'suspend',
  lidDockedAction: 'ignore'
};
const SYSTEM_COMMAND_ENV = { ...process.env, LC_ALL: 'C', LANG: 'C' };

function configureWidevine() {
  if (process.platform !== 'linux') return null;
  const platformDirectory = process.arch === 'arm64' ? 'linux_arm64' : 'linux_x64';
  const roots = [
    '/opt/google/chrome/WidevineCdm',
    '/opt/google/chrome-beta/WidevineCdm',
    '/opt/google/chrome-unstable/WidevineCdm',
    '/usr/lib64/chromium/WidevineCdm',
    '/usr/lib/chromium/WidevineCdm'
  ];

  for (const root of roots) {
    const libraryPath = path.join(root, '_platform_specific', platformDirectory, 'libwidevinecdm.so');
    const manifestPath = path.join(root, 'manifest.json');
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (!fs.statSync(libraryPath).isFile() || !/^\d+(?:\.\d+)+$/.test(manifest.version || '')) continue;
      app.commandLine.appendSwitch('widevine-cdm-path', libraryPath);
      app.commandLine.appendSwitch('widevine-cdm-version', manifest.version);
      return { libraryPath, version: manifest.version };
    } catch {
      // Widevine необязателен: обычные HLS/HTML5-потоки продолжат работать.
    }
  }
  return null;
}

const widevineInfo = components?.whenReady ? null : configureWidevine();
protectedMediaVersion = widevineInfo?.version || null;

function initializeMediaComponents() {
  if (!components?.whenReady) return mediaComponentsReady;
  const componentId = components.WIDEVINE_CDM_ID;
  mediaComponentsReady = components.whenReady([componentId]).then(() => {
    const installedVersion = components.status()?.[componentId]?.version || null;
    protectedMediaVersion = installedVersion;
    writeUpdateLog('info', `Widevine component ready: ${installedVersion || 'unknown'}`);
    const activatedVersion = readSettings().widevineActivatedVersion || null;
    if (process.platform === 'linux' && installedVersion && activatedVersion !== installedVersion) {
      writeSettings({ widevineActivatedVersion: installedVersion });
      writeUpdateLog('info', 'Restarting once to activate the newly installed Widevine component');
      setTimeout(() => {
        app.relaunch();
        app.quit();
      }, 500);
    }
    return Boolean(installedVersion);
  }).catch((error) => {
    writeUpdateLog('warn', `Widevine component unavailable: ${error?.message || error}`);
    return false;
  });
  return mediaComponentsReady;
}


function sendUpdateState(patch = {}) {
  updateState = { ...updateState, ...patch, version: app.getVersion() };
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update:state', updateState);
  }
}

function writeUpdateLog(level, value) {
  try {
    const message = String(value?.stack || value?.message || value).replace(/\s+$/g, '');
    fs.mkdirSync(app.getPath('userData'), { recursive: true });
    fs.appendFileSync(path.join(app.getPath('userData'), 'update.log'), `${new Date().toISOString()} [${level}] ${message}\n`, 'utf8');
  } catch {
    // Логирование не должно мешать запуску или обновлению приложения.
  }
}

function normalizeUpdateError(error) {
  const message = String(error?.message || error || 'Неизвестная ошибка');
  if (/404|latest-linux\.yml/i.test(message)) return 'Релиз обновления пока не опубликован в GitHub.';
  if (/net::|network|ENOTFOUND|ECONN/i.test(message)) return 'Не удалось подключиться к GitHub. Проверьте интернет.';
  return message.slice(0, 240);
}

function configureUpdater() {
  autoUpdater.logger = {
    info: (value) => writeUpdateLog('info', value),
    warn: (value) => writeUpdateLog('warn', value),
    error: (value) => writeUpdateLog('error', value),
    debug: (value) => writeUpdateLog('debug', value)
  };
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.allowDowngrade = false;

  autoUpdater.on('checking-for-update', () => {
    updateCheckInProgress = true;
    sendUpdateState({ status: 'checking', progress: 0, message: 'Проверяем GitHub Releases…' });
  });
  autoUpdater.on('update-available', (info) => {
    updateCheckInProgress = false;
    downloadedUpdatePath = null;
    sendUpdateState({ status: 'available', availableVersion: info.version, progress: 0, message: `Найдена версия ${info.version}. Загрузка начнётся автоматически.` });
  });
  autoUpdater.on('update-not-available', () => {
    updateCheckInProgress = false;
    downloadedUpdatePath = null;
    sendUpdateState({ status: 'current', availableVersion: null, progress: 0, message: 'Установлена последняя версия.' });
  });
  autoUpdater.on('download-progress', (progress) => {
    sendUpdateState({ status: 'downloading', progress: Math.round(progress.percent || 0), message: 'Загружаем обновление…' });
  });
  autoUpdater.on('update-downloaded', (info) => {
    downloadedUpdatePath = info.downloadedFile || null;
    sendUpdateState({ status: 'downloaded', availableVersion: info.version, progress: 100, message: `Версия ${info.version} готова. Для установки Fedora запросит пароль.` });
  });
  autoUpdater.on('error', (error) => {
    updateCheckInProgress = false;
    sendUpdateState({ status: 'error', progress: 0, message: normalizeUpdateError(error) });
  });
}

function restoreKioskWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  if (!isDev) mainWindow.setKiosk(true);
  mainWindow.focus();
}

async function installDownloadedRpm() {
  if (updateInstallInProgress) return { ok: false, message: 'Установка уже выполняется.' };
  if (updateState.status !== 'downloaded' || !downloadedUpdatePath) {
    return { ok: false, message: 'Обновление ещё не загружено.' };
  }

  let rpmPath;
  try {
    rpmPath = fs.realpathSync(downloadedUpdatePath);
    const stat = fs.statSync(rpmPath);
    if (!stat.isFile() || path.extname(rpmPath).toLowerCase() !== '.rpm') throw new Error('Некорректный файл обновления');
  } catch (error) {
    return { ok: false, message: `Файл обновления недоступен: ${error.message}` };
  }

  updateInstallInProgress = true;
  writeUpdateLog('info', `Installing downloaded RPM: ${rpmPath}`);
  sendUpdateState({ status: 'installing', stage: 'authorization', progress: 8, message: 'Подготавливаем системное окно подтверждения…' });
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setKiosk(false);
    mainWindow.setFullScreen(false);
    mainWindow.show();
    mainWindow.focus();
  }

  const agentReady = await ensurePolicyKitAgent();
  if (!agentReady) {
    updateInstallInProgress = false;
    restoreKioskWindow();
    const message = 'Не найден графический агент Fedora для запроса пароля. Установите пакет lxqt-policykit и войдите в TV-сессию заново.';
    sendUpdateState({ status: 'downloaded', stage: 'error', progress: 0, message });
    return { ok: false, message };
  }

  sendUpdateState({ status: 'installing', stage: 'authorization', progress: 15, message: 'Подтвердите обновление в системном окне Fedora.' });

  const result = await new Promise((resolve) => {
    const pkexecPath = fs.existsSync('/usr/bin/pkexec') ? '/usr/bin/pkexec' : 'pkexec';
    const dnfPath = fs.existsSync('/usr/bin/dnf') ? '/usr/bin/dnf' : 'dnf';
    const child = spawn(pkexecPath, [dnfPath, 'install', '--nogpgcheck', '-y', rpmPath], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let installProgress = 28;
    let installationStarted = false;
    const handleOutput = (chunk, isError = false) => {
      const text = String(chunk);
      if (isError) stderr += text;
      else stdout += text;
      writeUpdateLog(isError ? 'warn' : 'info', text);
      if (isError) return;
      if (!installationStarted) {
        installationStarted = true;
        sendUpdateState({ status: 'installing', stage: 'installation', progress: installProgress, message: 'Разрешение получено. Устанавливаем пакет…' });
      } else {
        installProgress = Math.min(90, installProgress + 4);
        sendUpdateState({ status: 'installing', stage: 'installation', progress: installProgress, message: installProgress > 72 ? 'Завершаем установку…' : 'Обновляем компоненты Fedora TV OS…' });
      }
    };
    child.stdout.on('data', (chunk) => handleOutput(chunk));
    child.stderr.on('data', (chunk) => handleOutput(chunk, true));
    child.on('error', (error) => resolve({ ok: false, message: error.message }));
    child.on('close', (code) => resolve(code === 0
      ? { ok: true, message: stdout.trim() }
      : { ok: false, message: String(stderr || stdout || `pkexec завершился с кодом ${code}`).trim() }));
    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      resolve({ ok: false, message: 'Превышено время ожидания подтверждения или установки.' });
    }, 15 * 60 * 1000);
    child.once('close', () => clearTimeout(timeout));
  });

  updateInstallInProgress = false;
  if (!result.ok) {
    writeUpdateLog('error', result.message);
    restoreKioskWindow();
    const message = /dismissed|cancel|not authorized|authentication.*failed/i.test(result.message)
      ? 'Установка отменена. Её можно запустить позже из настроек.'
      : /authentication agent|no session for cookie/i.test(result.message)
        ? 'Системное окно подтверждения не запустилось. Перезапустите TV-сессию и попробуйте снова.'
      : `Не удалось установить обновление: ${result.message}`;
    sendUpdateState({ status: 'downloaded', stage: 'error', progress: 0, message });
    return { ok: false, message };
  }

  writeUpdateLog('info', 'RPM installation completed successfully');
  sendUpdateState({ status: 'installed', stage: 'restart', progress: 100, message: 'Обновление установлено. Перезапускаем Fedora TV…' });
  setTimeout(() => {
    app.relaunch();
    app.quit();
  }, 800);
  return { ok: true };
}

async function ensurePolicyKitAgent() {
  if (!isTvSession) return true;
  const agentPath = '/usr/libexec/lxqt-policykit-agent';
  if (!fs.existsSync(agentPath)) return false;
  const running = await runSystemCommand('pgrep', ['-u', String(process.getuid()), '-f', agentPath]);
  if (running.ok) return true;
  try {
    const agent = spawn(agentPath, [], { detached: true, stdio: 'ignore' });
    agent.unref();
    await new Promise((resolve) => setTimeout(resolve, 700));
    return true;
  } catch (error) {
    writeUpdateLog('error', error);
    return false;
  }
}

async function checkForUpdates() {
  if (!updatesEnabled) {
    sendUpdateState({ status: 'dev', message: 'Проверка обновлений доступна в установленной сборке приложения.' });
    return updateState;
  }
  if (updateCheckInProgress) return updateState;
  try {
    await autoUpdater.checkForUpdates();
  } catch (error) {
    sendUpdateState({ status: 'error', message: normalizeUpdateError(error) });
  }
  return updateState;
}

function rendererPath(file) {
  return path.join(__dirname, 'renderer', file);
}

function appsPath() {
  return path.join(app.getPath('userData'), 'apps.json');
}

function bundledAppsPath() {
  return path.join(__dirname, '..', 'config', 'apps.json');
}

function settingsPath() {
  return path.join(app.getPath('userData'), 'settings.json');
}

function readSettings() {
  try {
    const saved = JSON.parse(fs.readFileSync(settingsPath(), 'utf8'));
    return { language: 'ru', ...saved, power: { ...POWER_DEFAULTS, ...(saved.power || {}) } };
  } catch {
    return { language: 'ru', power: { ...POWER_DEFAULTS } };
  }
}

function writeSettings(patch) {
  const settings = { ...readSettings(), ...patch };
  fs.mkdirSync(path.dirname(settingsPath()), { recursive: true });
  fs.writeFileSync(settingsPath(), JSON.stringify(settings, null, 2), 'utf8');
  return settings;
}

function backgroundPath() {
  return path.join(app.getPath('userData'), 'background.jpg');
}

function readBackground() {
  try {
    const data = fs.readFileSync(backgroundPath());
    return { ok: true, dataUrl: `data:image/jpeg;base64,${data.toString('base64')}` };
  } catch (error) {
    if (error.code === 'ENOENT') return { ok: true, dataUrl: null };
    return { ok: false, message: 'Не удалось загрузить фоновое изображение' };
  }
}

async function chooseBackground() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Выберите фон Fedora TV',
    buttonLabel: 'Использовать как фон',
    properties: ['openFile'],
    filters: [{ name: 'Изображения', extensions: ['jpg', 'jpeg', 'png'] }]
  });
  if (result.canceled || !result.filePaths[0]) return { ok: false, canceled: true };

  const selectedPath = result.filePaths[0];
  try {
    const stat = fs.statSync(selectedPath);
    if (stat.size > 30 * 1024 * 1024) return { ok: false, message: 'Файл слишком большой. Выберите изображение до 30 МБ.' };
    let image = nativeImage.createFromPath(selectedPath);
    if (image.isEmpty()) return { ok: false, message: 'Не удалось прочитать это изображение' };
    const size = image.getSize();
    const scale = Math.min(1, 3840 / size.width, 2160 / size.height);
    if (scale < 1) {
      image = image.resize({
        width: Math.round(size.width * scale),
        height: Math.round(size.height * scale),
        quality: 'best'
      });
    }
    fs.mkdirSync(path.dirname(backgroundPath()), { recursive: true });
    fs.writeFileSync(backgroundPath(), image.toJPEG(88));
    return readBackground();
  } catch (error) {
    return { ok: false, message: `Не удалось сохранить фон: ${error.message}` };
  }
}

function readApps() {
  const bundled = JSON.parse(fs.readFileSync(bundledAppsPath(), 'utf8'));
  if (!fs.existsSync(appsPath())) return bundled;
  const saved = JSON.parse(fs.readFileSync(appsPath(), 'utf8'));
  const missingBuiltIns = bundled.filter((builtIn) => !saved.some((item) => item.id === builtIn.id));
  for (const builtIn of missingBuiltIns) {
    const settingsIndex = saved.findIndex((item) => item.action === 'settings');
    saved.splice(settingsIndex < 0 ? saved.length : settingsIndex, 0, builtIn);
  }
  return saved;
}

function writeApps(apps) {
  fs.mkdirSync(path.dirname(appsPath()), { recursive: true });
  fs.writeFileSync(appsPath(), JSON.stringify(apps, null, 2), 'utf8');
}

function makeId(title) {
  const base = title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9а-яё]+/gi, '-').replace(/^-|-$/g, '') || 'app';
  return `${base}-${Date.now().toString(36)}`;
}

function makeIcon(title) {
  return title.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase().slice(0, 3);
}

function desktopDataRoots() {
  const home = app.getPath('home');
  const roots = [
    process.env.XDG_DATA_HOME || path.join(home, '.local', 'share'),
    ...String(process.env.XDG_DATA_DIRS || '/usr/local/share:/usr/share').split(path.delimiter),
    path.join(home, '.local', 'share', 'flatpak', 'exports', 'share'),
    '/var/lib/flatpak/exports/share',
    '/var/lib/snapd/desktop'
  ];
  return [...new Set(roots.filter(Boolean))];
}

function unescapeDesktopValue(value) {
  return value.replace(/\\s/g, ' ').replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r').replace(/\\\\/g, '\\');
}

function readDesktopEntry(filePath) {
  let contents;
  try {
    contents = fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }

  const values = {};
  let inDesktopEntry = false;
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith('[')) {
      inDesktopEntry = line === '[Desktop Entry]';
      continue;
    }
    if (!inDesktopEntry || !line || line.startsWith('#')) continue;
    const separator = line.indexOf('=');
    if (separator < 1) continue;
    values[line.slice(0, separator)] = unescapeDesktopValue(line.slice(separator + 1));
  }

  if (values.Type !== 'Application' || values.Hidden === 'true' || values.NoDisplay === 'true') return null;
  if (!values.Exec && values.DBusActivatable !== 'true') return null;
  const locale = String(process.env.LC_MESSAGES || process.env.LANG || 'ru_RU').split('.')[0];
  const language = locale.split('_')[0];
  const title = values[`Name[${locale}]`] || values[`Name[${language}]`] || values.Name;
  if (!title) return null;
  return {
    title: title.trim().slice(0, 64),
    description: (values[`GenericName[${locale}]`] || values[`GenericName[${language}]`] || values.GenericName || '').trim().slice(0, 100),
    iconName: (values.Icon || '').trim()
  };
}

function resolveDesktopIcon(iconName) {
  if (!iconName) return null;
  const candidates = [];
  if (path.isAbsolute(iconName)) candidates.push(iconName);
  const names = path.extname(iconName) ? [iconName] : [`${iconName}.svg`, `${iconName}.png`, `${iconName}.xpm`];
  const themes = ['hicolor', 'Adwaita', 'HighContrast'];
  for (const root of desktopDataRoots()) {
    for (const theme of themes) {
      for (const size of ['256x256', '128x128', '64x64', '48x48', 'scalable']) {
        for (const name of names) candidates.push(path.join(root, 'icons', theme, size, 'apps', name));
      }
    }
    for (const name of names) candidates.push(path.join(root, 'pixmaps', name));
  }
  const iconPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!iconPath) return null;
  try {
    const image = nativeImage.createFromPath(iconPath);
    if (image.isEmpty()) return null;
    return image.resize({ width: 96, height: 96, quality: 'best' }).toDataURL();
  } catch {
    return null;
  }
}

function installedDesktopApps() {
  const results = new Map();
  const visit = (directory, applicationsRoot, remainingDepth = 3) => {
    let entries;
    try {
      entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (results.size >= 2000) return;
      const filePath = path.join(directory, entry.name);
      if (entry.isDirectory() && remainingDepth > 0) {
        visit(filePath, applicationsRoot, remainingDepth - 1);
        continue;
      }
      if (!entry.name.endsWith('.desktop') || (!entry.isFile() && !entry.isSymbolicLink())) continue;
      const desktopId = path.relative(applicationsRoot, filePath).split(path.sep).join('-');
      if (results.has(desktopId)) continue;
      const parsed = readDesktopEntry(filePath);
      if (!parsed) continue;
      results.set(desktopId, { desktopId, filePath, ...parsed, iconDataUrl: resolveDesktopIcon(parsed.iconName) });
    }
  };

  for (const root of desktopDataRoots()) visit(path.join(root, 'applications'), path.join(root, 'applications'));
  return [...results.values()].sort((a, b) => a.title.localeCompare(b.title, 'ru'));
}

function findInstalledDesktopApp(desktopId) {
  if (!/^[a-z0-9_.@+-]+\.desktop$/i.test(desktopId || '')) return null;
  for (const root of desktopDataRoots()) {
    const filePath = path.join(root, 'applications', desktopId);
    const parsed = readDesktopEntry(filePath);
    if (parsed) return { desktopId, filePath, ...parsed };
  }
  // Вложенные desktop-файлы встречаются редко; полный обход остаётся только
  // запасным путём и больше не задерживает обычный запуск каждой плитки.
  return installedDesktopApps().find((item) => item.desktopId === desktopId) || null;
}

function accentForDesktopId(desktopId) {
  const colors = ['#2563eb', '#7c3aed', '#059669', '#ea580c', '#0f766e', '#475569'];
  let hash = 0;
  for (const character of desktopId) hash = ((hash * 31) + character.charCodeAt(0)) >>> 0;
  return colors[hash % colors.length];
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

function configureWebSession(webSession) {
  const userAgent = cleanBrowserUserAgent(webSession.getUserAgent());
  webSession.setUserAgent(userAgent, 'ru-RU,ru,en-US,en');

  const safePermissions = new Set([
    'fullscreen',
    'mediaKeySystem',
    'pointerLock',
    'storage-access',
    'top-level-storage-access',
    'clipboard-sanitized-write'
  ]);
  const canGrant = (permission, requestingUrl, fallbackUrl = '') => (
    safePermissions.has(permission) && isSecureWebUrl(requestingUrl || fallbackUrl)
  );

  webSession.setPermissionCheckHandler((webContents, permission, requestingOrigin, details = {}) => (
    canGrant(permission, details.requestingUrl || requestingOrigin, webContents?.getURL())
  ));
  webSession.setPermissionRequestHandler((webContents, permission, callback, details = {}) => {
    callback(canGrant(permission, details.requestingUrl, webContents.getURL()));
  });
  return userAgent;
}

function sendBrowserState(extra = {}) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send('browser:state', {
    visible: browserVisible,
    fullscreen: browserFullscreen,
    canGoBack: Boolean(browserView?.webContents.navigationHistory.canGoBack()),
    loading: Boolean(browserView?.webContents.isLoading()),
    title: browserView?.webContents.getTitle() || '',
    url: browserView?.webContents.getURL() || '',
    ...extra
  });
}

function resizeBrowserView() {
  if (!mainWindow || !browserView || !browserVisible || confirmationVisible) return;
  const [width, height] = mainWindow.getContentSize();
  const keyboardHeight = keyboardVisible ? Math.min(KEYBOARD_HEIGHT, Math.floor(height * KEYBOARD_VIEWPORT_RATIO)) : 0;
  const toolbarHeight = browserFullscreen ? 0 : BROWSER_TOOLBAR_HEIGHT;
  browserView.setBounds({ x: 0, y: toolbarHeight, width, height: Math.max(1, height - toolbarHeight - keyboardHeight) });
}

function ensureBrowserView() {
  if (browserView) return browserView;

  const webSession = session.fromPartition(WEB_PARTITION);
  const userAgent = configureWebSession(webSession);

  browserView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      plugins: true,
      autoplayPolicy: 'no-user-gesture-required',
      backgroundThrottling: false,
      disableHtmlFullscreenWindowResize: true,
      partition: WEB_PARTITION
    }
  });

  browserView.setBackgroundColor('#090d14');
  browserView.webContents.setUserAgent(userAgent);
  browserView.webContents.setWindowOpenHandler(({ url }) => {
    if (isSecureWebUrl(url)) browserView.webContents.loadURL(url);
    return { action: 'deny' };
  });

  for (const eventName of ['did-stop-loading', 'did-navigate', 'did-navigate-in-page', 'page-title-updated']) {
    browserView.webContents.on(eventName, () => sendBrowserState());
  }
  browserView.webContents.on('did-start-loading', () => sendBrowserState({ error: '' }));
  browserView.webContents.on('did-fail-load', (_event, errorCode, errorDescription, _url, isMainFrame) => {
    if (isMainFrame && errorCode !== -3) sendBrowserState({ error: errorDescription || `Ошибка ${errorCode}` });
  });
  browserView.webContents.on('enter-html-full-screen', () => {
    browserFullscreen = true;
    resizeBrowserView();
    sendBrowserState();
  });
  browserView.webContents.on('leave-html-full-screen', () => {
    browserFullscreen = false;
    resizeBrowserView();
    sendBrowserState();
  });
  browserView.webContents.on('media-started-playing', () => { browserMediaPlaying = true; });
  browserView.webContents.on('media-paused', () => { browserMediaPlaying = false; });

  browserView.webContents.on('before-input-event', (event, input) => {
    const key = input.key;
    if (input.type !== 'keyDown' || input.isAutoRepeat) return;
    if (key === 'Home' || key === 'BrowserHome' || (key === 'Escape' && input.alt)) {
      event.preventDefault();
      showLauncher();
      return;
    }
    if (key === 'Escape' && browserFullscreen) {
      event.preventDefault();
      browserView.webContents.executeJavaScript('document.fullscreenElement ? document.exitFullscreen() : false', true).catch(() => {});
      return;
    }
    if (key === 'BrowserBack' || key === 'Escape') {
      event.preventDefault();
      if (browserView.webContents.navigationHistory.canGoBack()) browserView.webContents.navigationHistory.goBack();
      else showLauncher();
      return;
    }
    if (['ContextMenu', 'Menu', 'Apps', 'F10'].includes(key)) {
      event.preventDefault();
      mainWindow?.webContents.focus();
      mainWindow?.webContents.send('browser:toolbar');
      return;
    }
    if (['Power', 'PowerOff', 'XF86PowerOff'].includes(key)) {
      event.preventDefault();
      requestLauncherAction('poweroff');
    }
  });

  return browserView;
}

function showLauncher() {
  if (browserView && !browserView.webContents.isDestroyed()) {
    browserView.webContents.executeJavaScript(`(() => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      for (const media of document.querySelectorAll('video, audio')) media.pause();
    })()`).catch(() => {});
  }
  browserVisible = false;
  browserMediaPlaying = false;
  keyboardVisible = false;
  browserFullscreen = false;
  if (systemAppMode) {
    systemAppMode = false;
  }
  if (browserView && mainWindow?.contentView.children.includes(browserView)) {
    mainWindow.contentView.removeChildView(browserView);
  }
  restoreKioskWindow();
  mainWindow?.webContents.focus();
  sendBrowserState({ visible: false });
  mainWindow?.webContents.send('launcher:home');
}

function setConfirmationVisible(visible) {
  confirmationVisible = Boolean(visible);
  if (!mainWindow || mainWindow.isDestroyed()) return confirmationVisible;

  if (confirmationVisible) {
    if (browserView && mainWindow.contentView.children.includes(browserView)) {
      mainWindow.contentView.removeChildView(browserView);
    }
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    mainWindow.show();
    mainWindow.moveTop();
    mainWindow.webContents.focus();
    return true;
  }

  mainWindow.setAlwaysOnTop(false);
  mainWindow.setVisibleOnAllWorkspaces(false);
  if (browserVisible && browserView && !mainWindow.contentView.children.includes(browserView)) {
    mainWindow.contentView.addChildView(browserView);
    resizeBrowserView();
    setTimeout(() => browserView?.webContents.focus(), 0);
  }
  return false;
}

function requestLauncherAction(action) {
  showLauncher();
  setTimeout(() => mainWindow?.webContents.send('launcher:system-action', action), 50);
}

async function openWebsite(url) {
  await mediaComponentsReady;
  const view = ensureBrowserView();
  if (!mainWindow.contentView.children.includes(view)) mainWindow.contentView.addChildView(view);
  browserVisible = true;
  resizeBrowserView();
  view.webContents.focus();
  await view.webContents.loadURL(url);
  sendBrowserState({ visible: true });
}

async function controlWebMedia(action) {
  if (!browserView || !browserVisible || browserView.webContents.isDestroyed()) return false;
  const safeAction = ['play-pause', 'pause', 'stop'].includes(action) ? action : null;
  if (!safeAction) return false;
  try {
    return await browserView.webContents.executeJavaScript(`(() => {
      const media = [...document.querySelectorAll('video, audio')]
        .filter((item) => item.readyState > 0)
        .sort((a, b) => (b.clientWidth * b.clientHeight) - (a.clientWidth * a.clientHeight))[0];
      if (!media) return false;
      if (${JSON.stringify(safeAction)} === 'play-pause') {
        if (media.paused) media.play().catch(() => {});
        else media.pause();
      } else {
        media.pause();
        if (${JSON.stringify(safeAction)} === 'stop' && Number.isFinite(media.duration)) media.currentTime = 0;
      }
      return true;
    })()`, true);
  } catch {
    return false;
  }
}

async function toggleWebFullscreen() {
  if (!browserView || !browserVisible || browserView.webContents.isDestroyed()) return false;
  try {
    return await browserView.webContents.executeJavaScript(`(async () => {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return false;
      }
      const video = [...document.querySelectorAll('video')]
        .sort((a, b) => (b.clientWidth * b.clientHeight) - (a.clientWidth * a.clientHeight))[0];
      await (video || document.documentElement).requestFullscreen();
      return true;
    })()`, true);
  } catch {
    return false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'Fedora TV OS',
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 540,
    fullscreen: !isDev,
    kiosk: !isDev,
    autoHideMenuBar: true,
    backgroundColor: '#090d14',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.loadFile(rendererPath('index.html'));
  mainWindow.on('resize', resizeBrowserView);
  mainWindow.on('closed', () => {
    browserView?.webContents.close();
    browserView = null;
    mainWindow = null;
  });

  if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });
}

function runSystemCommand(command, args = [], options = {}) {
  return new Promise((resolve) => {
    execFile(command, args, {
      timeout: options.timeout || 10000,
      maxBuffer: options.maxBuffer || 2 * 1024 * 1024,
      env: options.env || process.env
    }, (error, stdout, stderr) => {
      if (error) resolve({ ok: false, message: String(stderr || error.message).trim() });
      else resolve({ ok: true, message: stdout.trim() });
    });
  });
}

function fileBrowserRoots() {
  const home = path.resolve(app.getPath('home'));
  const userName = path.basename(home);
  const candidates = [
    { path: home, title: 'Домашняя папка', titleEn: 'Home', icon: '⌂' },
    { path: path.join(home, 'Downloads'), title: 'Загрузки', titleEn: 'Downloads', icon: '↓' },
    { path: path.join(home, 'Videos'), title: 'Видео', titleEn: 'Videos', icon: '▶' },
    { path: path.join(home, 'Pictures'), title: 'Изображения', titleEn: 'Pictures', icon: '▧' },
    { path: path.join('/run/media', userName), title: 'Съёмные носители', titleEn: 'Removable media', icon: '▱' },
    { path: path.join('/media', userName), title: 'Подключённые диски', titleEn: 'Mounted drives', icon: '▱' },
    { path: '/mnt', title: 'Другие диски', titleEn: 'Other drives', icon: '▱' }
  ];
  const unique = new Map();
  for (const item of candidates) {
    try {
      const realPath = fs.realpathSync(item.path);
      if (fs.statSync(realPath).isDirectory() && !unique.has(realPath)) unique.set(realPath, { ...item, path: realPath });
    } catch {
      // Не подключённые и отсутствующие пользовательские каталоги пропускаются.
    }
  }
  return [...unique.values()];
}

function isInsideFileBrowserRoots(candidatePath, roots = fileBrowserRoots()) {
  return roots.some((root) => candidatePath === root.path || candidatePath.startsWith(`${root.path}${path.sep}`));
}

function resolveBrowsablePath(candidate, roots = fileBrowserRoots()) {
  if (typeof candidate !== 'string' || !path.isAbsolute(candidate)) return null;
  try {
    const realPath = fs.realpathSync(candidate);
    return isInsideFileBrowserRoots(realPath, roots) ? realPath : null;
  } catch {
    return null;
  }
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

async function listFiles(candidatePath) {
  const roots = fileBrowserRoots();
  if (!candidatePath) {
    return {
      ok: true,
      path: null,
      parentPath: null,
      entries: roots.map((root) => ({
        name: root.title,
        nameEn: root.titleEn,
        path: root.path,
        directory: true,
        kind: 'root',
        icon: root.icon
      }))
    };
  }

  const directoryPath = resolveBrowsablePath(candidatePath, roots);
  if (!directoryPath) return { ok: false, message: 'Эта папка недоступна.' };
  let directoryEntries;
  try {
    directoryEntries = await fs.promises.readdir(directoryPath, { withFileTypes: true });
  } catch (error) {
    return { ok: false, message: `Не удалось открыть папку: ${error.message}` };
  }

  const entries = [];
  for (const entry of directoryEntries.slice(0, 1000)) {
    if (entry.name === '.' || entry.name === '..') continue;
    const entryPath = path.join(directoryPath, entry.name);
    try {
      const realPath = fs.realpathSync(entryPath);
      if (!isInsideFileBrowserRoots(realPath, roots)) continue;
      const stat = fs.statSync(realPath);
      const directory = stat.isDirectory();
      entries.push({
        name: entry.name,
        path: realPath,
        directory,
        kind: fileKind(realPath, directory),
        size: directory ? null : stat.size,
        modified: stat.mtimeMs
      });
    } catch {
      // Недоступные и исчезнувшие между чтением каталога и stat файлы пропускаются.
    }
  }
  entries.sort((a, b) => Number(b.directory) - Number(a.directory) || a.name.localeCompare(b.name, 'ru', { numeric: true }));

  const parentCandidate = path.dirname(directoryPath);
  const parentPath = parentCandidate !== directoryPath && isInsideFileBrowserRoots(parentCandidate, roots) ? parentCandidate : null;
  return { ok: true, path: directoryPath, parentPath, entries: entries.slice(0, 500) };
}

async function openFile(candidatePath) {
  const filePath = resolveBrowsablePath(candidatePath, fileBrowserRoots());
  if (!filePath) return { ok: false, message: 'Файл недоступен.' };
  try {
    if (!fs.statSync(filePath).isFile()) return { ok: false, message: 'Выберите файл.' };
    restoreKioskWindow();
    systemAppMode = true;
    const message = await shell.openPath(filePath);
    if (message) {
      systemAppMode = false;
      restoreKioskWindow();
      return { ok: false, message };
    }
    return { ok: true, external: true };
  } catch (error) {
    systemAppMode = false;
    return { ok: false, message: `Не удалось открыть файл: ${error.message}` };
  }
}

function playbackIsActive() {
  return Boolean(
    browserMediaPlaying
    ||
    mainWindow?.webContents?.isCurrentlyAudible?.()
    || browserView?.webContents?.isCurrentlyAudible?.()
  );
}

function startIdleMonitor() {
  if (!isTvSession) return;
  setInterval(async () => {
    const timeoutMinutes = Number(readSettings().power?.idleTimeout) || 0;
    if (!timeoutMinutes || idleActionInProgress || playbackIsActive()) return;
    let idleSeconds = 0;
    try { idleSeconds = powerMonitor.getSystemIdleTime(); } catch { return; }
    if (idleSeconds < timeoutMinutes * 60 || Date.now() - lastIdleActionAt < 120000) return;
    idleActionInProgress = true;
    lastIdleActionAt = Date.now();
    await runSystemCommand('systemctl', ['suspend'], { timeout: 30000 });
    idleActionInProgress = false;
  }, 30000).unref();
}

const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, argv) => {
    if (argv.includes('--poweroff')) requestLauncherAction('poweroff');
    else if (argv.includes('--home') || argv.includes('--tv-session')) showLauncher();
  });

app.whenReady().then(() => {
  session.defaultSession.setPermissionCheckHandler(() => false);
  session.defaultSession.setPermissionRequestHandler((_wc, _permission, callback) => callback(false));
  if (updatesEnabled) configureUpdater();
  createWindow();
  initializeMediaComponents();
  startIdleMonitor();
  if (isTvSession) setTimeout(() => applySavedDisplayConfiguration(), 1600);
  mainWindow.webContents.once('did-finish-load', () => {
    sendUpdateState();
    if (pendingLauncherAction) {
      const action = pendingLauncherAction;
      pendingLauncherAction = null;
      setTimeout(() => requestLauncherAction(action), 50);
    }
    if (updatesEnabled) setTimeout(() => checkForUpdates(), 5000);
  });
  if (updatesEnabled) setInterval(() => checkForUpdates(), 60 * 60 * 1000);

  globalShortcut.register('Super+Home', showLauncher);
  globalShortcut.register('CommandOrControl+Alt+H', showLauncher);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
}

app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('apps:get', () => readApps());
ipcMain.handle('files:list', (_event, directoryPath) => listFiles(directoryPath));
ipcMain.handle('files:open', (_event, filePath) => openFile(filePath));
ipcMain.handle('background:get', () => readBackground());
ipcMain.handle('background:choose', () => chooseBackground());
ipcMain.handle('background:clear', () => {
  try {
    fs.rmSync(backgroundPath(), { force: true });
    return { ok: true, dataUrl: null };
  } catch (error) {
    return { ok: false, message: `Не удалось сбросить фон: ${error.message}` };
  }
});

ipcMain.handle('apps:add', (_event, candidate) => {
  const title = String(candidate?.title || '').trim().slice(0, 32);
  const url = String(candidate?.url || '').trim();
  const accent = /^#[0-9a-f]{6}$/i.test(candidate?.accent || '') ? candidate.accent : '#2563eb';
  if (title.length < 2) return { ok: false, message: 'Введите название приложения' };
  if (!/^https:\/\/[^\s]+$/i.test(url)) return { ok: false, message: 'Разрешены только корректные HTTPS-адреса' };
  const apps = readApps();
  if (apps.some((item) => item.url?.toLowerCase() === url.toLowerCase())) return { ok: false, message: 'Такой сайт уже добавлен' };
  apps.splice(Math.max(0, apps.findIndex((item) => item.action === 'settings')), 0, {
    id: makeId(title), title, url, icon: makeIcon(title), accent, custom: true
  });
  writeApps(apps);
  return { ok: true, apps };
});

ipcMain.handle('system-apps:get', () => {
  const added = new Set(readApps().filter((item) => item.type === 'system').map((item) => item.desktopId));
  return installedDesktopApps().map(({ filePath: _filePath, ...item }) => ({ ...item, added: added.has(item.desktopId) }));
});

ipcMain.handle('system-apps:add', (_event, desktopId) => {
  const installedApp = installedDesktopApps().find((item) => item.desktopId === desktopId);
  if (!installedApp) return { ok: false, message: 'Приложение больше не установлено в системе' };
  const apps = readApps();
  if (apps.some((item) => item.type === 'system' && item.desktopId === desktopId)) {
    return { ok: false, message: 'Это приложение уже добавлено' };
  }
  apps.splice(Math.max(0, apps.findIndex((item) => item.action === 'settings')), 0, {
    id: makeId(installedApp.title),
    title: installedApp.title,
    desktopId,
    type: 'system',
    icon: makeIcon(installedApp.title),
    iconDataUrl: installedApp.iconDataUrl,
    accent: accentForDesktopId(desktopId),
    custom: true
  });
  writeApps(apps);
  return { ok: true, apps };
});

ipcMain.handle('apps:delete', (_event, id) => {
  const apps = readApps();
  const target = apps.find((item) => item.id === id);
  if (!target) return { ok: false, message: 'Приложение не найдено' };
  if (!target.custom) return { ok: false, message: 'Встроенное приложение удалить нельзя' };
  const updated = apps.filter((item) => item.id !== id);
  writeApps(updated);
  return { ok: true, apps: updated };
});

ipcMain.handle('app:open', async (_event, selectedApp) => {
  if (!selectedApp || typeof selectedApp !== 'object') return { ok: false };
  const storedApp = readApps().find((item) => item.id === selectedApp.id);
  if (!storedApp) return { ok: false, message: 'Приложение не найдено' };
  if (['settings', 'files'].includes(storedApp.action)) return { ok: true, action: storedApp.action };
  if (storedApp.type === 'system') {
    const installedApp = findInstalledDesktopApp(storedApp.desktopId);
    if (!installedApp) return { ok: false, message: 'Приложение не найдено в системе' };
    // Оболочка остаётся полноэкранным фоном. Раньше снятие kiosk/fullscreen
    // заставляло labwc перестраивать её окно, из-за чего пользователь видел
    // сворачивание или чёрный экран до появления нативного приложения.
    restoreKioskWindow();
    systemAppMode = true;
    const result = await runSystemCommand('gio', ['launch', installedApp.filePath]);
    if (!result.ok) {
      systemAppMode = false;
      restoreKioskWindow();
      return result;
    }
    // Новое окно получает фокус от композитора, а Home поднимает уже готовую
    // оболочку, не создавая и не перезагружая её заново.
    return { ...result, external: true };
  }
  if (!/^https:\/\//i.test(storedApp.url || '')) return { ok: false, message: 'Разрешены только HTTPS-адреса' };
  try {
    await openWebsite(storedApp.url);
    return { ok: true };
  } catch (error) {
    showLauncher();
    return { ok: false, message: error.message };
  }
});

ipcMain.handle('browser:back', () => {
  if (!browserView || !browserVisible) return { atHome: true };
  if (browserView.webContents.navigationHistory.canGoBack()) {
    browserView.webContents.navigationHistory.goBack();
    return { atHome: false };
  }
  showLauncher();
  return { atHome: true };
});
ipcMain.handle('browser:home', () => { showLauncher(); return true; });
ipcMain.handle('browser:refresh', () => { browserView?.webContents.reload(); return true; });
ipcMain.handle('browser:focus', () => {
  if (!browserView || !browserVisible) return false;
  browserView.webContents.focus();
  return true;
});
ipcMain.handle('browser:fullscreen', () => toggleWebFullscreen());
ipcMain.handle('browser:keyboard', (_event, visible) => {
  keyboardVisible = Boolean(visible);
  resizeBrowserView();
  return keyboardVisible;
});
ipcMain.handle('keyboard:input', (_event, input) => {
  if (!browserView || !browserVisible || browserView.webContents.isDestroyed()) return false;
  const value = String(input || '');
  if (value === 'Backspace') {
    browserView.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Backspace' });
    browserView.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'Backspace' });
  } else if (value === 'Enter') {
    browserView.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Enter' });
    browserView.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'Enter' });
  } else {
    browserView.webContents.insertText(value);
  }
  return true;
});
ipcMain.handle('media:action', async (_event, action) => {
  const keys = {
    'play-pause': 'MediaPlayPause',
    next: 'MediaNextTrack',
    previous: 'MediaPreviousTrack',
    stop: 'MediaStop'
  };
  const keyCode = keys[action];
  if (!keyCode || !browserView || browserView.webContents.isDestroyed()) return false;
  if (['play-pause', 'stop'].includes(action) && await controlWebMedia(action)) return true;
  browserView.webContents.sendInputEvent({ type: 'keyDown', keyCode });
  browserView.webContents.sendInputEvent({ type: 'keyUp', keyCode });
  return true;
});
ipcMain.handle('window:toggle-fullscreen', () => {
  if (!mainWindow) return false;
  mainWindow.setKiosk(false);
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
  return mainWindow.isFullScreen();
});
ipcMain.handle('window:confirmation-visible', (_event, visible) => setConfirmationVisible(visible));
ipcMain.handle('system:action', async (_event, action) => {
  if (action === 'logout') {
    if (!isTvSession) return { ok: false, message: 'Выход из TV-сессии доступен после её установки.' };
    return runSystemCommand('/usr/libexec/fedora-tv-os-logout');
  }
  if (action === 'poweroff') return runSystemCommand('systemctl', ['poweroff']);
  if (action === 'reboot') return runSystemCommand('systemctl', ['reboot']);
  if (action === 'suspend') return runSystemCommand('systemctl', ['suspend'], { timeout: 30000 });
  if (['volume-up', 'volume-down', 'mute'].includes(action)) {
    const args = action === 'mute'
      ? ['set-mute', '@DEFAULT_AUDIO_SINK@', 'toggle']
      : ['set-volume', '@DEFAULT_AUDIO_SINK@', action === 'volume-up' ? '5%+' : '5%-'];
    const result = await runSystemCommand('wpctl', args);
    return result.ok ? { ok: true, audio: await getAudioState() } : result;
  }
  return { ok: false, message: 'Неизвестное действие' };
});

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

async function getAudioState() {
  const [volumeResult, statusResult] = await Promise.all([
    runSystemCommand('wpctl', ['get-volume', '@DEFAULT_AUDIO_SINK@'], { env: SYSTEM_COMMAND_ENV }),
    runSystemCommand('wpctl', ['status'], { env: SYSTEM_COMMAND_ENV })
  ]);
  if (!volumeResult.ok) return volumeResult;
  return { ok: true, ...parseVolume(volumeResult.message), outputs: statusResult.ok ? parseWpctlSinks(statusResult.message) : [] };
}

async function selectAudioOutput(id) {
  const safeId = Number(id);
  const audio = await getAudioState();
  if (!audio.ok) return audio;
  if (!Number.isInteger(safeId) || !audio.outputs.some((output) => output.id === safeId)) {
    return { ok: false, message: 'Аудиовыход больше недоступен. Обновите список.' };
  }
  const result = await runSystemCommand('wpctl', ['set-default', String(safeId)], { env: SYSTEM_COMMAND_ENV });
  return result.ok ? getAudioState() : result;
}

function parseBluetoothDeviceLines(output) {
  const devices = new Map();
  for (const line of String(output || '').split(/\r?\n/)) {
    const match = line.trim().match(/^Device\s+([0-9A-F]{2}(?::[0-9A-F]{2}){5})\s+(.+)$/i);
    if (match) devices.set(match[1].toUpperCase(), match[2].trim());
  }
  return devices;
}

async function bluetoothDevicesByFilter(filter) {
  let result = await runSystemCommand('bluetoothctl', ['devices', filter], { timeout: 12000, env: SYSTEM_COMMAND_ENV });
  if (!result.ok && filter === 'Paired') {
    result = await runSystemCommand('bluetoothctl', ['paired-devices'], { timeout: 12000, env: SYSTEM_COMMAND_ENV });
  }
  return result.ok ? parseBluetoothDeviceLines(result.message) : new Map();
}

async function getBluetoothState(scan = false) {
  const showResult = await runSystemCommand('bluetoothctl', ['show'], { timeout: 12000, env: SYSTEM_COMMAND_ENV });
  if (!showResult.ok || !/^Controller\s/m.test(showResult.message)) {
    const unavailable = /ENOENT|not found|spawn bluetoothctl/i.test(showResult.message);
    return {
      ok: false,
      available: false,
      enabled: false,
      devices: [],
      message: unavailable ? 'Установите BlueZ, чтобы использовать Bluetooth.' : 'Bluetooth-адаптер не найден.'
    };
  }

  const enabled = /^\s*Powered:\s+yes\s*$/im.test(showResult.message);
  if (scan && enabled) {
    await runSystemCommand('bluetoothctl', ['--timeout', '6', 'scan', 'on'], { timeout: 9000, env: SYSTEM_COMMAND_ENV });
  }
  const [allResult, paired, connected] = await Promise.all([
    runSystemCommand('bluetoothctl', ['devices'], { timeout: 12000, env: SYSTEM_COMMAND_ENV }),
    bluetoothDevicesByFilter('Paired'),
    bluetoothDevicesByFilter('Connected')
  ]);
  const all = allResult.ok ? parseBluetoothDeviceLines(allResult.message) : new Map();
  for (const [address, name] of paired) if (!all.has(address)) all.set(address, name);
  for (const [address, name] of connected) if (!all.has(address)) all.set(address, name);
  const devices = [...all].map(([address, name]) => ({
    address,
    name,
    paired: paired.has(address),
    connected: connected.has(address)
  })).sort((a, b) => Number(b.connected) - Number(a.connected) || Number(b.paired) - Number(a.paired) || a.name.localeCompare(b.name, 'ru'));
  return { ok: true, available: true, enabled, discovering: /^\s*Discovering:\s+yes\s*$/im.test(showResult.message), devices };
}

function runBluetoothPairing(address) {
  return new Promise((resolve) => {
    const child = spawn('bluetoothctl', ['--timeout', '35'], { stdio: ['pipe', 'pipe', 'pipe'], env: SYSTEM_COMMAND_ENV });
    let output = '';
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(result);
    };
    child.stdout.on('data', (chunk) => { output += String(chunk); });
    child.stderr.on('data', (chunk) => { output += String(chunk); });
    child.on('error', (error) => finish({ ok: false, message: error.message }));
    child.on('close', (code) => {
      const failed = /Failed to (?:pair|connect)|AuthenticationFailed|AuthenticationCanceled|not available/i.test(output);
      finish(code === 0 && !failed
        ? { ok: true }
        : { ok: false, message: output.trim() || `bluetoothctl завершился с кодом ${code}` });
    });
    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      finish({ ok: false, message: 'Превышено время ожидания подключения Bluetooth.' });
    }, 40000);
    child.stdin.end(`agent NoInputNoOutput\ndefault-agent\npair ${address}\ntrust ${address}\nconnect ${address}\nquit\n`);
  });
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

async function toggleBluetooth(enabled) {
  const result = await runSystemCommand('bluetoothctl', ['power', enabled ? 'on' : 'off'], { timeout: 15000, env: SYSTEM_COMMAND_ENV });
  return result.ok ? getBluetoothState(Boolean(enabled)) : result;
}

async function toggleBluetoothDevice(address) {
  const normalizedAddress = String(address || '').toUpperCase();
  if (!/^[0-9A-F]{2}(?::[0-9A-F]{2}){5}$/.test(normalizedAddress)) return { ok: false, message: 'Некорректный адрес устройства.' };
  const state = await getBluetoothState(false);
  if (!state.ok) return state;
  const device = state.devices.find((item) => item.address === normalizedAddress);
  if (!device) return { ok: false, message: 'Устройство больше недоступно. Обновите список.' };
  const result = device.connected
    ? await runSystemCommand('bluetoothctl', ['disconnect', normalizedAddress], { timeout: 20000, env: SYSTEM_COMMAND_ENV })
    : device.paired
      ? await runSystemCommand('bluetoothctl', ['connect', normalizedAddress], { timeout: 30000, env: SYSTEM_COMMAND_ENV })
      : await runBluetoothPairing(normalizedAddress);
  if (!result.ok) return { ok: false, message: normalizeBluetoothError(result.message) };
  await new Promise((resolve) => setTimeout(resolve, 450));
  return getBluetoothState(false);
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

async function getDisplayState() {
  const result = await runSystemCommand('wlr-randr', ['--json'], { env: SYSTEM_COMMAND_ENV });
  if (!result.ok) {
    const unavailable = /ENOENT|not found|spawn wlr-randr/i.test(result.message);
    return {
      ok: false,
      available: false,
      message: unavailable
        ? 'Установите пакет wlr-randr, чтобы управлять дисплеями.'
        : `Не удалось прочитать дисплеи: ${result.message}`
    };
  }
  try {
    const parsed = JSON.parse(result.message || '[]');
    const outputs = (Array.isArray(parsed) ? parsed : parsed.outputs || []).map(normalizeDisplayOutput).filter((output) => output.name);
    return { ok: true, available: true, outputs };
  } catch {
    return { ok: false, available: false, message: 'wlr-randr вернул неизвестный формат данных.' };
  }
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

async function applyDisplaySettings(candidate, persist = true) {
  const state = await getDisplayState();
  if (!state.ok) return state;
  const settings = validateDisplayCandidate(candidate, state);
  if (settings.error) return { ok: false, message: settings.error };
  const args = ['--output', settings.output.name];
  if (!settings.enabled) {
    args.push('--off');
  } else {
    args.push('--on', '--mode', `${settings.mode.width}x${settings.mode.height}@${settings.mode.refresh.toFixed(3)}Hz`);
    args.push('--scale', String(settings.scale), '--transform', settings.transform, '--pos', `${settings.x},${settings.y}`);
    if (settings.adaptiveSync != null) args.push('--adaptive-sync', settings.adaptiveSync ? 'enabled' : 'disabled');
  }
  const result = await runSystemCommand('wlr-randr', args, { env: SYSTEM_COMMAND_ENV });
  if (!result.ok) return { ok: false, message: `Не удалось применить настройки дисплея: ${result.message}` };
  if (persist) {
    const preferences = readSettings();
    const displayConfigurations = { ...(preferences.displayConfigurations || {}) };
    displayConfigurations[settings.output.name] = {
      output: settings.output.name,
      enabled: settings.enabled,
      mode: settings.mode?.id || '',
      scale: settings.scale,
      transform: settings.transform,
      x: settings.x,
      y: settings.y,
      adaptiveSync: settings.adaptiveSync
    };
    writeSettings({ displayConfigurations });
  }
  await new Promise((resolve) => setTimeout(resolve, 350));
  return getDisplayState();
}

async function applySavedDisplayConfiguration() {
  const configurations = Object.values(readSettings().displayConfigurations || {});
  configurations.sort((a, b) => Number(b.enabled !== false) - Number(a.enabled !== false));
  for (const configuration of configurations) {
    await applyDisplaySettings(configuration, false);
  }
}

function splitNmcliLine(line) {
  const values = [];
  let value = '';
  let escaped = false;
  for (const character of line) {
    if (escaped) { value += character; escaped = false; }
    else if (character === '\\') escaped = true;
    else if (character === ':') { values.push(value); value = ''; }
    else value += character;
  }
  values.push(value);
  return values;
}

async function getSavedWifiConnections() {
  const result = await runSystemCommand('nmcli', ['-t', '--escape', 'yes', '-f', 'NAME,UUID,TYPE,AUTOCONNECT', 'connection', 'show'], { env: SYSTEM_COMMAND_ENV });
  if (!result.ok) return [];
  const profiles = result.message.split(/\r?\n/).filter(Boolean).map((line) => {
    const [name, uuid, type, autoconnect] = splitNmcliLine(line);
    return { name, uuid, type, autoconnect: /^yes$/i.test(autoconnect) };
  }).filter((profile) => ['wifi', '802-11-wireless'].includes(profile.type) && /^[0-9a-f-]{32,36}$/i.test(profile.uuid));
  await Promise.all(profiles.slice(0, 40).map(async (profile) => {
    const ssidResult = await runSystemCommand('nmcli', ['-g', '802-11-wireless.ssid', 'connection', 'show', 'uuid', profile.uuid], { env: SYSTEM_COMMAND_ENV });
    profile.ssid = ssidResult.ok ? splitNmcliLine(ssidResult.message.split(/\r?\n/)[0] || '')[0] : profile.name;
  }));
  return profiles.filter((profile) => profile.ssid);
}

async function getWifiState(rescan = false) {
  const [enabledResult, listResult, savedConnections] = await Promise.all([
    runSystemCommand('nmcli', ['-t', '-f', 'WIFI', 'general'], { env: SYSTEM_COMMAND_ENV }),
    runSystemCommand('nmcli', ['-t', '--escape', 'yes', '-f', 'IN-USE,SSID,SIGNAL,SECURITY,DEVICE', 'device', 'wifi', 'list', '--rescan', rescan ? 'yes' : 'auto'], { env: SYSTEM_COMMAND_ENV }),
    getSavedWifiConnections()
  ]);
  if (!listResult.ok) return listResult;
  const networks = listResult.message.split(/\r?\n/).filter(Boolean).map((line) => {
    const [active, ssid, signal, security, device] = splitNmcliLine(line);
    const saved = savedConnections.find((profile) => profile.ssid === ssid);
    return {
      active: active === '*', ssid, signal: Number(signal) || 0,
      secure: Boolean(security && security !== '--'), device,
      saved: Boolean(saved), uuid: saved?.uuid || null, autoconnect: Boolean(saved?.autoconnect)
    };
  }).filter((network) => network.ssid).filter((network, index, all) => all.findIndex((item) => item.ssid === network.ssid) === index).sort((a, b) => Number(b.active) - Number(a.active) || b.signal - a.signal);
  return { ok: true, enabled: /enabled/i.test(enabledResult.message), networks };
}

async function connectWifi(candidate) {
  const ssid = String(candidate?.ssid || '').slice(0, 128);
  const password = String(candidate?.password || '').slice(0, 256);
  if (!ssid) return { ok: false, message: 'Сеть не выбрана' };
  const savedConnections = await getSavedWifiConnections();
  const requestedUuid = /^[0-9a-f-]{32,36}$/i.test(String(candidate?.uuid || '')) ? String(candidate.uuid) : '';
  const saved = savedConnections.find((profile) => profile.ssid === ssid && (!requestedUuid || profile.uuid === requestedUuid));

  if (saved) {
    if (password) {
      const secretResult = await runSystemCommand('nmcli', ['connection', 'modify', 'uuid', saved.uuid, 'wifi-sec.psk', password, 'connection.autoconnect', 'yes'], { env: SYSTEM_COMMAND_ENV });
      if (!secretResult.ok) return secretResult;
    } else {
      await runSystemCommand('nmcli', ['connection', 'modify', 'uuid', saved.uuid, 'connection.autoconnect', 'yes'], { env: SYSTEM_COMMAND_ENV });
    }
    const activateResult = await runSystemCommand('nmcli', ['--wait', '30', 'connection', 'up', 'uuid', saved.uuid], { timeout: 40000, env: SYSTEM_COMMAND_ENV });
    if (!activateResult.ok) return { ...activateResult, needsPassword: true };
    return getWifiState(false);
  }

  const args = ['--wait', '30', 'device', 'wifi', 'connect', ssid];
  if (password) args.push('password', password);
  const result = await runSystemCommand('nmcli', args, { timeout: 40000, env: SYSTEM_COMMAND_ENV });
  if (!result.ok) return result;
  const created = (await getSavedWifiConnections()).find((profile) => profile.ssid === ssid);
  if (created) await runSystemCommand('nmcli', ['connection', 'modify', 'uuid', created.uuid, 'connection.autoconnect', 'yes'], { env: SYSTEM_COMMAND_ENV });
  return getWifiState(false);
}

function powerHelperPath() {
  const installed = '/usr/libexec/fedora-tv-os-system-settings';
  const bundled = app.isPackaged
    ? path.join(process.resourcesPath, 'tv-session', 'fedora-tv-os-system-settings')
    : path.join(__dirname, '..', 'session', 'fedora-tv-os-system-settings');
  if (fs.existsSync(installed)) return installed;
  if (fs.existsSync(bundled)) return bundled;
  return null;
}

function validatePowerSettings(candidate = {}) {
  const idleTimeout = [0, 5, 10, 20, 30, 60, 120].includes(Number(candidate.idleTimeout)) ? Number(candidate.idleTimeout) : 0;
  const powerActions = ['ask', 'poweroff', 'suspend', 'ignore'];
  const lidActions = ['suspend', 'poweroff', 'ignore'];
  return {
    idleTimeout,
    powerButtonAction: powerActions.includes(candidate.powerButtonAction) ? candidate.powerButtonAction : POWER_DEFAULTS.powerButtonAction,
    lidAction: lidActions.includes(candidate.lidAction) ? candidate.lidAction : POWER_DEFAULTS.lidAction,
    lidExternalAction: lidActions.includes(candidate.lidExternalAction) ? candidate.lidExternalAction : POWER_DEFAULTS.lidExternalAction,
    lidDockedAction: lidActions.includes(candidate.lidDockedAction) ? candidate.lidDockedAction : POWER_DEFAULTS.lidDockedAction
  };
}

async function setPowerSettings(candidate) {
  const power = validatePowerSettings(candidate);
  const helper = powerHelperPath();
  if (!helper) return { ok: false, message: 'Системный helper не установлен. Соберите и установите новый RPM.' };
  const agentReady = await ensurePolicyKitAgent();
  if (!agentReady) return { ok: false, message: 'Не найден агент PolicyKit для подтверждения системных настроек.' };
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setKiosk(false);
    mainWindow.setFullScreen(false);
    mainWindow.show();
    mainWindow.focus();
  }
  const pkexecPath = fs.existsSync('/usr/bin/pkexec') ? '/usr/bin/pkexec' : 'pkexec';
  const result = await runSystemCommand(pkexecPath, [
    helper, 'power', power.powerButtonAction, power.lidAction, power.lidExternalAction, power.lidDockedAction
  ], { timeout: 120000, env: SYSTEM_COMMAND_ENV });
  restoreKioskWindow();
  if (!result.ok) {
    const canceled = /dismissed|cancel|not authorized|authentication.*failed/i.test(result.message);
    return { ok: false, message: canceled ? 'Изменение настроек отменено.' : `Не удалось изменить настройки питания: ${result.message}` };
  }
  writeSettings({ power });
  return { ok: true, power };
}

ipcMain.handle('settings:get', async () => {
  const preferences = readSettings();
  const [audio, wifi, bluetooth, displays] = await Promise.all([getAudioState(), getWifiState(false), getBluetoothState(false), getDisplayState()]);
  return { ok: true, preferences, audio, wifi, bluetooth, displays, power: { ok: true, ...preferences.power } };
});
ipcMain.handle('settings:get-preferences', () => readSettings());
ipcMain.handle('audio:set-volume', async (_event, volume) => {
  const safeVolume = Math.max(0, Math.min(100, Number(volume) || 0));
  const result = await runSystemCommand('wpctl', ['set-volume', '@DEFAULT_AUDIO_SINK@', `${safeVolume}%`]);
  return result.ok ? getAudioState() : result;
});
ipcMain.handle('audio:toggle-mute', async () => {
  const result = await runSystemCommand('wpctl', ['set-mute', '@DEFAULT_AUDIO_SINK@', 'toggle']);
  return result.ok ? getAudioState() : result;
});
ipcMain.handle('audio:select-output', (_event, id) => selectAudioOutput(id));
ipcMain.handle('display:get', () => getDisplayState());
ipcMain.handle('display:apply', (_event, candidate) => applyDisplaySettings(candidate));
ipcMain.handle('power:set', (_event, candidate) => setPowerSettings(candidate));
ipcMain.handle('wifi:scan', () => getWifiState(true));
ipcMain.handle('wifi:toggle', async (_event, enabled) => {
  const result = await runSystemCommand('nmcli', ['radio', 'wifi', enabled ? 'on' : 'off']);
  return result.ok ? getWifiState(Boolean(enabled)) : result;
});
ipcMain.handle('wifi:connect', (_event, candidate) => connectWifi(candidate));
ipcMain.handle('bluetooth:get', () => getBluetoothState(false));
ipcMain.handle('bluetooth:scan', () => getBluetoothState(true));
ipcMain.handle('bluetooth:toggle', (_event, enabled) => toggleBluetooth(Boolean(enabled)));
ipcMain.handle('bluetooth:device-toggle', (_event, address) => toggleBluetoothDevice(address));
ipcMain.handle('language:set', (_event, language) => writeSettings({ language: language === 'en' ? 'en' : 'ru' }));
ipcMain.on('external:home', showLauncher);


ipcMain.handle('app:get-info', () => ({
  version: app.getVersion(),
  packaged: app.isPackaged,
  appImage: Boolean(process.env.APPIMAGE),
  widevine: protectedMediaVersion
}));
ipcMain.handle('update:get-state', () => updateState);
ipcMain.handle('update:check', () => checkForUpdates());
ipcMain.handle('update:download', async () => {
  if (updateState.status !== 'available') return { ok: false, message: 'Обновление ещё не найдено.' };
  try {
    sendUpdateState({ status: 'downloading', progress: 0, message: 'Начинаем загрузку…' });
    await autoUpdater.downloadUpdate();
    return { ok: true };
  } catch (error) {
    const message = normalizeUpdateError(error);
    sendUpdateState({ status: 'error', message });
    return { ok: false, message };
  }
});
ipcMain.handle('update:install', () => installDownloadedRpm());
