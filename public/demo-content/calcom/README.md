# Cal.diy

<p align="center">
  <img src="https://raw.githubusercontent.com/calcom/cal.com/main/public/calcom-logo.svg" alt="Cal.com Logo" width="200" />
</p>

<p align="center">
  <b>Community-maintained, MIT-licensed fork of Cal.com</b><br/>
  Open-source scheduling infrastructure built for scale.
</p>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
  - [Monorepo Structure](#monorepo-structure)
  - [Dependency Layers](#dependency-layers)
  - [Design Patterns](#design-patterns)
  - [Data Flow](#data-flow)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Database Setup](#database-setup)
  - [Run Development](#run-development)
- [Usage](#usage)
  - [Starting the Application](#starting-the-application)
  - [API Documentation](#api-documentation)
- [Security](#security)
  - [OWASP Top 10 Coverage](#owasp-top-10-coverage)
  - [Best Practices](#best-practices)
- [Performance](#performance)
  - [Bundle Optimization](#bundle-optimization)
  - [Data Fetching & Caching](#data-fetching--caching)
  - [Re-render Optimization](#re-render-optimization)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

Cal.diy is a community-driven fork of [Cal.com](https://github.com/calcom/cal.com), offering a fully open-source, self-hostable scheduling platform. It provides booking, availability management, calendar integration, and team features—all built on a modern **monorepo** using **Next.js**, **tRPC**, **Prisma**, and **NestJS**.

This README serves as a comprehensive architectural guide and setup reference for developers and administrators.

**Key differentiators:**
- Community-maintained (no upstream merge lag)
- Granular **Permission-Based Access Control (PBAC)**
- Strong **vertical slice architecture**
- Built-in **performance optimizations** (Vercel React Best Practices integrated)
- Focus on security with documented encryption and CSP strategies

---

## Architecture

### Monorepo Structure

The project uses **Yarn workspaces** with **Turbo** for parallel task execution.

```
apps/
├── web/                  # Next.js App Router (main application)
└── api/
    └── v2/               # NestJS REST API (optional)

packages/
├── prisma/               # Database schema & migrations
├── trpc/                 # tRPC API layer (routers, procedures)
├── ui/                   # Shared UI component library
├── features/             # Domain feature implementations
├── app-store/            # Third-party integrations (Google Calendar, Zoom, etc.)
├── lib/                  # Low-level utilities (no ORM imports)
├── platform-libraries/   # Re-export bridge for api/v2
└── (other supporting packages)
```

### Dependency Layers

The codebase enforces strict acyclic dependencies. Each layer can only import from layers below it:

```
packages/lib          (foundation – no business logic)
        ↓
packages/app-store    (integrations – relies on lib)
        ↓
packages/features     (domain logic – uses lib & app-store)
        ↓
packages/trpc         (API orchestrator – utilizes features, app-store, lib)
        ↓
apps/web             (presentation layer – highest level)
```

**Circular dependencies are explicitly prohibited.**

### Design Patterns

| Pattern | Description |
|---------|-------------|
| **Vertical Slices** | Features are self-contained directories with their own services, repositories, and controllers (e.g., `packages/features/bookings/`). |
| **Thin Controllers** | tRPC routers and NestJS controllers handle only HTTP concerns; business logic is delegated to service classes. |
| **Repository Pattern** | Prisma queries are encapsulated in `Prisma<Entity>Repository` classes, returning typed DTOs instead of raw models. |
| **DTO Boundaries** | Data Transfer Objects isolate internal models from API contracts, ensuring backward compatibility. |
| **Permission-Based Access Control (PBAC)** | Role checks replaced by granular permission strings (`team.update`, `booking.read`). See `PERMISSIONS.md`. |

### Data Flow

A typical request flows through the following layers:

```
Client (React) → tRPC procedure (Zod validation) → Service → Repository (Prisma with `select`) → Database
                  ↓
              Response serialized as DTO → tRPC → Client
```

For the REST API v2 (NestJS), the flow is analogous:

```
Client → NestJS Controller → Service → Repository → Database
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **Yarn** (classic) >= 1.22
- **PostgreSQL** >= 13
- **Redis** (optional, for caching and queue management)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/cal.diy.git
   cd cal.diy
   ```

2. Install dependencies:

   ```bash
   yarn
   ```

3. Build all packages:

   ```bash
   yarn build
   ```

### Configuration

Copy the example environment file and fill in the required values:

```bash
cp .env.example .env
```

**Critical environment variables:**

| Variable | Description | Requirements |
|----------|-------------|--------------|
| `DATABASE_URL` | PostgreSQL connection string | Example: `postgresql://user:password@localhost:5432/cal` |
| `NEXTAUTH_SECRET` | JWT encryption secret | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Public URL of the app (e.g., `http://localhost:3000`) | Must match production URL in Docker |
| `CALENDSO_ENCRYPTION_KEY` | AES-256 key for encrypting credentials | Generate: `openssl rand -base64 24` |
| `NEXT_PUBLIC_LOGGER_LEVEL` | Logging verbosity (debug, info, warn, error) | Default: `info` |

**CSP (Content Security Policy):**

- Set `CSP_POLICY=strict` for production (nonce-based).
- Set `CSP_POLICY=non-strict` for development (report-only mode).

### Database Setup

1. Run database migrations:

   ```bash
   cd packages/prisma
   npx prisma migrate dev
   ```

2. (Optional) Seed the database with sample data:

   ```bash
   npx prisma db seed
   ```

3. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

### Run Development

Start the development servers for both the Next.js app and the API v2:

```bash
yarn dev
```

This command uses Turbo to run all workspaces in parallel. The main application will be available at `http://localhost:3000`, and the API v2 at `http://localhost:3001`.

---

## Usage

### Starting the Application

For **production**, use the following command:

```bash
yarn start
```

This runs the Next.js production server. Ensure all environment variables (especially `NEXTAUTH_URL`) are set correctly, especially when deploying inside Docker.

### API Documentation

- **tRPC API**: Explore available procedures via the tRPC playground at `/api/trpc-playground` (development only).
- **REST API v2**: An OpenAPI specification is available at `/api/v2/docs` when the NestJS server is running.

---

## Security

### OWASP Top 10 Coverage

Cal.diy addresses key security categories documented in the [architecture audit](#). Below is a summary of implemented controls:

| OWASP Category | Implementation Status |
|----------------|------------------------|
| **A01 – Broken Access Control** | PBAC with granular permission strings. Helper functions (`isTeamAdmin`, `isTeamOwner`) used until full migration. |
| **A02 – Cryptographic Failures** | AES-256 encryption for credentials. Secrets generated via `openssl` (32 bytes). No hardcoded secrets. |
| **A03 – Injection** | Prisma ORM parameterizes queries. CSP nonce on login page. iCalUID handling uses exact string comparison. |
| **A04 – Insecure Design** | Optional rate limiting via Unkey. Versioning is non-breaking but tRPC versioning not formalized. |
| **A05 – Security Misconfiguration** | Environment variable guidance. Docker CORS not yet explicitly configured. |
| **A06 – Vulnerable Components** | Changesets for dependency versioning. Regular `yarn audit` recommended. |
| **A07 – Authentication Failures** | NextAuth.js with JWT. Session management via `useImmutableSWR`. |
| **A08 – Integrity Failures** | Changesets for npm publishing. Focused PRs encouraged in `CONTRIBUTING.md`. |
| **A09 – Logging & Monitoring** | Logger level config via `NEXT_PUBLIC_LOGGER_LEVEL`. Rate limiting logging optional. |
| **A10 – SSRF** | Webhook `subscriberUrl` obfuscated in Snaplet transforms. No direct SSRF vector identified. |

### Best Practices

- **Never expose `credential.key`** in API responses or queries (enforced in `AGENTS.md`).
- **Snaplet transforms** replace sensitive fields (`client_secret`, `api_key`) with UUIDs for staging databases.
- **Security incidents** should be reported to `security@cal.com` (see `SECURITY.md`).

---

## Performance

Cal.diy integrates the **Vercel React Best Practices** skill, enforcing a set of optimization rules to minimize bundle size, reduce waterfalls, and prevent unnecessary re-renders.

### Bundle Optimization

- Avoid **barrel imports** – import specific components (e.g., `import Button from '@mui/material/Button'`).
- Use `next/dynamic` for large components (Monaco editor, etc.).
- Defer third-party analytics scripts after hydration.
- Preload resources on user intent (hover/focus).

### Data Fetching & Caching

- **Server-side**: Use `React.cache()` for per-request deduplication; consider `lru-cache` for cross-request caching.
- **Client-side**: SWR handles deduplication and stale-while-revalidate.
- **Calendar data**: Provider-specific cache layers minimize repeated API calls.

### Re-render Optimization

- Functional `setState`, lazy state initialization, narrow effect dependencies.
- Derive boolean state from existing data (avoid `useState` for computed values).
- Manual `useMemo`/`React.memo` used where React Compiler is not yet enabled.
- **Note**: Many manual memoization rules become obsolete with the React Compiler – proceed with caution.

For a complete list of performance rules, see the [Vercel React Best Practices](https://github.com/vercel/react-best-practices) integration.

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

**High-level guidelines:**
- Keep pull requests small and focused.
- Follow the **architectural patterns** documented above.
- Ensure code is formatted with **Biome** (config provided in `.vscode/settings.json`).
- Run `yarn lint` and `yarn test` before committing.

**Developer environment**:
- Use **VSCode** with recommended extensions (Biome, Prisma, etc.) for a consistent experience.
- Snaplet is used for database anonymization – always run with `$mode: "safe"` after reviewing custom transforms.

---

## License

This project is **MIT** licensed – see the [LICENSE](LICENSE) file for details.

---

## Contact

- **Security**: `security@cal.com`
- **Community**: [GitHub Discussions](https://github.com/your-org/cal.diy/discussions)
- **Documentation**: Full API reference and developer guides are available in the `docs/` folder and at [https://cal.diy/docs](https://cal.diy/docs) (coming soon).

---

*Built with ❤️ by the Cal.diy Community*