import { initStrudel } from '../node_modules/@strudel/web/dist/index.mjs';

// 1. MACROS GLOBALES (Modifiables en direct par les sliders)
window.macroLPF = 1200;
window.macroLPQ = 6;
window.macroRoom = 0.5;
window.masterGainValue = 0.85;

// 2. ÉTAT DE L'APPLICATION
let repl = null;
let isPlaying = false;
let currentBpm = 128;
let metroInterval = null;
let currentBeat = 0;
let analyserNode = null;
let audioContext = null;

// L'éditeur commence vierge (aucun code pré-fait)
const DEFAULT_CODE = "";

// 3. GESTION DES SNIPPETS PERSONNALISÉS DE L'UTILISATEUR
const SNIPPETS_STORAGE_KEY = 'strudel_user_snippets';

function getUserSnippets() {
  try {
    const raw = localStorage.getItem(SNIPPETS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Erreur lecture snippets:', e);
    return [];
  }
}

function saveUserSnippets(snippets) {
  try {
    localStorage.setItem(SNIPPETS_STORAGE_KEY, JSON.stringify(snippets));
  } catch (e) {
    console.error('Erreur sauvegarde snippets:', e);
  }
}

function renderUserSnippets() {
  const container = document.getElementById('user-snippets-container');
  const snippets = getUserSnippets();

  container.innerHTML = '';

  if (snippets.length === 0) {
    container.innerHTML = `
      <div class="empty-snippets-msg">
        <svg class="svg-icon" viewBox="0 0 24 24" style="width: 28px; height: 28px; color: #475569; margin-bottom: 8px;">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <p><strong>Aucun snippet enregistré.</strong></p>
        <p style="margin-top: 4px; font-size: 11px;">Écrivez du code, sélectionnez vos lignes préférées et cliquez sur <em>Sauvegarder la sélection</em> pour les réutiliser quand vous voulez.</p>
      </div>
    `;
    return;
  }

  snippets.forEach(snippet => {
    const card = document.createElement('div');
    card.className = 'user-snippet-card';
    card.innerHTML = `
      <div class="snippet-card-top">
        <span class="snippet-card-title">${escapeHtml(snippet.title || 'Snippet sans titre')}</span>
        <div class="snippet-card-actions">
          <button class="btn-snippet-icon delete" title="Supprimer ce snippet" data-action="delete" data-id="${snippet.id}">
            <svg class="svg-icon" viewBox="0 0 24 24" style="width: 13px; height: 13px;">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="snippet-card-preview" title="Cliquer pour insérer au curseur" data-action="insert" data-id="${snippet.id}">${escapeHtml(snippet.code)}</div>
      <button class="btn-insert-snippet" data-action="insert" data-id="${snippet.id}">
        <svg class="svg-icon" viewBox="0 0 24 24" style="width: 12px; height: 12px;">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Insérer au curseur</span>
      </button>
    `;

    // Événements d'insertion et suppression
    card.querySelectorAll('[data-action="insert"]').forEach(el => {
      el.onclick = () => insertSnippetIntoEditor(snippet.code);
    });

    card.querySelector('[data-action="delete"]').onclick = (e) => {
      e.stopPropagation();
      deleteUserSnippet(snippet.id);
    };

    container.appendChild(card);
  });
}

function insertSnippetIntoEditor(code) {
  const editor = document.getElementById('code-editor');
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const currentText = editor.value;

  // Si l'éditeur est vide, on remplace simplement
  if (!currentText.trim()) {
    editor.value = code;
    editor.focus();
    return;
  }

  // Sinon on insère au curseur
  const prefix = (start > 0 && currentText[start - 1] !== '\n') ? '\n' : '';
  const suffix = (end < currentText.length && currentText[end] !== '\n') ? '\n' : '';
  editor.value = currentText.substring(0, start) + prefix + code + suffix + currentText.substring(end);

  editor.focus();
  const newPos = start + prefix.length + code.length;
  editor.setSelectionRange(newPos, newPos);
}

function deleteUserSnippet(id) {
  if (confirm('Voulez-vous supprimer ce snippet ?')) {
    const list = getUserSnippets().filter(s => s.id !== id);
    saveUserSnippets(list);
    renderUserSnippets();
  }
}

function openSaveSnippetModal(prefilledCode = '') {
  const modal = document.getElementById('snippet-modal');
  const nameInput = document.getElementById('input-snippet-name');
  const codeInput = document.getElementById('input-snippet-code');

  nameInput.value = '';
  codeInput.value = prefilledCode;

  modal.classList.add('open');
  nameInput.focus();
}

function closeSaveSnippetModal() {
  document.getElementById('snippet-modal').classList.remove('open');
}

function confirmSaveSnippet() {
  const nameInput = document.getElementById('input-snippet-name');
  const codeInput = document.getElementById('input-snippet-code');

  const title = nameInput.value.trim() || 'Ligne personnalisée';
  const code = codeInput.value.trim();

  if (!code) {
    alert('Veuillez renseigner le code ou la ligne à sauvegarder.');
    return;
  }

  const list = getUserSnippets();
  list.unshift({
    id: Date.now(),
    title: title,
    code: code
  });

  saveUserSnippets(list);
  renderUserSnippets();
  closeSaveSnippetModal();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 4. INITIALISATION DU MOTEUR STRUDEL HEADLESS
async function ensureEngine() {
  if (!repl) {
    updateStatus('Initialisation du moteur audio...', 'stopped');
    repl = await initStrudel({
      prebake: () => samples('github:tidalcycles/dirt-samples')
    });

    try {
      const webaudio = window.__strudel_webaudio || (repl && repl.webaudio);
      if (webaudio && webaudio.ctx) {
        audioContext = webaudio.ctx;
      } else {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 256;

      if (webaudio && webaudio.master) {
        webaudio.master.connect(analyserNode);
      }
    } catch (e) {
      console.warn('AudioContext Analyser:', e);
    }

    startVisualizer();
  }
  return repl;
}

// 5. TRANSPORT AUDIO (PLAY / STOP)
async function play() {
  try {
    const code = document.getElementById('code-editor').value.trim();
    if (!code) {
      updateStatus('Aucun code à jouer. Écrivez ou insérez une ligne.', 'stopped');
      return;
    }

    const engine = await ensureEngine();
    engine.evaluate(code);
    isPlaying = true;

    const btnPlay = document.getElementById('btn-play');
    btnPlay.classList.add('playing');
    document.getElementById('play-text').textContent = 'ACTIF';

    updateStatus('En lecture (Cycles en cours)', 'playing');
    startMetro();
  } catch (err) {
    console.error('Erreur évaluation:', err);
    updateStatus('Erreur de syntaxe : ' + err.message, 'error');
  }
}

function stop() {
  if (repl) {
    try {
      repl.evaluate('');
    } catch (e) {}
  }
  isPlaying = false;

  const btnPlay = document.getElementById('btn-play');
  btnPlay.classList.remove('playing');
  document.getElementById('play-text').textContent = 'PLAY';

  updateStatus('Prêt (Arrêté)', 'stopped');
  stopMetro();
}

function updateStatus(text, state) {
  const badge = document.getElementById('status-indicator');
  const textEl = document.getElementById('status-text');
  badge.className = 'status-badge ' + state;
  textEl.textContent = text;
}

// 6. MÉTRONOME VISUEL (4 TEMPS)
function startMetro() {
  stopMetro();
  const beatIntervalMs = (60 / currentBpm) * 1000;
  currentBeat = 0;

  metroInterval = setInterval(() => {
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById(`dot-${i}`);
      if (i === currentBeat) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    }
    currentBeat = (currentBeat + 1) % 4;
  }, beatIntervalMs);
}

function stopMetro() {
  if (metroInterval) {
    clearInterval(metroInterval);
    metroInterval = null;
  }
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) dot.classList.remove('active');
  }
}

