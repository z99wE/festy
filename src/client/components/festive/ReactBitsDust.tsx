import React from "react";

export const ReactBitsDust: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Radiant Gradient Dust Layers */}
      <div className="dust-layer-1" />
      <div className="dust-layer-2" />
      <div className="dust-layer-3" />

      {/* ReactBits Twinkling Star Particles */}
      <svg
        className="reactbit-sparkle"
        style={{ top: "12%", left: "8%", width: "22px", height: "22px" }}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
          fill="#FFD026"
        />
      </svg>

      <svg
        className="reactbit-sparkle"
        style={{ top: "28%", right: "12%", width: "28px", height: "28px", animationDelay: "1.2s" }}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
          fill="#00E599"
        />
      </svg>

      <svg
        className="reactbit-sparkle"
        style={{ top: "65%", left: "15%", width: "20px", height: "20px", animationDelay: "0.7s" }}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
          fill="#FF3366"
        />
      </svg>

      <svg
        className="reactbit-sparkle"
        style={{ top: "52%", right: "18%", width: "24px", height: "24px", animationDelay: "2s" }}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
          fill="#FFD026"
        />
      </svg>

      <svg
        className="reactbit-sparkle"
        style={{ top: "85%", right: "30%", width: "18px", height: "18px", animationDelay: "1.5s" }}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
          fill="#00E599"
        />
      </svg>
    </div>
  );
};
