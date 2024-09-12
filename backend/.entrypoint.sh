#!/bin/sh
# entrypoint.sh

# Run Prisma migrations
yarn prisma migrate deploy

# Run Prisma seed
yarn prisma db seed

# Run NestJS application
exec pm2-runtime start dist/main.js