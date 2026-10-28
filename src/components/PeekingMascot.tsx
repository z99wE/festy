import React, { useEffect, useState, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { playPopSound } from '../utils/audio';

type MascotColor = 'mint' | 'blue' | 'yellow' | 'pink';

interface MascotConfig {
  name: string;
  src: string;
}

const MASCOTS: Record<MascotColor, MascotConfig> = {
  mint: {
    name: 'Festiya Celebration Mascot - Mint Plush Character cheering on event planning',
    src: '/mascots/bubble-mint.webp',
  },
  blue: {
    name: 'Festiya Celebration Mascot - Cheerful Blue Fuzzy Character jumping for festival milestones',
    src: '/mascots/blue-jumping.webp',
  },
  yellow: {
    name: 'Festiya Celebration Mascot - Fluffy Yellow Dance Character celebrating birthdays and galas',
    src: '/mascots/yellow-dance.webp',
  },
  pink: {
    name: 'Festiya Celebration Mascot - Fluffy Pink Dancing Character dancing for wedding receptions',
    src: '/mascots/pink-dancing.webp',
  },
};

const COLOR_KEYS: MascotColor[] = ['mint', 'blue', 'yellow', 'pink'];

interface ActivePeek {
  color: MascotColor;
  horizontalOffset: string;
  isRetreating: boolean;
}

export const PeekingMascot: React.FC = () => {
  const [activePeek, setActivePeek] = useState<ActivePeek | null>(null);
  const peeksCountRef = useRef<number>(0);
  const lastColorRef = useRef<MascotColor | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear all pending timers on unmount
  const clearAllTimers = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const triggerPeek = useCallback(() => {
    // Strictly cap at max 3 times per page session
    if (peeksCountRef.current >= 3) return;

    peeksCountRef.current += 1;
    const currentCount = peeksCountRef.current;

    // Pick a different color mascot from previous
    const availableColors = COLOR_KEYS.filter((c) => c !== lastColorRef.current);
    const chosenColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    lastColorRef.current = chosenColor;

    let hOffset = 'right: 15%';
    if (currentCount === 1) {
      hOffset = 'right: 15%';
    } else if (currentCount === 2) {
      hOffset = 'left: 15%';
    } else {
      hOffset = 'right: 28%';
    }

    // Set mascot active (peek in)
    setActivePeek({
      color: chosenColor,
      horizontalOffset: hOffset,
      isRetreating: false,
    });

    // Start retreat at 6.0s (smooth CSS transition out)
    const retreatTimer = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isRetreating: true } : null));
    }, 6000);

    // Unmount at 6.7s (after slide-out transition completes)
    const endTimer = setTimeout(() => {
      setActivePeek(null);

      // Schedule subsequent peek if under session cap
      if (peeksCountRef.current < 3) {
        const nextDelay = peeksCountRef.current === 1 ? 22000 : 35000;
        const nextTimer = setTimeout(triggerPeek, nextDelay);
        timeoutsRef.current.push(nextTimer);
      }
    }, 6700);

    timeoutsRef.current.push(retreatTimer, endTimer);
  }, []);

  // Launch initial peek after 5 seconds
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const initialTimer = setTimeout(() => {
      triggerPeek();
    }, 5000);

    timeoutsRef.current.push(initialTimer);

    return () => {
      clearAllTimers();
    };
  }, [triggerPeek, clearAllTimers]);

  // Handle playful click on mascot
  const handleMascotClick = (e: React.MouseEvent) => {
    playPopSound(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 22,
      spread: 55,
      origin: { x, y },
      colors: ['#FF5E1E', '#FFB800', '#2DD4BF', '#A78BFA', '#FFFFFF'],
      disableForReducedMotion: true,
    });

    // Gently retreat immediately on click
    setActivePeek((prev) => (prev ? { ...prev, isRetreating: true } : null));
    const hideTimer = setTimeout(() => {
      setActivePeek(null);
    }, 550);
    timeoutsRef.current.push(hideTimer);
  };

  if (!activePeek) return null;

  const currentMascot = MASCOTS[activePeek.color];

  // Split horizontalOffset into style object
  const styleObj: React.CSSProperties = {};
  if (activePeek.horizontalOffset.startsWith('left:')) {
    styleObj.left = activePeek.horizontalOffset.replace('left:', '').trim();
  } else {
    styleObj.right = activePeek.horizontalOffset.replace('right:', '').trim();
  }

  return (
    <div className="peeking-mascot-portal" role="region" aria-label="Festiya Celebratory Mascot Peek">
      <div
        className={`peeking-mascot-container ${
          activePeek.isRetreating ? 'retreating' : 'peeking'
        }`}
        style={styleObj}
        onClick={handleMascotClick}
      >
        <div className="peeking-mascot-wrap">
          <img
            src={currentMascot.src}
            alt={currentMascot.name}
            title={currentMascot.name}
            className="peeking-mascot-img"
            draggable={false}
            width={220}
            height={247}
          />
        </div>
      </div>
    </div>
  );
};
