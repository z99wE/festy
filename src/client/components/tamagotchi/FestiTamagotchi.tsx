import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Music, DollarSign, X, Minimize2, Maximize2 } from "lucide-react";

export interface TamagotchiStats {
  hype: number;
  vibe: number;
  snacks: number;
  hearts: number;
  mood: "vibing" | "eating" | "dancing" | "budgetGuru" | "sleepy";
  message: string;
}

const GENZ_RESPONSES = [
  "Bestie, the budget cushion is serving financial literacy! 💅",
  "Vibe check: 10/10, no notes, strictly main character energy ✨",
  "Run-of-show is locked. Zero spreadsheet tears on my watch! 🦊",
  "Drop the bass! The guest list is pure FOMO 🔥",
  "Confirmed vendors looking iconic. We are so back! 💎",
  "Festi approved! Keep the hype alive and hydrate 🧋",
];

export const FestiTamagotchi: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [stats, setStats] = useState<TamagotchiStats>(() => {
    try {
      const saved = localStorage.getItem("festi_tamagotchi");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      hype: 92,
      vibe: 96,
      snacks: 80,
      hearts: 14,
      mood: "vibing",
      message: "Hii! I'm Festi, your festival Tamagotchi! 🦊✨",
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem("festi_tamagotchi", JSON.stringify(stats));
    } catch {
      // storage quota or private mode
    }
  }, [stats]);

  const handleFeed = () => {
    setStats((prev) => ({
      ...prev,
      snacks: Math.min(100, prev.snacks + 15),
      hearts: prev.hearts + 1,
      mood: "eating",
      message: "Nom nom! Match boba fueled. Energy restored! 🍬🧋",
    }));
    setTimeout(() => {
      setStats((prev) => ({ ...prev, mood: "vibing" }));
    }, 2500);
  };

  const handleDance = () => {
    setStats((prev) => ({
      ...prev,
      hype: Math.min(100, prev.hype + 10),
      hearts: prev.hearts + 2,
      mood: "dancing",
      message: "DJ Festi in the mix! Bass boosted & crowd hyped! 🎧🔥",
    }));
    setTimeout(() => {
      setStats((prev) => ({ ...prev, mood: "vibing" }));
    }, 2500);
  };

  const handleVibeCheck = () => {
    const randomMsg = GENZ_RESPONSES[Math.floor(Math.random() * GENZ_RESPONSES.length)];
    setStats((prev) => ({
      ...prev,
      vibe: Math.min(100, prev.vibe + 8),
      hearts: prev.hearts + 1,
      mood: "budgetGuru",
      message: randomMsg,
    }));
    setTimeout(() => {
      setStats((prev) => ({ ...prev, mood: "vibing" }));
    }, 3000);
  };

  const getMascotAscii = () => {
    switch (stats.mood) {
      case "eating":
        return "(っ˘ڡ˘ς) 🍬";
      case "dancing":
        return "(⌐■_■) 🎧";
      case "budgetGuru":
        return "(◕‿◕) 💎";
      case "sleepy":
        return "(∪｡∪)｡｡zZ";
      default:
        return "(◕ᴥ◕) 🦊✨";
    }
  };

  if (!isOpen) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
        }}
      >
        <button
          aria-label="Open Festi festival companion Tamagotchi"
          onClick={() => setIsOpen(true)}
          className="btn-skeuo"
          style={{
            padding: "10px 18px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            borderRadius: "9999px",
          }}
        >
          <span style={{ fontSize: "18px" }}>🦊</span>
          <span>Festi Pet (Lvl {stats.hearts})</span>
          <span
            style={{
              padding: "2px 6px",
              background: "rgba(255,255,255,0.25)",
              borderRadius: "9999px",
              fontSize: "11px",
            }}
          >
            {stats.vibe}%
          </span>
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Festi festival companion Tamagotchi"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        width: "290px",
      }}
    >
      <div className="tamagotchi-case" style={{ padding: "20px 18px 24px" }}>
        {/* Keychain Ring Loop */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "24px",
            height: "8px",
            borderRadius: "9999px",
            background: "#B33939",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)",
          }}
        />

        {/* Console Header Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "6px",
            marginBottom: "12px",
            color: "#FFFFFF",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px", fontWeight: 900, letterSpacing: "-0.5px" }}>
              FESTI-PET
            </span>
            <span
              style={{
                fontSize: "10px",
                background: "rgba(0,0,0,0.25)",
                padding: "2px 6px",
                borderRadius: "9999px",
                fontWeight: 700,
              }}
            >
              Lvl {stats.hearts}
            </span>
          </div>

          <button
            aria-label="Minimize Festi Tamagotchi"
            onClick={() => setIsOpen(false)}
            style={{
              color: "#FFFFFF",
              background: "rgba(0,0,0,0.2)",
              borderRadius: "50%",
              width: "22px",
              height: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Minimize2 size={12} />
          </button>
        </div>

        {/* LCD Screen Display */}
        <div className="tamagotchi-screen" style={{ padding: "12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              fontWeight: 700,
              marginBottom: "8px",
              borderBottom: "1px dashed rgba(26, 37, 24, 0.3)",
              paddingBottom: "4px",
            }}
          >
            <span>HYPE: {stats.hype}%</span>
            <span>VIBE: {stats.vibe}%</span>
            <span>SNACK: {stats.snacks}%</span>
          </div>

          {/* Mascot Center Animation */}
          <div
            style={{
              textAlign: "center",
              padding: "8px 0",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "1px",
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {getMascotAscii()}
          </div>

          {/* Message Prompt */}
          <div
            style={{
              fontSize: "11px",
              lineHeight: 1.35,
              fontWeight: 600,
              minHeight: "34px",
              textAlign: "center",
              background: "rgba(255,255,255,0.4)",
              borderRadius: "6px",
              padding: "4px 8px",
              marginTop: "4px",
            }}
          >
            {stats.message}
          </div>
        </div>

        {/* Tactile Push Buttons (A, B, C) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: "16px",
            padding: "0 10px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <button
              aria-label="Feed Festi mascot snack"
              onClick={handleFeed}
              className="tamagotchi-btn"
              title="Feed Matcha Boba & Snacks"
            >
              A
            </button>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#FFFFFF", marginTop: "4px" }}>
              FEED 🍬
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "-6px" }}>
            <button
              aria-label="Dance with Festi mascot"
              onClick={handleDance}
              className="tamagotchi-btn"
              title="Drop Beat & Dance"
            >
              B
            </button>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#FFFFFF", marginTop: "4px" }}>
              BEAT 🎧
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              aria-label="Vibe check with Festi mascot"
              onClick={handleVibeCheck}
              className="tamagotchi-btn"
              title="Financial literacy and vibe check"
            >
              C
            </button>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#FFFFFF", marginTop: "4px" }}>
              VIBE 💎
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
