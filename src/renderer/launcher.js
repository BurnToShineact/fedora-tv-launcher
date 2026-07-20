const grid = document.getElementById('app-grid');
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
const manageList = document.getElementById('manage-list');
const toast = document.getElementById('toast');
const appVersion = document.getElementById('app-version');
const updateMessage = document.getElementById('update-message');
const updateProgress = document.getElementById('update-progress');
const updateProgressBar = document.getElementById('update-progress-bar');
const updateCheckButton = document.getElementById('update-check');
const updateDownloadButton = document.getElementById('update-download');
const updateInstallButton = document.getElementById('update-install');
let focusables = [];
let focusIndex = 0;
let previousFocusIndex = 0;
let toastTimer;
let selectedColor = '#2563eb';
let appsCache = [];
let confirmHandler = null;


function renderUpdateState(state = {}) {
  const status = state.status || 'idle';
  updateMessage.textContent = state.message || 'Нажмите «Проверить обновления».';
  updateCheckButton.disabled = status === 'checking' || status === 'downloading';
  updateCheckButton.textContent = status === 'checking' ? 'Проверяем…' : 'Проверить обновления';
  updateDownloadButton.hidden = status !== 'available';
  updateInstallButton.hidden = status !== 'downloaded';
  const showProgress = status === 'downloading' || status === 'downloaded';
  updateProgress.hidden = !showProgress;
  updateProgressBar.style.width = `${Math.max(0, Math.min(100, state.progress || 0))}%`;
  if (!manageBackdrop.hidden) refreshFocusables(Math.min(focusIndex, Math.max(0, focusables.length - 1)));
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
  if (!addBackdrop.hidden) return addBackdrop;
  if (!manageBackdrop.hidden) return manageBackdrop;
  if (!backdrop.hidden) return backdrop;
  return null;
}

function refreshFocusables(preferred = 0) {
  const scope = activeOverlay() || document;
  focusables = [...scope.querySelectorAll('.focusable')].filter((el) => !el.disabled && !el.closest('[hidden]'));
  focusIndex = Math.max(0, Math.min(preferred, focusables.length - 1));
  setFocus(focusIndex);
}

function setFocus(index) {
  document.querySelectorAll('.focused').forEach((el) => el.classList.remove('focused'));
  if (!focusables.length) return;
  focusIndex = (index + focusables.length) % focusables.length;
  const target = focusables[focusIndex];
  target.classList.add('focused');
  target.focus({ preventScroll:true });
  target.scrollIntoView({ block:'nearest', inline:'nearest' });
}

function moveFocus(direction) {
  const current = focusables[focusIndex];
  if (!current) return;
  const rect = current.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  let best = null;
  let bestScore = Infinity;

  focusables.forEach((candidate, index) => {
    if (candidate === current) return;
    const r = candidate.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    const valid = direction === 'left' ? dx < -5 : direction === 'right' ? dx > 5 : direction === 'up' ? dy < -5 : dy > 5;
    if (!valid) return;
    const primary = direction === 'left' || direction === 'right' ? Math.abs(dx) : Math.abs(dy);
    const secondary = direction === 'left' || direction === 'right' ? Math.abs(dy) : Math.abs(dx);
    const score = primary + secondary * 2.4;
    if (score < bestScore) { bestScore = score; best = index; }
  });
  if (best !== null) setFocus(best);
}

function openConfirm(title, text, confirmText, handler) {
  previousFocusIndex = focusIndex;
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
  refreshFocusables(previousFocusIndex);
}

function openAddPanel() {
  previousFocusIndex = focusIndex;
  addForm.reset();
  selectedColor = '#2563eb';
  document.querySelectorAll('.color-choice').forEach((button, index) => button.classList.toggle('selected', index === 0));
  addBackdrop.hidden = false;
  refreshFocusables(0);
  titleInput.focus();
}

function closeAddPanel() {
  addBackdrop.hidden = true;
  refreshFocusables(previousFocusIndex);
}

function renderManageList() {
  const customApps = appsCache.filter((app) => app.custom);
  manageList.innerHTML = '';
  if (!customApps.length) {
    manageList.innerHTML = '<div class="empty-state">Вы ещё не добавили собственные веб-приложения.</div>';
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
    row.querySelector('.manage-copy span').textContent = app.url;
    row.querySelector('.delete-button').addEventListener('click', () => requestDelete(app));
    manageList.appendChild(row);
  }
}

function openManagePanel() {
  previousFocusIndex = focusIndex;
  renderManageList();
  manageBackdrop.hidden = false;
  refreshFocusables(0);
}

