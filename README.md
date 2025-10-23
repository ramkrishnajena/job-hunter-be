job-hunter-be/
├── prisma/
│   ├── schema.prisma       # Prisma DB schema
│   └── dev.db              # SQLite database file (auto-generated)
│
├── src/
│   ├── lib/
│   │   └── prisma.ts       # Prisma client
│   ├── routes/
│   │   ├── jobs.js         # Job APIs
│   │   └── crawl.js        # API endpoint to trigger crawler manually
│   └── server.js           # Express server entry point
│
├── scripts/
│   ├── crawler.ts          # Main Playwright crawler
│   └── scheduleCrawler.ts  # Cron scheduler (runs crawler automatically)
│
├── .env                    # Environment variables
├── package.json
└── README.md
