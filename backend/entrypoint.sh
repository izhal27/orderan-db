#!/bin/sh
# entrypoint.sh

# Run Prisma migrations
yarn prisma migrate deploy

# Run Prisma seed
npx ts-node prisma/seed.ts

# Run NestJS application
exec pm2-runtime start dist/main --name "backend"