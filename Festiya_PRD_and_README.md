# Festiya — Product Requirements Document

**Tagline:** Turn every moment into a festival.

**Product:** Global AI-powered event planning and operations workspace  
**Deployment:** Cloudflare-first  
**Users:** Individuals, families, independent planners, event companies, community organisers

## 1. Product thesis

Event planning is scattered across chats, spreadsheets, saved posts, vendor calls, and mental checklists. People know what they want to celebrate but often do not know what to do first, how much it will cost, which vendors to contact, or how to keep everyone aligned.

Festiya turns an event idea into an editable plan: budget estimates, milestones, tasks, vendor categories, personalised ideas, risks, and next actions. The goal is not to generate more text; it is to make the next useful action obvious.

**Product question:** What if planning an event felt like discovering a great experience, rather than managing a stressful project?

Festiya is global in positioning, not tied to a single country or cultural aesthetic. The name is a working brand and requires trademark, domain, app-store, company-name, and social-handle clearance before launch.

## 2. Goals and success metrics

### Goals
1. Generate a usable first event plan in under two minutes under normal service conditions.
2. Keep plan, budget, timeline, tasks, vendor records, and ideas in one workspace.
3. Support personal events and repeatable professional client workflows.
4. Provide a useful free tier and credible paid upgrade path.
5. Deploy and operate the application primarily on Cloudflare.
6. Treat security, accessibility, testing, and code quality as release requirements.

### North-star metric
Weekly events that have an accepted plan section, a reviewed budget, and at least one completed task.

### Supporting metrics
Activation rate, time to first usable plan, plan retention after edits, task completion, shared-plan engagement, free-to-paid conversion, AI cost per plan, error rate, p95 latency, accessibility defects, and security-test pass rate.

## 3. Users and jobs to be done

### Individuals and families
- Understand what needs to happen and when.
- Stay within budget without sacrificing the experience.
- Get ideas tailored to guest count, style, location, date, and constraints.
- Coordinate family and friends without losing decisions.

### Independent planners
- Draft proposals quickly.
- Reuse templates.
- Manage multiple clients without mixing data.
- Convert approved plans into tasks, vendor follow-ups, and client-ready summaries.

### Event companies and agencies
- Standardise team workflows.
- Manage events, clients, budgets, vendors, and internal tasks.
- Create branded proposals and repeatable templates.
- Control access and track workspace activity.

### Community organisers and small businesses
- Plan meetups, workshops, cultural gatherings, school events, and employee celebrations with limited budgets and small teams.

## 4. Product scope

### P0 — First release
- Joyful discovery landing page and event-category entry points.
- Event brief with required and optional fields; partial drafts supported.
- Structured AI plan generation with validation and editable sections.
- Budget estimates, quotes, committed costs, actual costs, and remaining budget.
- Timeline and task checklist with owners, priorities, due dates, dependencies, and statuses.
- Vendor tracking with categories, contacts, user-entered quotes, and statuses.
- Personal and professional workspaces.
- Role-based collaboration and scoped, revocable share links.
- Secure authentication, persistent events, plan versions, export/deletion request flow.
- Demo event with synthetic sample data.
- Loading, empty, error, retry, permission-denied, and success states.
- Server-side AI usage limits and provider-independent routing.

### P1 — Monetisation and professional workflows
- Reusable event and agency templates.
- Branded client-ready proposal and plan exports.
- Read-only client share pages, comments, approval states.
- Multi-event planner dashboard, version comparison, activity history.
- Billing, subscription entitlements, usage meter, and customer portal.
- Email notifications with consent and unsubscribe controls.

### P2 — Later
- Guest list and RSVP, seating support, calendar integrations.
- Moderated and verified vendor directory.
- Vendor inquiry drafting with user confirmation before sending.
- More languages and locale-specific templates.
- Team workload analytics and vendor payments only after legal and operational review.

