#!/bin/bash

# Force GitHub Pages deployment by updating a timestamp
echo "Forcing GitHub Pages deployment..."

# Add a timestamp comment to trigger deployment
echo "<!-- Last updated: $(date) -->" > .github/pages-timestamp.html

# Commit and push the timestamp file
git add .github/pages-timestamp.html
git commit -m "Force GitHub Pages deployment - $(date)"
git push

echo "GitHub Pages deployment triggered!"
echo "Check the Actions tab in your GitHub repository to monitor the deployment." 