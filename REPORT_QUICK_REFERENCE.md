# Report System - Quick Reference

## Generate Reports

### Command Line

```bash
# Markdown (default)
npx tsx src/lib/report-generator.ts

# PDF
npx tsx src/lib/report-generator.ts --format=pdf

# Word Document
npx tsx src/lib/report-generator.ts --format=docx

# JSON
npx tsx src/lib/report-generator.ts --format=json

# Custom path
npx tsx src/lib/report-generator.ts --format=pdf --output=./report.pdf

# Compact template
npx tsx src/lib/report-generator.ts --template=compact
```

## Programmatic Usage

### Basic

```typescript
import { generateAndSaveReport } from '@/lib/reports';

// Generate PDF
await generateAndSaveReport({ format: 'pdf' });

// Generate JSON with compact template
await generateAndSaveReport({ 
  format: 'json',
  templateName: 'compact'
});
```

### Advanced

```typescript
import { generateReport, saveReport } from '@/lib/reports';
import { ScoutData } from '@/lib/reports/types';

// Custom data
const data: ScoutData = {
  opportunitiesIdentified: 25,
  topOpportunities: [
    { solution: 'Tool X', impact: 'high', effort: 'low' }
  ]
};

// Generate report
const content = await generateReport(data, {
  format: 'markdown',
  includeMetadata: true
});

// Save to custom location
await saveReport(content, 'markdown', './my-report.md');
```

## Supported Formats

| Format | Extension | Size | Speed |
|--------|-----------|------|-------|
| Markdown | `.md` | ~1.4KB | Instant |
| JSON | `.json` | ~1.6KB | Instant |
| PDF | `.pdf` | ~8KB | 200ms |
| Word | `.docx` | ~8KB | 300ms |

## Templates

### Markdown
- `default` - Full report
- `compact` - Brief summary

### JSON
- `default` - Pretty-printed
- `compact` - Minified
- `extended` - With metadata

### PDF
- `default` - Professional layout

### DOCX
- `default` - Word document

## File Locations

**Input:** `data/reports/scout-*.json` (latest)
**Output:** `data/intelligence/report-latest.[ext]`

## Report Structure

```typescript
{
  timestamp: "2026-02-03T...",
  summary: {
    totalOpportunities: 20,
    highImpact: 9,
    readyToBuild: 5
  },
  recommendations: [
    "Priority 1: Build tool X",
    "Watch trend: AI automation"
  ],
  detailedAnalysis: "## Market Analysis\n\n...",
  metadata: {
    generatedBy: "Council Intelligence System",
    version: "2.0"
  }
}
```

## Common Tasks

### Add New Format

1. Create template: `templates/[format].ts`
2. Add generator: `generators/index.ts`
3. Update types: Add to `ReportFormat`

### Custom Template

```typescript
const custom: ReportTemplate = {
  name: 'brief',
  format: 'markdown',
  render: (report) => `# ${report.summary.totalOpportunities} Found!`
};

await generateReport(data, { 
  format: 'markdown',
  customTemplate: custom 
});
```

### Batch Generation

```typescript
const formats = ['markdown', 'json', 'pdf', 'docx'];

for (const format of formats) {
  await generateAndSaveReport({ format });
}
```

## Troubleshooting

### No data found
```bash
# Generate scout data first
npm run scout
```

### TypeScript errors
```bash
npm run typecheck
```

### Test generation
```bash
npx tsx src/lib/report-generator.ts
ls -lh data/intelligence/
```

## API Reference

### Functions

**generateReport(data, options)**
- Input: ScoutData, ReportOptions
- Output: string | Buffer
- Purpose: Generate report from data

**generateReportFromFile(options)**
- Input: Partial<ReportOptions>
- Output: string | Buffer
- Purpose: Load latest scout data and generate

**saveReport(content, format, path)**
- Input: string | Buffer, ReportFormat, string?
- Output: string (saved path)
- Purpose: Save report to file

**generateAndSaveReport(options)**
- Input: Partial<ReportOptions>
- Output: string (saved path)
- Purpose: Generate and save in one step

### Types

**ScoutData** - Input data structure
**Report** - Output report structure
**ReportFormat** - 'json' | 'markdown' | 'pdf' | 'docx'
**ReportOptions** - Configuration options
**ReportTemplate** - Custom template definition

## Examples

### Email Integration

```typescript
import { generateReport } from '@/lib/reports';
import { sendEmail } from './email';

const report = await generateReport(data, { 
  format: 'markdown',
  templateName: 'compact'
});

await sendEmail({
  subject: 'Intelligence Report',
  body: report
});
```

### Dashboard Display

```typescript
import { generateReportFromFile } from '@/lib/reports';

const json = await generateReportFromFile({ 
  format: 'json' 
});

const report = JSON.parse(json);
displayDashboard(report.summary);
```

### Automated Reports

```typescript
import { generateAndSaveReport } from '@/lib/reports';
import cron from 'node-cron';

// Daily PDF report at 9 AM
cron.schedule('0 9 * * *', async () => {
  await generateAndSaveReport({ format: 'pdf' });
});
```

## Performance Tips

1. Use JSON for programmatic access (fastest)
2. Use Markdown for version control
3. Generate PDF/DOCX only when needed
4. Cache report content if rendering multiple times
5. Use compact templates for quick summaries

---

For complete documentation, see [REPORT_SYSTEM_DOCS.md](./REPORT_SYSTEM_DOCS.md)
