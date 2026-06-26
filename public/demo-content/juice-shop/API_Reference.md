# API Reference: OWASP Juice Shop

## Overview

The OWASP Juice Shop provides a RESTful API for its Angular frontend and third-party integrations. The API is exposed over HTTP (default port 3000) and uses JSON for request and response bodies. Authentication is via JWT bearer tokens (generated on login) and optional CSRF tokens. The API intentionally contains numerous vulnerabilities – documented per endpoint.

**Base URL:** `http://localhost:3000/api`

**Authentication:** `Authorization: Bearer <jwt>` (received from `/rest/user/login`)

---

## Endpoints

### 1. User Management

#### `POST /api/Users/` – Register New User

| Field       | Type   | Required | Description                  |
|-------------|--------|----------|------------------------------|
| email       | string | yes      | Email address (unique)       |
| password    | string | yes      | Plaintext password           |
| passwordRepeat | string | yes   | Must match password          |
| securityQuestion | object | no    | Selected security question   |

**Example Request:**
```json
{
  "email": "test@juice-sh.op",
  "password": "Test123!",
  "passwordRepeat": "Test123!",
  "securityQuestion": {
    "id": 2,
    "answer": "Fluffy"
  }
}
```

**Response:** `201 Created`  
**Vulnerability:** Registration accepts any email format; no email verification.

---

#### `GET /api/Users/` – List Users (Admin only)

**Headers:** `Authorization: Bearer <admin JWT>`

**Response:** Array of user objects (without passwords).

**Vulnerability:** Missing proper authorization – any authenticated user can access.

---

#### `GET /api/Users/{id}` – Get Single User

**Headers:** `Authorization: Bearer <jwt>`

**Response:** User object.

**Vulnerability:** IDOR – replace `id` with another user’s ID to get their data.

---

#### `PATCH /api/Users/{id}` – Update User Profile

**Headers:** `Authorization: Bearer <jwt>`

**Request Body (partial):**
```json
{
  "role": "admin"
}
```

**Vulnerability:** No server-side validation of `role` field – user can escalate privileges to admin.

---

### 2. Product API

#### `GET /api/Products/` – List Products

**Query Parameters:**  
- `q` (string): search term (triggers SQL injection if used incorrectly)  
- `limit`, `offset` (number): pagination

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Apple Juice",
      "description": "Fresh pressed apple juice",
      "price": 1.99,
      "deluxePrice": 2.99,
      "image": "apple_juice.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Vulnerability:** The `q` parameter is concatenated directly into SQL query – allows SQL injection (e.g., `q=1' UNION SELECT ...`).

---

#### `GET /api/Products/{id}` – Get Single Product

**Response:** Single product object.  
**No vulnerability beyond product enumeration.**

---

#### `POST /api/Products/` – Create Product (Admin only)

**Headers:** `Authorization: Bearer <admin JWT>`  
**Request:**
```json
{
  "name": "New Product",
  "description": "Description",
  "price": 9.99,
  "deluxePrice": 12.99,
  "image": "new_product.jpg"
}
```

**Vulnerability (intentional):** The endpoint only checks for presence of authorization header; does not validate admin role. Any authenticated user can create products.

---

#### `PUT /api/Products/{id}` – Update Product

**Headers:** `Authorization: Bearer <any JWT>`  
**Request:**
```json
{
  "price": 0.01
}
```

**Vulnerability:** Price modification allowed for any authenticated user (credit: `changeProductChallenge`).

---

#### `DELETE /api/Products/{id}` – Delete Product (Admin only)

**Headers:** `Authorization: Bearer <admin JWT>`  
**Response:** `200 OK`  
**Vulnerability:** No CSRF protection.

---

### 3. Basket & Orders

#### `GET /api/Basket/{id}` – Get Basket Content

**Headers:** `Authorization: Bearer <jwt>`  
**Requires ownership or admin.**  
**Response:** Basket object with embedded `BasketItems`.

---

#### `PUT /api/Baskets/{id}` – Update Basket (Delivery Method)

**Request:**
```json
{
  "deliveryMethodId": 1
}
```

