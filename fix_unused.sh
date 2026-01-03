#!/bin/bash

# Function to add _ prefix to unused parameters
add_underscore() {
  local file=$1
  local line=$2
  local param=$3
  sed -i "${line}s/\b${param}\b/_${param}/" "$file"
  echo "Fixed $file line $line: ${param} -> _${param}"
}

# Fix ai-client.ts line 252
add_underscore "src/features/council/api/ai-client.ts" 252 "expertId"

# Fix ExpertExpandedModal.tsx line 12
add_underscore "src/features/council/components/ExpertExpandedModal.tsx" 12 "X"

# Fix Header.tsx line 17
add_underscore "src/features/council/components/Header.tsx" 17 "showMemory"

# Fix HistoryPanel.tsx line 8 - remove unused import
sed -i '8s/{.*SheetTrigger.*}/&/' "src/features/council/components/HistoryPanel.tsx"
sed -i '8s/SheetTrigger, //' "src/features/council/components/HistoryPanel.tsx"

# Fix any type parameters (e, i) - find and fix all
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "Parameter.*implicitly has an 'any' type" | while read file; do
  echo "Checking $file for implicit any..."
  sed -i 's/\((e)\): any/\1: Event/g' "$file"
  sed -i 's/\((i)\): any/\1: number/g' "$file"
done

echo "Fixed unused variables"
