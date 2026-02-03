#!/bin/bash

# GitHub Pages Deployment Verification Script
# Tests the Council app deployment on GitHub Pages

set -e

REPO_URL="https://elghazawy5367.github.io/Council-Git-V9"
BASE_PATH="/Council-Git-V9"

echo "🔍 GitHub Pages Deployment Verification"
echo "=========================================="
echo ""

# Test 1: Check if index.html loads
echo "1️⃣  Testing index.html..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$REPO_URL/")
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ index.html loads (HTTP $HTTP_CODE)"
else
    echo "   ❌ index.html failed (HTTP $HTTP_CODE)"
fi
echo ""

# Test 2: Check main JavaScript asset
echo "2️⃣  Testing main JavaScript asset..."
# Extract asset name from index.html
ASSET_FILE=$(curl -s "$REPO_URL/" | grep -oP 'src="[^"]*index-[^"]*\.js"' | head -1 | cut -d'"' -f2)
if [ -n "$ASSET_FILE" ]; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$REPO_URL$ASSET_FILE")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ Asset loads: $ASSET_FILE (HTTP $HTTP_CODE)"
    else
        echo "   ❌ Asset failed: $ASSET_FILE (HTTP $HTTP_CODE)"
    fi
else
    echo "   ⚠️  Could not find asset in index.html"
fi
echo ""

# Test 3: Check CSS asset
echo "3️⃣  Testing CSS asset..."
CSS_FILE=$(curl -s "$REPO_URL/" | grep -oP 'href="[^"]*index-[^"]*\.css"' | head -1 | cut -d'"' -f2)
if [ -n "$CSS_FILE" ]; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$REPO_URL$CSS_FILE")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ CSS loads: $CSS_FILE (HTTP $HTTP_CODE)"
    else
        echo "   ❌ CSS failed: $CSS_FILE (HTTP $HTTP_CODE)"
    fi
else
    echo "   ⚠️  Could not find CSS in index.html"
fi
echo ""

# Test 4: Verify base path in index.html
echo "4️⃣  Verifying base path configuration..."
if curl -s "$REPO_URL/" | grep -q "Council-Git-V9/assets/"; then
    echo "   ✅ Base path is correctly set to /Council-Git-V9/assets/"
else
    echo "   ❌ Base path not found in assets (may be using root /assets/)"
fi
echo ""

# Test 5: Check for 404.html (GitHub Pages redirect)
echo "5️⃣  Checking 404.html for SPA redirect..."
FOUR_OH_FOUR=$(curl -s -o /dev/null -w "%{http_code}" "$REPO_URL/404.html")
if [ "$FOUR_OH_FOUR" = "200" ]; then
    echo "   ✅ 404.html exists (HTTP 200)"
    echo "   Note: For SPA routing to work, GitHub Pages needs 404.html redirect"
else
    echo "   ⚠️  404.html not found (HTTP $FOUR_OH_FOUR)"
fi
echo ""

# Test 6: Verify dist folder was deployed
echo "6️⃣  Checking deployed files..."
if curl -s "$REPO_URL/" | grep -q "<!doctype html>"; then
    echo "   ✅ Valid HTML document detected"
else
    echo "   ❌ Invalid or missing HTML"
fi
echo ""

echo "=========================================="
echo "✨ Verification Complete"
echo ""
echo "If tests failed, check:"
echo "1. GitHub Actions deployment completed successfully"
echo "2. Repository Settings → Pages → Source is set correctly"
echo "3. dist/ folder contains all built files"
echo "4. index.html has correct asset paths with /Council-Git-V9/ prefix"
