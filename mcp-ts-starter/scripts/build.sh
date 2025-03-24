#!/bin/bash

set -e

# Clean previous build
npm run clean

# Build TypeScript files
npm run build

# Make the entry point files executable
chmod +x build/stdio.js build/http.js

echo "Build completed successfully."