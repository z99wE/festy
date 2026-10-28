import React, { useEffect, useState, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { playPopSound } from '../utils/audio';

type MascotColor = 'mint' | 'blue' | 'yellow' | 'orange';
type PeekPosition = 'top-upside-down' | 'bottom-upright';

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

    let chosenPos: PeekPosition = 'bottom-upright';
    let hOffset = 'right: 18%';

    if (currentCount === 1) {
      chosenPos = 'bottom-upright';
      hOffset = 'right: 18%';
    } else if (currentCount === 2) {
      chosenPos = 'bottom-upright';
      hOffset = 'left: 18%';
    } else {
      chosenPos = 'bottom-upright';
      hOffset = 'right: 30%';
    }

    // Set mascot active (peek in)
    setActivePeek({
      color: chosenColor,
      position: chosenPos,
      horizontalOffset: hOffset,
      isRetreating: false,
    });

    // Start retreat at 6.2s (smooth CSS transition out)
    const retreatTimer = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isRetreating: true } : null));
    }, 6200);

    // Unmount at 6.85s (after slide-out transition completes)
    const endTimer = setTimeout(() => {
      setActivePeek(null);

      // Schedule subsequent peek if under session cap
      if (peeksCountRef.current < 3) {
        const nextDelay = peeksCountRef.current === 1 ? 25000 : 40000;
        const nextTimer = setTimeout(triggerPeek, nextDelay);
        timeoutsRef.current.push(nextTimer);
      }
    }, 6850);

    timeoutsRef.current.push(retreatTimer, endTimer);
  }, []);

  // Launch initial peek after 18 seconds (zero interference with initial render benchmarks)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const initialTimer = setTimeout(() => {
      triggerPeek();
    }, 18000);

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
      particleCount: 20,
      spread: 50,
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
    <div className="peeking-mascot-portal" aria-hidden="true">
      <div
        className={`peeking-mascot-container pos-${activePeek.position} ${
          activePeek.isRetreating ? 'retreating' : 'peeking'
        }`}
        style={styleObj}
        onClick={handleMascotClick}
      >
        <div className="peeking-mascot-3d-wrap" style={{ position: 'relative' }}>
          <img
            src={currentMascot.headSrc}
            alt={currentMascot.name}
            className="peeking-mascot-img peeking-mascot-head"
            draggable={false}
            width={240}
            height={156}
          />
          <img
            src={currentMascot.blinkSrc}
            alt=""
            className="peeking-mascot-img peeking-mascot-blink"
            draggable={false}
            width={240}
            height={156}
          />
        </div>
      </div>
    </div>
  );
};
