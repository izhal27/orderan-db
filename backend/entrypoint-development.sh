#!/bin/sh
# entrypoint.sh

# Run Prisma migrate reset
yarn prisma migrate deploy

# Run NestJS application
yarn start:dev