# Use the official Node.js 20 image based on Alpine
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY ./backend/package*.json ./
COPY ./backend/yarn.lock ./
RUN yarn install

# Copy the rest of the application code
COPY ./backend .

# Generate Prisma client
RUN yarn prisma generate

# Copy the entrypoint script
COPY ./backend/entrypoint-development.sh .
RUN chmod +x /app/entrypoint-development.sh

# Expose the application port
EXPOSE 3002

# Set the environment variable for development
ENV NODE_ENV=development

# Use the entrypoint script
CMD ["sh", "/app/entrypoint-development.sh"]