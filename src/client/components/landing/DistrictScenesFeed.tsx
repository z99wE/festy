import React, { useState } from "react";
import { Sparkles, MapPin, Calendar, Users, Flame, Star, Ticket } from "lucide-react";

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
    dateStr: "Next Saturday • 10 PM",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=700&q=80",
    festiBadge: "TAMAGOTCHI HYPED ⚡",
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
    dateStr: "This Friday • 6 PM",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=700&q=80",
    festiBadge: "GOLDEN HOUR 🍸",
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
    dateStr: "Sunday Evening • 7 PM",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=700&q=80",
    festiBadge: "CHILL GUITAR 🎸",
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
    dateStr: "Saturday Morning • 11 AM",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80",
    festiBadge: "CUTE FURRY VIBE 🐾",
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
    dateStr: "Sunday Morning • 11:30 AM",
    imageUrl: "https://images.unsplash.com/photo-1525268771113-32d9e9021a97?auto=format&fit=crop&w=700&q=80",
    festiBadge: "GEN Z FOODIE 🥐",
  },
];

interface DistrictScenesFeedProps {
  onSelectScene: (sceneTitle: string, guestCount: number) => void;
}

export const DistrictScenesFeed: React.FC<DistrictScenesFeedProps> = ({ onSelectScene }) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "raves" | "rooftop" | "indie" | "furry" | "brunch"
  >("all");

  const filteredScenes =
    selectedCategory === "all"
      ? DISTRICT_SCENES
      : DISTRICT_SCENES.filter((s) => s.category === selectedCategory);

  const categories = [
    { key: "all" as const, label: "🔥 All District Scenes" },
    { key: "raves" as const, label: "⚡ Neon Raves" },
    { key: "rooftop" as const, label: "🍸 Sunset Soirées" },
    { key: "indie" as const, label: "🎸 Indie Band Nights" },
    { key: "furry" as const, label: "🐾 Furry Pet Socials" },
    { key: "brunch" as const, label: "🥐 Aesthetic Brunches" },
  ];

  return (
    <section
      style={{
        padding: "70px 0 80px",
        background: "linear-gradient(180deg, var(--canvas) 0%, #11141E 15%, #0B0D13 100%)",
        color: "#FFFFFF",
        position: "relative",
      }}
    >
      <div className="container">
        {/* District Header */}
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 36px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "9999px",
              background: "rgba(255, 71, 87, 0.15)",
              border: "1px solid rgba(255, 71, 87, 0.4)",
              color: "#FF4757",
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "16px",
            }}
          >
            <Flame size={14} />
            <span>District Scenes & Live Gigs (Swiggy Scenes Style)</span>
          </div>

          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.2,
              marginBottom: "14px",
            }}
          >
            Discover Electric Scenes. <br />
            <span
              style={{
                background: "linear-gradient(90deg, #FF4757 0%, #FFC043 50%, #A855F7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Or plan your own legendary gathering in seconds.
            </span>
          </h2>

          <p style={{ fontSize: "16px", color: "#94A3B8", lineHeight: 1.6 }}>
            Tap any scene to tear off your skeuomorphic event blueprint, estimate your budget with zero
            surprise fees, and summon your Tamagotchi party assistant!
          </p>
        </div>

        {/* Tactile Category Filter Strip */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            paddingBottom: "16px",
            marginBottom: "32px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              aria-label={cat.label}
              onClick={() => setSelectedCategory(cat.key)}
              className={`district-pill ${selectedCategory === cat.key ? "active" : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skeuomorphic Ticket Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredScenes.map((scene) => (
            <article key={scene.id} className="district-scene-card">
              {/* Event Image Banner with Overlay */}
              <div style={{ height: "200px", position: "relative", overflow: "hidden" }}>
                <img
                  src={scene.imageUrl}
                  alt={scene.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.85)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(20,23,33,0.95) 100%)",
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
                    className="holo-shimmer"
                    style={{
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#FFFFFF",
                      border: "1px solid rgba(255,255,255,0.4)",
                      textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                    }}
                  >
                    {scene.festiBadge}
                  </span>

                  <span
                    style={{
                      background: "rgba(0,0,0,0.7)",
                      backdropFilter: "blur(6px)",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#2ED573",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Star size={12} fill="#2ED573" />
                    <span>{scene.vibeScore}% Vibe Match</span>
                  </span>
                </div>

                {/* Title overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "14px",
                    left: "16px",
                    right: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#FFFFFF",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {scene.title}
                  </h3>
                </div>
              </div>

              {/* Middle Details */}
              <div style={{ padding: "16px 20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#94A3B8",
                    fontSize: "12.5px",
                    marginBottom: "8px",
                  }}
                >
                  <MapPin size={14} color="#FF4757" />
                  <span>{scene.district}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "12.5px",
                    color: "#CBD5E1",
                    marginBottom: "4px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Calendar size={13} color="#FFC043" />
                    <span>{scene.dateStr}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Users size={13} color="#A855F7" />
                    <span>{scene.guestCount}</span>
                  </div>
                </div>
              </div>

              {/* Skeuomorphic Perforated Ticket Stub Bottom */}
              <div className="skeuo-ticket-stub" style={{ padding: "18px 20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#94A3B8",
                        textTransform: "uppercase",
                      }}
                    >
                      Budget Target
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "#2ED573" }}>
                      {scene.priceEstimate}
                    </div>
                  </div>

                  {/* Skeuomorphic Barcode Stripe */}
                  <div style={{ textAlign: "right", opacity: 0.6 }}>
                    <div
                      style={{
                        fontFamily: "monospace",
                        letterSpacing: "3px",
                        fontSize: "14px",
                        fontWeight: 900,
                        color: "#E2E2EB",
                      }}
                    >
                      ||| | |||| | ||
                    </div>
                    <div style={{ fontSize: "9px", color: "#94A3B8" }}>#FESTI-{scene.id.slice(-4)}</div>
                  </div>
                </div>

                {/* Tear Off Button */}
                <button
                  aria-label={`Tear off ticket to plan ${scene.title}`}
                  onClick={() => onSelectScene(scene.title, parseInt(scene.guestCount) || 80)}
                  className="btn-skeuo"
                  style={{
                    width: "100%",
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontSize: "13px",
                  }}
                >
                  <Ticket size={16} />
                  <span>Tear Off & Plan This Scene</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
