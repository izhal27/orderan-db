# Use the official Node.js 20 image based on Debian (glibc)
FROM node:20-bullseye AS builder

# Set the working directory
WORKDIR /app

# Install dependencies
COPY ./frontend/package*.json ./
COPY ./frontend/yarn.lock ./
RUN yarn install

# Copy the rest of the application code
COPY ./frontend .

COPY .env .

# Build the Next.js application
RUN yarn build

# Use a lightweight web server to serve the built application
FROM node:20-bullseye AS runner

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Expose the application port
EXPOSE 3000

# Set the environment variable for production
ENV NODE_ENV=production

# Start the Next.js application
CMD ["yarn", "start"]
