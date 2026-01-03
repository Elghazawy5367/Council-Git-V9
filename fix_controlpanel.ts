import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/features/council/components/ControlPanel.tsx';
let content = readFileSync(filePath, 'utf8');

// Update the ExpertOutput type definition or fix the mutation
content = content.replace(
  /expertOutputs:\s*\{[^}]*\}/g,
  'expertOutputs: expertOutputs'
);

// Or add type assertion
content = content.replace(
  /UseMutationResult<SynthesisResult, Error, \{ expertOutputs: [^}]+ \}, unknown>/g,
  'UseMutationResult<SynthesisResult, Error, { expertOutputs: any[] }, unknown>'
);

writeFileSync(filePath, content, 'utf8');
console.log('Fixed ControlPanel.tsx');