### Explicit non-goals
No guaranteed vendor marketplace, live availability claims without a verified source, autonomous booking, unapproved sending/spending, public social feed, or full accounting/CRM suite.

## 5. Core user journeys

### Idea to plan
1. Select **Plan an event**.
2. Enter event type, date or “not decided”, location/time zone, guest count, currency/budget, style, and constraints.
3. Skip optional questions if desired.
4. Receive an editable draft: concept, assumptions, budget categories, timeline, tasks, vendor criteria, ideas, risks, and optional run-of-show.
5. Review assumptions, accept or edit sections, and save.

### Plan to execution
1. View next actions, upcoming milestones, overdue tasks, and budget health.
2. Assign tasks, update vendor records, and add actual costs.
3. Ask Festiya to propose changes when date, guest count, or budget changes.
4. Preview proposed changes before applying them.

### Professional client delivery
1. Create a professional workspace and event.
2. Apply a template or generate a draft.
3. Review and produce a branded, read-only client view or export.
4. Convert accepted items into internal tasks and track delivery.

### Upgrade
1. Explain usage limits before a user hits a hard stop.
2. Show relevant plan benefits and price transparently.
3. Use a supported payment provider.
4. Grant entitlements only after a verified server-side webhook.
5. Provide clear cancellation, failed-payment, and downgrade flows.

## 6. Functional requirements

### Event creation
Required: event category, name/occasion, date or undecided state, location/virtual/hybrid, guest estimate, and budget/currency or “not sure yet”. Optional: style, cultural/accessibility/dietary needs, indoor/outdoor preference, priorities, owner, collaborators. Do not block creation because optional data is missing.

### AI-generated plan
Must include:
- Summary, assumptions, and unresolved questions.
- Low/likely/high budget estimates where sensible.
- Milestones and actionable tasks with due dates or date offsets.
- Vendor categories, selection criteria, and questions to ask.
- Personalised ideas and likely cost impact.
- Risks and mitigations.
- Run-of-show when enough information exists.

Use versioned, schema-validated structured output. Assign stable IDs server-side. Invalid model output must not corrupt stored data. Regeneration must not silently overwrite manual edits. Permit section-level revision. Clearly distinguish estimates from actuals and vendor quotes. Never invent vendor ratings, live availability, exact market prices, or bookings. When AI fails, preserve the draft and offer retry or a deterministic template fallback.

### Budget
Track target, estimated, quoted, committed, actual, and remaining amounts. Support categories and custom items. Use decimal-safe money handling, not binary floating-point for financial totals. Warn when estimates exceed target. Changes to guest count or scope should produce a proposed budget revision, not silently mutate existing items.

### Tasks and timeline
Tasks have title, description, status, priority, owner, due date, dependencies, and optional budget/vendor links. Provide list view first; calendar/timeline can follow. Handle event time zones and daylight-saving transitions. Do not require drag-and-drop.

### Vendors
Track name, category, user-provided contact details, notes, quote, quote status, and linked budget items. Statuses: To research, Contacted, Quote received, Shortlisted, Selected, Not proceeding. Clearly distinguish vendor categories from verified businesses.

### Workspaces and collaboration
Personal and professional workspaces; roles Owner, Admin, Planner/Editor, Client/Commenter, Viewer. Separate workspace membership from event membership. Invitation tokens expire, can be revoked, and are scoped to role and event/workspace. Share pages expose only explicitly selected fields. Audit membership, sharing, export, and billing changes.

## 7. UI/UX: global carnival, operationally calm

### Visual concept
A colourful, premium event-discovery destination: energetic, editorial, playful, and full of possibility. Take broad inspiration from consumer discovery patterns such as curated collections, category cards, and strong CTAs. Do not copy District, Scenes, Swiggy, Zomato, logos, proprietary assets, layouts, or copy.

