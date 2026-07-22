const grid = document.getElementById('app-grid');
const launcher = document.getElementById('launcher');
const browserToolbar = document.getElementById('browser-toolbar');
const browserBackButton = document.getElementById('browser-back');
const browserHomeButton = document.getElementById('browser-home');
const browserRefreshButton = document.getElementById('browser-refresh');
const browserPlayButton = document.getElementById('browser-play');
const browserFullscreenButton = document.getElementById('browser-fullscreen');
const browserKeyboardButton = document.getElementById('browser-keyboard');
const browserFocusButton = document.getElementById('browser-focus');
const browserTitle = document.getElementById('browser-title');
const browserUrl = document.getElementById('browser-url');
const browserError = document.getElementById('browser-error');
const browserLoading = document.getElementById('browser-loading');
const updateNotice = document.getElementById('update-notice');
const updateNoticeTitle = document.getElementById('update-notice-title');
const updateNoticeMessage = document.getElementById('update-notice-message');
const updateNoticeProgress = document.getElementById('update-notice-progress');
const updateNoticeProgressBar = document.getElementById('update-notice-progress-bar');
const updateNoticeAction = document.getElementById('update-notice-action');
const updateNoticeLater = document.getElementById('update-notice-later');
const updateVisual = document.getElementById('update-visual');
const updateVisualTitle = document.getElementById('update-visual-title');
const updateVisualMessage = document.getElementById('update-visual-message');
const updateVisualBar = document.getElementById('update-visual-bar');
const updateVisualPercent = document.getElementById('update-visual-percent');
const updateOrbit = document.getElementById('update-orbit');
const clock = document.getElementById('clock');
const dateLabel = document.getElementById('date');
const weatherCard = document.getElementById('weather-card');
const weatherIcon = document.getElementById('weather-icon');
const weatherLocation = document.getElementById('weather-location');
const weatherTemperature = document.getElementById('weather-temperature');
const weatherCondition = document.getElementById('weather-condition');
const weatherRange = document.getElementById('weather-range');
const weatherDaylight = document.getElementById('weather-daylight');
const weatherDaylightProgress = document.getElementById('weather-daylight-progress');
const shuffleCard = document.getElementById('shuffle-card');
const shuffleIcon = document.getElementById('shuffle-icon');
const shuffleEyebrow = document.getElementById('shuffle-eyebrow');
const shuffleTitle = document.getElementById('shuffle-title');
const shuffleDescription = document.getElementById('shuffle-description');
const backdrop = document.getElementById('dialog-backdrop');
const dialogTitle = document.getElementById('dialog-title');
const dialogText = document.getElementById('dialog-text');
const confirmationDialog = document.getElementById('confirmation-dialog');
const dialogSymbol = document.getElementById('dialog-symbol');
const dialogEyebrow = document.getElementById('dialog-eyebrow');
const dialogConfirm = document.querySelector('[data-dialog="confirm"]');
const dialogCancel = document.querySelector('[data-dialog="cancel"]');
const addBackdrop = document.getElementById('add-app-backdrop');
const manageBackdrop = document.getElementById('manage-backdrop');
const filesBackdrop = document.getElementById('files-backdrop');
const filesClose = document.getElementById('files-close');
const filesUp = document.getElementById('files-up');
const filesRefresh = document.getElementById('files-refresh');
const filesPath = document.getElementById('files-path');
const filesList = document.getElementById('files-list');
const addForm = document.getElementById('add-app-form');
const titleInput = document.getElementById('app-title');
const urlInput = document.getElementById('app-url');
const systemAppPicker = document.getElementById('system-app-picker');
const systemAppList = document.getElementById('system-app-list');
const systemAppRefresh = document.getElementById('system-app-refresh');
const manageList = document.getElementById('manage-list');
const flatpakSearchForm = document.getElementById('flatpak-search-form');
const flatpakSearch = document.getElementById('flatpak-search');
const flatpakSearchButton = document.getElementById('flatpak-search-button');
const flatpakUpdate = document.getElementById('flatpak-update');
const flatpakStatus = document.getElementById('flatpak-status');
const flatpakList = document.getElementById('flatpak-list');
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
const weatherCityForm = document.getElementById('weather-city-form');
const weatherCityInput = document.getElementById('weather-city');
const weatherCitySave = document.getElementById('weather-city-save');
const weatherSettingsStatus = document.getElementById('weather-settings-status');
const keyboardToggle = document.getElementById('keyboard-toggle');
const settingsShortcut = document.getElementById('settings-shortcut');
const topbarNetwork = document.getElementById('topbar-network');
const topbarBluetooth = document.getElementById('topbar-bluetooth');
const topbarVolume = document.getElementById('topbar-volume');
const quickPanel = document.getElementById('quick-panel');
const quickPanelClose = document.getElementById('quick-panel-close');
const quickPanelEyebrow = document.getElementById('quick-panel-eyebrow');
const quickPanelTitle = document.getElementById('quick-panel-title');
const quickSoundSection = document.getElementById('quick-sound-section');
const quickWifiSection = document.getElementById('quick-wifi-section');
const quickBluetoothSection = document.getElementById('quick-bluetooth-section');
const quickVolumeSlider = document.getElementById('quick-volume-slider');
const quickVolumeValue = document.getElementById('quick-volume-value');
const quickMuteToggle = document.getElementById('quick-mute-toggle');
const quickNetworkState = document.getElementById('quick-network-state');
const quickNetworkIcon = document.getElementById('quick-network-icon');
const quickWifiToggle = document.getElementById('quick-wifi-toggle');
const quickWifiScan = document.getElementById('quick-wifi-scan');
const quickWifiList = document.getElementById('quick-wifi-list');
const quickWifiPasswordForm = document.getElementById('quick-wifi-password-form');
const quickWifiPassword = document.getElementById('quick-wifi-password');
const quickWifiPasswordLabel = document.getElementById('quick-wifi-password-label');
const quickWifiPasswordCancel = document.getElementById('quick-wifi-password-cancel');
const quickBluetoothState = document.getElementById('quick-bluetooth-state');
const quickBluetoothToggle = document.getElementById('quick-bluetooth-toggle');
const quickBluetoothScan = document.getElementById('quick-bluetooth-scan');
const quickBluetoothList = document.getElementById('quick-bluetooth-list');
const settingsKeyboardToggle = document.getElementById('settings-keyboard-toggle');
const onscreenKeyboard = document.getElementById('onscreen-keyboard');
const keyboardKeys = document.getElementById('keyboard-keys');
const keyboardClose = document.getElementById('keyboard-close');
const keyboardLanguage = document.getElementById('keyboard-language');
const keyboardMode = document.getElementById('keyboard-mode');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const muteToggle = document.getElementById('mute-toggle');
const audioOutput = document.getElementById('audio-output');
const displayStatus = document.getElementById('display-status');
const displayDescription = document.getElementById('display-description');
const displayOutput = document.getElementById('display-output');
const displayMode = document.getElementById('display-mode');
const displayScale = document.getElementById('display-scale');
const displayTransform = document.getElementById('display-transform');
const displayX = document.getElementById('display-x');
const displayY = document.getElementById('display-y');
const displayEnabled = document.getElementById('display-enabled');
const displayAdaptiveRow = document.getElementById('display-adaptive-row');
const displayAdaptive = document.getElementById('display-adaptive');
const displayApply = document.getElementById('display-apply');
const displayRefresh = document.getElementById('display-refresh');
const powerIdleTimeout = document.getElementById('power-idle-timeout');
const powerButtonAction = document.getElementById('power-button-action');
const powerLidAction = document.getElementById('power-lid-action');
const powerLidExternalAction = document.getElementById('power-lid-external-action');
const powerLidDockedAction = document.getElementById('power-lid-docked-action');
const powerApply = document.getElementById('power-apply');
const shellAutostart = document.getElementById('shell-autostart');
const shellAutostartStatus = document.getElementById('shell-autostart-status');
const cecToggle = document.getElementById('cec-toggle');
const cecStatus = document.getElementById('cec-status');
const hdmiAudioToggle = document.getElementById('hdmi-audio-toggle');
const diagnosticsRefresh = document.getElementById('diagnostics-refresh');
const diagnosticsExport = document.getElementById('diagnostics-export');
const diagnosticsOutput = document.getElementById('diagnostics-output');
const onboarding = document.getElementById('onboarding');
const onboardingStart = document.getElementById('onboarding-start');
const onboardingSkip = document.getElementById('onboarding-skip');
const profileStatus = document.getElementById('profile-status');
const profileSelect = document.getElementById('profile-select');
const profilePin = document.getElementById('profile-pin');
const profileApply = document.getElementById('profile-apply');
const parentalPinForm = document.getElementById('parental-pin-form');
const parentalCurrentPin = document.getElementById('parental-current-pin');
const parentalNewPin = document.getElementById('parental-new-pin');
const screensaverTimeout = document.getElementById('screensaver-timeout');
const screensaver = document.getElementById('screensaver');
const screensaverClock = document.getElementById('screensaver-clock');
const screensaverDate = document.getElementById('screensaver-date');
const wifiToggle = document.getElementById('wifi-toggle');
const wifiScan = document.getElementById('wifi-scan');
const wifiList = document.getElementById('wifi-list');
const wifiPasswordForm = document.getElementById('wifi-password-form');
const wifiPassword = document.getElementById('wifi-password');
const wifiPasswordLabel = document.getElementById('wifi-password-label');
const wifiPasswordCancel = document.getElementById('wifi-password-cancel');
const bluetoothToggle = document.getElementById('bluetooth-toggle');
const bluetoothScan = document.getElementById('bluetooth-scan');
const bluetoothList = document.getElementById('bluetooth-list');
const settingsCategories = document.getElementById('settings-categories');
const settingsPageHeader = document.getElementById('settings-page-header');
const settingsPageDescription = document.getElementById('settings-page-description');
const settingsBack = document.getElementById('settings-back');
let focusables = [];
let focusIndex = 0;
let toastTimer;
let selectedColor = '#2563eb';
let appsCache = [];
let confirmHandler = null;
let latestUpdateState = {};
let dismissedUpdateKey = '';
let browserOpen = false;
let keyboardOpen = false;
let currentLanguage = 'ru';
let keyboardLayoutLanguage = null;
let keyboardSymbolMode = false;
let keyboardShifted = false;
let selectedNetwork = null;
let quickSelectedNetwork = null;
let lastTextInput = null;
let latestAudioState = null;
let latestWifiState = null;
let latestBluetoothState = null;
let latestDisplayState = null;
let activeSettingsCategory = null;
let currentFilesState = { path: null, parentPath: null, entries: [] };
let flatpakLoading = false;
let currentProfile = 'main';
let ambientTimeoutMinutes = 10;
let ambientTimer = null;
let latestWeatherState = null;
let weatherLoading = false;
let selectedShuffleApp = null;
let shuffleOpening = false;
const rememberedFocus = new WeakMap();
const overlayReturnFocus = new WeakMap();

