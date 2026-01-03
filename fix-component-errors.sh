#!/bin/bash

echo "=== FIXING COMPONENT ERRORS ==="

# Fix NavLink.tsx - add React import and fix component definition
sed -i '1i import React from "react";' src/components/NavLink.tsx
sed -i 's/const NavLink = Component/const NavLink: React.FC = Component/g' src/components/NavLink.tsx

# Fix primitive component files
for file in src/components/primitives/*.tsx; do
  if grep -q "error TS2304" <<< "$(npx tsc --noEmit --skipLibCheck 2>&1 | grep "$file")"; then
    echo "Fixing $file..."
    
    # Add React import if missing
    if ! grep -q "import React" "$file"; then
      sed -i '1i import React from "react";' "$file"
    fi
    
    # Fix component definitions
    sed -i 's/export const \([A-Z][a-zA-Z]*\) = Component/export const \1: React.FC = Component/g' "$file"
  fi
done

echo "Component errors fixed"
