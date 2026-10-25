import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

export const ProblemSolution: React.FC = () => {
  const comparisons = [
    {
      problem: "Starting from a terrifying blank sheet with open browser tabs",
      solution: "Start with a 90 second natural brief that accepts partial thoughts",
    },
    {
      problem: "Guessing what needs to happen next and missing crucial vendor lead times",
      solution: "Receive a prioritized checklist with exact due dates and dependency alerts",
    },
    {
      problem: "Tracking volatile costs across messy chats and unshared spreadsheets",
      solution: "Monitor low, likely, and high estimates against quotes and actual receipts",
    },
    {
      problem: "Losing key family and team decisions in long buried messaging threads",
      solution: "Keep brief, timeline, vendor notes, and guest roles organized in one workspace",
    },
  ];

  return (
    <section className="problem-solution-section" aria-labelledby="problem-solution-heading">
      <div className="content-wrapper">
        <div className="section-header">
          <h2 id="problem-solution-heading" className="section-title">
            Why Traditional Event Planning Breaks Down
          </h2>
          <p className="section-subtitle">
            Most people know what they want to celebrate. What causes stress is not knowing what to do first,
            how much it will truly cost, or how to keep vendors and family aligned.
          </p>
        </div>

        <div className="comparison-table-card">
          <div className="comparison-header-row">
            <div className="comparison-col-header problem-header">
              <XCircle size={18} color="var(--accent-coral)" />
              <span>Fragmented Planning Today</span>
            </div>
            <div className="comparison-col-header solution-header">
              <CheckCircle2 size={18} color="var(--accent-mint-dark)" />
              <span>The Festiya Experience</span>
            </div>
          </div>

          <div className="comparison-rows-list">
            {comparisons.map((row, idx) => (
              <div key={idx} className="comparison-row">
                <div className="comparison-cell problem-cell">
                  <span className="cell-bullet problem-bullet">✕</span>
                  <p>{row.problem}</p>
                </div>
                <div className="comparison-cell solution-cell">
                  <span className="cell-bullet solution-bullet">✓</span>
                  <p>{row.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
