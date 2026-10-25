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

  // Preload mascot assets on mount
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
    // 1st: Bottom of page peeking up
    // 2nd: Top of page peeking down upside down
    // 3rd: Alternated bottom/top
    let chosenPos: PeekPosition = 'bottom-upright';
    let hOffset = 'right: 18%';

    if (currentCount === 1) {
      chosenPos = 'bottom-upright';
      hOffset = 'right: 18%';
    } else if (currentCount === 2) {
      chosenPos = 'top-upside-down';
      hOffset = 'right: 22%';
    } else {
      chosenPos = Math.random() > 0.5 ? 'bottom-upright' : 'top-upside-down';
      hOffset = chosenPos === 'bottom-upright' ? 'left: 20%' : 'left: 26%';
    }

    // Set mascot active (peek in)
    setActivePeek({
      color: chosenColor,
      position: chosenPos,
      horizontalOffset: hOffset,
      isBlinking: false,
      isRetreating: false,
    });

    // Schedule alive blinking sequence during the ~6.2s appearance
    // Blink 1: at 1.4s
    const b1On = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isBlinking: true } : null));
    }, 1400);

    const b1Off = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isBlinking: false } : null));
    }, 1560);

    // Playful Double Blink 2: at 3.2s
    const b2On = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isBlinking: true } : null));
    }, 3200);

    const b2Off = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isBlinking: false } : null));
    }, 3320);

    const b3On = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isBlinking: true } : null));
    }, 3460);

    const b3Off = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isBlinking: false } : null));
    }, 3580);

    // Blink 3: at 4.9s
    const b4On = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isBlinking: true } : null));
    }, 4900);

    const b4Off = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isBlinking: false } : null));
    }, 5050);

    // Start retreat at 6.2s (plenty of time to register and admire)
    const retreatTimer = setTimeout(() => {
      setActivePeek((prev) => (prev ? { ...prev, isRetreating: true } : null));
    }, 6200);

    // Unmount at 6.85s (after slide-out transition completes)
    const endTimer = setTimeout(() => {
      setActivePeek(null);

      // Schedule subsequent peek if under limit
      if (peeksCountRef.current < 3) {
        const nextDelay = peeksCountRef.current === 1 ? 20000 : 38000;
        const nextTimer = setTimeout(triggerPeek, nextDelay);
        timeoutsRef.current.push(nextTimer);
      }
    }, 6850);

    timeoutsRef.current.push(
      b1On,
      b1Off,
      b2On,
      b2Off,
      b3On,
      b3Off,
      b4On,
      b4Off,
      retreatTimer,
      endTimer
    );
  }, []);

  // Launch initial peek after initial 4.5 seconds
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const initialTimer = setTimeout(() => {
      triggerPeek();
    }, 4500);

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
  const imgSrc = activePeek.isBlinking ? currentMascot.blinkSrc : currentMascot.headSrc;

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
