#!/bin/bash

# Deployment Validation Script
# Checks if the app is ready for deployment

set -e

echo "🚀 Council Deployment Validation"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track errors
ERRORS=0
WARNINGS=0

# Check 1: Node modules
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules exists"
else
    echo -e "${RED}✗${NC} node_modules missing - run: npm install"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: Build succeeds
echo ""
echo "🔨 Testing build..."
if npm run build > /tmp/build.log 2>&1; then
    echo -e "${GREEN}✓${NC} Build successful"
    
    # Check build size
    DIST_SIZE=$(du -sm dist 2>/dev/null | cut -f1)
    if [ -n "$DIST_SIZE" ]; then
        if [ "$DIST_SIZE" -lt 5 ]; then
            echo -e "${GREEN}✓${NC} Bundle size: ${DIST_SIZE}MB (optimal)"
        elif [ "$DIST_SIZE" -lt 10 ]; then
            echo -e "${YELLOW}⚠${NC} Bundle size: ${DIST_SIZE}MB (acceptable)"
            WARNINGS=$((WARNINGS + 1))
        else
            echo -e "${RED}✗${NC} Bundle size: ${DIST_SIZE}MB (too large)"
            ERRORS=$((ERRORS + 1))
        fi
    fi
else
    echo -e "${RED}✗${NC} Build failed - check /tmp/build.log"
    ERRORS=$((ERRORS + 1))
fi

# Check 3: TypeScript check (informational only)
echo ""
echo "🔍 Running TypeScript check..."
if npm run type-check > /tmp/typecheck.log 2>&1; then
    echo -e "${GREEN}✓${NC} No TypeScript errors"
else
    echo -e "${YELLOW}⚠${NC} TypeScript warnings exist (not blocking deployment)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 4: Required files
echo ""
echo "📄 Checking deployment files..."
REQUIRED_FILES=(
    ".github/workflows/deploy.yml"
    "DEPLOYMENT_VERIFICATION.md"
    "dist/index.html"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file missing"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check 5: Git status
echo ""
echo "🔄 Checking git status..."
if git diff --quiet; then
    echo -e "${GREEN}✓${NC} No uncommitted changes"
else
    echo -e "${YELLOW}⚠${NC} Uncommitted changes detected"
    WARNINGS=$((WARNINGS + 1))
fi

# Summary
echo ""
echo "================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment validation passed${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠  $WARNINGS warning(s) - review recommended${NC}"
    fi
    echo ""
    echo "Next steps:"
    echo "  1. Commit changes: git add . && git commit -m 'feat: deployment setup'"
    echo "  2. Push to GitHub: git push origin main"
    echo "  3. GitHub Actions will auto-deploy to Pages"
    echo "  4. Or deploy manually: npm run deploy"
    exit 0
else
    echo -e "${RED}❌ Deployment validation failed${NC}"
    echo -e "${RED}$ERRORS error(s), $WARNINGS warning(s)${NC}"
    echo ""
    echo "Fix errors above before deploying."
    exit 1
fi
