// ==========================================================================
// FLORES AMARILLAS - INTERACCIÓN REALISTA Y ULTRA OPTIMIZADA (60+ FPS)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const sceneContainer = document.querySelector('.scene-container');
  const flowersCard = document.getElementById('flowersCard');
  const envelope = document.getElementById('envelope');
  const btnCloseLetter = document.getElementById('btnCloseLetter');
  const btnReset = document.getElementById('btnReset');
  const instructionText = document.getElementById('instructionText');

  // Letter Elements
  const letterSalutation = document.getElementById('letterSalutation');
  const letterText = document.getElementById('letterText');
  const letterFarewell = document.getElementById('letterFarewell');
  const letterSignature = document.getElementById('letterSignature');

  // State
  let currentState = 'flowers'; // 'flowers' | 'envelope' | 'reading'
  let audioCtx = null;

  // ==========================================================================
  // REALISTIC SYNTHESIZED SOUND (Ultra Lightweight Web Audio API)
  // ==========================================================================
  function playPaperRustle() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Fast, lightweight 200ms noise burst
      const sampleRate = audioCtx.sampleRate;
      const bufferSize = Math.floor(sampleRate * 0.22);
      const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.08));
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400;
      filter.Q.value = 1.3;

      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.16, audioCtx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.21);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      whiteNoise.start();
    } catch (e) {
      // Audio is non-blocking enhancement
    }
  }

  // ==========================================================================
  // STATE TRANSITIONS (SNAPPY & HARDWARE ACCELERATED)
  // ==========================================================================

  // Step 1: Click flowers -> Reveals envelope
  function revealEnvelope() {
    if (currentState !== 'flowers') return;
    currentState = 'envelope';
    sceneContainer.classList.add('state-envelope');
    instructionText.textContent = 'Toca el sobre para abrirlo';
  }

  // Step 2: Click envelope -> Opens flap and letter smoothly glides out
  function openEnvelope() {
    if (currentState !== 'envelope') return;
    currentState = 'reading';

    playPaperRustle();

    // 1. Open envelope flap
    envelope.classList.add('is-open');
    instructionText.textContent = 'Abriendo tu carta...';

    // 2. Expand letter to full reading view with snappy timing
    setTimeout(() => {
      sceneContainer.classList.add('state-letter-reading');
      playPaperRustle();
    }, 220);
  }

  // Close letter (fold back into envelope)
  function closeLetter() {
    if (currentState !== 'reading') return;
    currentState = 'envelope';
    playPaperRustle();
    sceneContainer.classList.remove('state-letter-reading');

    setTimeout(() => {
      envelope.classList.remove('is-open');
      instructionText.textContent = 'Toca el sobre para abrirlo de nuevo';
    }, 260);
  }

  // Reset entirely to flowers
  function resetToFlowers() {
    currentState = 'flowers';
    sceneContainer.classList.remove('state-letter-reading', 'state-envelope');
    envelope.classList.remove('is-open');
    instructionText.textContent = 'Toca el ramo de flores';
  }

  // ==========================================================================
  // EVENT LISTENERS
  // ==========================================================================

  // Flowers click & keyboard
  flowersCard.addEventListener('click', revealEnvelope);
  flowersCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      revealEnvelope();
    }
  });

  // Envelope click & keyboard
  envelope.addEventListener('click', (e) => {
    if (e.target.closest('.btn-action')) return;
    if (currentState === 'envelope') {
      openEnvelope();
    }
  });

  envelope.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && currentState === 'envelope') {
      e.preventDefault();
      openEnvelope();
    }
  });

  // Letter controls
  btnCloseLetter.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLetter();
  });

  btnReset.addEventListener('click', () => {
    resetToFlowers();
  });

  // Escape key closes reading view
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentState === 'reading') {
      closeLetter();
    }
  });

  // ==========================================================================
  // DEDICATION PERSISTENCE (Optional fallback)
  // ==========================================================================
  const STORAGE_KEY = 'flores_amarillas_dedicatoria';

  function loadSavedDedication() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.salutation) letterSalutation.textContent = data.salutation;
        if (data.farewell) letterFarewell.textContent = data.farewell;
        if (data.signature) letterSignature.textContent = data.signature;
        if (data.text) {
          letterText.innerHTML = data.text
            .split('\n\n')
            .filter(p => p.trim())
            .map(p => `<p>${escapeHTML(p)}</p>`)
            .join('');
        }
      }
    } catch (e) {}
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Initial load
  loadSavedDedication();
});
