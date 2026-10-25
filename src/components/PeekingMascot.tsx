import React, { useEffect, useState, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { playPopSound } from '../utils/audio';

type MascotColor = 'mint' | 'blue' | 'yellow' | 'orange';
type PeekPosition = 'left-side' | 'top-right-upside-down' | 'right-side';

interface MascotConfig {
  name: string;
  headSrc: string;
  blinkSrc: string;
}

const MASCOTS: Record<MascotColor, MascotConfig> = {
  mint: {
    name: 'Bubble Mint Mascot',
    headSrc: '/mascots/mint-head.webp',
    blinkSrc: '/mascots/mint-blink.webp',
  },
  blue: {
    name: 'Cheerful Blue Fuzzy Mascot',
    headSrc: '/mascots/blue-head.webp',
    blinkSrc: '/mascots/blue-blink.webp',
  },
  yellow: {
    name: 'Fluffy Yellow Mascot',
    headSrc: '/mascots/yellow-head.webp',
    blinkSrc: '/mascots/yellow-blink.webp',
  },
  orange: {
    name: 'Fluffy Orange Mascot',
    headSrc: '/mascots/orange-head.webp',
    blinkSrc: '/mascots/orange-blink.webp',
  },
};

const COLOR_KEYS: MascotColor[] = ['mint', 'blue', 'yellow', 'orange'];

interface ActivePeek {
  color: MascotColor;
  position: PeekPosition;
  isBlinking: boolean;
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

  // Preload all mascot assets on mount
  useEffect(() => {
    COLOR_KEYS.forEach((color) => {
      const headImg = new Image();
      headImg.src = MASCOTS[color].headSrc;
      const blinkImg = new Image();
      blinkImg.src = MASCOTS[color].blinkSrc;
    });
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

    // Determine position:
    // 1st peek: left-side peek
    // 2nd peek: extreme top right upside-down peek (as requested)
    // 3rd peek: right-side or left-side peek
    let chosenPos: PeekPosition = 'left-side';
    if (currentCount === 2) {
      chosenPos = 'top-right-upside-down';
    } else if (currentCount === 3) {
      chosenPos = Math.random() > 0.5 ? 'right-side' : 'left-side';
    }

    // Set mascot active (peek in)
    setActivePeek({
      color: chosenColor,
      position: chosenPos,
      isBlinking: false,
      isRetreating: false,
    });

    // Schedule alive blinking sequence during the ~3.8s appearance
    // Blink 1: at 1.1s
    const b1On = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isBlinking: true } : null));
    }, 1100);

    const b1Off = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isBlinking: false } : null));
    }, 1250);

    // Double Blink 2: at 2.4s
    const b2On = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isBlinking: true } : null));
    }, 2400);

    const b2Off = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isBlinking: false } : null));
    }, 2510);

    const b3On = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isBlinking: true } : null));
    }, 2630);

    const b3Off = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isBlinking: false } : null));
    }, 2750);

    // Start retreat at 3.8s
    const retreatTimer = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isRetreating: true } : null));
    }, 3800);

    // Unmount at 4.4s (after slide-out transition completes)
    const endTimer = setTimeout(() => {
      setActivePeek(null);

      // Schedule subsequent peek if under limit
      if (peeksCountRef.current < 3) {
        const nextDelay = peeksCountRef.current === 1 ? 19000 : 36000;
        const nextTimer = setTimeout(triggerPeek, nextDelay);
        timeoutsRef.current.push(nextTimer);
      }
    }, 4450);

    timeoutsRef.current.push(b1On, b1Off, b2On, b2Off, b3On, b3Off, retreatTimer, endTimer);
  }, []);

  // Launch initial peek after initial 4.8 seconds
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const initialTimer = setTimeout(() => {
      triggerPeek();
    }, 4800);

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
      particleCount: 16,
      spread: 45,
      origin: { x, y },
      colors: ['#FF5E1E', '#FFB800', '#2DD4BF', '#A78BFA', '#FFFFFF'],
      disableForReducedMotion: true,
    });

    // Gently retreat immediately on click
    setActivePeek((prev) => (prev ? { ...prev, isRetreating: true } : null));
    const hideTimer = setTimeout(() => {
      setActivePeek(null);
    }, 500);
    timeoutsRef.current.push(hideTimer);
  };

  if (!activePeek) return null;

  const currentMascot = MASCOTS[activePeek.color];
  const imgSrc = activePeek.isBlinking ? currentMascot.blinkSrc : currentMascot.headSrc;

  return (
    <div
      className="peeking-mascot-portal"
      aria-hidden="true"
    >
      <div
        className={`peeking-mascot-container pos-${activePeek.position} ${
          activePeek.isRetreating ? 'retreating' : 'peeking'
        }`}
        onClick={handleMascotClick}
        title="Say hi to our mascot!"
      >
        <div className="peeking-mascot-3d-wrap">
          <img
            src={imgSrc}
            alt={currentMascot.name}
            className="peeking-mascot-img"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};
