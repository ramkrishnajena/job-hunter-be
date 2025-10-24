# -----------------------------------------------------
# 🏗️ 1. Base Image (Node + Playwright)
# -----------------------------------------------------
FROM mcr.microsoft.com/playwright:v1.56.1-jammy

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install all dependencies (including dev for Prisma CLI)
RUN npm install

# Copy rest of the project files
COPY . .

# Ensure SQLite folder exists for Prisma DB
RUN mkdir -p /app/src/prisma

# Environment variables
ENV NODE_ENV=production
ENV DATABASE_URL="file:./src/prisma/job_hunter.db"
ENV APP_PORT=80

# Generate Prisma client
RUN npx prisma generate

# Expose app port
EXPOSE 80

# -----------------------------------------------------
# 🚀 2. Run Migrations + Start Server
# -----------------------------------------------------
# - `migrate deploy` ensures schema is up-to-date in production
# - `npm run start` should launch your server
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