---

#### `POST /api/Basket/{id}/items` – Add Item to Basket

**Request:**
```json
{
  "ProductId": 1,
  "quantity": 2
}
```

**Vulnerability:** Quantity can be set to negative numbers to reduce total price.

---

#### `POST /api/Orders/` – Place Order

**Headers:** `Authorization: Bearer <jwt>`  
**No request body needed – reads from user's basket.**  

**Response:**
```json
{
  "status": "success",
  "data": {
    "orderId": "5263-b3c73d58-9f1e-4d9a-bb17-1a5d0e5a2345",
    "totalPrice": 19.99,
    "products": [...],
    "deliveryAddress": "..."  // sensitive data intentionally exposed
  }
}
```

**Vulnerability:** The response includes the user's payment details and masked email (weak masking – vowels replaced with `*`). Also returns full delivery address.

---

#### `GET /api/Orders/{id}` – Get Order Details

**Headers:** `Authorization: Bearer <jwt>`  
**Vulnerability:** IDOR – iterate order IDs to see other users' orders.

---

### 4. Coupons & Discounts

#### `POST /api/Coupons/` – Apply Coupon to Basket

**Request:**
```json
{
  "coupon": "NŐT_5€_F0R_Y0U"
}
```

**Response:** Updates basket total.  
**Vulnerability:** Coupon codes are base64 encoded and easy to brute force. No validation of usage limit.

---

### 5. Chatbot API

#### `POST /rest/chatbot/respond` – Send Message to Chatbot

**Headers:** `Authorization: Bearer <jwt>` (optional, chatbot may work anonymously)  
**Request:**
```json
{
  "message": "I want to know about product Apples"
}
```

**Response:**  
```json
{
  "status": "success",
  "data": {
    "action": "showProducts",
    "products": [...]
  }
}
```

**Vulnerability:** The chatbot internally calls `getProductReviews` tool which injects unsanitized `id` parameter directly into MarsDB `$where` clause (NoSQL injection). Example attack:
- User: `Show reviews for product: 1';return this.user.email === 'admin@juice-sh.op' //`

---

### 6. FTP & File Access

#### `GET /ftp/{filename}` – Access Static Files

**Example:** `GET /ftp/acquisitions.md`  
**Vulnerability:** Directory listing enabled – browse `/ftp` to see all files including `package.json.bak`, `encryptionkeys/`, quarantined files.

---

#### `GET /support/logs/` – Access Server Logs

**Vulnerability:** Directory listing exposes `access.log` and other logs containing IP addresses and request details (including URLs with tokens).

---

### 7. Authentication

#### `POST /rest/user/login` – Login

**Request:**
```json
{
  "email": "admin@juice-sh.op",
  "password": "admin123"
}
```

**Response:**
```json
{
  "authentication": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "bid": 1,
    "umail": "admin@juice-sh.op"
  }
}
```

**Vulnerability:** Accepts null algorithm JWT (CVE-2020-15084). Client can forge tokens with `alg: 'none'`.

---

#### `POST /rest/user/change-password` – Change Password

**Headers:** `Authorization: Bearer <jwt>`  
**Request:**
```json
{
  "current": "oldpass",
  "new": "newpass",
  "repeat": "newpass"
}
```

**Vulnerability:** No CSRF token – attacker can trigger password change via cross-site request forgery.

---

### 8. Administration

#### `GET /rest/admin/application-configuration` – Get App Configuration

**Headers:** `Authorization: Bearer <admin JWT>`  
**Response:** Exposes internal configuration including database paths, API keys, email settings.  
**Vulnerability:** Overly verbose error messages in some environments reveal stack traces and SQL queries.

---

#### `GET /rest/admin/users` – List All Users (Admin)

**Headers:** `Authorization: Bearer <admin JWT>`

---

### 9. Health & Status

#### `GET /rest/health` – Health Check

**Response:**
```json
{
  "status": "UP",
  "version": "16.0.0"
}
```

**No authentication required.**  
**Vulnerability:** Reveals version number for targeted exploit searches.

---

#### `GET /rest/recycle` – Recycling Information

