# ============================================================
# Stage 1: Builder
# ============================================================
FROM node:22-bullseye-slim AS builder

# Install OS dependencies (hanya openssl yang dibutuhkan Prisma)
# python3, make, g++ hanya diperlukan jika ada native addons
RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files dulu (layer caching)
COPY ./backend/package*.json ./
COPY ./backend/yarn.lock ./

# Install semua dependencies (termasuk devDeps untuk build)
RUN yarn install --frozen-lockfile

# Copy source code
COPY ./backend .

# Generate Prisma client
RUN yarn prisma generate

# Build NestJS app
RUN yarn build


# ============================================================
# Stage 2: Production
# ============================================================
FROM node:22-bullseye-slim AS production

# Set environment
ENV NODE_ENV=production

WORKDIR /app

# Install gosu for safe privilege drop at runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
  gosu \
  && rm -rf /var/lib/apt/lists/*

# Buat non-root user untuk keamanan
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nestjs

# Copy package files
COPY ./backend/package*.json ./
COPY ./backend/yarn.lock ./

# Install production dependencies saja
RUN yarn install --frozen-lockfile --production=true \
  && yarn cache clean

# Copy hasil build dari stage builder
COPY --from=builder /app/dist ./dist

# Copy Prisma schema & generated client dari builder
# (tidak perlu generate ulang, pakai hasil dari builder)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Entrypoint untuk seed saat startup
COPY ./docker/backend/production/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
RUN mkdir -p /app/dist/public/images \
  && chown -R nestjs:nodejs /app

# Expose port
EXPOSE 3002

# Jalankan aplikasi
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "dist/src/main.js"]
