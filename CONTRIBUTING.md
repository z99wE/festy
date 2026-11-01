# Contributing to Festiya

## Test Strategy

Festiya uses Node's built-in test runner (`node --test`). Run the full suite with:

```bash
npm test
```

### What is tested (122 tests across 36 suites)

| Suite | What it covers |
|---|---|
| `festiya.test.js` | Occasion archetypes, budget allocator, retry/backoff logic |
| `multiAgent.test.js` | Financial Synthesizer 3-tier math, Logistics milestones, Game-Theory BATNA/Pareto/Minimax invariants |
| `plan-builder-economics.test.js` | Budget allocation percentages, timeline sequencing, vendor criteria |
| `abacus.test.js` | Abacus rail bead multipliers, per-guest proration, tier calculations |
| `currency.test.js` | 10 currencies, cross-rate exchange, triangular arbitrage consistency |
| `global-dossier-coordinates.test.js` | Spherical projection math, geographic boundary checks, countdown validity |
| `security.test.js` | Prompt injection, DAN jailbreak, XSS/SQLi vectors, rate limiter |
| `security-hardened-suite.test.js` | Adversarial input sanitization, delimiter smuggling, off-topic domain blocking |
| `edge-worker.test.js` | Worker input sanitization, AI output post-processing, message assembly |
| `auth.test.js` | Registration/login lifecycle, password reset token expiry, newsletter deduplication |
| `accessibility-and-quality.test.js` | WCAG AAA contrast ratios, README content invariants, prohibited term checks |

### Why WebGL components are not unit-tested

`OrbitableHeroLogo`, `CelebrationGlobeCanvas`, and the `FlexCarousel` engine depend on a live `WebGL2RenderingContext`, which is not available in Node. These components are validated through:

- **Integration testing** at the browser level (manual + Lighthouse audit)
- **Structural tests** on their pure-function helpers (spherical projection math in `global-dossier-coordinates.test.js`, physics math in `multiAgent.test.js`)
- **Type safety** — strict TypeScript with OGL-native types throughout the carousel subsystem

Adding a headless WebGL environment (e.g. Puppeteer + `node-canvas`) would introduce a large, flaky dependency chain with no proportional quality benefit. This is an intentional architecture decision, not a gap.

## CI Pipeline

Every push to `main` and `feat/*` runs:

1. `npm run test` — 122 unit and invariant tests
2. `npm run lint` — oxlint (0 errors, 0 warnings enforced)
3. `npm run build` — TypeScript strict mode + Vite production build + SSR prerender
4. `npm audit --audit-level=moderate` — zero moderate/high/critical CVEs enforced

## Code Style

- TypeScript strict mode is enforced — no `any` types outside of third-party library boundaries
- Named constants for all magic numbers — see `src/services/multiAgentEngine.ts` for the pattern
- JSDoc on all exported functions and class methods in `src/services/`
- Inline styles extracted to named `React.CSSProperties` constants at module scope
- No `console.*` in production bundles — stripped by Vite terser in builds

## Branch Strategy

Single-branch repository — all work merges directly to `main`. This keeps the commit history clean and makes the codebase straightforward to review.
