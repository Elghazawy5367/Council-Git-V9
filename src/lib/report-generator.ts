/**
 * Intelligence Report Generator
 * 
 * Main entry point for report generation.
 * Now uses modular architecture with multi-format support.
 * 
 * Usage:
 *   npm run scout:report
 *   npm run scout:report -- --format=pdf
 *   npm run scout:report -- --format=docx
 */

import { generateAndSaveReport } from './reports';
import { ReportFormat } from './reports/types';

async function main(): Promise<void> {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const formatArg = args.find((arg) => arg.startsWith('--format='));
  const format: ReportFormat = (formatArg?.split('=')[1] as ReportFormat) || 'markdown';

  const outputArg = args.find((arg) => arg.startsWith('--output='));
  const outputPath = outputArg?.split('=')[1];

  const templateArg = args.find((arg) => arg.startsWith('--template='));
  const templateName = templateArg?.split('=')[1];

  // Validate format
  const validFormats: ReportFormat[] = ['json', 'markdown', 'pdf', 'docx'];
  if (!validFormats.includes(format)) {
    console.error(`Invalid format: ${format}. Valid formats: ${validFormats.join(', ')}`);
    process.exit(1);
  }

  console.log(`Generating ${format.toUpperCase()} report...`);

  try {
    const savedPath = await generateAndSaveReport({
      format,
      outputPath,
      templateName,
      includeMetadata: true,
    });

    console.log(`✓ Report generated successfully`);
    console.log(`  Format: ${format.toUpperCase()}`);
    console.log(`  Location: ${savedPath}`);

    if (templateName) {
      console.log(`  Template: ${templateName}`);
    }
  } catch (error) {
    console.error('Report generation failed:', error);
    process.exit(1);
  }
}

// Execute
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
