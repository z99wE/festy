import React from "react";
import { Star } from "lucide-react";

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Sanya Malhotra",
      role: "Lead Producer, Royal Rajasthan Weddings",
      event: "Jaipur 3-Day Palace Wedding (180 guests)",
      quote:
        "The decimal ledger saved us from an 8.4% vendor quote creep on banquet staging and acoustic rentals. The minute-by-minute cue board kept 12 distinct vendor teams synchronized across all three days without a single hitch.",
      rating: 5,
    },
    {
      name: "Marcus Vance",
      role: "VP of Global Events, Apex Media Group",
      event: "Apex Executive Summit NYC (120 VIPs)",
      quote:
        "We replaced 4 disconnected spreadsheets with Festiya. The multi-tenant Cloudflare edge architecture gave our security board complete confidence for confidential client NDA rosters. The plan synthesized in 45 seconds.",
      rating: 5,
    },
    {
      name: "Ananya Iyer",
      role: "Creative Director, Horizon Popups",
      event: "Aura Sunset Acoustic Gathering (250 guests)",
      quote:
        "Sharing clean, branded proposal links with our clients without revealing internal vendor margins revolutionized our pitch win rate. Festiya has completely eliminated our spreadsheet anxiety.",
      rating: 5,
    },
  ];

  return (
    <section
      role="region"
      aria-label="Verified Producer Testimonials"
      style={{
        padding: "80px 0",
        backgroundColor: "#b7c6c2",
        borderTop: "2px solid #000000",
        borderBottom: "2px solid #000000",
        color: "#000000",
      }}
    >
      <div className="container" style={{ maxWidth: "1160px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              color: "#000000",
              letterSpacing: "-0.03em",
              marginBottom: "12px",
            }}
          >
            Trusted by Elite Producers Worldwide
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "#171e19",
              fontSize: "17px",
              maxWidth: "640px",
              margin: "0 auto",
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Verified results from production directors executing six and seven-figure events without spreadsheet breakdowns.
          </p>
        </div>

        {/* Grid of 3 White Cards with Asymmetric Corner Rounding */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px",
          }}
        >
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#ffffff",
                border: "2px solid #000000",
                /* Asymmetric corner rounding: Top-Right and Bottom-Left are 16px, Top-Left and Bottom-Right are 2px */
                borderRadius: "2px 18px 2px 18px",
                boxShadow: "4px 4px 0px 0px #000000",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                {/* 5-Star Rating in #ffbc2e yellow */}
                <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#ffbc2e" color="#ffbc2e" />
                  ))}
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    color: "#171e19",
                    lineHeight: 1.6,
                    fontWeight: 500,
                    marginBottom: "24px",
                    fontStyle: "italic",
                  }}
                >
                  "{t.quote}"
                </p>
              </div>

              <div style={{ borderTop: "2px solid #000000", paddingTop: "16px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "16px",
                    fontWeight: 800,
                    color: "#000000",
                  }}
                >
                  {t.name}
                </div>
                <div style={{ fontSize: "12.5px", color: "#4a5568", fontWeight: 600 }}>{t.role}</div>
                <div style={{ fontSize: "11.5px", color: "#171e19", fontWeight: 700, marginTop: "4px" }}>
                  {t.event}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
