# Report Generation System - Documentation

## Overview

The report generation system has been refactored into a modular architecture that separates concerns, improves maintainability, and adds support for multiple output formats.

## Architecture

### Directory Structure

```
src/lib/reports/
├── index.ts                    # Module exports
├── types.ts                    # TypeScript type definitions
├── analysis.ts                 # Intelligence analysis logic (preserved)
├── engine.ts                   # Report orchestration
├── generators/
│   └── index.ts               # Format generators (JSON, MD, PDF, DOCX)
└── templates/
    ├── markdown.ts            # Markdown templates
    ├── json.ts                # JSON templates
    ├── pdf.ts                 # PDF templates (jsPDF)
    └── docx.ts                # Word templates (docx library)
```

### Key Components

#### 1. Type System (`types.ts`)

Comprehensive TypeScript definitions for type safety:

- `ScoutData` - Input data structure from scout
- `Report` - Output report structure
- `ReportFormat` - Supported formats: `json`, `markdown`, `pdf`, `docx`
- `ReportOptions` - Configuration options
- `ReportGenerator` - Generator interface

#### 2. Analysis Engine (`analysis.ts`)

**Preserved unique intelligence logic:**

- `generateRecommendations(data)` - Creates actionable recommendations
- `generateAnalysis(data)` - Produces detailed market analysis
- `analyzeScoutData(data)` - Main analysis orchestrator

**Key Features:**
- Priority-based recommendations
- Trend detection and analysis
- Quick wins identification (high impact + low effort)
- Market maturity insights
- Competition analysis

#### 3. Report Engine (`engine.ts`)

Main orchestration layer:

- `generateReport(data, options)` - Generate report from data
- `generateReportFromFile(options)` - Load latest scout data and generate
- `saveReport(content, format, path)` - Save report to file
- `generateAndSaveReport(options)` - Convenience function (generate + save)

#### 4. Format Generators (`generators/`)

Implements `ReportGenerator` interface for each format:

- **MarkdownGenerator** - Markdown reports
- **JsonGenerator** - JSON reports  
- **PdfGenerator** - PDF reports (jsPDF)
- **DocxGenerator** - Word documents (docx)

Each generator supports multiple template variants.

#### 5. Templates (`templates/`)

Format-specific rendering functions:

**Markdown:**
- `renderMarkdownReport()` - Full formatted report
- `renderMarkdownReportCompact()` - Compact version

**JSON:**
- `renderJsonReport()` - Pretty-printed JSON
- `renderJsonReportCompact()` - Minified JSON
- `renderJsonReportExtended()` - With extra metadata

**PDF:**
- `renderPdfReport()` - Professional PDF with proper pagination
- Supports headings, bullets, and formatted text

**DOCX:**
- `renderDocxReport()` - Word document with proper styling
- Headings, bullet lists, metadata section

## Usage

### Command Line

```bash
# Generate Markdown report (default)
npx tsx src/lib/report-generator.ts

# Generate PDF report
npx tsx src/lib/report-generator.ts --format=pdf

# Generate Word document
npx tsx src/lib/report-generator.ts --format=docx

# Generate JSON report
npx tsx src/lib/report-generator.ts --format=json

# Custom output path
npx tsx src/lib/report-generator.ts --format=pdf --output=./my-report.pdf

# Use compact template
npx tsx src/lib/report-generator.ts --format=markdown --template=compact
```

### Programmatic API

```typescript
import { generateAndSaveReport, generateReport } from '@/lib/reports';

// Simple usage - generate and save
await generateAndSaveReport({ 
  format: 'pdf',
  templateName: 'default'
});

// Advanced usage - custom data
import { ScoutData } from '@/lib/reports/types';

const data: ScoutData = {
  opportunitiesIdentified: 20,
  repositoriesScanned: 100,
  painPointsFound: 50,
  topOpportunities: [
    {
      solution: 'Build X',
      impact: 'high',
      effort: 'low',
      painPoint: 'Users struggle with Y'
    }
  ],
  trendsDetected: ['AI', 'Cloud']
};

const report = await generateReport(data, {
  format: 'json',
  includeMetadata: true
});

console.log(report);
```

### Custom Templates

```typescript
import { Report, ReportTemplate } from '@/lib/reports/types';

const customTemplate: ReportTemplate = {
  name: 'custom',
  format: 'markdown',
  render: (report: Report) => {
    return `# ${report.summary.totalOpportunities} Opportunities Found!\n\n` +
           `Generated: ${report.timestamp}\n\n` +
           report.recommendations.map(r => `- ${r}`).join('\n');
  }
};

