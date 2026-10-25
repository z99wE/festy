import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  X,
  Accessibility,
  Check,
} from 'lucide-react';
import { playPopSound } from '../utils/audio';

interface AccessibilityToolbarProps {
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  textSize: 'normal' | 'large';
  onToggleTextSize: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  is3DPaused: boolean;
  onToggle3DPause: () => void;
  scrollProgress: number;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  reducedMotion,
  onToggleReducedMotion,
  highContrast,
  onToggleHighContrast,
  textSize,
  onToggleTextSize,
  soundEnabled,
  onToggleSound,
  is3DPaused,
  onToggle3DPause,
  scrollProgress,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      playPopSound(soundEnabled);
    }
  };

  return (
    <>
      {/* Top Sticky Scroll HUD */}
      <div className="scroll-hud-bar" role="region" aria-label="Page navigation and 3D status">
        <div className="content-wrapper">
          <div className="scroll-hud-inner">
            {/* Milestone jumps */}
            <nav className="scroll-milestone-track" aria-label="Page milestones">
              <button
                type="button"
                className={`milestone-node ${scrollProgress < 0.2 ? 'active' : ''}`}
                onClick={() => scrollToSection('hero')}
              >
                <span className="milestone-dot" />
                <span>Overview</span>
              </button>
              <button
                type="button"
                className={`milestone-node ${scrollProgress >= 0.2 && scrollProgress < 0.45 ? 'active' : ''}`}
                onClick={() => scrollToSection('how-it-works')}
              >
                <span className="milestone-dot" />
                <span>The Journey</span>
              </button>
              <button
                type="button"
                className={`milestone-node ${scrollProgress >= 0.45 && scrollProgress < 0.75 ? 'active' : ''}`}
                onClick={() => scrollToSection('interactive-planner')}
              >
                <span className="milestone-dot" />
                <span>Live Planner</span>
              </button>
              <button
                type="button"
                className={`milestone-node ${scrollProgress >= 0.75 ? 'active' : ''}`}
                onClick={() => scrollToSection('categories')}
              >
                <span className="milestone-dot" />
                <span>Categories</span>
              </button>
            </nav>

            {/* Quick 3D HUD Tools */}
            <div className="hud-tools">
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={onToggle3DPause}
                title={is3DPaused ? 'Resume 3D Background' : 'Pause 3D Background'}
                aria-label={is3DPaused ? 'Resume 3D Background Animation' : 'Pause 3D Background Animation'}
              >
                {is3DPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={onToggleSound}
                title={soundEnabled ? 'Mute Celebration Chimes' : 'Enable Celebration Chimes'}
                aria-label={soundEnabled ? 'Mute Celebration Chimes' : 'Enable Celebration Chimes'}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                onClick={() => setIsOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
              >
                <Accessibility size={16} />
                <span>Accessibility</span>
              </button>
            </div>
          </div>

          {/* Progress fill bar */}
          <div
            className="scroll-progress-fill-bar"
            role="progressbar"
            aria-valuenow={Math.round(scrollProgress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Scroll progression through festival experience"
            style={{ marginTop: '6px' }}
          >
            <div className="scroll-progress-fill" style={{ width: `${Math.round(scrollProgress * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Floating A11y Trigger for direct access */}
      <button
        type="button"
        className="a11y-floating-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Open Accessibility & Experience Settings Dialog"
      >
        <Accessibility size={20} aria-hidden="true" />
        <span>Accessibility & 3D</span>
      </button>

      {/* Accessibility & Experience Preferences Modal */}
      {isOpen && (
        <div
          className="a11y-modal-backdrop"
          onClick={() => setIsOpen(false)}
          role="presentation"
        >
          <div
            className="a11y-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="a11y-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Accessibility size={24} color="var(--orange-500)" />
                <h3 id="a11y-dialog-title" style={{ fontSize: '1.4rem' }}>
                  Accessibility & Experiential Controls
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility dialog"
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Festiya is built to be joyful, warm, and 100% accessible to everyone. Customize your sensory
              and motion preferences below:
            </p>

            {/* Calm Mode / Reduced Motion */}
            <div className="a11y-toggle-row">
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Calm Mode (Reduced Motion)</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Halts rapid 3D camera travel, tilt, and particle swirling for motion sensitivity.
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={onToggleReducedMotion}
                  aria-label="Toggle Calm Mode (Reduced Motion)"
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* High Contrast Mode */}
            <div className="a11y-toggle-row">
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>High Contrast Palette (WCAG AAA)</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Deepens typography to maximum espresso ink and strengthens all card borders.
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={onToggleHighContrast}
                  aria-label="Toggle High Contrast Mode"
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* Text Scaling */}
            <div className="a11y-toggle-row">
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Enlarged Typography</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Increases base font size by 15% across all headings and interactive forms.
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={textSize === 'large'}
                  onChange={onToggleTextSize}
                  aria-label="Toggle Enlarged Typography"
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* Sound Feedback */}
            <div className="a11y-toggle-row">
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Celebration Audio Chimes</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Gentle synthesized pentatonic chords when milestones are completed.
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={onToggleSound}
                  aria-label="Toggle Celebration Audio Chimes"
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* 3D WebGL Background Pause */}
            <div className="a11y-toggle-row" style={{ borderBottom: 'none' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Pause 3D WebGL Canvas</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Freezes the WebGL rendering loop to conserve battery or focus purely on text.
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={is3DPaused}
                  onChange={onToggle3DPause}
                  aria-label="Toggle 3D Canvas Pause"
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsOpen(false)}
              >
                <Check size={16} />
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
