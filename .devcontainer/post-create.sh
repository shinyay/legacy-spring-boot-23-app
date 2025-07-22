#!/bin/bash

echo "Post-create script starting..."

# Install frontend dependencies
if [ -f "/workspace/frontend/package.json" ]; then
    echo "Installing frontend dependencies..."
    cd /workspace/frontend
    npm install
fi

# Make Maven wrapper executable
if [ -f "/workspace/backend/mvnw" ]; then
    chmod +x /workspace/backend/mvnw
fi

echo "Post-create script completed."