# API Reference

**Cal.diy** exposes two API surfaces:

- **tRPC** (primary, used by the web app and mobile clients) – runs over HTTP POST to a single endpoint (`/api/trpc`), strongly typed, with Zod validation.
- **REST API v2** (secondary, for third-party integrations) – traditional HTTP JSON API under `/v2/`, built with NestJS, also uses DTOs and repository pattern.

This document covers both surfaces, including end‑point paths, request/response schemas, authentication, error handling, and usage examples.

---

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Common Patterns](#common-patterns)
3. [tRPC API](#trpc-api)
   - [Routers Overview](#routers-overview)
   - [Procedure: `bookings.create`](#procedure-bookingscreate)
   - [Procedure: `bookings.list`](#procedure-bookingslist)
   - [Procedure: `eventTypes.get`](#procedure-eventtypesget)
   - [Procedure: `availability.get`](#procedure-availabilityget)
   - [Procedure: `user.updateProfile`](#procedure-userupdateprofile)
4. [REST API v2](#rest-api-v2)
   - [Bookings](#rest-bookings)
   - [Event Types](#rest-event-types)
   - [Users](#rest-users)
   - [Availability](#rest-availability)
   - [Webhooks](#rest-webhooks)
5. [Error Codes](#error-codes)
6. [Rate Limiting](#rate-limiting)
7. [Security Considerations](#security-considerations)

---

## Authentication & Authorization

| Requirement | Details |
|-------------|---------|
| **tRPC** | Session‑based via NextAuth.js. The client includes credentials (cookie) automatically. |
| **REST API v2** | Bearer token in `Authorization` header. Tokens are scoped (user‑level or API‑key for service accounts). |
| **Authorization model** | Permission‑Based Access Control (PBAC). Every resource action is a string like `booking.read`, `team.update`. Permissions are checked in controllers/services. |

Example: API‑key authentication for REST v2  

```bash
curl -H "Authorization: Bearer cal_diy_sk_abc123" \
  https://api.cal.diy/v2/bookings
```

---

## Common Patterns

- **All tRPC procedures** validate input with Zod schemas. Output is a typed DTO – never raw Prisma models.
- **REST v2 endpoints** follow NestJS controller → service → repository. Responses are wrapped in a standard envelope:
  ```json
  {
    "status": "success",
    "data": { ... },
    "meta": { "total": 100, "page": 1 }
  }
  ```
- **Errors** always return:
  ```json
  {
    "status": "error",
    "code": "UNAUTHORIZED",
    "message": "Missing required permission: booking.create"
  }
  ```

---

## tRPC API

All tRPC procedures are accessible at `https://app.cal.diy/api/trpc`.  
The client library (`@calcom/trpc`) provides full type inference.

### Routers Overview

| Router | Procedures (incomplete list) |
|--------|-----------------------------|
| `bookings` | `create`, `list`, `get`, `cancel`, `reschedule`, `confirm` |
| `eventTypes` | `get`, `list`, `create`, `update`, `delete` |
| `availability` | `get`, `update`, `schedule.get`, `schedule.update` |
| `users` | `getMe`, `updateProfile`, `deleteAccount` |
| `teams` | `list`, `get`, `members.list`, `members.invite` |
| `workflows` | `list`, `trigger`, `update` |

### Procedure: `bookings.create`

**Input schema (Zod)**

```typescript
z.object({
  eventTypeId: z.number().int().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  timeZone: z.string(),
  language: z.string().default('en'),
  metadata: z.object({}).optional(),
  responses: z.object({
    name: z.string(),
    email: z.string().email(),
    guests: z.array(z.string().email()).optional(),
    location: z.string().optional(),
    notes: z.string().optional(),
  }),
})
```

**Output schema (DTO)**

```typescript
{
  id: string;            // UUID
  uid: string;           // public booking identifier
  title: string;
  startTime: string;     // ISO 8601
  endTime: string;
  status: 'ACCEPTED' | 'PENDING' | 'CANCELLED';
  eventTypeId: number;
  attendee: {
    name: string;
    email: string;
    timeZone: string;
  };
  location: string | null;
  metadata: Record<string, unknown> | null;
}
```

**Example – client call (TypeScript)**

```typescript
import { trpc } from '@calcom/trpc';

const booking = await trpc.bookings.create.mutate({
  eventTypeId: 123,
  startTime: '2025-03-10T14:00:00.000Z',
  endTime: '2025-03-10T14:30:00.000Z',
  timeZone: 'America/New_York',
  responses: {
    name: 'Jane Doe',
    email: 'jane@example.com',
  },
});
// booking.uid → "abc123"
```

**Permission required:** `booking.create` (or `booking.create:own` for self‑scheduling).

---

### Procedure: `bookings.list`

**Input schema**

```typescript
z.object({
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
  status: z.enum(['ACCEPTED','PENDING','CANCELLED', 'REJECTED']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  attendeeEmail: z.string().email().optional(),
})
```

**Output schema**

```typescript
{
  bookings: Array<BookingDTO>; // same as above
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  }
}
```

**Example**

```typescript
const result = await trpc.bookings.list.query({
  limit: 20,
  status: 'ACCEPTED',
  startDate: '2025-01-01T00:00:00.000Z',
});
```

**Permission required:** `booking.read` (global) or `booking.read:own`.

---

### Procedure: `eventTypes.get`

**Input**

```typescript
z.object({
  id: z.number().int().positive(),
  teamId: z.number().int().positive().optional(), // if team event
})
```

**Output (EventTypeDTO)**

```typescript
{
  id: number;
  title: string;
  slug: string;
  length: number; // minutes
  description: string | null;
  hidden: boolean;
  locations: Array<{ type: string; link?: string }>;
  schedulingType: 'ROUND_ROBIN' | 'COLLECTIVE' | null;
  teamId: number | null;
  ownerId: number;
  users: Array<{ id: number; name: string; avatar: string | null }>;
  metadata: Record<string, unknown>;
}
```

**Example**

```typescript
const eventType = await trpc.eventTypes.get.query({ id: 42 });
```

**Permission required:** `eventType.read` (or `eventType.read:own`).

---

### Procedure: `availability.get`

**Input**

```typescript
z.object({
  userId: z.number().int().positive().optional(),
  teamId: z.number().int().positive().optional(),
  dateFrom: z.string().datetime(),
  dateTo: z.string().datetime(),
})
```

**Output**

```typescript
{
  busy: Array<{
    start: string;
    end: string;
  }>;
  dateRanges: Record<string, Array<{ start: string; end: string }>>; // keyed by date string
  workingHours: Array<{
    days: number[];  // 0=Sunday, 1=Monday …
    startTime: number; // minutes from midnight
    endTime: number;
  }>;
}
```

**Example**

```typescript
const avail = await trpc.availability.get.query({
  userId: 7,
  dateFrom: '2025-03-10T00:00:00.000Z',
  dateTo: '2025-03-16T23:59:59.000Z',
});
```

**Permission required:** `availability.read` (or `availability.read:own` for own schedule).

---

### Procedure: `user.updateProfile`

**Input**

```typescript
z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  timeZone: z.string().optional(),
  weekStartDay: z.number().int().min(0).max(6).optional(),
  hideBranding: z.boolean().optional(),
})
```

**Output** (partial `UserDTO`)

```typescript
{
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  timeZone: string;
  weekStartDay: number;
  hideBranding: boolean;
}
```

**Example**

```typescript
const updated = await trpc.user.updateProfile.mutate({
  name: 'Jane Smith',
  timeZone: 'Europe/London',
});
```

**Permission required:** `user.update` (self only – enforced by service).

---

## REST API v2

Base URL: `https://api.cal.diy/v2`  
All responses are JSON.  
Authentication: Bearer token (user‑specific or API‑key).

---

### Rest: Bookings

#### `GET /v2/bookings`

List bookings with pagination and filters.

**Query parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `limit` | integer | no (default 10) | Max items per page |
| `offset` | integer | no (default 0) | Pagination offset |
| `status` | string | no | Filter by status: `ACCEPTED`, `PENDING`, etc. |
| `startDate` | ISO 8601 | no | Lower bound for booking start |
| `endDate` | ISO 8601 | no | Upper bound for booking start |
| `attendeeEmail` | string | no | Filter by attendee email |

**Example request**

```bash
curl -H "Authorization: Bearer cal_diy_sk_abc123" \
  "https://api.cal.diy/v2/bookings?limit=5&status=ACCEPTED"
```

**Example response**

```json
{
  "status": "success",
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "uid": "pub-xyz",
      "title": "15min Meeting with John",
      "startTime": "2025-03-10T14:00:00.000Z",
      "endTime": "2025-03-10T14:15:00.000Z",
      "status": "ACCEPTED",
      "attendee": { "name": "John", "email": "john@example.com", "timeZone": "UTC" },
      "location": "https://meet.google.com/abc-defg-hij"
    }
  ],
  "meta": { "total": 38, "limit": 5, "offset": 0, "hasMore": true }
}
```

#### `POST /v2/bookings`

Create a booking (similar to tRPC `bookings.create`).

**Request body (JSON)**

```json
{
  "eventTypeId": 123,
  "startTime": "2025-03-10T14:00:00.000Z",
  "endTime": "2025-03-10T14:15:00.000Z",
  "timeZone": "America/New_York",
  "language": "en",
  "responses": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "guests": ["guest1@example.com"],
    "location": "inPerson",
    "notes": "Please bring laptop"
  }
}
```

**Example response**

```json
{
  "status": "success",
  "data": {
    "id": "new-uuid",
    "uid": "pub-abc",
    "title": "Consultation with Jane Doe",
    "startTime": "2025-03-10T14:00:00.000Z",
    "endTime": "2025-03-10T14:15:00.000Z",
    "status": "PENDING",
    "attendee": { "name": "Jane Doe", "email": "jane@example.com", "timeZone": "America/New_York" },
    "location": "inPerson"
  }
}
```

**Permission required for integration API:** `booking.create`.  
If the token belongs to the user themselves, `booking.create:own` suffices.

---

### Rest: Event Types

#### `GET /v2/event-types/:id`

**Response**

```json
{
  "status": "success",
  "data": {
    "id": 42,
    "title": "30 Min Meeting",
    "slug": "30min",
    "length": 30,
    "description": "Quick sync",
    "locations": [{ "type": "integrations:google:meet" }],
    "schedulingType": null,
    "teamId": null,
    "ownerId": 7,
    "users": [{ "id": 7, "name": "Alice", "avatar": null }],
    "metadata": {}
  }
}
```

#### `POST /v2/event-types`

Create a new event type (requires `eventType.create` permission).

**Request body**

```json
{
  "title": "Product Demo",
  "slug": "demo",
  "length": 45,
  "description": "Product walkthrough",
  "locations": [{ "type": "integrations:zoom" }],
  "schedulingType": null,
  "teamId": null,
  "hideBranding": false
}
```

---

### Rest: Users

#### `GET /v2/users/me`

Returns the profile of the authenticated user (API key or session token).

**Response**

```json
{
  "status": "success",
  "data": {
    "id": 7,
    "name": "Alice Johnson",
    "email": "alice@cal.diy",
    "avatar": "https://secure.gravatar.com/avatar/…",
    "timeZone": "Europe/Berlin",
    "weekStartDay": 1,
    "hideBranding": false
  }
}
```

#### `PATCH /v2/users/me`

Update profile (same fields as tRPC `user.updateProfile`).

---

### Rest: Availability

#### `GET /v2/availability?userId=7&dateFrom=...&dateTo=...`

Same input/output as tRPC procedure.

---

### Rest: Webhooks

#### `POST /v2/webhooks`

Register a webhook endpoint.

**Request body**

```json
{
  "subscriberUrl": "https://myapp.com/webhooks/caldiy",
  "eventTriggers": ["BOOKING_CREATED", "BOOKING_CANCELLED"],
  "secret": "my-webhook-secret"
}
```

**Response** – the created webhook with an ID.

Webhook payloads are POSTed with an `X-Cal-Signature-256` header (HMAC‑SHA256 of the JSON body using the secret).  
Payload example (for `BOOKING_CREATED`):

```json
{
  "triggerEvent": "BOOKING_CREATED",
  "createdAt": "2025-03-10T14:05:00.000Z",
  "payload": {
    "bookingId": "new-uuid",
    "uid": "pub-abc",
    "title": "Consultation with Jane Doe",
    "attendee": { "email": "jane@example.com", "name": "Jane Doe" },
    "startTime": "2025-03-10T14:00:00.000Z",
    "endTime": "2025-03-10T14:15:00.000Z",
    "eventTypeId": 123
  }
}
```

---

## Error Codes

All API endpoints return errors in the standard envelope.

| HTTP Status | Error Code | Meaning |
|-------------|------------|---------|
| 400 | `BAD_REQUEST` | Invalid input (missing fields, wrong types) |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication |
| 403 | `FORBIDDEN` | Authenticated but insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Booking time slot already taken |
| 429 | `RATE_LIMIT_EXCEEDED` | Request throttled |
| 500 | `INTERNAL_ERROR` | Unexpected server error – contact support |

tRPC procedures return errors as `TRPCClientError` with the same `code` and `message`.

---

## Rate Limiting

Rate limits are enforced per user (or API key) depending on the endpoint.  
Default: 100 requests per 10 seconds for user endpoints, 20 requests per 10 seconds for mutation endpoints.  
When using Unkey (recommended), rate limits are configurable per workspace.  
Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

---

## Security Considerations

- **Never expose `credential.key`** in any API response. The codebase explicitly stops such leaks.
- **All sensitive fields** (`client_secret`, `api_key`, `refresh_token`) are obfuscated in database snapshots.
- **CSP**: The web app uses a non‑strict Content Security Policy with nonces for script execution. The API itself does not render HTML.
- **PBAC** ensures every operation checks the required permission string (e.g., `booking.update`). Missing permissions result in a `FORBIDDEN` error.
- **iCalUID** parsing is exact string comparison only – no eval or SQL concatenation.
- For additional security, rate limiting is highly recommended. See [Unkey integration](https://unkey.dev).

---

*This API reference corresponds to version 2.6 of Cal.diy.*  
*Breaking changes are avoided – see [CHANGELOG.md](./CHANGELOG.md) for deprecation notes.*