# Use the official Node.js 20 image based on Debian (glibc)
FROM node:22-bullseye-slim

# Set the working directory
WORKDIR /app

# Install dependencies
COPY ./frontend/package*.json ./
COPY ./frontend/yarn.lock ./
RUN yarn install

# Copy the rest of the application code
COPY ./frontend .

# Add entrypoint to generate public/env.js from NEXT_PUBLIC_* vars
COPY ./docker/frontend/development/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the application port
EXPOSE 3000

# Set the environment variable for development
ENV NODE_ENV=development

# Generate env.js before running dev server
ENTRYPOINT ["/entrypoint.sh"]

# Start the Next.js application in development mode
CMD ["yarn", "dev"]
