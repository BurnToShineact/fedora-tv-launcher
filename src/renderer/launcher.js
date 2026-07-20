const grid = document.getElementById('app-grid');
const launcher = document.getElementById('launcher');
const browserToolbar = document.getElementById('browser-toolbar');
const browserBackButton = document.getElementById('browser-back');
const browserHomeButton = document.getElementById('browser-home');
const browserRefreshButton = document.getElementById('browser-refresh');
const browserTitle = document.getElementById('browser-title');
const browserUrl = document.getElementById('browser-url');
const browserLoading = document.getElementById('browser-loading');
const updateNotice = document.getElementById('update-notice');
const updateNoticeTitle = document.getElementById('update-notice-title');
const updateNoticeMessage = document.getElementById('update-notice-message');
const updateNoticeProgress = document.getElementById('update-notice-progress');
const updateNoticeProgressBar = document.getElementById('update-notice-progress-bar');
const updateNoticeAction = document.getElementById('update-notice-action');
const updateNoticeLater = document.getElementById('update-notice-later');
const clock = document.getElementById('clock');
const dateLabel = document.getElementById('date');
const backdrop = document.getElementById('dialog-backdrop');
const dialogTitle = document.getElementById('dialog-title');
const dialogText = document.getElementById('dialog-text');
const dialogConfirm = document.querySelector('[data-dialog="confirm"]');
const dialogCancel = document.querySelector('[data-dialog="cancel"]');
const addBackdrop = document.getElementById('add-app-backdrop');
const manageBackdrop = document.getElementById('manage-backdrop');
const addForm = document.getElementById('add-app-form');
const titleInput = document.getElementById('app-title');
const urlInput = document.getElementById('app-url');
const systemAppPicker = document.getElementById('system-app-picker');
const systemAppList = document.getElementById('system-app-list');
const systemAppRefresh = document.getElementById('system-app-refresh');
const manageList = document.getElementById('manage-list');
const toast = document.getElementById('toast');
const appVersion = document.getElementById('app-version');
const updateMessage = document.getElementById('update-message');
const updateProgress = document.getElementById('update-progress');
const updateProgressBar = document.getElementById('update-progress-bar');
const updateCheckButton = document.getElementById('update-check');
const updateDownloadButton = document.getElementById('update-download');
const updateInstallButton = document.getElementById('update-install');
const backgroundPreview = document.getElementById('background-preview');
const backgroundChooseButton = document.getElementById('background-choose');
const backgroundClearButton = document.getElementById('background-clear');
let focusables = [];
let focusIndex = 0;
let toastTimer;
let selectedColor = '#2563eb';
let appsCache = [];
let confirmHandler = null;
let latestUpdateState = {};
let dismissedUpdateKey = '';
let browserOpen = false;
const rememberedFocus = new WeakMap();
const overlayReturnFocus = new WeakMap();

function renderBrowserState(state = {}) {
  const visible = Boolean(state.visible);
  browserOpen = visible;
  browserToolbar.hidden = !visible;
  launcher.hidden = visible;
  document.body.classList.toggle('browser-open', visible);
  browserTitle.textContent = state.title || 'Веб-приложение';
  browserUrl.textContent = state.url || '';
  browserBackButton.disabled = !state.canGoBack;
  browserLoading.hidden = !state.loading;
}

function applyBackground(result = {}) {
  const dataUrl = result.ok ? result.dataUrl : null;
  document.body.classList.toggle('has-custom-background', Boolean(dataUrl));
  if (dataUrl) {
    document.body.style.setProperty('--user-background', `url(${dataUrl})`);
    backgroundPreview.style.backgroundImage = `url(${dataUrl})`;
    backgroundPreview.querySelector('span').textContent = 'Пользовательский фон';
  } else {
    document.body.style.removeProperty('--user-background');
    backgroundPreview.style.removeProperty('background-image');
    backgroundPreview.querySelector('span').textContent = 'Стандартный фон';
  }
  backgroundClearButton.disabled = !dataUrl;
}

