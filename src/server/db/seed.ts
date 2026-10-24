/**
 * Festiya Demo Data Seeder
 * Populates realistic synthetic sample data for personal and professional workspaces.
 * Strictly adheres to PRD rules (no prohibited terms, realistic currency and guest constraints).
 */

import { DatabaseAdapter } from "./database.ts";
import { EventPlan } from "../../types/index.ts";

export async function seedDemoData(db: DatabaseAdapter): Promise<void> {
  // Clear any existing
  await db.reset();

  const now = new Date().toISOString();

  // 1. Users
  const userSouvik = {
    id: "usr_souvik",
    email: "souvik@festiya.app",
    name: "Souvik Chakraborty",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    locale: "en-US",
    timezone: "Asia/Kolkata",
    createdAt: now,
    updatedAt: now,
  };

  const userElena = {
    id: "usr_elena",
    email: "elena@festiya.app",
    name: "Elena Rostova",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80",
    locale: "en-GB",
    timezone: "Europe/London",
    createdAt: now,
    updatedAt: now,
  };

  await db.createUser(userSouvik);
  await db.createUser(userElena);

  // 2. Workspaces: Personal & Professional Agency
  const personalWorkspace = {
    id: "ws_personal",
    name: "Souvik's Celebrations",
    type: "personal" as const,
    ownerId: userSouvik.id,
    brandName: "Moments by Souvik",
    subscriptionTier: "plus" as const,
    createdAt: now,
    updatedAt: now,
  };

  const agencyWorkspace = {
    id: "ws_agency",
    name: "Lumina Event Studio",
    type: "professional" as const,
    ownerId: userSouvik.id,
    brandName: "Lumina Experiences & Productions",
    brandLogo: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=128&q=80",
    brandColor: "#4559D8",
    subscriptionTier: "pro" as const,
    createdAt: now,
    updatedAt: now,
  };

  await db.createWorkspace(personalWorkspace);
  await db.createWorkspace(agencyWorkspace);

  await db.addWorkspaceMember({
    id: "wsm_1",
    workspaceId: personalWorkspace.id,
    userId: userSouvik.id,
    role: "owner",
    status: "active",
    createdAt: now,
  });

  await db.addWorkspaceMember({
    id: "wsm_2",
    workspaceId: agencyWorkspace.id,
    userId: userSouvik.id,
    role: "owner",
    status: "active",
    createdAt: now,
  });

  await db.addWorkspaceMember({
    id: "wsm_3",
    workspaceId: agencyWorkspace.id,
    userId: userElena.id,
    role: "planner",
    status: "active",
    createdAt: now,
  });

  // 3. Subscriptions
  await db.saveSubscription({
    id: "sub_1",
    workspaceId: personalWorkspace.id,
    tier: "plus",
    status: "active",
    currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
    paymentProvider: "stripe",
    createdAt: now,
    updatedAt: now,
  });

  await db.saveSubscription({
    id: "sub_2",
    workspaceId: agencyWorkspace.id,
    tier: "pro",
    status: "active",
    currentPeriodEnd: new Date(Date.now() + 365 * 86400000).toISOString(),
    paymentProvider: "stripe",
    createdAt: now,
    updatedAt: now,
  });

  // 4. Event 1: Maya & Arjun's Destination Wedding in Jaipur (Personal Workspace)
  const weddingEvent = {
    id: "evt_wedding_jaipur",
    workspaceId: personalWorkspace.id,
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
    createdBy: userSouvik.id,
    status: "planning" as const,
    createdAt: now,
    updatedAt: now,
  };
  await db.createEvent(weddingEvent);

  const weddingPlanContent: EventPlan = {
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
        title: "Curate customized Brass Itinerary Baskets",
        description: "Include cold-pressed rose mist, itineraries, hangover kits, and local sweets.",
        priority: "medium",
        dueDate: "2026-10-15",
        dependsOn: [],
      },
    ],
    vendorCategories: [
      {
        category: "Palace Venue & Hospitality",
        selectionCriteria: [
          "Heritage monument compliance and verified safety credentials",
          "Dedicated on-site power backup and sound-proofed banquet hall after 10 PM",
          "Adequate guest room blocks on premises",
        ],
        questionsToAsk: [
          "What is the exact load capacity for Mandap structures on the upper lawn terrace?",
          "Are outside dessert and sweet vendors permitted without extra corkage?",
        ],
      },
      {
        category: "Fine Vegetarian Catering",
        selectionCriteria: [
          "Demonstrated track record of 300+ guest heritage destination weddings",
          "Organic and locally sourced seasonal winter ingredients",
        ],
        questionsToAsk: [
          "Can you cater customized Jain menu counters alongside international food bars?",
          "What is your ratio of live counter chefs to guests?",
        ],
      },
    ],
    ideas: [
      {
        title: "Starlight Sufi Acoustic Night under Jaigarh ramparts",
        description: "An intimate candlelit musical evening on the terrace lawn with glowing copper fire pits and warm spiced chai.",
        category: "Entertainment",
        estimatedCostImpact: "low",
      },
      {
        title: "Block-Printing Fabric Keepsake Atelier",
        description: "Live artisan counter where guests stamp their own monogrammed linen scarves using natural indigo and madder root dyes.",
        category: "Experience",
        estimatedCostImpact: "medium",
      },
      {
        title: "Sunset Chariot Welcome with Camel Drummers",
        description: "Grand traditional welcome procession as guests enter through the Ganesh Pol gates.",
        category: "Ceremony",
        estimatedCostImpact: "medium",
      },
    ],
    risks: [
      {
        risk: "Unseasonal November evening chill or dew on open lawns",
        mitigation: "Station 12 patio heaters around the dining lawn and provide handwoven pashmina shawls in welcome hampers.",
      },
      {
        risk: "Airport traffic delays during peak tourist season",
        mitigation: "Assign a dedicated on-ground transport captain with 2 standby tempo travellers at Jaipur Sanganer Airport.",
      },
    ],
    runOfShow: [
      { time: "16:00", activity: "Guest Welcome & Rose Water Sprinkling at Palace Portico", owner: "Souvik & Hospitality Team" },
      { time: "17:15", activity: "Sunset Mandap Procession (Baraat)", owner: "Arjun & Band Crew" },
      { time: "18:00", activity: "Vedic Sunset Pheras & Floral Blessing Ceremony", owner: "Head Priest & Maya's Family" },
      { time: "19:45", activity: "Royal Candlelit Banquet & Live Ghazal Ensemble", owner: "Executive Chef" },
      { time: "22:00", activity: "Indoor After-Party & Dessert Galleria", owner: "DJ & Sound Producer" },
    ],
  };

  await db.createPlan({
    id: "pln_wedding_1",
    eventId: weddingEvent.id,
    version: 1,
    schemaVersion: "1",
    status: "active",
    summary: weddingPlanContent.summary,
    assumptions: weddingPlanContent.assumptions,
    openQuestions: weddingPlanContent.openQuestions,
    content: weddingPlanContent,
    createdAt: now,
    updatedAt: now,
  });

  // Seed actual budget items
  await db.createBudgetItem({
    id: "bi_1",
    eventId: weddingEvent.id,
    category: "Venue & Havelis",
    label: "Jaigarh Palace Buyout Deposit",
    lowEstimate: 1600000,
    likelyEstimate: 1800000,
    highEstimate: 2000000,
    quotedAmount: 1750000,
    committedAmount: 1750000,
    actualAmount: 800000,
    currency: "INR",
    status: "committed",
    isEstimate: false,
    rationale: "Signed contract with 45% initial deposit paid",
    createdAt: now,
    updatedAt: now,
  });

  await db.createBudgetItem({
    id: "bi_2",
    eventId: weddingEvent.id,
    category: "Catering & Banquets",
    label: "Artisanal Royal Rajasthani Banquets",
    lowEstimate: 1100000,
    likelyEstimate: 1250000,
    highEstimate: 1400000,
    quotedAmount: 1200000,
    committedAmount: 0,
    actualAmount: 0,
    currency: "INR",
    status: "quoted",
    isEstimate: false,
    rationale: "Tasting confirmed with Chef Vikramaditya; awaiting final contract",
    createdAt: now,
    updatedAt: now,
  });

  await db.createBudgetItem({
    id: "bi_3",
    eventId: weddingEvent.id,
    category: "Decor & Production",
    label: "Floral Architecture & Mandap",
    lowEstimate: 650000,
    likelyEstimate: 750000,
    highEstimate: 850000,
    currency: "INR",
    status: "estimated",
    isEstimate: true,
    rationale: "Preliminary floral concept approved",
    createdAt: now,
    updatedAt: now,
  });

  // Seed tasks
  for (const t of weddingPlanContent.tasks) {
    await db.createTask({
      id: t.id,
      eventId: weddingEvent.id,
      title: t.title,
      description: t.description,
      status: t.id === "t_1" ? "done" : t.id === "t_2" ? "in_progress" : "todo",
      priority: t.priority,
      ownerName: "Souvik Chakraborty",
      dueDate: t.dueDate,
      dependsOn: t.dependsOn,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Seed vendors
  await db.createVendor({
    id: "vnd_1",
    eventId: weddingEvent.id,
    name: "Jaigarh Palace & Fort Heritage Trust",
    category: "Venue",
    contactName: "Mahaveer Singh",
    contactEmail: "events@jaigarhheritage.com",
    contactPhone: "+91 141 263 1200",
    website: "https://jaigarhheritage.com",
    notes: "Requires acoustic volume limiter after 10 PM. Backup banquet hall included in package.",
    quoteAmount: 1750000,
    quoteCurrency: "INR",
    status: "selected",
    createdAt: now,
    updatedAt: now,
  });

  await db.createVendor({
    id: "vnd_2",
    eventId: weddingEvent.id,
    name: "Marwar Culinary Arts & Hospitality",
    category: "Catering",
    contactName: "Chef Vikramaditya Rathore",
    contactEmail: "reservations@marwarculinary.in",
    contactPhone: "+91 98290 44122",
    notes: "Specializes in 100-year old heirloom recipes, organic ker-sangri, and live bajra rotla.",
    quoteAmount: 1200000,
    quoteCurrency: "INR",
    status: "quote_received",
    createdAt: now,
    updatedAt: now,
  });

  // Seed ideas
  for (const idea of weddingPlanContent.ideas) {
    await db.createIdea({
      id: `id_${Math.random().toString(36).substring(2, 8)}`,
      eventId: weddingEvent.id,
      title: idea.title,
      description: idea.description,
      category: idea.category,
      estimatedCostImpact: idea.estimatedCostImpact || "medium",
      isAccepted: idea.category === "Entertainment",
      createdAt: now,
    });
  }

  // Seed risks
  for (const r of weddingPlanContent.risks) {
    await db.createRisk({
      id: `rsk_${Math.random().toString(36).substring(2, 8)}`,
      eventId: weddingEvent.id,
      risk: r.risk,
      mitigation: r.mitigation,
      severity: "medium",
      isResolved: false,
      createdAt: now,
    });
  }

  // Seed Run of Show
  if (weddingPlanContent.runOfShow) {
    for (let i = 0; i < weddingPlanContent.runOfShow.length; i++) {
      const ros = weddingPlanContent.runOfShow[i];
      await db.createRunOfShow({
        id: `ros_${i + 1}`,
        eventId: weddingEvent.id,
        timeLabel: ros.time || "18:00",
        activity: ros.activity,
        ownerName: ros.owner,
        sortOrder: i,
        createdAt: now,
      });
    }
  }

  // Seed Share Link for Wedding
  await db.createShare({
    id: "shr_wedding_client",
    eventId: weddingEvent.id,
    shareToken: "festiya-demo-jaipur-wedding-token",
    role: "client",
    allowedSections: ["summary", "budget", "timeline", "vendors", "ideas", "runOfShow"],
    isRevoked: false,
    viewCount: 14,
    createdAt: now,
  });

  // 5. Event 2: Apex Global Summit & Leadership Dinner (Professional Agency Workspace)
  const corporateEvent = {
    id: "evt_apex_summit",
    workspaceId: agencyWorkspace.id,
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
    createdBy: userSouvik.id,
    status: "planning" as const,
    createdAt: now,
    updatedAt: now,
  };
  await db.createEvent(corporateEvent);

  const corporatePlanContent: EventPlan = {
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

  await db.createPlan({
    id: "pln_apex_1",
    eventId: corporateEvent.id,
    version: 1,
    schemaVersion: "1",
    status: "active",
    summary: corporatePlanContent.summary,
    assumptions: corporatePlanContent.assumptions,
    openQuestions: corporatePlanContent.openQuestions,
    content: corporatePlanContent,
    createdAt: now,
    updatedAt: now,
  });

  // Seed tasks, budget, vendors for corporate event
  for (const t of corporatePlanContent.tasks) {
    await db.createTask({
      id: t.id,
      eventId: corporateEvent.id,
      title: t.title,
      status: "todo",
      priority: t.priority,
      ownerName: "Elena Rostova",
      dueDate: t.dueDate,
      dependsOn: t.dependsOn,
      createdAt: now,
      updatedAt: now,
    });
  }

  await db.createBudgetItem({
    id: "cbi_1",
    eventId: corporateEvent.id,
    category: "Venue & Production",
    label: "The Glasshouse Rental",
    lowEstimate: 22000,
    likelyEstimate: 25000,
    highEstimate: 28000,
    quotedAmount: 24500,
    committedAmount: 24500,
    actualAmount: 10000,
    currency: "USD",
    status: "committed",
    isEstimate: false,
    createdAt: now,
    updatedAt: now,
  });

  // 6. Record sample usage ledger
  await db.recordUsage({
    id: "usg_1",
    workspaceId: personalWorkspace.id,
    feature: "plan_generate",
    quantity: 1,
    providerModel: "workers-ai/@cf/meta/llama-3.3-70b-instruct",
    estimatedCost: 0.004,
    requestId: "req_demo_01",
    createdAt: now,
  });

  await db.recordUsage({
    id: "usg_2",
    workspaceId: agencyWorkspace.id,
    feature: "plan_generate",
    quantity: 1,
    providerModel: "groq/llama-3.3-70b-versatile",
    estimatedCost: 0.005,
    requestId: "req_demo_02",
    createdAt: now,
  });

  // 7. Activity logs
  await db.logActivity({
    id: "act_1",
    workspaceId: personalWorkspace.id,
    eventId: weddingEvent.id,
    actorId: userSouvik.id,
    actorName: userSouvik.name,
    action: "event.created",
    entityType: "event",
    entityId: weddingEvent.id,
    createdAt: now,
  });

  await db.logActivity({
    id: "act_2",
    workspaceId: personalWorkspace.id,
    eventId: weddingEvent.id,
    actorId: userSouvik.id,
    actorName: userSouvik.name,
    action: "plan.generated",
    entityType: "plan",
    entityId: "pln_wedding_1",
    createdAt: now,
  });
}