// 7. VISUALISEUR AUDIO CANVAS (Oscilloscope)
function startVisualizer() {
  const canvas = document.getElementById('oscilloscope');
  const ctx = canvas.getContext('2d');
  const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 128;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);

    if (analyserNode && isPlaying) {
      analyserNode.getByteTimeDomainData(dataArray);
    } else {
      for (let i = 0; i < bufferLength; i++) {
        dataArray[i] = 128;
      }
    }

    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#141824';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = isPlaying ? '#10b981' : '#334155';
    ctx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  draw();
}

// 8. GESTION DES MISES À JOUR
async function checkUpdates(silent = false) {
  const btnUpdate = document.getElementById('btn-update');
  const updateIcon = document.getElementById('update-icon');
  const updateLabel = document.getElementById('update-label');
  const updateDot = document.getElementById('update-dot');

  if (!window.desktopApi || !window.desktopApi.checkForUpdates) {
    if (!silent) alert('Vérification des mises à jour disponible dans l\'application desktop.');
    return;
  }

  try {
    updateLabel.textContent = 'Vérification...';
    updateIcon.style.animation = 'spin 1s linear infinite';

    const res = await window.desktopApi.checkForUpdates();

    updateIcon.style.animation = '';
    updateLabel.textContent = 'Mises à jour';

    if (res && res.hasUpdate) {
      btnUpdate.classList.add('has-update');
      updateDot.style.display = 'inline-block';
      openUpdateModal(res);
    } else {
      btnUpdate.classList.remove('has-update');
      updateDot.style.display = 'none';
      if (!silent) {
        alert('Votre version de Strudel Studio est parfaitement à jour (' + (res.currentVersion || 'Dernier commit') + ').');
      }
    }
  } catch (err) {
    console.warn('Erreur vérification maj:', err);
    updateIcon.style.animation = '';
    updateLabel.textContent = 'Mises à jour';
    if (!silent) alert('Impossible de vérifier les mises à jour pour le moment.');
  }
}

