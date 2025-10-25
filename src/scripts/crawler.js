import { chromium } from "playwright";
import { prisma } from "../lib/prisma.js";

const REMOTEOK_URL = "https://remoteok.com";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function crawlRemoteOK() {
  console.log("🚀 Starting RemoteOK crawl...");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(REMOTEOK_URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("tr.job[data-id]", { timeout: 30000 });

  console.log("🧭 Scrolling to load all jobs...");

  // --- Infinite scroll handler ---
  let previousHeight = 0;
  let sameHeightCount = 0;
  const maxSameCount = 3; // stop after 3 checks where height doesn’t increase

  while (true) {
    const currentHeight = await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
      return document.body.scrollHeight;
    });

    if (currentHeight === previousHeight) {
      sameHeightCount++;
      if (sameHeightCount >= maxSameCount) break;
    } else {
      sameHeightCount = 0;
    }

    previousHeight = currentHeight;
    await delay(2000 + Math.random() * 1000); // wait for new jobs to load
  }

  console.log("✅ All jobs loaded, scraping...");

  // Extract job listings
  const jobs = await page.$$eval("tr.job[data-id]", (rows) =>
    rows
      .filter((row) => !row.classList.contains("sw-insert"))
      .map((row) => {
        const title = row.querySelector("h2")?.textContent?.trim() || "";
        const company =
          row.dataset.company?.trim() ||
          row.querySelector(".companyLink h3")?.textContent?.trim() ||
          "";
        const location =
          row.querySelector(".location")?.textContent?.trim() || "";
        const tags = Array.from(row.querySelectorAll(".tags .tag h3"))
          .map((t) => t.textContent?.trim())
          .filter(Boolean)
          .join(", ");
        const applyUrl = row.dataset.url
          ? `https://remoteok.com${row.dataset.url}`
          : "";
        const jobId = row.dataset.id || "";

        return {
          jobId,
          title,
          company,
          location,
          tags,
          applyUrl,
        };
      })
  );

  console.log(`📦 Found ${jobs.length} jobs. Fetching details...`);

  // Crawl each job detail
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

      await prisma.job.upsert({
        where: { jobId: job.jobId },
        update: { ...job, description, postedAt },
        create: { ...job, description, postedAt },
      });

      console.log(`✅ [${i + 1}/${jobs.length}] ${job.title}`);
    } catch (err) {
      console.warn(`⚠️ Failed job ${job.jobId}: ${err.message}`);
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
