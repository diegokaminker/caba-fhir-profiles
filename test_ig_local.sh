#!/bin/bash

# Test IG Locally
# This script serves the IG locally for testing

set -e

# Configuration
IG_REPO_PATH="../recupero-caba-ig"
PORT=8080

echo "🧪 Testing IG locally..."

# Check if IG repository exists
if [ ! -d "$IG_REPO_PATH" ]; then
    echo "❌ Error: IG repository not found at $IG_REPO_PATH"
    echo "   Please run setup_ig_repo.sh first"
    exit 1
fi

cd "$IG_REPO_PATH"

# Check if index.html exists
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found in IG repository"
    echo "   Please ensure the output folder was copied correctly"
    exit 1
fi

echo "📁 Serving IG from: $(pwd)"
echo "🌐 Local URL: http://localhost:$PORT"
echo "📄 Main page: http://localhost:$PORT/index.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the web server
python3 -m http.server $PORT 