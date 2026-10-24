import React, { useState } from "react";
import { MapPin, Calendar, Users, Star, Ticket } from "lucide-react";

interface DistrictScene {
  id: string;
  title: string;
  district: string;
  tag: string;
  category: "all" | "raves" | "rooftop" | "indie" | "furry" | "brunch";
  vibeScore: number;
  priceEstimate: string;
  guestCount: string;
  dateStr: string;
  imageUrl: string;
  festiBadge: string;
}

const DISTRICT_SCENES: DistrictScene[] = [
  {
    id: "scene_cyber_rave",
    title: "Neon Horizon: Underground Synth Rave",
    district: "Warehouse District • Studio 9",
    tag: "High Energy",
    category: "raves",
    vibeScore: 99,
    priceEstimate: "$45 - $80 / guest",
    guestCount: "240 guests",
    dateStr: "Saturday • 10 PM",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=700&q=80",
    festiBadge: "SYNTH RAVE",
  },
  {
    id: "scene_sunset_rooftop",
    title: "Aura Sunset Mixer & Acoustic Lounge",
    district: "Skyline Promenade • 44th Fl",
    tag: "Aesthetic Chill",
    category: "rooftop",
    vibeScore: 96,
    priceEstimate: "$65 - $110 / guest",
    guestCount: "85 guests",
    dateStr: "Friday • 6 PM",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=700&q=80",
    festiBadge: "GOLDEN HOUR",
  },
  {
    id: "scene_indie_live",
    title: "Starlight Garden Indie Band Night",
    district: "Botanical Amphitheatre",
    tag: "Live Music",
    category: "indie",
    vibeScore: 94,
    priceEstimate: "$35 - $60 / guest",
    guestCount: "180 guests",
    dateStr: "Sunday • 7 PM",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=700&q=80",
    festiBadge: "LIVE GUITAR",
  },
  {
    id: "scene_furry_social",
    title: "Paws & Prosecco: Furry Pet Carnival",
    district: "Greenwood Meadow Park",
    tag: "Furry Friends",
    category: "furry",
    vibeScore: 98,
    priceEstimate: "$20 - $40 / guest",
    guestCount: "120 pets & humans",
    dateStr: "Saturday • 11 AM",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80",
    festiBadge: "PET CARNIVAL",
  },
  {
    id: "scene_matcha_brunch",
    title: "Pastel Matcha & Vinyl Record Brunch",
    district: "Old Town Courtyard",
    tag: "Foodie & Vinyl",
    category: "brunch",
    vibeScore: 95,
    priceEstimate: "$50 - $90 / guest",
    guestCount: "60 guests",
    dateStr: "Sunday • 11:30 AM",
    imageUrl: "https://images.unsplash.com/photo-1525268771113-32d9e9021a97?auto=format&fit=crop&w=700&q=80",
    festiBadge: "VINYL BRUNCH",
  },
];

interface DistrictScenesFeedProps {
  onSelectScene: (sceneTitle: string, guestCount: number) => void;
}

import { ReactBitsDust } from "../festive/ReactBitsDust.tsx";

