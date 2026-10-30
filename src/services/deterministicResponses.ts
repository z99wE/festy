const TIMELINE_TERMS = ['run of show', 'run-of-show', 'minute-by-minute', 'timeline', 'schedule', 'agenda'];
const BUDGET_TERMS = ['budget', 'optimize', 'save', 'cost', 'price', '$', '20%'];
const VENDOR_TERMS = ['vendor', 'negotiat', 'question', 'contract', 'cater', 'venue', 'dj'];
const SENSORY_TERMS = ['idea', 'decor', 'theme', 'unique', 'sensory', 'experience'];
const BIRTHDAY_TERMS = ['birthday', 'bday', 'sweet 16', '50th', '30th', '40th', '21st'];
const WEDDING_TERMS = ['wedding', 'reception', 'bride', 'groom', 'marriage'];
const INTRO_TERMS = ['what can you do', 'how does', 'who are you', 'help', 'start', 'features', 'what do you do'];

function containsAny(query: string, terms: string[]): boolean {
  return terms.some((term) => query.includes(term));
}

function resolveOccasionLabel(q: string): string {
  if (q.includes('wedding')) return 'Wedding Celebration';
  if (q.includes('birthday')) return 'Milestone Birthday Party';
  if (q.includes('retreat') || q.includes('offsite')) return 'Leadership Offsite';
  if (q.includes('festival')) return 'Music Festival & Carnival';
  return 'Celebration Blueprint';
}

function buildTimelineResponse(q: string): string {
  const occasion = resolveOccasionLabel(q);
  return `Festi AI Day-of Run of Show Blueprint (${occasion}):\n\n` +
    `• 08:00 – 10:30 | Load-in & Production Grid: Vendor arrivals, staging power drops, A/V line checks, and emergency contact verification.\n` +
    `• 11:00 – 13:30 | Catering & Floral Staging: Cold prep arrival, linen steaming, bar glassware alignment, and environmental lighting focus.\n` +
    `• 16:30 – 17:30 | Guest Arrival & Welcome Atmosphere: Low-tempo acoustic playlist, signature welcome drinks passed, and photo moment greeting.\n` +
    `• 17:30 – 18:15 | Main Kickoff / Ceremony / Keynote: Sound cues active, house lights dimmed, primary program executed with zero lag.\n` +
    `• 18:30 – 20:30 | Feast & Coordinated Toasts: Family-style courses served; 3-minute max toast intervals scheduled between entrees.\n` +
    `• 20:30 – 23:00 | Prime Entertainment & High-Energy Celebration: Dance floor opening crescendo, dessert stations active, late-night savory bite pass.\n` +
    `• 23:00 – 00:00 | Soft Load-Out & Egress: Ambient lighting shift, safe guest transport/rideshare dispatch, vendor walk-through and deposit sign-off.`;
}

function buildBudgetResponse(): string {
  return `Festi AI Budget Allocation & 20% Cost Optimization Architecture:\n\n` +
    `1. High-Calm Resource Distribution:\n` +
    `   • Catering, Food & Bar (38–42%): The single most impactful sensory touchpoint.\n` +
    `   • Venue & Basic Infrastructure (24–28%): Space layout, power drops, security.\n` +
    `   • Entertainment & Sound/Lighting (12–15%): Sound engineering & lighting transitions.\n` +
    `   • Photography & Media Capture (10–12%): High-res memories, golden-hour coverage.\n` +
    `   • Contingency Reserve (8–10%): Mandatory buffer for unexpected weather or overtime.\n\n` +
    `2. Top 3 High-Leverage Strategies to Save 20%:\n` +
    `   • Switch to Interactive Food Stations: Cuts server headcount by 40% compared to formal multi-course plated service.\n` +
    `   • Ambient Architectural Uplighting: Warm LED perimeter washes cost 70% less than exorbitant floral installations and create double the visual warmth.\n` +
    `   • Fixed Bar Package vs. Consumption: Negotiate a flat per-head open bar with 2 signature cocktails to eliminate surprise midnight overages.`;
}

function buildVendorResponse(): string {
  return `Festi AI Vendor Negotiation Battle-Tested Script:\n\n` +
    `Ask every shortlisted vendor these 5 non-negotiable questions before signing:\n\n` +
    `1. "What is the comprehensive 'out-the-door' quote including service fees, taxes, and gratuity?"\n` +
    `   (Venues and caterers frequently add 20–26% admin fees that aren't on initial pricing sheets).\n\n` +
    `2. "What are the exact load-in and load-out hour restrictions, and what is your per-minute overtime rate?"\n` +
    `   (Prevents sudden $500/hour penalty fees if celebrations run 20 minutes late).\n\n` +
    `3. "What happens if our primary contact, chef, or lead artist is sick or incapacitated on event day?"\n` +
    `   (Verify named backup coverage in writing directly inside the contract SLA).\n\n` +
    `4. "Can we provide our own specialty wine or spirits with a capped flat corkage fee?"\n` +
    `   (Typically saves $1,000–$3,000 on beverage packages).\n\n` +
    `5. "What is the tiered milestone cancellation and force-majeure rescheduling policy?"\n` +
    `   (Never agree to 100% non-refundable deposits beyond the initial 25% booking fee).`;
}

