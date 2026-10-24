import React from "react";

export const LandingWorkflow: React.FC = () => {
  const steps = [
    {
      step: 1,
      badgeColor: "var(--coral-light)",
      textColor: "var(--coral)",
      title: "1. Brief Your Vision",
      description: "Define occasion goals, attendee counts, target budget, and dietary, cultural, or acoustic requirements.",
    },
    {
      step: 2,
      badgeColor: "var(--sunshine-light)",
      textColor: "#B38600",
      title: "2. Shape & Align Operations",
      description: "Refine multi-currency ledger allocations, lock milestone dependencies, and compare vendor deliverables.",
    },
    {
      step: 3,
      badgeColor: "var(--mint-bg)",
      textColor: "var(--mint)",
      title: "3. Execute with Confidence",
      description: "Deploy minute-by-minute cue sheets, monitor live budget health, and share scoped client portals with one click.",
    },
  ];

  return (
    <section style={{ padding: "80px 0", background: "var(--canvas)" }}>
      <div className="container" style={{ maxWidth: "1080px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 className="serif-heading" style={{ fontSize: "36px", marginBottom: "14px" }}>
            Three steps to calm execution
          </h2>
          <p style={{ color: "var(--ink-secondary)", fontSize: "17px" }}>
            A disciplined operations workflow engineered to eliminate decision fatigue.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {steps.map((item) => (
            <div key={item.step} className="card" style={{ background: "var(--surface)", padding: "28px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: item.badgeColor,
                  color: item.textColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "18px",
                  marginBottom: "16px",
                }}
              >
                {item.step}
              </div>
              <h3 style={{ fontSize: "19px", marginBottom: "8px", fontWeight: 700 }}>{item.title}</h3>
              <p style={{ fontSize: "14px", color: "var(--ink-secondary)", lineHeight: 1.6 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
