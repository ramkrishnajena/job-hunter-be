# 🧰 Job Hunter Backend

> **A backend service that automatically crawls remote job listings from [RemoteOK.com](https://remoteok.com)**, stores them in a local SQLite database, and exposes REST APIs for frontend consumption — with scheduled crawling 4× a day (or custom times like 5:13 AM).

---

## 🚀 Features

- 🔍 **Playwright-based crawler** → Extracts latest remote jobs from RemoteOK
- 💾 **Prisma ORM + SQLite** → Lightweight database with automatic migrations
- 🌐 **Express REST API** → Fetch jobs, apply filters, and trigger new crawls
- ⏰ **Node Cron Scheduler** → Runs the crawler automatically (daily or multiple times a day)
- 🧹 **Normalization & Deduplication** → Cleans text and avoids duplicate entries

---

## 🧠 Tech Stack

| Component     | Technology              |
| ------------- | ----------------------- |
| Language      | Node.js                 |
| Web Framework | Express                 |
| Crawler       | Playwright              |
| Database      | SQLite (via Prisma ORM) |
| Scheduler     | Node-Cron               |
| Environment   | dotenv                  |
| ORM Tool      | Prisma                  |

---

## 📁 Folder Structure

```
├── prisma/
│ ├── schema.prisma # Prisma DB schema
│
├── src/
│ ├── lib/
│ │ └── prisma.ts # Prisma client
│ ├── routes/
│ │ ├── jobs.js # Job APIs
│ │ └── crawl.js # API endpoint to trigger crawler manually
│ └── server.js # Express server entry point
│
├── scripts/
│ ├── crawler.ts # Main Playwright crawler
│ └── scheduleCrawler.ts # Cron scheduler (runs crawler automatically)
│
├── .env # Environment variables
├── .env.example # Environment variables name reference
├── package.json
└── README.md
```

---

### ⏰ Scheduler Configuration
Crawler automatically runs **4 times per day** (every 6 hours) to keep job listings fresh and up to date.


🕓 **Schedule:**
- **00:00 (Midnight)** – Initial daily crawl
- **06:00 (Morning)** – Refresh job data
- **12:00 (Noon)** – Mid-day update
- **18:00 (Evening)** – End-of-day refresh

These times are defined in **`src/scripts/scheduleCrawler.js`** using a cron expression:

```js
cron.schedule("0 0,6,12,18 * * *", () => {
  console.log("Running scheduled crawler...");
});
```

---
## ⚙️ 1. Prerequisites

Before setting up, make sure you have:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Playwright browsers & dependencies](https://playwright.dev/docs/cli#install-system-dependencies)

Install Playwright dependencies if not already:

```bash
npx playwright install-deps
npx playwright install
```

## 🚀 Quick Start (Setup Instructions)

Follow these steps **in order** 👇

### 🧱 Step 1 — Run Prisma Migration
Create the SQLite database and schema using Prisma:

```bash
npm run prisma:migrate
```
### Step 2 - Install Dependencies

```bash
npm install
```
### Step 3 - Setup Environment

check env names from .env.example and create your .env with your details

### Step 4 - Start the app 

To start the arr run

```bash
npm run dev
```
