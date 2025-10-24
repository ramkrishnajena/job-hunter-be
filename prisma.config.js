import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// ESM doesn’t have __dirname by default
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default {
  schema: path.resolve(__dirname, "src/prisma/schema.prisma"),
};
