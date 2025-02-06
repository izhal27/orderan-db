# Use the official Node.js 20 image based on Alpine
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY ./frontend/package*.json ./
COPY ./yarn.lock ./
RUN yarn install

# Copy the rest of the application code
COPY ./frontend .

# Expose the application port
EXPOSE 3000

# Set the environment variable for development
ENV NODE_ENV=development

# Start the Next.js application in development mode
CMD ["yarn", "dev"]