# Festiya Progressive Rollout Strategy

This document outlines our controlled deployment and progressive feature rollout guidelines for production releases.

## Feature Stages

1. **Internal Canary (Phase 0)**:
   - Activated via local environment flags (`VITE_FLAG_PRODUCTION_READY=true`).
   - Smoke tests and automated test suites validate zero regression.

2. **Beta Flighting (Phase 1)**:
   - Enables `FEATURE_CELEBRATION_GLOBE` and `FEATURE_ECONOMICS_ABACUS` for 20% of inbound celebration sessions.
   - Core health endpoints (`/healthz`) monitor rendering latency and WebGL stability.

3. **General Availability (Phase 2)**:
   - Full 100% activation of `FEATURE_FESTI_AI_PLANNER`.
   - Continuous uptime and reliability metrics monitored via Sentry error reporting.

## Rollback Procedures

If crash or latency thresholds are breached:
1. Revert active flags in `flags.json`.
2. Instant edge deployment via Cloudflare Pages / Wrangler.
