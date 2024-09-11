#!/bin/sh
# entrypoint.sh

# Run Prisma migrations
RUN yarn prisma migrate deploy

# Run Prisma seed
RUN yarn prisma db seed

# Run NestJS application
yarn start:dev