import { EventPlan } from "../../types/index.ts";

export const seedUsers = {
  souvik: {
    id: "usr_souvik",
    email: "souvik@example.com",
    name: "Souvik Chakraborty",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    locale: "en-US",
    timezone: "Asia/Kolkata",
  },
  elena: {
    id: "usr_elena",
    email: "elena@example.com",
    name: "Elena Rostova",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80",
    locale: "en-GB",
    timezone: "Europe/London",
  },
};

export const seedWorkspaces = {
  personal: {
    id: "ws_personal",
    name: "Souvik's Celebrations",
    type: "personal" as const,
    ownerId: "usr_souvik",
    brandName: "Moments by Souvik",
    subscriptionTier: "plus" as const,
  },
  agency: {
    id: "ws_agency",
    name: "Lumina Event Studio",
    type: "professional" as const,
    ownerId: "usr_souvik",
    brandName: "Lumina Experiences & Productions",
    brandLogo: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=128&q=80",
    brandColor: "#4559D8",
    subscriptionTier: "pro" as const,
  },
};

export const seedWeddingEvent = {
  id: "evt_wedding_jaipur",
  workspaceId: "ws_personal",
  name: "Maya & Arjun's Destination Wedding",
  occasion: "Royal Heritage 3-Day Wedding Celebration",
  category: "wedding" as const,
  dateMode: "decided" as const,
  startDate: "2026-11-14",
  endDate: "2026-11-16",
  timezone: "Asia/Kolkata",
  locationMode: "in_person" as const,
  locationAddress: "Jaigarh Palace & Heritage Courtyards, Jaipur, Rajasthan",
  guestCount: 180,
  currency: "INR",
  targetBudget: 4500000,
  style: "Regal Marwar grandeur meets contemporary floral minimalism",
  constraints: "All meals strictly vegetarian; noise curfew at 10:30 PM in outer courtyard; step-free access for grandparents.",
  createdBy: "usr_souvik",
  status: "planning" as const,
};

