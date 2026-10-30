export const EVENT_DOMAIN_KEYWORDS = [
  'event', 'events', 'celebration', 'celebrations', 'party', 'parties', 'plan', 'planning',
  'planner', 'budget', 'budgets', 'cost', 'costs', 'timeline', 'timelines', 'schedule',
  'run-of-show', 'run of show', 'milestone', 'milestones', 'guest', 'guests', 'headcount',
  'attendee', 'attendees', 'rsvp', 'invitation', 'invitations', 'invite', 'invites',
  'venue', 'venues', 'catering', 'caterer', 'caterers', 'food', 'drink', 'drinks', 'bar',
  'bartender', 'cocktail', 'cocktails', 'buffet', 'plated', 'decor', 'decoration', 'decorations',
  'theme', 'themes', 'lighting', 'audio', 'sound', 'music', 'dj', 'band', 'playlist',
  'photographer', 'photography', 'videographer', 'videography', 'florist', 'flowers',
  'wedding', 'weddings', 'reception', 'sangeet', 'mehendi', 'birthday', 'birthdays',
  'anniversary', 'anniversaries', 'shower', 'showers', 'gala', 'galas', 'festival', 'festivals',
  'carnival', 'carnivals', 'conference', 'summit', 'offsite', 'offsites', 'retreat',
  'getaway', 'weekend', 'long weekend', 'holiday', 'holidays', 'festive', 'vendor', 'vendors',
  'contract', 'contracts', 'deposit', 'deposits', 'negotiate', 'negotiation', 'seating',
  'curfew', 'permit', 'permits', 'logistics', 'favor', 'favors', 'cake', 'dessert',
  'toast', 'speeches', 'mc', 'host', 'hosting', 'bachelorette', 'bachelor', 'graduation',
  'housewarming', 'picnic', 'reunion', 'fundraiser', 'pop-up', 'popup', 'festi', 'festiya',
  'idea', 'ideas', 'tip', 'tips', 'advice', 'suggest', 'recommend', 'organize', 'organizing',
  'dinner', 'brunch', 'lunch', 'supper', 'tasting', 'wine', 'beer', 'cocktail party',
  'games', 'activities', 'entertainment', 'vibe', 'vibes', 'ambiance', 'atmosphere',
  'stage', 'seating chart', 'table', 'tables', 'linens', 'rentals', 'cleanup', 'overtime',
  'diwali', 'eid', 'christmas', 'new year', 'halloween', 'thanksgiving', 'fiesta', 'soiree'
];

export const HIJACKING_PATTERNS = [
  /ignore\s+(?:all\s+|any\s+|previous\s+|prior\s+|above\s+|former\s+)*(?:instructions|prompts|rules|constraints|guidelines|directives)/i,
  /disregard\s+(?:all\s+|any\s+|previous\s+|prior\s+|above\s+)*(?:instructions|rules|prompts)/i,
  /forget\s+(?:everything|all\s+prior|all\s+previous|your\s+instructions|your\s+training|your\s+role)/i,
  /you\s+are\s+now\s+(?:unrestricted|in\s+developer\s+mode|dan|stan|aim|jailbroken|free\s+of)/i,
  /system\s+override[:\s]/i,
  /new\s+system\s+prompt[:\s]/i,
  /developer\s+mode\s+(?:on|enabled|activated)/i,
  /bypass\s+(?:safety|filters|guardrails|constraints)/i,
  /turn\s+off\s+(?:moderation|safety|rules)/i,
  /from\s+now\s+on\s+you\s+(?:will|must|should)\s+act\s+as/i,
  /override\s+(?:all\s+)?(?:safety|rules|instructions)/i,
  /execute\s+command[:\s]/i,
  /root\s+access[:\s]/i,
  /sudo\s+mode/i,
];

