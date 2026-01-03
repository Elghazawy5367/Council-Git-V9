import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/components/primitives/sidebar.tsx';
let content = readFileSync(filePath, 'utf8');

// Fix the state property type
content = content.replace(
  /state:\s*['"][^'"]*['"]/g,
  "state: 'open' as const"
);

// Or remove the state property if it's not needed
content = content.replace(
  /state: string,/g,
  "// state: 'open', // Removed for type compatibility"
);

writeFileSync(filePath, content, 'utf8');
console.log('Fixed sidebar.tsx');