async function initializeBackground() {
  const result = await window.tv.getBackground();
  if (!result?.ok) return showToast(result?.message || 'Не удалось загрузить фон');
  applyBackground(result);
}


function renderUpdateState(state = {}) {
  const status = state.status || 'idle';
  const noticeWasHidden = updateNotice.hidden;
  latestUpdateState = state;
  updateMessage.textContent = state.message || 'Нажмите «Проверить обновления».';
  updateCheckButton.disabled = ['checking', 'downloading', 'installing'].includes(status);
  updateCheckButton.textContent = status === 'checking' ? 'Проверяем…' : 'Проверить обновления';
  updateDownloadButton.hidden = true;
  updateInstallButton.hidden = status !== 'downloaded';
  updateInstallButton.disabled = status === 'installing';
  const showProgress = ['downloading', 'downloaded', 'installing', 'installed'].includes(status);
  updateProgress.hidden = !showProgress;
  updateProgressBar.style.width = `${Math.max(0, Math.min(100, state.progress || 0))}%`;

  const noticeStatuses = ['available', 'downloading', 'downloaded', 'installing', 'error'];
  const noticeKey = `${status}:${state.availableVersion || ''}`;
  const showNotice = noticeStatuses.includes(status) && dismissedUpdateKey !== noticeKey;
  updateNotice.hidden = !showNotice;
  updateNoticeTitle.textContent = status === 'downloaded' ? `Версия ${state.availableVersion} готова` : status === 'error' ? 'Не удалось обновиться' : 'Обновление Fedora TV';
  updateNoticeMessage.textContent = state.message || '';
  updateNoticeProgress.hidden = status !== 'downloading';
  updateNoticeProgressBar.style.width = `${Math.max(0, Math.min(100, state.progress || 0))}%`;
  updateNoticeAction.hidden = !['downloaded', 'error'].includes(status);
  updateNoticeAction.textContent = status === 'error' ? 'Повторить' : 'Установить';
  updateNoticeLater.hidden = status === 'installing';
  if (noticeWasHidden !== updateNotice.hidden && !activeOverlay() && !launcher.hidden) refreshFocusableCache();
  if (!manageBackdrop.hidden) refreshFocusables(Math.min(focusIndex, Math.max(0, focusables.length - 1)));
}

function requestUpdateInstall() {
  openConfirm(
    'Установить обновление?',
    'Fedora покажет системный запрос пароля, установит RPM и автоматически перезапустит оболочку.',
    'Установить',
    async () => {
      const result = await window.tv.installUpdate();
      if (!result?.ok) {
        closeConfirm();
        showToast(result?.message || 'Не удалось установить обновление');
      }
    }
  );
}

async function initializeUpdater() {
  const info = await window.tv.getAppInfo();
  appVersion.textContent = `Версия ${info.version}`;
  renderUpdateState(await window.tv.getUpdateState());
}

