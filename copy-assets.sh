#!/bin/bash

# Script to copy uploads directory to dist folder for deployment
echo "Copying uploads directory for production deployment..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy uploads directory to dist
if [ -d "uploads" ]; then
    cp -r uploads dist/
    echo "✓ Uploads directory copied to dist/uploads"
else
    echo "! No uploads directory found - creating empty one"
    mkdir -p dist/uploads
fi

# Copy attached_assets directory to dist for static assets
if [ -d "attached_assets" ]; then
    cp -r attached_assets dist/assets
    echo "✓ Attached assets copied to dist/assets"
else
    echo "! No attached_assets directory found"
fi

echo "✓ Asset copy completed"