### Palette
- Warm canvas: `#FFF8EF`
- White surfaces: `#FFFFFF`
- Charcoal ink: `#24212B`
- Coral: `#FF6257`
- Sunshine: `#FFD45A`
- Cobalt: `#4559D8` (selective use; no neon glow)
- Mint: `#A9E7D0`
- Berry: `#8C4E78`

Use high contrast. The discovery page can be expressive; budget and task screens should be calm, scannable, and restrained. Avoid excessive gradients, glassmorphism, neon, and constant animation. Use a robust system/Inter-like sans-serif stack with multilingual fallback.

### Homepage layout
1. Navigation: Festiya, Explore, For Planners, Pricing, Sign in.
2. Hero: **“Your next great event starts here.”**
3. Supporting line: “Tell us what you’re celebrating. We’ll turn it into a plan, a budget, and a clear next step.”
4. Event prompt card with occasion, date, guests, budget, and **Build my plan** CTA.
5. Category cards: Wedding, Birthday, Gathering, Work event, Start from scratch.
6. Inspiration collections: “Small details, big memories”, “A celebration on a budget”, “Bring everyone together”.
7. Three steps: Tell us → Shape the plan → Make it happen.
8. Planner/agency value proposition, pricing teaser, privacy note, footer.

### Workspace layout
Header with event name/date/location/status/share controls. Summary for budget, tasks, and next milestone. Tabs/sections: Plan, Budget, Timeline & Tasks, Vendors, Ideas, Activity. Persistent **Ask Festiya** entry point. AI-proposed edits require preview and confirmation.

### Interaction rules
- Small purposeful motion; respect `prefers-reduced-motion`.
- No autoplay audio/video or essential information conveyed only through animation.
- Visible keyboard focus, logical tab order, skip links, accessible dialogs, stable layout, and touch targets around 44×44 CSS pixels for primary mobile controls.
- Communicate status with text/icons as well as colour.
- No dark patterns, fake urgency, guilt-based upsells, or hidden recurring billing.
- The word “hackathon” must not appear in product UI, app copy, metadata, or demo data.

## 8. AI architecture and provider routing

Use a provider-independent server-side gateway. Cloudflare is the application/deployment platform; approved model APIs can be called server-side.

Potential providers:
- Cloudflare Workers AI for suitable supported tasks.
- Groq API for suitable fast inference.
- NVIDIA NIM endpoints for configured, supported models.
- Optional additional approved API-compatible provider.
- Deterministic template fallback when all configured providers fail.

Provider/model names, pricing, context limits, and structured-output support change; verify official docs during implementation. Do not assume a provider is enabled until tested.

### Gateway responsibilities
- Validate and minimise input before sending it.
- Select model by task, quality, latency, cost, and provider health.
- Apply request size, timeout, concurrency, and usage limits.
- Validate structured output against a versioned schema.
- Retry transient failures only, with bounded attempts and jitter.
- Temporarily suppress unhealthy providers after repeated failures.
- Log latency, success/failure, safe provider metadata, and estimated cost without logging private prompt content.
- Fall back only to providers approved for the data and privacy policy.
- Return consistent typed errors without exposing secrets or raw provider responses.

### AI safety
AI may propose edits but cannot decide permissions, subscription entitlements, payment success, or perform consequential actions without user confirmation. Treat user content and model output as untrusted. Never execute model output as SQL, shell commands, or arbitrary URLs. Version prompts, evaluate quality, and test prompt injection. Use deterministic code for arithmetic, dates, permissions, and billing.

### Example typed plan contract
```ts
type EventPlan = {
  schemaVersion: "1";
  summary: string;
  assumptions: string[];
  openQuestions: string[];
  budget: {
    currency: string;
    target?: number;
    items: Array<{
      id: string;
      category: string;
      label: string;
      lowEstimate?: number;
      likelyEstimate?: number;
      highEstimate?: number;
      rationale?: string;
      isEstimate: true;
    }>;
  };
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
    priority: "low" | "medium" | "high" | "critical";
    dueDate?: string;
    dueOffsetDays?: number;
    dependsOn: string[];
  }>;
  vendorCategories: Array<{
    category: string;
    selectionCriteria: string[];
    questionsToAsk: string[];
  }>;
  ideas: Array<{
    title: string;
    description: string;
    category: string;
    estimatedCostImpact?: "low" | "medium" | "high" | "unknown";
  }>;
  risks: Array<{ risk: string; mitigation: string }>;
  runOfShow?: Array<{ time?: string; activity: string; owner?: string }>;
};
```

