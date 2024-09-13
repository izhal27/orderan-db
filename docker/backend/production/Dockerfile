# Use the official Node.js 20 image based on Alpine
FROM node:20-alpine

# Install PM2 globally
RUN yarn global add pm2
RUN yarn global add @nestjs/cli

# Set the working directory
WORKDIR /app

# Install dependencies
COPY ./backend/package*.json ./
COPY ./backend/yarn.lock ./
RUN yarn install --production

# Copy the rest of the application code
COPY ./backend .

# Generate Prisma client
RUN yarn prisma generate

# Copy the entrypoint script
COPY ./backend/entrypoint.sh .
RUN chmod +x /app/entrypoint.sh

# Set the environment variable for production
ENV NODE_ENV=production

# Build the NestJS application
RUN yarn build

# Expose the application port
EXPOSE 3002

# Use the entrypoint script
CMD ["sh","/app/entrypoint.sh"]