import React from 'react';
import { CalendarCheck, Calculator, Sparkles } from 'lucide-react';

export const ScrollJourney: React.FC = () => {
  return (
    <section className="journey-section" id="how-it-works" aria-labelledby="journey-heading">
      <div className="content-wrapper">
        <div className="section-header">
          <h2 id="journey-heading" className="section-title">
            From Planning Chaos to Unshakable Clarity
          </h2>
          <p className="section-subtitle">
            Most events get lost across scattered group chats and forgotten spreadsheets. Festiya gives you
            three clear steps to bring people together with confidence and joy.
          </p>
        </div>

        <div className="journey-cards-grid">
          {/* Step 1 */}
          <article className="journey-step-card" aria-label="Step 1: Tell Us What You're Celebrating">
            <div className="step-number-tag" aria-hidden="true">
              1
            </div>
            <div className="step-card-icon-wrap" style={{ color: 'var(--orange-500)', marginBottom: '16px' }}>
              <Sparkles size={32} />
            </div>
            <h3 className="step-card-title">1. Tell Us What You're Celebrating</h3>
            <p className="step-card-desc">
              No blank document paralysis. Enter an occasion, guest count, general vibe, or even just “not sure yet”.
              Festiya respects partial briefs and never blocks you because a detail is undecided.
            </p>
          </article>

          {/* Step 2 */}
          <article className="journey-step-card" aria-label="Step 2: Shape the Plan & Budget">
            <div className="step-number-tag" aria-hidden="true">
              2
            </div>
            <div className="step-card-icon-wrap" style={{ color: 'var(--accent-mint-dark)', marginBottom: '16px' }}>
              <Calculator size={32} />
            </div>
            <h3 className="step-card-title">2. Shape the Plan & Budget</h3>
            <p className="step-card-desc">
              Receive a structured, editable blueprint in seconds: low/likely/high budget estimates,
              prioritized milestones, vendor questions, and creative ideas. You stay in control — nothing is locked.
            </p>
          </article>

          {/* Step 3 */}
          <article className="journey-step-card" aria-label="Step 3: Make It Happen with Confidence">
            <div className="step-number-tag" aria-hidden="true">
              3
            </div>
            <div className="step-card-icon-wrap" style={{ color: 'var(--accent-gold)', marginBottom: '16px' }}>
              <CalendarCheck size={32} />
            </div>
            <h3 className="step-card-title">3. Make It Happen with Confidence</h3>
            <p className="step-card-desc">
              Track actual quotes against committed costs, collaborate with scoped sharing links,
              and check off milestones with ease. Turn planning into the most exciting part of the celebration.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