## 9. Cloudflare-first stack

- **Frontend:** React + TypeScript + Vite.
- **Runtime/API:** Cloudflare Workers, with Hono or another small typed router.
- **Database:** Cloudflare D1.
- **Private files/exports:** Cloudflare R2 if needed.
- **AI:** Workers AI where suitable, plus optional configured Groq/NVIDIA NIM API adapters.
- **Bot controls:** Turnstile where appropriate, never as a substitute for authentication.
- **Async tasks:** Queues and Cron Triggers when the workflow warrants them.
- **Durable Objects:** only if real-time collaboration becomes a demonstrated need.
- **Billing:** supported payment provider; Workers process checkout requests and signed webhooks, while the provider handles card data.

Separate dev, preview/staging, and production configuration, D1 databases, and secrets. Preview must not write to production. Use versioned migrations and a rollback plan. Verify current Cloudflare platform support and limits before shipping.

### Architecture
```text
Browser
  -> Cloudflare-hosted React app
  -> Worker API
       -> Auth + tenant/role checks
       -> Event / budget / task / vendor services
       -> Entitlements + usage ledger
       -> AI gateway + schema validation
       -> Verified payment webhooks
       -> D1 (application data)
       -> R2 (private files, optional)
       -> Workers AI and/or approved external model APIs
       -> Payment provider
```

## 10. Data model

- `users`: identity subject, profile, locale, time zone.
- `workspaces`: type, owner, brand settings, subscription reference.
- `workspace_members`: workspace, user, role, invite status.
- `events`: workspace, name, type, dates, time zone, location mode, guest count, currency, target budget.
- `event_members`: event, user/invitation, role, visibility.
- `plans`: event, version, schema version, structured content, status.
- `tasks`: event, title, status, priority, owner, due date, dependencies.
- `budget_items`: event, category, estimates, quote/committed/actual amounts, currency, status, vendor reference.
- `vendors` and `vendor_quotes`: user-entered details, quote amount/currency/status, source.
- `files`: object key, type, size, uploader, visibility, status.
- `invitations`: hashed token, scope, role, expiry, revocation/acceptance.
- `activity_log`: actor, action, entity, timestamp, minimal safe metadata.
- `subscriptions`: provider references, status, period end, plan key.
- `usage_ledger`: workspace/user, feature, quantity, provider/model, estimated cost, request ID.
- `idempotency_keys`: actor, operation, hashed key, result, expiry.
- `ai_job_status`: job state and safe error/provider metadata if generation is asynchronous.

Use foreign keys and indexes for common workspace/event/date/status queries. Apply retention/deletion rules. Enforce tenant boundaries in server queries and tests, not just UI filtering.

## 11. API outline

Private endpoints require authentication and object-level authorisation:
- `GET/PATCH /api/me`
- `GET/POST /api/workspaces`
- `GET/POST /api/workspaces/:workspaceId/events`
- `GET/PATCH/DELETE /api/events/:eventId`
- `POST /api/events/:eventId/plan/generate`
- `POST /api/events/:eventId/plan/revise`
- `GET /api/events/:eventId/plans`
- `POST /api/events/:eventId/plans/:planId/accept`
- `GET/POST/PATCH/DELETE /api/events/:eventId/tasks`
- `GET/POST/PATCH/DELETE /api/events/:eventId/budget-items`
- `GET/POST/PATCH/DELETE /api/events/:eventId/vendors`
- `POST /api/events/:eventId/share`
- `DELETE /api/shares/:shareId`
- `GET /api/billing/entitlements`
- `POST /api/billing/checkout`
- `POST /api/billing/webhook`
- `GET /api/usage`
- `POST /api/account/export`
- `DELETE /api/account`
- `GET /api/health` (non-sensitive response only)

