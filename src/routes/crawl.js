// import { Router } from "express";
// import { exec } from "child_process";
// import path, { dirname } from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const router = Router();

// router.post("/", async (_req, res) => {
//   const crawlerPath = path.join(__dirname, "../scripts/crawler.js");
//   console.log("Triggering crawler:", crawlerPath);

//   exec(`node ${crawlerPath}`, (error, stdout, stderr) => {
//     if (error) {
//       console.error("Crawler error:", error);
//       return res.status(500).json({
//         message: "Crawler failed",
//         error: stderr || error.message,
//       });
//     }

//     res.json({
//       message: "Crawler executed successfully",
//       output: stdout,
//     });
//   });
// });

// export default router;
import { Router } from "express";
import { exec } from "child_process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = Router();

router.post("/", async (_req, res) => {
  const crawlerPath = path.join(__dirname, "../scripts/crawler.js");
  console.log("🚀 Triggering crawler:", crawlerPath);

  // Respond immediately
  res.status(200).json({
    message: "Crawler started successfully!",
  });

  // Run crawler in background
  const process = exec(`node ${crawlerPath}`);

  process.stdout.on("data", (data) => {
    console.log(`[CRAWLER STDOUT]: ${data}`);
  });

  process.stderr.on("data", (data) => {
    console.error(`[CRAWLER STDERR]: ${data}`);
  });

  process.on("close", (code) => {
    console.log(`✅ Crawler process exited with code ${code}`);
  });
});

export default router;
