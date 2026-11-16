const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Strudel Studio',
    backgroundColor: '#0a0b10',
    icon: path.join(__dirname, '..', 'assets', 'icon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 1. DIALOGUES DE FICHIERS NATIFS
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

// 2. SYSTÈME DE VÉRIFICATION ET INSTALLATION DE MISES À JOUR
const APP_ROOT = path.join(__dirname, '..');

ipcMain.handle('updater:check', async () => {
  try {
    // 1. Récupération des nouveautés distantes depuis origin/app
    await execPromise('git fetch origin app', { cwd: APP_ROOT });

    // 2. Comparaison des hash commits
    const { stdout: localStdout } = await execPromise('git rev-parse --short HEAD', { cwd: APP_ROOT });
    const { stdout: remoteStdout } = await execPromise('git rev-parse --short origin/app', { cwd: APP_ROOT });

    const localCommit = localStdout.trim();
    const remoteCommit = remoteStdout.trim();

    if (localCommit !== remoteCommit) {
      const { stdout: logStdout } = await execPromise('git log HEAD..origin/app --oneline', { cwd: APP_ROOT });
      return {
        hasUpdate: true,
        currentVersion: localCommit,
        latestVersion: remoteCommit,
        changelog: logStdout.trim() || 'Nouvelles fonctionnalités et améliorations du moteur.'
      };
    }

    return {
      hasUpdate: false,
      currentVersion: localCommit,
      latestVersion: remoteCommit
    };
  } catch (err) {
    console.warn('Avertissement vérification mise à jour:', err.message);
    return { hasUpdate: false, error: err.message };
  }
});

ipcMain.handle('updater:install', async () => {
  try {
    // 1. Mise à jour du code via git pull
    await execPromise('git pull origin app', { cwd: APP_ROOT });

    // 2. Mise à jour des paquets npm si nécessaire
    await execPromise('npm install', { cwd: APP_ROOT });

    return { success: true };
  } catch (err) {
    console.error('Erreur installation mise à jour:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('updater:restart', () => {
  app.relaunch();
  app.exit(0);
});

// 3. CYCLE DE VIE ELECTRON
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
