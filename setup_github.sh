#!/bin/bash

# GitHub Repository Setup Script
# This script helps you set up the remote repository and push your code

echo "🚀 GitHub Repository Setup for CABA FHIR Profiles"
echo "=================================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if we have commits
if ! git rev-parse HEAD >/dev/null 2>&1; then
    echo "❌ No commits found. Please commit your changes first."
    exit 1
fi

echo "✅ Git repository is ready"
echo ""

# Get repository details from user
echo "Please provide the following information:"
read -p "GitHub username: " GITHUB_USERNAME
read -p "Repository name (e.g., caba-fhir-profiles): " REPO_NAME

# Validate inputs
if [ -z "$GITHUB_USERNAME" ] || [ -z "$REPO_NAME" ]; then
    echo "❌ Username and repository name are required"
    exit 1
fi

echo ""
echo "📋 Repository Details:"
echo "  Username: $GITHUB_USERNAME"
echo "  Repository: $REPO_NAME"
echo "  URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

# Confirm with user
read -p "Is this correct? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled"
    exit 1
fi

echo ""
echo "🔧 Setting up remote repository..."

# Add remote origin
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Set main branch as upstream
git branch -M main

echo "✅ Remote repository configured"
echo ""

# Check if remote exists
if git ls-remote --exit-code origin >/dev/null 2>&1; then
    echo "✅ Remote repository exists and is accessible"
    echo ""
    echo "📤 Pushing code to GitHub..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Success! Your code has been pushed to GitHub"
        echo "📖 View your repository at: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
        echo ""
        echo "📝 Next steps:"
        echo "  1. Visit your repository on GitHub"
        echo "  2. Verify all files are uploaded correctly"
        echo "  3. Check that the README.md displays properly"
        echo "  4. Consider setting up GitHub Pages for documentation"
        echo "  5. Add collaborators if needed"
    else
        echo "❌ Failed to push to GitHub. Please check your credentials and try again."
        exit 1
    fi
else
    echo "❌ Remote repository not found or not accessible"
    echo ""
    echo "📋 Please create the repository on GitHub first:"
    echo "  1. Go to https://github.com/new"
    echo "  2. Repository name: $REPO_NAME"
    echo "  3. Description: FHIR R4 profiles and terminology for CABA healthcare reimbursement system"
    echo "  4. Choose visibility (Public/Private)"
    echo "  5. DO NOT initialize with README, .gitignore, or license"
    echo "  6. Click 'Create repository'"
    echo ""
    echo "After creating the repository, run this script again."
    exit 1
fi 