# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY . .

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Use a non-root user for security
USER node

CMD ["node", "index.js"]
