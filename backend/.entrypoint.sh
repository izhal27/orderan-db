#!/bin/sh
# entrypoint.sh

# Run Prisma migrations
RUN yarn prisma migrate deploy

# Run Prisma seed
RUN yarn prisma db seed

# Run NestJS application
CMD ["pm2-runtime", "start", "dist/main.js"]