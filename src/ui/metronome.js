/**
 * metronome.js
 * Métronome visuel 4 temps synchronisé avec l'horloge audio (Strudel Cyclist & WebAudio).
 * Garanti sans dérive (remplace l'ancien setInterval).
 */

let lastActiveBeat = -1;
let animFrameId = null;

export function initMetronome({ getRepl, getAudioContext, getIsPlaying, getCurrentBpm }) {
  function tick() {
    animFrameId = requestAnimationFrame(tick);

    const isPlaying = typeof getIsPlaying === 'function' ? getIsPlaying() : false;
    if (!isPlaying) {
      if (lastActiveBeat !== -1) {
        clearDots();
        lastActiveBeat = -1;
      }
      return;
    }

    let currentBeat = 0;
    const repl = typeof getRepl === 'function' ? getRepl() : null;
    const audioContext = typeof getAudioContext === 'function' ? getAudioContext() : null;

    if (repl && repl.scheduler && typeof repl.scheduler.now === 'function') {
      // Synchronisation sur le cycle Strudel exact
      const cycle = repl.scheduler.now();
      currentBeat = Math.floor((((cycle % 1) + 1) % 1) * 4);
    } else if (audioContext) {
      // Fallback sur l'horloge WebAudio haute précision
      const bpm = typeof getCurrentBpm === 'function' ? getCurrentBpm() : 128;
      const beatDur = 60 / bpm;
      currentBeat = Math.floor(audioContext.currentTime / beatDur) % 4;
    }

    if (currentBeat !== lastActiveBeat) {
      lastActiveBeat = currentBeat;
      updateDots(currentBeat);
    }
  }

  tick();
}

function updateDots(activeBeat) {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) {
      if (i === activeBeat) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    }
  }
}

function clearDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) dot.classList.remove('active');
  }
}
