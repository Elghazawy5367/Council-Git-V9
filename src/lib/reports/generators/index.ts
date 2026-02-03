/**
 * Format Generators
 * 
 * Implements the ReportGenerator interface for each format
 */

import { Report, ReportGenerator, ReportOptions } from '../types';
import { renderMarkdownReport, renderMarkdownReportCompact } from '../templates/markdown';
import { renderJsonReport, renderJsonReportCompact, renderJsonReportExtended } from '../templates/json';
import { renderDocxReport } from '../templates/docx';
import { renderPdfReport } from '../templates/pdf';

/**
 * Markdown Generator
 */
export class MarkdownGenerator implements ReportGenerator {
  format = 'markdown' as const;

  async generate(report: Report, options?: Partial<ReportOptions>): Promise<string> {
    const template = options?.templateName || 'default';

    switch (template) {
      case 'compact':
        return renderMarkdownReportCompact(report);
      case 'default':
      default:
        return renderMarkdownReport(report);
    }
  }
}

/**
 * JSON Generator
 */
export class JsonGenerator implements ReportGenerator {
  format = 'json' as const;

  async generate(report: Report, options?: Partial<ReportOptions>): Promise<string> {
    const template = options?.templateName || 'default';

    switch (template) {
      case 'compact':
        return renderJsonReportCompact(report);
      case 'extended':
        return renderJsonReportExtended(report);
      case 'default':
      default:
        return renderJsonReport(report);
    }
  }
}

/**
 * PDF Generator
 */
export class PdfGenerator implements ReportGenerator {
  format = 'pdf' as const;

  async generate(report: Report, options?: Partial<ReportOptions>): Promise<Buffer> {
    return await renderPdfReport(report);
  }
}

/**
 * DOCX (Word) Generator
 */
export class DocxGenerator implements ReportGenerator {
  format = 'docx' as const;

  async generate(report: Report, options?: Partial<ReportOptions>): Promise<Buffer> {
    return await renderDocxReport(report);
  }
}

/**
 * Generator Factory
 */
export function getGenerator(format: string): ReportGenerator {
  switch (format) {
    case 'markdown':
      return new MarkdownGenerator();
    case 'json':
      return new JsonGenerator();
    case 'pdf':
      return new PdfGenerator();
    case 'docx':
      return new DocxGenerator();
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
