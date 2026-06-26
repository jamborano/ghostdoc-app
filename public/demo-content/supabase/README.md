# Supabase Monorepo – Architecture & Development Guide

**Production-ready monorepo** comprising the Supabase Studio dashboard, marketing site, documentation, shared UI component library, and a suite of backend microservices. Built with pnpm workspaces, Turborepo, Next.js, React 19, and a rigorous security-first type system.

---

## Table of Contents

- [Overview](#overview)
- [Repository Topology](#repository-topology)
- [Prerequisites & Setup](#prerequisites--setup)
- [Running the Studio Locally](#running-the-studio-locally)
- [Core Architecture Patterns](#core-architecture-patterns)
  - [Component Composition](#component-composition)
  - [State Management](#state-management)
  - [Data Fetching & Mutations](#data-fetching--mutations)
- [Security Architecture](#security-architecture)
  - [SQL Injection Protection – Branded Types](#sql-injection-protection--branded-types)
  - [Dev Toolbar Isolation](#dev-toolbar-isolation)
  - [Telemetry Data Minimization](#telemetry-data-minimization)
- [Testing Strategy](#testing-strategy)
- [Key Packages](#key-packages)
- [Configuration & Agent Integration](#configuration--agent-integration)
- [Known Issues & Recommendations](#known-issues--recommendations)
- [Contributing](#contributing)

---

## Overview

The Supabase monorepo (`github.com/supabase/supabase`) is the single source of truth for the Supabase dashboard experience. It contains:

- **`apps/studio`** – Next.js Pages Router app using React 19, the primary admin dashboard for managing Supabase projects.
- **`apps/www`** – Marketing website.
- **`apps/docs`** – Documentation site with federated content pipeline.
- **`packages/ui`** – Component library built on shadcn/ui and Radix primitives.
- **`packages/common`** – Shared telemetry constants, PostHog client, ConfigCat feature flags.
- **`packages/dev-tools`** – Developer toolbar for inspecting telemetry and toggling flags in development.
- **`packages/pg-meta`** – Backend interfaces for PostgreSQL metadata queries (used by Studio).
- **`packages/ai-commands`**, **`packages/shared-data`**, **`packages/config`**, **`packages/tsconfig`** – Supporting packages.

**Orchestration:** pnpm 10 workspaces + Turborepo, Node >=22 required.

---

## Repository Topology

```
├── apps/
│   ├── studio/                 # Next.js Pages Router – main dashboard
│   ├── www/                    # Marketing site (Next.js)
│   └── docs/                   # Documentation site (Next.js)
├── e2e/
│   └── studio/                 # Playwright end-to-end tests
├── packages/
│   ├── ui/                     # shadcn/ui-based component library
│   ├── common/                 # Telemetry, PostHog, ConfigCat
│   ├── dev-tools/              # Dev toolbar (tree-shaken in production)
│   ├── ai-commands/            # AI command definitions
│   ├── config/                 # Shared configuration
│   ├── shared-data/            # Shared data models
│   └── tsconfig/               # Shared TypeScript configurations
├── docker/                     # Docker Compose files for local services
├── .claude/                    # Anthropic Claude agent skills
├── .cursor/                    # Cursor IDE rules
├── .github/                    # GitHub Actions, Copilot instructions
├── .mcp.json                   # MCP server configuration
└── pnpm-workspace.yaml         # Workspace definition
```

**Local service dependency:** Docker Compose in `/docker` provides the backend services required by Studio: Postgres, Kong, GoTrue, Storage, Realtime, and pg-meta.

---

## Prerequisites & Setup

### Required Tools

| Tool | Version | Verified |
|------|---------|----------|
| Node.js | >= 22 | Yes |
| pnpm | 10 (latest) | Yes |
| Docker | Any recent (Compose v2) | Yes |
| Turborepo | Installed via pnpm | Yes |

### Clone & Install

```bash
git clone git@github.com:supabase/supabase.git
cd supabase
pnpm install
pnpm build:packages    # Build shared packages first
```

---

## Running the Studio Locally

1. **Start Docker services** (Postgres, Kong, etc.):
   ```bash
   cd docker
   docker compose up -d
   cd ..
   ```
2. **Set up environment variables** (copy `apps/studio/.env.example` to `apps/studio/.env.local` and adjust as needed).
3. **Run the Studio dev server:**
   ```bash
   pnpm dev:studio
   # Opens on http://localhost:8080
   ```
4. **Run tests:**
   ```bash
   pnpm test:studio           # Unit + component tests
   pnpm test:e2e:studio       # Playwright E2E tests
   ```

> **Note:** Docker Compose must be started **before** `pnpm dev:studio`. The dev script does not auto-trigger Docker. For a faster onboarding, we recommend a dedicated `pnpm dev:studio:full` script in the future (see [Recommendations](#known-issues--recommendations)).

---

## Core Architecture Patterns

### Component Composition

Every complex UI (Composer, Dialog, Sheet) follows the **Provider + Frame + Subcomponents** pattern introduced in React 19:

- A `<Provider>` (e.g., `ComposerProvider`) owns a generic state contract `{ state, actions, meta }`.
- Subcomponents (`Input`, `Submit`, `Footer`) access the provider context via `use(ComposerContext)` – the new React 19 `use()` hook.
- **Explicit variants** replace boolean props: `ThreadComposer` and `EditMessageComposer` are separate components instead of a `isThread` flag.

```tsx
// Simplified example
function ComposerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({ value: '' });
  return (
    <ComposerContext value={{ state, actions: { setValue } }}>
      {children}
    </ComposerContext>
  );
}
```

### State Management

- **Lifted state in providers** – data needed by multiple sibling components is lifted into a dedicated provider (e.g., `ForwardMessageProvider`).
- No prop drilling, ref sharing, or `useEffect` synchronisation.
- React 19 `use()` is used pervasively – ensure all consumer components run React >=19.

### Data Fetching & Mutations

All API calls use the **`queryOptions` pattern**:

1. Private `getX` function (`async`).
2. Exported `xQueryOptions` using `queryOptions` from `@tanstack/react-query`.
3. Components call `useQuery(xQueryOptions(vars))`.

**Mutations** return `useMutation` with default `toast.error` and `onSuccess` that invalidates both list and detail keys via `Promise.all`.

**Error classification:**

- `handleError` (in `data/fetchers.ts`) matches error messages against `ERROR_PATTERNS` and throws typed subclasses.
- `<ErrorMatcher>` performs O(1) lookup on `errorType` to render user‑facing troubleshooting.

---

## Security Architecture

### SQL Injection Protection – Branded Types

The most critical security boundary is the **SQL provenance tracking** system, enforced at compile time through TypeScript branded types.

| Brand | Source | Execution Allowed? |
|-------|--------|--------------------|
| `SafeSqlFragment` | Hardcoded (`safeSql`), user input via `SafeSqlInput`, sanitized (`ident`, `literal`, `keyword`), or database round‑tripped (explicit promotion) | **Yes** |
| `UntrustedSqlFragment` | URL params, LLM output, snippet content, any external input | **No** – must be promoted via `acceptUntrustedSql()` inside an event handler only |
| `DisplayableSqlFragment` | Union of `Safe` + `Untrusted` | Display only |
| `SafeLogSqlFragment` | Analytics queries (BigQuery/ClickHouse) | Disjoint – different escape semantics |

**Critical rules enforced:**

- `acceptUntrustedSql()` may **only** be called inside an event handler (button click, form submit), **never** in `useEffect`, `useQuery`, or render body.
- `SafeSqlInput` is the **only** valid consumer of `rawSql` (promotes user‑typed input).
- Snippet content (`unchecked_sql`) is always `UntrustedSqlFragment`;
- Analytics SQL uses `SafeLogSqlFragment` because PostgreSQL escapes are incompatible with BigQuery/ClickHouse.

**Verification:** A build‑time Vitest test (`analytics-sql-boundary.test.ts`) greps the codebase to ensure no file outside `execute-analytics-sql.ts` calls `post()` or `get()` against analytics endpoints.

> **Risk:** The type system relies on TypeScript; no runtime validation of `SafeSqlFragment` is present. Casting (`as SafeSqlFragment`) would bypass protection. Strict code review culture prevents this.

### Dev Toolbar Isolation

The `packages/dev-tools` toolbar is guarded by two layers:

1. **Tree-shaking** – `process.env.NODE_ENV !== 'development'` ternaries in `index.ts` replace components with noops.
2. **Runtime guard** – `IS_LOCAL_DEV` checks return `null` or `<>{children}</>`.

> The toolbar is expanding to staging/preview deploys. Ensure the environment guard logic remains aligned with build‑time tree‑shaking.

### Telemetry Data Minimization

- Event naming: `[object]_[verb]` snake_case, approved verbs only.
- Property naming: camelCase, self‑explanatory, no PII.
- Passive view tracking prohibited (exception: `_exposed` for A/B experiments).
- PostHog feature flag values are captured via `usePHFlag<boolean>('flag')` with conditional spread to avoid `false` when store hasn't loaded.
- Events are defined in `packages/common/telemetry-constants.ts` with JSDoc `@group Events` and `@source`.

---

## Testing Strategy

The codebase employs a three‑layer testing approach:

| Layer | Tool | Scope | Key Artifact |
|-------|------|-------|--------------|
| **Unit** | Vitest + `.utils.ts` | Pure function transformations | `ComponentName.utils.test.ts` |
| **Component** | Vitest + MSW + customRender | Complex UI interactions, React Query hooks | `apps/studio/tests/lib/msw.ts` |
| **E2E** | Playwright | Shared self‑hosted / platform features | `e2e/studio/features/*.spec.ts` |

**Strengths:**

- Logic is extracted into pure functions – cheap, thorough unit coverage.
- MSW mock API tests enforce OpenAPI contract compliance and exercise React Query’s caching.
- E2E tests use `waitForApiResponse` waiters (avoids race conditions) and `getByRole` selectors (accessibility‑first).

**Deficiency:** No visual regression testing (Playwright snapshots) in the E2E suite.

---

## Key Packages

| Package | Description |
|---------|-------------|
| `packages/ui` | shadcn/ui + Radix component library. All primitives exported with `_Shadcn` suffix. |
| `packages/common` | Telemetry constants, PostHog client, ConfigCat flag client. |
| `packages/dev-tools` | Developer toolbar – tree‑shaken in production. |
| `packages/pg-meta` | Backend types and client for PostgreSQL metadata queries. |
| `packages/ai-commands` | AI command definitions and handlers. |
| `packages/shared-data` | Shared data models used across apps. |

---

## Configuration & Agent Integration

### MCP (Model Context Protocol)

- **`/.mcp.json`** defines an HTTP MCP server at `https://mcp.supabase.com/mcp`.
- **`/.claude/settings.json`** defines hooks for SessionStart (`install_pkgs.sh`) and PostToolUse (`format_and_lint.sh`).
- **`/.claude/skills/`**, **`/.cursor/rules/`**, **`/.github/instructions/`** contain agent skill definitions for Claude Desktop, Cursor IDE, and GitHub Copilot respectively.

> **Note:** Skill definitions are duplicated across three directories. A future consolidation to `docs/skills/` with generation scripts is planned.

### Copilot Instructions

- **`/.github/copilot-instructions.md`** – Top‑level guidelines.
- **`/.github/instructions/*.instructions.md`** – Topic‑specific review policies.

---

## Known Issues & Recommendations

| # | Area | Issue | Severity | Recommendation |
|---|------|-------|----------|---------------|
| 1 | **Security** | No runtime validation of `SafeSqlFragment` | Medium | Add a runtime assertion in `executeSql` that input passes a basic pattern check (e.g., no backticks, no `DROP` in analytics SQL). |
| 2 | **Security** | MCP server URL hardcoded | Low | Move to environment variable; audit endpoint ownership. |
| 3 | **Architecture** | Skill definition duplication | Low | Centralize in `docs/skills/` with generation scripts. |
| 4 | **Architecture** | Docker startup not integrated into `pnpm dev:studio` | Low | Add a `dev:studio:full` command that runs Docker Compose first. |
| 5 | **Performance** | Test isolation overhead (per‑file) | Low | Consider per‑project isolation instead of per‑file. |
| 6 | **Quality** | No visual regression testing in E2E | Medium | Add Playwright snapshot matchers for key dashboards. |
| 7 | **Maintenance** | Shortcut registry has legacy one‑off listeners | Low | Schedule migration to centralised registry. |
| 8 | **Compliance** | Feature flag overrides for staging/preview lack guard discussion | Low | Document expanded environment guard plan in skill. |

---

## Contributing

Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed contribution guidelines. Pull requests must pass linting (`pnpm lint`), type checking (`pnpm typecheck`), and all test tiers.

---

**Related Documentation**

- [Architecture Decisions Record (ADR)](https://github.com/supabase/supabase/tree/main/docs/adr)
- [API Reference](./API_Reference.md)
- [Local Development Setup](./docs/development/setup.md)

---

*Supabase Monorepo – Built with ❤️ by the Supabase team.*