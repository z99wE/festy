import React, { useEffect, useRef, useState } from 'react';

interface TaglineRevealProps {
  reducedMotion: boolean;
}

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
      
      // Calculate how far through the reveal section the user has scrolled
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.15;
      const total = start - end;
      const current = start - rect.top;
      const progress = Math.min(Math.max(current / total, 0), 1);

      const totalWords = words.length + supportingWords.length;
      const activeCount = Math.floor(progress * (totalWords + 2));
      setActiveWordIndex(activeCount);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion, words.length, supportingWords.length]);

  return (
    <section className="tagline-reveal-section" ref={containerRef} aria-label="Core festival philosophy">
      <div className="content-wrapper">
        <div className="tagline-reveal-container">
          <p className="tagline-display-text" aria-live="polite">
            {words.map((word, index) => {
              const isLit = index < activeWordIndex;
              return (
                <span
                  key={`w1-${index}`}
                  className={`reveal-word ${isLit ? 'lit' : 'dim'}`}
                  style={{
                    transitionDelay: reducedMotion ? '0ms' : `${(index % 4) * 25}ms`,
                  }}
                >
                  {word}{' '}
                </span>
              );
            })}
          </p>

          <p className="tagline-sub-text">
            {supportingWords.map((word, index) => {
              const globalIndex = words.length + index;
              const isLit = globalIndex < activeWordIndex;
              return (
                <span
                  key={`w2-${index}`}
                  className={`reveal-word-sub ${isLit ? 'lit' : 'dim'}`}
                >
                  {word}{' '}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
};