Never trust client-supplied workspace IDs, roles, plan prices, subscription state, or “paid” flags. Use request validation, rate limits, consistent error codes, and cursor pagination where needed.

## 12. Security and privacy

No architecture can guarantee perfect security. Use defence in depth and ongoing review.

- Use a maintained auth solution compatible with Cloudflare; secure, HttpOnly, SameSite cookies if using cookie sessions, with CSRF protection for state-changing requests.
- Enforce role and object-level access on every endpoint.
- Test IDOR, cross-workspace access, privilege escalation, revoked invite/share access.
- Use parameterised SQL, strict validation, output encoding, and a suitable Content Security Policy.
- Protect against XSS, CSRF, injection, SSRF if URL fetching is added, open redirects, and mass assignment.
- Keep secrets in Cloudflare secret bindings; never commit or expose them to the browser.
- Rate-limit authentication, AI generation, invites, exports, and payment endpoints.
- Keep R2 objects private; use authorised endpoints or short-lived signed URLs.
- Validate file type/size and avoid serving untrusted uploads as executable content.
- Verify webhook signatures; make handlers idempotent and safe under duplicate/out-of-order events.
- Redact prompts, event notes, email addresses, tokens, and payment payloads from logs.
- Minimise personal data sent to model providers and disclose external AI processing.
- Provide export/deletion workflows, retention policies, and an incident-response procedure.
- Treat model output as untrusted; no direct tool execution or unconfirmed external actions.

## 13. Monetisation

### Free
Limited active events and plan generations, core budget/tasks/vendors, basic sharing.

### Plus
More events and AI revisions, exports, deeper personalisation, more collaborators.

### Planner Pro
Client workspaces, reusable templates, branded proposals, client share pages, higher limits.

### Agency
Team roles, shared templates, brand controls, multi-event oversight, usage reporting, and suitable support.

Gate scale and professional workflows, not access to a user's own saved data. Explain limits before checkout. Retain user work after downgrade according to a disclosed policy. Show usage remaining and reset date. Avoid fake countdowns and manipulative upgrade patterns.

Payment rules: compute price/entitlement server-side; use signed webhooks as the authoritative subscription signal; never store card data; provide cancellation and failed-payment paths; assess tax, invoice, consumer-law, and refund requirements for target markets.

Cost controls: server-side quotas, provider-specific token/time limits, maximum request sizes, cost ledger, spend alerts, and deterministic templates for predictable tasks. Never run hidden background generations.

## 14. Accessibility

Target WCAG 2.2 AA:
- Semantic landmarks and heading hierarchy.
- Keyboard operation, visible focus, logical tab order, skip links.
- Accessible labels and associated error messages.
- Contrast-compliant text, controls, borders, and focus indicators.
- Status not conveyed by colour alone.
- Accessible dialogs, menus, tables, and live status announcements.
- Practical 44×44 CSS-pixel touch targets for primary mobile controls.
- Reflow at 320 CSS pixels and 200% zoom.
- Reduced-motion support; no drag-only interactions.
- Locale-aware dates, currencies, and number formats.
- Automated checks plus manual keyboard and screen-reader testing.

## 15. Engineering standards

- TypeScript strict mode; avoid undocumented `any`.
- Shared API contracts and runtime validation.
- Separate routes, domain services, repositories, provider adapters, and UI components.
- Keep components focused and dependencies lean.
- Use deterministic server-side logic for permissions, arithmetic, dates, billing, and entitlements.
- Include `.env.example` with placeholders only.
- Version migrations and prompts.
- Lint, format, type-check, test, and build in CI.
- Include threat model, architecture diagram, runbook, and known limitations.
- Every asynchronous UI flow must have pending, success, and failure states.

