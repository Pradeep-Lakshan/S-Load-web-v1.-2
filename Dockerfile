# ==============================================================================
# VortexFetch Frontend Production Dockerfile
# Multi-stage build for production-ready Node.js container
# ==============================================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for efficient layer caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy all source code
COPY . .

# Build application bundle
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy built distribution files and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Install tsx globally or locally for running server.ts
RUN npm install -g tsx

EXPOSE 3000

CMD ["tsx", "server.ts"]
