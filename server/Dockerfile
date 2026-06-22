# Use node:20-alpine as the base image for a lightweight Node.js environment
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install all dependencies (including devDependencies like nodemon)
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the port the Express server listens on (4000)
EXPOSE 4000

# Start the server using the dev script (which runs nodemon)
CMD ["npm", "run", "dev"]
