const { app, BrowserWindow, WebContentsView, ipcMain, globalShortcut, session } = require('electron');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let browserView;
let browserVisible = false;
let updateState = { status: 'idle', version: app.getVersion(), progress: 0, message: '' };
let updateCheckInProgress = false;
const isDev = process.argv.includes('--dev');


function sendUpdateState(patch = {}) {
  updateState = { ...updateState, ...patch, version: app.getVersion() };
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update:state', updateState);
  }
}

function normalizeUpdateError(error) {
  const message = String(error?.message || error || 'Неизвестная ошибка');
  if (/404|latest-linux\.yml/i.test(message)) return 'Релиз обновления пока не опубликован в GitHub.';
  if (/net::|network|ENOTFOUND|ECONN/i.test(message)) return 'Не удалось подключиться к GitHub. Проверьте интернет.';
  return message.slice(0, 240);
}

function configureUpdater() {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.allowDowngrade = false;

  autoUpdater.on('checking-for-update', () => {
    updateCheckInProgress = true;
    sendUpdateState({ status: 'checking', progress: 0, message: 'Проверяем GitHub Releases…' });
  });
  autoUpdater.on('update-available', (info) => {
    updateCheckInProgress = false;
    sendUpdateState({ status: 'available', availableVersion: info.version, progress: 0, message: `Доступна версия ${info.version}` });
  });
  autoUpdater.on('update-not-available', () => {
    updateCheckInProgress = false;
    sendUpdateState({ status: 'current', availableVersion: null, progress: 0, message: 'Установлена последняя версия.' });
  });
  autoUpdater.on('download-progress', (progress) => {
    sendUpdateState({ status: 'downloading', progress: Math.round(progress.percent || 0), message: 'Загружаем обновление…' });
  });
  autoUpdater.on('update-downloaded', (info) => {
    sendUpdateState({ status: 'downloaded', availableVersion: info.version, progress: 100, message: `Версия ${info.version} готова к установке.` });
  });
  autoUpdater.on('error', (error) => {
    updateCheckInProgress = false;
    sendUpdateState({ status: 'error', progress: 0, message: normalizeUpdateError(error) });
  });
}

async function checkForUpdates() {
  if (!app.isPackaged) {
    sendUpdateState({ status: 'dev', message: 'Проверка обновлений доступна в собранной AppImage-версии.' });
    return updateState;
  }
  if (process.platform === 'linux' && !process.env.APPIMAGE) {
    sendUpdateState({ status: 'unsupported', message: 'Автообновление работает при запуске Fedora TV из AppImage.' });
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

function readApps() {
  const source = fs.existsSync(appsPath()) ? appsPath() : bundledAppsPath();
  return JSON.parse(fs.readFileSync(source, 'utf8'));
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

function sendBrowserState(extra = {}) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send('browser:state', {
    visible: browserVisible,
    canGoBack: Boolean(browserView?.webContents.canGoBack()),
    loading: Boolean(browserView?.webContents.isLoading()),
    title: browserView?.webContents.getTitle() || '',
    url: browserView?.webContents.getURL() || '',
    ...extra
  });
}

function resizeBrowserView() {
  if (!mainWindow || !browserView || !browserVisible) return;
  const [width, height] = mainWindow.getContentSize();
  browserView.setBounds({ x: 0, y: 0, width, height });
}

function ensureBrowserView() {
  if (browserView) return browserView;

  browserView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      partition: 'persist:fedora-tv'
    }
  });

  browserView.setBackgroundColor('#090d14');
  browserView.webContents.setWindowOpenHandler(({ url }) => {
    browserView.webContents.loadURL(url);
    return { action: 'deny' };
  });

  for (const eventName of ['did-start-loading', 'did-stop-loading', 'did-navigate', 'did-navigate-in-page', 'page-title-updated']) {
    browserView.webContents.on(eventName, () => sendBrowserState());
  }

  browserView.webContents.on('before-input-event', (event, input) => {
    const key = input.key;
    if (key === 'Home' || key === 'BrowserHome' || (key === 'Escape' && input.alt)) {
      event.preventDefault();
      showLauncher();
      return;
    }
    if ((key === 'BrowserBack' || key === 'Escape' || key === 'Backspace') && input.type === 'keyDown') {
      event.preventDefault();
      if (browserView.webContents.canGoBack()) browserView.webContents.goBack();
      else showLauncher();
    }
  });

  return browserView;
}

