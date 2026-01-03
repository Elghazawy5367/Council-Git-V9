#!/bin/bash
FILE="src/new-structure/features/council/components/CouncilFeature.tsx"

# First, let's see the exact line
echo "Line 18 currently:"
sed -n '18p' "$FILE"

# The error suggests there's a syntax issue with export or variable declaration
# Common issue: trying to export something incorrectly

# Let's check if it's trying to export a variable named 'export' (which is invalid)
if grep -q "export =" "$FILE" || grep -q "export:" "$FILE"; then
    echo "Found invalid export syntax. Fixing..."
    
    # Replace invalid export syntax
    sed -i 's/export =/export const/' "$FILE"
    sed -i 's/export:/export const/' "$FILE"
    
    # If it's a variable named export, rename it
    sed -i 's/const export =/const ExportComponent =/' "$FILE"
    sed -i 's/let export =/let exportComponent =/' "$FILE"
    sed -i 's/var export =/var exportVar =/' "$FILE"
fi

# Check for missing semicolons
sed -i '18s/\([^;}]\)$/\1;/' "$FILE"

echo "Fixed line 18 syntax"
