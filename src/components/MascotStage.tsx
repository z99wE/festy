import React, { useState, useRef } from 'react';
import { Heart, Volume2, ShieldCheck } from 'lucide-react';
import { playCelebrationSound, playPopSound } from '../utils/audio';

interface MascotStageProps {
  soundEnabled: boolean;
  reducedMotion: boolean;
}

interface MascotProfile {
  id: string;
  name: string;
  title: string;
  image: string;
  tagline: string;
  role: string;
  color: string;
  bgTint: string;
  favoriteVibe: string;
}

const MASCOTS: MascotProfile[] = [
  {
    id: 'fetti',
    name: 'Fetti',
    title: 'The Joyful Host',
    image: '/mascots/pink-waving.png',
    tagline: 'Turning every guest invitation into a heartwarming memory.',
    role: 'Guest Experience & Hospitality',
    color: 'var(--orange-500)',
    bgTint: 'var(--orange-50)',
    favoriteVibe: 'Warm, welcoming & heartfelt gatherings',
  },
  {
    id: 'sunny',
    name: 'Sunny',
    title: 'The Rhythm Dynamo',
    image: '/mascots/yellow-dance.png',
    tagline: 'Lighting up dance floors, entertainment & live party spirit.',
    role: 'Music, Sound & Atmosphere',
    color: 'var(--accent-gold)',
    bgTint: 'var(--accent-gold-light)',
    favoriteVibe: 'High-energy carnivals & joyous milestones',
  },
  {
    id: 'minty',
    name: 'Minty',
    title: 'The Calm Optimizer',
    image: '/mascots/bubble-mint.png',
    tagline: 'Decimal-accurate budgets with zero spreadsheet dread.',
    role: 'Budget Health & Vendor Negotiations',
    color: 'var(--accent-mint-dark)',
    bgTint: 'var(--accent-mint-light)',
    favoriteVibe: 'Clarity, serenity & thoughtful spending',
  },
  {
    id: 'breeze',
    name: 'Breeze',
    title: 'The Milestone Jumper',
    image: '/mascots/blue-jumping.png',
    tagline: 'Leaping over deadlines so your event runs like clockwork.',
    role: 'Timelines, Run-of-Show & Tasks',
    color: 'var(--accent-sky)',
    bgTint: 'var(--accent-sky-light)',
    favoriteVibe: 'Effortless coordination & smooth flow',
  },
];

export const MascotStage: React.FC<MascotStageProps> = ({ soundEnabled, reducedMotion }) => {
  const [selectedMascot, setSelectedMascot] = useState<MascotProfile>(MASCOTS[0]);
  const [celebrating, setCelebrating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / (rect.height / 2)) * 10,
      y: (x / (rect.width / 2)) * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleSelectMascot = (mascot: MascotProfile) => {
    setSelectedMascot(mascot);
    playPopSound(soundEnabled);
  };

  const handleCelebrate = () => {
    setCelebrating(true);
    playCelebrationSound(soundEnabled);



    setTimeout(() => setCelebrating(false), 800);
  };

  return (
    <section className="mascot-spotlight-section" aria-labelledby="mascot-studio-heading">
      <div className="content-wrapper">
        <div className="section-header">
          <div className="section-tag">
            <span className="badge-pill sunshine">
              Meet Your Companions
            </span>
          </div>
          <h2 id="mascot-studio-heading" className="section-title">
            The Festiya Crew: Joyful Guardians of Your Celebration
          </h2>
          <p className="section-subtitle">
            Every great festival has its heart. Meet our interactive companions designed to keep your
            planning stress-free, delightful, and wonderfully organized.
          </p>
        </div>

        <div
          ref={cardRef}
          className="mascot-stage-container"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: reducedMotion
              ? 'none'
              : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          {/* 3D Visual Stage */}
          <div className="mascot-3d-stage">
            <div className="stage-pedestal" />
            <img
              src={selectedMascot.image}
              alt={`${selectedMascot.name} - ${selectedMascot.title}`}
              className={`active-stage-mascot ${celebrating ? 'celebrating-jump' : ''}`}
              style={{
                transform: celebrating ? 'scale(1.18) translateY(-24px)' : undefined,
              }}
            />
          </div>

          {/* Mascot Info & Actions */}
          <div className="mascot-info-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                className="badge-pill"
                style={{
                  background: selectedMascot.bgTint,
                  color: selectedMascot.color,
                  borderColor: selectedMascot.color,
                }}
              >
                <Heart size={14} aria-hidden="true" />
                {selectedMascot.role}
              </span>
            </div>

            <h3 style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
              {selectedMascot.name} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>({selectedMascot.title})</span>
            </h3>

            <p style={{ fontSize: '1.15rem', color: 'var(--orange-700)', fontWeight: 600, marginBottom: '14px' }}>
              "{selectedMascot.tagline}"
            </p>

            <div
              style={{
                background: 'var(--bg-canvas-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={18} color="var(--orange-500)" />
                <strong>Superpower:</strong> Ensures {selectedMascot.favoriteVibe.toLowerCase()} without feeling overwhelming.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCelebrate}
                aria-label={`Celebrate with ${selectedMascot.name}`}
              >
                Celebrate with {selectedMascot.name}!
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => playPopSound(soundEnabled)}
                aria-label={`Say hi to ${selectedMascot.name}`}
              >
                <Volume2 size={18} aria-hidden="true" />
                Say Hi
              </button>
            </div>

            {/* Crew Selector Grid */}
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Switch Companion
              </span>
              <div className="mascot-selectors-grid" role="tablist" aria-label="Festiya Mascot Selection">
                {MASCOTS.map((m) => {
                  const isSelected = selectedMascot.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      aria-controls="mascot-details"
                      className={`mascot-select-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => handleSelectMascot(m)}
                    >
                      <img src={m.image} alt={m.name} />
                      <span>{m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