## 16. Testing and release gates

### Unit
Budget totals/variance, decimal-safe currency handling, date offsets/time zones, permission matrix, entitlements, AI schema parsing, provider routing, invite expiry, webhook signatures/idempotency.

### Integration
D1 persistence, API authorisation, plan versioning, budget/task/vendor linking, tenant isolation, private R2 access, webhook state changes.

### End-to-end
Create account/workspace → create event → generate plan → edit budget → complete task → invite collaborator → verify role restrictions → share and revoke → hit usage limit → checkout/webhook simulation → export/delete.

### Accessibility
Automated axe-like checks, keyboard-only primary journeys, manual screen-reader checks, contrast verification.

### Security
IDOR, cross-tenant access, privilege escalation, XSS/injection, rate-limit bypass, unsafe uploads, secret scanning, prompt injection, provider outage, malformed output, webhook replay.

### AI evaluation set
Wedding with fixed budget, short-notice birthday, community event with volunteers, work gathering, undecided date, multiple currencies, accessibility/dietary needs, conflicting constraints, impossible budget, prompt injection in notes, invalid JSON, and provider outage.

### Release gates
- Lint, type-check, unit/integration tests, and production build pass.
- No unresolved critical/high security findings.
- No known cross-tenant access failures.
- Core journeys pass on mobile and desktop.
- No critical accessibility issue in primary journeys.
- AI schema validity meets an agreed benchmark.
- Payment/provider failure states tested.
- Preview and production have separate databases/secrets.
- Export/deletion and rollback paths documented.

## 17. Delivery phases

1. **Foundation:** React/TypeScript, Worker API, D1 migrations, CI, auth, design tokens, permissions.
2. **Core planning:** discovery, event brief, AI gateway, structured plans, budgets, tasks, vendors, workspace.
3. **Professional workflow:** roles, invites, client sharing, templates, exports, multi-event dashboard.
4. **Paid product:** entitlements, usage ledger, checkout, verified webhooks, billing page, downgrade handling.
5. **Hardening:** E2E, security, accessibility, AI evaluations, monitoring, data export/deletion, launch review.

## 18. Risks

| Risk | Mitigation |
|---|---|
| Generic plans | User constraints, structured output, section editing, benchmark set |
| False vendor/price claims | No live claims without verified sources; estimates clearly labelled |
| Users stop after generation | Actionable next steps and task conversion |
| AI costs exceed revenue | Quotas, model routing, usage ledger, spend alerts |
| Provider outage | Bounded retries, circuit breaker, approved fallback, templates |
| Client data leakage | Server-side tenant checks, minimised prompts, redacted logs |
| Weak paid conversion | Keep free loop useful; charge for scale and professional workflows |
| Global UX gaps | Event-level currency/time zone, locale-ready formats, diverse evaluation |
| Brand conflict | Trademark/domain/app-store clearance before public launch |

## 19. Acceptance criteria

1. Event drafts can be saved with missing optional fields.
2. A valid plan includes assumptions, estimates, tasks/timeline, vendor categories, ideas, and risks.
3. Invalid model output cannot corrupt saved data.
4. Users can edit/accept/version plan sections without losing manual edits.
5. Budgets, tasks, and vendors can be created and updated.
6. Planners can create a professional workspace and invite role-limited collaborators.
7. Changing IDs cannot expose another workspace's data.
8. Core journeys are keyboard-accessible and responsive.
9. AI/payment failures are recoverable and preserve user work.
10. Paid entitlements are granted only from verified server-side subscription state.
11. AI usage is metered and limited server-side.
12. CI runs lint, type-check, tests, and production build.
13. Deployment uses separate preview/production settings and databases.
14. Data export and deletion are supported.
15. The product UI, metadata, and demo content never use the prohibited term specified in this brief.

