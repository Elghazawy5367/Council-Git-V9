/**
 * Reports Module
 * 
 * Modular report generation system with multi-format support
 * 
 * @example
 * ```typescript
 * import { generateAndSaveReport } from '@/lib/reports';
 * 
 * // Generate Markdown report
 * await generateAndSaveReport({ format: 'markdown' });
 * 
 * // Generate PDF report
 * await generateAndSaveReport({ format: 'pdf' });
 * 
 * // Generate custom report
 * const data = await loadScoutData();
 * const report = await generateReport(data, { 
 *   format: 'json',
 *   templateName: 'extended'
 * });
 * ```
 */

// Core types
export * from './types';

// Analysis logic
export * from './analysis';

// Report engine
export * from './engine';

// Generators
export * from './generators';

// Templates (optional, usually internal)
// export * from './templates/markdown';
// export * from './templates/json';
// export * from './templates/pdf';
// export * from './templates/docx';