function updateClock() {
  const now = new Date();
  clock.textContent = new Intl.DateTimeFormat('ru-RU', { hour:'2-digit', minute:'2-digit' }).format(now);
  dateLabel.textContent = new Intl.DateTimeFormat('ru-RU', { weekday:'short', day:'numeric', month:'long' }).format(now);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function activeOverlay() {
  if (!backdrop.hidden) return backdrop;
  if (!addBackdrop.hidden) return addBackdrop;
  if (!manageBackdrop.hidden) return manageBackdrop;
  return null;
}

function navigationScope() {
  return activeOverlay() || (browserOpen ? browserToolbar : document);
}

function availableFocusables(scope = navigationScope()) {
  return [...scope.querySelectorAll('.focusable')].filter((el) => !el.disabled && !el.closest('[hidden]'));
}

function refreshFocusableCache() {
  const current = document.activeElement;
  const scope = navigationScope();
  focusables = availableFocusables(scope);
  const currentIndex = focusables.indexOf(current);
  focusIndex = currentIndex >= 0 ? currentIndex : Math.min(focusIndex, Math.max(0, focusables.length - 1));
}

function refreshFocusables(preferred = null) {
  const scope = navigationScope();
  focusables = availableFocusables(scope);
  const remembered = rememberedFocus.get(scope);
  const target = preferred instanceof Element && focusables.includes(preferred)
    ? preferred
    : typeof preferred === 'number'
      ? focusables[Math.max(0, Math.min(preferred, focusables.length - 1))]
      : remembered && focusables.includes(remembered)
        ? remembered
        : focusables[0];
  setFocus(target);
}

function setFocus(target) {
  document.querySelectorAll('.focused').forEach((el) => el.classList.remove('focused'));
  if (!focusables.length) return;
  focusIndex = typeof target === 'number' ? target : focusables.indexOf(target);
  focusIndex = Math.max(0, Math.min(focusIndex, focusables.length - 1));
  target = focusables[focusIndex];
  target.classList.add('focused');
  target.focus({ preventScroll:true });
  target.scrollIntoView({ block:'nearest', inline:'nearest' });
  rememberedFocus.set(navigationScope(), target);
}

function elementCenter(element) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, rect };
}

