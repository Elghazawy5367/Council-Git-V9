# Report Organization & Archiving System Proposal

**Date:** February 18, 2026  
**Status:** Proposal for Implementation  
**Current Reports:** 125 files across 42 days

---

## Executive Summary

This document proposes a comprehensive reorganization of the intelligence report storage system to improve navigation, searchability, and implement automated archiving.

### Current Problems

1. **Flat Directory Structure** - All 106+ reports in single directory
2. **Difficult Navigation** - Hard to find specific feature or niche reports
3. **No Archiving** - Old reports accumulate, no cleanup strategy
4. **Inconsistent Structure** - Some features use `data/intelligence/`, others use `data/reports/`
5. **Growing File Count** - Directory browsing becomes slower over time

### Proposed Solution

Implement a **Hybrid Feature-First with Time-Based Archiving** system that combines the best of feature organization, date filtering, and automated cleanup.

---

## Visual Diagrams

### Current Structure (Before)

```
data/
├── reports/                                  [106 files, flat]
│   ├── stargazer-etsy-sellers-2026-02-16.md
│   ├── stargazer-maritime-professionals-2026-02-17.md
│   ├── fork-evolution-freelancers-consultants-2026-02-17.md
│   ├── mining-drill-etsy-sellers-2026-02-15.md
│   ├── hackernews-etsy-sellers-2026-02-16.md
│   ├── reddit-sniper-maritime-professionals-2026-02-17.md
│   ├── viral-radar-freelancers-consultants-2026-02-16.md
│   └── ... (100+ more files)
│
└── intelligence/                             [32 files, separate]
    ├── blue-ocean-2026-01-07.md
    ├── blue-ocean-2026-02-17.md
    └── ... (30+ more files)

❌ PROBLEMS:
- Hard to find specific feature reports
- Can't easily browse by niche
- No date organization
- Inconsistent directory usage
- No archiving strategy
```

---

### Proposed Structure (After) - OPTION A: Feature-First

```
data/
├── reports/
│   ├── active/                               [Last 60 days]
│   │   │
│   │   ├── stargazer-analysis/
│   │   │   ├── etsy-sellers/
│   │   │   │   ├── 2026-02/
│   │   │   │   │   ├── 16.md                 (shortened names)
│   │   │   │   │   └── 17.md
│   │   │   │   └── 2026-01/
│   │   │   │       └── 20.md
│   │   │   │
│   │   │   ├── freelancers-consultants/
│   │   │   │   └── 2026-02/
│   │   │   │       └── 17.md
│   │   │   │
│   │   │   ├── maritime-professionals/
│   │   │   │   └── 2026-02/
│   │   │   │       ├── 16.md
│   │   │   │       └── 17.md
│   │   │   │
│   │   │   └── digital-educators/
│   │   │       └── 2026-02/
│   │   │           └── 16.md
│   │   │
│   │   ├── fork-evolution/
│   │   │   ├── etsy-sellers/
│   │   │   ├── freelancers-consultants/
│   │   │   └── maritime-professionals/
│   │   │
│   │   ├── mining-drill/
│   │   │   └── (by niche)
│   │   │
│   │   ├── goldmine-detector/
│   │   │   └── (by niche)
│   │   │
│   │   ├── hackernews-intelligence/
│   │   │   └── (by niche)
│   │   │
│   │   ├── reddit-sniper/
│   │   │   └── (by niche)
│   │   │
│   │   ├── reddit-pain-points/
│   │   │   └── (by niche)
│   │   │
│   │   ├── viral-radar/
│   │   │   └── (by niche)
│   │   │
│   │   ├── github-trending/
│   │   │   └── (by niche)
│   │   │
│   │   ├── phantom-scout/
│   │   │   └── 2026-02/
│   │   │       ├── 01.md
│   │   │       ├── 17.md
│   │   │       └── ...
│   │   │
│   │   └── market-gap-identifier/
│   │       └── (comprehensive reports)
│   │
│   └── meta/
│       ├── index.json                        (searchable index)
│       └── latest.json                       (latest reports cache)
│
└── archive/
    ├── 2026/
    │   ├── 01-january/                       [Older than 60 days]
    │   │   ├── stargazer-analysis/
    │   │   ├── fork-evolution/
    │   │   └── ...
    │   │
    │   └── 02-february/                      [Auto-archived monthly]
    │       └── (same structure)
    │
    ├── 2025/
    │   └── 12-december/
    │
    └── archive-index.json                    (searchable archive index)

✅ BENEFITS:
✓ Easy to find all reports for a feature
✓ Organized by niche within each feature
✓ Monthly folders for date filtering
✓ Automatic archiving after 60 days
✓ Searchable indexes for fast lookup
✓ Consistent structure across all features
```

