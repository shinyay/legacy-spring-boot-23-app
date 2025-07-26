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

# Create VS Code settings for Java development
echo "Setting up VS Code Java configuration..."
VSCODE_DIR="/workspace/.vscode"
SETTINGS_FILE="$VSCODE_DIR/settings.json"

# Create .vscode directory if it doesn't exist
mkdir -p "$VSCODE_DIR"

# Detect Java Home path in Dev Container environment
JAVA_HOME_PATH=""
if [ -d "/usr/lib/jvm/msopenjdk-current" ]; then
    JAVA_HOME_PATH="/usr/lib/jvm/msopenjdk-current"
elif [ -d "/usr/local/sdkman/candidates/java/current" ]; then
    JAVA_HOME_PATH="/usr/local/sdkman/candidates/java/current"
elif [ ! -z "$JAVA_HOME" ]; then
    JAVA_HOME_PATH="$JAVA_HOME"
else
    echo "Warning: Could not detect Java Home path"
    JAVA_HOME_PATH="/usr/lib/jvm/msopenjdk-current"
fi

echo "Detected Java Home: $JAVA_HOME_PATH"

# Create or update VS Code settings.json
cat > "$SETTINGS_FILE" << EOF
{
    "java.jdt.ls.java.home": "$JAVA_HOME_PATH",
    "java.home": "$JAVA_HOME_PATH",
    "java.configuration.runtimes": [
        {
            "name": "JavaSE-1.8",
            "path": "$JAVA_HOME_PATH",
            "default": true
        }
    ],
    "maven.executable.path": "/usr/bin/mvn"
}
EOF

echo "VS Code Java settings created at $SETTINGS_FILE"

echo "Post-create script completed."