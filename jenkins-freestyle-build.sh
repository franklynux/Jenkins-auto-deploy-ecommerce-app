#!/bin/bash

# Function to install Node.js using nvm
setup_nodejs() {
    # Install nvm if not present
    export NVM_DIR="$HOME/.nvm"
    if [ ! -d "$NVM_DIR" ]; then
        echo "Installing nvm..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Load nvm
    fi

    # Load nvm if already installed
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    # Install and use Node.js 18
    echo "Installing Node.js 18..."
    nvm install 18
    nvm use 18
}

# Setup Node.js
setup_nodejs

# Verify installation
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