---

### Proposed Structure - OPTION B: Date-First

```
data/
├── reports/
│   ├── active/                               [Last 60 days]
│   │   │
│   │   ├── 2026-02/
│   │   │   ├── week-1/                       (Feb 1-7)
│   │   │   ├── week-2/                       (Feb 8-14)
│   │   │   └── week-3/                       (Feb 15-21)
│   │   │       ├── stargazer/
│   │   │       │   ├── etsy-sellers-16.md
│   │   │       │   └── maritime-17.md
│   │   │       ├── fork-evolution/
│   │   │       ├── hackernews/
│   │   │       └── ...
│   │   │
│   │   └── 2026-01/
│   │       ├── week-1/
│   │       ├── week-2/
│   │       ├── week-3/
│   │       └── week-4/
│   │
│   └── meta/
│       └── index-by-feature.json
│
└── archive/
    └── (same monthly structure)

✅ BENEFITS:
✓ Easy to see all activity for a time period
✓ Good for timeline analysis
✓ Natural archiving by month

❌ DRAWBACKS:
✗ Harder to find all reports for one feature
✗ Need to search multiple date folders
✗ Not aligned with feature-based workflows
```

---

### Proposed Structure - OPTION C: Hybrid (RECOMMENDED)

```
data/
├── reports/
│   │
│   ├── by-feature/                           [Symlinks to active/]
│   │   ├── stargazer-analysis -> ../active/stargazer-analysis/
│   │   ├── fork-evolution -> ../active/fork-evolution/
│   │   └── ...
│   │
│   ├── by-date/                              [Symlinks to active/]
│   │   ├── 2026-02 -> [points to all Feb files]
│   │   └── 2026-01 -> [points to all Jan files]
│   │
│   ├── active/                               [Actual files - Last 60 days]
│   │   ├── stargazer-analysis/
│   │   │   └── (feature structure from Option A)
│   │   ├── fork-evolution/
│   │   └── ...
│   │
│   └── meta/
│       ├── index.json                        (all reports index)
│       ├── by-feature.json                   (feature index)
│       ├── by-date.json                      (date index)
│       ├── by-niche.json                     (niche index)
│       └── latest.json                       (last 7 days)
│
└── archive/
    ├── 2026/
    │   ├── Q1/
    │   │   ├── 01-january/
    │   │   └── 02-february/
    │   └── Q2/
    │
    ├── compressed/
    │   ├── 2025-Q4.tar.gz                    [Older than 1 year]
    │   └── archive-manifest.json
    │
    └── meta/
        └── archive-index.json

✅ BENEFITS:
✓ Multiple navigation paths (feature, date, niche)
✓ Feature-first actual storage
✓ Flexible querying via indexes
✓ Compressed long-term storage
✓ Best of all worlds

⚠️ COMPLEXITY:
~ Requires maintenance scripts
~ Symlinks may not work on all systems
~ Multiple indexes to update
```

---

## Comparison Matrix

| Feature | Option A: Feature-First | Option B: Date-First | Option C: Hybrid |
|---------|------------------------|----------------------|------------------|
| **Find all reports for feature** | ⭐⭐⭐ Excellent | ⭐ Poor | ⭐⭐⭐ Excellent |
| **Find all reports for date** | ⭐⭐ Good | ⭐⭐⭐ Excellent | ⭐⭐⭐ Excellent |
| **Find all reports for niche** | ⭐⭐ Good | ⭐ Poor | ⭐⭐⭐ Excellent |
| **Timeline analysis** | ⭐⭐ Good | ⭐⭐⭐ Excellent | ⭐⭐⭐ Excellent |
| **Feature analysis** | ⭐⭐⭐ Excellent | ⭐ Poor | ⭐⭐⭐ Excellent |
| **Implementation complexity** | ⭐⭐⭐ Simple | ⭐⭐⭐ Simple | ⭐⭐ Moderate |
| **Maintenance overhead** | ⭐⭐⭐ Low | ⭐⭐⭐ Low | ⭐⭐ Moderate |
| **Storage efficiency** | ⭐⭐⭐ Good | ⭐⭐⭐ Good | ⭐⭐ Good |
| **Search speed** | ⭐⭐ Moderate | ⭐⭐ Moderate | ⭐⭐⭐ Fast |
| **Archiving ease** | ⭐⭐⭐ Easy | ⭐⭐⭐ Easy | ⭐⭐⭐ Easy |
| **Total Score** | 24/30 | 19/30 | 27/30 |

