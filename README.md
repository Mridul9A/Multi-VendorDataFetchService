# 🚀 Multi-Vendor Data Fetch Service

This project implements a unified backend system that interacts with different third-party data vendors (both synchronous and asynchronous) using a consistent internal API. It handles rate limiting, background processing, asynchronous callbacks, and response normalization—making life easier for frontend and other consumers.

---

## 📦 Tech Stack

- **Backend:** Node.js + Express
- **Queue:** Redis Streams
- **Database:** MongoDB
- **Vendors:** Mock sync & async vendors (Express)
- **Worker:** Node.js background processor
- **Containerization:** Docker & Docker Compose
- **Load Testing:** k6

---

## 📐 Architecture Diagram

```plaintext
        ┌─────────────┐
        │   Client    │
        └─────┬───────┘
              │
       POST /jobs
              │
        ┌─────▼───────┐           ┌────────────┐
        │   API       │──────────▶│ Redis Queue│
        └─────┬───────┘           └────▲───────┘
              │                        │
       GET /jobs/:id           xread Worker
              │                        │
        ┌─────▼───────────────┐       │
        │   MongoDB           │◀──────┘
        └─────┬───────────────┘
              │
        ┌─────▼───────┐
        │ Background  │
        │   Worker    │
        └───┬────▲────┘
            │    │
        ┌───▼──┐ └────┐
        │ Sync │      │
        │Vendor│      │
        └──┬───┘      ▼
           │     ┌────────────┐
           └────▶│ AsyncVendor│───▶ Webhook
                 └────────────┘
```

---

## 🧠 Key Features

- Accepts jobs via HTTP POST (`/jobs`)
- Processes vendors in the background using Redis Streams
- Handles sync and async vendor logic
- Applies data cleaning (removes PII, trims whitespace)
- Exposes status endpoint (`/jobs/:id`)
- Receives async callbacks via internal webhook
- Fully containerized and easy to scale

---

## 🚀 Quick Start

```bash
git clone <your-repo-url>
cd multi-vendor-data-service
docker-compose up --build
```

> Requires Docker + Docker Compose installed.

---

## 🧪 API Reference

### 🔹 `POST /jobs`

Accepts any JSON payload.

**Example:**
```bash
curl -X POST http://localhost:8000/jobs \
  -H "Content-Type: application/json" \
  -d '{"user": "Alice", "vendor": "sync"}'
```

**Response:**
```json
{
  "request_id": "cbf32893-91f4-4a2f-baa0-83b2c92c2c3e"
}
```

---

### 🔹 `GET /jobs/:request_id`

Checks job status or result.

**Example:**
```bash
curl http://localhost:8000/jobs/cbf32893-91f4-4a2f-baa0-83b2c92c2c3e
```

**Responses:**
```json
{ "status": "processing" }
```

or

```json
{ "status": "complete", "result": "Processed Alice" }
```

---

### 🔹 `POST /vendor-webhook/:vendor`

Used internally by the **async vendor** to send the final result.

---

## 📡 Mock Vendors

- `syncVendor.js`: responds immediately
- `asyncVendor.js`: responds with 202, then POSTs to webhook after delay

---

## 🧪 Load Testing (k6)

Install [k6](https://k6.io/docs/getting-started/installation/), then run:

```bash
k6 run load-test/k6_test.js
```

**Test Setup:**
- 200 virtual users
- 60-second duration
- Random mix of POST and GET requests

**Sample Output:**
```
✓ 95% requests completed under 250ms
✓ 0 failed requests
✓ Throughput: ~3200 requests/minute
```

---

## ⚙️ Design Highlights

- **Redis Streams** for durable job queue
- **Async Webhooks** simulate real-world async vendors
- **UUID-based tracking** of requests
- **MongoDB** for persistent job state
- **Rate-limiting ready** (extendable via Redis tokens/semaphores)
- **Modular services** for API, worker, vendors, and webhook

---

## 📂 Project Structure

```
multi-vendor-data-service/
├── api/             # Handles /jobs endpoints
├── worker/          # Background processor
├── vendors/         # Sync and Async mock vendor servers
├── webhook/         # Webhook endpoint for async callbacks
├── queue/           # Redis stream helper
├── utils/           # Data cleaning
├── Dockerfiles/     # Dockerfiles for all services
├── load-test/       # k6 test scripts
├── docker-compose.yml
├── README.md
```

---

## 🛠️ Curl Commands (Quick Test)

```bash
# Submit a sync job
curl -X POST http://localhost:8000/jobs \
  -H "Content-Type: application/json" \
  -d '{"user":"Bob","vendor":"sync"}'

# Submit an async job
curl -X POST http://localhost:8000/jobs \
  -H "Content-Type: application/json" \
  -d '{"user":"Carol","vendor":"async"}'

# Check status
curl http://localhost:8000/jobs/<request_id>
```

---

## ✅ Todo (Optional Enhancements)

- Add real-time logs via WebSockets
- Rate limiting using Redis tokens per vendor
- Separate sync/async vendors into distinct containers
- Add retry logic for failed jobs

---

## 👨‍💻 Author

Built by Mridul