const translations = {
  ru: {
    startupGroup: 'Запуск', startupTitle: 'Автозапуск оболочки', startupEnabled: 'Сразу открывать Fedora TV OS после включения', startupDescription: 'Без ввода пароля и экрана выбора пользователей. Выключение вернёт обычный экран GDM после следующей загрузки.',
    flatpakCatalog: 'Каталог приложений', updateAllApps: 'Обновить все', flatpakDescription: 'Установка выполняется только для TV-пользователя и не требует прав администратора.', searchApps: 'Найти',
    diagnosticsGroup: 'Поддержка', diagnosticsTitle: 'Диагностика', diagnosticsDescription: 'Проверка видео, звука, сети, Bluetooth, Flatpak и журналов оболочки.', runDiagnostics: 'Проверить', exportDiagnostics: 'Сохранить отчёт', welcomeTitle: 'Добро пожаловать', welcomeDescription: 'Настроим сеть, звук и телевизор. После этого всё управление будет доступно с пульта.', welcomeNetwork: 'Подключение к Wi‑Fi', welcomeSound: 'Проверка звука и экрана', welcomeApps: 'Установка приложений', skipSetup: 'Пропустить', startSetup: 'Начать настройку',
    cecTitle: 'Пульт телевизора и звук', cecEnabled: 'Управление через HDMI-CEC', cecDescription: 'Кнопки пульта телевизора управляют оболочкой при наличии CEC-адаптера.', autoHdmiAudio: 'Автоматически выбирать звук HDMI', autoHdmiAudioDescription: 'При подключении телевизора переключать звук на HDMI или DisplayPort.',
    profilesGroup: 'Доступ', profilesTitle: 'Профили и родительский PIN', profilesDescription: 'В детском профиле скрыты настройки, файлы и отмеченные вами приложения.', activeProfile: 'Активный профиль', mainProfile: 'Основной', kidsProfile: 'Детский', parentalPin: 'Текущий PIN', switchProfile: 'Переключить профиль', savePin: 'Сохранить PIN',
    screensaverGroup: 'Экран', screensaverTitle: 'Заставка с часами', screensaverDescription: 'Показывается только на домашнем экране; видео и открытые приложения не прерываются.', screensaverAfter: 'Включать после', weatherGroup: 'Главный экран', weatherTitle: 'Погода', weatherDescription: 'Укажите город для прогноза на домашнем экране. Данные обновляются примерно раз в 15 минут.', weatherCity: 'Город', weatherSave: 'Сохранить и проверить',
    soundGroup: 'Звук', soundTitle: 'Громкость', mute: 'Выключить звук', unmute: 'Включить звук', networkTitle: 'Беспроводная сеть', scan: 'Обновить список', connect: 'Подключиться', cancel: 'Отмена', languageGroup: 'Язык', languageTitle: 'Язык интерфейса', inputGroup: 'Ввод', keyboardTitle: 'Экранная клавиатура', keyboardDescription: 'Открывается автоматически в полях ввода. Её также можно включить кнопкой ⌨ в верхней панели.', openKeyboard: 'Открыть клавиатуру', noNetworks: 'Сети Wi‑Fi не найдены.', wifiOff: 'Wi‑Fi выключен', connected: 'Подключено', secured: 'Защищённая сеть', savedNetwork: 'Сохранённая сеть', open: 'Открытая сеть', signal: 'Сигнал', password: 'Пароль для', apps: 'Приложения', settings: 'Настройки', webApp: 'Веб-приложение', systemApp: 'Системное · Home для возврата', settingsKind: 'Настройки оболочки', addApp: 'Добавить приложение', addKind: 'Сайт или приложение из системы', brandSubtitle: 'Отдельная TV-сессия', logout: 'Сменить пользователя', reboot: 'Перезагрузка', poweroff: 'Выключение', newTile: 'Новая плитка', website: 'Веб-сайт', fromSystem: 'Из системы', systemGroup: 'Система', updateTitle: 'Обновление Fedora TV OS', checkUpdates: 'Проверить обновления', appearanceGroup: 'Оформление', backgroundTitle: 'Фоновое изображение', chooseImage: 'Выбрать изображение', resetBackground: 'Сбросить фон', myApps: 'Мои приложения', done: 'Готово', displayGroup: 'Изображение', displayTitle: 'Дисплеи', displayDescription: 'Выберите экран и настройте его видеорежим. Изменения сохраняются для следующих запусков TV-сессии.', displayOutput: 'Дисплей', displayMode: 'Разрешение и частота', displayScale: 'Масштаб', displayRotation: 'Поворот', displayPositionX: 'Позиция X', displayPositionY: 'Позиция Y', displayEnabled: 'Использовать дисплей', displayEnabledHint: 'Единственный активный экран отключить нельзя.', adaptiveSync: 'Адаптивная частота', adaptiveSyncHint: 'Использовать VRR, если дисплей и видеодрайвер поддерживают его.', rotationNormal: 'Обычный', apply: 'Применить', refreshDevices: 'Обновить устройства', audioOutput: 'Устройство вывода', powerGroup: 'Питание', powerTitle: 'Сон, крышка и кнопки', powerDescription: 'Таймер сна действует в TV-сессии. Крышка и физическая кнопка питания настраиваются для всего устройства после системного подтверждения.', sleepAfter: 'Переходить в сон', never: 'Никогда', powerButton: 'Кнопка питания', askBeforePoweroff: 'Показать подтверждение', poweroffNow: 'Выключить', sleep: 'Сон', doNothing: 'Ничего не делать', lidBattery: 'Закрытие крышки', lidExternalPower: 'Крышка при питании от сети', lidDocked: 'Крышка с внешним дисплеем', applyPower: 'Сохранить настройки питания', bluetoothTitle: 'Bluetooth', bluetoothDescription: 'Подключайте наушники, колонки, пульты и другие устройства.', findDevices: 'Найти устройства', bluetoothOff: 'Bluetooth выключен', noBluetoothDevices: 'Устройства Bluetooth не найдены.', paired: 'Сопряжено', connecting: 'Подключаем…', disconnect: 'Отключить', categorySystem: 'Система', categorySystemHint: 'Обновления и питание', categoryPicture: 'Изображение и звук', categoryPictureHint: 'Экран, масштаб и громкость', categoryConnections: 'Подключения', categoryConnectionsHint: 'Wi‑Fi и Bluetooth', categoryAppearance: 'Оформление', categoryAppearanceHint: 'Фоновое изображение', categoryInput: 'Язык и ввод', categoryInputHint: 'Язык и экранная клавиатура', categoryApps: 'Приложения', categoryAppsHint: 'Добавленные плитки', allSettings: 'Все настройки', filesEyebrow: 'Проводник', filesTitle: 'Файлы', location: 'Расположение', filesHint: 'Выберите папку для перехода или файл, чтобы открыть его в подходящем приложении.'
  },
  en: {
    startupGroup: 'Startup', startupTitle: 'Shell autostart', startupEnabled: 'Open Fedora TV OS immediately after power-on', startupDescription: 'Skips the password and user picker. Turning this off restores the regular GDM login screen after the next boot.',
    flatpakCatalog: 'App catalog', updateAllApps: 'Update all', flatpakDescription: 'Apps are installed only for the TV user and do not require administrator access.', searchApps: 'Search',
    diagnosticsGroup: 'Support', diagnosticsTitle: 'Diagnostics', diagnosticsDescription: 'Checks video, audio, network, Bluetooth, Flatpak, and shell logs.', runDiagnostics: 'Run checks', exportDiagnostics: 'Save report', welcomeTitle: 'Welcome', welcomeDescription: 'Let’s set up the network, sound, and TV. Everything will then work from your remote.', welcomeNetwork: 'Connect to Wi-Fi', welcomeSound: 'Check sound and display', welcomeApps: 'Install apps', skipSetup: 'Skip', startSetup: 'Start setup',
    cecTitle: 'TV remote and audio', cecEnabled: 'Control through HDMI-CEC', cecDescription: 'TV remote buttons control the shell when a CEC adapter is available.', autoHdmiAudio: 'Select HDMI audio automatically', autoHdmiAudioDescription: 'Switch sound to HDMI or DisplayPort when a TV is connected.',
    profilesGroup: 'Access', profilesTitle: 'Profiles and parental PIN', profilesDescription: 'The kids profile hides settings, files, and apps you mark as restricted.', activeProfile: 'Active profile', mainProfile: 'Main', kidsProfile: 'Kids', parentalPin: 'Current PIN', switchProfile: 'Switch profile', savePin: 'Save PIN',
    screensaverGroup: 'Screen', screensaverTitle: 'Clock screensaver', screensaverDescription: 'Shown only on Home; videos and open apps are not interrupted.', screensaverAfter: 'Start after', weatherGroup: 'Home screen', weatherTitle: 'Weather', weatherDescription: 'Choose a city for the Home forecast. Data refreshes about every 15 minutes.', weatherCity: 'City', weatherSave: 'Save and check',
    soundGroup: 'Sound', soundTitle: 'Volume', mute: 'Mute', unmute: 'Unmute', networkTitle: 'Wireless network', scan: 'Refresh list', connect: 'Connect', cancel: 'Cancel', languageGroup: 'Language', languageTitle: 'Interface language', inputGroup: 'Input', keyboardTitle: 'On-screen keyboard', keyboardDescription: 'Opens automatically for text fields. You can also use the ⌨ button in the top bar.', openKeyboard: 'Open keyboard', noNetworks: 'No Wi-Fi networks found.', wifiOff: 'Wi-Fi is off', connected: 'Connected', secured: 'Secured network', savedNetwork: 'Saved network', open: 'Open network', signal: 'Signal', password: 'Password for', apps: 'Apps', settings: 'Settings', webApp: 'Web app', systemApp: 'System app · Home to return', settingsKind: 'Shell settings', addApp: 'Add app', addKind: 'Website or system app', brandSubtitle: 'Dedicated TV session', logout: 'Switch user', reboot: 'Restart', poweroff: 'Power off', newTile: 'New tile', website: 'Website', fromSystem: 'From system', systemGroup: 'System', updateTitle: 'Fedora TV OS update', checkUpdates: 'Check for updates', appearanceGroup: 'Appearance', backgroundTitle: 'Background image', chooseImage: 'Choose image', resetBackground: 'Reset background', myApps: 'My apps', done: 'Done', displayGroup: 'Picture', displayTitle: 'Displays', displayDescription: 'Choose a screen and configure its video mode. Changes are saved for future TV sessions.', displayOutput: 'Display', displayMode: 'Resolution and refresh rate', displayScale: 'Scale', displayRotation: 'Rotation', displayPositionX: 'Position X', displayPositionY: 'Position Y', displayEnabled: 'Use this display', displayEnabledHint: 'The only active display cannot be disabled.', adaptiveSync: 'Adaptive refresh rate', adaptiveSyncHint: 'Use VRR when supported by the display and video driver.', rotationNormal: 'Normal', apply: 'Apply', refreshDevices: 'Refresh devices', audioOutput: 'Output device', powerGroup: 'Power', powerTitle: 'Sleep, lid and buttons', powerDescription: 'The sleep timer applies to the TV session. Lid and physical power button settings apply to the whole device after system confirmation.', sleepAfter: 'Go to sleep after', never: 'Never', powerButton: 'Power button', askBeforePoweroff: 'Ask before powering off', poweroffNow: 'Power off', sleep: 'Sleep', doNothing: 'Do nothing', lidBattery: 'Close lid', lidExternalPower: 'Close lid on AC power', lidDocked: 'Close lid with external display', applyPower: 'Save power settings', bluetoothTitle: 'Bluetooth', bluetoothDescription: 'Connect headphones, speakers, remotes, and other devices.', findDevices: 'Find devices', bluetoothOff: 'Bluetooth is off', noBluetoothDevices: 'No Bluetooth devices found.', paired: 'Paired', connecting: 'Connecting…', disconnect: 'Disconnect', categorySystem: 'System', categorySystemHint: 'Updates and power', categoryPicture: 'Picture and sound', categoryPictureHint: 'Display, scale, and volume', categoryConnections: 'Connections', categoryConnectionsHint: 'Wi‑Fi and Bluetooth', categoryAppearance: 'Appearance', categoryAppearanceHint: 'Background image', categoryInput: 'Language and input', categoryInputHint: 'Language and on-screen keyboard', categoryApps: 'Apps', categoryAppsHint: 'Added tiles', allSettings: 'All settings', filesEyebrow: 'File browser', filesTitle: 'Files', location: 'Location', filesHint: 'Choose a folder to browse it or a file to open it in the appropriate app.'
  }
};

function t(key) { return translations[currentLanguage]?.[key] || translations.ru[key] || key; }

function applyLanguage(language) {
  currentLanguage = language === 'en' ? 'en' : 'ru';
  if (!keyboardLayoutLanguage) keyboardLayoutLanguage = currentLanguage;
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll('[data-language]').forEach((button) => button.classList.toggle('selected', button.dataset.language === currentLanguage));
  const english = currentLanguage === 'en';
  document.getElementById('hero-eyebrow').textContent = english ? 'Home screen' : 'Домашний экран';
  updateGreeting();
  document.getElementById('hero-description').textContent = english ? 'Web services and Fedora apps — together in one place.' : 'Веб-сервисы и приложения Fedora — в одном месте.';
  renderShuffleCard();
  if (latestWeatherState) renderWeather(latestWeatherState);
  document.querySelector('.section-title h2').textContent = t('apps');
  document.getElementById('manage-title').textContent = t('settings');
  const idleLabels = english
    ? { 5: '5 min', 10: '10 min', 20: '20 min', 30: '30 min', 60: '1 hr', 120: '2 hr' }
    : { 5: '5 мин', 10: '10 мин', 20: '20 мин', 30: '30 мин', 60: '1 ч', 120: '2 ч' };
  for (const [value, label] of Object.entries(idleLabels)) {
    const option = powerIdleTimeout.querySelector(`option[value="${value}"]`);
    if (option) option.textContent = label;
  }
  if (!quickPanel.hidden) updateQuickPanelHeading(quickPanel.dataset.section);
  renderKeyboard();
  if (latestAudioState) renderAudio(latestAudioState);
  if (latestWifiState) renderWifi(latestWifiState);
  if (latestBluetoothState) renderBluetooth(latestBluetoothState);
  if (latestDisplayState) renderDisplays(latestDisplayState);
  if (!filesBackdrop.hidden) renderFiles(currentFilesState);
  if (!manageBackdrop.hidden) showSettingsCategory(activeSettingsCategory, false);
  updateClock();
}

function renderBrowserState(state = {}) {
  const visible = Boolean(state.visible);
  browserOpen = visible;
  browserToolbar.hidden = !visible;
  launcher.hidden = visible;
  document.body.classList.toggle('browser-open', visible);
  browserTitle.textContent = state.title || 'Веб-приложение';
  browserUrl.textContent = state.url || '';
  browserError.textContent = state.error || '';
  browserError.hidden = !state.error;
  browserBackButton.disabled = !state.canGoBack;
  browserFullscreenButton.setAttribute('aria-pressed', String(Boolean(state.fullscreen)));
  browserLoading.hidden = !state.loading;
  if (!visible && keyboardOpen) setKeyboardVisible(false);
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
  renderUpdateVisual(state);
  if (noticeWasHidden !== updateNotice.hidden && !activeOverlay() && !launcher.hidden) refreshFocusableCache();
  if (!manageBackdrop.hidden) refreshFocusables(document.activeElement);
}

function renderUpdateVisual(state = {}) {
  const visible = ['installing', 'installed'].includes(state.status);
  updateVisual.hidden = !visible;
  if (!visible) return;
  const progress = Math.max(0, Math.min(100, Number(state.progress) || 0));
  const stage = state.status === 'installed' ? 'restart' : (state.stage || 'authorization');
  const stageOrder = ['authorization', 'installation', 'restart'];
  const activeIndex = stageOrder.indexOf(stage);
  updateVisualBar.style.width = `${progress}%`;
  updateVisualPercent.textContent = `${progress}%`;
  updateVisualMessage.textContent = state.message || 'Подготовка…';
  updateVisualTitle.textContent = stage === 'authorization'
    ? 'Подтверждаем обновление'
    : stage === 'installation'
      ? 'Устанавливаем обновление'
      : 'Обновление готово';
  updateOrbit.classList.toggle('complete', stage === 'restart');
  updateOrbit.querySelector('span').textContent = stage === 'restart' ? '✓' : '↑';
  updateVisual.querySelectorAll('[data-update-stage]').forEach((element) => {
    const index = stageOrder.indexOf(element.dataset.updateStage);
    element.classList.toggle('active', index === activeIndex);
    element.classList.toggle('done', index < activeIndex);
  });
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
    },
    { symbol: '↑', eyebrow: 'Обновление системы' }
  );
}

