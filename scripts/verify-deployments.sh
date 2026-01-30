#!/bin/bash

# Deployment Integration Verification Script
# Tests GitHub Pages and Firebase deployment platforms

echo "🔍 Verifying Deployment Configuration..."
echo "========================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 missing"
        ((errors++))
        return 1
    fi
}

# Function to check content
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $1 contains: $2"
        return 0
    else
        echo -e "${RED}✗${NC} $1 missing: $2"
        ((errors++))
        return 1
    fi
}

echo ""
echo "📄 Configuration Files:"
echo "-----------------------"
check_file "firebase.json"
check_file ".idxrc"
check_file "vite.config.ts"
check_file "package.json"
check_file "index.html"

echo ""
echo "🎯 GitHub Pages Configuration:"
echo "-------------------------------"
check_file ".github/workflows/deploy.yml"
check_file "public/.nojekyll"
check_file "public/404.html"
check_content "vite.config.ts" "Council-Git-V9"

echo ""
echo "🔥 Firebase Configuration:"
echo "--------------------------"
check_content "firebase.json" "\"public\": \"dist\""
check_content "firebase.json" "rewrites"

echo ""
echo "🏗️  IDX Configuration:"
echo "----------------------"
check_content ".idxrc" "\"dev\""
check_content ".idxrc" "\"build\""

echo ""
echo "⚙️  Build Configuration:"
echo "------------------------"
check_content "package.json" "\"build\": \"vite build\""
check_content "package.json" "\"deploy\": \"gh-pages -d dist\""
check_content "vite.config.ts" "base:"

echo ""
echo "📱 HTML Configuration:"
echo "----------------------"
check_content "index.html" "The Council"
if ! check_content "index.html" "Lovable App"; then
    echo -e "${GREEN}✓${NC} Branding updated from template"
    ((errors--)) # Subtract the error since this is actually good
fi

echo ""
echo "🧪 Testing Build:"
echo "-----------------"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build succeeded"
    if [ -d "dist" ]; then
        echo -e "${GREEN}✓${NC} dist/ directory created"
        if [ -f "dist/index.html" ]; then
            echo -e "${GREEN}✓${NC} dist/index.html exists"
        else
            echo -e "${RED}✗${NC} dist/index.html missing"
            ((errors++))
        fi
    else
        echo -e "${RED}✗${NC} dist/ directory not created"
        ((errors++))
    fi
else
    echo -e "${RED}✗${NC} Build failed"
    ((errors++))
fi

echo ""
echo "========================================"
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "Deployment platforms ready:"
    echo "  • GitHub Pages: https://elghazawy5367.github.io/Council-Git-V9/"
    echo "  • Firebase: Run 'firebase deploy'"
    exit 0
else
    echo -e "${RED}❌ $errors error(s) found${NC}"
    exit 1
fi
