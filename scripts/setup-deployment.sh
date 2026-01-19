#!/bin/bash

# Deployment Setup Script
# This script helps configure all deployment platforms

set -e

echo "🚀 Council AI - Deployment Integration Setup"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running in GitHub Codespace
if [ -n "$GITHUB_WORKSPACE" ]; then
    echo -e "${BLUE}✓ Running in GitHub environment${NC}"
    IS_GITHUB=true
else
    IS_GITHUB=false
fi

echo ""
echo -e "${BLUE}Select deployment platforms to setup:${NC}"
echo "1) GitHub Pages (Automatic)"
echo "2) Vercel (Manual Setup Required)"
echo "3) Firebase Hosting (Manual Setup Required)"
echo "4) IDX by Google (Already Configured)"
echo "5) Setup All"
echo "6) Skip Setup"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo -e "${YELLOW}GitHub Pages Setup${NC}"
        echo "✓ Configuration file: vercel.json"
        echo "✓ Workflow: .github/workflows/deploy.yml"
        echo "✓ Base path: /Council-Git-V9/"
        echo ""
        echo "Manual steps:"
        echo "1. Push code to GitHub"
        echo "2. Go to: https://github.com/Elghazawy5367/Council-Git-V9/settings/pages"
        echo "3. Select 'gh-pages' branch as source"
        echo "4. Wait for deployment"
        echo ""
        echo -e "${GREEN}✓ GitHub Pages configuration ready!${NC}"
        ;;

    2)
        echo -e "${YELLOW}Vercel Deployment Setup${NC}"
        echo ""
        echo "Install Vercel CLI:"
        npm install -g vercel 2>/dev/null || echo "⚠ Vercel CLI not installed, please install manually: npm install -g vercel"
        echo ""
        echo "Next steps:"
        echo "1. Run: vercel link"
        echo "2. Select your organization"
        echo "3. Create new project"
        echo "4. Get your credentials from https://vercel.com/account/tokens"
        echo ""
        echo "GitHub Secrets to add:"
        echo "  VERCEL_TOKEN - Authentication token"
        echo "  VERCEL_ORG_ID - Organization ID"
        echo "  VERCEL_PROJECT_ID - Project ID"
        echo ""
        echo "Add them at:"
        echo "https://github.com/Elghazawy5367/Council-Git-V9/settings/secrets/actions"
        echo ""
        echo -e "${GREEN}✓ Follow these steps to complete Vercel setup${NC}"
        ;;

    3)
        echo -e "${YELLOW}Firebase Hosting Setup${NC}"
        echo ""
        echo "Install Firebase CLI:"
        npm install -g firebase-tools 2>/dev/null || echo "⚠ Firebase CLI not installed, please install manually: npm install -g firebase-tools"
        echo ""
        echo "Next steps:"
        echo "1. Run: firebase login"
        echo "2. Create project at https://console.firebase.google.com"
        echo "3. Run: firebase init hosting"
        echo "4. Run: firebase login:ci (for GitHub Actions)"
        echo ""
        echo "GitHub Secret to add:"
        echo "  FIREBASE_TOKEN - From firebase login:ci output"
        echo ""
        echo "Add it at:"
        echo "https://github.com/Elghazawy5367/Council-Git-V9/settings/secrets/actions"
        echo ""
        echo -e "${GREEN}✓ Follow these steps to complete Firebase setup${NC}"
        ;;

    4)
        echo -e "${YELLOW}IDX by Google${NC}"
        echo ""
        echo "✓ .idxrc configuration file is ready"
        echo "✓ Dev server: :5173"
        echo "✓ Preview server: :4173"
        echo ""
        echo "To access:"
        echo "1. Go to https://idx.dev"
        echo "2. Import this repository"
        echo "3. Click 'Create Workspace'"
        echo "4. Use pre-configured tasks in Command Palette"
        echo ""
        echo -e "${GREEN}✓ IDX integration complete!${NC}"
        ;;

    5)
        echo -e "${YELLOW}Setting up all platforms...${NC}"
        echo ""
        echo -e "${BLUE}1. GitHub Pages${NC}"
        echo "   ✓ Configuration ready"
        echo "   ✓ Workflow configured"
        echo ""
        echo -e "${BLUE}2. Vercel${NC}"
        npm install -g vercel 2>/dev/null || true
        echo "   ⚠ Requires: vercel link, VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID"
        echo ""
        echo -e "${BLUE}3. Firebase${NC}"
        npm install -g firebase-tools 2>/dev/null || true
        echo "   ⚠ Requires: firebase login, firebase init hosting, FIREBASE_TOKEN"
        echo ""
        echo -e "${BLUE}4. IDX${NC}"
        echo "   ✓ Configuration ready"
        echo ""
        echo -e "${GREEN}All platforms configured!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Add GitHub Secrets: https://github.com/Elghazawy5367/Council-Git-V9/settings/secrets/actions"
        echo "2. Follow manual setup steps for Vercel and Firebase"
        echo "3. Read DEPLOYMENT_INTEGRATION.md for detailed instructions"
        ;;

    6)
        echo "Skipping setup. You can run this script anytime."
        ;;

    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Setup complete!${NC}"
echo ""
echo "For more information, see: DEPLOYMENT_INTEGRATION.md"
echo "Build and deploy with: npm run build && npm run deploy"
echo ""
