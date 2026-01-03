#!/bin/bash

echo "=== FIXING UI IMPORTS ==="

# Fix ArtifactRenderer.tsx
sed -i "s|@/components/ui/button|@/components/primitives/button|g" src/components/primitives/ArtifactRenderer.tsx
sed -i "s|@/components/ui/card|@/components/primitives/card|g" src/components/primitives/ArtifactRenderer.tsx
sed -i "s|@/components/ui/badge|@/components/primitives/badge|g" src/components/primitives/ArtifactRenderer.tsx
sed -i "s|@/components/ui/collapsible|@/components/primitives/collapsible|g" src/components/primitives/ArtifactRenderer.tsx

# Check if other files have similar issues
find src -name "*.tsx" -exec grep -l "@/components/ui" {} \; | while read file; do
  echo "Checking $file..."
  # Replace @/components/ui with @/components/primitives for common components
  sed -i "s|@/components/ui/button|@/components/primitives/button|g" "$file"
  sed -i "s|@/components/ui/card|@/components/primitives/card|g" "$file"
  sed -i "s|@/components/ui/badge|@/components/primitives/badge|g" "$file"
  sed -i "s|@/components/ui/collapsible|@/components/primitives/collapsible|g" "$file"
done

echo "UI imports fixed"
