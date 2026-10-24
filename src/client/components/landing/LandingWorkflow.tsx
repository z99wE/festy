import React from "react";

export const LandingWorkflow: React.FC = () => {
  const steps = [
    {
      step: "01",
      borderColor: "#b7c6c2", // Sage
      title: "Parametric Briefing",
      description: "Define scale, target currency, venue constraints, and acoustic or staging requirements in under 60 seconds.",
    },
    {
      step: "02",
      borderColor: "#ffe17c", // Yellow
      title: "Decimal Ledger Lock",
      description: "Auto-synthesize low, likely, and high budget allocations, milestone task dependencies, and partner contracts.",
    },
    {
      step: "03",
      borderColor: "#ffffff", // White
      title: "Synchronized Run of Show",
      description: "Deploy minute-by-minute day-of cue sheets with lead tags, vendor load-ins, and public client links.",
    },
  ];

  return (
    <section
      role="region"
      aria-label="How It Works"
      style={{
        padding: "90px 0",
        backgroundColor: "#171e19",
        borderBottom: "2px solid #000000",
        color: "#ffffff",
        position: "relative",
      }}
    >
      <div className="container" style={{ maxWidth: "1120px" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              marginBottom: "12px",
            }}
          >
            How It Works
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "#b7c6c2",
              fontSize: "17px",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            A 3-step execution engine engineered to eliminate spreadsheet drift, decision fatigue, and misaligned production cues.
          </p>
        </div>

        {/* 3-Step Horizontal Flow with Connecting #272727 Line */}
        <div style={{ position: "relative" }}>
          {/* Horizontal Connecting Line */}
          <div
            style={{
              position: "absolute",
              top: "36px",
              left: "15%",
              right: "15%",
              height: "4px",
              backgroundColor: "#272727",
              zIndex: 0,
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "36px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {steps.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {/* Large 72x72 circle with 4px colored border */}
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    backgroundColor: "#171e19",
                    border: `4px solid ${item.borderColor}`,
                    boxShadow: "0 0 16px rgba(0, 0, 0, 0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-heading)",
                    fontSize: "22px",
                    fontWeight: 800,
                    color: item.borderColor,
                    marginBottom: "24px",
                  }}
                >
                  {item.step}
                </div>

                <div
                  style={{
                    backgroundColor: "#272727",
                    border: "2px solid #000000",
                    borderRadius: "12px",
                    padding: "24px 20px",
                    boxShadow: "4px 4px 0px 0px #000000",
                    width: "100%",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "20px",
                      fontWeight: 800,
                      color: item.borderColor,
                      marginBottom: "10px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "14.5px",
                      color: "#b7c6c2",
                      lineHeight: 1.6,
                      fontWeight: 500,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