// Use custom template
const report = await generateReport(data, {
  format: 'markdown',
  customTemplate
});
```

## Output Formats

### Markdown (.md)

**Location:** `data/intelligence/report-latest.md`

**Features:**
- Clean, readable format
- GitHub-flavored markdown
- Headings, lists, bold text
- Easy to version control

**Templates:**
- `default` - Full report with all sections
- `compact` - Brief summary version

### JSON (.json)

**Location:** `data/intelligence/report-latest.json`

**Features:**
- Machine-readable
- Easy to parse programmatically
- Can be consumed by other tools
- Version control friendly

**Templates:**
- `default` - Pretty-printed (2 spaces)
- `compact` - Minified
- `extended` - With extra metadata fields

### PDF (.pdf)

**Location:** `data/intelligence/report-latest.pdf`

**Features:**
- Professional appearance
- Print-ready
- Fixed layout
- Portable

**Implementation:**
- Uses jsPDF library
- Multi-page support with auto page breaks
- Formatted headings, bullets
- Bold text support

### Word Document (.docx)

**Location:** `data/intelligence/report-latest.docx`

**Features:**
- Editable in Microsoft Word
- Professional formatting
- Heading levels
- Bullet lists

**Implementation:**
- Uses docx library
- Proper heading hierarchy
- Spacing and alignment
- Metadata section

## Report Structure

All reports follow this structure:

```typescript
{
  timestamp: string,           // ISO 8601 timestamp
  summary: {
    totalOpportunities: number,
    highImpact: number,
    readyToBuild: number
  },
  recommendations: string[],   // Actionable items
  detailedAnalysis: string,    // Markdown-formatted analysis
  metadata?: {                 // Optional
    generatedBy: string,
    version: string,
    dataSource: string
  }
}
```

## Analysis Logic

### Recommendation Generation

The system generates intelligent recommendations based on:

1. **Priority opportunities** - Highest impact solutions
2. **Trend detection** - Emerging patterns
3. **Quick wins** - Low effort + high impact
4. **Pain point context** - What problems are addressed

### Market Analysis

Produces detailed analysis including:

1. **Context** - Repositories scanned, pain points found
2. **Key findings** - Impact/effort breakdown
3. **Top opportunities** - Best 3 with details
4. **Trend analysis** - Emerging patterns with mentions

### Additional Insights

Automatically generated insights:

- Market maturity indicators
- Competition density analysis
- Opportunity concentration

## Migration Guide

### From Old System

**Before:**
```typescript
// Old hardcoded approach
import { generateReport } from './report-generator';

generateReport(); // Only markdown, no options
```

**After:**
```typescript
// New modular approach
import { generateAndSaveReport } from '@/lib/reports';

// Multiple formats available
await generateAndSaveReport({ format: 'pdf' });
await generateAndSaveReport({ format: 'docx' });
await generateAndSaveReport({ format: 'json' });
```

### Key Improvements

1. **Separation of Concerns**
   - Analysis logic isolated
   - Templates separated from generators
   - Types defined independently

2. **Extensibility**
   - Easy to add new formats
   - Custom templates supported
   - Template variants available

3. **Type Safety**
   - Full TypeScript coverage
   - Interfaces for all components
   - Generics where appropriate

4. **Maintainability**
   - Single responsibility per module
   - Clear dependencies
   - Well-documented code

## Configuration

### Environment Variables

No environment variables currently required.

### Default Paths

- **Input:** `data/reports/scout-*.json` (latest)
- **Output:** `data/intelligence/report-latest.[ext]`

### Customizing Output

```typescript
await generateAndSaveReport({
  format: 'pdf',
  outputPath: './custom-path/my-report.pdf',
  templateName: 'compact',
  includeMetadata: false
});
```

## Error Handling

The system provides clear error messages:

```typescript
try {
  await generateAndSaveReport({ format: 'pdf' });
} catch (error) {
  if (error.message.includes('not found')) {
    console.log('No scout data available');
  } else {
    console.error('Generation failed:', error);
  }
}
```

Common errors:
- `Reports directory not found` - Run scout first
- `No scout data files found` - Generate scout data
- `Invalid format` - Use: json, markdown, pdf, or docx

## Performance

### Generation Times

Approximate times (measured on test data):

- **JSON:** <100ms (instant)
- **Markdown:** <100ms (instant)
- **PDF:** ~200ms (rendering overhead)
- **DOCX:** ~300ms (document creation)

### File Sizes

Typical sizes for sample report:

- **JSON:** 1.6KB
- **Markdown:** 1.4KB
- **PDF:** 8.1KB
- **DOCX:** 8.4KB

## Dependencies

### Required

- `docx@^9.5.1` - Word document generation (already installed)
- `jspdf@^2.5.2` - PDF generation (newly installed)

### Optional

None - all features work with base dependencies.

## Troubleshooting

### TypeScript Errors

Run type check:
```bash
npm run typecheck
```

All types should pass without errors.

### Missing Data

Ensure scout has run:
```bash
npm run scout
```

This creates the data files in `data/reports/`.

### PDF Font Issues

jsPDF uses built-in fonts. For custom fonts, see jsPDF documentation.

### DOCX Styling

Modify `src/lib/reports/templates/docx.ts` to customize:
- Heading levels
- Spacing
- Fonts
- Colors

## Future Enhancements

Possible additions:

1. **HTML format** - Web-viewable reports
2. **Excel/CSV** - Data-focused exports
3. **Email templates** - Direct email integration
4. **Charts/graphs** - Visual data representation
5. **Custom themes** - Branded reports
6. **Batch generation** - Multiple reports at once
7. **Incremental updates** - Diff-based reports

## Contributing

To add a new format:

1. Create template in `templates/[format].ts`
2. Implement generator in `generators/index.ts`
3. Add format to `ReportFormat` type in `types.ts`
4. Update documentation

Example:
```typescript
// templates/html.ts
export function renderHtmlReport(report: Report): string {
  return `<html>...</html>`;
}

// generators/index.ts
export class HtmlGenerator implements ReportGenerator {
  format = 'html' as const;
  async generate(report: Report): Promise<string> {
    return renderHtmlReport(report);
  }
}
```

## Support

For issues or questions:

1. Check this documentation
2. Review TypeScript types in `types.ts`
3. Examine example reports in `data/intelligence/`
4. Test with: `npx tsx src/lib/report-generator.ts`

---

**Version:** 2.0  
**Last Updated:** 2026-02-03  
**Status:** Production Ready  
**Maintained By:** Council Intelligence System
