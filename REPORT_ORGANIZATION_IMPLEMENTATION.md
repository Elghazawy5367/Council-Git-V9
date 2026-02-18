# Report Organization System - Implementation Guide

## Overview

Complete implementation of the report organization and archiving system as specified in the requirements. This system provides:

- **Organized structure**: Reports organized by feature/niche/date
- **Automatic archiving**: Reports >60 days moved to archive
- **Registry indexes**: Fast searchable JSON indexes
- **Latest symlinks**: Quick access to most recent reports
- **Quality tracking**: Metadata and quality scores
- **Automation**: GitHub Actions for daily maintenance

## Quick Start

### 1. First-Time Migration

Migrate existing flat-structure reports to organized structure:

```bash
# Test first with dry-run
npm run reports:organize:dry-run

# Review output, then run actual migration
npm run reports:organize
```

This will:
- Create backup in `data/backup-[timestamp]/`
- Move reports from `{feature}-{niche}-{date}.md` to `{feature}/{niche}/{date}.md`
- Move Phantom Scout reports from `data/intelligence/` to `data/reports/phantom-scout/blue-ocean/`
- Create directory structure
- Generate registry
- Create latest.md symlinks

### 2. Daily Operations

These run automatically via GitHub Actions, but can be triggered manually:

```bash
# Archive old reports (>60 days)
npm run reports:archive

# Generate/update registry
npm run reports:registry
```

## Directory Structure

### Before Migration
```
data/
├── reports/                                    [FLAT - 106 files]
│   ├── stargazer-maritime-professionals-2026-02-16.md
│   ├── stargazer-etsy-sellers-2026-02-17.md
│   └── ... 104 more files ...
└── intelligence/                               [SEPARATE - 32 files]
    ├── blue-ocean-2026-02-16.md
    └── ... 31 more files ...
```

### After Migration
```
data/
├── reports/                                    [ORGANIZED]
│   ├── stargazer/
│   │   ├── maritime-professionals/
│   │   │   ├── 2026-02-17.md
│   │   │   ├── 2026-02-16.md
│   │   │   └── latest.md → 2026-02-17.md      ← Symlink
│   │   ├── freelancers-consultants/
│   │   ├── etsy-sellers/
│   │   └── digital-educators/
│   ├── fork-evolution/
│   ├── goldmine-detector/
│   ├── mining-drill/
│   ├── reddit-sniper/
│   ├── viral-radar/
│   ├── reddit-pain-points/
│   ├── hackernews-intelligence/
│   ├── github-trending/
│   ├── market-gap-identifier/
│   └── phantom-scout/
│       └── blue-ocean/
│           ├── 2026-02-17.md
│           └── latest.md → 2026-02-17.md
│
├── archive/                                    [ARCHIVED >60 days]
│   ├── 2026-01/
│   │   ├── stargazer/
│   │   │   ├── maritime-professionals/
│   │   │   │   ├── 2026-01-31.md
│   │   │   │   └── 2026-01-30.md
│   │   │   └── freelancers-consultants/
│   │   └── fork-evolution/
│   └── 2025-12/
│
└── registry/                                   [INDEXES]
    ├── current.json                            ← All active reports
    └── archive-index.json                      ← Archive history
```

## Registry Format

### current.json
Complete index of all active reports with metadata:

```json
{
  "generated_at": "2026-02-18T18:00:00.000Z",
  "total_reports": 125,
  "by_feature": {
    "stargazer": 8,
    "fork-evolution": 4,
    "reddit-sniper": 18,
    "viral-radar": 22,
    "reddit-pain-points": 10,
    "hackernews-intelligence": 7,
    "github-trending": 5,
    "phantom-scout": 32,
    "goldmine-detector": 0,
    "mining-drill": 0,
    "market-gap-identifier": 0
  },
  "by_niche": {
    "maritime-professionals": 30,
    "freelancers-consultants": 30,
    "etsy-sellers": 25,
    "digital-educators": 20,
    "blue-ocean": 32
  },
  "reports": [
    {
      "feature": "stargazer",
      "niche": "maritime-professionals",
      "date": "2026-02-17",
      "path": "stargazer/maritime-professionals/2026-02-17.md",
      "size_bytes": 9151,
      "quality_score": 85,
      "items_found": 30,
      "status": "complete"
    },
    ...
  ]
}
```

