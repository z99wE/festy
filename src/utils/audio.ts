// Web Audio API Synthesizer for cheerful, accessible milestone feedback
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCelebrationSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Cheerful ascending arpeggio (C5, E5, G5, C6)
  const notes = [523.25, 659.25, 783.99, 1046.50];

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle'; // Warm, friendly chime
    osc.frequency.setValueAtTime(freq, now + index * 0.08);

    gain.gain.setValueAtTime(0.001, now + index * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.15, now + index * 0.08 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.08);
    osc.stop(now + index * 0.08 + 0.36);
  });
}

export function playPopSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}
