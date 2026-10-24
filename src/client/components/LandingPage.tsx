import React, { useState } from "react";
import { EventCategory, Event } from "../../types/index.ts";
import { LandingHero } from "./landing/LandingHero.tsx";
import { SocialProofMarquee } from "./landing/SocialProofMarquee.tsx";
import { LandingComparison } from "./landing/LandingComparison.tsx";
import { LandingCollections } from "./landing/LandingCollections.tsx";
import { LandingWorkflow } from "./landing/LandingWorkflow.tsx";
import { DistrictScenesFeed } from "./landing/DistrictScenesFeed.tsx";
import { TestimonialsSection } from "./landing/TestimonialsSection.tsx";
import { LandingAeoFaq } from "./landing/LandingAeoFaq.tsx";
import { LandingCTA } from "./landing/LandingCTA.tsx";

interface LandingPageProps {
  onStartPlan: (brief: {
    occasion: string;
    category: EventCategory;
    dateMode: "decided" | "undecided";
    startDate?: string;
    guestCount?: number;
    currency: string;
    targetBudget?: number;
    style?: string;
  }) => void;
  onExploreDemoEvent: (eventId: string) => void;
  onGoToPricing: () => void;
  availableEvents: Event[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlan,
  onExploreDemoEvent,
  onGoToPricing,
}) => {
  const [occasion, setOccasion] = useState("");
  const [category, setCategory] = useState<EventCategory>("wedding");
  const [dateMode, setDateMode] = useState<"decided" | "undecided">("undecided");
  const [startDate, setStartDate] = useState("");
  const [guestCount, setGuestCount] = useState<number | undefined>(80);
  const [currency, setCurrency] = useState("USD");
  const [targetBudget, setTargetBudget] = useState<number | undefined>(15000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartPlan({
      occasion: occasion.trim() || `${category.replace("_", " ")} Celebration`,
      category,
      dateMode,
      startDate: dateMode === "decided" ? startDate : undefined,
      guestCount,
      currency,
      targetBudget,
      style: "Joyful, elegant, and memorable",
    });
  };

  const handleSelectBudgetTemplate = () => {
    setOccasion("Rooftop Sunset Gathering with Friends");
    setCategory("gathering");
    setTargetBudget(3500);
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleSelectDistrictScene = (sceneTitle: string, count: number) => {
    setOccasion(sceneTitle);
    setCategory("gathering");
    setGuestCount(count);
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  return (
    <div>
      {/* 1. Hero Section with 2-Column Grid, Radial Dots, Browser Mockup & Mascot Loop */}
      <LandingHero
        occasion={occasion}
        setOccasion={setOccasion}
        category={category}
        setCategory={setCategory}
        dateMode={dateMode}
        setDateMode={setDateMode}
        startDate={startDate}
        setStartDate={setStartDate}
        guestCount={guestCount}
        setGuestCount={setGuestCount}
        currency={currency}
        setCurrency={setCurrency}
        targetBudget={targetBudget}
        setTargetBudget={setTargetBudget}
        onSubmit={handleSubmit}
        onExploreDemoEvent={onExploreDemoEvent}
      />

      {/* 2. Social Proof Marquee (Continuous linear marquee on #171e19) */}
      <SocialProofMarquee />

      {/* 3. Problem vs Solution (Card A #f4f4f5 dashed, Card B #ffe17c 8px shadow) */}
      <LandingComparison />

      {/* 4. Feature Grid (Background #ffe17c, 3-column white cards, icon box) */}
      <LandingCollections
        onExploreDemoEvent={onExploreDemoEvent}
        onSelectBudgetTemplate={handleSelectBudgetTemplate}
      />

      {/* 5. How It Works (Dark mode #171e19, 3-step colored circle flow) */}
      <LandingWorkflow />

      {/* 6. Use Case Personas (3-column bento: Sage, Yellow 8px shadow, Dark Gray) */}
      <DistrictScenesFeed onSelectScene={handleSelectDistrictScene} />

      {/* 7. Testimonials (Background #b7c6c2, 3 white cards with asymmetric rounding) */}
      <TestimonialsSection />

      {/* 8. AEO / GEO Architecture Specifications & FAQ */}
      <LandingAeoFaq />

      {/* 9. Final CTA on #ffe17c */}
      <LandingCTA
        onStartPlanning={() => window.scrollTo({ top: 120, behavior: "smooth" })}
        onGoToPricing={onGoToPricing}
      />
    </div>
  );
};
