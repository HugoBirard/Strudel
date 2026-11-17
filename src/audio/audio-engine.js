/**
 * audio-engine.js
 * Moteur WebAudio & Strudel REPL modulaire.
 * Gère le graphe audio natif : Strudel -> Master Filter (LPF) -> Master Gain -> Analyser -> Speakers.
 */

import {
  initStrudel,
  getAudioContext,
  samples,
  getSuperdoughAudioController
} from '../../node_modules/@strudel/web/dist/index.mjs';

let repl = null;
let audioContext = null;
let masterFilterNode = null;
let masterGainNode = null;
let analyserNode = null;
let isPlaying = false;
let currentBpm = 128;

// Macros globales
window.macroLPF = 20000;
window.macroLPQ = 1;
window.macroRoom = 0.5;
window.masterGainValue = 0.85;

/**
 * Initialise le graphe WebAudio et le moteur Strudel
 */
export async function initAudioEngine() {
  if (repl) return repl;

  // 1. Contexte WebAudio
  audioContext = typeof getAudioContext === 'function' ? getAudioContext() : new (window.AudioContext || window.webkitAudioContext)();

  // 2. Filtre Master Passe-Bas (LPF)
  masterFilterNode = audioContext.createBiquadFilter();
  masterFilterNode.type = 'lowpass';
  masterFilterNode.frequency.setValueAtTime(20000, audioContext.currentTime);
  masterFilterNode.Q.setValueAtTime(1, audioContext.currentTime);

  // 3. Gain Master (Volume général)
  masterGainNode = audioContext.createGain();
  masterGainNode.gain.setValueAtTime(window.masterGainValue, audioContext.currentTime);

  // 4. Analyseur FFT (Visualisateur)
  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.8;

  // Câblage du bus Master : Filtre -> Gain -> Analyseur -> Destination (Enceintes)
  masterFilterNode.connect(masterGainNode);
  masterGainNode.connect(analyserNode);
  analyserNode.connect(audioContext.destination);

  // 5. Initialisation du REPL Strudel avec aiguillage vers le Master Filter
  repl = await initStrudel({
    outputNode: masterFilterNode
  });

  // Raccordement du contrôleur Superdough vers le Master Filter
  try {
    const controller = typeof getSuperdoughAudioController === 'function' ? getSuperdoughAudioController() : null;
    if (controller && controller.output && controller.output.destinationGain) {
      try {
        controller.output.destinationGain.disconnect();
      } catch (_) {}
      controller.output.destinationGain.connect(masterFilterNode);
    }
  } catch (err) {
    console.warn('[AudioEngine] Raccordement Superdough:', err);
  }

  // Chargement non-bloquant des samples distants (samples GitHub Tidal)
  try {
    if (typeof samples === 'function') {
      samples('github:tidalcycles/dirt-samples').catch(err => {
        console.warn('[AudioEngine] Samples distants inaccessibles en mode hors-ligne:', err.message);
      });
    }
  } catch (_) {}

  return repl;
}

/**
 * Évalue et joue un pattern Strudel
 */
export async function playPattern(code) {
  if (!code || !code.trim()) {
    throw new Error('Aucun code à jouer.');
  }

  const engine = await initAudioEngine();

  // Débloque l'AudioContext si suspendu (politique autoplay)
  if (audioContext && audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  await engine.evaluate(code);
  isPlaying = true;
  return engine;
}

/**
 * Arrête la lecture audio
 */
export function stopAudio() {
  if (repl) {
    try {
      if (typeof repl.stop === 'function') {
        repl.stop();
      } else {
        repl.evaluate('');
      }
    } catch (e) {
      console.warn('Erreur stop repl:', e);
    }
  }
  isPlaying = false;
}

/**
 * Règle le volume général en temps réel (0.0 à 1.0)
 */
export function setMasterVolume(value) {
  const vol = Math.max(0, Math.min(1.5, parseFloat(value) || 0));
  window.masterGainValue = vol;
  if (masterGainNode && audioContext) {
    masterGainNode.gain.setTargetAtTime(vol, audioContext.currentTime, 0.015);
  }
}

/**
 * Règle la fréquence de coupure du filtre master (20 Hz à 20000 Hz)
 */
export function setMasterLPF(freq) {
  const f = Math.max(20, Math.min(20000, parseFloat(freq) || 20000));
  window.macroLPF = f;
  if (masterFilterNode && audioContext) {
    masterFilterNode.frequency.setTargetAtTime(f, audioContext.currentTime, 0.015);
  }
}

/**
 * Règle la résonance Q du filtre master (0.1 à 25)
 */
export function setMasterLPQ(q) {
  const resonance = Math.max(0.1, Math.min(25, parseFloat(q) || 1));
  window.macroLPQ = resonance;
  if (masterFilterNode && audioContext) {
    masterFilterNode.Q.setTargetAtTime(resonance, audioContext.currentTime, 0.015);
  }
}

/**
 * Règle la macro Room globale
 */
export function setMacroRoom(room) {
  window.macroRoom = parseFloat(room) || 0.5;
}

/**
 * Règle le tempo (BPM)
 */
export function setBpm(bpm) {
  currentBpm = parseInt(bpm, 10) || 128;
  if (repl && typeof repl.setCps === 'function') {
    repl.setCps(currentBpm / 60 / 4);
  } else if (repl && typeof repl.setcps === 'function') {
    repl.setcps(currentBpm / 60 / 4);
  }
}

export function getAudioContextInstance() {
  return audioContext;
}

export function getAnalyserNodeInstance() {
  return analyserNode;
}

export function getReplInstance() {
  return repl;
}

export function getIsPlaying() {
  return isPlaying;
}

export function getCurrentBpm() {
  return currentBpm;
}