async function initializeUpdater() {
  const info = await window.tv.getAppInfo();
  appVersion.textContent = `Версия ${info.version}`;
  renderUpdateState(await window.tv.getUpdateState());
}

function updateClock() {
  const now = new Date();
  const locale = currentLanguage === 'en' ? 'en-US' : 'ru-RU';
  clock.textContent = new Intl.DateTimeFormat(locale, { hour:'2-digit', minute:'2-digit' }).format(now);
  dateLabel.textContent = new Intl.DateTimeFormat(locale, { weekday:'short', day:'numeric', month:'long' }).format(now);
  screensaverClock.textContent = new Intl.DateTimeFormat(locale, { hour:'2-digit', minute:'2-digit' }).format(now);
  screensaverDate.textContent = new Intl.DateTimeFormat(locale, { weekday:'long', day:'numeric', month:'long' }).format(now);
  updateGreeting(now);
}

function weatherPresentation(code, isDay) {
  if (code === 0) return { icon: isDay ? '☀' : '☾', ru: isDay ? 'Ясно' : 'Ясная ночь', en: isDay ? 'Clear' : 'Clear night' };
  if ([1, 2].includes(code)) return { icon: isDay ? '⛅' : '☁', ru: 'Переменная облачность', en: 'Partly cloudy' };
  if (code === 3) return { icon: '☁', ru: 'Пасмурно', en: 'Overcast' };
  if ([45, 48].includes(code)) return { icon: '≋', ru: 'Туман', en: 'Fog' };
  if (code >= 51 && code <= 57) return { icon: '☂', ru: 'Морось', en: 'Drizzle' };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { icon: '☂', ru: code >= 80 ? 'Ливень' : 'Дождь', en: code >= 80 ? 'Rain showers' : 'Rain' };
  if ((code >= 71 && code <= 77) || [85, 86].includes(code)) return { icon: '❄', ru: 'Снег', en: 'Snow' };
  if (code >= 95) return { icon: 'ϟ', ru: 'Гроза', en: 'Thunderstorm' };
  return { icon: '◌', ru: 'Погода меняется', en: 'Changing weather' };
}

function formatTemperature(value) {
  if (!Number.isFinite(Number(value))) return '—°';
  const rounded = Math.round(Number(value));
  return `${rounded > 0 ? '+' : ''}${rounded}°`;
}

