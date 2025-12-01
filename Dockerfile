# Multi-stage Dockerfile for Next.js production deployment
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Create a minimal .env for build-time environment variables
RUN echo 'DATABASE_URL="postgresql://user:pass@localhost:5432/db"' > .env
RUN echo 'JWT_SECRET="build-time-secret"' >> .env
RUN echo 'ENCRYPTION_KEY="12345678901234567890123456789012"' >> .env
RUN echo 'STRIPE_SECRET_KEY="sk_test_build_time_mock_key"' >> .env
RUN echo 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_build_time_mock_key"' >> .env

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl openssl-dev

# Generate Prisma Client with correct binary targets
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install OpenSSL for Prisma runtime
RUN apk add --no-cache openssl

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
