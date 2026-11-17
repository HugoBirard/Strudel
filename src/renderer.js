/**
 * renderer.js
 * Coordinateur principal de Strudel Studio Desktop.
 * Architecture modulaire : audio-engine, editor, visualizer, metronome, snippets, theme, updater.
 */

import {
  initAudioEngine,
  playPattern,
  stopAudio,
  setMasterVolume,
  setMasterLPF,
  setMasterLPQ,
  setMacroRoom,
  setBpm,
  getAnalyserNodeInstance,
  getAudioContextInstance,
  getReplInstance,
  getIsPlaying,
  getCurrentBpm
} from './audio/audio-engine.js';

import {
  initCodeEditor,
  getEditorCode,
  setEditorCode,
  insertAtCursor,
  getSelectedCode,
  focusEditor
} from './ui/editor.js';

import { initVisualizer } from './ui/visualizer.js';
import { initMetronome } from './ui/metronome.js';
import { initSnippets } from './ui/snippets.js';
import { initThemes } from './ui/theme.js';
import { initUpdater } from './ui/updater.js';

let snippetsManager = null;

async function play() {
  const code = getEditorCode().trim();
  if (!code) {
    updateStatus('Aucun code à jouer. Écrivez ou insérez une ligne.', 'stopped');
    return;
  }

  try {
    updateStatus('Évaluation...', 'stopped');
    await playPattern(code);

    const btnPlay = document.getElementById('btn-play');
    btnPlay.classList.add('playing');
    document.getElementById('play-text').textContent = 'ACTIF';

    updateStatus('En lecture (Cycles en cours)', 'playing');
  } catch (err) {
    console.error('Erreur lecture Strudel:', err);
    updateStatus('Erreur : ' + (err.message || 'Erreur d\'évaluation'), 'error');
  }
}

function stop() {
  stopAudio();

  const btnPlay = document.getElementById('btn-play');
  btnPlay.classList.remove('playing');
  document.getElementById('play-text').textContent = 'PLAY';

  updateStatus('Prêt (Arrêté)', 'stopped');
}

function updateStatus(text, state) {
  const badge = document.getElementById('status-indicator');
  const textEl = document.getElementById('status-text');
  if (badge) badge.className = 'status-badge ' + state;
  if (textEl) textEl.textContent = text;
}