function buildSensoryResponse(): string {
  return `Festi AI Multi-Sensory Celebration Blueprint:\n\n` +
    `• Visual Impact: Ditch generic printed banners; install ambient 2700K warm wash perimeter lighting, customized vintage brass signage, and a dedicated high-contrast photo wall.\n` +
    `• Auditory Arc: Transition the room energy deliberately: Start with acoustic lo-fi jazz during welcome drinks (60–75 BPM), build to upbeat neo-soul during dinner (85–100 BPM), and crescendo to nu-disco dance rhythms (118–124 BPM).\n` +
    `• Taste & Scent: Introduce a signature aromatic element (fresh rosemary smoked cocktails or warm cinnamon sugar beignets passed at 22:00) that anchors olfactory memories for years.\n` +
    `• Interactive Guest Moment: A live audio guestbook booth or a polaroid keepsake wall where guests write memories creates instant intimacy without awkward icebreakers.`;
}

function buildBirthdayResponse(): string {
  return `Festi AI Milestone Birthday Celebration Blueprint:\n\n` +
    `• 8 Weeks Out: Lock the venue and choose a signature concept (e.g. Havana Nights, Neon Velvet Lounge, or Golden Hour Rooftop).\n` +
    `• 4 Weeks Out: Send calendar invitations with explicit dress codes and dietary preference collection.\n` +
    `• 2 Weeks Out: Finalize the 2 signature drinks ('The Birthday Toast' + 'The Designated Driver Cooler') and order custom dessert displays.\n` +
    `• Day-of Pro-Tip: Cue the tribute speeches or video slideshow strictly right BEFORE the main cake cutting—never when the dance floor is already rocking!`;
}

function buildWeddingResponse(): string {
  return `Festi AI Dream Wedding Operational Architecture:\n\n` +
    `• Core Principle: Pick your top 2 non-negotiables (e.g., exceptional food + killer live band). Spend 60% of your emotional energy and budget on those two, and streamline everything else.\n` +
    `• Pacing Secret: Keep the transition between ceremony and dinner under 75 minutes. Long cocktail hours without seating cause guest energy slumps.\n` +
    `• Vendor Harmony: Ensure the photographer, DJ/MC, and caterer share a single master run-of-show so courses are never served during speeches.`;
}

function buildIntroResponse(): string {
  return `Welcome to Festi AI! I'm Festi, your autonomous celebration architect.\n\n` +
    `Here is how I can build your next event:\n` +
    `• 3-Tier Budget Synthesizer: Dial in exact cost allocations and discover ways to save 20% on vendors.\n` +
    `• Day-of Run-of-Show Generator: Minute-by-minute cues for seamless pacing from load-in to egress.\n` +
    `• Vendor Negotiation Scripts: The exact questions to ask caterers, venues, and DJs to avoid thousands in hidden fees.\n` +
    `• Sensory Decor & Themes: Lighting, music BPM arcs, and immersive guest experiences.\n\n` +
    `Try asking me: "Plan a 40th birthday for 40 guests on a $4,000 budget" or "Give me a run-of-show schedule for a wedding"!`;
}

const DEFAULT_BLUEPRINT = `Festi AI Celebration Master Blueprint:\n\n` +
  `Here is the 3-step action roadmap to execute your celebration vision:\n\n` +
  `1. Parameter Lock: Establish your guest range and 3-tier budget (Comfort, Likely, Dream). This prevents endless vendor quote renegotiations.\n` +
  `2. Pacing & Flow: Anchor your key milestones (Guest arrival, main feature/toasts, prime celebration, soft egress) with intentional lighting and music cues.\n` +
  `3. Vendor Shielding: Request all vendor estimates as itemized "out-the-door" totals including overtime, taxes, and service charges.\n\n` +
  `Would you like to build an itemized budget breakdown or generate a minute-by-minute schedule?`;

export function generateDeterministicResponse(userQuery: string): string {
  const q = userQuery.toLowerCase();

  if (containsAny(q, TIMELINE_TERMS)) return buildTimelineResponse(q);
  if (containsAny(q, BUDGET_TERMS)) return buildBudgetResponse();
  if (containsAny(q, VENDOR_TERMS)) return buildVendorResponse();
  if (containsAny(q, SENSORY_TERMS)) return buildSensoryResponse();
  if (containsAny(q, BIRTHDAY_TERMS)) return buildBirthdayResponse();
  if (containsAny(q, WEDDING_TERMS)) return buildWeddingResponse();
  if (containsAny(q, INTRO_TERMS)) return buildIntroResponse();

  return DEFAULT_BLUEPRINT;
}
