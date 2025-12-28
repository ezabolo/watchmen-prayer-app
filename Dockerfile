# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install bash for running scripts
RUN apk add --no-cache bash

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Copy assets to dist folder for production
RUN bash copy-assets.sh

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from builder stage (includes assets)
COPY --from=builder /app/dist ./dist

# Copy uploads and attached_assets directories
COPY --from=builder /app/uploads ./uploads
COPY --from=builder /app/attached_assets ./attached_assets

# Expose the port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
CMD ["npm", "start"]
