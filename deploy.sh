#!/usr/bin/env bash
# Script: deploy.sh
# Description: Build the app for production deployment
set -eo pipefail

echo "Building application for production..."
npm run build

echo "Creating Render configuration file..."
cat > render.yaml << EOL
services:
  - type: web
    name: spanish-english-translator
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
EOL

echo "Creating static.json for SPA routing..."
cat > static.json << EOL
{
  "root": "dist",
  "clean_urls": true,
  "routes": {
    "/**": "index.html"
  }
}
EOL

echo "Build complete! Your app is ready for deployment to Render."
echo "To deploy:"
echo "1. Create a new Static Site on Render"
echo "2. Connect your repository"
echo "3. Use 'npm run build' as the build command"
echo "4. Use 'dist' as the publish directory"
echo "5. Add any environment variables (like VITE_HF_TOKEN) if needed"
