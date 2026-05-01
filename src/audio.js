let ctx = null;
let muted = false;
let bgmInterval = null;
let bgmNoteIndex = 0;

const BGM_NOTES = [
  261.63, 329.63, 392.00, 523.25,
  392.00, 329.63, 261.63, 196.00,
  220.00, 277.18, 329.63, 440.00,
  329.63, 277.18, 220.00, 174.61,
];

export function initAudio() {
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    ctx = null;
  }
}

function resumeCtx() {
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

export function playSound(type) {
  if (!ctx || muted) return;
  resumeCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;

  if (type === 'jump') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.1);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'shoot') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(200, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'stomp') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.15);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
  } else if (type === 'hurt') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.3);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'collect') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(523, now);
    osc.frequency.setValueAtTime(659, now + 0.05);
    osc.frequency.setValueAtTime(784, now + 0.1);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
  } else if (type === 'key') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(523, now);
    osc.frequency.setValueAtTime(659, now + 0.08);
    osc.frequency.setValueAtTime(784, now + 0.16);
    osc.frequency.setValueAtTime(1047, now + 0.24);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === 'levelComplete') {
    osc.type = 'square';
    const notes = [523, 659, 784, 1047, 784, 1047];
    notes.forEach((f, i) => {
      osc.frequency.setValueAtTime(f, now + i * 0.1);
    });
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.7);
    osc.start(now);
    osc.stop(now + 0.7);
  }
}

export function startBGM() {
  if (!ctx || bgmInterval) return;
  resumeCtx();
  bgmNoteIndex = 0;
  bgmInterval = setInterval(() => {
    if (!ctx || muted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    const freq = BGM_NOTES[bgmNoteIndex % BGM_NOTES.length];
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.18);
    bgmNoteIndex++;
  }, 200);
}

export function stopBGM() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}

export function toggleMute() {
  muted = !muted;
  if (muted) {
    stopBGM();
  } else {
    startBGM();
  }
  return muted;
}

export function isMuted() {
  return muted;
}

export function updateMuteButton(muted) {
  const btn = document.getElementById('mute-btn');
  if (btn) btn.textContent = muted ? '🔇' : '🔊';
}