**Headers:** `Authorization: Bearer <jwt>`  
**Response:** List of recyclable items; includes user location if provided.

**Vulnerability:** Unauthorized access to user location data.

---

### 10. Security.txt

#### `GET /.well-known/security.txt` – Security Contact

**Response:** Plain text with contact information.  
**No authentication.**

---

## Data Schemas

### User Object
```json
{
  "id": 1,
  "email": "admin@juice-sh.op",
  "password": "$2a$10$...",         // bcrypt hash
  "role": "admin",
  "securityQuestion": { "id": 2, "answer": "Fluffy" }
}
```

### Product Object
```json
{
  "id": 1,
  "name": "Apple Juice",
  "description": "Fresh pressed apple juice",
  "price": 1.99,
  "deluxePrice": 2.99,
  "image": "apple_juice.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Basket Object
```json
{
  "id": 1,
  "UserId": 1,
  "coupon": null,
  "deliveryMethodId": 1,
  "BasketItems": [
    {
      "id": 1,
      "BasketId": 1,
      "ProductId": 1,
      "quantity": 2,
      "Product": { ... }
    }
  ]
}
```

### Order Object
```json
{
  "id": "5263-b3c73d58-9f1e-4d9a-bb17-1a5d0e5a2345",
  "userId": 1,
  "totalPrice": 19.99,
  "deliveryAddress": "123 Main St, Anytown, USA",
  "paymentId": "pi_1GszsF2eZvKYlo2C2hM9Xf6h",
  "email": "a***n@j****-sh.p",
  "products": [ { "quantity": 2, "Product": { ... } } ]
}
```

---

## Security Considerations Table

| Endpoint | Vulnerability | Severity | Attack Vector |
|----------|---------------|----------|---------------|
| `POST /api/Users/` | Weak email validation | Medium | Bypass email format check |
| `GET /api/Users/` | Missing authorization | High | List all users |
| `PATCH /api/Users/{id}` | Role escalation | Critical | Set `role: "admin"` |
| `GET /api/Products?q=` | SQL injection | Critical | Inject SQL in `q` parameter |
| `PUT /api/Products/{id}` | Authorization bypass | High | Modify product price |
| `POST /rest/chatbot/respond` | NoSQL injection | Critical | Inject MarsDB `$where` query |
| `GET /ftp` | Directory listing | Medium | Browse all files |
| `POST /rest/user/change-password` | CSRF | High | Forge password change |
| `POST /rest/user/login` | JWT null algorithm | Critical | Forge token with `alg: 'none'` |
| `GET /rest/health` | Version disclosure | Low | Target known exploits |
| `POST /api/Coupons/` | Weak coupon generation | Medium | Brute force coupon codes |

---

## Error Handling

The API returns errors in a standard format:
```json
{
  "error": {
    "message": "Something went wrong",
    "status": 400,
    "errors": ["Validation error details"]
  }
}
```

Common status codes:
- `200` – Success
- `201` – Created
- `400` – Bad request (validation error)
- `401` – Unauthorized (missing or invalid JWT)
- `403` – Forbidden (insufficient permissions)
- `404` – Resource not found
- `500` – Internal server error (may reveal stack trace in debug mode)

---

## Rate Limiting

The API has a global rate limiter (100 requests per minute per IP) but can be bypassed via multiple IPs or header spoofing (X-Forwarded-For).

---

## Testing Tools

- **Swagger/OpenAPI:** Interactive documentation available at `/api-docs` (exposes full API spec including sensitive endpoints).
- **Postman Collection:** Importable collection with all endpoints and example payloads (available in `/data/static/postman/`).

---

## Notes for Developers

- **Intentional vulnerabilities are present – do not expose this API to untrusted networks without proper isolation.**
- Use `safetyMode: true` in configuration to mitigate some risks (disables certain endpoints and sanitizes inputs).
- For production CTF environments, implement a reverse proxy (Nginx) to restrict access to `/admin`, `/ftp`, and `/support` paths.
- The chatbot NoSQL injection is a critical training tool – protect the MarsDB instance with a separate user with read-only permissions if deployed.