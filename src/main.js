const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const util = require('util');
const execFilePromise = util.promisify(execFile);

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
      webSecurity: true, // Sécurité Web activée (Protection SOP / CSP)
      sandbox: false
    }
  });

  // Protection Navigation : empêche l'injection d'URL distantes malveillantes
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) {
      event.preventDefault();
    }
  });

  // Sécurité : ouverture des liens externes dans le navigateur système de l'OS
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 1. DIALOGUES DE FICHIERS NATIFS SÉCURISÉS
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
    const filePath = filePaths[0];
    // Validation du chemin
    if (typeof filePath !== 'string' || !fs.existsSync(filePath)) return null;

    const content = fs.readFileSync(filePath, 'utf-8');
    return { path: filePath, content, filename: path.basename(filePath) };
  } catch (err) {
    console.error('Erreur lecture fichier:', err);
    return null;
  }
});

ipcMain.handle('dialog:saveFile', async (event, data) => {
  if (!data || typeof data.content !== 'string') return null;

  const defaultPath = typeof data.defaultPath === 'string' && data.defaultPath.trim() 
    ? path.basename(data.defaultPath.trim()) 
    : 'mon_pattern.strudel';

  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Sauvegarder le morceau',
    defaultPath: defaultPath,
    filters: [
      { name: 'Fichier Strudel', extensions: ['strudel'] },
      { name: 'Fichier JavaScript', extensions: ['js'] }
    ]
  });

  if (canceled || !filePath) return null;

  try {
    fs.writeFileSync(filePath, data.content, 'utf-8');
    return { path: filePath, filename: path.basename(filePath) };
  } catch (err) {
    console.error('Erreur sauvegarde:', err);
    return null;
  }
});

// 2. SYSTÈME SÉCURISÉ DE VÉRIFICATION ET INSTALLATION DE MISES À JOUR
const APP_ROOT = path.join(__dirname, '..');

// Regex de validation stricte pour les noms de branches Git (évite toute injection de commande)
const VALID_BRANCH_REGEX = /^[a-zA-Z0-9_\-\.\/]+$/;

async function getCurrentBranch() {
  try {
    const { stdout } = await execFilePromise('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: APP_ROOT });
    const branch = stdout.trim();
    return VALID_BRANCH_REGEX.test(branch) ? branch : 'main';
  } catch (e) {
    return 'main';
  }
}

ipcMain.handle('updater:check', async () => {
  try {
    const branch = await getCurrentBranch();

    // 1. Récupération des nouveautés distantes (avec execFile sécurisé sans shell)
    await execFilePromise('git', ['fetch', 'origin', branch], { cwd: APP_ROOT });

    // 2. Comparaison des hash commits
    const { stdout: localStdout } = await execFilePromise('git', ['rev-parse', '--short', 'HEAD'], { cwd: APP_ROOT });
    const { stdout: remoteStdout } = await execFilePromise('git', ['rev-parse', '--short', `origin/${branch}`], { cwd: APP_ROOT });

    const localCommit = localStdout.trim();
    const remoteCommit = remoteStdout.trim();

    if (localCommit !== remoteCommit) {
      const { stdout: logStdout } = await execFilePromise('git', ['log', `HEAD..origin/${branch}`, '--oneline'], { cwd: APP_ROOT });
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
    const branch = await getCurrentBranch();

    // 1. Mise à jour du code via git pull sécurisé
    await execFilePromise('git', ['pull', 'origin', branch], { cwd: APP_ROOT });

    // 2. Mise à jour des paquets npm
    await execFilePromise('npm', ['install'], { cwd: APP_ROOT });

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
