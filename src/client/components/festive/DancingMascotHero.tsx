import React, { useState, useEffect } from "react";

const DANCE_FRAMES = [
  { id: 1, src: "/mascots/dance-1.png", alt: "Pink Dancing Mascot" },
  { id: 2, src: "/mascots/dance-2.png", alt: "Yellow Dancing Mascot" },
  { id: 3, src: "/mascots/dance-3.png", alt: "Blue Fuzzy Jumping Mascot" },
  { id: 4, src: "/mascots/dance-4.png", alt: "Bubble Mint Mascot" },
];

export const DancingMascotHero: React.FC = () => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % DANCE_FRAMES.length);
    }, 280);
    return () => clearInterval(interval);
  }, []);

  const currentFrame = DANCE_FRAMES[currentFrameIndex];

  return (
    <div className="dancing-hero-stage">
      {/* Clean looping dancing character — no boxes, no captions */}
      <div className="dancing-character-wrapper">
        <img
          key={currentFrame.id}
          src={currentFrame.src}
          alt={currentFrame.alt}
          className="dancing-mascot-gif"
        />
      </div>

      {/* Official Festiya Logo placed right under the dancing character */}
      <div className="dancing-logo-under">
        <img
          src="/favicon.png"
          alt="Festiya Logo"
          className="dancing-favicon-logo"
        />
      </div>
    </div>
  );
};
