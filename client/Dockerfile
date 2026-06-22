# Use node:20-alpine as the base image for a lightweight Node.js environment
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies first
# This allows Docker to cache npm install unless dependencies change
COPY package*.json ./

# Install all dependencies (including devDependencies needed for Vite)
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Expose Vite's default dev server port
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]
