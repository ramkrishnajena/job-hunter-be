# -----------------------------------------------------
# 🏗️ 1. Base Image
# -----------------------------------------------------
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

RUN npm run prisma:migrate

# Copy the rest of the application
COPY . .

# Set environment to production
ENV NODE_ENV=production
ENV APP_PORT=80

# Expose the app port (change if your app uses a different one)
EXPOSE 80

# Run the app
CMD ["npm", "run","dev"]