### archive-index.json
History of archived reports:

```json
[
  {
    "original_path": "stargazer/maritime-professionals/2026-01-15.md",
    "archived_path": "2026-01/stargazer/maritime-professionals/2026-01-15.md",
    "archived_at": "2026-02-18T02:00:00.000Z",
    "month": "2026-01"
  },
  ...
]
```

## Features

### 1. Report Manager (`src/lib/report-manager.ts`)

Core library providing:

**ReportManager class:**
```typescript
const manager = new ReportManager();

// Archive reports older than 60 days
await manager.archiveOldReports(dryRun);

// Generate registry/current.json
manager.generateRegistry();

// Create latest.md symlinks
manager.updateLatestSymlinks();

// Get statistics
const stats = manager.getStatistics();
```

**Key methods:**
- `archiveOldReports(dryRun)` - Move old reports to archive
- `generateRegistry()` - Create current.json index
- `updateLatestSymlinks()` - Create/update latest.md links
- `getStatistics()` - Get report statistics
- `ensureDirectories()` - Create directory structure

### 2. Migration Script (`scripts/organize-reports.ts`)

One-time migration from flat to organized structure:

```bash
# Dry run (safe, no changes)
npm run reports:organize:dry-run

# Actual migration
npm run reports:organize
```

**What it does:**
1. Creates backup of all reports
2. Parses flat filenames: `{feature}-{niche}-{date}.md`
3. Creates organized structure: `{feature}/{niche}/{date}.md`
4. Migrates Phantom Scout reports
5. Generates registry
6. Creates symlinks
7. Shows detailed report

**Safety features:**
- Automatic backup before migration
- Dry-run mode for testing
- Validation of file parsing
- Error handling and reporting
- Skip already-organized files

### 3. Archiving Script (`scripts/archive-old-reports.ts`)

Automated archiving of old reports:

```bash
# Dry run
npm run reports:archive:dry-run

# Actual archiving
npm run reports:archive
```

**Archiving rules:**
- Reports >60 days → `data/archive/YYYY-MM/`
- Maintains feature/niche structure
- Updates archive-index.json
- Regenerates registry after archiving

### 4. Registry Script (`scripts/generate-report-registry.ts`)

Generate/update comprehensive indexes:

```bash
npm run reports:registry
```

**Creates:**
- `data/registry/current.json` - All active reports
- Updates `latest.md` symlinks for each niche
- Calculates statistics and quality scores

### 5. GitHub Actions Automation

**Workflow:** `.github/workflows/archive-reports.yml`

```yaml
# Runs daily at 2 AM UTC
schedule:
  - cron: '0 2 * * *'

# Also manually triggerable
workflow_dispatch:
```

**Daily tasks:**
1. Archive reports >60 days
2. Update registry
3. Commit changes automatically

## Quality Scoring

Reports are automatically scored 0-100 based on:

