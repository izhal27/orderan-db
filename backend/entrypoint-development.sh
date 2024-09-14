#!/bin/sh
# entrypoint.sh

# Run Prisma migrations
yarn prisma migrate deploy

# Run Prisma seed
yarn prisma db seed

# Run NestJS application
yarn start:dev