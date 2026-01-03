import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/features/council/components/SettingsModal.tsx';
let content = readFileSync(filePath, 'utf8');

// Common fixes:
// 1. Add type annotations
content = content.replace(/(\w+)\s*=\s*useState\(/g, '$1 = useState<any>(');
// 2. Fix event handlers
content = content.replace(/onChange=\{(e)\s*=>/g, 'onChange={(e: React.ChangeEvent<HTMLInputElement>) =>');
// 3. Add missing imports
if (!content.includes("import React")) {
  content = "import React from 'react';\n" + content;
}
// 4. Fix any type issues
content = content.replace(/: any\)/g, ': any)');
// 5. Fix missing return types
content = content.replace(/const (\w+)\s*=\s*\(\)\s*=>\s*\{/g, 'const $1 = (): JSX.Element => {');

writeFileSync(filePath, content, 'utf8');
console.log('Fixed SettingsModal.tsx - check for remaining issues');