function closestInDirection(current, candidates, direction, strictRow = false) {
  const origin = elementCenter(current);
  let best = null;
  let bestScore = Infinity;
  for (const candidate of candidates) {
    if (candidate === current) continue;
    const point = elementCenter(candidate);
    const dx = point.x - origin.x;
    const dy = point.y - origin.y;
    const horizontal = direction === 'left' || direction === 'right';
    const valid = direction === 'left' ? dx < -5 : direction === 'right' ? dx > 5 : direction === 'up' ? dy < -5 : dy > 5;
    if (!valid) continue;
    if (strictRow && Math.abs(dy) > Math.max(origin.rect.height, point.rect.height) * .55) continue;
    const primary = horizontal ? Math.abs(dx) : Math.abs(dy);
    const secondary = horizontal ? Math.abs(dy) : Math.abs(dx);
    const score = primary + secondary * 3.2;
    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  return best;
}

function moveFocus(direction) {
  const current = focusables[focusIndex];
  if (!current) return;
  const zone = current.closest('[data-nav-zone]');
  const sameZone = zone ? focusables.filter((candidate) => candidate.closest('[data-nav-zone]') === zone) : focusables;
  const horizontal = direction === 'left' || direction === 'right';
  let target = closestInDirection(current, sameZone, direction, horizontal && Boolean(zone));

  if (!target && zone && !horizontal) {
    const order = Number(zone.dataset.navOrder || 0);
    const zones = [...navigationScope().querySelectorAll('[data-nav-zone]')].filter((candidateZone) => availableFocusables(candidateZone).length);
    const ordered = zones
      .filter((candidateZone) => direction === 'up' ? Number(candidateZone.dataset.navOrder) < order : Number(candidateZone.dataset.navOrder) > order)
      .sort((a, b) => direction === 'up' ? Number(b.dataset.navOrder) - Number(a.dataset.navOrder) : Number(a.dataset.navOrder) - Number(b.dataset.navOrder));
    if (ordered[0]) target = closestInDirection(current, availableFocusables(ordered[0]), direction);
  }

  if (!target && !zone) target = closestInDirection(current, focusables, direction);
  if (target) setFocus(target);
}

function openConfirm(title, text, confirmText, handler) {
  overlayReturnFocus.set(backdrop, document.activeElement);
  dialogTitle.textContent = title;
  dialogText.textContent = text;
  dialogConfirm.textContent = confirmText;
  confirmHandler = handler;
  backdrop.hidden = false;
  refreshFocusables(0);
}

function closeConfirm() {
  backdrop.hidden = true;
  confirmHandler = null;
  refreshFocusables(overlayReturnFocus.get(backdrop) || 0);
}

function setAddMode(mode) {
  const systemMode = mode === 'system';
  addForm.hidden = systemMode;
  systemAppPicker.hidden = !systemMode;
  document.querySelectorAll('[data-add-mode]').forEach((button) => {
    const selected = button.dataset.addMode === mode;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  refreshFocusables(0);
  if (systemMode) loadSystemApps();
}

function openAddPanel() {
  overlayReturnFocus.set(addBackdrop, document.activeElement);
  addForm.reset();
  selectedColor = '#2563eb';
  document.querySelectorAll('.color-choice').forEach((button, index) => button.classList.toggle('selected', index === 0));
  addBackdrop.hidden = false;
  setAddMode('web');
  refreshFocusables(titleInput);
}

function closeAddPanel() {
  addBackdrop.hidden = true;
  refreshFocusables(overlayReturnFocus.get(addBackdrop) || 0);
}

async function addInstalledApp(installedApp) {
  const result = await window.tv.addSystemApp(installedApp.desktopId);
  if (!result?.ok) return showToast(result?.message || 'Не удалось добавить приложение');
  appsCache = result.apps;
  closeAddPanel();
  await renderApps();
  refreshFocusables(Math.max(0, appsCache.length - 1));
  showToast(`«${installedApp.title}» добавлено`);
}

async function loadSystemApps() {
  systemAppList.innerHTML = '<div class="empty-state">Ищем установленные приложения…</div>';
  try {
    const installedApps = await window.tv.getSystemApps();
    systemAppList.innerHTML = '';
    if (!installedApps.length) {
      systemAppList.innerHTML = '<div class="empty-state">Подходящие приложения не найдены.</div>';
      refreshFocusables(0);
      return;
    }
    for (const installedApp of installedApps) {
      const row = document.createElement('div');
      row.className = 'system-app-row';
      row.innerHTML = `
        <div class="manage-icon" style="--accent:#334155"></div>
        <div class="manage-copy"><strong></strong><span></span></div>
        <button type="button" class="system-add-button focusable"></button>`;
      row.querySelector('.manage-icon').textContent = installedApp.title.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
      row.querySelector('strong').textContent = installedApp.title;
      row.querySelector('.manage-copy span').textContent = installedApp.description;
      const addButton = row.querySelector('.system-add-button');
      addButton.textContent = installedApp.added ? 'Добавлено' : 'Добавить';
      addButton.disabled = installedApp.added;
      addButton.addEventListener('click', () => addInstalledApp(installedApp));
      systemAppList.appendChild(row);
    }
    refreshFocusables(0);
  } catch (error) {
    systemAppList.innerHTML = '<div class="empty-state">Не удалось прочитать список приложений.</div>';
    showToast(error.message);
    refreshFocusables(0);
  }
}

function renderManageList() {
  const customApps = appsCache.filter((app) => app.custom);
  manageList.innerHTML = '';
  if (!customApps.length) {
    manageList.innerHTML = '<div class="empty-state">Вы ещё не добавили собственные приложения.</div>';
    return;
  }
  for (const app of customApps) {
    const row = document.createElement('div');
    row.className = 'manage-row';
    row.innerHTML = `
      <div class="manage-icon" style="--accent:${app.accent}">${app.icon}</div>
      <div class="manage-copy"><strong></strong><span></span></div>
      <button class="delete-button focusable">Удалить</button>`;
    row.querySelector('strong').textContent = app.title;
    row.querySelector('.manage-copy span').textContent = app.type === 'system' ? 'Системное приложение' : app.url;
    row.querySelector('.delete-button').addEventListener('click', () => requestDelete(app));
    manageList.appendChild(row);
  }
}

function openManagePanel() {
  overlayReturnFocus.set(manageBackdrop, document.activeElement);
  renderManageList();
  manageBackdrop.hidden = false;
  refreshFocusables(0);
}

function closeManagePanel() {
  manageBackdrop.hidden = true;
  refreshFocusables(overlayReturnFocus.get(manageBackdrop) || 0);
}

function requestDelete(app) {
  const detail = app.type === 'system' ? 'Само приложение останется установленным в системе.' : 'Данные входа на сайте останутся в профиле браузера.';
  openConfirm('Удалить приложение?', `Плитка «${app.title}» будет удалена. ${detail}`, 'Удалить', async () => {
    const result = await window.tv.deleteApp(app.id);
    closeConfirm();
    if (!result?.ok) return showToast(result?.message || 'Не удалось удалить приложение');
    appsCache = result.apps;
    renderManageList();
    await renderApps();
    manageBackdrop.hidden = false;
    refreshFocusables(0);
    showToast('Приложение удалено');
  });
}

async function activate(element) {
  if (!element) return;
  if (element.dataset.special === 'add') return openAddPanel();
  if (element.dataset.app) {
    const selectedApp = JSON.parse(element.dataset.app);
    if (selectedApp.action === 'settings') return openManagePanel();
    if (selectedApp.type === 'system') showToast('Открываем приложение · Home — вернуться в Fedora TV OS');
    const result = await window.tv.openApp(selectedApp);
    if (!result?.ok) showToast(result?.message || 'Не удалось открыть приложение');
    return;
  }
  if (element.dataset.action) {
    requestSystemAction(element.dataset.action);
  }
}

function requestSystemAction(action) {
  const prompts = {
    logout: ['Сменить пользователя?', 'TV-сессия завершится, и откроется экран входа Fedora.', 'Выйти'],
    reboot: ['Перезагрузить мини‑ПК?', 'Все открытые приложения будут закрыты.', 'Перезагрузить'],
    poweroff: ['Выключить мини‑ПК?', 'Все открытые приложения будут закрыты.', 'Выключить']
  };
  if (!prompts[action]) return;
  const [title, message, confirmLabel] = prompts[action];
  openConfirm(title, message, confirmLabel, async () => {
    const result = await window.tv.systemAction(action);
    if (!result?.ok) { closeConfirm(); showToast(result?.message || 'Команда не выполнена'); }
  });
}

async function renderApps() {
  appsCache = await window.tv.getApps();
  grid.innerHTML = '';
  for (const app of appsCache) {
    const button = document.createElement('button');
    button.className = 'app-card focusable';
    button.style.setProperty('--card-index', grid.children.length);
    button.style.setProperty('--accent', app.accent || '#334155');
    button.dataset.app = JSON.stringify(app);
    button.innerHTML = '<span class="icon"></span><span class="card-copy"><span class="title"></span><span class="kind"></span></span>';
    button.querySelector('.icon').textContent = app.icon || app.title.slice(0,2).toUpperCase();
    button.querySelector('.title').textContent = app.title;
    button.querySelector('.kind').textContent = app.type === 'system' ? 'Системное · Home для возврата' : app.action === 'settings' ? 'Настройки оболочки' : 'Веб-приложение';
    button.addEventListener('click', () => activate(button));
    grid.appendChild(button);
  }
  const addButton = document.createElement('button');
  addButton.className = 'app-card add-card focusable';
  addButton.style.setProperty('--card-index', grid.children.length);
  addButton.dataset.special = 'add';
  addButton.innerHTML = '<span class="icon">＋</span><span class="card-copy"><span class="title">Добавить приложение</span><span class="kind">Сайт или приложение из системы</span></span>';
  addButton.addEventListener('click', () => activate(addButton));
  grid.appendChild(addButton);
}

async function loadApps() {
  await renderApps();
  document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => activate(button)));
  document.querySelectorAll('[data-add-close]').forEach((button) => button.addEventListener('click', closeAddPanel));
  document.querySelectorAll('[data-add-mode]').forEach((button) => button.addEventListener('click', () => setAddMode(button.dataset.addMode)));
  systemAppRefresh.addEventListener('click', loadSystemApps);
  document.querySelectorAll('[data-manage-close]').forEach((button) => button.addEventListener('click', closeManagePanel));
  dialogCancel.addEventListener('click', closeConfirm);
  dialogConfirm.addEventListener('click', async () => { if (confirmHandler) await confirmHandler(); });
  document.querySelectorAll('.color-choice').forEach((button) => button.addEventListener('click', () => {
    selectedColor = button.dataset.color;
    document.querySelectorAll('.color-choice').forEach((choice) => choice.classList.toggle('selected', choice === button));
  }));
  updateCheckButton.addEventListener('click', async () => renderUpdateState(await window.tv.checkForUpdates()));
  updateDownloadButton.addEventListener('click', async () => {
    const result = await window.tv.downloadUpdate();
    if (!result?.ok) showToast(result?.message || 'Не удалось загрузить обновление');
  });
  updateInstallButton.addEventListener('click', () => {
    requestUpdateInstall();
  });
  updateNoticeAction.addEventListener('click', async () => {
    if (latestUpdateState.status === 'error') {
      dismissedUpdateKey = '';
      return renderUpdateState(await window.tv.checkForUpdates());
    }
    requestUpdateInstall();
  });
  updateNoticeLater.addEventListener('click', () => {
    dismissedUpdateKey = `${latestUpdateState.status}:${latestUpdateState.availableVersion || ''}`;
    updateNotice.hidden = true;
    refreshFocusables(0);
  });
  backgroundChooseButton.addEventListener('click', async () => {
    backgroundChooseButton.disabled = true;
    const result = await window.tv.chooseBackground();
    backgroundChooseButton.disabled = false;
    if (result?.canceled) return refreshFocusables(focusIndex);
    if (!result?.ok) return showToast(result?.message || 'Не удалось установить фон');
    applyBackground(result);
    refreshFocusables(focusIndex);
    showToast('Фон обновлён');
  });
  backgroundClearButton.addEventListener('click', async () => {
    const result = await window.tv.clearBackground();
    if (!result?.ok) return showToast(result?.message || 'Не удалось сбросить фон');
    applyBackground(result);
    refreshFocusables(focusIndex);
    showToast('Восстановлен стандартный фон');
  });
  browserBackButton.addEventListener('click', () => window.tv.browserBack());
  browserHomeButton.addEventListener('click', () => window.tv.goHome());
  browserRefreshButton.addEventListener('click', () => window.tv.refresh());
  await initializeBackground();
  await initializeUpdater();
  refreshFocusables(0);
}

addForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  let url = urlInput.value.trim();
  if (!/^https:\/\//i.test(url)) return showToast('Адрес должен начинаться с https://');
  const result = await window.tv.addApp({ title, url, accent:selectedColor });
  if (!result?.ok) return showToast(result?.message || 'Не удалось добавить приложение');
  appsCache = result.apps;
  closeAddPanel();
  await renderApps();
  refreshFocusables(Math.max(0, appsCache.length - 1));
  showToast(`«${title}» добавлено`);
});

