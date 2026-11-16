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

// Modèle de départ propre (sans presets imposés)
const DEFAULT_CODE = `setcps(128/60/4)

stack(
  // Batterie 909
  s("bd [~ cp] bd [~ cp]").bank("RolandTR909"),
  s("hh*8 [oh hh]").gain(0.8),
  
  // Basse modulée par les macros en direct
  note("c2 [~ c2] eb2 [~ f2] g2 [~ bb1] c2 ~")
    .s("sawtooth")
    .lpf(macroLPF)
    .lpq(macroLPQ)
    .decay(0.3)
    .sustain(0.1)
)`;

// 3. INITIALISATION DU MOTEUR STRUDEL HEADLESS
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

// 4. TRANSPORT AUDIO (PLAY / STOP)
async function play() {
  try {
    const engine = await ensureEngine();
    const code = document.getElementById('code-editor').value;

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

// 5. MÉTRONOME VISUEL (4 TEMPS)
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

// 6. VISUALISEUR AUDIO CANVAS (Oscilloscope)
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

// 7. GESTION DES MISES À JOUR
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

// 8. INITIALISATION DES CONTRÔLES
document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('code-editor');

  // Code par défaut
  editor.value = DEFAULT_CODE;

  // Boutons Play / Stop
  document.getElementById('btn-play').onclick = () => {
    play();
  };

  document.getElementById('btn-stop').onclick = stop;

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

  // Insertion de snippets au curseur
  document.querySelectorAll('.btn-snippet').forEach(btn => {
    btn.onclick = () => {
      const snippet = btn.getAttribute('data-code');
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const text = editor.value;
      editor.value = text.substring(0, start) + '\n  ' + snippet + text.substring(end);
      editor.focus();
    };
  });

  // Insertion de tags sonores
  document.querySelectorAll('.sound-tag').forEach(tag => {
    tag.onclick = () => {
      const textToInsert = tag.getAttribute('data-insert');
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const text = editor.value;
      editor.value = text.substring(0, start) + textToInsert + text.substring(end);
      editor.focus();
    };
  });

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
    if (confirm('Créer un nouveau fichier ?')) {
      editor.value = `setcps(128/60/4)\n\ns("bd*4")`;
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
