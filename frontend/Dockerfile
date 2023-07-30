# Use the official Node.js 18.17.0-alpine image as the base image for building ReactJS frontend
FROM node:18.17.0-alpine as frontend-builder

# Set the working directory inside the container
WORKDIR /frontend

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend application code
COPY . .

# Build the frontend application
RUN npm run build

# Use NGINX as the web server to serve the static files
FROM nginx:alpine

# Copy the built frontend files to the NGINX public directory
COPY --from=frontend-builder /frontend/build /usr/share/nginx/html

# Expose the port your ReactJS frontend is listening on (default is 80)
EXPOSE 80

# Command to start the NGINX server
CMD ["nginx", "-g", "daemon off;"]