function parseLocalWeatherTime(value) {
  if (!value) return null;
  const parsed = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(String(value)) ? value : `${value}Z`);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function formatWeatherTime(value) {
  const date = parseLocalWeatherTime(value);
  if (!date) return '—';
  return new Intl.DateTimeFormat(currentLanguage === 'en' ? 'en-US' : 'ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }).format(date);
}

function formatWeatherDuration(milliseconds) {
  const totalMinutes = Math.max(1, Math.round(milliseconds / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (currentLanguage === 'en') return hours ? `${hours}h ${minutes ? `${minutes}m` : ''}`.trim() : `${minutes}m`;
  return hours ? `${hours} ч ${minutes ? `${minutes} мин` : ''}`.trim() : `${minutes} мин`;
}

function daylightState(days = [], utcOffsetSeconds = 0) {
  const today = days[0] || {};
  const sunrise = parseLocalWeatherTime(today.sunrise);
  const sunset = parseLocalWeatherTime(today.sunset);
  const now = new Date(Date.now() + (Number(utcOffsetSeconds) || 0) * 1000);
  if (!sunrise || !sunset) return { label: '—', progress: 0 };
  if (now < sunrise) return {
    label: `${currentLanguage === 'en' ? 'Sunrise' : 'Рассвет'} ${formatWeatherTime(today.sunrise)}`,
    progress: 0
  };
  if (now <= sunset) return {
    label: `${currentLanguage === 'en' ? 'Sunset in' : 'До заката'} ${formatWeatherDuration(sunset - now)}`,
    progress: Math.max(0, Math.min(100, ((now - sunrise) / (sunset - sunrise)) * 100))
  };
  const tomorrowSunrise = days[1]?.sunrise;
  return {
    label: `${currentLanguage === 'en' ? 'Sunrise' : 'Рассвет'} ${formatWeatherTime(tomorrowSunrise || today.sunrise)}`,
    progress: 0
  };
}

function renderWeather(state = {}) {
  latestWeatherState = state;
  const english = currentLanguage === 'en';
  weatherCard.classList.toggle('is-error', !state.ok);
  weatherCard.classList.toggle('is-night', state.ok && !state.current?.isDay);
  if (!state.ok) {
    weatherIcon.textContent = '!';
    weatherLocation.textContent = state.city || (english ? 'Weather' : 'Погода');
    weatherTemperature.textContent = '—°';
    weatherCondition.textContent = state.message || (english ? 'Forecast unavailable' : 'Прогноз недоступен');
    weatherRange.textContent = english ? 'Press to retry' : 'Нажмите, чтобы повторить';
    weatherDaylight.textContent = '—';
    weatherDaylightProgress.style.width = '0%';
    weatherCard.setAttribute('aria-label', state.message || (english ? 'Retry weather update' : 'Повторить обновление погоды'));
    return;
  }

  const presentation = weatherPresentation(state.current?.weatherCode, state.current?.isDay);
  const today = state.days?.[0] || {};
  const daylight = daylightState(state.days, state.utcOffsetSeconds);
  weatherIcon.textContent = presentation.icon;
  const region = String(state.region || '');
  weatherLocation.textContent = [state.city, region && region.toLocaleLowerCase() !== String(state.city || '').toLocaleLowerCase() ? region : ''].filter(Boolean).join(' · ');
  weatherTemperature.textContent = formatTemperature(state.current?.temperature);
  weatherCondition.textContent = `${presentation[english ? 'en' : 'ru']} · ${english ? 'feels like' : 'ощущается как'} ${formatTemperature(state.current?.apparentTemperature)}`;
  weatherRange.textContent = `${english ? 'Low' : 'Мин'} ${formatTemperature(today.min)} · ${english ? 'High' : 'Макс'} ${formatTemperature(today.max)}`;
  weatherDaylight.textContent = daylight.label;
  weatherDaylightProgress.style.width = `${daylight.progress}%`;
  weatherCard.setAttribute('aria-label', `${state.city}: ${weatherTemperature.textContent}, ${presentation[english ? 'en' : 'ru']}. ${english ? 'Press to refresh.' : 'Нажмите, чтобы обновить.'}`);
  weatherSettingsStatus.textContent = state.stale
    ? (state.message || (english ? 'Showing the last saved forecast.' : 'Показан последний сохранённый прогноз.'))
    : `${english ? 'Forecast ready for' : 'Прогноз настроен для'} ${state.city}.`;
}

async function refreshWeather(force = false) {
  if (weatherLoading) return;
  weatherLoading = true;
  weatherCard.classList.add('refreshing');
  weatherCard.setAttribute('aria-busy', 'true');
  try {
    const result = await window.tv.getWeather(currentLanguage, force);
    renderWeather(result || { ok: false });
    if (force && result?.ok && !result.stale) showToast(currentLanguage === 'en' ? 'Weather updated' : 'Погода обновлена');
  } catch (error) {
    renderWeather({ ok: false, city: weatherCityInput.value, message: error?.message });
  } finally {
    weatherLoading = false;
    weatherCard.classList.remove('refreshing');
    weatherCard.removeAttribute('aria-busy');
  }
}

function localizedAppTitle(app) {
  const builtInEnglishTitles = { vkvideo: 'VK Video', browser: 'Browser', files: 'Files', settings: 'Settings' };
  return currentLanguage === 'en' ? (app?.titleEn || builtInEnglishTitles[app?.id] || app?.title) : app?.title;
}

function renderShuffleCard() {
  const english = currentLanguage === 'en';
  shuffleEyebrow.textContent = english ? 'Tonight’s pick' : 'Вечерний выбор';
  shuffleCard.classList.toggle('picked', Boolean(selectedShuffleApp));
  if (!selectedShuffleApp) {
    shuffleIcon.classList.remove('has-image');
    shuffleIcon.replaceChildren('↝');
    shuffleTitle.textContent = english ? 'What should I play?' : 'Что включить?';
    shuffleDescription.textContent = english ? 'Press and we’ll pick an app' : 'Нажмите — подберём приложение';
    shuffleCard.setAttribute('aria-label', english ? 'Pick a random app' : 'Выбрать случайное приложение');
    return;
  }
  const title = localizedAppTitle(selectedShuffleApp);
  renderAppIcon(shuffleIcon, selectedShuffleApp);
  shuffleTitle.textContent = title;
  shuffleDescription.textContent = english ? 'Press again to open' : 'Нажмите ещё раз — откроем';
  shuffleCard.setAttribute('aria-label', `${title}. ${english ? 'Press again to open.' : 'Нажмите ещё раз, чтобы открыть.'}`);
}

function shuffleCandidates() {
  return appsCache.filter((item) => !['settings', 'files'].includes(item.action) && (item.url || item.type === 'system'));
}

async function handleShuffleCard() {
  if (shuffleOpening) return;
  if (!selectedShuffleApp) {
    const candidates = shuffleCandidates();
    if (!candidates.length) return showToast(currentLanguage === 'en' ? 'Add an app first' : 'Сначала добавьте приложение');
    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    selectedShuffleApp = candidates[random[0] % candidates.length];
    renderShuffleCard();
    return;
  }

  shuffleOpening = true;
  const appToOpen = selectedShuffleApp;
  if (appToOpen.type === 'system') showToast(currentLanguage === 'en' ? 'Opening app · Home to return' : 'Открываем приложение · Home — вернуться');
  try {
    const result = await window.tv.openApp(appToOpen);
    if (!result?.ok) return showToast(result?.message || (currentLanguage === 'en' ? 'Could not open app' : 'Не удалось открыть приложение'));
    selectedShuffleApp = null;
    renderShuffleCard();
  } finally {
    shuffleOpening = false;
  }
}

function hideScreensaver() {
  if (screensaver.hidden) return false;
  screensaver.hidden = true;
  resetAmbientTimer();
  return true;
}

function resetAmbientTimer() {
  clearTimeout(ambientTimer);
  ambientTimer = null;
  if (!ambientTimeoutMinutes) return;
  ambientTimer = setTimeout(() => {
    if (browserOpen || activeOverlay() || keyboardOpen || document.hidden) return resetAmbientTimer();
    updateClock();
    screensaver.hidden = false;
  }, ambientTimeoutMinutes * 60 * 1000);
}

function applyAmbientPreference(preferences = {}) {
  ambientTimeoutMinutes = [0, 1, 5, 10, 20, 30].includes(Number(preferences.ambientTimeout)) ? Number(preferences.ambientTimeout) : 10;
  screensaverTimeout.value = String(ambientTimeoutMinutes);
  if (!ambientTimeoutMinutes) screensaver.hidden = true;
  resetAmbientTimer();
}

function updateGreeting(now = new Date()) {
  const hour = now.getHours();
  const period = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 18 ? 'day' : 'evening';
  const greetings = currentLanguage === 'en'
    ? { morning: 'Good morning!', day: 'Good afternoon!', evening: 'Good evening!' }
    : { morning: 'Доброе утро!', day: 'Добрый день!', evening: 'Добрый вечер!' };
  document.getElementById('hero-title').textContent = greetings[period];
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function activeOverlay() {
  if (!onboarding.hidden) return onboarding;
  if (!backdrop.hidden) return backdrop;
  if (!quickPanel.hidden) return quickPanel;
  if (!addBackdrop.hidden) return addBackdrop;
  if (!filesBackdrop.hidden) return filesBackdrop;
  if (!manageBackdrop.hidden) return manageBackdrop;
  return null;
}

function navigationScope() {
  if (keyboardOpen) return onscreenKeyboard;
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
  refreshFocusableCache();
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

function openConfirm(title, text, confirmText, handler, options = {}) {
  overlayReturnFocus.set(backdrop, document.activeElement);
  dialogTitle.textContent = title;
  dialogText.textContent = text;
  dialogConfirm.textContent = confirmText;
  dialogEyebrow.textContent = options.eyebrow || (currentLanguage === 'en' ? 'Confirmation required' : 'Нужно подтверждение');
  dialogSymbol.textContent = options.symbol || '?';
  confirmationDialog.dataset.tone = options.tone || 'default';
  dialogConfirm.classList.toggle('danger', options.tone === 'danger');
  dialogConfirm.disabled = false;
  confirmHandler = handler;
  backdrop.hidden = false;
  window.tv.setConfirmationVisible(true);
  refreshFocusables(0);
}

function closeConfirm() {
  backdrop.hidden = true;
  confirmHandler = null;
  dialogConfirm.disabled = false;
  window.tv.setConfirmationVisible(false);
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
  refreshFocusables(document.querySelector(`[data-add-mode="${mode}"]`));
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
  const previousFocus = document.activeElement;
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
      renderAppIcon(row.querySelector('.manage-icon'), installedApp, installedApp.title.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase());
      row.querySelector('strong').textContent = installedApp.title;
      row.querySelector('.manage-copy span').textContent = installedApp.description;
      const addButton = row.querySelector('.system-add-button');
      addButton.textContent = installedApp.added ? 'Добавлено' : 'Добавить';
      addButton.disabled = installedApp.added;
      addButton.addEventListener('click', () => addInstalledApp(installedApp));
      systemAppList.appendChild(row);
    }
    refreshFocusables(previousFocus);
  } catch (error) {
    systemAppList.innerHTML = '<div class="empty-state">Не удалось прочитать список приложений.</div>';
    showToast(error.message);
    refreshFocusables(0);
  }
}

function renderFlatpakList(items = [], searching = false) {
  flatpakList.replaceChildren();
  if (!items.length) {
    flatpakList.innerHTML = `<div class="empty-state">${searching
      ? (currentLanguage === 'en' ? 'No matching apps found.' : 'Подходящие приложения не найдены.')
      : (currentLanguage === 'en' ? 'No user Flatpak apps installed yet.' : 'Пользовательские Flatpak-приложения пока не установлены.')}</div>`;
    refreshFocusables(document.activeElement);
    return;
  }
  for (const item of items) {
    const row = document.createElement('div');
    row.className = 'system-app-row';
    row.innerHTML = `
      <div class="manage-icon" style="--accent:${accentForText(item.id)}"></div>
      <div class="manage-copy"><strong></strong><span></span></div>
      <button type="button" class="system-add-button focusable"></button>`;
    row.querySelector('.manage-icon').textContent = makeInitials(item.name || item.id);
    row.querySelector('strong').textContent = item.name || item.id;
    row.querySelector('.manage-copy span').textContent = [item.description, item.version, item.id].filter(Boolean).join(' · ');
    const action = row.querySelector('button');
    action.textContent = item.installed
      ? (currentLanguage === 'en' ? 'Remove' : 'Удалить')
      : (currentLanguage === 'en' ? 'Install' : 'Установить');
    action.classList.toggle('delete-button', Boolean(item.installed));
    action.addEventListener('click', () => item.installed ? requestFlatpakRemoval(item) : installFlatpakItem(item, action));
    flatpakList.appendChild(row);
  }
  refreshFocusables(document.activeElement);
}

function makeInitials(value) {
  return String(value || '?').split(/[.\s_-]+/).filter(Boolean).slice(-2).map((part) => part[0]).join('').toUpperCase();
}

function accentForText(value) {
  const colors = ['#2563eb', '#7c3aed', '#059669', '#ea580c', '#0f766e', '#475569'];
  let hash = 0;
  for (const character of String(value || '')) hash = ((hash * 31) + character.charCodeAt(0)) >>> 0;
  return colors[hash % colors.length];
}

async function loadFlatpakCatalog(force = false) {
  if (flatpakLoading && !force) return;
  flatpakLoading = true;
  flatpakStatus.textContent = currentLanguage === 'en' ? 'Reading installed apps…' : 'Читаем установленные приложения…';
  const result = await window.tv.listFlatpaks();
  flatpakLoading = false;
  if (!result?.ok) {
    flatpakStatus.textContent = result?.message || 'Flatpak error';
    renderFlatpakList([]);
    return;
  }
  const items = (result.apps || []).map((item) => ({ ...item, installed: true }));
  flatpakStatus.textContent = currentLanguage === 'en' ? `Installed: ${items.length}` : `Установлено: ${items.length}`;
  renderFlatpakList(items);
}

async function searchFlatpakCatalog() {
  const query = flatpakSearch.value.trim();
  if (query.length < 2) return showToast(currentLanguage === 'en' ? 'Enter at least two characters' : 'Введите не менее двух символов');
  flatpakSearchButton.disabled = true;
  flatpakStatus.textContent = currentLanguage === 'en' ? 'Searching Flathub…' : 'Ищем во Flathub…';
  const result = await window.tv.searchFlatpaks(query);
  flatpakSearchButton.disabled = false;
  if (!result?.ok) {
    flatpakStatus.textContent = result?.message || 'Flathub error';
    return showToast(result?.message || 'Flathub error');
  }
  flatpakStatus.textContent = currentLanguage === 'en' ? `Found: ${result.apps.length}` : `Найдено: ${result.apps.length}`;
  renderFlatpakList(result.apps, true);
}

async function installFlatpakItem(item, button) {
  button.disabled = true;
  flatpakStatus.textContent = `${currentLanguage === 'en' ? 'Installing' : 'Устанавливаем'} ${item.name || item.id}…`;
  const result = await window.tv.installFlatpak(item.id);
  button.disabled = false;
  if (!result?.ok) return showToast(result?.message || 'Flatpak error');
  appsCache = result.apps || appsCache;
  await renderApps();
  await loadFlatpakCatalog(true);
  showToast(currentLanguage === 'en' ? 'App installed and added to Home' : 'Приложение установлено и добавлено на главный экран');
}

function requestFlatpakRemoval(item) {
  openConfirm(
    currentLanguage === 'en' ? `Remove “${item.name || item.id}”?` : `Удалить «${item.name || item.id}»?`,
    currentLanguage === 'en' ? 'The app tile will also be removed. User data is preserved.' : 'Плитка также будет удалена. Пользовательские данные сохранятся.',
    currentLanguage === 'en' ? 'Remove' : 'Удалить',
    async () => {
      const result = await window.tv.uninstallFlatpak(item.id);
      closeConfirm();
      if (!result?.ok) return showToast(result?.message || 'Flatpak error');
      appsCache = result.apps || appsCache;
      await renderApps();
      await loadFlatpakCatalog(true);
      showToast(currentLanguage === 'en' ? 'App removed' : 'Приложение удалено');
    },
    { tone: 'danger', symbol: '−' }
  );
}

function renderManageList() {
  const customApps = appsCache;
  manageList.innerHTML = '';
  if (!customApps.length) {
    manageList.innerHTML = '<div class="empty-state">Вы ещё не добавили собственные приложения.</div>';
    return;
  }
  for (const app of customApps) {
    const row = document.createElement('div');
    row.className = 'manage-row';
    row.innerHTML = `
      <div class="manage-icon" style="--accent:${app.accent}"></div>
      <div class="manage-copy"><strong></strong><span></span></div>
      <div class="manage-actions">
        <button class="compact-action focusable" data-manage-action="kids" title="Детский профиль">${appKidsAllowed(app) ? '👶' : '⊘'}</button>
        <button class="compact-action focusable" data-manage-action="favorite" title="Избранное">${app.favorite ? '★' : '☆'}</button>
        <button class="compact-action focusable" data-manage-action="up" title="Выше">↑</button>
        <button class="compact-action focusable" data-manage-action="down" title="Ниже">↓</button>
        ${app.custom ? '<button class="delete-button focusable" data-manage-action="delete">Удалить</button>' : ''}
      </div>`;
    row.querySelector('strong').textContent = app.title;
    renderAppIcon(row.querySelector('.manage-icon'), app);
    row.querySelector('.manage-copy span').textContent = app.type === 'system' ? 'Системное приложение' : app.url;
    row.querySelector('[data-manage-action="favorite"]').addEventListener('click', () => changeAppOrder(app, 'favorite'));
    row.querySelector('[data-manage-action="kids"]').addEventListener('click', () => changeKidsAccess(app));
    row.querySelector('[data-manage-action="up"]').addEventListener('click', () => changeAppOrder(app, 'up'));
    row.querySelector('[data-manage-action="down"]').addEventListener('click', () => changeAppOrder(app, 'down'));
    row.querySelector('[data-manage-action="delete"]')?.addEventListener('click', () => requestDelete(app));
    manageList.appendChild(row);
  }
}

function appKidsAllowed(app) {
  if (app.kidsAllowed != null) return Boolean(app.kidsAllowed);
  return !['settings', 'files'].includes(app.action);
}

async function changeKidsAccess(app) {
  const result = await window.tv.setKidsAllowed(app.id, !appKidsAllowed(app));
  if (!result?.ok) return showToast(result?.message || 'Не удалось изменить детский профиль');
  appsCache = result.apps;
  renderManageList();
  showToast(currentLanguage === 'en' ? 'Kids profile access updated' : 'Доступ детского профиля обновлён');
  refreshFocusables(manageList.querySelector('[data-manage-action="kids"]'));
}

async function changeAppOrder(app, action) {
  const result = action === 'favorite'
    ? await window.tv.setFavorite(app.id, !app.favorite)
    : await window.tv.moveApp(app.id, action);
  if (!result?.ok) return showToast(result?.message || 'Не удалось изменить порядок');
  appsCache = result.apps;
  renderManageList();
  await renderApps();
  refreshFocusables(manageList.querySelector(`[data-manage-action="${action}"]`));
}

const settingsCategoryCopy = {
  system: { ru: ['Система', 'Обновление Fedora TV OS и поведение питания'], en: ['System', 'Fedora TV OS updates and power behavior'] },
  picture: { ru: ['Изображение и звук', 'Экран, масштаб, частота и аудиовыход'], en: ['Picture and sound', 'Display, scale, refresh rate, and audio output'] },
  connections: { ru: ['Подключения', 'Беспроводные сети и устройства Bluetooth'], en: ['Connections', 'Wireless networks and Bluetooth devices'] },
  appearance: { ru: ['Оформление', 'Внешний вид домашнего экрана'], en: ['Appearance', 'Home screen look and feel'] },
  input: { ru: ['Язык и ввод', 'Язык интерфейса и экранная клавиатура'], en: ['Language and input', 'Interface language and on-screen keyboard'] },
  apps: { ru: ['Приложения', 'Управление добавленными плитками'], en: ['Apps', 'Manage added tiles'] }
};

function showSettingsCategory(category = null, moveFocus = true) {
  activeSettingsCategory = settingsCategoryCopy[category] ? category : null;
  settingsCategories.hidden = Boolean(activeSettingsCategory);
  settingsPageHeader.hidden = !activeSettingsCategory;
  document.querySelectorAll('[data-settings-category]').forEach((section) => {
    section.hidden = section.dataset.settingsCategory !== activeSettingsCategory;
  });
  if (activeSettingsCategory) {
    const [title, description] = settingsCategoryCopy[activeSettingsCategory][currentLanguage] || settingsCategoryCopy[activeSettingsCategory].ru;
    document.getElementById('manage-title').textContent = title;
    settingsPageDescription.textContent = description;
    if (activeSettingsCategory === 'apps') loadFlatpakCatalog();
  } else {
    document.getElementById('manage-title').textContent = t('settings');
    settingsPageDescription.textContent = '';
  }
  if (moveFocus) {
    const target = activeSettingsCategory
      ? settingsBack
      : settingsCategories.querySelector('.settings-category');
    requestAnimationFrame(() => refreshFocusables(target));
  }
}

function openManagePanel() {
  if (!quickPanel.hidden) closeQuickPanel();
  overlayReturnFocus.set(manageBackdrop, document.activeElement);
  renderManageList();
  manageBackdrop.hidden = false;
  showSettingsCategory(null);
  loadSystemSettings().then(() => refreshFocusables(document.activeElement));
}

function closeManagePanel() {
  if (keyboardOpen) setKeyboardVisible(false);
  manageBackdrop.hidden = true;
  activeSettingsCategory = null;
  refreshFocusables(overlayReturnFocus.get(manageBackdrop) || 0);
}

function fileSizeLabel(size) {
  if (!Number.isFinite(Number(size))) return '';
  const units = currentLanguage === 'en' ? ['B', 'KB', 'MB', 'GB', 'TB'] : ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  let value = Number(size);
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit += 1; }
  return `${value.toLocaleString(currentLanguage === 'en' ? 'en-US' : 'ru-RU', { maximumFractionDigits: unit ? 1 : 0 })} ${units[unit]}`;
}

function fileIcon(entry) {
  if (entry.icon) return entry.icon;
  return { root: '▱', folder: '▰', video: '▶', audio: '♪', image: '▧', document: '▤', archive: '▥', file: '·' }[entry.kind] || '·';
}

function renderFiles(state = {}) {
  currentFilesState = state;
  filesPath.textContent = state.path || (currentLanguage === 'en' ? 'Devices and folders' : 'Устройства и папки');
  filesUp.disabled = !state.path;
  filesList.replaceChildren();
  if (!state.ok) {
    renderWifiEmptyState(filesList, state.message || (currentLanguage === 'en' ? 'This folder is unavailable.' : 'Папка недоступна.'));
    return;
  }
  if (!state.entries?.length) {
    renderWifiEmptyState(filesList, currentLanguage === 'en' ? 'This folder is empty.' : 'В этой папке пока пусто.');
    return;
  }
  for (const entry of state.entries) {
    const button = document.createElement('button');
    button.className = 'file-row focusable';
    button.type = 'button';
    button.innerHTML = '<span class="file-icon"></span><span class="file-copy"><strong></strong><small></small></span><span class="file-open">›</span>';
    button.querySelector('.file-icon').textContent = fileIcon(entry);
    button.querySelector('strong').textContent = currentLanguage === 'en' && entry.nameEn ? entry.nameEn : entry.name;
    const detail = entry.directory
      ? (currentLanguage === 'en' ? 'Folder' : 'Папка')
      : [fileSizeLabel(entry.size), entry.modified ? new Intl.DateTimeFormat(currentLanguage === 'en' ? 'en-US' : 'ru-RU', { dateStyle: 'medium' }).format(entry.modified) : ''].filter(Boolean).join(' · ');
    button.querySelector('small').textContent = detail;
    button.addEventListener('click', async () => {
      if (entry.directory) return navigateFiles(entry.path);
      showToast(currentLanguage === 'en' ? 'Opening file…' : 'Открываем файл…');
      const result = await window.tv.openFile(entry.path);
      if (!result?.ok) showToast(result?.message || (currentLanguage === 'en' ? 'Could not open file' : 'Не удалось открыть файл'));
    });
    filesList.appendChild(button);
  }
}

async function navigateFiles(directoryPath = null, preferred = 0) {
  filesRefresh.disabled = true;
  const result = await window.tv.listFiles(directoryPath);
  filesRefresh.disabled = false;
  if (!result?.ok) {
    showToast(result?.message || (currentLanguage === 'en' ? 'Could not open folder' : 'Не удалось открыть папку'));
    return;
  }
  renderFiles(result);
  refreshFocusables(filesList.querySelector('.file-row') || preferred);
}

function openFilesPanel() {
  if (!quickPanel.hidden) closeQuickPanel();
  overlayReturnFocus.set(filesBackdrop, document.activeElement);
  filesBackdrop.hidden = false;
  filesList.innerHTML = `<div class="empty-state">${currentLanguage === 'en' ? 'Loading files…' : 'Загружаем файлы…'}</div>`;
  refreshFocusables(filesClose);
  navigateFiles(null);
}

function closeFilesPanel() {
  filesBackdrop.hidden = true;
  currentFilesState = { path: null, parentPath: null, entries: [] };
  refreshFocusables(overlayReturnFocus.get(filesBackdrop) || 0);
}

function goBackInFiles() {
  if (currentFilesState.path) return navigateFiles(currentFilesState.parentPath || null, filesUp);
  closeFilesPanel();
}

function updateQuickPanelHeading(section = 'sound') {
  const sound = section === 'sound';
  const bluetooth = section === 'bluetooth';
  quickPanelEyebrow.textContent = sound
    ? (currentLanguage === 'en' ? 'Sound' : 'Звук')
    : bluetooth ? 'Bluetooth' : 'Wi‑Fi';
  quickPanelTitle.textContent = sound ? t('soundTitle') : bluetooth ? t('bluetoothTitle') : t('networkTitle');
}

function openQuickPanel(section = 'sound') {
  overlayReturnFocus.set(quickPanel, document.activeElement);
  quickPanel.dataset.section = section;
  quickSoundSection.hidden = section !== 'sound';
  quickWifiSection.hidden = section !== 'wifi';
  quickBluetoothSection.hidden = section !== 'bluetooth';
  updateQuickPanelHeading(section);
  quickPanel.hidden = false;
  document.body.classList.add('quick-panel-open');
  topbarVolume.setAttribute('aria-expanded', String(section === 'sound'));
  topbarNetwork.setAttribute('aria-expanded', String(section === 'wifi'));
  topbarBluetooth.setAttribute('aria-expanded', String(section === 'bluetooth'));
  const target = section === 'wifi' ? quickWifiToggle : section === 'bluetooth' ? quickBluetoothToggle : quickVolumeSlider;
  requestAnimationFrame(() => refreshFocusables(target));
  if (section === 'bluetooth') window.tv.getBluetooth().then(renderBluetooth).catch((error) => showToast(error.message));
  else loadSystemSettings().catch((error) => showToast(error.message));
}

function closeQuickPanel() {
  if (keyboardOpen) setKeyboardVisible(false);
  quickPanel.hidden = true;
  document.body.classList.remove('quick-panel-open');
  topbarVolume.setAttribute('aria-expanded', 'false');
  topbarNetwork.setAttribute('aria-expanded', 'false');
  topbarBluetooth.setAttribute('aria-expanded', 'false');
  refreshFocusables(overlayReturnFocus.get(quickPanel) || 0);
}

function renderAudio(state = {}) {
  if (!state.ok) {
    audioOutput.replaceChildren();
    const option = document.createElement('option');
    option.textContent = currentLanguage === 'en' ? 'Audio service unavailable' : 'Служба звука недоступна';
    audioOutput.appendChild(option);
    audioOutput.disabled = true;
    return;
  }
  latestAudioState = state;
  volumeSlider.value = state.volume;
  volumeValue.textContent = `${state.volume}%`;
  quickVolumeSlider.value = state.volume;
  quickVolumeValue.textContent = state.muted ? (currentLanguage === 'en' ? 'Muted' : 'Без звука') : `${state.volume}%`;
  muteToggle.textContent = state.muted ? t('unmute') : t('mute');
  muteToggle.classList.toggle('active', Boolean(state.muted));
  quickMuteToggle.textContent = state.muted ? t('unmute') : t('mute');
  quickMuteToggle.classList.toggle('active', Boolean(state.muted));
  const topbarVolumeIcon = topbarVolume.querySelector('i');
  topbarVolumeIcon.className = `volume-symbol${state.muted ? ' muted' : ''}`;
  topbarVolumeIcon.innerHTML = volumeIconMarkup(state.volume, Boolean(state.muted));
  topbarVolume.querySelector('b').textContent = state.muted ? (currentLanguage === 'en' ? 'Muted' : 'Без звука') : `${state.volume}%`;
  topbarVolume.classList.toggle('inactive', Boolean(state.muted));
  const selectedOutput = audioOutput.value;
  audioOutput.replaceChildren();
  for (const output of state.outputs || []) {
    const option = document.createElement('option');
    option.value = String(output.id);
    option.textContent = output.name;
    option.selected = output.default || (!state.outputs.some((item) => item.default) && option.value === selectedOutput);
    audioOutput.appendChild(option);
  }
  if (!audioOutput.options.length) {
    const option = document.createElement('option');
    option.textContent = currentLanguage === 'en' ? 'No output devices' : 'Устройства вывода не найдены';
    audioOutput.appendChild(option);
  }
  audioOutput.disabled = (state.outputs || []).length < 2;
}

function displayModeLabel(mode) {
  const refresh = Number(mode.refresh || 0).toLocaleString(currentLanguage === 'en' ? 'en-US' : 'ru-RU', { maximumFractionDigits: 2 });
  const suffix = mode.current
    ? (currentLanguage === 'en' ? ' · current' : ' · текущий')
    : mode.preferred
      ? (currentLanguage === 'en' ? ' · recommended' : ' · рекомендуемый')
      : '';
  return `${mode.width}×${mode.height} · ${refresh} Hz${suffix}`;
}

function selectedDisplay() {
  return latestDisplayState?.outputs?.find((output) => output.name === displayOutput.value) || null;
}

function renderSelectedDisplay() {
  const output = selectedDisplay();
  const controls = [displayMode, displayScale, displayTransform, displayX, displayY, displayEnabled, displayAdaptive, displayApply];
  for (const control of controls) control.disabled = !output;
  if (!output) return;
  displayDescription.textContent = output.description || output.name;
  displayStatus.textContent = output.enabled ? (currentLanguage === 'en' ? 'Active' : 'Активен') : (currentLanguage === 'en' ? 'Disabled' : 'Выключен');
  displayMode.replaceChildren();
  for (const mode of output.modes) {
    const option = document.createElement('option');
    option.value = mode.id;
    option.textContent = displayModeLabel(mode);
    option.selected = mode.current || (!output.modes.some((item) => item.current) && mode.preferred);
    displayMode.appendChild(option);
  }
  const scaleValue = String(Number(output.scale || 1));
  if (![...displayScale.options].some((option) => option.value === scaleValue)) {
    const option = document.createElement('option');
    option.value = scaleValue;
    option.textContent = `${Math.round(Number(scaleValue) * 100)}%`;
    displayScale.appendChild(option);
  }
  displayScale.value = scaleValue;
  if (![...displayTransform.options].some((option) => option.value === output.transform)) {
    const option = document.createElement('option');
    option.value = output.transform;
    option.textContent = output.transform;
    displayTransform.appendChild(option);
  }
  displayTransform.value = output.transform;
  displayX.value = output.x;
  displayY.value = output.y;
  displayEnabled.setAttribute('aria-checked', String(Boolean(output.enabled)));
  displayAdaptiveRow.hidden = output.adaptiveSync == null;
  displayAdaptive.setAttribute('aria-checked', String(Boolean(output.adaptiveSync)));
}

function renderDisplays(state = {}) {
  latestDisplayState = state;
  const previous = displayOutput.value;
  displayOutput.replaceChildren();
  if (!state.ok || !state.outputs?.length) {
    const option = document.createElement('option');
    option.textContent = currentLanguage === 'en' ? 'Displays unavailable' : 'Дисплеи недоступны';
    displayOutput.appendChild(option);
    displayOutput.disabled = true;
    displayStatus.textContent = currentLanguage === 'en' ? 'Unavailable' : 'Недоступно';
    displayDescription.textContent = state.message || t('displayDescription');
    renderSelectedDisplay();
    return;
  }
  for (const output of state.outputs) {
    const option = document.createElement('option');
    option.value = output.name;
    option.textContent = `${output.name} · ${output.description || output.name}`;
    displayOutput.appendChild(option);
  }
  displayOutput.disabled = false;
  displayOutput.value = state.outputs.some((output) => output.name === previous) ? previous : state.outputs[0].name;
  renderSelectedDisplay();
}

function renderPower(power = {}) {
  powerIdleTimeout.value = String(power.idleTimeout ?? 0);
  powerButtonAction.value = power.powerButtonAction || 'ask';
  powerLidAction.value = power.lidAction || 'suspend';
  powerLidExternalAction.value = power.lidExternalAction || 'suspend';
  powerLidDockedAction.value = power.lidDockedAction || 'ignore';
}

function renderAutologin(state = {}) {
  const enabled = Boolean(state.ok && state.enabled);
  shellAutostart.setAttribute('aria-checked', String(enabled));
  shellAutostartStatus.textContent = enabled
    ? (currentLanguage === 'en' ? 'Enabled' : 'Включён')
    : (currentLanguage === 'en' ? 'Disabled' : 'Выключен');
  shellAutostart.title = state.message || '';
}

function renderCec(state = {}, preferences = {}) {
  const enabled = state.enabled !== false;
  cecToggle.setAttribute('aria-checked', String(enabled));
  hdmiAudioToggle.setAttribute('aria-checked', String(preferences.autoHdmiAudio !== false));
  cecStatus.textContent = !enabled
    ? (currentLanguage === 'en' ? 'Off' : 'Выключен')
    : state.connected
      ? (currentLanguage === 'en' ? 'Connected' : 'Подключён')
      : state.available
        ? (currentLanguage === 'en' ? 'Searching' : 'Поиск')
        : (currentLanguage === 'en' ? 'No adapter' : 'Нет адаптера');
  cecStatus.title = state.message || '';
}

function renderProfile(preferences = {}) {
  currentProfile = preferences.activeProfile === 'kids' ? 'kids' : 'main';
  profileSelect.value = currentProfile;
  profileStatus.textContent = currentProfile === 'kids'
    ? (currentLanguage === 'en' ? 'Kids' : 'Детский')
    : (currentLanguage === 'en' ? 'Main' : 'Основной');
  parentalCurrentPin.hidden = !preferences.parentalPinSet;
  parentalCurrentPin.placeholder = currentLanguage === 'en' ? 'Current PIN' : 'Текущий PIN';
  parentalNewPin.placeholder = currentLanguage === 'en' ? 'New PIN (4–8 digits)' : 'Новый PIN (4–8 цифр)';
}

function formatDiagnostics(report = {}) {
  const appInfo = report.app || {};
  const lines = [
    `Fedora TV OS ${appInfo.version || '—'} · Electron ${appInfo.electron || '—'} · ${appInfo.arch || '—'}`,
    `${report.generatedAt || ''}${appInfo.safeMode ? ' · SAFE MODE' : ''}`,
    ''
  ];
  for (const check of report.checks || []) {
    const firstLine = String(check.output || '').split(/\r?\n/).find(Boolean) || (check.ok ? 'OK' : 'Недоступно');
    lines.push(`${check.ok ? '✓' : '!' } ${check.name}: ${firstLine.slice(0, 220)}`);
  }
  if (report.logs?.crashes) lines.push('', currentLanguage === 'en' ? 'Recent shell crashes are present in the exported report.' : 'В экспортируемом отчёте есть недавние сбои оболочки.');
  return lines.join('\n');
}

async function refreshDiagnostics() {
  diagnosticsRefresh.disabled = true;
  diagnosticsOutput.textContent = currentLanguage === 'en' ? 'Running checks…' : 'Выполняем проверку…';
  try {
    const report = await window.tv.getDiagnostics();
    diagnosticsOutput.textContent = formatDiagnostics(report);
  } catch (error) {
    diagnosticsOutput.textContent = error?.message || 'Diagnostics error';
  } finally {
    diagnosticsRefresh.disabled = false;
    refreshFocusables(diagnosticsRefresh);
  }
}

async function finishOnboarding(openSettings = false) {
  const result = await window.tv.completeOnboarding();
  if (!result?.ok) return showToast(result?.message || 'Не удалось сохранить настройку');
  onboarding.hidden = true;
  if (openSettings) {
    openManagePanel();
    showSettingsCategory('connections');
  } else {
    refreshFocusables(grid.querySelector('.app-card'));
  }
}

function volumeIconMarkup(volume = 0, muted = false) {
  const waves = muted
    ? '<path class="volume-off-line" d="m17 9 5 5m0-5-5 5"/>'
    : Number(volume) < 35
      ? '<path class="volume-wave wave-low" d="M16 9.5a4 4 0 0 1 0 5"/>'
      : '<path class="volume-wave wave-low" d="M16 9.5a4 4 0 0 1 0 5"/><path class="volume-wave wave-high" d="M19 7a7 7 0 0 1 0 10"/>';
  return `<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4Z"/>${waves}</svg>`;
}

function wifiSignalLevel(signal) {
  const value = Math.max(0, Math.min(100, Number(signal) || 0));
  if (value === 0) return 0;
  if (value < 30) return 1;
  if (value < 55) return 2;
  if (value < 80) return 3;
  return 4;
}

function wifiSignalLabel(signal, enabled = true) {
  if (!enabled) return currentLanguage === 'en' ? 'Wi-Fi is off' : 'Wi‑Fi выключен';
  const labels = currentLanguage === 'en'
    ? ['No connection', 'Weak signal', 'Fair signal', 'Good signal', 'Excellent signal']
    : ['Нет подключения', 'Слабый сигнал', 'Средний сигнал', 'Хороший сигнал', 'Отличный сигнал'];
  return labels[wifiSignalLevel(signal)];
}

function wifiSignalMarkup() {
  return '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path class="wifi-wave wave-4" d="M2.7 8.7a14.8 14.8 0 0 1 18.6 0"/><path class="wifi-wave wave-3" d="M6.2 12.3a9.3 9.3 0 0 1 11.6 0"/><path class="wifi-wave wave-2" d="M9.3 15.7a4.4 4.4 0 0 1 5.4 0"/><circle class="wifi-wave wave-1" cx="12" cy="19" r="1.45"/><path class="wifi-off-line" d="M4 4l16 16"/></svg>';
}

function renderWifiSignal(element, signal, enabled = true) {
  const level = enabled ? wifiSignalLevel(signal) : 0;
  element.className = `wifi-signal level-${level}${enabled ? '' : ' off'}`;
  element.innerHTML = wifiSignalMarkup();
  if (!element.hasAttribute('aria-hidden')) {
    element.setAttribute('role', 'img');
    element.setAttribute('aria-label', wifiSignalLabel(signal, enabled));
  }
}

function renderWifi(state = {}) {
  latestWifiState = state;
  wifiToggle.setAttribute('aria-checked', String(Boolean(state.enabled)));
  quickWifiToggle.setAttribute('aria-checked', String(Boolean(state.enabled)));
  const activeNetwork = state.networks?.find((network) => network.active);
  renderWifiSignal(topbarNetwork.querySelector('i'), activeNetwork?.signal, Boolean(state.enabled));
  renderWifiSignal(quickNetworkIcon, activeNetwork?.signal, Boolean(state.enabled));
  topbarNetwork.querySelector('b').textContent = activeNetwork?.ssid || (state.enabled ? 'Wi‑Fi' : (currentLanguage === 'en' ? 'Off' : 'Выкл.'));
  topbarNetwork.classList.toggle('inactive', !state.enabled);
  quickNetworkState.textContent = activeNetwork?.ssid || (state.enabled ? (currentLanguage === 'en' ? 'Select a network' : 'Выберите сеть') : t('wifiOff'));
  renderWifiNetworks(wifiList, state, 'settings');
  renderWifiNetworks(quickWifiList, state, 'quick');
}

function renderBluetooth(state = {}) {
  latestBluetoothState = state;
  const enabled = Boolean(state.ok && state.enabled);
  bluetoothToggle.setAttribute('aria-checked', String(enabled));
  quickBluetoothToggle.setAttribute('aria-checked', String(enabled));
  bluetoothToggle.disabled = state.available === false;
  quickBluetoothToggle.disabled = state.available === false;
  bluetoothScan.disabled = !enabled;
  quickBluetoothScan.disabled = !enabled;
  const connected = state.devices?.find((device) => device.connected);
  const topbarIcon = topbarBluetooth.querySelector('i');
  topbarIcon.className = `bluetooth-symbol${enabled ? '' : ' off'}${connected ? ' connected' : ''}`;
  topbarBluetooth.querySelector('b').textContent = connected?.name
    || (state.available === false
      ? (currentLanguage === 'en' ? 'Unavailable' : 'Недоступно')
      : enabled ? 'Bluetooth' : (currentLanguage === 'en' ? 'Off' : 'Выкл.'));
  topbarBluetooth.classList.toggle('inactive', !enabled);
  quickBluetoothState.textContent = connected?.name
    || (enabled ? (currentLanguage === 'en' ? 'Select a device' : 'Выберите устройство') : t('bluetoothOff'));
  renderBluetoothDevices(bluetoothList, state);
  renderBluetoothDevices(quickBluetoothList, state);
}

function renderBluetoothDevices(container, state) {
  container.replaceChildren();
  if (!state.ok || !state.enabled) {
    renderWifiEmptyState(container, state.enabled === false && state.available !== false ? t('bluetoothOff') : (state.message || t('noBluetoothDevices')));
    return;
  }
  if (!state.devices?.length) {
    renderWifiEmptyState(container, t('noBluetoothDevices'));
    return;
  }
  for (const device of state.devices.slice(0, 24)) {
    const button = document.createElement('button');
    button.className = `bluetooth-device focusable${device.connected ? ' active' : ''}`;
    button.type = 'button';
    button.innerHTML = '<span class="bluetooth-device-icon">ᛒ</span><span class="bluetooth-device-copy"><strong></strong><small></small></span><b></b>';
    button.querySelector('strong').textContent = device.name;
    button.querySelector('small').textContent = device.connected ? t('connected') : device.paired ? t('paired') : device.address;
    button.querySelector('b').textContent = device.connected ? t('disconnect') : t('connect');
    button.addEventListener('click', async () => {
      button.disabled = true;
      button.querySelector('b').textContent = t('connecting');
      const result = await window.tv.toggleBluetoothDevice(device.address);
      if (!result?.ok) {
        button.disabled = false;
        button.querySelector('b').textContent = device.connected ? t('disconnect') : t('connect');
        return showToast(result?.message || 'Bluetooth error');
      }
      renderBluetooth(result);
      showToast(device.connected
        ? (currentLanguage === 'en' ? 'Device disconnected' : 'Устройство отключено')
        : (currentLanguage === 'en' ? 'Device connected' : 'Устройство подключено'));
      refreshFocusables(container.querySelector('.bluetooth-device'));
    });
    container.appendChild(button);
  }
}

function renderWifiNetworks(container, state, source) {
  container.innerHTML = '';
  if (!state.ok || !state.enabled) {
    renderWifiEmptyState(container, state.enabled === false ? t('wifiOff') : (state.message || t('noNetworks')));
    return;
  }
  if (!state.networks?.length) {
    renderWifiEmptyState(container, t('noNetworks'));
    return;
  }
  for (const network of state.networks.slice(0, 12)) {
    const button = document.createElement('button');
    button.className = `wifi-network focusable${network.active ? ' active' : ''}`;
    button.innerHTML = '<span><strong></strong><span class="wifi-detail"></span></span><span class="wifi-signal"></span>';
    button.querySelector('strong').textContent = network.ssid;
    button.querySelector('.wifi-detail').textContent = network.active
      ? t('connected')
      : network.saved
        ? t('savedNetwork')
        : (network.secure ? t('secured') : t('open'));
    renderWifiSignal(button.querySelector('.wifi-signal'), network.signal);
    button.addEventListener('click', () => selectNetwork(network, source));
    container.appendChild(button);
  }
}

function renderWifiEmptyState(container, message) {
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  empty.textContent = message;
  container.appendChild(empty);
}

async function selectNetwork(network, source = 'settings') {
  if (network.active) return showToast(t('connected'));
  if (network.saved || !network.secure) {
    const result = await window.tv.connectWifi({ ssid: network.ssid, uuid: network.uuid, password: '' });
    if (result?.ok) {
      renderWifi(result);
      return showToast(currentLanguage === 'en' ? 'Connected' : 'Подключено');
    }
    if (!network.secure || !result?.needsPassword) return showToast(result?.message || 'Wi‑Fi error');
    showToast(currentLanguage === 'en' ? 'Enter the updated Wi-Fi password' : 'Введите новый пароль Wi‑Fi');
  }
  const quick = source === 'quick';
  if (quick) quickSelectedNetwork = network;
  else selectedNetwork = network;
  const label = quick ? quickWifiPasswordLabel : wifiPasswordLabel;
  const input = quick ? quickWifiPassword : wifiPassword;
  const form = quick ? quickWifiPasswordForm : wifiPasswordForm;
  label.textContent = `${t('password')} «${network.ssid}»`;
  input.value = '';
  form.hidden = false;
  setKeyboardVisible(true, input);
}

async function loadSystemSettings() {
  const result = await window.tv.getSettings();
  if (!result?.ok) return showToast(result?.message || 'Не удалось загрузить настройки');
  applyLanguage(result.preferences?.language);
  renderAudio(result.audio);
  renderWifi(result.wifi);
  renderBluetooth(result.bluetooth);
  renderDisplays(result.displays);
  renderPower(result.power || result.preferences?.power);
  renderAutologin(result.autologin);
  renderCec(result.cec, result.preferences);
  renderProfile(result.preferences);
  applyAmbientPreference(result.preferences);
}

function renderKeyboard(preferredAction = null) {
  if (!keyboardKeys) return;
  keyboardLayoutLanguage ||= currentLanguage;
  const letterRows = {
    en: [
      ['1','2','3','4','5','6','7','8','9','0','-','='],
      ['q','w','e','r','t','y','u','i','o','p','[',']'],
      ['a','s','d','f','g','h','j','k','l',';','\'','Backspace'],
      ['Shift','z','x','c','v','b','n','m',',','.','/','Enter']
    ],
    ru: [
      ['1','2','3','4','5','6','7','8','9','0','-','='],
      ['й','ц','у','к','е','н','г','ш','щ','з','х','ъ'],
      ['ф','ы','в','а','п','р','о','л','д','ж','э','Backspace'],
      ['Shift','я','ч','с','м','и','т','ь','б','ю','.','Enter']
    ]
  };
  const symbolRows = [
    ['1','2','3','4','5','6','7','8','9','0','-','='],
    ['@','#','₽','$','€','&','+','(',')','/','\\','_'],
    ['*','"','\'',':',';','!','?','%','^','`','~','Backspace'],
    ['{','}','[',']','<','>','|','_','=', '+','/','Enter']
  ];
  const rows = keyboardSymbolMode ? symbolRows : letterRows[keyboardLayoutLanguage];
  keyboardLanguage.textContent = keyboardLayoutLanguage === 'en'
    ? (currentLanguage === 'en' ? 'English layout' : 'Английская раскладка')
    : (currentLanguage === 'en' ? 'Russian layout' : 'Русская раскладка');
  keyboardMode.textContent = keyboardSymbolMode
    ? (currentLanguage === 'en' ? 'Symbols' : 'Символы')
    : (currentLanguage === 'en' ? 'Letters' : 'Буквы');
  keyboardKeys.innerHTML = '';

  for (const keys of rows) {
    const row = document.createElement('div');
    row.className = 'keyboard-row';
    for (const key of keys) {
      const button = document.createElement('button');
      const isLetter = key.length === 1 && key.toLocaleLowerCase() !== key.toLocaleUpperCase();
      const output = keyboardShifted && isLetter ? key.toLocaleUpperCase(keyboardLayoutLanguage === 'ru' ? 'ru-RU' : 'en-US') : key;
      button.type = 'button';
      button.className = `keyboard-key focusable${['Backspace','Enter','Shift'].includes(key) ? ' wide modifier' : ''}${key === 'Shift' && keyboardShifted ? ' active' : ''}`;
      button.dataset.key = output;
      if (key === 'Shift') button.dataset.action = 'shift';
      button.textContent = key === 'Backspace' ? '⌫' : key === 'Enter' ? '↵' : key === 'Shift' ? '⇧' : output;
      if (key === 'Shift') {
        button.setAttribute('aria-label', currentLanguage === 'en' ? 'Uppercase' : 'Заглавные буквы');
        button.setAttribute('aria-pressed', String(keyboardShifted));
        button.addEventListener('click', () => handleKeyboardControl('shift'));
      } else {
        button.addEventListener('click', () => typeKeyboardKey(output));
      }
      row.appendChild(button);
    }
    keyboardKeys.appendChild(row);
  }

  const controls = document.createElement('div');
  controls.className = 'keyboard-row keyboard-controls';
  const addControl = (label, action, className, handler, ariaLabel = '') => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `keyboard-key focusable ${className}`;
    button.dataset.action = action;
    button.textContent = label;
    if (ariaLabel) button.setAttribute('aria-label', ariaLabel);
    button.addEventListener('click', handler);
    controls.appendChild(button);
  };
  addControl(
    keyboardSymbolMode ? (keyboardLayoutLanguage === 'ru' ? 'АБВ' : 'ABC') : '?123',
    'symbols',
    `modifier${keyboardSymbolMode ? ' active' : ''}`,
    () => handleKeyboardControl('symbols'),
    keyboardSymbolMode
      ? (currentLanguage === 'en' ? 'Show letters' : 'Показать буквы')
      : (currentLanguage === 'en' ? 'Show numbers and symbols' : 'Показать цифры и символы')
  );
  addControl(
    'RU / EN',
    'language',
    'modifier language',
    () => handleKeyboardControl('language'),
    currentLanguage === 'en' ? 'Switch keyboard language' : 'Переключить язык клавиатуры'
  );
  addControl(currentLanguage === 'en' ? 'Space' : 'Пробел', 'space', 'space', () => typeKeyboardKey(' '));
  addControl(',', 'comma', 'compact', () => typeKeyboardKey(','));
  addControl('.', 'period', 'compact', () => typeKeyboardKey('.'));
  keyboardKeys.appendChild(controls);

  if (preferredAction && keyboardOpen) {
    requestAnimationFrame(() => refreshFocusables(keyboardKeys.querySelector(`[data-action="${preferredAction}"]`) || 0));
  }
}

function handleKeyboardControl(action) {
  if (action === 'language') {
    keyboardLayoutLanguage = keyboardLayoutLanguage === 'ru' ? 'en' : 'ru';
    keyboardShifted = false;
  } else if (action === 'symbols') {
    keyboardSymbolMode = !keyboardSymbolMode;
    keyboardShifted = false;
  } else if (action === 'shift') {
    keyboardShifted = !keyboardShifted;
  }
  renderKeyboard(action);
}

function typeKeyboardKey(key) {
  if (browserOpen) return window.tv.keyboardInput(key);
  const input = lastTextInput;
  if (!input) return;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? start;
  if (key === 'Backspace') {
    const from = start === end ? Math.max(0, start - 1) : start;
    input.setRangeText('', from, end, 'end');
  } else if (key === 'Enter') {
    input.form?.requestSubmit();
  } else {
    input.setRangeText(key, start, end, 'end');
  }
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function setKeyboardVisible(visible, input = null) {
  if (input) lastTextInput = input;
  keyboardOpen = Boolean(visible);
  onscreenKeyboard.hidden = !keyboardOpen;
  document.body.classList.toggle('keyboard-open', keyboardOpen);
  if (browserOpen) window.tv.setBrowserKeyboard(keyboardOpen);
  if (keyboardOpen) {
    renderKeyboard();
    if (input) {
      focusables = availableFocusables(onscreenKeyboard);
      focusIndex = Math.max(0, focusables.findIndex((element) => element.classList.contains('keyboard-key')));
      requestAnimationFrame(() => input.scrollIntoView({ block: 'center', inline: 'nearest' }));
    } else {
      refreshFocusables(0);
    }
  } else {
    refreshFocusables(lastTextInput || 0);
  }
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
  }, { tone: 'danger', symbol: '−' });
}

