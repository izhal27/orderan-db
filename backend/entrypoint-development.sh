#!/bin/sh
# entrypoint.sh

# Run Prisma migrate reset
yarn prisma migrate reset --force

# Run NestJS application
yarn start:dev