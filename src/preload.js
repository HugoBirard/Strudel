const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopApi', {
  // Fenêtre (TitleBar système personnalisée style ToDoList)
  windowMinimize: () => ipcRenderer.send('window:minimize'),
  windowMaximize: () => ipcRenderer.send('window:maximize'),
  windowClose: () => ipcRenderer.send('window:close'),
  isWindowMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  windowSetBounds: (bounds) => ipcRenderer.send('window:setBounds', bounds),
  windowGetBounds: () => ipcRenderer.invoke('window:getBounds'),
  onMaximizeChange: (callback) => {
    ipcRenderer.on('window:maximize-change', (_event, isMaximized) => callback(isMaximized));
  },

  // Fichiers
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (data) => ipcRenderer.invoke('dialog:saveFile', data),

  // Mises à jour
  checkForUpdates: () => ipcRenderer.invoke('updater:check'),
  installUpdate: () => ipcRenderer.invoke('updater:install'),
  restartApp: () => ipcRenderer.invoke('updater:restart'),

  isDesktop: true
});
