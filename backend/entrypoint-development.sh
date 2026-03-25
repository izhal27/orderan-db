#!/bin/sh
# entrypoint.sh

# Run Prisma migrate reset
yarn prisma migrate deploy

# Run Prisma seed
yarn prisma db seed

# Run NestJS application
yarn start:dev
