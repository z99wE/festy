import React from 'react';
import { Star } from 'lucide-react';

export const SocialProof: React.FC = () => {
  const testimonials = [
    {
      name: "Marcus Holloway",
      role: "Lead Coordinator, Cascade Street Fair",
      quote: "Festiya transformed our 340-person neighborhood block festival. Having volunteer run-of-show tasks linked directly to vendor load-in deadlines prevented every typical logistical bottleneck.",
      metric: "340 attendees · $1,850 under target",
      location: "Portland, OR",
    },
    {
      name: "Priya & Aarav Patel",
      role: "Couples Hosts, Sangeet & Reception",
      quote: "Planning a multi-day celebration across two families was overwhelming until we used Festiya. The low/likely/high budget estimates helped us negotiate with caterers without awkward surprises.",
      metric: "185 guests · 6 weeks planning",
      location: "London, UK",
    },
    {
      name: "Elena Rostova",
      role: "Founder, Velvet & Pine Event Design",
      quote: "As an independent planner juggling four clients at once, the scoped share links and reusable proposal templates let me send client-ready summaries in minutes instead of retyping everything.",
      metric: "12 client proposals delivered",
      location: "Toronto, Canada",
    },
  ];

  return (
    <section className="social-proof-section" aria-labelledby="social-proof-heading">
      <div className="content-wrapper">
        <div className="section-header">
          <h2 id="social-proof-heading" className="section-title">
            Loved by Organizers, Planners, and Families
          </h2>
          <p className="section-subtitle">
            Real celebrations powered by structured budgets, clear timelines, and operational calm.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-stars" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--accent-gold)" color="var(--accent-gold)" />
                ))}
              </div>

              <p className="testimonial-quote">"{t.quote}"</p>

              <div className="testimonial-author-block">
                <div className="testimonial-avatar-squircle">
                  <span>{t.name.split(' ').map((n) => n[0]).join('')}</span>
                </div>
                <div>
                  <h3 className="testimonial-name">{t.name}</h3>
                  <div className="testimonial-role">{t.role}</div>
                  <div className="testimonial-metric">{t.metric}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