async function activate(element) {
  if (!element) return;
  if (!quickPanel.hidden) closeQuickPanel();
  if (element.dataset.special === 'add') return openAddPanel();
  if (element.dataset.app) {
    const selectedApp = JSON.parse(element.dataset.app);
    if (selectedApp.action === 'settings') return openManagePanel();
    if (selectedApp.action === 'files') return openFilesPanel();
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
    suspend: ['Перевести устройство в сон?', 'Открытые приложения останутся на месте и продолжат работу после пробуждения.', 'Перейти в сон'],
    reboot: ['Перезагрузить мини‑ПК?', 'Все открытые приложения будут закрыты.', 'Перезагрузить'],
    poweroff: ['Выключить мини‑ПК?', 'Все открытые приложения будут закрыты.', 'Выключить']
  };
  if (!prompts[action]) return;
  const [title, message, confirmLabel] = prompts[action];
  openConfirm(title, message, confirmLabel, async () => {
    const result = await window.tv.systemAction(action);
    if (!result?.ok) { closeConfirm(); showToast(result?.message || 'Команда не выполнена'); }
  }, { tone: ['logout', 'suspend'].includes(action) ? 'default' : 'danger', symbol: action === 'logout' ? '⇥' : action === 'suspend' ? '◐' : action === 'reboot' ? '↻' : '⏻' });
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
    button.innerHTML = `<span class="icon"></span><span class="title"></span>${app.favorite ? '<span class="favorite-mark" aria-label="Избранное">★</span>' : ''}`;
    renderAppIcon(button.querySelector('.icon'), app);
    button.querySelector('.title').textContent = localizedAppTitle(app);
    button.addEventListener('click', () => activate(button));
    makeCardInteractive(button);
    grid.appendChild(button);
  }
  if (currentProfile !== 'kids') {
    const addButton = document.createElement('button');
    addButton.className = 'app-card add-card focusable';
    addButton.style.setProperty('--card-index', grid.children.length);
    addButton.dataset.special = 'add';
    addButton.innerHTML = `<span class="icon">＋</span><span class="title">${t('addApp')}</span>`;
    addButton.addEventListener('click', () => activate(addButton));
    makeCardInteractive(addButton);
    grid.appendChild(addButton);
  }
  if (selectedShuffleApp) {
    selectedShuffleApp = appsCache.find((app) => app.id === selectedShuffleApp.id) || null;
    renderShuffleCard();
  }
}

