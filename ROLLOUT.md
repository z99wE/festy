# Deployment & Rollout Strategy

Festiya utilizes progressive feature delivery and automated validation gates.

## Rollout Lifecycle

1. **Phase 1: Local Development & Unit Validation**
   - In-memory database adapter tests for instantaneous TDD iterations.
   - Money mathematics verified against minor units (cents).
   - Soloknuckle strict hygiene and WCAG 2.2 AA accessibility evaluations.

2. **Phase 2: Preview Deployments (Cloudflare Pages & Workers)**
   - Deployed on temporary staging subdomains with Cloudflare D1 test replicas.
   - Synthetic end-to-end event generation and export evaluations.

3. **Phase 3: Production Rollout & Feature Toggles**
   - Configured with `flags.json` toggles:
     - `ai_generation_engine`: Controls provider fallback routing.
     - `multi_currency_preview`: Gated feature for international planner currency conversions.
     - `realtime_collaborative_sync`: Gradual rollout for WebSocket multi-cursor updates.
   - Dynamic rollback available via Cloudflare Worker version pinning.
