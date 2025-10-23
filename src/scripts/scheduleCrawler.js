import cron from "node-cron";
import { exec } from "child_process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const crawlerPath = path.join(__dirname, "./crawler.js");

// ✅ Schedule pattern → minute hour day month day-of-week
// Here: 0 0,6,12,18 * * * means at 00:00, 06:00, 12:00, 18:00 every day
cron.schedule("0 0,6,12,18 * * *", () => {
  console.log(`🕒 [${new Date().toLocaleString()}] Running scheduled crawl...`);

  exec(`node ${crawlerPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Crawler failed:", error.message);
      return;
    }
    console.log(stdout);
    if (stderr) console.warn(stderr);
    console.log("✅ Crawler completed successfully!");
  });
});

console.log("🚀 Scheduler started. Will run crawler 4 times a day.");
