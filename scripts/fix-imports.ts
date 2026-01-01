import { Project, QuoteKind } from "ts-morph";
import * as path from "path";

/**
 * The Council Codemod: Automated Import Normalization
 * Converts relative imports to absolute path aliases (@/)
 * and updates imports when files move.
 */

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  manipulationSettings: {
    quoteKind: QuoteKind.Double,
  },
});

const srcDir = path.resolve("src");

project.getSourceFiles().forEach((sourceFile) => {
  const imports = sourceFile.getImportDeclarations();
  let madeChanges = false;

  imports.forEach((importDecl) => {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();

    // Only process relative imports that go up or are in siblings
    if (moduleSpecifier.startsWith(".")) {
      const sourcePath = sourceFile.getFilePath();
      const importPath = path.resolve(path.dirname(sourcePath), moduleSpecifier);

      // Check if the import points to something inside src/
      if (importPath.startsWith(srcDir)) {
        const relativeToSrc = path.relative(srcDir, importPath);
        const aliasPath = `@/${relativeToSrc.replace(/\\/g, "/")}`;
        
        // Clean up common extensions and index files
        const cleanAlias = aliasPath
          .replace(/\.(ts|tsx|js|jsx)$/, "")
          .replace(/\/index$/, "");

        if (moduleSpecifier !== cleanAlias) {
          importDecl.setModuleSpecifier(cleanAlias);
          madeChanges = true;
        }
      }
    }
  });

  if (madeChanges) {
    console.log(`Updated imports in: ${sourceFile.getFilePath()}`);
  }
});

// Use --dry-run to skip saving
const isDryRun = process.argv.includes("--dry-run");

if (isDryRun) {
  console.log("\n[DRY RUN] Previewing changes... (No files modified)");
} else {
  project.saveSync();
  console.log("\n[SUCCESS] All imports updated and saved.");
}