function openUpdateModal(updateInfo) {
  const modal = document.getElementById('update-modal');
  const title = document.getElementById('modal-update-title');
  const msg = document.getElementById('modal-update-msg');
  const changelog = document.getElementById('modal-changelog');

  title.textContent = 'Mise à jour disponible (' + updateInfo.latestVersion + ')';
  msg.textContent = `Votre version actuelle est ${updateInfo.currentVersion}. Une version plus récente est disponible sur la branche app.`;
  changelog.textContent = updateInfo.changelog || 'Mise à jour des composants et améliorations diverses.';

  modal.classList.add('open');
}

function closeUpdateModal() {
  document.getElementById('update-modal').classList.remove('open');
}

async function triggerInstallUpdate() {
  const btn = document.getElementById('btn-confirm-install');
  const label = document.getElementById('btn-install-label');

  btn.disabled = true;
  label.textContent = 'Téléchargement & Installation...';

  try {
    const res = await window.desktopApi.installUpdate();
    if (res && res.success) {
      label.textContent = 'Redémarrage en cours...';
      setTimeout(() => {
        window.desktopApi.restartApp();
      }, 1000);
    } else {
      alert('Erreur lors de l\'installation : ' + (res.error || 'Erreur inconnue'));
      btn.disabled = false;
      label.textContent = 'Réessayer';
    }
  } catch (err) {
    alert('Erreur lors de la mise à jour : ' + err.message);
    btn.disabled = false;
    label.textContent = 'Réessayer';
  }
}

