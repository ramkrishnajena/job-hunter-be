import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Job Hunter API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
