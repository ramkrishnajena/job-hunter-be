import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jobsRoute from "./routes/jobs.js";
import crawlRoute from "./routes/crawl.js";
dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Job Hunter API is running");
});

app.use("/api/v1/job-hunter/jobs", jobsRoute);
app.use("/api/v1/job-hunter/crawl", crawlRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
