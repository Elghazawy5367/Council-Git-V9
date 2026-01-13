#!/bin/bash

# Automated GitHub Pages Setup Verifier & Fixer

echo "🔍 Checking GitHub Pages Configuration..."
echo "=========================================="
echo ""

# Check if Pages is configured via API
PAGES_CONFIG=$(curl -s "https://api.github.com/repos/Elghazawy5367/Council-Git-V9/pages")

if echo "$PAGES_CONFIG" | grep -q "\"source\""; then
    echo "✅ GitHub Pages is enabled"
    echo ""
    echo "Current configuration:"
    echo "$PAGES_CONFIG" | grep -o '"source":[^}]*' || echo "Source information pending..."
else
    echo "❌ GitHub Pages may not be configured correctly"
    echo ""
    echo "REQUIRED ACTION:"
    echo "==============="
    echo ""
    echo "1. Visit: https://github.com/Elghazawy5367/Council-Git-V9/settings/pages"
    echo ""
    echo "2. In the 'Build and deployment' section:"
    echo "   • Source dropdown: Select 'GitHub Actions'"
    echo "   • Click 'Save'"
    echo ""
    echo "3. Check the workflow runs again:"
    echo "   https://github.com/Elghazawy5367/Council-Git-V9/actions"
    echo ""
fi

echo ""
echo "📊 Workflow Status:"
echo "===================="
echo ""

# Get last 3 runs
curl -s "https://api.github.com/repos/Elghazawy5367/Council-Git-V9/actions/runs?per_page=3" | \
jq -r '.workflow_runs[] | "\(.conclusion | ascii_upcase): \(.name) - \(.created_at) - Commit: \(.head_commit.message | split("\n") | .[0])"' 2>/dev/null || \
echo "Could not fetch workflow status. Check manually at:"
echo "  https://github.com/Elghazawy5367/Council-Git-V9/actions"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 MANUAL RE-RUN (if needed):"
echo ""
echo "If the Pages setting is now correct, manually trigger:"
echo "  1. Go to Actions tab"
echo "  2. Click 'Deploy to GitHub Pages' workflow"
echo "  3. Click 'Run workflow' → 'Run workflow'"
echo ""
echo "Or push a new commit to trigger automatically:"
echo "  git commit --allow-empty -m 'trigger: github pages deployment'"
echo "  git push origin main"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
