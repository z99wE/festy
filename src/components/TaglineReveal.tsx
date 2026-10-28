import React, { useEffect, useRef, useState } from 'react';

interface TaglineRevealProps {
  reducedMotion: boolean;
}

interface WordItemProps {
  word: string;
  index: number;
  activeCount: number;
  reducedMotion: boolean;
}

const PrimaryWord: React.FC<WordItemProps> = ({ word, index, activeCount, reducedMotion }) => {
  const isLit = index < activeCount;
  const delay = reducedMotion ? '0ms' : `${(index % 4) * 25}ms`;
  return (
    <span
      className={`reveal-word ${isLit ? 'lit' : 'dim'}`}
      style={{ transitionDelay: delay }}
    >
      {word}{' '}
    </span>
  );
};

const SubWord: React.FC<{ word: string; isLit: boolean }> = ({ word, isLit }) => (
  <span className={`reveal-word-sub ${isLit ? 'lit' : 'dim'}`}>
    {word}{' '}
  </span>
);

export const TaglineReveal: React.FC<TaglineRevealProps> = ({ reducedMotion }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);

  const words = [
    "What", "if", "planning", "an", "event", "felt", "like", "discovering",
    "a", "great", "experience,", "rather", "than", "managing", "a", "stressful", "project?"
  ];

  const supportingWords = [
    "Festiya", "turns", "your", "celebration", "ideas", "into", "an", "editable",
    "budget,", "actionable", "milestones,", "and", "calm", "vendor", "clarity."
  ];

  useEffect(() => {
    if (reducedMotion) {
      setActiveWordIndex(words.length + supportingWords.length);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.15;
      const total = start - end;
      const current = start - rect.top;
      const progress = Math.min(Math.max(current / total, 0), 1);

      const totalWords = words.length + supportingWords.length;
      const activeCount = Math.floor(progress * (totalWords + 2));
      setActiveWordIndex(activeCount);
    };

    let ticking = false;
    const onTick = () => {
      handleScroll();
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onTick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    requestAnimationFrame(() => handleScroll());

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [reducedMotion, words.length, supportingWords.length]);

  return (
    <section className="tagline-reveal-section" ref={containerRef} aria-label="Core festival philosophy">
      <div className="content-wrapper">
        <div className="tagline-reveal-container">
          <p className="tagline-display-text" aria-live="polite">
            {words.map((word, index) => (
              <PrimaryWord
                key={`w1-${index}`}
                word={word}
                index={index}
                activeCount={activeWordIndex}
                reducedMotion={reducedMotion}
              />
            ))}
          </p>

          <div className="tagline-logo-wrap" aria-hidden="true">
            <img
              src="/festiya-logo.webp"
              alt="Festiya Logo"
              className="tagline-brand-logo"
              width="213"
              height="80"
              loading="lazy"
            />
          </div>

          <p className="tagline-sub-text">
            {supportingWords.map((word, index) => (
              <SubWord
                key={`w2-${index}`}
                word={word}
                isLit={words.length + index < activeWordIndex}
              />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};