function makeCardInteractive(card) {
  card.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--spot-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  });
  card.addEventListener('pointerdown', () => card.classList.add('pressed'));
  for (const eventName of ['pointerup', 'pointercancel', 'pointerleave']) {
    card.addEventListener(eventName, () => card.classList.remove('pressed'));
  }
}

async function loadApps() {
  // Язык и плитки читаются из локальных файлов и появляются сразу. Медленные
  // запросы к NetworkManager, PipeWire и updater не блокируют первый экран.
  const preferences = await window.tv.getPreferences();
  applyLanguage(preferences?.language);
  renderProfile(preferences || {});
  applyAmbientPreference(preferences || {});
  weatherCityInput.value = preferences?.weatherCity || 'Москва';
  onboarding.hidden = preferences?.onboardingComplete !== false;
  await renderApps();
  refreshWeather(false);
  document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => activate(button)));
  document.querySelectorAll('[data-add-close]').forEach((button) => button.addEventListener('click', closeAddPanel));
  document.querySelectorAll('[data-add-mode]').forEach((button) => button.addEventListener('click', () => setAddMode(button.dataset.addMode)));
  systemAppRefresh.addEventListener('click', loadSystemApps);
  flatpakSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchFlatpakCatalog();
  });
  flatpakUpdate.addEventListener('click', async () => {
    flatpakUpdate.disabled = true;
    flatpakStatus.textContent = currentLanguage === 'en' ? 'Updating Flatpak apps…' : 'Обновляем Flatpak-приложения…';
    const result = await window.tv.updateFlatpaks();
    flatpakUpdate.disabled = false;
    if (!result?.ok) return showToast(result?.message || 'Flatpak error');
    await loadFlatpakCatalog(true);
    showToast(currentLanguage === 'en' ? 'Flatpak apps are up to date' : 'Flatpak-приложения обновлены');
  });
  onboardingSkip.addEventListener('click', () => finishOnboarding(false));
  onboardingStart.addEventListener('click', () => finishOnboarding(true));
  diagnosticsRefresh.addEventListener('click', refreshDiagnostics);
  diagnosticsExport.addEventListener('click', async () => {
    diagnosticsExport.disabled = true;
    const result = await window.tv.exportDiagnostics();
    diagnosticsExport.disabled = false;
    if (result?.canceled) return refreshFocusables(diagnosticsExport);
    if (!result?.ok) return showToast(result?.message || 'Diagnostics export error');
    showToast(currentLanguage === 'en' ? 'Diagnostics report saved' : 'Диагностический отчёт сохранён');
    refreshFocusables(diagnosticsExport);
  });
  profileApply.addEventListener('click', async () => {
    profileApply.disabled = true;
    const result = await window.tv.setProfile(profileSelect.value, profilePin.value);
    profileApply.disabled = false;
    profilePin.value = '';
    if (!result?.ok) return showToast(result?.message || 'Не удалось переключить профиль');
    renderProfile(result.preferences || { activeProfile: result.profile?.active, parentalPinSet: result.profile?.pinSet });
    await renderApps();
    renderManageList();
    showToast(currentProfile === 'kids'
      ? (currentLanguage === 'en' ? 'Kids profile enabled' : 'Включён детский профиль')
      : (currentLanguage === 'en' ? 'Main profile enabled' : 'Включён основной профиль'));
    refreshFocusables(profileApply);
  });
  parentalPinForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const result = await window.tv.setParentalPin({ currentPin: parentalCurrentPin.value, newPin: parentalNewPin.value });
    if (!result?.ok) return showToast(result?.message || 'Не удалось сохранить PIN');
    parentalPinForm.reset();
    parentalCurrentPin.hidden = false;
    showToast(currentLanguage === 'en' ? 'Parental PIN saved' : 'Родительский PIN сохранён');
    refreshFocusables(profileApply);
  });
  screensaverTimeout.addEventListener('change', async () => {
    const result = await window.tv.setScreensaverTimeout(Number(screensaverTimeout.value));
    if (!result?.ok) return showToast(result?.message || 'Не удалось сохранить заставку');
    applyAmbientPreference(result.preferences);
    showToast(currentLanguage === 'en' ? 'Screensaver setting saved' : 'Настройка заставки сохранена');
    refreshFocusables(screensaverTimeout);
  });
  weatherCard.addEventListener('click', () => refreshWeather(true));
  shuffleCard.addEventListener('click', handleShuffleCard);
  weatherCityForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const candidate = weatherCityInput.value.trim();
    weatherCitySave.disabled = true;
    weatherSettingsStatus.textContent = currentLanguage === 'en' ? 'Checking the city and forecast…' : 'Проверяем город и прогноз…';
    try {
      const result = await window.tv.setWeatherCity(candidate, currentLanguage);
      if (!result?.ok) {
        weatherSettingsStatus.textContent = result?.message || (currentLanguage === 'en' ? 'Could not save the city.' : 'Не удалось сохранить город.');
        return;
      }
      weatherCityInput.value = candidate;
      renderWeather(result);
      setKeyboardVisible(false);
      showToast(currentLanguage === 'en' ? `Weather city: ${result.city}` : `Город погоды: ${result.city}`);
    } catch (error) {
      weatherSettingsStatus.textContent = error?.message || (currentLanguage === 'en' ? 'Weather service unavailable.' : 'Сервис погоды недоступен.');
    } finally {
      weatherCitySave.disabled = false;
      refreshFocusables(weatherCitySave);
    }
  });
  document.querySelectorAll('[data-manage-close]').forEach((button) => button.addEventListener('click', closeManagePanel));
  document.querySelectorAll('[data-settings-open]').forEach((button) => button.addEventListener('click', () => showSettingsCategory(button.dataset.settingsOpen)));
  settingsBack.addEventListener('click', () => showSettingsCategory(null));
  filesClose.addEventListener('click', closeFilesPanel);
  filesUp.addEventListener('click', goBackInFiles);
  filesRefresh.addEventListener('click', () => navigateFiles(currentFilesState.path, filesRefresh));
  dialogCancel.addEventListener('click', closeConfirm);
  dialogConfirm.addEventListener('click', async () => {
    if (!confirmHandler) return;
    const handler = confirmHandler;
    confirmHandler = null;
    dialogConfirm.disabled = true;
    try {
      await window.tv.setConfirmationVisible(false);
      await handler();
    } catch (error) {
      closeConfirm();
      showToast(error?.message || 'Не удалось выполнить действие');
    }
  });
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
  browserPlayButton.addEventListener('click', () => window.tv.mediaAction('play-pause'));
  browserFullscreenButton.addEventListener('click', () => window.tv.toggleBrowserFullscreen());
  browserKeyboardButton.addEventListener('click', () => setKeyboardVisible(!keyboardOpen));
  browserFocusButton.addEventListener('click', () => window.tv.focusBrowser());
  keyboardToggle.addEventListener('click', () => setKeyboardVisible(!keyboardOpen));
  topbarVolume.addEventListener('click', () => {
    if (!quickPanel.hidden && quickPanel.dataset.section === 'sound') return closeQuickPanel();
    openQuickPanel('sound');
  });
  topbarNetwork.addEventListener('click', () => {
    if (!quickPanel.hidden && quickPanel.dataset.section === 'wifi') return closeQuickPanel();
    openQuickPanel('wifi');
  });
  topbarBluetooth.addEventListener('click', () => {
    if (!quickPanel.hidden && quickPanel.dataset.section === 'bluetooth') return closeQuickPanel();
    openQuickPanel('bluetooth');
  });
  quickPanelClose.addEventListener('click', closeQuickPanel);
  settingsShortcut.addEventListener('click', openManagePanel);
  settingsKeyboardToggle.addEventListener('click', () => setKeyboardVisible(!keyboardOpen));
  keyboardClose.addEventListener('click', () => setKeyboardVisible(false));
  volumeSlider.addEventListener('input', () => { volumeValue.textContent = `${volumeSlider.value}%`; });
  volumeSlider.addEventListener('change', async () => {
    const result = await window.tv.setVolume(volumeSlider.value);
    if (!result?.ok) return showToast(result?.message || 'Audio error');
    renderAudio(result);
  });
  quickVolumeSlider.addEventListener('input', () => {
    quickVolumeValue.textContent = `${quickVolumeSlider.value}%`;
    topbarVolume.querySelector('b').textContent = `${quickVolumeSlider.value}%`;
  });
  quickVolumeSlider.addEventListener('change', async () => {
    const result = await window.tv.setVolume(quickVolumeSlider.value);
    if (!result?.ok) return showToast(result?.message || 'Audio error');
    renderAudio(result);
  });
  audioOutput.addEventListener('change', async () => {
    audioOutput.disabled = true;
    const result = await window.tv.selectAudioOutput(audioOutput.value);
    audioOutput.disabled = false;
    if (!result?.ok) return showToast(result?.message || 'Audio error');
    renderAudio(result);
    showToast(currentLanguage === 'en' ? 'Audio output selected' : 'Аудиовыход выбран');
    refreshFocusables(audioOutput);
  });
  displayOutput.addEventListener('change', () => {
    renderSelectedDisplay();
    refreshFocusables(displayOutput);
  });
  displayEnabled.addEventListener('click', () => {
    displayEnabled.setAttribute('aria-checked', String(displayEnabled.getAttribute('aria-checked') !== 'true'));
  });
  displayAdaptive.addEventListener('click', () => {
    displayAdaptive.setAttribute('aria-checked', String(displayAdaptive.getAttribute('aria-checked') !== 'true'));
  });
  displayRefresh.addEventListener('click', async () => {
    displayRefresh.disabled = true;
    const result = await window.tv.getDisplays();
    displayRefresh.disabled = false;
    renderDisplays(result);
    if (!result?.ok) showToast(result?.message || 'Display error');
    refreshFocusables(displayOutput);
  });
  displayApply.addEventListener('click', async () => {
    const output = selectedDisplay();
    if (!output) return;
    displayApply.disabled = true;
    const result = await window.tv.applyDisplay({
      output: output.name,
      enabled: displayEnabled.getAttribute('aria-checked') === 'true',
      mode: displayMode.value,
      scale: Number(displayScale.value),
      transform: displayTransform.value,
      x: Number(displayX.value),
      y: Number(displayY.value),
      adaptiveSync: displayAdaptive.getAttribute('aria-checked') === 'true'
    });
    displayApply.disabled = false;
    if (!result?.ok) return showToast(result?.message || 'Display error');
    renderDisplays(result);
    showToast(currentLanguage === 'en' ? 'Display settings applied' : 'Настройки дисплея применены');
    refreshFocusables(displayApply);
  });
  powerApply.addEventListener('click', async () => {
    powerApply.disabled = true;
    const result = await window.tv.setPowerSettings({
      idleTimeout: Number(powerIdleTimeout.value),
      powerButtonAction: powerButtonAction.value,
      lidAction: powerLidAction.value,
      lidExternalAction: powerLidExternalAction.value,
      lidDockedAction: powerLidDockedAction.value
    });
    powerApply.disabled = false;
    if (!result?.ok) return showToast(result?.message || 'Power settings error');
    renderPower(result.power);
    showToast(currentLanguage === 'en' ? 'Power settings saved' : 'Настройки питания сохранены');
    refreshFocusables(powerApply);
  });
  shellAutostart.addEventListener('click', async () => {
    const enabled = shellAutostart.getAttribute('aria-checked') !== 'true';
    shellAutostart.disabled = true;
    const result = await window.tv.setAutologin(enabled);
    shellAutostart.disabled = false;
    if (!result?.ok) return showToast(result?.message || 'Не удалось изменить автозапуск');
    renderAutologin(result);
    showToast(enabled
      ? (currentLanguage === 'en' ? 'The TV shell will start automatically' : 'Автозапуск оболочки включён')
      : (currentLanguage === 'en' ? 'The login screen will be shown after restart' : 'После перезагрузки появится экран выбора пользователей'));
    refreshFocusables(shellAutostart);
  });
  cecToggle.addEventListener('click', async () => {
    cecToggle.disabled = true;
    const result = await window.tv.setCec(cecToggle.getAttribute('aria-checked') !== 'true');
    cecToggle.disabled = false;
    if (!result?.ok) return showToast(result?.message || 'HDMI-CEC error');
    renderCec(result, { autoHdmiAudio: hdmiAudioToggle.getAttribute('aria-checked') === 'true' });
    refreshFocusables(cecToggle);
  });
  hdmiAudioToggle.addEventListener('click', async () => {
    const enabled = hdmiAudioToggle.getAttribute('aria-checked') !== 'true';
    const result = await window.tv.setAutoHdmiAudio(enabled);
    if (!result?.ok) return showToast(result?.message || 'HDMI audio error');
    hdmiAudioToggle.setAttribute('aria-checked', String(enabled));
    refreshFocusables(hdmiAudioToggle);
  });
  muteToggle.addEventListener('click', async () => {
    const result = await window.tv.toggleMute();
    if (!result?.ok) return showToast(result?.message || 'Audio error');
    renderAudio(result);
  });
  quickMuteToggle.addEventListener('click', async () => {
    const result = await window.tv.toggleMute();
    if (!result?.ok) return showToast(result?.message || 'Audio error');
    renderAudio(result);
  });
  wifiToggle.addEventListener('click', async () => {
    wifiToggle.disabled = true;
    const result = await window.tv.toggleWifi(wifiToggle.getAttribute('aria-checked') !== 'true');
    wifiToggle.disabled = false;
    if (!result?.ok) return showToast(result?.message || 'Wi‑Fi error');
    renderWifi(result);
    refreshFocusables(wifiToggle);
  });
  quickWifiToggle.addEventListener('click', async () => {
    quickWifiToggle.disabled = true;
    const result = await window.tv.toggleWifi(quickWifiToggle.getAttribute('aria-checked') !== 'true');
    quickWifiToggle.disabled = false;
    if (!result?.ok) return showToast(result?.message || 'Wi‑Fi error');
    renderWifi(result);
    refreshFocusables(quickWifiToggle);
  });
  wifiScan.addEventListener('click', async () => {
    wifiScan.disabled = true;
    const result = await window.tv.scanWifi();
    wifiScan.disabled = false;
    if (!result?.ok) return showToast(result?.message || 'Wi‑Fi error');
    renderWifi(result);
    refreshFocusables(wifiScan);
  });
  quickWifiScan.addEventListener('click', async () => {
    quickWifiScan.disabled = true;
    const result = await window.tv.scanWifi();
    quickWifiScan.disabled = false;
    if (!result?.ok) return showToast(result?.message || 'Wi‑Fi error');
    renderWifi(result);
    refreshFocusables(quickWifiScan);
  });
  bluetoothToggle.addEventListener('click', async () => {
    bluetoothToggle.disabled = true;
    const result = await window.tv.toggleBluetooth(bluetoothToggle.getAttribute('aria-checked') !== 'true');
    bluetoothToggle.disabled = false;
    if (!result?.ok) return showToast(result?.message || 'Bluetooth error');
    renderBluetooth(result);
    refreshFocusables(bluetoothToggle);
  });
  quickBluetoothToggle.addEventListener('click', async () => {
    quickBluetoothToggle.disabled = true;
    const result = await window.tv.toggleBluetooth(quickBluetoothToggle.getAttribute('aria-checked') !== 'true');
    quickBluetoothToggle.disabled = false;
    if (!result?.ok) return showToast(result?.message || 'Bluetooth error');
    renderBluetooth(result);
    refreshFocusables(quickBluetoothToggle);
  });
  bluetoothScan.addEventListener('click', async () => {
    bluetoothScan.disabled = true;
    const result = await window.tv.scanBluetooth();
    bluetoothScan.disabled = false;
    if (!result?.ok) return showToast(result?.message || 'Bluetooth error');
    renderBluetooth(result);
    refreshFocusables(bluetoothScan);
  });
  quickBluetoothScan.addEventListener('click', async () => {
    quickBluetoothScan.disabled = true;
    const result = await window.tv.scanBluetooth();
    quickBluetoothScan.disabled = false;
    if (!result?.ok) return showToast(result?.message || 'Bluetooth error');
    renderBluetooth(result);
    refreshFocusables(quickBluetoothScan);
  });
  wifiPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!selectedNetwork) return;
    const result = await window.tv.connectWifi({ ssid: selectedNetwork.ssid, uuid: selectedNetwork.uuid, password: wifiPassword.value });
    if (!result?.ok) return showToast(result?.message || 'Wi‑Fi error');
    wifiPasswordForm.hidden = true;
    setKeyboardVisible(false);
    renderWifi(result);
    showToast(currentLanguage === 'en' ? 'Connected' : 'Подключено');
  });
  wifiPasswordCancel.addEventListener('click', () => { wifiPasswordForm.hidden = true; setKeyboardVisible(false); });
  quickWifiPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!quickSelectedNetwork) return;
    const result = await window.tv.connectWifi({ ssid: quickSelectedNetwork.ssid, uuid: quickSelectedNetwork.uuid, password: quickWifiPassword.value });
    if (!result?.ok) return showToast(result?.message || 'Wi‑Fi error');
    quickWifiPasswordForm.hidden = true;
    setKeyboardVisible(false);
    renderWifi(result);
    showToast(currentLanguage === 'en' ? 'Connected' : 'Подключено');
  });
  quickWifiPasswordCancel.addEventListener('click', () => { quickWifiPasswordForm.hidden = true; setKeyboardVisible(false); });
  document.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', async () => {
    await window.tv.setLanguage(button.dataset.language);
    keyboardLayoutLanguage = button.dataset.language;
    keyboardSymbolMode = false;
    keyboardShifted = false;
    applyLanguage(button.dataset.language);
    await renderApps();
    refreshWeather(false);
    refreshFocusables(button);
  }));
  refreshFocusables(onboarding.hidden ? grid.querySelector('.app-card') : onboardingStart);
  Promise.allSettled([
    initializeBackground(),
    initializeUpdater(),
    loadSystemSettings()
  ]).then((results) => {
    const rejected = results.find((result) => result.status === 'rejected');
    if (rejected) showToast(rejected.reason?.message || 'Не удалось загрузить часть системных настроек');
  });
}