function closeManagePanel() {
  manageBackdrop.hidden = true;
  refreshFocusables(previousFocusIndex);
}

function requestDelete(app) {
  openConfirm('Удалить приложение?', `Плитка «${app.title}» будет удалена. Данные входа на сайте останутся в профиле браузера.`, 'Удалить', async () => {
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
    const result = await window.tv.openApp(selectedApp);
    if (!result?.ok) showToast(result?.message || 'Не удалось открыть приложение');
    return;
  }
  if (element.dataset.action) {
    const action = element.dataset.action;
    openConfirm(action === 'poweroff' ? 'Выключить мини‑ПК?' : 'Перезагрузить мини‑ПК?', 'Все открытые приложения будут закрыты.', action === 'poweroff' ? 'Выключить' : 'Перезагрузить', async () => {
      const result = await window.tv.systemAction(action);
      if (!result?.ok) { closeConfirm(); showToast(result?.message || 'Команда не выполнена'); }
    });
  }
}

async function renderApps() {
  appsCache = await window.tv.getApps();
  grid.innerHTML = '';
  for (const app of appsCache) {
    const button = document.createElement('button');
    button.className = 'app-card focusable';
    button.style.setProperty('--accent', app.accent || '#334155');
    button.dataset.app = JSON.stringify(app);
    button.innerHTML = '<span class="icon"></span><span class="title"></span>';
    button.querySelector('.icon').textContent = app.icon || app.title.slice(0,2).toUpperCase();
    button.querySelector('.title').textContent = app.title;
    button.addEventListener('click', () => activate(button));
    grid.appendChild(button);
  }
  const addButton = document.createElement('button');
  addButton.className = 'app-card add-card focusable';
  addButton.dataset.special = 'add';
  addButton.innerHTML = '<span class="icon">＋</span><span class="title">Добавить приложение</span>';
  addButton.addEventListener('click', () => activate(addButton));
  grid.appendChild(addButton);
}

async function loadApps() {
  await renderApps();
  document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => activate(button)));
  document.querySelectorAll('[data-add-close]').forEach((button) => button.addEventListener('click', closeAddPanel));
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
    openConfirm('Установить обновление?', 'Fedora TV перезапустится и откроется уже в новой версии.', 'Перезапустить', async () => {
      const result = await window.tv.installUpdate();
      if (!result?.ok) { closeConfirm(); showToast(result?.message || 'Не удалось установить обновление'); }
    });
  });
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

document.addEventListener('keydown', async (event) => {
  const key = event.key;
  const typing = ['INPUT','TEXTAREA'].includes(document.activeElement?.tagName);
  if (!typing && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' ','Escape','Backspace','BrowserBack','Home'].includes(key)) event.preventDefault();
  if (typing) {
    if (key === 'Escape' || key === 'BrowserBack') { event.preventDefault(); closeAddPanel(); }
    return;
  }
  if (key === 'ArrowLeft') moveFocus('left');
  else if (key === 'ArrowRight') moveFocus('right');
  else if (key === 'ArrowUp') moveFocus('up');
  else if (key === 'ArrowDown') moveFocus('down');
  else if (key === 'Enter' || key === ' ') await activate(focusables[focusIndex]);
  else if (key === 'Escape' || key === 'Backspace' || key === 'BrowserBack') {
    if (!backdrop.hidden) closeConfirm();
    else if (!addBackdrop.hidden) closeAddPanel();
    else if (!manageBackdrop.hidden) closeManagePanel();
    else window.tv.browserBack();
  } else if (key === 'Home') {
    backdrop.hidden = addBackdrop.hidden = manageBackdrop.hidden = true;
    window.tv.goHome();
  } else if (key === 'F11') window.tv.toggleFullscreen();
  else if (key === 'AudioVolumeUp') window.tv.systemAction('volume-up');
  else if (key === 'AudioVolumeDown') window.tv.systemAction('volume-down');
  else if (key === 'AudioVolumeMute') window.tv.systemAction('mute');
});

document.addEventListener('mousemove', () => document.querySelectorAll('.focused').forEach((el) => el.classList.remove('focused')));
window.tv.onHomeRequested(() => { backdrop.hidden = addBackdrop.hidden = manageBackdrop.hidden = true; refreshFocusables(0); });
window.tv.onUpdateState(renderUpdateState);
updateClock();
setInterval(updateClock, 1000);
loadApps().catch((error) => showToast(error.message));