function showLauncher() {
  browserVisible = false;
  if (browserView && mainWindow?.contentView.children.includes(browserView)) {
    mainWindow.contentView.removeChildView(browserView);
  }
  mainWindow?.webContents.focus();
  mainWindow?.webContents.send('launcher:home');
  sendBrowserState({ visible: false });
}

async function openWebsite(url) {
  const view = ensureBrowserView();
  if (!mainWindow.contentView.children.includes(view)) mainWindow.contentView.addChildView(view);
  browserVisible = true;
  resizeBrowserView();
  view.webContents.focus();
  await view.webContents.loadURL(url);
  sendBrowserState({ visible: true });
}

function createWindow() {
  mainWindow = new BrowserWindow({
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

function runSystemCommand(command, args = []) {
  return new Promise((resolve) => {
    execFile(command, args, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) resolve({ ok: false, message: stderr || error.message });
      else resolve({ ok: true, message: stdout.trim() });
    });
  });
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_wc, _permission, callback) => callback(false));
  configureUpdater();
  createWindow();
  mainWindow.webContents.once('did-finish-load', () => {
    sendUpdateState();
    setTimeout(() => checkForUpdates(), 15000);
  });
  setInterval(() => checkForUpdates(), 6 * 60 * 60 * 1000);

  globalShortcut.register('Super+Home', showLauncher);
  globalShortcut.register('CommandOrControl+Alt+H', showLauncher);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('apps:get', () => readApps());

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
  if (selectedApp.action === 'settings') return { ok: true, action: 'settings' };
  if (!/^https:\/\//i.test(selectedApp.url || '')) return { ok: false, message: 'Разрешены только HTTPS-адреса' };
  try {
    await openWebsite(selectedApp.url);
    return { ok: true };
  } catch (error) {
    showLauncher();
    return { ok: false, message: error.message };
  }
});

ipcMain.handle('browser:back', () => {
  if (!browserView || !browserVisible) return { atHome: true };
  if (browserView.webContents.canGoBack()) {
    browserView.webContents.goBack();
    return { atHome: false };
  }
  showLauncher();
  return { atHome: true };
});
ipcMain.handle('browser:home', () => { showLauncher(); return true; });
ipcMain.handle('browser:refresh', () => { browserView?.webContents.reload(); return true; });
ipcMain.handle('window:toggle-fullscreen', () => {
  if (!mainWindow) return false;
  mainWindow.setKiosk(false);
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
  return mainWindow.isFullScreen();
});
ipcMain.handle('system:action', async (_event, action) => {
  if (action === 'poweroff') return runSystemCommand('systemctl', ['poweroff']);
  if (action === 'reboot') return runSystemCommand('systemctl', ['reboot']);
  if (action === 'volume-up') return runSystemCommand('wpctl', ['set-volume', '@DEFAULT_AUDIO_SINK@', '5%+']);
  if (action === 'volume-down') return runSystemCommand('wpctl', ['set-volume', '@DEFAULT_AUDIO_SINK@', '5%-']);
  if (action === 'mute') return runSystemCommand('wpctl', ['set-mute', '@DEFAULT_AUDIO_SINK@', 'toggle']);
  return { ok: false, message: 'Неизвестное действие' };
});


ipcMain.handle('app:get-info', () => ({
  version: app.getVersion(),
  packaged: app.isPackaged,
  appImage: Boolean(process.env.APPIMAGE)
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
ipcMain.handle('update:install', () => {
  if (updateState.status !== 'downloaded') return { ok: false, message: 'Обновление ещё не загружено.' };
  setImmediate(() => autoUpdater.quitAndInstall(false, true));
  return { ok: true };
});