const keyActions = new Map([
  ['ArrowLeft', 'left'], ['Left', 'left'],
  ['ArrowRight', 'right'], ['Right', 'right'],
  ['ArrowUp', 'up'], ['Up', 'up'],
  ['ArrowDown', 'down'], ['Down', 'down'],
  ['Enter', 'select'], ['NumpadEnter', 'select'], ['Select', 'select'], ['Accept', 'select'], [' ', 'select'],
  ['Escape', 'back'], ['Backspace', 'back'], ['BrowserBack', 'back'], ['GoBack', 'back'],
  ['Home', 'home'], ['BrowserHome', 'home'],
  ['ContextMenu', 'menu'], ['Menu', 'menu'], ['Apps', 'menu'], ['F10', 'menu'],
  ['AudioVolumeUp', 'volume-up'], ['AudioVolumeDown', 'volume-down'], ['AudioVolumeMute', 'mute'],
  ['MediaPlayPause', 'play-pause'], ['MediaNextTrack', 'next'], ['MediaPreviousTrack', 'previous'], ['MediaStop', 'stop'],
  ['Power', 'power'], ['PowerOff', 'power'], ['XF86PowerOff', 'power']
]);

function closeAllOverlays() {
  backdrop.hidden = true;
  addBackdrop.hidden = true;
  manageBackdrop.hidden = true;
  confirmHandler = null;
}

