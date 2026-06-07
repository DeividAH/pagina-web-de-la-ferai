// ============================================================
// SOUNDS.JS — Sistema de sonidos con Web Audio API
// No necesita archivos externos — todo generado en código
// ============================================================

let audioCtx = null;
let soundEnabled = true;
let alarmInterval = null;

// Inicializar contexto de audio (requiere interacción del usuario)
function initAudio() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    console.log('🔊 Audio iniciado');
  } catch(e) {
    console.warn('Audio no disponible:', e.message);
    soundEnabled = false;
  }
}

// Función base para crear sonidos
function playTone(frequency, type, duration, volume = 0.3, delay = 0) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime + delay);

    gain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);

    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + duration);
  } catch(e) {}
}

// ============================================================
// SONIDOS DEL JUEGO
// ============================================================

// 🔔 Mensaje nuevo llegó — ping suave tipo notificación
function soundNewMessage() {
  if (!soundEnabled || !audioCtx) return;
  playTone(880, 'sine', 0.12, 0.15);
  playTone(1100, 'sine', 0.1, 0.1, 0.1);
}

// 🚨 DM urgente — ping más llamativo
function soundUrgentMessage() {
  if (!soundEnabled || !audioCtx) return;
  playTone(660, 'square', 0.08, 0.1);
  playTone(880, 'square', 0.08, 0.1, 0.1);
  playTone(1100, 'sine', 0.12, 0.15, 0.2);
}

// ✅ Bot detectado correctamente — sonido de éxito
function soundSuccess() {
  if (!soundEnabled || !audioCtx) return;
  playTone(523, 'sine', 0.1, 0.2);        // C5
  playTone(659, 'sine', 0.1, 0.2, 0.1);   // E5
  playTone(784, 'sine', 0.15, 0.25, 0.2); // G5
}

// 🎯 Combo — más eufórico
function soundCombo(comboLevel) {
  if (!soundEnabled || !audioCtx) return;
  const base = 400 + (comboLevel * 80);
  playTone(base, 'sine', 0.08, 0.2);
  playTone(base * 1.25, 'sine', 0.08, 0.2, 0.08);
  playTone(base * 1.5, 'sine', 0.12, 0.25, 0.16);
  if (comboLevel >= 3) {
    playTone(base * 2, 'sine', 0.15, 0.3, 0.25);
  }
}

// ❌ Daño recibido — sonido de error/impacto
function soundDamage() {
  if (!soundEnabled || !audioCtx) return;
  try {
    // Ruido de impacto con distorsión
    const bufferSize = audioCtx.sampleRate * 0.15;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    source.start();

    // Tono bajo de alarma
    playTone(150, 'sawtooth', 0.2, 0.3);
  } catch(e) {}
}

// ⏰ Mensaje expiró sin respuesta
function soundExpired() {
  if (!soundEnabled || !audioCtx) return;
  playTone(300, 'square', 0.08, 0.2);
  playTone(250, 'square', 0.1, 0.2, 0.1);
}

// ⚠️ Salud baja — beep de advertencia
function soundLowHealth() {
  if (!soundEnabled || !audioCtx) return;
  playTone(440, 'square', 0.06, 0.15);
  playTone(440, 'square', 0.06, 0.15, 0.15);
}

// ⏱️ Countdown final — últimos 10 segundos
function soundCountdown() {
  if (!soundEnabled || !audioCtx) return;
  playTone(880, 'square', 0.05, 0.2);
}

// 🏆 Victoria — fanfarria
function soundVictory() {
  if (!soundEnabled || !audioCtx) return;
  const notes = [
    [523, 0],    // C5
    [659, 0.15], // E5
    [784, 0.3],  // G5
    [1047, 0.5], // C6
    [784, 0.7],  // G5
    [1047, 0.9], // C6
  ];
  notes.forEach(([freq, delay]) => {
    playTone(freq, 'sine', 0.25, 0.3, delay);
  });
}

// 💀 Derrota — sonido descendente
function soundDefeat() {
  if (!soundEnabled || !audioCtx) return;
  const notes = [
    [440, 0],    // A4
    [370, 0.2],  // F#4
    [311, 0.4],  // Eb4
    [220, 0.65], // A3
  ];
  notes.forEach(([freq, delay]) => {
    playTone(freq, 'sawtooth', 0.3, 0.25, delay);
  });
}

// 🚨 Alarma continua de salud crítica
function startHealthAlarm() {
  if (alarmInterval) return;
  alarmInterval = setInterval(() => {
    if (gameState && gameState.health <= 30 && gameState.running) {
      soundLowHealth();
    } else {
      stopHealthAlarm();
    }
  }, 800);
}

function stopHealthAlarm() {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
}

// ============================================================
// BOTÓN MUTE — para silenciar durante presentaciones
// ============================================================
function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('mute-btn');
  if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';
  if (!soundEnabled) stopHealthAlarm();
  showToast(soundEnabled ? '🔊 Sonido activado' : '🔇 Sonido silenciado', 'neutral');
}

// Reanudar contexto si fue suspendido (política de autoplay)
function resumeAudio() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  if (!audioCtx) initAudio();
}
