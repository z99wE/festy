import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
  reducedMotion?: boolean;
}

const LOADING_MESSAGES = [
  'Preparing your celebration workspace...',
  'Curating event inspiration...',
  'Structuring budget clarity...',
  'Organizing vendor checklists...',
  'Your celebration plan is ready!',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  reducedMotion = false,
}) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const totalDuration = reducedMotion ? 1000 : 2000;
    const intervalTime = 40;
    const increment = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (progress < 25) setMessageIndex(0);
    else if (progress < 50) setMessageIndex(1);
    else if (progress < 75) setMessageIndex(2);
    else if (progress < 95) setMessageIndex(3);
    else setMessageIndex(4);
  }, [progress]);

  useEffect(() => {
    if (progress >= 100) {
      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(true);
      }, 250);

      const completeTimeout = setTimeout(() => {
        onComplete();
      }, 700);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(completeTimeout);
      };
    }
  }, [progress, onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={`festiya-loading-overlay ${isFadingOut ? 'fade-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Festiya is loading your celebration experience"
    >
      <div className="loading-card">
        {/* Festive Brand Header */}
        <div className="loading-brand">
          <img
            src="/festiya-logo-nav.webp"
            alt="Festiya"
            className="loading-brand-logo"
            width={96}
            height={36}
          />
        </div>

        {/* Dancing Mascot Spotlight */}
        <div className="loading-mascot-stage">
          <div className="dancing-mascot-wrapper">
            <img
              src="/mascots/pink-dancing.webp"
              alt="Festive mascot dancing"
              className="dancing-mascot-img"
              width={160}
              height={160}
            />
            <div className="mascot-dance-shadow" aria-hidden="true" />
          </div>
        </div>

        {/* Status Text (No distracting eyebrow tags) */}
        <div className="loading-caption-area">
          <h2 className="loading-status-text">
            {LOADING_MESSAGES[messageIndex]}
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="loading-progress-container">
          <div className="loading-progress-track">
            <div
              className="loading-progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="loading-progress-meta">
            <span className="loading-percentage">{Math.round(progress)}%</span>
            <span className="loading-tagline">Turn every moment into a festival</span>
          </div>
        </div>

        {/* Skip button */}
        <button
          type="button"
          onClick={handleSkip}
          className="loading-skip-btn"
          aria-label="Enter immediately"
        >
          <span>Enter now</span>
          <Sparkles size={13} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
