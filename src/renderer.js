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
let masterGainNode = null;

// 3. CATALOGUE DE PRESETS D'USINE
const PRESETS = [
  {
    id: 'acid303',
    title: 'Techno Acid 303',
    desc: 'TR-909 percutante + basse 303 en dent de scie avec filtre dynamique',
    code: `setcps(135/60/4)

stack(
  // Batterie 909
  s("bd [~ cp] bd [~ cp], hh*16?0.85").bank("RolandTR909").gain(1.1),
  
  // Basse Acid modulée par la macro LPF
  note("c2 [~ c2] eb2 c2 [f2 c2] [g2 c2] bb1 [c2 c3]")
    .s("sawtooth")
    .decay(0.22)
    .sustain(0.1)
    .lpf(macroLPF)
    .lpq(macroLPQ)
    .distort(0.35)
)`
  },
  {
    id: 'jungle',
    title: 'Jungle & DnB Break',
    desc: 'Amen break découpé à 174 BPM + sub 808 et nappes chaudes',
    code: `setcps(174/60/4)

stack(
  // Amen break tranché
  s("amencutup").n("<0 [4 2] 3 [5 7]>").gain(1.2),
  
  // Sub 808
  note("<[c1 ~] [~ eb1] [f1 ~] [g1 ~]>").s("sine").gain(1.4).decay(1.4),
  
  // Nappe de fond
  note("<c4'min7 f4'min7 bb3'maj7 g3'dom7>")
    .s("gm_pad_2_warm")
    .slow(2)
    .room(macroRoom)
    .gain(0.65)
)`
  },
  {
    id: 'lofi',
    title: 'Lo-Fi Chill Rhodes',
    desc: 'Accords jazz au piano Rhodes, beat SP-1200 et vibraphone',
    code: `setcps(84/60/4)

stack(
  // Texture vinyle
  s("crackle").gain(0.12),
  
  // Beat feutré SP-1200
  s("bd [~ bd] sd [~ bd], hh*4").bank("EmuSP1200").lpf(2200),
  
  // Accords de Rhodes
  note("<[d3'm9] [g3'13] [c3'maj9] [a3'7b9]>")
    .s("gm_electric_piano_1")
    .slow(2)
    .room(macroRoom)
    .lpf(macroLPF),
    
  // Arpège subtil de vibraphone
  note("a4 c5 e5 g5 a5").s("gm_vibraphone").degradeBy(0.4).delay(0.5)
)`
  },
  {
    id: 'synthwave',
    title: 'Synthwave 80s',
    desc: 'Batterie LinnDrum, basse roulante en 16e et lead néon spatial',
    code: `setcps(110/60/4)

stack(
  // Batterie vintage 80s
  s("bd [~ bd] [sd,cp] [~ bd], hh*8").bank("AkaiLinn"),
  
  // Basse 16e de note
  note("c2*16").s("sawtooth").decay(0.15).lpf(macroLPF).lpq(4),
  
  // Lead spatial avec inversion stéréo (jux)
  note("<c4 eb4 g4 bb4 c5 eb5>*2")
    .s("gm_lead_2_sawtooth")
    .jux(rev)
    .delay(0.4)
    .room(macroRoom)
    .gain(0.75)
)`
  },
  {
    id: 'ambient',
    title: 'Ambient Éthéré',
    desc: 'Piano de concert polyrythmique et cordes symphoniques lentes',
    code: `setcps(60/60/4)

stack(
  // Piano acoustique avec grand espace
  note("c3 g3 eb4 bb4 f5")
    .s("gm_acoustic_grand_piano")
    .euclid(5, 12)
    .room(macroRoom)
    .size(0.9)
    .delay(0.6)
    .delaytime(0.5),
    
  // Nappe de cordes
  note("<c3'sus2 f3'maj7 g3'sus4>")
    .s("gm_string_ensemble_1")
    .slow(4)
    .attack(2)
    .release(3)
    .gain(0.7)
)`
  },
  {
    id: 'minimal',
    title: 'Minimal Groovy',
    desc: 'Percussions micro-glitch et basse sub sinusoïdale',
    code: `setcps(126/60/4)

stack(
  s("bd(3,8), [~ cp](2,4), hh(9,16)").bank("RolandTR808"),
  note("c2 ~ eb2 ~ g2 f2 ~ bb1").s("sine").gain(1.3).decay(0.35),
  s("glitch*8?0.3").pan(sine.range(0.2, 0.8))
)`
  }
];