export const weddingPlanContent: EventPlan = {
  schemaVersion: "1",
  summary:
    "A magnificent 3-day royal palace celebration bringing together 180 close family and friends across Sangeet, Mehendi, and Traditional Mandap ceremony.",
  assumptions: [
    "180 confirmed guests traveling to Jaipur; accommodation arranged at Jaigarh Palace suites & partner boutique havelis.",
    "Three core curated functions: Day 1 Sundowner Welcome, Day 2 Sangeet Gala, Day 3 Sunset Phere & Feast.",
    "Traditional Rajasthani folk artists paired with modern acoustic live band.",
    "Sustainable decor utilizing locally sourced Marigold, Mogra, and handcrafted brass lanterns.",
  ],
  openQuestions: [
    "Finalize exact drone filming permits for heritage airspace above Jaigarh fort.",
    "Decide whether to provide shuttle coaches from airport or private chauffeured cars.",
    "Confirm custom fragrance bar gift preferences for guest welcome baskets.",
  ],
  budget: {
    currency: "INR",
    target: 4500000,
    items: [
      {
        id: "b_1",
        category: "Venue & Havelis",
        label: "Palace Courtyard & Suite Booking (3 Nights)",
        lowEstimate: 1600000,
        likelyEstimate: 1800000,
        highEstimate: 2000000,
        rationale: "Heritage property buyout including courtyards and lawn permits",
        isEstimate: true,
      },
      {
        id: "b_2",
        category: "Catering & Banquets",
        label: "Artisanal Royal Rajasthani & Continental Banquets (5 Meals)",
        lowEstimate: 1100000,
        likelyEstimate: 1250000,
        highEstimate: 1400000,
        rationale: "180 guests across 5 seatings, live chaat galleria, dessert studio",
        isEstimate: true,
      },
      {
        id: "b_3",
        category: "Decor & Production",
        label: "Floral Architecture, Mandap & Architectural Illumination",
        lowEstimate: 650000,
        likelyEstimate: 750000,
        highEstimate: 850000,
        rationale: "Zero-foam floral installations and warm amber architectural lighting",
        isEstimate: true,
      },
      {
        id: "b_4",
        category: "Photography & Film",
        label: "Cinematic Documentary Crew & Live Stream Link",
        lowEstimate: 350000,
        likelyEstimate: 400000,
        highEstimate: 480000,
        rationale: "4-camera crew, drone coverage, same-day highlight reel",
        isEstimate: true,
      },
      {
        id: "b_5",
        category: "Music & Entertainment",
        label: "Folk Troupe, Sangeet Live Band & DJ",
        lowEstimate: 250000,
        likelyEstimate: 300000,
        highEstimate: 350000,
        rationale: "Manganiyar master musicians + evening DJ setup",
        isEstimate: true,
      },
    ],
  },
  tasks: [
    {
      id: "t_1",
      title: "Confirm Palace deposit and sign master event contract",
      description: "Review heritage guidelines, noise restriction clauses, and backup rain banquet hall.",
      priority: "critical",
      dueDate: "2026-06-15",
      dependsOn: [],
    },
    {
      id: "t_2",
      title: "Tasting session with Royal Heritage Chef",
      description: "Taste test 4 thali variants, artisanal millet breads, and seasonal desserts.",
      priority: "high",
      dueDate: "2026-07-20",
      dependsOn: ["t_1"],
    },
    {
      id: "t_3",
      title: "Finalize Mandap floral schematic with local florist co-op",
      description: "Approve natural Mogra canopy and marigold cascades for sunset ceremony.",
      priority: "high",
      dueDate: "2026-08-10",
      dependsOn: ["t_1"],
    },
    {
      id: "t_4",
      title: "Guest flight coordinator and airport transfer roster",
      description: "Consolidate 180 guest arrival flights into 4 grouped luxury bus waves.",
      priority: "medium",
      dueDate: "2026-09-25",
      dependsOn: [],
    },
    {
      id: "t_5",
      title: "Sound limiter and heritage noise compliance check",
      description: "Calibrate courtyard dB meter with Palace operations manager.",
      priority: "medium",
      dueDate: "2026-10-10",
      dependsOn: ["t_1"],
    },
  ],
  vendorCategories: [
    {
      category: "Heritage Venue & Hospitality",
      selectionCriteria: ["Palace permit experience", "In-house backup generator capacity"],
      questionsToAsk: ["What is the rain contingency plan for the central courtyard?"],
    },
    {
      category: "Artisanal Catering",
      selectionCriteria: ["Zero single-use plastic policy", "Heritage recipe authenticity"],
      questionsToAsk: ["Can you accommodate Jain dietary needs without cross-contact?"],
    },
  ],
  ideas: [
    {
      title: "Attar & Fragrance Bar",
      description: "Local perfumers craft personalized organic rose and sandalwood roll-ons for each guest.",
      category: "Sensory & Favors",
      estimatedCostImpact: "low",
    },
    {
      title: "Live Miniature Painting Artist",
      description: "Rajasthani miniature artist paints guest souvenir postcards live during Mehendi.",
      category: "Art & Entertainment",
      estimatedCostImpact: "low",
    },
  ],
  risks: [
    {
      risk: "Sudden afternoon dust storm (Aandhi) during outdoor sundowner",
      mitigation: "Courtyard perimeter drop-down canvas shades installed; backup banquet hall on standby.",
    },
    {
      risk: "10:30 PM courtyard sound curfew violation",
      mitigation: "Transition all late-night dancing to soundproof palace subterranean hall at 10:15 PM sharp.",
    },
  ],
  runOfShow: [
    { time: "16:30", activity: "Guest arrival & welcome Shehnai recital", owner: "Souvik Chakraborty" },
    { time: "17:30", activity: "Sunset Phere & floral petal shower", owner: "Pandit Ji & Lead Host" },
    { time: "19:00", activity: "Courtyard Cocktail Gala & Manganiyar ensemble", owner: "Elena Rostova" },
    { time: "20:30", activity: "Royal Thali Dinner & Toast", owner: "Catering Captain" },
    { time: "22:15", activity: "Indoor haveli afterparty", owner: "DJ & Coordinator" },
  ],
};

