#!/bin/bash
# Test script to verify GitHub token configuration in workflows

echo "🔍 Verifying GitHub Token Configuration in Workflows"
echo "=================================================="
echo ""

WORKFLOWS=(
  "goldmine-detector.yml"
  "mining-drill.yml"
  "market-gap-identifier.yml"
)

WORKING_DIR="/home/runner/work/Council-Git-V9/Council-Git-V9/.github/workflows"

for workflow in "${WORKFLOWS[@]}"; do
  echo "📄 Checking: $workflow"
  
  # Check if workflow has permissions
  if grep -q "permissions:" "$WORKING_DIR/$workflow"; then
    echo "  ✅ Has permissions section"
    
    if grep -q "contents: write" "$WORKING_DIR/$workflow"; then
      echo "  ✅ Has contents: write permission"
    else
      echo "  ❌ Missing contents: write permission"
    fi
  else
    echo "  ❌ Missing permissions section"
  fi
  
  # Check if workflow has GITHUB_TOKEN env
  if grep -q "GITHUB_TOKEN:" "$WORKING_DIR/$workflow"; then
    echo "  ✅ Has GITHUB_TOKEN in env"
  else
    echo "  ⚠️  No GITHUB_TOKEN in env (may not be needed)"
  fi
  
  # Check if workflow has proper step naming
  if grep -q "name:.*Run" "$WORKING_DIR/$workflow"; then
    echo "  ✅ Has named execution step"
  else
    echo "  ⚠️  Missing named execution step"
  fi
  
  echo ""
done

echo "=================================================="
echo "✅ Verification complete"
