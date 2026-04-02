# ============================================================
# Stage 1: Dependencies
# Install all deps (including dev) untuk proses build
# ============================================================
FROM node:22-bullseye-slim AS deps

WORKDIR /app

# Copy package files
COPY ./frontend/package*.json ./
COPY ./frontend/yarn.lock ./

# Install semua dependencies (termasuk devDeps untuk build)
RUN yarn install --frozen-lockfile


# ============================================================
# Stage 2: Builder
# Build Next.js application (standalone output)
# ============================================================
FROM node:22-bullseye-slim AS builder

WORKDIR /app

# Copy node_modules dari stage deps
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY ./frontend .

# Disable Next.js telemetry saat build
ENV NEXT_TELEMETRY_DISABLED=1

# Build-time env (wajib untuk NEXT_PUBLIC_*)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WEBSOCKET_URL
ARG NEXT_PUBLIC_IMAGE_PATH
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_WEBSOCKET_URL=${NEXT_PUBLIC_WEBSOCKET_URL}
ENV NEXT_PUBLIC_IMAGE_PATH=${NEXT_PUBLIC_IMAGE_PATH}

# Build aplikasi (hasilkan .next/standalone)
RUN yarn build


# ============================================================
# Stage 3: Runner
# Image production yang ringan (standalone)
# ============================================================
FROM node:22-bullseye-slim AS runner

WORKDIR /app

# Set environment production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Buat user non-root untuk keamanan
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# Copy hasil build standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./
RUN chown -R nextjs:nodejs /app

# Gunakan user non-root
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Jalankan aplikasi menggunakan server.js dari standalone
CMD ["node", "server.js"]
