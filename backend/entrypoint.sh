#!/bin/sh
# entrypoint.sh

# Run Prisma migrations
npx prisma migrate deploy

# Run Prisma seed
node dist/prisma/seed.js

# Run NestJS application
exec pm2-runtime start dist/src/main.js --name "backend"