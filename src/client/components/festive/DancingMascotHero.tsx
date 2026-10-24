import React, { useState, useEffect } from "react";
import { Sparkles, Music, Play, Pause } from "lucide-react";

interface DanceFrame {
  id: number;
  src: string;
  name: string;
  move: string;
  color: string;
}

const DANCE_FRAMES: DanceFrame[] = [
  {
    id: 1,
    src: "/mascots/dance-1.png",
    name: "Fluffy Pink Groove",
    move: "Spin & Shimmer ✨",
    color: "#FF3366",
  },
  {
    id: 2,
    src: "/mascots/dance-2.png",
    name: "Cheerful Yellow Bounce",
    move: "Sunshine Jump ☀️",
    color: "#FFD026",
  },
  {
    id: 3,
    src: "/mascots/dance-3.png",
    name: "Blue Fuzzy Leap",
    move: "High Kick Jump ⚡",
    color: "#2D68FF",
  },
  {
    id: 4,
    src: "/mascots/dance-4.png",
    name: "Bubble Mint Glide",
    move: "Plush Wobble 🍃",
    color: "#00E599",
  },
  {
    id: 5,
    src: "/mascots/dance-5.png",
    name: "Pink F-Hero Finale",
    move: "Celebration Pop 🎉",
    color: "#F26207",
  },
];

export const DancingMascotHero: React.FC = () => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMs, setSpeedMs] = useState(280);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % DANCE_FRAMES.length);
    }, speedMs);
    return () => clearInterval(interval);
  }, [isPlaying, speedMs]);

  const currentFrame = DANCE_FRAMES[currentFrameIndex];

  return (
    <div className="dance-hero-showcase">
      {/* Central Animated Looping Frame Player (Simulated GIF Dance) */}
      <div className="dance-gif-container">
        {/* Animated Speech Bubble */}
        <div
          className="mascot-speech-bubble"
          style={{
            marginBottom: "14px",
            background: "#FFFFFF",
            borderColor: "#000000",
            color: "#000000",
          }}
        >
          <span>🎵 {currentFrame.move}</span>
        </div>

        {/* The Looping Dancing Mascot Frame */}
        <div style={{ position: "relative", width: "140px", height: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src={currentFrame.src}
            alt={`${currentFrame.name} dancing loop frame`}
            className="dance-gif-mascot"
            onClick={() => setCurrentFrameIndex((prev) => (prev + 1) % DANCE_FRAMES.length)}
          />
        </div>

        {/* Dance Plinth & Beat Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "12px",
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            color: "var(--ink-secondary)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--replit-orange)" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--replit-orange)", display: "inline-block" }} />
            DANCE LOOP: FRAME {currentFrameIndex + 1}/{DANCE_FRAMES.length}
          </span>
          <span>•</span>
          <button
            type="button"
            aria-label={isPlaying ? "Pause dance loop" : "Resume dance loop"}
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: "transparent",
              border: "none",
              color: "#FFFFFF",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 6px",
              borderRadius: "2px",
            }}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? "PAUSE" : "DANCE"}</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Dance Troupe Lineup Strip */}
      <div
        className="dance-lineup-row"
        role="region"
        aria-label="Dancing Mascot Crew Lineup"
      >
        <span
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: "11px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--replit-orange)",
            marginBottom: "4px",
          }}
        >
          ★ FESTIYA DANCE CREW • SYNCHRONIZED CELEBRATION ★
        </span>

        {DANCE_FRAMES.map((dancer, idx) => {
          const isActive = idx === currentFrameIndex;
          return (
            <div
              key={dancer.id}
              role="button"
              tabIndex={0}
              aria-label={`Select ${dancer.name} as active lead dancer`}
              onClick={() => setCurrentFrameIndex(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setCurrentFrameIndex(idx);
                }
              }}
              className={`dance-lineup-card ${isActive ? "active-dancer" : ""}`}
              style={{
                borderColor: isActive ? dancer.color : undefined,
              }}
            >
              <img
                src={dancer.src}
                alt={dancer.name}
                className="dance-lineup-img"
              />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: isActive ? dancer.color : "var(--ink-secondary)",
                }}
              >
                {dancer.name.split(" ")[1] || dancer.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
