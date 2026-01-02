import { Project, QuoteKind } from "ts-morph";

/**
 * Script to migrate imports from @/lib/types to @/features/council/lib/types
 * based on whether the imported symbol is a Council-specific type or a Generic type.
 */

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  manipulationSettings: {
    quoteKind: QuoteKind.Double,
  },
});

const COUNCIL_TYPES = [
  "Expert",
  "ExpertConfig",
  "ModeBehavior",
  "KnowledgeFile",
  "ExecutionMode",
  "SynthesisTier",
  "SynthesisConfig",
  "SynthesisResult",
  "ExecutionState",
  "DebateRound",
  "ExportData",
  "CouncilSession",
];

const GENERIC_TYPES = ["ModelInfo", "VaultStatus", "FileUploadResult"];

const OLD_PATH = "@/lib/types";
const NEW_PATH = "@/features/council/lib/types";

project.getSourceFiles().forEach((sourceFile) => {
  const imports = sourceFile.getImportDeclarations().filter((imp) => {
    return imp.getModuleSpecifierValue() === OLD_PATH;
  });

  imports.forEach((imp) => {
    const namedImports = imp.getNamedImports();
    const councilImported: string[] = [];
    const genericImported: string[] = [];

    namedImports.forEach((namedImp) => {
      const name = namedImp.getName();
      if (COUNCIL_TYPES.includes(name)) {
        councilImported.push(name);
      } else if (GENERIC_TYPES.includes(name)) {
        genericImported.push(name);
      }
    });

    if (councilImported.length > 0 && genericImported.length > 0) {
      // Split the import
      imp.removeNamedImports(councilImported);
      sourceFile.addImportDeclaration({
        moduleSpecifier: NEW_PATH,
        namedImports: councilImported,
      });
      console.log(`Split imports in: ${sourceFile.getFilePath()}`);
    } else if (councilImported.length > 0) {
      // Move the entire import
      imp.setModuleSpecifier(NEW_PATH);
      console.log(`Moved import to Council in: ${sourceFile.getFilePath()}`);
    }
  });
});

project.saveSync();
console.log("\n[SUCCESS] Type imports updated.");