// 4. INITIALISATION DU MOTEUR STRUDEL HEADLESS
async function ensureEngine() {
  if (!repl) {
    updateStatus('Initialisation du moteur audio...', 'stopped');
    repl = await initStrudel({
      prebake: () => samples('github:tidalcycles/dirt-samples')
    });

    // Configuration de l'analyseur audio pour le visualiseur Canvas
    try {
      const webaudio = window.__strudel_webaudio || (repl && repl.webaudio);
      if (webaudio && webaudio.ctx) {
        audioContext = webaudio.ctx;
      } else {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 256;
      
      // Branchement si possible vers master
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

// 5. FONCTIONS DE TRANSPORT
async function play() {
  try {
    const engine = await ensureEngine();
    const code = document.getElementById('code-editor').value;

    engine.evaluate(code);
    isPlaying = true;

    // Mise à jour de l'UI
    const btnPlay = document.getElementById('btn-play');
    btnPlay.classList.add('playing');
    document.getElementById('play-icon').textContent = '⚡';
    document.getElementById('play-text').textContent = 'ACTIF';

    updateStatus('En lecture (Cycles en cours)', 'playing');
    startMetro();
  } catch (err) {
    console.error('Erreur évaluation:', err);
    updateStatus('Erreur syntaxe : ' + err.message, 'error');
  }
}

function stop() {
  if (repl) {
    try {
      repl.evaluate(''); // Passe silence pour couper
    } catch (e) {}
  }
  isPlaying = false;

  const btnPlay = document.getElementById('btn-play');
  btnPlay.classList.remove('playing');
  document.getElementById('play-icon').textContent = '▶';
  document.getElementById('play-text').textContent = 'PLAY';

  updateStatus('Arrêté', 'stopped');
  stopMetro();
}

function updateStatus(text, state) {
  const badge = document.getElementById('status-indicator');
  const textEl = document.getElementById('status-text');
  badge.className = 'status-badge ' + state;
  textEl.textContent = text;
}

// 6. MÉTRONOME VISUEL (4 PULSATIONS DE TEMPS)
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
      // Onde de repos douce
      for (let i = 0; i < bufferLength; i++) {
        dataArray[i] = 128;
      }
    }

    ctx.fillStyle = '#090a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grille de fond
    ctx.strokeStyle = '#141824';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Dessin de la forme d'onde
    ctx.lineWidth = 2;
    ctx.strokeStyle = isPlaying ? '#10b981' : '#374151';
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

// 8. INITIALISATION DES CONTRÔLES & ÉVÉNEMENTS
document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('code-editor');
  const presetList = document.getElementById('preset-list');

  // Génération des presets dans la sidebar
  PRESETS.forEach((preset, index) => {
    const item = document.createElement('div');
    item.className = 'preset-item' + (index === 0 ? ' active' : '');
    item.innerHTML = `
      <div class="preset-title">${preset.title}</div>
      <div class="preset-desc">${preset.desc}</div>
    `;
    item.onclick = () => {
      document.querySelectorAll('.preset-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      editor.value = preset.code;
      document.getElementById('current-filename').textContent = preset.id + '.strudel';
      if (isPlaying) play(); // Réévalue à la volée !
    };
    presetList.appendChild(item);
  });

  // Chargement du premier preset
  editor.value = PRESETS[0].code;

  // Boutons Play / Stop
  document.getElementById('btn-play').onclick = () => {
    if (isPlaying) {
      // Re-évaluer sans couper
      play();
    } else {
      play();
    }
  };

  document.getElementById('btn-stop').onclick = stop;

  // Gestion du Tempo (BPM)
  const tempoInput = document.getElementById('tempo-input');
  tempoInput.onchange = (e) => {
    currentBpm = parseInt(e.target.value) || 128;
    if (isPlaying) {
      startMetro();
      // Injecte le tempo si spécifié
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
      // Note : les patterns référençant `macroLPF` liront la nouvelle valeur à la volée !
    };
  };

  setupMacro('slider-macroLPF', 'macroLPF', 'val-macroLPF', ' Hz');
  setupMacro('slider-macroLPQ', 'macroLPQ', 'val-macroLPQ');
  setupMacro('slider-macroRoom', 'macroRoom', 'val-macroRoom');
  setupMacro('slider-masterVolume', 'masterGainValue', 'val-masterVolume', '%');

  // Insertion de snippets
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
  });

  // Actions de fichiers (Electron Desktop API)
  document.getElementById('btn-new').onclick = () => {
    if (confirm('Créer un nouveau fichier vide ?')) {
      editor.value = `setcps(128/60/4)\n\ns("bd*4")`;
      document.getElementById('current-filename').textContent = 'sans_titre.strudel';
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
    } else {
      alert('Fonction disponible dans l\'application desktop.');
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
        alert('Fichier sauvegardé avec succès !');
      }
    } else {
      alert('Fonction disponible dans l\'application desktop.');
    }
  };
});
