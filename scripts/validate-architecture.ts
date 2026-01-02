import { Project, SyntaxKind } from 'ts-morph';
import * as path from 'path';

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

function validateArchitecture() {
  console.log('🚀 Starting architecture validation...');
  let hasErrors = false;

  const sourceFiles = project.getSourceFiles();

  sourceFiles.forEach(sourceFile => {
    const filePath = sourceFile.getFilePath();
    const relativePath = path.relative(process.cwd(), filePath);

    // 1. Check for cross-feature imports
    // Rules: 
    // - Features should not import from other features directly
    // - Features should only import from shared libs or their own feature directory
    const importDeclarations = sourceFile.getImportDeclarations();
    importDeclarations.forEach(imp => {
      const moduleSpecifier = imp.getModuleSpecifierValue();
      
      if (moduleSpecifier.startsWith('@features/') || moduleSpecifier.includes('src/features/')) {
        const currentFeature = relativePath.split('src/features/')[1]?.split('/')[0];
        const importedFeature = moduleSpecifier.split('@features/')[1]?.split('/')[0] || 
                               moduleSpecifier.split('src/features/')[1]?.split('/')[0];

        if (currentFeature && importedFeature && currentFeature !== importedFeature) {
          console.error(`❌ Cross-feature import: ${relativePath} imports from ${importedFeature}`);
          hasErrors = true;
        }
      }
    });

    // 2. Check for 'any' types (simplified check)
    sourceFile.getDescendantsOfKind(SyntaxKind.AnyKeyword).forEach(anyNode => {
      // Ignore node_modules or specific legacy files if needed
      if (!relativePath.includes('node_modules') && !relativePath.includes('@legacy')) {
        const line = anyNode.getStartLineNumber();
        console.warn(`⚠️ 'any' type detected: ${relativePath}:${line}`);
        // We'll treat 'any' as a warning for now, but could be an error
      }
    });

    // 3. Verify plugin usage
    // Check if components are using the plugin manager for extensible parts
    if (relativePath.includes('ExpertCard.tsx')) {
      const content = sourceFile.getFullText();
      if (!content.includes('pluginManager')) {
        console.error(`❌ ExpertCard should use pluginManager for extensibility: ${relativePath}`);
        hasErrors = true;
      }
    }
  });

  if (hasErrors) {
    console.log('\n❌ Validation failed. Please fix the architectural issues.');
    process.exit(1);
  } else {
    console.log('\n✅ Architecture validation passed!');
  }
}

validateArchitecture();
