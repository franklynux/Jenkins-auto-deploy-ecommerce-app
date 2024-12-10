#!/bin/bash

# Install Node.js if not already installed
if ! command -v node &> /dev/null
then
    echo "Node.js not found. Installing..."
    curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Verify Node.js and npm installation
echo "Node.js version:"
node -v
echo "npm version:"
npm -v

# Clean npm cache and install dependencies
echo "Cleaning npm cache and installing dependencies..."
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Run tests
echo "Running tests..."
npm test
