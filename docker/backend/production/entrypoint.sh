#!/bin/sh
set -e

# Ensure writable volume permissions then drop privileges
if [ "$(id -u)" = "0" ]; then
  mkdir -p /app/dist/public/images
  chown -R nestjs:nodejs /app/dist/public/images
  exec gosu nestjs "$0" "$@"
fi

# Run migrations and seed once on startup (will skip if users already exist)
if [ "${NODE_ENV}" = "production" ]; then
  if [ -n "${DATABASE_URL}" ]; then
    ./node_modules/.bin/prisma migrate deploy
  fi
  node dist/src/seed/run-seed.js
fi

exec "$@"
