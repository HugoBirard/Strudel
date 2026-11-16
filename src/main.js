const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 880,
    minWidth: 1000,
    minHeight: 650,
    title: 'Strudel Studio',
    backgroundColor: '#0d0e15',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false // Permet de charger des samples locaux sans restriction CORS
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Dialogues de fichiers natifs
ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Ouvrir un morceau Strudel',
    filters: [
      { name: 'Fichiers Strudel & JavaScript', extensions: ['strudel', 'js', 'txt'] },
      { name: 'Tous les fichiers', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (canceled || filePaths.length === 0) return null;

  try {
    const content = fs.readFileSync(filePaths[0], 'utf-8');
    return { path: filePaths[0], content, filename: path.basename(filePaths[0]) };
  } catch (err) {
    console.error('Erreur lecture fichier:', err);
    return null;
  }
});

ipcMain.handle('dialog:saveFile', async (event, { content, defaultPath }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Sauvegarder le morceau',
    defaultPath: defaultPath || 'mon_pattern.strudel',
    filters: [
      { name: 'Fichier Strudel', extensions: ['strudel'] },
      { name: 'Fichier JavaScript', extensions: ['js'] }
    ]
  });

  if (canceled || !filePath) return null;

  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { path: filePath, filename: path.basename(filePath) };
  } catch (err) {
    console.error('Erreur sauvegarde:', err);
    return null;
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