async function handleInputAction(action) {
  if (action === 'left' || action === 'right' || action === 'up' || action === 'down') return moveFocus(action);
  if (action === 'select') return document.activeElement?.classList.contains('focusable') && document.activeElement.click();
  if (action === 'back') {
    if (!backdrop.hidden) return closeConfirm();
    if (!addBackdrop.hidden) return closeAddPanel();
    if (!manageBackdrop.hidden) return closeManagePanel();
    if (browserOpen) return window.tv.focusBrowser();
    return;
  }
  if (action === 'home') {
    closeAllOverlays();
    return window.tv.goHome();
  }
  if (action === 'menu') {
    if (browserOpen) return window.tv.focusBrowser();
    if (!activeOverlay()) return openManagePanel();
    return;
  }
  if (action === 'power') return requestSystemAction('poweroff');
  if (['volume-up', 'volume-down', 'mute'].includes(action)) return window.tv.systemAction(action);
  if (['play-pause', 'next', 'previous', 'stop'].includes(action)) return window.tv.mediaAction(action);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'F11') {
    event.preventDefault();
    window.tv.toggleFullscreen();
    return;
  }
  const action = keyActions.get(event.key) || keyActions.get(event.code);
  if (!action) return;
  const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
  if (typing && action !== 'back' && action !== 'home' && action !== 'power') return;
  if (event.repeat && ['select', 'back', 'home', 'menu', 'power'].includes(action)) return;
  event.preventDefault();
  handleInputAction(action);
});

