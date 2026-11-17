/**
 * visualizer.js
 * Visualisateur audio Canvas 60 FPS réactif (Oscilloscope + Spectre de fréquences).
 * Adapté dynamiquement aux variables CSS des thèmes utilisateur.
 */

let isRunning = false;

export function initVisualizer(canvas, { getAnalyser, getIsPlaying }) {
  if (!canvas || isRunning) return;
  isRunning = true;

  const ctx = canvas.getContext('2d');
  const bufferLength = 256;
  const timeData = new Uint8Array(bufferLength);
  const freqData = new Uint8Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);

    const w = canvas.width;
    const h = canvas.height;

    // Fond obscur accordé au thème
    ctx.fillStyle = 'rgba(7, 8, 12, 0.45)';
    ctx.fillRect(0, 0, w, h);

    // Couleurs dynamiques selon le thème actif
    const computed = getComputedStyle(document.body);
    const accentColor = computed.getPropertyValue('--accent').trim() || '#10b981';
    const primaryColor = computed.getPropertyValue('--primary').trim() || '#6366f1';

    const analyser = typeof getAnalyser === 'function' ? getAnalyser() : null;
    const isPlaying = typeof getIsPlaying === 'function' ? getIsPlaying() : false;

    let hasAudioSignal = false;

    if (analyser && isPlaying) {
      analyser.getByteTimeDomainData(timeData);
      analyser.getByteFrequencyData(freqData);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const diff = timeData[i] - 128;
        sum += diff * diff;
      }
      const rms = Math.sqrt(sum / bufferLength);
      hasAudioSignal = rms > 0.8;
    }

    // 1. Spectre de Fréquence en arrière-plan
    if (hasAudioSignal) {
      const barCount = 28;
      const barWidth = w / barCount;
      for (let i = 0; i < barCount; i++) {
        const val = freqData[i * 3] || 0;
        const barHeight = (val / 255.0) * (h * 0.65);
        ctx.fillStyle = primaryColor + '20'; // ~12% opacité
        ctx.fillRect(i * barWidth, h - barHeight, barWidth - 1, barHeight);
      }
    }

    // 2. Oscilloscope / Onde principale
    ctx.lineWidth = hasAudioSignal ? 2 : 1;
    ctx.strokeStyle = hasAudioSignal ? accentColor : '#334155';
    ctx.shadowBlur = hasAudioSignal ? 10 : 0;
    ctx.shadowColor = accentColor;

    ctx.beginPath();
    const sliceWidth = w / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let v = 128;
      if (hasAudioSignal) {
        v = timeData[i];
      } else {
        // Légère onde sinusoïdale de veille très discrète
        v = 128 + Math.sin(i * 0.05 + performance.now() * 0.002) * 2;
      }

      const y = (v / 255.0) * h;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(w, h / 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  draw();
}
