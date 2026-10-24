# Contributing to Festiya

We welcome contributions to Festiya, the AI-powered event planning and operations workspace.

## Development Workflow

1. **Fork and Clone**: Clone your fork of the repository locally.
2. **Install Dependencies**: Run `npm install` with exact pinning enforced via `.npmrc`.
3. **Local Testing**: Run `npm test` to execute Vitest unit and integration suites.
4. **Type Checking**: Run `npm run typecheck` to verify strict TypeScript adherence.
5. **Code Hygiene**: Run `npx soloknuckle check --strict` to verify production readiness.
6. **Pull Requests**: Submit atomic, well-tested pull requests using conventional commit messages.