---

## Recommendation: **Option A with Enhancements**

### Why Option A?

1. **Aligned with Workflows** - Features are the primary unit of work
2. **Simpler Implementation** - No symlinks, straightforward structure
3. **Easy Maintenance** - Clear organization, low overhead
4. **Good Balance** - Handles most use cases well
5. **JSON Indexes** - Can add Option C benefits without complexity

### Enhanced Option A Structure

```
data/
├── reports/
│   ├── active/                               [Last 60 days - ~120 files]
│   │   ├── stargazer-analysis/
│   │   │   ├── etsy-sellers/
│   │   │   │   └── 2026-02/
│   │   │   │       └── 16.md
│   │   │   ├── freelancers-consultants/
│   │   │   ├── maritime-professionals/
│   │   │   └── digital-educators/
│   │   │
│   │   ├── fork-evolution/
│   │   ├── mining-drill/
│   │   ├── goldmine-detector/
│   │   ├── hackernews-intelligence/
│   │   ├── reddit-sniper/
│   │   ├── reddit-pain-points/
│   │   ├── viral-radar/
│   │   ├── github-trending/
│   │   ├── phantom-scout/
│   │   │   └── 2026-02/
│   │   │       └── 17.md               (no niche subdirs)
│   │   └── market-gap-identifier/
│   │
│   └── meta/
│       ├── index.json                        [Full searchable index]
│       ├── latest.json                       [Last 7 days quick access]
│       └── stats.json                        [Report statistics]
│
├── archive/
│   ├── 2026/
│   │   ├── 01-january/                       [60+ days old]
│   │   │   ├── stargazer-analysis/
│   │   │   │   └── (same structure)
│   │   │   └── ...
│   │   │
│   │   └── 02-february/                      [Will archive after Mar 18]
│   │       └── (same structure)
│   │
│   ├── 2025/
│   │   └── 12-december/
│   │
│   └── meta/
│       └── archive-index.json                [Archived reports index]
│
└── intelligence/                              [Consolidated here]
    └── opportunities/
        └── (JSON data files)
```

---

## Archiving Strategy

### Automatic Archiving Rules

1. **Age-Based Archiving**
   - Reports older than 60 days → Move to archive/
   - Archive structure: `archive/YYYY/MM-month-name/`
   - Maintains same feature/niche hierarchy

2. **Compression**
   - Reports older than 1 year → Compress to `.tar.gz`
   - Location: `archive/compressed/YYYY-QX.tar.gz`
   - Keep manifest JSON for reference

3. **Deletion**
   - Compressed archives older than 2 years → Optional deletion
   - Requires manual confirmation
   - Backup to external storage first

### Archiving Workflow

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  New Report Generated                               │
│  ↓                                                  │
│  Saved to: active/[feature]/[niche]/YYYY-MM/DD.md  │
│                                                     │
└─────────────────────────────────────────────────────┘
                    ↓
                    │ (Daily Check)
                    ↓
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Age Check: Is report > 60 days old?                │
│  │                                                  │
│  ├─ NO → Keep in active/                           │
│  │                                                  │
│  └─ YES → Move to archive/YYYY/MM-month/           │
│            Update archive-index.json                │
│                                                     │
└─────────────────────────────────────────────────────┘
                    ↓
                    │ (Monthly Check)
                    ↓
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Age Check: Is archive folder > 1 year old?        │
│  │                                                  │
│  ├─ NO → Keep as monthly folder                    │
│  │                                                  │
│  └─ YES → Compress to YYYY-QX.tar.gz               │
│            Create manifest                          │
│            Remove original files                    │
│                                                     │
└─────────────────────────────────────────────────────┘
                    ↓
                    │ (Yearly Check)
                    ↓
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Age Check: Is compressed archive > 2 years old?   │
│  │                                                  │
│  ├─ NO → Keep compressed                           │
│  │                                                  │
│  └─ YES → Backup to external storage               │
│            Optionally delete after confirmation     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Index File Formats

