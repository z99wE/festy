import React, { useState, useEffect } from "react";
import { Sparkles, MessageSquare, Zap, Music, DollarSign, Award, ChevronUp } from "lucide-react";
import { Event } from "../../../types/index.ts";

const DANCE_FRAMES = [
  { id: 1, src: "/mascots/dance-1.png", alt: "Pink Fluffy Dancing Mascot" },
  { id: 2, src: "/mascots/dance-2.png", alt: "Yellow Cheerful Dancing Mascot" },
  { id: 3, src: "/mascots/dance-3.png", alt: "Blue Fuzzy Jumping Mascot" },
  { id: 4, src: "/mascots/dance-4.png", alt: "Bubble Mint Plush Mascot" },
];

interface DancingCompanionMascotProps {
  currentView: "landing" | "workspace" | "pricing" | "shared";
  activeEvent: Event | null;
  tasksCount?: number;
  budgetItemsCount?: number;
  activeTab?: string;
  onOpenChat: (initialPrompt?: string) => void;
}

export const DancingCompanionMascot: React.FC<DancingCompanionMascotProps> = ({
  currentView,
  activeEvent,
  tasksCount = 0,
  budgetItemsCount = 0,
  activeTab = "plan",
  onOpenChat,
}) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Smooth frame cycle matching musical tempo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % DANCE_FRAMES.length);
    }, 280);
    return () => clearInterval(interval);
  }, []);

  const currentFrame = DANCE_FRAMES[currentFrameIndex];

  // Stage Evolution: Level 1 on landing, develops into Level 10 Studio Chief on workspace
  const isWorkspace = currentView === "workspace" && !!activeEvent;
  const mascotLevel = isWorkspace ? 10 : 1;
  const mascotTitle = isWorkspace ? "Lvl 10 • Studio Director" : "Lvl 1 • Festive Spark";
  const mascotBadgeColor = isWorkspace ? "#ff5722" : "#ffe17c";
  const mascotBadgeText = isWorkspace ? "#ffffff" : "#000000";

  return (
    <aside
      aria-label="Festiya Interactive Mascot and AI Copilot Trigger"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 99,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
        pointerEvents: "auto",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Interactive Speech & Feature Panel (visible on hover, expand, or workspace active status) */}
      {(isHovered || isExpanded) && (
        <div
          style={{
            background: "#ffffff",
            border: "2px solid #000000",
            borderRadius: "12px",
            boxShadow: "6px 6px 0px 0px #000000",
            padding: "14px 16px",
            maxWidth: "290px",
            animation: "fadeInUp 0.18s ease-out",
          }}
        >
          {/* Header & Evolved Level Tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 900,
                  background: mascotBadgeColor,
                  color: mascotBadgeText,
                  padding: "3px 8px",
                  borderRadius: "4px",
                  border: "2px solid #000000",
                  fontFamily: "var(--font-mono)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Award size={12} />
                {mascotTitle}
              </span>
            </div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "var(--font-mono)",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  display: "inline-block",
                }}
              />
              ONLINE
            </span>
          </div>

          {/* Contextual Status / Evolution Description */}
          <p
            style={{
              fontSize: "12px",
              lineHeight: 1.45,
              fontWeight: 600,
              color: "#171e19",
              margin: "0 0 10px 0",
            }}
          >
            {isWorkspace ? (
              <>
                Analyzing <strong>{activeEvent.name}</strong> ({tasksCount} tasks, {budgetItemsCount} budget items).
                Click to generate instant schedule cues or cost re-allocations!
              </>
            ) : (
              <>
                Hey bestie! Festi AI is dancing on beat. Click me to plan your dream celebration with zero stress!
              </>
            )}
          </p>

          {/* Ingrained Quick-Action Buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
            }}
          >
            <button
              aria-label="Feed ideas and theme concepts to Festi AI"
              type="button"
              onClick={() => onOpenChat("Generate 3 surprising theme concepts and guest sensory activations")}
              style={{
                padding: "6px 8px",
                fontSize: "11px",
                fontWeight: 800,
                background: "#ffe17c",
                color: "#000000",
                border: "2px solid #000000",
                borderRadius: "6px",
                boxShadow: "2px 2px 0px 0px #000000",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              🍬 Feed Ideas
            </button>

            <button
              aria-label="Drop DJ beat and run of show schedule"
              type="button"
              onClick={() => onOpenChat("Generate minute-by-minute run-of-show cues and musical transitions")}
              style={{
                padding: "6px 8px",
                fontSize: "11px",
                fontWeight: 800,
                background: "#b7c6c2",
                color: "#000000",
                border: "2px solid #000000",
                borderRadius: "6px",
                boxShadow: "2px 2px 0px 0px #000000",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              🎧 DJ Cues
            </button>

            <button
              aria-label="Audit budget and check financial vibe"
              type="button"
              onClick={() => onOpenChat("Audit our budget allocations, cut vendor bloat, and suggest 15% savings")}
              style={{
                padding: "6px 8px",
                fontSize: "11px",
                fontWeight: 800,
                background: "#ffffff",
                color: "#000000",
                border: "2px solid #000000",
                borderRadius: "6px",
                boxShadow: "2px 2px 0px 0px #000000",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              💎 Vibe Budget
            </button>

            <button
              aria-label="Open full Festiya AI chat drawer"
              type="button"
              onClick={() => onOpenChat()}
              style={{
                padding: "6px 8px",
                fontSize: "11px",
                fontWeight: 800,
                background: "#171e19",
                color: "#ffe17c",
                border: "2px solid #000000",
                borderRadius: "6px",
                boxShadow: "2px 2px 0px 0px #000000",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              💬 Ask AI
            </button>
          </div>
        </div>
      )}

      {/* Primary Dancing Mascot Trigger */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Floating pill indicator above mascot when not hovered */}
        {!isHovered && !isExpanded && (
          <div
            style={{
              position: "absolute",
              top: "-26px",
              background: isWorkspace ? "#ff5722" : "#ffe17c",
              color: isWorkspace ? "#ffffff" : "#000000",
              border: "2px solid #000000",
              borderRadius: "20px",
              padding: "2px 10px",
              fontSize: "10px",
              fontWeight: 900,
              fontFamily: "var(--font-mono)",
              boxShadow: "2px 2px 0px 0px #000000",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              animation: "mascotPillFloat 1.8s ease-in-out infinite alternate",
            }}
          >
            <Sparkles size={11} />
            {isWorkspace ? `LVL ${mascotLevel} COPILOT` : "ASK FESTI AI"}
          </div>
        )}

        <button
          aria-label="Festiya Mascot dancing AI companion. Click to open Ask Festiya AI chat."
          type="button"
          onClick={() => onOpenChat()}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            outline: "none",
            transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {/* Animated Dancing Character Frame */}
          <div
            style={{
              width: isWorkspace ? "120px" : "110px",
              height: isWorkspace ? "120px" : "110px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Evolved Aura in Workspace Mode */}
            {isWorkspace && (
              <div
                style={{
                  position: "absolute",
                  inset: "8px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255, 225, 124, 0.45) 0%, rgba(255, 87, 34, 0.15) 70%, transparent 100%)",
                  animation: "pulseRing 1.5s ease-in-out infinite",
                  zIndex: 0,
                }}
              />
            )}

            <img
              key={currentFrame.id}
              src={currentFrame.src}
              alt={currentFrame.alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                position: "relative",
                zIndex: 1,
                filter: isWorkspace
                  ? "drop-shadow(0px 8px 12px rgba(255, 87, 34, 0.25))"
                  : "drop-shadow(0px 6px 8px rgba(0,0,0,0.2))",
                animation: "danceSquashBounce 0.38s cubic-bezier(0.28, 0.84, 0.42, 1) infinite alternate",
              }}
            />
          </div>

          {/* Rhythmic Dynamic Shadow */}
          <div
            style={{
              width: "56px",
              height: "10px",
              background: "rgba(0, 0, 0, 0.22)",
              borderRadius: "50%",
              marginTop: "-6px",
              animation: "shadowPulse 0.38s cubic-bezier(0.28, 0.84, 0.42, 1) infinite alternate",
            }}
          />
        </button>
      </div>
    </aside>
  );
};