function initApp() {
  // 1. Initialisation des Thèmes visuels
  initThemes();

  // 2. Initialisation de l'Éditeur CodeMirror 6 officiel
  const editorContainer = document.getElementById('code-editor-container');
  initCodeEditor({
    container: editorContainer,
    initialCode: '',
    onEvaluate: () => play(),
    onStop: () => stop(),
    onChange: () => {
      // Événement déclenché à la frappe
    }
  });

  // 3. Initialisation des Snippets personnalisés
  const snippetsContainer = document.getElementById('user-snippets-container');
  snippetsManager = initSnippets({
    container: snippetsContainer,
    onInsert: (code) => {
      insertAtCursor(code);
    }
  });

  // Bouton pour sauvegarder la sélection actuelle en snippet
  const btnSaveSelection = document.getElementById('btn-save-selection');
  if (btnSaveSelection) {
    btnSaveSelection.onclick = () => {
      const selected = getSelectedCode();
      if (!selected) {
        alert('Sélectionnez du code dans l\'éditeur avec la souris, puis cliquez sur ce bouton.');
        return;
      }
      snippetsManager.openSaveSnippetModal(selected);
    };
  }

  // 4. Initialisation du Visualisateur Audio (Oscilloscope + Spectre)
  const canvas = document.getElementById('oscilloscope');
  initVisualizer(canvas, {
    getAnalyser: getAnalyserNodeInstance,
    getIsPlaying: getIsPlaying
  });

  // 5. Initialisation du Métronome synchronisé sur l'horloge audio (Zero Drift)
  initMetronome({
    getRepl: getReplInstance,
    getAudioContext: getAudioContextInstance,
    getIsPlaying: getIsPlaying,
    getCurrentBpm: getCurrentBpm
  });

  // 6. Initialisation de l'Updater Desktop
  initUpdater();

  // 7. Boutons Transport Audio
  document.getElementById('btn-play').onclick = () => play();
  document.getElementById('btn-stop').onclick = () => stop();

  // 8. Contrôle du Tempo (BPM)
  const tempoInput = document.getElementById('tempo-input');
  tempoInput.onchange = (e) => {
    const val = parseInt(e.target.value, 10) || 128;
    setBpm(val);
  };

  document.getElementById('tempo-minus').onclick = () => {
    const next = Math.max(30, getCurrentBpm() - 2);
    tempoInput.value = next;
    setBpm(next);
  };

  document.getElementById('tempo-plus').onclick = () => {
    const next = Math.min(300, getCurrentBpm() + 2);
    tempoInput.value = next;
    setBpm(next);
  };

  // Tap Tempo
  let tapTimes = [];
  document.getElementById('btn-tap').onclick = () => {
    const now = performance.now();
    tapTimes.push(now);
    if (tapTimes.length > 4) tapTimes.shift();
    if (tapTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < tapTimes.length; i++) {
        intervals.push(tapTimes[i] - tapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgInterval);
      if (bpm >= 40 && bpm <= 260) {
        tempoInput.value = bpm;
        setBpm(bpm);
      }
    }
  };

  // 9. Contrôles Master & Macros Hardware
  // Master Cutoff Filter
  const sliderLPF = document.getElementById('slider-macroLPF');
  const labelLPF = document.getElementById('val-macroLPF');
  sliderLPF.oninput = (e) => {
    const freq = parseFloat(e.target.value);
    setMasterLPF(freq);
    labelLPF.textContent = freq >= 19000 ? '20000 Hz (Ouvert)' : freq + ' Hz';
  };

  // Master Filter Q
  const sliderLPQ = document.getElementById('slider-macroLPQ');
  const labelLPQ = document.getElementById('val-macroLPQ');
  sliderLPQ.oninput = (e) => {
    const q = parseFloat(e.target.value);
    setMasterLPQ(q);
    labelLPQ.textContent = q.toFixed(1);
  };

  // Macro Reverb (Room)
  const sliderRoom = document.getElementById('slider-macroRoom');
  const labelRoom = document.getElementById('val-macroRoom');
  sliderRoom.oninput = (e) => {
    const r = parseFloat(e.target.value);
    setMacroRoom(r);
    labelRoom.textContent = r.toFixed(2);
  };

  // Master Volume Gain
  const sliderVol = document.getElementById('slider-masterVolume');
  const labelVol = document.getElementById('val-masterVolume');
  sliderVol.oninput = (e) => {
    const v = parseFloat(e.target.value);
    setMasterVolume(v);
    labelVol.textContent = Math.round(v * 100) + '%';
  };

  // 10. Raccourcis Clavier Globaux
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      play();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === '.') {
      e.preventDefault();
      stop();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      document.getElementById('btn-save').click();
    }
  });

  // 11. Gestion des fichiers (IPC Electron)
  document.getElementById('btn-new').onclick = () => {
    if (confirm('Créer un nouveau fichier vide ?')) {
      setEditorCode('');
      document.getElementById('current-filename').textContent = 'nouveau.strudel';
    }
  };

  document.getElementById('btn-open').onclick = async () => {
    if (window.desktopApi && window.desktopApi.openFile) {
      const res = await window.desktopApi.openFile();
      if (res) {
        setEditorCode(res.content);
        document.getElementById('current-filename').textContent = res.filename;
        if (getIsPlaying()) play();
      }
    }
  };

  document.getElementById('btn-save').onclick = async () => {
    if (window.desktopApi && window.desktopApi.saveFile) {
      const currentName = document.getElementById('current-filename').textContent;
      const res = await window.desktopApi.saveFile({
        content: getEditorCode(),
        defaultPath: currentName
      });
      if (res) {
        document.getElementById('current-filename').textContent = res.filename;
      }
    }
  };

  // 12. Pré-initialisation propre du moteur Strudel au démarrage
  setTimeout(async () => {
    try {
      await initAudioEngine();
      console.log('[Strudel Studio] Moteur audio et Master Bus initialisés avec succès.');
    } catch (e) {
      console.warn('[Strudel Studio] Initialisation audio reportée au premier clic:', e);
    }
  }, 400);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