function renderAppIcon(container, app, fallback = null) {
  const builtInIcons = { youtube: 'youtube.svg', vkvideo: 'vk.svg', rutube: 'rutube.svg', twitch: 'twitch.svg', browser: 'google.svg', files: 'files.svg', settings: 'fedora.svg' };
  const iconFile = app.iconPath || builtInIcons[app.id];
  const source = app.iconDataUrl || (/^[a-z0-9_-]+\.svg$/i.test(iconFile || '') ? `../../assets/app-icons/${iconFile}` : null);
  container.replaceChildren();
  container.classList.toggle('has-image', Boolean(source));
  if (source) {
    const image = document.createElement('img');
    image.src = source;
    image.alt = '';
    image.addEventListener('error', () => {
      container.classList.remove('has-image');
      container.textContent = fallback || app.icon || app.title.slice(0, 2).toUpperCase();
    }, { once: true });
    container.appendChild(image);
  } else {
    container.textContent = fallback || app.icon || app.title.slice(0, 2).toUpperCase();
  }
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
  if (keyboardOpen) setKeyboardVisible(false);
  backdrop.hidden = true;
  quickPanel.hidden = true;
  addBackdrop.hidden = true;
  filesBackdrop.hidden = true;
  manageBackdrop.hidden = true;
  document.body.classList.remove('quick-panel-open');
  topbarVolume.setAttribute('aria-expanded', 'false');
  topbarNetwork.setAttribute('aria-expanded', 'false');
  topbarBluetooth.setAttribute('aria-expanded', 'false');
  activeSettingsCategory = null;
  confirmHandler = null;
  window.tv.setConfirmationVisible(false);
}

