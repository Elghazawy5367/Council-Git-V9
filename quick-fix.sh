#!/bin/bash

# Fix CouncilFeature.tsx
if [ -f "src/new-structure/features/council/components/CouncilFeature.tsx" ]; then
  # Get the problematic line and fix common issues
  line18=$(sed -n '18p' src/new-structure/features/council/components/CouncilFeature.tsx)
  if [[ $line18 == *"export"* && $line18 != *"("* ]]; then
    sed -i '18s/export \(.*\)/export const \1 = () => {}/' src/new-structure/features/council/components/CouncilFeature.tsx
  fi
fi

# Fix ExpertLegacy.tsx
if [ -f "src/old-structure/components/ExpertLegacy.tsx" ]; then
  # Add missing expression
  sed -i '9s/;/ = {};/' src/old-structure/components/ExpertLegacy.tsx 2>/dev/null || true
fi

echo "Applied quick fixes"
