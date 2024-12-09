# Base image - using Node.js 18 slim version for smaller image size
FROM node:18-slim 

# Set working directory for application
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Container listens on port 3000
EXPOSE 3000

# Default command to start application
CMD [ "npm", "start" ]