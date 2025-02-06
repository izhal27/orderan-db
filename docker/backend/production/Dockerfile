# Stage 1: Builder
FROM node:20-alpine AS builder

# Install @nestjs/cli globally
RUN yarn global add @nestjs/cli

# Set working directory
WORKDIR /app

# Install dependencies
COPY ./backend/package*.json ./
COPY ./yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy all project files
COPY ./backend .

# Generate Prisma client
RUN yarn prisma generate

# Build the NestJS application
RUN yarn build

# Stage 2: Production
FROM node:20-alpine AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY ./backend/package*.json ./
COPY ./yarn.lock ./
RUN yarn install --frozen-lockfile --production=true

# Install prisma globally
RUN yarn global add prisma

# Install PM2 globally
RUN yarn global add pm2

# Copy the built app from the builder stage
COPY --from=builder /app/dist ./dist

# Copy Prisma files (if Prisma is needed in production for the client)
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client
RUN yarn prisma generate

# Copy the entrypoint script
COPY ./backend/entrypoint.sh .
RUN chmod +x /app/entrypoint.sh

# Expose the application port
EXPOSE 3002

# Command to run the application
CMD ["sh", "entrypoint.sh"]