export const seedCorporateEvent = {
  id: "evt_apex_summit",
  workspaceId: "ws_agency",
  name: "Apex Global Summit & Leadership Dinner",
  occasion: "Annual Executive Strategy Forum & VIP Keynote",
  category: "work_event" as const,
  dateMode: "decided" as const,
  startDate: "2026-12-04",
  endDate: "2026-12-04",
  timezone: "America/New_York",
  locationMode: "hybrid" as const,
  locationAddress: "The Glasshouse at Chelsea Piers, New York, NY",
  guestCount: 120,
  currency: "USD",
  targetBudget: 65000,
  style: "Minimalist executive sophistication, brushed aluminum and botanical green",
  constraints: "Live 4K encrypted stream to European offices; secure NDA badges required.",
  createdBy: "usr_souvik",
  status: "planning" as const,
};

export const corporatePlanContent: EventPlan = {
  schemaVersion: "1",
  summary:
    "A high-impact 1-day executive summit and plated dinner for 120 C-suite leaders and partners, with synchronized hybrid broadcast to 800 global team members.",
  assumptions: [
    "120 VIP attendees on-site at The Glasshouse; 800 virtual participants on custom branded portal.",
    "Morning keynotes, afternoon roundtables, and sunset waterfront dinner.",
    "Full redundant fiber connection for zero-latency video streaming.",
  ],
  openQuestions: [
    "Select keynote speaker gift: custom engraved fountain pen or bespoke leather portfolio?",
    "Confirm security clearance protocol for two visiting dignitaries.",
  ],
  budget: {
    currency: "USD",
    target: 65000,
    items: [
      {
        id: "cb_1",
        category: "Venue & Production",
        label: "The Glasshouse Venue Rental & Stage Tech",
        lowEstimate: 22000,
        likelyEstimate: 25000,
        highEstimate: 28000,
        rationale: "Hudson river panorama, LED video wall, professional audio rigging",
        isEstimate: true,
      },
      {
        id: "cb_2",
        category: "Catering & Wine",
        label: "Executive Breakfast, Bento Lunch & 4-Course Dinner",
        lowEstimate: 16000,
        likelyEstimate: 18500,
        highEstimate: 21000,
        rationale: "Michelin-partnered catering with sommelier wine pairing",
        isEstimate: true,
      },
      {
        id: "cb_3",
        category: "AV & Live Broadcast",
        label: "Hybrid Multi-Camera Broadcast & Recording Studio",
        lowEstimate: 10000,
        likelyEstimate: 12000,
        highEstimate: 14000,
        rationale: "Encrypted stream pipeline, real-time closed captions",
        isEstimate: true,
      },
    ],
  },
  tasks: [
    {
      id: "ct_1",
      title: "Sign Glasshouse master contract and certificate of insurance",
      priority: "critical",
      dueDate: "2026-09-01",
      dependsOn: [],
    },
    {
      id: "ct_2",
      title: "Audit dedicated fiber and backup satellite internet",
      priority: "high",
      dueDate: "2026-10-15",
      dependsOn: ["ct_1"],
    },
    {
      id: "ct_3",
      title: "Dispatch physical VIP credentials with NFC chips",
      priority: "medium",
      dueDate: "2026-11-10",
      dependsOn: [],
    },
  ],
  vendorCategories: [
    {
      category: "Enterprise Broadcast Production",
      selectionCriteria: ["Redundant streaming encoding hardware", "Live multilingual captioning capabilities"],
      questionsToAsk: ["What is your SLA if primary cellular bond drops?"],
    },
  ],
  ideas: [
    {
      title: "Interactive Digital Roundtable Graph",
      description: "Real-time attendee polling visualized as an evolving dynamic graph projected on the ambient perimeter screens.",
      category: "Technology",
      estimatedCostImpact: "low",
    },
  ],
  risks: [
    {
      risk: "Severe winter weather impacting regional flights into JFK/LGA",
      mitigation: "All executive speakers briefed on remote studio broadcast contingency.",
    },
  ],
  runOfShow: [
    { time: "08:30", activity: "VIP Registration & Espresso Bar", owner: "Lumina Concierge" },
    { time: "09:30", activity: "Opening Keynote: Future of Intelligence", owner: "Keynote Chair" },
    { time: "12:30", activity: "Curated Executive Working Lunch", owner: "Catering Lead" },
    { time: "18:30", activity: "Waterfront Cocktail Reception & Sunset Dinner", owner: "Elena Rostova" },
  ],
};
