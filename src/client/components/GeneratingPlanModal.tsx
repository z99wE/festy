import React, { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, Clock } from "lucide-react";

interface GeneratingPlanModalProps {
  isOpen: boolean;
  eventName: string;
}

export const GeneratingPlanModal: React.FC<GeneratingPlanModalProps> = ({ isOpen, eventName }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(0);

  const steps = [
    "Analyzing celebration brief and style constraints...",
    "Modeling low / likely / high budget allocations across categories...",
    "Generating milestone checklist and dependency-linked timeline...",
    "Formulating vendor evaluation criteria and questions to ask...",
    "Synthesizing personalized experience ideas and safety mitigations...",
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 600);
    const timer2 = setTimeout(() => setStep(2), 1200);
    const timer3 = setTimeout(() => setStep(3), 1800);
    const timer4 = setTimeout(() => setStep(4), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="modal-backdrop" style={{ zIndex: 2000 }}>
      <div
        className="card"
        style={{
          maxWidth: "520px",
          width: "100%",
          padding: "36px",
          textAlign: "center",
          background: "var(--surface)",
          boxShadow: "0 20px 50px rgba(36, 33, 43, 0.2)",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--coral) 0%, var(--sunshine) 100%)",
            color: "#FFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 8px 20px rgba(255, 98, 87, 0.35)",
            animation: "pulse 2s infinite ease-in-out",
          }}
        >
          <Sparkles size={28} />
        </div>

        <h3 className="serif-heading" style={{ fontSize: "22px", marginBottom: "8px" }}>
          Crafting your event blueprint
        </h3>
        <p style={{ fontSize: "14px", color: "var(--ink-secondary)", marginBottom: "28px" }}>
          for <strong>{eventName}</strong>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
          {steps.map((text, idx) => {
            const isDone = step > idx;
            const isCurrent = step === idx;

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "13px",
                  color: isDone ? "var(--ink)" : isCurrent ? "var(--coral)" : "var(--ink-muted)",
                  fontWeight: isCurrent ? 700 : isDone ? 500 : 400,
                  transition: "all 0.2s ease",
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={16} color="var(--mint)" />
                ) : isCurrent ? (
                  <Sparkles size={16} color="var(--coral)" />
                ) : (
                  <Clock size={16} color="var(--surface-border)" />
                )}
                <span>{text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