| Criteria | Points |
|----------|--------|
| Base score (file size >1KB) | 50 |
| Has sections (##) | +10 |
| Has subsections (###) | +5 |
| Has lists (- or *) | +10 |
| Has bold text (**) | +5 |
| Has links (http) | +5 |
| Large file (>5KB) | +15 |

**Status categories:**
- `complete` - Size >1KB, good content
- `partial` - Size 300B-1KB
- `insufficient_data` - Size <300B (usually DNS blocked)
- `unknown` - Cannot determine

## NPM Scripts

All report management commands:

```bash
# Migration (one-time)
npm run reports:organize              # Migrate to new structure
npm run reports:organize:dry-run      # Test migration

# Daily operations (automated)
npm run reports:archive               # Archive old reports
npm run reports:archive:dry-run       # Test archiving
npm run reports:registry              # Generate registry

# Individual features (existing)
npm run stargazer                     # Run stargazer analysis
npm run fork-evolution                # Run fork evolution
npm run hackernews                    # Run HackerNews intelligence
# ... etc for all features
```

## Usage Examples

### Find Latest Report for a Niche

```bash
# Via symlink
cat data/reports/stargazer/etsy-sellers/latest.md

# Via registry
jq '.reports[] | select(.feature=="stargazer" and .niche=="etsy-sellers") | .path' \
  data/registry/current.json | head -1
```

### Get All Reports for a Feature

```bash
jq '.reports[] | select(.feature=="stargazer")' data/registry/current.json
```

### Check Quality Scores

```bash
jq '.reports[] | {feature, niche, quality_score} | select(.quality_score < 50)' \
  data/registry/current.json
```

### Find Reports by Date

```bash
jq '.reports[] | select(.date >= "2026-02-01")' data/registry/current.json
```

## Workflow Integration

Update feature workflows to use new structure:

**Before:**
```yaml
run: npx tsx scripts/analyze-stargazers.ts
# Writes to: data/reports/stargazer-{niche}-{date}.md
```

**After:**
```yaml
run: npx tsx scripts/analyze-stargazers.ts
# Writes to: data/reports/stargazer/{niche}/{date}.md

# Then update registry
run: npx tsx scripts/generate-report-registry.ts
```

## Troubleshooting

### Migration Issues

**Problem:** Files not migrating
**Solution:** Check filename format matches `{feature}-{niche}-{date}.md`

**Problem:** Parsing errors
**Solution:** Run with `--dry-run` first, check error messages

### Symlink Issues

**Problem:** Symlinks not working on Windows
**Solution:** Requires administrator privileges or developer mode

**Problem:** Broken symlinks
**Solution:** Run `npm run reports:registry` to recreate all

### Archive Issues

**Problem:** Reports not archiving
**Solution:** Check date threshold (60 days), run with `--dry-run`

**Problem:** Archive directory growing too large
**Solution:** Implement compression (future enhancement)

## Future Enhancements

Possible additions:

1. **Compression** - Compress archives >1 year old
2. **Search CLI** - Command-line tool for finding reports
3. **Monthly summaries** - Aggregate monthly intelligence
4. **Quality dashboard** - Web interface for statistics
5. **External backup** - S3/Cloud storage integration
6. **Report comparison** - Diff between dates
7. **Alerting** - Notify on quality drops

## Testing

### Test Migration
```bash
# Safe dry-run
npm run reports:organize:dry-run

# Check output for errors
# Verify file count matches
```

### Test Archiving
```bash
# Safe dry-run
npm run reports:archive:dry-run

# Verify which files would be archived
# Check dates are correct (>60 days)
```

### Test Registry
```bash
# Generate registry
npm run reports:registry

# Verify JSON is valid
jq '.' data/registry/current.json

# Check totals match actual files
find data/reports -name "*.md" | grep -v latest.md | wc -l
```

## Status

✅ **Implementation Complete**
- Core library implemented
- Migration script ready
- Archiving automation ready
- Registry generation ready
- GitHub Actions workflow configured
- NPM scripts added
- Documentation complete

**Next Steps:**
1. Run migration on production data
2. Monitor automated archiving
3. Update feature workflows
4. Add search/find utilities

## Support

For issues or questions:
1. Check this guide
2. Review error messages
3. Use `--dry-run` mode for testing
4. Check GitHub Actions logs
5. Review backup before migration

---

**Last Updated:** February 18, 2026
**Version:** 1.0.0
**Status:** Production Ready
