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
  -> Cloudflare Worker API (Hono)
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

- **Frontend:** React, TypeScript, Vite.
- **Backend/API:** Cloudflare Workers API with Hono.
- **Database:** Cloudflare D1 relational database (SQLite).
- **AI Gateway:** Workers AI, Groq, NVIDIA NIM, Gemini/OpenAI API adapters, with deterministic schema fallback.
- **Validation:** Zod schemas for typed contracts and event plans.
- **Design:** Bespoke high-contrast editorial carnival palette with calm, scannable workspace.

## Local development

```bash
# Clone the repository
git clone https://github.com/z99wE/festy.git
cd festy

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run development server (fullstack React + Worker API)
npm run dev

# Run quality checks & test suite
npm run test
npm run typecheck
npm run build
```

## Quality checks

```bash
npm run typecheck  # TypeScript strict type checking
npm run test       # Vitest unit and integration test suite
npm run build      # Production bundle build
```

## Security model

- Authorise every object access server-side.
- Enforce workspace/event membership for tenant-owned data.
- Validate all inputs and model outputs against versioned schemas.
- Keep secrets out of source control, client bundles, and logs.
- Rate-limit AI generation, invitations, exports, and payment endpoints.
- Treat model output as untrusted and never execute it as code.
- Provide data export and deletion workflows (GDPR compliant).

## Monetisation

- **Free:** 2 active events, 5 plan generations, core budget & task checklists.
- **Plus:** 10 active events, 30 AI revisions, proposal exports, custom categories.
- **Planner Pro:** Unlimited events, client portal, reusable agency templates, branded share links.
- **Agency:** Multi-seat team roles, activity audit logs, client approvals, volume pricing.

## License

MIT License. See [LICENSE](file:///LICENSE) for details.
