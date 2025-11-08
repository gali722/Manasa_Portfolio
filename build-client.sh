#!/bin/bash
set -e

echo "Building client application..."

# Remove root package.json to avoid workspace detection
rm -f package.json package-lock.json

# Navigate to client directory
cd client

# Install dependencies
npm install --legacy-peer-deps

# Build the application
npm run build

echo "Build completed successfully!"
