#!/bin/bash

echo "=== EMERGENCY TYPE ERROR FIX ==="

# 1. Add missing type imports
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "Expert.*not found" | while read file; do
  sed -i '1i import type { Expert } from "@/features/council/lib/types";' "$file"
done

# 2. Fix any types
find src -name "*.ts" -o -name "*.tsx" -exec sed -i 's/: any\)/: unknown)/g' {} \;

# 3. Remove unused imports
find src -name "*.tsx" -exec sed -i "s/import.*SheetTrigger.*//g" {} \;

# 4. Add default exports where missing
find src -name "*.tsx" -exec grep -L "export default" {} \; | while read file; do
  if grep -q "export function" "$file" || grep -q "export const" "$file"; then
    echo "// Component exported" > /dev/null
  else
    echo "Adding default export to $file"
    echo -e "\nexport default Component;" >> "$file"
  fi
done

# 5. Quick type check
echo "=== CHECKING ==="
npx tsc --noEmit --skipLibCheck 2>&1 | grep -c "error TS" | xargs echo "Errors remaining:"
