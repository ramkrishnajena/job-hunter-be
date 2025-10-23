import { chromium } from "playwright";
import { prisma } from "../lib/prisma.js";

const REMOTEOK_URL = "https://remoteok.com/remote-dev-jobs";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function crawlRemoteOK() {
  console.log("🚀 Starting RemoteOK crawl...");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(REMOTEOK_URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("tr[data-id]", { timeout: 5000 });

  // Extract job listings
  const jobs = await page.$$eval("tr[data-id]", (rows) =>
    rows
      .filter((row) => !row.classList.contains("sw-insert")) // skip ads
      .map((row) => {
        const title =
          row.querySelector("h2")?.textContent?.trim() ||
          row.querySelector("a strong")?.textContent?.trim() ||
          "";
        const company =
          row.querySelector("h3")?.textContent?.trim() ||
          row.querySelector(".company h3")?.textContent?.trim() ||
          "";
        const location =
          row.querySelector(".location")?.textContent?.trim() || "";
        const tags = Array.from(row.querySelectorAll(".tags .tag"))
          .map((t) => t.textContent?.trim())
          .filter(Boolean)
          .join(", ");
        const applyUrl =
          row.getAttribute("data-url") ||
          row.querySelector('a[href^="/remote-jobs/"]')?.getAttribute("href") ||
          row.querySelector('a[target="_blank"]')?.getAttribute("href") ||
          "";
        const jobId =
          row.getAttribute("data-id") ||
          row.getAttribute("data-slug") ||
          applyUrl.split("/").pop() ||
          "";

        return {
          jobId,
          title,
          company,
          location,
          tags,
          applyUrl: applyUrl.startsWith("http")
            ? applyUrl
            : `https://remoteok.com${applyUrl}`,
        };
      })
  );

  console.log(`📦 Found ${jobs.length} jobs. Fetching details...`);

  for (const [i, job] of jobs.entries()) {
    try {
      await delay(1000 + Math.random() * 2000); // polite delay

      if (!job.applyUrl) continue;

      await page.goto(job.applyUrl, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      const description = await page.$eval(
        ".description",
        (el) => el.textContent?.trim() || ""
      );
      const dateText = await page.$eval(
        "time",
        (el) => el.getAttribute("datetime") || ""
      );

      const postedAt = dateText ? new Date(dateText) : undefined;

      // Upsert to avoid duplicates
      await prisma.job.upsert({
        where: { jobId: job.jobId },
        update: { ...job, description, postedAt },
        create: { ...job, description, postedAt },
      });

      console.log(`✅ [${i + 1}/${jobs.length}] ${job.title}`);
    } catch (err) {
      console.warn(`⚠️ Failed job ${job.jobId}: ${err}`);
    }
  }

  await browser.close();
  console.log("🎯 Crawl complete!");
}

crawlRemoteOK()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Crawler error:", err);
    process.exit(1);
  });