// 9. INITIALISATION DES CONTRÔLES
document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('code-editor');

  // Éditeur vierge
  editor.value = DEFAULT_CODE;

  // Rendu initial des snippets de l'utilisateur
  renderUserSnippets();

  // Bouton : Sauvegarder la sélection de l'éditeur
  document.getElementById('btn-save-selection').onclick = () => {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    let selectedText = editor.value.substring(start, end).trim();

    // Si aucune sélection explicite, on prend la ligne courante où se trouve le curseur
    if (!selectedText) {
      const allLines = editor.value.split('\n');
      let charCount = 0;
      for (const line of allLines) {
        if (start >= charCount && start <= charCount + line.length) {
          selectedText = line.trim();
          break;
        }
        charCount += line.length + 1;
      }
    }

    openSaveSnippetModal(selectedText);
  };

  // Bouton : Ajouter manuellement un snippet
  document.getElementById('btn-add-snippet').onclick = () => {
    openSaveSnippetModal('');
  };

  // Modale Snippet
  document.getElementById('btn-close-snippet-modal').onclick = closeSaveSnippetModal;
  document.getElementById('btn-cancel-snippet').onclick = closeSaveSnippetModal;
  document.getElementById('btn-confirm-save-snippet').onclick = confirmSaveSnippet;

  // Boutons Play / Stop
  document.getElementById('btn-play').onclick = () => play();
  document.getElementById('btn-stop').onclick = () => stop();

  // Gestion du Tempo (BPM)
  const tempoInput = document.getElementById('tempo-input');
  tempoInput.onchange = (e) => {
    currentBpm = parseInt(e.target.value) || 128;
    if (isPlaying) {
      startMetro();
      repl && repl.evaluate(`setcps(${currentBpm}/60/4)`);
    }
  };

  document.getElementById('tempo-minus').onclick = () => {
    currentBpm = Math.max(30, currentBpm - 2);
    tempoInput.value = currentBpm;
    tempoInput.onchange({ target: tempoInput });
  };

  document.getElementById('tempo-plus').onclick = () => {
    currentBpm = Math.min(300, currentBpm + 2);
    tempoInput.value = currentBpm;
    tempoInput.onchange({ target: tempoInput });
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
        currentBpm = bpm;
        tempoInput.value = currentBpm;
        tempoInput.onchange({ target: tempoInput });
      }
    }
  };

  // Macro Sliders
  const setupMacro = (id, varName, labelId, unit = '') => {
    const slider = document.getElementById(id);
    const label = document.getElementById(labelId);
    slider.oninput = (e) => {
      window[varName] = parseFloat(e.target.value);
      label.textContent = e.target.value + unit;
    };
  };

  setupMacro('slider-macroLPF', 'macroLPF', 'val-macroLPF', ' Hz');
  setupMacro('slider-macroLPQ', 'macroLPQ', 'val-macroLPQ');
  setupMacro('slider-macroRoom', 'macroRoom', 'val-macroRoom');
  setupMacro('slider-masterVolume', 'masterGainValue', 'val-masterVolume', '%');

  // Raccourcis Clavier
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

  // Fichiers (Electron Desktop API)
  document.getElementById('btn-new').onclick = () => {
    if (confirm('Créer un nouveau fichier vide ?')) {
      editor.value = '';
      document.getElementById('current-filename').textContent = 'nouveau.strudel';
    }
  };

  document.getElementById('btn-open').onclick = async () => {
    if (window.desktopApi && window.desktopApi.openFile) {
      const res = await window.desktopApi.openFile();
      if (res) {
        editor.value = res.content;
        document.getElementById('current-filename').textContent = res.filename;
        if (isPlaying) play();
      }
    }
  };

  document.getElementById('btn-save').onclick = async () => {
    if (window.desktopApi && window.desktopApi.saveFile) {
      const currentName = document.getElementById('current-filename').textContent;
      const res = await window.desktopApi.saveFile({
        content: editor.value,
        defaultPath: currentName
      });
      if (res) {
        document.getElementById('current-filename').textContent = res.filename;
      }
    }
  };

  // Mises à jour
  document.getElementById('btn-update').onclick = () => checkUpdates(false);
  document.getElementById('btn-close-modal').onclick = closeUpdateModal;
  document.getElementById('btn-cancel-update').onclick = closeUpdateModal;
  document.getElementById('btn-confirm-install').onclick = triggerInstallUpdate;

  // Vérification silencieuse au démarrage
  setTimeout(() => {
    checkUpdates(true);
  }, 3000);
});
