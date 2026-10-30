import React from 'react';

export const ProblemSolution: React.FC = () => {
  const comparisons = [
    {
      problem: "Staring at blank documents trying to brainstorm unique celebration themes and personalized ideas",
      solution: "Instant GenAI concept synthesis generating personalized decor themes, culinary pairings, and bespoke guest experiences",
    },
    {
      problem: "Tracking unpredictable costs across disparate notes and spreadsheets, resulting in budget overruns",
      solution: "Algorithmic 3-tier budgets (Conservative, Target, Stretch) calibrated against real-world vendor benchmarks",
    },
    {
      problem: "Guessing run-of-show logistics and missing critical day-of cues or setup deadlines",
      solution: "Minute-by-minute production timelines with buffer zones, vendor load-in windows, and automated cue alerts",
    },
    {
      problem: "Vague vendor communications, unverified contract deliverables, and surprise hidden fee markups",
      solution: "Actionable vendor checklists with milestone payment schedules, SLA verification, and fee dispute shields",
    },
  ];

  return (
    <section className="problem-solution-section" aria-labelledby="problem-solution-heading">
      <div className="content-wrapper">
        <div className="section-header">
          <h2 id="problem-solution-heading" className="section-title" style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
            Why Planning Weddings, Birthdays &amp; Community Events Spirals Into Chaos
          </h2>
          <p className="section-subtitle">
            From sudden vendor price hikes to vague schedules and fragmented chats, organizing celebrations without an intelligent assistant leads to overspending and missed details. Festiya’s GenAI engine unites dynamic budgets, timelines, vendor checklists, and personalized ideas in one intuitive hub.
          </p>
        </div>

        <div className="comparison-table-card">
          <div className="comparison-header-row">
            <div className="comparison-col-header problem-header">
              <span>Fragmented Planning Today</span>
            </div>
            <div className="comparison-col-header solution-header">
              <span>The Festiya Experience</span>
            </div>
          </div>

          <div className="comparison-rows-list">
            {comparisons.map((row, idx) => (
              <div key={idx} className="comparison-row">
                <div className="comparison-cell problem-cell">
                  <p>{row.problem}</p>
                </div>
                <div className="comparison-cell solution-cell">
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
