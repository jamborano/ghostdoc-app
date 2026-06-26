# OWASP Juice Shop

[![Build Status](https://img.shields.io/github/actions/workflow/status/juice-shop/juice-shop/build.yml?branch=master)](https://github.com/juice-shop/juice-shop/actions)
[![Coverage Status](https://coveralls.io/repos/github/juice-shop/juice-shop/badge.svg)](https://coveralls.io/github/juice-shop/juice-shop)
[![Known Vulnerabilities](https://snyk.io/test/github/juice-shop/juice-shop/badge.svg)](https://snyk.io/test/github/juice-shop/juice-shop)
[![Gitter](https://badges.gitter.im/OWASP/juice-shop.svg)](https://gitter.im/OWASP/juice-shop)

The most modern and sophisticated insecure web application for security training and awareness. Produced by the OWASP project, designed to teach developers, pentesters, and security engineers about real-world vulnerabilities in a safe, legal environment.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Architecture](#architecture)
  - [System Architecture](#system-architecture)
  - [Data Flow](#data-flow)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [Running the Application](#running-the-application)
  - [Accessing the API](#accessing-the-api)
- [Security Challenges & Training](#security-challenges--training)
  - [Challenge Categories](#challenge-categories)
  - [Security Audit Summary](#security-audit-summary)
  - [Critical Vulnerability Paths](#critical-vulnerability-paths)
- [Technical Debt & Code Quality](#technical-debt--code-quality)
- [Scalability & Operational Risks](#scalability--operational-risks)
- [Recommendations](#recommendations)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## About

The OWASP Juice Shop is an intentionally insecure web application written in Node.js, Express, and Angular. It encompasses the entire OWASP Top 10 vulnerability categories and dozens of additional security flaws, making it an ideal training ground for security enthusiasts. The project follows a "Capture The Flag" style where participants solve challenges of varying difficulty across multiple categories.

---

## Features

- **Modern Stack**: Node.js 22–25, Express 4.x with TypeScript, Angular 21 (SPA)
- **Dual Database Persistence**: SQLite via Sequelize ORM (relational) and MarsDB in-memory document store
- **AI/LLM Integration**: Configurable OpenAI-compatible chatbot with function calling (search products, reviews, orders, coupon generation)
- **Static Content Server**: FTP-simulated directory, `.well-known` endpoints, encryption key distribution
- **Comprehensive Challenge System**: 100+ challenges driven by `challenges.yml`, with runtime challenge tracking
- **Codefix Training**: Source-level vulnerabilities embedded via `// vuln-code-snippet` blocks; RSN validation ensures consistency
- **Build & Test Tooling**: Grunt, Cypress, Mocha/Vitest, RSN (Refactoring Safety Net)
- **Docker & Container Support**: Official Docker image (`bkimminich/juice-shop`)

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Client                            │
│  Browser (Angular SPA) / API Client / Chatbot Interface │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/HTTPS
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    Express Server (Node.js)               │
│  app.ts → server.ts → Middleware Stack                    │
│  ├─ Static File Serving (/assets, /ftp, /.well-known)     │
│  ├─ Cookie Parser (secret: 'kekse')                       │
│  ├─ Authorization Guards (JWT-based)                      │
│  ├─ Rate Limiting / Logging                               │
│  └─ Route Handlers → API Endpoints                        │
└───────────┬──────────────────────┬───────────────────────┘
            │                      │
            ▼                      ▼
┌───────────────────┐  ┌──────────────────────────┐
│   Sequelize ORM    │  │      MarsDB (in-memory)   │
│   (SQLite .db)     │  │  reviewsCollection        │
│   Users, Products, │  │  ordersCollection         │
│   Challenges, etc. │  │  (Ephemeral)              │
└───────────────────┘  └──────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│              External AI/LLM API (configurable)           │
│  OpenAI-compatible – tool calls: searchProducts,          │
│  getProductReviews, getOrderById, generateCoupon          │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Request Lifecycle**: `app.ts` initializes Express → `server.ts` mounts middleware and routes → request passes through security checks, static file handlers, and route controllers → Sequelize or MarsDB queries → response serialization.
2. **Challenge System**: Challenges defined in `data/static/challenges.yml` → parsed at startup by `datacreator.ts` → populated into `ChallengeModel` (Sequelize) → served via `/api/Challenges` to Angular frontend.
3. **Codefix Extraction**: Source files contain `// vuln-code-snippet` markers → extracted at build time → stored in `data/static/codefixes/*.ts` → validated by RSN for consistency with master challenge definitions.
4. **AI Chatbot**: User queries → chatbot endpoint → function call to `getProductReviews` → raw MarsDB `$where` query with unsanitized `productId` → potential NoSQL injection.

---

## Getting Started

### Prerequisites

- **Node.js**: v22–25 (specific minor versions tested; see `ENGEL.md` for compatibility matrix)
- **npm**: >=10.x
- **grunt-cli** (optional, for build tooling)
- **Docker** (optional, for containerized deployment)

### Installation

**Option 1: Direct Node.js Installation**
```bash
git clone https://github.com/juice-shop/juice-shop.git
cd juice-shop
npm install
npm run build   # Runs Grunt to compile Angular and copy assets
```

**Option 2: Docker**
```bash
docker pull bkimminich/juice-shop
docker run --rm -p 3000:3000 bkimminich/juice-shop
```

### Configuration

Environment variables (see `config/default.yml`):

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Set to `production` for hardened mode |
| `PORT` | `3000` | Application port |
| `DATABASE` | `sqlite:data/juiceshop.db` | SQLite path (use `postgres://...` for PostgreSQL in CTF) |
| `JWT_SECRET` | `insecure` | JWT signing secret; override for production |
| `COOKIE_SECRET` | `kekse` | Cookie parser secret; enforce `secure` + `httpOnly` in production |
| `AI_API_ENDPOINT` | – | OpenAI-compatible API endpoint for chatbot |
| `AI_API_KEY` | – | API key for LLM provider |
| `SAFETY_MODE` | `false` | Enables additional safety checks for production use |

---

## Usage

### Running the Application

```bash
npm start
# or for production:
NODE_ENV=production npm start
```

Access the SPA at `http://localhost:3000`. Default credentials: `admin@juice-sh.op` / `admin123`.

### Accessing the API

The REST API is exposed under `/api/`. Documentation available in `API_Reference.md`. Interactive exploration via Swagger (if enabled) at `/api-docs`.

---

## Security Challenges & Training

The application contains 100+ challenges across multiple categories. Each challenge is tracked by the `ChallengeModel` and can be solved via the UI or direct API manipulation.

### Challenge Categories

- **SQL Injection** (A03:2021)
- **Broken Access Control** (A01:2021) – Admin route obfuscation, product price manipulation
- **Cryptographic Failures** (A02:2021) – Weak email masking, JWT null algorithm acceptance
- **NoSQL Injection** – Chatbot product review query
- **Security Misconfiguration** – FTP directory listing, cookie flags, log exposure
- **Software & Data Integrity** – Prototype pollution via vulnerable dependencies
- **XXE, XSS, CSRF**, and more

### Security Audit Summary

Based on the latest codebase analysis (Q4 2025), the following critical and high-severity findings are intentionally present:

| OWASP Category | Finding | Severity | Location |
|----------------|---------|----------|----------|
| A01:2021 | Unauthorized POST/PUT to `/api/Products` | Critical | `changeProductChallenge_1.ts` |
| A01:2021 | Admin route obfuscation failure | High | `adminSectionChallenge_2.ts` |
| A01:2021 | Log file exposure via directory listing | High | `accessLogDisclosureChallenge_2.ts` |
| A03:2021 | NoSQL injection via `getProductReviews` tool | Critical | `chatbotGreedyInjectionChallenge_1.ts` |
| A02:2021 | Weak email masking pattern | High | Order display logic |
| A02:2021 | Hardcoded cookie secret without security flags | High | `app.ts` |
| A05:2021 | FTP directory with full browse/read | High | `/ftp` endpoint |
| A08:2021 | Prototype pollution via `hoek` dependency | Medium | `Gruntfile.js` |

### Critical Vulnerability Paths

```
[Attacker] → Chatbot endpoint → getProductReviews tool → Unsanitized productId → MarsDB $where injection → Data exfiltration
[Attacker] → /api/Products (PUT) if unauthorized → Tamper product data → Challenge exploitation
[Attacker] → /ftp or /support/logs → Directory listing → Access logs, encryption keys, quarantine files
```

All vulnerabilities are intended for educational exploitation. In production-like environments (CTF events, demos), apply network segmentation, firewall rules, and enable `SAFETY_MODE`.

---

## Technical Debt & Code Quality

The project embraces technical debt as a teaching tool. Known quality issues include:

- **Monolithic Authorization**: Authorization logic scattered across `server.ts` using repetitive `app.use('/api/...', security.isAuthorized())`. No centralized policy enforcement point.
- **Dual Database Complexity**: SQLite + MarsDB introduces data consistency challenges and no cross-database transactions.
- **AI Assistant Config Sprawl**: Multiple agent configuration files (`.claude/`, `.codeium/`, `.continue/`, `.copilot/`, `.junie/`) all referencing `AGENTS.md`. Redundant maintenance.
- **`datacreator.ts`**: 600+ line function violating Single Responsibility Principle (user creation, product setup, file preparation).
- **Deprecated Grunt Plugins**: Uses `grunt-contrib-compress` (deprecated); should migrate to `archiver`.
- **Inconsistent Error Handling**: Mix of `catch(err)` with `logger.error()` and bare `throw err`. No standardized error classes or HTTP status mapping.
- **TypeScript Anomalies**: `@ts-expect-error FIXME` comments in MarsDB and `replace` package indicate unresolved types.
- **Test Coverage Gaps**: No integration tests for chatbot tool execution; AI-skill files lack automated validation; RSN only covers codefixes.

---

## Scalability & Operational Risks

### Bottlenecks

- **SQLite Concurrency**: Single-writer mode leads to write contention under concurrent challenge solving (50+ users). Recommended migration to PostgreSQL for CTF events.
- **MarsDB Volatility**: In-memory document store loses data on restart. Order/review history is ephemeral – unsuitable for multi-session training.
- **Single-Process Express**: No clustering or PM2 configuration. AI chatbot responses and large file downloads block the event loop.

### Operational Risks

- **Node.js Compatibility**: Build tested only on specific Node minor versions (22–25); intermediate releases may cause failures.
- **Docker Security**: Container runs as root; no `USER` directive increases escape blast radius.
- **Missing Observability**: No APM integration, structured logging, or health check endpoints. Incident response relies on manual log inspection.

---

## Recommendations

| Priority | Finding | Required Action |
|----------|---------|----------------|
| P0 | NoSQL injection in chatbot product reviews | Sanitize `productId` input; use parameterized queries or object validation for MarsDB |
| P0 | Product API broken access control | Ensure `POST/PUT /api/Products` is blocked for non-admin roles in production |
| P1 | Hardcoded cookie secret | Use environment-variable-based secret; enforce `httpOnly`, `secure`, `sameSite` |
| P1 | SQLite concurrency limitation | Implement read-replica or migration to PostgreSQL for write-heavy paths |
| P2 | Monolithic authorization | Refactor to middleware factory or policy engine (e.g., CASL) |
| P2 | AI skill file duplication | Consolidate AI instructions into a single authoritative `AGENTS.md` with per-agent overrides |

---

## API Reference

Full API documentation is provided in [`API_Reference.md`](./API_Reference.md). It covers all endpoints, request/response formats, authentication, and challenge-specific annotations.

---

## Contributing

We welcome contributions! Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for guidelines on code standards, commit messages, and the pull request process. Note that the project intentionally keeps some vulnerabilities to maintain training value – do not "fix" them without explicit discussion.

### Reproducibility Environment

- Use Node.js 22–25 (see `ENGEL.md`)
- Run `npm install` and `npm run build` before testing
- All code changes should pass `npm test` (Mocha, Vitest, Cypress) and RSN validation

---

## License

[![License](https://img.shields.io/github/license/juice-shop/juice-shop.svg)](LICENSE)  
This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- OWASP Foundation for ongoing support.
- All contributors who have reported issues, submitted PRs, or opened discussions.
- The community of security trainers and researchers who use this application in their work.

---

*"The Best Defense is a Good Offense"* – For training purposes only. Do not deploy this application without proper containment measures.