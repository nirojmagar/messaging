# Use the official Node.js 18.17.0-alpine image as the base image
FROM node:18.17.0-alpine

# Set the working directory inside the container
WORKDIR /backend-producer

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend producer application code
COPY . .

# Expose the port your NestJS backend for message producer is listening on
EXPOSE 3000

# Command to build & start the backend producer application
CMD ["npm", "run", "start"]
