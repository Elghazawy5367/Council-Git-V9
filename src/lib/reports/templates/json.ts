/**
 * JSON Report Template
 * 
 * Generates structured JSON reports for programmatic consumption
 */

import { Report } from '../types';

export function renderJsonReport(report: Report): string {
  return JSON.stringify(report, null, 2);
}

export function renderJsonReportCompact(report: Report): string {
  return JSON.stringify(report);
}

export function renderJsonReportExtended(report: Report): string {
  const extended = {
    ...report,
    generatedAt: new Date(report.timestamp).toISOString(),
    format: 'json',
    schema_version: '1.0',
  };

  return JSON.stringify(extended, null, 2);
}