---

# README.md — recommended repository content

# Festiya
### Make a moment of it.

Planning a memorable event should feel exciting. In reality, it often means open tabs, scattered messages, uncertain costs, missed deadlines, and a spreadsheet nobody updates.

Festiya starts with a different question:

> What if planning an event felt like discovering a great experience, rather than managing a stressful project?

Festiya is an AI-powered planning workspace for individuals, families, independent planners, and event agencies. Describe what you are celebrating and Festiya turns the brief into an editable plan with budget estimates, timelines, tasks, vendor categories, ideas, risks, and next steps.

**The goal is not to generate more text. It is to make the next useful action obvious.**

## From planning chaos to an executable plan

| Fragmented process | Festiya workflow |
|---|---|
| Start from a blank document | Start with a short event brief |
| Guess what happens next | Get an editable checklist and timeline |
| Track costs in separate notes | Track estimates, quotes, committed costs, and actuals |
| Lose decisions in chats | Keep plan, tasks, and vendor notes together |
| Rebuild every client proposal | Reuse templates and share client-ready plans |
| Trust AI without context | Review assumptions and proposed changes |

## What it does

- Generates a structured event plan from a natural-language brief.
- Converts ideas into editable tasks, milestones, budget items, and vendor criteria.
- Supports personal workspaces and professional multi-client workflows.
- Offers scoped sharing, templates, exports, and paid professional capabilities.
- Keeps humans in control: AI suggestions are editable and consequential changes require review.
- Uses event-level currency and time zone and is designed for localisation.

## Product principles

1. Useful before impressive.
2. Structured, not just conversational.
3. Honest about uncertainty: estimates are not quotes.
4. Human approval for consequential changes.
5. Privacy by design and server-side tenant boundaries.
6. Accessibility is part of the product, not a final polish step.

## Architecture

```text
Browser
  -> Cloudflare-hosted React app
  -> Cloudflare Worker API
       -> Authentication + workspace/event permissions
       -> Event, budget, task, vendor services
       -> AI gateway + schema validation
       -> Usage limits + subscription entitlements
       -> D1 application data
       -> R2 private files/exports (optional)
       -> Workers AI and/or approved external model APIs
       -> Payment provider with verified webhooks
```

## Technology

- React, TypeScript, Vite.
- Cloudflare Workers API, with Hono or another typed router.
- Cloudflare D1 relational database.
- Cloudflare R2 for private files/exports if enabled.
- Cloudflare Workers AI where appropriate.
- Optional server-side adapters for configured providers such as Groq or NVIDIA NIM.
- Cloudflare Turnstile where appropriate, alongside authentication and rate limits.
- Cloudflare Queues/Cron only where asynchronous work requires them.
- A supported payment provider for subscription checkout and billing.

External AI providers are optional integrations, not deployment hosts. Verify current model availability, terms, price, and structured-output support before enabling a provider. If providers fail, preserve user work and offer retry or deterministic fallback.

## Local development

Keep commands aligned with the actual repository scripts; do not publish untested commands as if verified.

```bash
git clone <repository-url>
cd festiya
npm install
cp .env.example .env
npm run dev
```

Use a supported Node.js LTS version. If the repository is a multi-package workspace, document the actual workspace commands. Never commit real secrets or expose server-only credentials to browser bundles.

## Environment configuration

Use Cloudflare secret bindings for credentials. These are example names only; match them to the implementation.

```text
APP_ENV=
APP_BASE_URL=
AUTH_SECRET=
AI_DEFAULT_PROVIDER=
AI_FALLBACK_PROVIDER=
WORKERS_AI_MODEL=
GROQ_API_KEY=
NVIDIA_NIM_API_KEY=
PAYMENT_PROVIDER=
PAYMENT_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=
TURNSTILE_SECRET_KEY=
```

Configure only providers that are actually implemented and tested. Client-visible variables must never contain private API keys.

