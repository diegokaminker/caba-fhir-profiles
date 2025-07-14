#!/bin/bash

# Deploy IG to GitHub Pages
# This script helps you deploy the IG repository to GitHub Pages

set -e

# Configuration
IG_REPO_NAME="recupero-caba-ig"
IG_REPO_PATH="../$IG_REPO_NAME"
CURRENT_DIR=$(pwd)

echo "🚀 Deploying IG to GitHub Pages..."

# Check if IG repository exists
if [ ! -d "$IG_REPO_PATH" ]; then
    echo "❌ Error: IG repository not found at $IG_REPO_PATH"
    echo "   Please run setup_ig_repo.sh first"
    exit 1
fi

cd "$IG_REPO_PATH"

# Check if git remote is configured
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin configured."
    echo ""
    echo "📋 Please follow these steps:"
    echo ""
    echo "1. Create a new repository on GitHub:"
    echo "   - Go to https://github.com/new"
    echo "   - Repository name: $IG_REPO_NAME"
    echo "   - Make it Public (for GitHub Pages)"
    echo "   - Don't initialize with README (we already have one)"
    echo ""
    echo "2. Add the remote origin:"
    echo "   git remote add origin https://github.com/[your-username]/$IG_REPO_NAME.git"
    echo ""
    echo "3. Then run this script again"
    echo ""
    exit 1
fi

# Check current status
echo "📊 Current repository status:"
git status --porcelain

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Currently on branch '$CURRENT_BRANCH'. Switching to main..."
    git checkout main
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  There are uncommitted changes. Please commit them first:"
    echo "   git add -A"
    echo "   git commit -m 'Your commit message'"
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ IG repository pushed to GitHub!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Go to your GitHub repository:"
echo "   https://github.com/[your-username]/$IG_REPO_NAME"
echo ""
echo "2. Enable GitHub Pages:"
echo "   - Go to Settings > Pages"
echo "   - Source: Deploy from a branch"
echo "   - Branch: main"
echo "   - Folder: / (root)"
echo "   - Click Save"
echo ""
echo "3. Wait for deployment (usually 2-5 minutes)"
echo ""
echo "4. Your IG will be available at:"
echo "   https://[your-username].github.io/$IG_REPO_NAME/"
echo ""
echo "🔄 To update the IG later:"
echo "   cd $IG_REPO_PATH"
echo "   ./sync_ig.sh"
echo "" 