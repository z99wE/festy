export interface BudgetItem {
  id: string;
  category: string;
  label: string;
  percentage: number;
  lowRatio: number;
  highRatio: number;
  vendorNotes: string;
}

export interface TaskItem {
  id: string;
  title: string;
  offset: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  completed: boolean;
}

export interface VendorCategory {
  category: string;
  criteria: string[];
  questions: string[];
}

export interface OccasionArchetype {
  id: string;
  label: string;
  subtitle: string;
}

export const OCCASIONS: OccasionArchetype[] = [
  { id: 'birthday', label: 'Milestone Birthday', subtitle: 'Fun, energetic, personal memories' },
  { id: 'wedding', label: 'Joyful Wedding', subtitle: 'Heartfelt, elegant, multi-generational' },
  { id: 'family_reunion', label: 'Family Reunion', subtitle: 'Multi-day, garden feasts & keepsakes' },
  { id: 'cultural_fest', label: 'Cultural Festival', subtitle: 'Heritage, banquets & lantern spectacles' },
  { id: 'community', label: 'Community Carnival', subtitle: 'Street festival, vibrant, open-air' },
  { id: 'retreat', label: 'Offsite & Retreat', subtitle: 'Luxury lodges, strategy & nature breaks' },
  { id: 'festival', label: 'Music & Street Fest', subtitle: 'Live stages, street food & high vibe' },
  { id: 'work', label: 'Gala & Showcase', subtitle: 'Impactful, polished, team celebration' },
];

export const BUDGET_CATEGORIES: BudgetItem[] = [
  {
    id: 'b1',
    category: 'Venue & Staging',
    label: 'Main space rental, festive lighting & setup',
    percentage: 0.32,
    lowRatio: 0.28,
    highRatio: 0.36,
    vendorNotes: 'Verify load-in hours, sound curfew & AV equipment compatibility.',
  },
  {
    id: 'b2',
    category: 'Food & Refreshments',
    label: 'Interactive food stations, drinks & custom cake/bites',
    percentage: 0.38,
    lowRatio: 0.34,
    highRatio: 0.42,
    vendorNotes: 'Confirm dietary accommodations (vegan, gluten-free, allergy-safe).',
  },
  {
    id: 'b3',
    category: 'Sound & Entertainment',
    label: 'Live performers, microphones, DJ & ambiance',
    percentage: 0.14,
    lowRatio: 0.12,
    highRatio: 0.18,
    vendorNotes: 'Review playlist constraints and generator power needs.',
  },
  {
    id: 'b4',
    category: 'Decor & Atmosphere',
    label: 'Warm festoon lighting, florals, signage & photo backdrops',
    percentage: 0.10,
    lowRatio: 0.08,
    highRatio: 0.12,
    vendorNotes: 'Opt for reusable/biodegradable celebration elements.',
  },
  {
    id: 'b5',
    category: 'Safety & Contingency Buffer',
    label: 'Weather backup, extra supplies & emergency fund',
    percentage: 0.06,
    lowRatio: 0.05,
    highRatio: 0.08,
    vendorNotes: 'Reserved for unexpected last-minute additions.',
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  { id: 't1', title: 'Lock down date & send save-the-dates', offset: '8 weeks out', priority: 'critical', completed: true },
  { id: 't2', title: 'Confirm venue contract & deposit', offset: '6 weeks out', priority: 'high', completed: true },
  { id: 't3', title: 'Review caterer menu tastings & dietary counts', offset: '4 weeks out', priority: 'high', completed: false },
  { id: 't4', title: 'Finalize music playlist & speaker cues', offset: '2 weeks out', priority: 'medium', completed: false },
  { id: 't5', title: 'Distribute run-of-show to key volunteers / vendors', offset: '3 days out', priority: 'critical', completed: false },
  { id: 't6', title: 'Festival day kickoff & welcoming the crowd', offset: 'Day of event', priority: 'high', completed: false },
];

export const PLAN_IDEAS = [
  {
    title: 'Festival Welcome Sips Station',
    desc: 'Greet guests with chilled citrus spritzers and warm cider upon entry before mingling starts.',
    impact: 'Low cost, high experiential warmth',
  },
  {
    title: 'Interactive Audio Guestbook & Memory Wall',
    desc: 'Set up a rotary phone station where guests record voice wishes, paired with instant photo strips.',
    impact: 'Medium cost, cherished keepsake',
  },
  {
    title: 'Starlight Lantern Finale',
    desc: 'Conclude the celebration with glowing warm amber lanterns and a coordinated group toast.',
    impact: 'Minimal cost, unforgettable visual wrap',
  },
];

export const PLAN_RISKS = [
  {
    risk: 'Unplanned weather change (rain/wind for outdoor areas)',
    mitigation: 'Pre-secured marquee rental option with 48h cancellation clause.',
  },
  {
    risk: 'Vendor arrival delays during peak traffic hours',
    mitigation: 'Stagger load-in times 90 minutes earlier than run-of-show start.',
  },
  {
    risk: 'Guest count surge past initial RSVP headcount',
    mitigation: 'Requested 10% food buffer margin from caterer guaranteed in contract.',
  },
];