## Cloudflare deployment checklist

1. Create separate preview/staging and production environments.
2. Bind separate D1 databases and apply versioned migrations.
3. Configure R2 only if private file storage is enabled.
4. Set credentials through Cloudflare secret management.
5. Configure Workers AI and optional provider credentials.
6. Configure production domain, session settings, allowed origins, and Content Security Policy.
7. Configure Turnstile and server-side rate limits for relevant endpoints.
8. Configure payment products, signed webhooks, and idempotency.
9. Test staging, especially tenant isolation and payment failure cases.
10. Confirm logs contain no secrets or private event content; document monitoring and rollback.
11. Verify all bindings, limits, and deployment steps against current Cloudflare documentation.

## Quality checks

The repository should expose scripts for the checks it truly supports, such as:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Do not claim checks pass until they have actually been run. CI should fail on type errors, test/build failures, and critical security or accessibility regressions.

## Security model

- Authorise every object access server-side.
- Enforce workspace/event membership for tenant-owned data.
- Validate all inputs and model outputs.
- Keep secrets out of source control, client bundles, and logs.
- Rate-limit AI generation, invitations, exports, and payment endpoints.
- Keep R2 objects private and authorise downloads.
- Verify and idempotently process payment webhooks.
- Treat model output as untrusted and never execute it as code.
- Minimise personal data sent to model providers and disclose relevant processing.
- Test IDOR, cross-tenant access, privilege escalation, prompt injection, unsafe uploads, and webhook replay.
- Provide data export/deletion and documented incident handling.

No software can honestly be called perfectly secure. Festiya uses layered controls and release gates to reduce risk; security requires continuous maintenance and review.

## Monetisation

- **Free:** limited active events and plan generations; core planning tools.
- **Plus:** more events, revisions, exports, and collaboration.
- **Planner Pro:** client workspaces, reusable templates, branded proposals, and higher limits.
- **Agency:** team roles, shared templates, brand controls, multi-event overview, and usage reporting.

Enforce entitlements server-side. A checkout redirect is not proof of payment; subscription state changes only after a verified webhook. Users should retain access to their existing data after downgrading according to a disclosed policy. Never store raw card details.

## Testing strategy

- Unit tests for budget arithmetic, dates, permissions, entitlements, and schemas.
- Integration tests for D1 persistence, tenant boundaries, private object access, and webhooks.
- End-to-end test: create event → generate plan → edit budget → complete task → invite collaborator → share/revoke access.
- Accessibility checks plus manual keyboard and screen-reader review.
- AI evaluations for diverse event types, budgets, constraints, locales, prompt injection, malformed output, and provider outages.
- Security tests for IDOR, cross-tenant access, injection, rate limits, secret leaks, and webhook replay.

## Known limitations

Document what is implemented today, not only what is planned. AI-generated budgets are estimates, not live quotes. Vendor categories do not prove availability. Subscription payments are separate from vendor payments. Multi-provider routing works only for configured and tested providers. Do not present roadmap items as completed features.

## Roadmap

1. Reliable brief-to-plan flow.
2. Editable budgets, timeline, tasks, and vendor tracking.
3. Secure workspaces and collaborator access.
4. Client sharing, reusable templates, and exports.
5. Subscription billing and usage controls.
6. Localisation and integrations based on validated demand.

## License and legal

Choose and add a license before public distribution. Add privacy policy, terms, payment terms, and AI-provider disclosures before collecting real user data or accepting payments.

---

## Final build recommendation

Build one complete loop before adding lots of features:

**Brief → validated AI plan → editable budget/tasks/vendors → saved workspace → share/export → paid upgrade.**

The differentiator is not that Festiya can generate event ideas. It is that it turns those ideas into structured work, helps users make progress, and supports both personal celebrations and professional client delivery.

Keep the discovery experience colourful, the operational workspace calm and accessible, and every AI-powered action observable, reversible, and permission-checked.
