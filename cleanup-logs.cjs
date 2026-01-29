
const fs = require('fs');
const path = require('path');

// Files identified in the repo-analysis.md report
const filesToClean = [
  path.join(__dirname, "# deep repository intelligence.md"),
  path.join(__dirname, "docs/FEATURE_8_REDDIT_SCRAPING.md"),
  path.join(__dirname, "docs/FEATURE_9_HACKERNEWS_PRODUCTHUNT.md"),
  path.join(__dirname, "docs/GITHUB_COPILOT_INTEGRATION.md"),
  path.join(__dirname, "docs/HEIST_QUICK_START.md"),
  path.join(__dirname, "docs/STARGAZER_QUALITY_ANALYSIS.md"),
  path.join(__dirname, "docs/archive/STRUCTURED_OUTPUT_GUIDE.md"),
  path.join(__dirname, "docs/archive/WEIGHTED_VOTING_GUIDE.md"),
  path.join(__dirname, "docs/archive/📊 Synthesis Engine Analysis - Complete Architecture Overview.md"),
  path.join(__dirname, "docs/guides/mining-drill.md"),
  path.join(__dirname, "docs/reference/web-console-protection.md"),
  path.join(__dirname, "snapshot.js"),
  path.join(__dirname, "src/lib/mirror-standards.json"),
  path.join(__dirname, "src/lib/viral-radar.ts"),
  path.join(__dirname, "🎯 THE HEIST - Prompt Engineering Exploit Guide.md")
];

console.log('Starting to remove console.log statements from reported files...');

filesToClean.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found, skipping: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Simple regex to find and remove console.log(...) statements
    // This is safer for .md and .json files than AST parsing
    content = content.replace(/console\.log\([^)]*\);?/g, '');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Cleaned console.log statements from: ${path.basename(filePath)}`);
    } else {
      console.log(`No console.log statements found in: ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
});

console.log('Cleanup process complete.');