export const DistrictScenesFeed: React.FC<DistrictScenesFeedProps> = ({ onSelectScene }) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "raves" | "rooftop" | "indie" | "furry" | "brunch"
  >("all");

  const filteredScenes =
    selectedCategory === "all"
      ? DISTRICT_SCENES
      : DISTRICT_SCENES.filter((s) => s.category === selectedCategory);

  const categories = [
    { key: "all" as const, label: "ALL SCENES" },
    { key: "raves" as const, label: "NEON RAVES" },
    { key: "rooftop" as const, label: "SUNSET SOIRÉES" },
    { key: "indie" as const, label: "LIVE GIGS" },
    { key: "furry" as const, label: "PET CARNIVALS" },
    { key: "brunch" as const, label: "VINYL BRUNCH" },
  ];

  return (
    <section
      className="festive-ambient-canvas"
      style={{
        padding: "90px 0",
        background: "linear-gradient(180deg, var(--canvas) 0%, #10141F 50%, var(--canvas) 100%)",
        borderBottom: "2px solid var(--surface-border)",
        color: "#FFFFFF",
        position: "relative",
      }}
    >
      <ReactBitsDust />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* District Header with Mascot Host */}
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <img
              src="/mascot-mint.png"
              alt="Mascot Host"
              className="mascot-mint-plush"
              style={{ width: "48px", height: "48px" }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: "#00E599",
                background: "rgba(0, 229, 153, 0.12)",
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1.5px solid var(--neopop-mint)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              🎉 LIVE GIGS & PARTY DISTRICTS
            </span>
          </div>

          <h2
            className="neopop-title"
            style={{
              fontSize: "clamp(30px, 4.5vw, 48px)",
              color: "#FFFFFF",
              marginBottom: "16px",
            }}
          >
            CURATED DISTRICT PRODUCTIONS
          </h2>

          <p style={{ fontSize: "16px", color: "var(--ink-secondary)", lineHeight: 1.6 }}>
            Select any production blueprint to load its real vendor budget matrix, timetable, and operational cues.
          </p>
        </div>

        {/* NeoPOP 3D Category Filter Strip */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            paddingBottom: "16px",
            marginBottom: "36px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              aria-label={`Filter by ${cat.label}`}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`district-pill ${selectedCategory === cat.key ? "active" : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* NeoPOP 3D Card Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
            gap: "28px",
          }}
        >
          {filteredScenes.map((scene) => (
            <article
              key={scene.id}
              className="card"
              style={{
                padding: "0",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                border: "2px solid var(--surface-border-strong)",
                boxShadow: "6px 6px 0px #000000",
              }}
            >
              {/* Event Image Banner with Overlay */}
              <div style={{ height: "210px", position: "relative", overflow: "hidden" }}>
                <img
                  src={scene.imageUrl}
                  alt={scene.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.8)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(18,21,29,0.95) 100%)",
                  }}
                />

                {/* Top Badges */}
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    right: "14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    className="badge badge-mint"
                    style={{ fontSize: "10.5px" }}
                  >
                    {scene.festiBadge}
                  </span>

                  <span
                    style={{
                      background: "#000000",
                      padding: "4px 8px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "var(--neopop-mint)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      border: "1px solid var(--neopop-mint)",
                    }}
                  >
                    <Star size={12} fill="var(--neopop-mint)" />
                    <span>{scene.vibeScore}% VIBE MATCH</span>
                  </span>
                </div>

                {/* Title overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "18px",
                    right: "18px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#FFFFFF",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {scene.title}
                  </h3>
                </div>
              </div>

              {/* Middle Details */}
              <div style={{ padding: "20px 24px", flexGrow: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--ink-secondary)",
                    fontSize: "13px",
                    marginBottom: "10px",
                  }}
                >
                  <MapPin size={14} color="var(--neopop-mint)" />
                  <span>{scene.district}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                    color: "#FFFFFF",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Calendar size={13} color="var(--neopop-gold)" />
                    <span>{scene.dateStr}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Users size={13} color="var(--neopop-blue)" />
                    <span>{scene.guestCount}</span>
                  </div>
                </div>
              </div>

              {/* NeoPOP Plinth Bottom Bar */}
              <div
                style={{
                  padding: "18px 24px",
                  background: "var(--surface-alt)",
                  borderTop: "2px solid var(--surface-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      color: "var(--ink-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Budget Target
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--neopop-mint)", fontFamily: "var(--font-mono)" }}>
                    {scene.priceEstimate}
                  </div>
                </div>

                {/* Plan This Scene CTA */}
                <button
                  aria-label={`Plan event based on ${scene.title}`}
                  type="button"
                  onClick={() => onSelectScene(scene.title, parseInt(scene.guestCount) || 80)}
                  className="btn btn-primary btn-sm"
                  style={{
                    padding: "8px 16px",
                    fontSize: "12px",
                  }}
                >
                  <Ticket size={14} />
                  <span>LOAD BLUEPRINT</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