const gamepadState = new Map();
function pollGamepads(timestamp) {
  const pads = navigator.getGamepads?.() || [];
  for (const pad of pads) {
    if (!pad) continue;
    const previous = gamepadState.get(pad.index) || { pressed: new Set(), repeats: new Map() };
    const actions = new Set();
    if (pad.buttons[14]?.pressed || pad.axes[0] < -.6) actions.add('left');
    if (pad.buttons[15]?.pressed || pad.axes[0] > .6) actions.add('right');
    if (pad.buttons[12]?.pressed || pad.axes[1] < -.6) actions.add('up');
    if (pad.buttons[13]?.pressed || pad.axes[1] > .6) actions.add('down');
    if (pad.buttons[0]?.pressed) actions.add('select');
    if (pad.buttons[1]?.pressed) actions.add('back');
    if (pad.buttons[9]?.pressed) actions.add('menu');
    if (pad.buttons[16]?.pressed) actions.add('home');
    for (const action of actions) {
      const repeatable = ['left', 'right', 'up', 'down'].includes(action);
      const deadline = previous.repeats.get(action) || 0;
      if (!previous.pressed.has(action) || (repeatable && timestamp >= deadline)) {
        handleInputAction(action);
        previous.repeats.set(action, previous.pressed.has(action) ? timestamp + 120 : timestamp + 450);
      }
    }
    previous.pressed = actions;
    gamepadState.set(pad.index, previous);
  }
  requestAnimationFrame(pollGamepads);
}

document.addEventListener('mousemove', () => document.querySelectorAll('.focused').forEach((el) => el.classList.remove('focused')));
window.tv.onHomeRequested(() => { closeAllOverlays(); refreshFocusables(); });
window.tv.onBrowserToolbarRequested(() => refreshFocusables(0));
window.tv.onSystemActionRequested((action) => requestSystemAction(action));
window.tv.onBrowserState(renderBrowserState);
window.tv.onUpdateState(renderUpdateState);
window.addEventListener('online', () => window.tv.checkForUpdates());
updateClock();
setInterval(updateClock, 1000);
loadApps().catch((error) => showToast(error.message));
requestAnimationFrame(pollGamepads);