async function handleInputAction(action) {
  if (action === 'left' || action === 'right' || action === 'up' || action === 'down') return moveFocus(action);
  if (action === 'select') return document.activeElement?.classList.contains('focusable') && document.activeElement.click();
  if (action === 'back') {
    if (keyboardOpen) return setKeyboardVisible(false);
    if (!onboarding.hidden) return;
    if (!backdrop.hidden) return closeConfirm();
    if (!quickPanel.hidden) return closeQuickPanel();
    if (!addBackdrop.hidden) return closeAddPanel();
    if (!filesBackdrop.hidden) return goBackInFiles();
    if (!manageBackdrop.hidden) return activeSettingsCategory ? showSettingsCategory(null) : closeManagePanel();
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
  if (['volume-up', 'volume-down', 'mute'].includes(action)) {
    const result = await window.tv.systemAction(action);
    if (result?.audio) renderAudio(result.audio);
    return result;
  }
  if (['play-pause', 'next', 'previous', 'stop'].includes(action)) return window.tv.mediaAction(action);
}

document.addEventListener('keydown', (event) => {
  if (hideScreensaver()) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  resetAmbientTimer();
  if (event.key === 'F11') {
    event.preventDefault();
    window.tv.toggleFullscreen();
    return;
  }
  const action = keyActions.get(event.key) || keyActions.get(event.code);
  if (!action) return;
  const activeInput = document.activeElement;
  const textEditing = activeInput instanceof HTMLTextAreaElement
    || (activeInput instanceof HTMLInputElement && !['range', 'color', 'checkbox', 'radio', 'button', 'submit'].includes(activeInput.type));
  if (textEditing && (event.key === 'Backspace' || !['back', 'home', 'power'].includes(action))) return;
  if (activeInput instanceof HTMLSelectElement && ['left', 'right', 'up', 'down', 'select'].includes(action)) return;
  if (activeInput instanceof HTMLInputElement && activeInput.type === 'range' && ['left', 'right'].includes(action)) return;
  if (event.repeat && ['select', 'back', 'home', 'menu', 'power'].includes(action)) return;
  event.preventDefault();
  handleInputAction(action);
});

document.addEventListener('focusin', (event) => {
  const input = event.target;
  if (input instanceof HTMLInputElement && !['range', 'color', 'checkbox', 'radio'].includes(input.type)) {
    lastTextInput = input;
    setKeyboardVisible(true, input);
    return;
  }
  if (input instanceof Element && input.classList.contains('focusable')) {
    const scope = navigationScope();
    const scopedFocusables = availableFocusables(scope);
    const index = scopedFocusables.indexOf(input);
    if (index >= 0) {
      focusables = scopedFocusables;
      focusIndex = index;
      document.querySelectorAll('.focused').forEach((element) => element.classList.remove('focused'));
      input.classList.add('focused');
      rememberedFocus.set(scope, input);
    }
  }
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
    if (!screensaver.hidden && actions.size) {
      hideScreensaver();
      previous.pressed = actions;
      gamepadState.set(pad.index, previous);
      continue;
    }
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
document.addEventListener('pointerdown', () => { hideScreensaver(); resetAmbientTimer(); }, { capture: true });
document.addEventListener('visibilitychange', resetAmbientTimer);
window.tv.onHomeRequested(() => { closeAllOverlays(); refreshFocusables(); });
window.tv.onBrowserToolbarRequested(() => refreshFocusables(0));
window.tv.onHardwareChanged(async () => {
  const result = await window.tv.getSettings();
  if (!result?.ok) return;
  renderAudio(result.audio);
  renderDisplays(result.displays);
  renderCec(result.cec, result.preferences);
  if (!manageBackdrop.hidden) refreshFocusables(document.activeElement);
  showToast(currentLanguage === 'en' ? 'Display or audio connection changed' : 'Изменилось подключение дисплея или звука');
});
window.tv.onSystemActionRequested((action) => requestSystemAction(action));
window.tv.onBrowserState(renderBrowserState);
window.tv.onUpdateState(renderUpdateState);
window.addEventListener('online', () => {
  window.tv.checkForUpdates();
  refreshWeather(true);
});
updateClock();
setInterval(updateClock, 1000);
loadApps().catch((error) => showToast(error.message));
requestAnimationFrame(pollGamepads);
