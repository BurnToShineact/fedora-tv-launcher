const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('tv', {
  getApps: () => ipcRenderer.invoke('apps:get'),
  addApp: (app) => ipcRenderer.invoke('apps:add', app),
  getSystemApps: () => ipcRenderer.invoke('system-apps:get'),
  addSystemApp: (desktopId) => ipcRenderer.invoke('system-apps:add', desktopId),
  deleteApp: (id) => ipcRenderer.invoke('apps:delete', id),
  openApp: (app) => ipcRenderer.invoke('app:open', app),
  browserBack: () => ipcRenderer.invoke('browser:back'),
  goHome: () => ipcRenderer.invoke('browser:home'),
  refresh: () => ipcRenderer.invoke('browser:refresh'),
  systemAction: (action) => ipcRenderer.invoke('system:action', action),
  toggleFullscreen: () => ipcRenderer.invoke('window:toggle-fullscreen'),
  getAppInfo: () => ipcRenderer.invoke('app:get-info'),
  getUpdateState: () => ipcRenderer.invoke('update:get-state'),
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  downloadUpdate: () => ipcRenderer.invoke('update:download'),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  onBrowserState: (callback) => ipcRenderer.on('browser:state', (_, state) => callback(state)),
  onHomeRequested: (callback) => ipcRenderer.on('launcher:home', callback),
  onUpdateState: (callback) => ipcRenderer.on('update:state', (_, state) => callback(state))
});