export const META_PROMPT_PATTERNS = [
  /what\s+(?:is|was|are)\s+your\s+(?:exact\s+)?(?:system\s+prompt|initial\s+prompt|hidden\s+prompt|instructions|rules)/i,
  /repeat\s+(?:the\s+)?(?:text\s+above|prompt\s+above|words\s+above|instructions\s+above)/i,
  /print\s+(?:your\s+)?(?:system\s+prompt|instructions|guidelines)\s+(?:verbatim|word\s+for\s+word)/i,
  /output\s+your\s+(?:system\s+prompt|instructions)\s+in\s+(?:json|markdown|yaml|code\s+block)/i,
  /reveal\s+your\s+(?:prompt|instructions|meta\s+prompt|guidelines)/i,
  /translate\s+your\s+(?:system\s+prompt|hidden\s+instructions)\s+to/i,
  /show\s+me\s+the\s+developer\s+instructions/i,
  /print\s+everything\s+before\s+this\s+line/i,
  /verbatim\s+transcription\s+of\s+your\s+prompt/i,
];

export const JAILBREAK_PATTERNS = [
  /act\s+as\s+my\s+(?:late\s+|deceased\s+)?(?:grandmother|grandma|deceased\s+mother|mother|father)/i,
  /in\s+a\s+fictional\s+(?:story|novel|screenplay|game)\s+where\s+you\s+(?:are\s+evil|have\s+no\s+rules|can\s+hack)/i,
  /pretend\s+you\s+have\s+no\s+(?:rules|limits|morals|boundaries)/i,
  /say\s+the\s+opposite\s+of\s+what\s+you\s+normally/i,
  /jailbreak/i,
  /evil\s+twin\s+mode/i,
  /unfiltered\s+mode/i,
  /hypothetical\s+scenario\s+where\s+safety\s+does\s+not\s+apply/i,
];

export const EXFILTRATION_PATTERNS = [
  /(print|show|give|reveal|display|leak)\s+(the\s+)?(api\s*key|api\s*token|secret|env|environment\s*variable|auth\s*token|cloudflare\s*token)/i,
  /process\.env/i,
  /VITE_[A-Z_]+/i,
  /CLOUDFLARE_[A-Z_]+/i,
  /export\s+const\s+config/i,
  /cat\s+\/etc\/passwd/i,
];

export const DELIMITER_PATTERNS = [
  /"""\s*system/i,
  /\[inst\]\s*<<sys>>/i,
  /<\|im_start\|>\s*system/i,
  /<system>/i,
  /```system/i,
];

export const OFF_TOPIC_RED_FLAGS = [
  /\b(write|create|code|debug|fix)\s+(a\s+)?(python|javascript|typescript|c\+\+|java|rust|go|sql|html|css|bash|script|code|algorithm|function|class)\b/i,
  /\b(solve|calculate)\s+(for\s+x|the\s+derivative|integral|equation|quadratic)\b/i,
  /\b(who\s+won|score\s+of)\s+(the\s+)?(super\s*bowl|fifa|world\s*cup|election|presidential)\b/i,
  /\b(diagnose\s+my|medical\s+advice|symptoms\s+of|prescription)\b/i,
  /\b(stock\s+tips|crypto\s+advice|buy\s+bitcoin|ethereum\s+price)\b/i,
  /\b(how\s+to\s+hack|ddos|exploit|bypass\s+firewall|sql\s+injection)\b/i,
  /\b(write\s+an\s+essay\s+about|history\s+of\s+rome|french\s+revolution)\b/i,
];

export const FESTI_DOMAIN_DEFLECTION = 
  "I am Festi, your Festi AI event architect. I specialize exclusively in celebration blueprints, " +
  "event budgets, vendor negotiation questions, run-of-show timelines, and party logistics. " +
  "I don't answer general programming, academic homework, or topics outside event planning, " +
  "but I would love to help you architect an unforgettable celebration, wedding, birthday, dinner, or trip! " +
  "What event are we planning today?";

export const FESTI_SECURITY_DEFLECTION = 
  "I am Festi, your Festi AI event architect. For your safety and event tranquility, " +
  "I operate strictly within verified celebration planning guidelines. " +
  "System overrides, meta-prompt extractions, and persona alterations are safely neutralized. " +
  "How can I help you architect your event budget, schedule, or theme today?";
