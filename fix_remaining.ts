import { readFileSync, writeFileSync } from 'fs';

const files = [
  'src/features/council/lib/export.ts',
  'src/features/council/lib/council-memory.ts',
  'src/features/council/components/SynthesisCard.tsx'
];

files.forEach(filePath => {
  if (!require('fs').existsSync(filePath)) return;
  
  let content = readFileSync(filePath, 'utf8');
  
  // General fixes:
  // 1. Add missing type imports
  if (filePath.includes('council-memory') && !content.includes('import type')) {
    content = "import type { CouncilSession } from '../lib/types';\n" + content;
  }
  
  // 2. Fix any types
  content = content.replace(/: any\)/g, ': any)');
  content = content.replace(/Promise<any>/g, 'Promise<unknown>');
  
  // 3. Remove unused imports
  content = content.replace(/import.*from.*$/gm, (match) => {
    if (match.includes('unused') || match.includes('SheetTrigger')) {
      return '// ' + match;
    }
    return match;
  });
  
  writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${filePath}`);
});
