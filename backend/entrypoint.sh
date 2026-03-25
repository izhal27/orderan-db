#!/bin/sh
# entrypoint.sh

# Run Prisma migrations
npx prisma migrate deploy

# Run Prisma seed
if [ -f dist/prisma/seed.js ]; then
  node dist/prisma/seed.js
else
  npx prisma db seed
fi

# Run NestJS application
exec pm2-runtime start dist/src/main.js --name "backend"
