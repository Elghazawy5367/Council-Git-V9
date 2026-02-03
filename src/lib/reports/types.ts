/**
 * Report System Type Definitions
 * 
 * Core types for the modular report generation system
 */

/**
 * Scout data structure (input)
 */
export interface ScoutData {
  opportunitiesIdentified?: number;
  repositoriesScanned?: number;
  painPointsFound?: number;
  trendsDetected?: string[];
  topOpportunities?: Array<{
    solution: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
    description?: string;
    painPoint?: string;
  }>;
  [key: string]: any; // Allow additional properties
}

/**
 * Report structure (output)
 */
export interface Report {
  timestamp: string;
  summary: ReportSummary;
  recommendations: string[];
  detailedAnalysis: string;
  metadata?: ReportMetadata;
}

export interface ReportSummary {
  totalOpportunities: number;
  highImpact: number;
  readyToBuild: number;
}

export interface ReportMetadata {
  generatedBy?: string;
  version?: string;
  dataSource?: string;
}

/**
 * Report format types
 */
export type ReportFormat = 'json' | 'markdown' | 'pdf' | 'docx';

/**
 * Report generation options
 */
export interface ReportOptions {
  format: ReportFormat;
  outputPath?: string;
  templateName?: string;
  customTemplate?: ReportTemplate;
  includeMetadata?: boolean;
}

/**
 * Template configuration
 */
export interface ReportTemplate {
  name: string;
  format: ReportFormat;
  render: (report: Report) => string | Buffer | Promise<Buffer>;
}

/**
 * Report generator interface
 */
export interface ReportGenerator {
  format: ReportFormat;
  generate(report: Report, options?: Partial<ReportOptions>): Promise<string | Buffer>;
}

/**
 * Analysis result for internal use
 */
export interface AnalysisResult {
  recommendations: string[];
  detailedAnalysis: string;
  insights: string[];
}