### meta/index.json
```json
{
  "generated": "2026-02-18T17:30:00Z",
  "total_reports": 106,
  "reports": [
    {
      "id": "stargazer-etsy-2026-02-16",
      "feature": "stargazer-analysis",
      "niche": "etsy-sellers",
      "date": "2026-02-16",
      "path": "active/stargazer-analysis/etsy-sellers/2026-02/16.md",
      "size_kb": 9.4,
      "repos_analyzed": 30,
      "quality_score": 65
    }
  ],
  "by_feature": {
    "stargazer-analysis": 8,
    "fork-evolution": 4,
    "phantom-scout": 32
  },
  "by_niche": {
    "etsy-sellers": 23,
    "freelancers-consultants": 19,
    "maritime-professionals": 15
  },
  "by_month": {
    "2026-02": 78,
    "2026-01": 28
  }
}
```

### meta/latest.json
```json
{
  "generated": "2026-02-18T17:30:00Z",
  "last_7_days": [
    {
      "date": "2026-02-17",
      "reports": [
        "stargazer-etsy-2026-02-17",
        "fork-evolution-freelancers-2026-02-17"
      ]
    }
  ],
  "latest_by_feature": {
    "stargazer-analysis": "active/stargazer-analysis/etsy-sellers/2026-02/17.md",
    "phantom-scout": "active/phantom-scout/2026-02/17.md"
  }
}
```

---

## Migration Plan

### Phase 1: Preparation (Week 1)
- [ ] Create backup of current data/
- [ ] Create new directory structure
- [ ] Develop migration script
- [ ] Test on sample data

### Phase 2: Migration (Week 2)
- [ ] Run migration script for all reports
- [ ] Generate index files
- [ ] Verify all files moved correctly
- [ ] Update documentation

### Phase 3: Feature Updates (Week 3)
- [ ] Update all intelligence features to use new structure
- [ ] Update workflows to save to new locations
- [ ] Test each feature end-to-end

### Phase 4: Archiving Setup (Week 4)
- [ ] Create archiving automation script
- [ ] Schedule daily archiving check
- [ ] Set up monitoring/alerts
- [ ] Document archiving procedures

---

## Benefits Summary

### For Users
✅ **Faster Navigation** - Find reports by feature, niche, or date  
✅ **Better Organization** - Logical hierarchy, not flat mess  
✅ **Quick Access** - Latest reports index for fast lookup  
✅ **Historical Data** - Archived reports still searchable  

### For System
✅ **Reduced Active Directory Size** - Only 60 days in active/  
✅ **Better Performance** - Smaller directories load faster  
✅ **Automated Cleanup** - No manual archiving needed  
✅ **Consistent Structure** - All features follow same pattern  

### For Development
✅ **Easier Testing** - Clear structure for test reports  
✅ **Better Debugging** - Find specific reports easily  
✅ **Simplified Code** - Standard path generation  
✅ **Maintainability** - Clear organization principles  

---

## Next Steps

1. **Review & Approve** - Stakeholder review of this proposal
2. **Create Scripts** - Develop migration and archiving automation
3. **Test Implementation** - Run on test data first
4. **Gradual Rollout** - Migrate one feature at a time
5. **Monitor** - Watch for issues during migration
6. **Document** - Update all relevant documentation

---

## Files to Create

1. `scripts/organize-reports.ts` - Migration script
2. `scripts/archive-old-reports.ts` - Archiving automation
3. `scripts/generate-report-indexes.ts` - Index generation
4. `scripts/find-report.ts` - CLI tool for finding reports
5. `.github/workflows/archive-reports.yml` - Scheduled archiving

---

## Questions for Discussion

1. Should we keep 60 days or different retention period?
2. Compression after 1 year or different timeline?
3. Should Phantom Scout stay in separate directory or consolidate?
4. Do we need weekly or just monthly subdirectories?
5. Should we implement Option C features (indexes) right away?

---

**Recommendation:** Implement **Option A (Feature-First) with JSON indexes** for best balance of simplicity and functionality.
