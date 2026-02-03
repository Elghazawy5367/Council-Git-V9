/**
 * Report Engine
 * 
 * Main orchestration layer for report generation
 */

import * as fs from 'fs';
import * as path from 'path';
import { Report, ReportOptions, ScoutData, ReportFormat } from './types';
import { analyzeScoutData } from './analysis';
import { getGenerator } from './generators';

/**
 * Generate a report from scout data
 */
export async function generateReport(
  data: ScoutData,
  options: ReportOptions
): Promise<string | Buffer> {
  // Create report structure
  const report: Report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalOpportunities: data.opportunitiesIdentified || 0,
      highImpact: data.topOpportunities?.filter((o) => o.impact === 'high').length || 0,
      readyToBuild:
        data.topOpportunities?.filter((o) => o.effort === 'low' && o.impact === 'high').length || 0,
    },
    recommendations: [],
    detailedAnalysis: '',
    metadata: options.includeMetadata
      ? {
          generatedBy: 'Council Intelligence System',
          version: '2.0',
          dataSource: options.outputPath || 'scout-data',
        }
      : undefined,
  };

  // Apply analysis logic
  const analysis = analyzeScoutData(data);
  report.recommendations = analysis.recommendations;
  report.detailedAnalysis = analysis.detailedAnalysis;

  // Generate output using appropriate generator
  const generator = getGenerator(options.format);
  return await generator.generate(report, options);
}

/**
 * Generate report from latest scout data file
 */
export async function generateReportFromFile(
  options: Partial<ReportOptions> = {}
): Promise<string | Buffer> {
  const dataDir = path.join(process.cwd(), 'data');
  const reportsDir = path.join(dataDir, 'reports');

  // Find latest scout report
  if (!fs.existsSync(reportsDir)) {
    throw new Error('Reports directory not found');
  }

  const files = fs
    .readdirSync(reportsDir)
    .filter((f) => f.startsWith('scout-') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    throw new Error('No scout data files found');
  }

  const latestFile = path.join(reportsDir, files[0]);
  const scoutData: ScoutData = JSON.parse(fs.readFileSync(latestFile, 'utf-8'));

  // Default options
  const fullOptions: ReportOptions = {
    format: options.format || 'markdown',
    outputPath: options.outputPath,
    templateName: options.templateName || 'default',
    includeMetadata: options.includeMetadata ?? true,
  };

  return await generateReport(scoutData, fullOptions);
}

/**
 * Save report to file
 */
export async function saveReport(
  content: string | Buffer,
  format: ReportFormat,
  outputPath?: string
): Promise<string> {
  const dataDir = path.join(process.cwd(), 'data');
  const intelligenceDir = path.join(dataDir, 'intelligence');

  // Ensure directory exists
  fs.mkdirSync(intelligenceDir, { recursive: true });

  // Determine file path
  const extensions: Record<ReportFormat, string> = {
    markdown: '.md',
    json: '.json',
    pdf: '.pdf',
    docx: '.docx',
  };

  const finalPath =
    outputPath ||
    path.join(intelligenceDir, `report-latest${extensions[format]}`);

  // Write file
  if (Buffer.isBuffer(content)) {
    fs.writeFileSync(finalPath, content);
  } else {
    fs.writeFileSync(finalPath, content, 'utf-8');
  }

  return finalPath;
}

/**
 * Generate and save report (convenience function)
 */
export async function generateAndSaveReport(
  options: Partial<ReportOptions> = {}
): Promise<string> {
  const format = options.format || 'markdown';
  const content = await generateReportFromFile(options);
  const savedPath = await saveReport(content, format, options.outputPath);

  console.log(`✓ Report generated: ${savedPath}`);
  return savedPath;
}
