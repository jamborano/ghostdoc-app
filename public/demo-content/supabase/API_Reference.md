# Supabase Studio API Reference

**Version:** 2.6  
**Base URL:** `http://localhost:8080` (local development)  
**Documentation Scope:** Internal Studio API endpoints consumed by the Next.js frontend. All endpoints are subject to the security, composition, and error-handling patterns described in the architectural analysis.

---

## Table of Contents

- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Common Types & Conventions](#common-types--conventions)
- [Organization Endpoints](#organization-endpoints)
- [Project Endpoints](#project-endpoints)
- [Database Query Endpoints](#database-query-endpoints)
- [Log Analytics Endpoints](#log-analytics-endpoints)
- [Auth Management Endpoints](#auth-management-endpoints)
- [SQL Injection Protection – Usage Patterns](#sql-injection-protection--usage-patterns)
- [Mutation & Query Hooks (React Query)](#mutation--query-hooks-react-query)
- [Appendix: Error Codes & Patterns](#appendix-error-codes--patterns)

---

## Authentication

All API requests require a **session JWT** obtained from Supabase Auth. Pass the token in the `Authorization` header:

```
Authorization: Bearer <session_token>
```

Session tokens are managed by the `useSession` hook. Unauthenticated requests receive a `401 Unauthorized` response.

---

## Error Handling

All API errors follow a unified structure:

```json
{
  "error": {
    "type": "BadRequest | Forbidden | NotFound | Internal | ...",
    "message": "Human-readable description",
    "details": {}
  }
}
```

On the frontend, the `handleError` function in `data/fetchers.ts` matches error messages against `ERROR_PATTERNS` and throws typed subclasses. The `<ErrorMatcher>` component renders contextual troubleshooting links based on `errorType`.

**Error classification patterns (defined in `packages/common/error-patterns.ts`):**

| Pattern | Type | Description |
|---------|------|-------------|
| `"already exists"` | `Conflict` | Resource creation conflict |
| `"not found"` | `NotFound` | Resource does not exist |
| `"permission denied"` | `Forbidden` | Insufficient privileges |
| `"invalid"` | `BadRequest` | Malformed input |
| `"timeout"` | `Timeout` | Upstream service timeout |

---

## Common Types & Conventions

### Response Pagination

Paginated endpoints return:

```typescript
{
  data: T[],
  total: number,
  page: number,
  per_page: number
}
```

### Safe SQL Fragments (Security Enforcement)

All SQL query payloads enforce **branded types** at compile time:

```typescript
type SafeSqlFragment  = string & { __brand: 'SafeSqlFragment' }
type UntrustedSqlFragment = string & { __brand: 'UntrustedSqlFragment' }
type SafeLogSqlFragment = string & { __brand: 'SafeLogSqlFragment' }
```

- **SafeSqlFragment**: allowed for execution (hardcoded, user-typed via `SafeSqlInput`, or sanitized with `ident`/`literal`/`keyword`).
- **UntrustedSqlFragment**: display only, never executed.
- **SafeLogSqlFragment**: used exclusively for Analytics (BigQuery/ClickHouse) endpoints.

**Critical rule:** `acceptUntrustedSql()` may only be called inside event handlers (button click, form submit), not in `useEffect`, `useQuery`, or render body. See [SQL Injection Protection](#sql-injection-protection--usage-patterns).

### Query Options (React Query)

Every API endpoint has a corresponding **queryOptions** export in `keys.ts`. Example:

```typescript
// projectQueryOptions.ts
const getProject = async (ref: string): Promise<Project> => { ... }
export const projectQueryOptions = (ref: string) =>
  queryOptions({
    queryKey: ['projects', ref],
    queryFn: () => getProject(ref),
  })
```

Components use: `const { data } = useQuery(projectQueryOptions(ref))`

### Mutation Hooks

Mutations return a standard `useMutation` object with:

- Default `toast.error` on failure.
- `onSuccess` that invalidates both list and detail keys via `Promise.all`.

---

## Organization Endpoints

### `GET /api/organizations`

Retrieve all organizations accessible to the current user.

**Parameters:** None

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "slug": "string",
      "billing_email": "string",
      "created_at": "ISO8601"
    }
  ]
}
```

**Query Options:** `organizationsQueryOptions`

**Usage Example (React Query):**

```typescript
import { useQuery } from '@tanstack/react-query'
import { organizationsQueryOptions } from 'data/organizations/organizations-query-options'

function OrganizationList() {
  const { data, isLoading } = useQuery(organizationsQueryOptions())
  if (isLoading) return <Spinner />
  return data?.map(org => <OrganizationCard key={org.id} org={org} />)
}
```

---

### `GET /api/organizations/:slug`

Get a single organization by slug.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | yes | Organization slug |

**Response:**

```json
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "billing_email": "string",
  "created_at": "ISO8601"
}
```

**Query Options:** `organizationQueryOptions(slug)`

---

### `PATCH /api/organizations/:slug`

Update organization details.

**Request Body (partial update):**

```json
{
  "name": "string",
  "billing_email": "string"
}
```

**Response:** Updated organization object.

**Mutation:** `useUpdateOrganizationMutation`

**Usage Example:**

```typescript
const mutation = useUpdateOrganizationMutation()
mutation.mutate({ slug: 'my-org', name: 'New Name' })
```

---

## Project Endpoints

### `GET /api/projects`

List all projects for all organizations user has access to.

**Parameters:** None

**Response:** Array of `Project`

**Query Options:** `projectsQueryOptions`

### `GET /api/projects/:ref`

Get single project by reference.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ref` | string | yes | Project reference (unique ID) |

**Response:** `Project`

### `PATCH /api/projects/:ref`

Update project settings.

**Request Body:** partial project update

### `POST /api/projects`

Create a new project within an organization.

**Request Body:**

```json
{
  "organization_id": "uuid",
  "name": "string",
  "region": "us-east-1",
  "plan": "free | pro | team | enterprise"
}
```

**Response:** Created project object.

### `DELETE /api/projects/:ref`

Delete a project. Requires confirmation token.

**Request Body:**

```json
{
  "confirmation_token": "string"
}
```

**Mutation:** `useDeleteProjectMutation`

---

## Database Query Endpoints

These endpoints use **SafeSqlFragment** typed payloads. Unsafe SQL is rejected at compile time and runtime.

### `POST /api/projects/:ref/database/query`

Execute a read-only SQL query on the project's database.

**Security:** Input must be a `SafeSqlFragment`. The only valid consumer of user-typed SQL is the `SafeSqlInput` component, which promotes `string` to `SafeSqlFragment` after client-side sanitization.

**Request Body:**

```json
{
  "query": "SELECT * FROM users WHERE id = $1",
  "params": ["user-id-uuid"]
}
```

- `query`: `SafeSqlFragment`
- `params`: optional array of `SafeSqlInput` values (promotes user input to `SafeSqlFragment`)

**Response:**

```json
{
  "rows": [{}],
  "fields": [{ "name": "string", "data_type": "string" }]
}
```

**Error Responses:** `400 Bad Request` if query contains disallowed operations (DDL, DROP, etc.) or if untrusted SQL is passed.

**Query Options:** `databaseQueryOptions(ref, { query, params })`

**Mutation:** `useRunSqlMutation`

**Usage Example (inside event handler – safe):**

```typescript
import { safeSql, literal } from 'data/sql/safe'

// Inside a click handler
const handleRun = async () => {
  const query = safeSql`SELECT * FROM users WHERE id = ${literal(userId)}`
  const result = await runSqlMutation.mutateAsync({ query })
}
```

---

### `POST /api/projects/:ref/database/migrate`

Execute a migration SQL (DDL allowed). Same security constraints apply.

**Request Body:**

```json
{
  "query": "CREATE TABLE ...",
  "params": []
}
```

**Restriction:** Must be authorized user with migration permissions.

---

## Log Analytics Endpoints

These endpoints use the separate `SafeLogSqlFragment` brand, because PostgreSQL escape semantics differ from BigQuery/ClickHouse.

### `POST /api/logs/query`

Execute an analytics SQL query against the logs data warehouse (supports BigQuery and ClickHouse backends).

**Security:** The `executeAnalyticsSql` wrapper **must** be the only consumer of this endpoint. Build-time vitest test `analytics-sql-boundary.test.ts` ensures no other file calls `post()` or `get()` against `logs.all` endpoints.

**Request Body:**

```json
{
  "query": "SELECT timestamp, method, status_code FROM logs WHERE status_code >= 400 LIMIT 100"
}
```

- `query` must be `SafeLogSqlFragment`. Promotion from `SafeSqlFragment` is disallowed; use `safeLogSql` helper.

**Response:**

```json
{
  "rows": [{}],
  "fields": [{"name": "string", "type": "STRING | INTEGER | TIMESTAMP"}]
}
```

**Query Options:** `logQueryOptions`

**Mutation:** None (read-only).

**Usage Example:**

```typescript
import { safeLogSql } from 'data/logs/safe-analytics-sql'

const logOptions = logQueryOptions({
  query: safeLogSql`SELECT * FROM logs WHERE status_code > ${200}`
})
```

---

### `POST /api/logs/aggregate`

Perform aggregation queries (count, histogram, timeseries).

**Request Body:**

```json
{
  "query": "SELECT COUNT(*) AS error_count, status_code, ceil(timestamp/3600) AS hour_window ..."
}
```

**Response:** Same as `POST /api/logs/query`.

---

## Auth Management Endpoints

### `GET /api/projects/:ref/auth/users`

List users for a project.

**Parameters:** Supports pagination via query parameters.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | no | Page number (default 1) |
| `per_page` | number | no | Items per page (default 50) |

**Response:** Paginated array of `User`

### `DELETE /api/projects/:ref/auth/users/:id`

Delete a user.

**Request Body:** None (idempotent)

---

## SQL Injection Protection – Usage Patterns

All SQL inputs must originate from one of these helpers:

### Safe SQL from Literals (`safeSql` template literal)

```typescript
import { safeSql } from 'data/sql/safe'
const query = safeSql`SELECT * FROM users WHERE id = ${literal(id)}`
// Returns SafeSqlFragment
```

### Safe SQL Input (`SafeSqlInput` component)

The only component that accepts raw user input and promotes to `SafeSqlFragment`:

```tsx
<SafeSqlInput
  placeholder={safeSql`SELECT * FROM users`}
  value={query}
  onChange={setQuery} // setQuery expects SafeSqlFragment
/>
```

### Sanitization Functions

| Function | Escapes | Example |
|----------|---------|---------|
| `ident('table_name')` | Double-quotes identifier | `safeSql\`SELECT * FROM ${ident('table1')}\`` |
| `literal('value')` | Single-quotes and escapes string | `safeSql\`WHERE name = ${literal("O'Brien")}\`` |
| `keyword('SELECT')` | Forces keyword case | `safeSql\`${keyword('select')} ...\`` |

### Untrusted SQL

Untrusted inputs (URL params, LLM output, snippet content) are typed `UntrustedSqlFragment` and may **never** be executed. They can be promoted only inside event handlers via:

```typescript
import { acceptUntrustedSql } from 'data/sql/safe'

// Inside button click handler:
const handleRun = () => {
  const safe = acceptUntrustedSql(untrustedQuery) // SafeSqlFragment
  // Now safe to use in query
}
```

**Failure to use `acceptUntrustedSql` outside of an event handler** triggers a TypeScript compile error through branded type inference and a runtime guard.

---

## Mutation & Query Hooks (React Query)

Every mutation hook follows this pattern:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPost } from 'lib/api'

export function useCreateProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => apiPost('/api/projects', payload),
    onSuccess: () => {
      toast.success('Project created')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      // handleError already called in fetchers.ts; additional UI handling
    }
  })
}
```

**Key conventions:**

- **queryKey** follows domain entity pattern: `['entity', id]`.
- **onSuccess** invalidates both list and detail via `Promise.all`:
  ```typescript
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['projects'] }),
      queryClient.invalidateQueries({ queryKey: ['organizations'] }),
    ])
  }
  ```

---

## Appendix: Error Codes & Patterns

| HTTP Status | Error Type | Common Causes |
|-------------|------------|---------------|
| 400 | `BadRequest` | Invalid payload, missing fields, SQL validation failure |
| 401 | `Unauthorized` | Missing or expired token |
| 403 | `Forbidden` | Insufficient permissions, disallowed SQL operation |
| 404 | `NotFound` | Organization, project, or resource does not exist |
| 409 | `Conflict` | Duplicate resource (e.g., project name already taken) |
| 422 | `UnprocessableEntity` | Semantic validation failure (e.g., foreign key missing) |
| 429 | `TooManyRequests` | Rate limit exceeded |
| 500 | `Internal` | Upstream service error |
| 504 | `Timeout` | Upstream service timeout (e.g., analytics query timeout) |

**Client-side classification** happens via `handleError`:

```typescript
// data/fetchers.ts (simplified)
export function handleError(response: Response): never {
  const body = await response.json()
  const errorType = matchErrorPattern(body.error.message, ERROR_PATTERNS)
  throw new TypedError(errorType, body.error.message, body.error.details)
}
```

The `<ErrorMatcher>` component in `components/ui/error-matcher.tsx` uses an O(1) lookup to render appropriate troubleshooting guidance.

---

*This API reference follows the architectural patterns documented in the Supabase Studio monorepo. All SQL endpoints enforce compile-time branded types and runtime validation. See the [SQL Injection Protection](#sql-injection-protection--usage-patterns) section for authoritative usage rules.*