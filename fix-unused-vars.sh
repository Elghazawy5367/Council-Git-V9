#!/bin/bash

echo "=== FIXING UNUSED VARIABLES ==="

# Fix calendar.tsx
sed -i 's/(_props)/(_props: any)/g' src/components/primitives/calendar.tsx

# Fix other files with unused variables
find src -name "*.tsx" -exec grep -l "is declared but its value is never read" {} \; | while read file; do
  echo "Fixing unused variables in $file"
  # Add underscore prefix to unused parameters
  sed -i 's/(([a-zA-Z]+)\): any/\1: any/g' "$file"
  sed -i 's/(([a-zA-Z]+)\) = useState/\1 = useState/g' "$file"
done

echo "Unused variables fixed"
