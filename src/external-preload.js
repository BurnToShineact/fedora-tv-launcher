const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('externalControl', {
  goHome: () => ipcRenderer.send('external:home')
});
