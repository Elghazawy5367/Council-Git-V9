# Blue Ocean Duplicate Reports Investigation

**Investigation Date:** February 20, 2026  
**Status:** CONFIRMED - Root Cause Identified  
**Severity:** MEDIUM - Affects data quality  

## Executive Summary

**Issue Confirmed:** 10 consecutive blue-ocean reports (January 20-29, 2026) are EXACT duplicate copies with identical content.

**Root Cause:** 24-hour cache duration combined with daily workflow execution creates duplicate reports when GitHub API cache remains valid between runs.

**Impact:** 32% of reports (10 out of 31 files) contain duplicate data.

## Evidence

### MD5 Hash Analysis

All 10 files from Jan 20-29 have the SAME MD5 hash, confirming they are byte-for-byte identical:

```bash
a39c3ebc2556ad0b25bacb9ad7cfe9c0  data/intelligence/blue-ocean-2026-01-20.md
a39c3ebc2556ad0b25bacb9ad7cfe9c0  data/intelligence/blue-ocean-2026-01-21.md
a39c3ebc2556ad0b25bacb9ad7cfe9c0  data/intelligence/blue-ocean-2026-01-22.md
a39c3ebc2556ad0b25bacb9ad7cfe9c0  data/intelligence/blue-ocean-2026-01-23.md
a39c3ebc2556ad0b25bacb9ad7cfe9c0  data/intelligence/blue-ocean-2026-01-24.md
a39c3ebc2556ad0b25bacb9ad7cfe9c0  data/intelligence/blue-ocean-2026-01-25.md
a39c3ebc2556ad0b25bacb9ad7cfe9c0  data/intelligence/blue-ocean-2026-01-26.md
a39c3ebc2556ad0b25bacb9ad7cfe9c0  data/intelligence/blue-ocean-2026-01-27.md
a39c3ebc2556ad0b25bacb9ad7cfe9c0  data/intelligence/blue-ocean-2026-01-28.md
a39c3ebc2556ad0b25bacb9ad7cfe9c0  data/intelligence/blue-ocean-2026-01-29.md
```

### File Size Comparison

| Period | Files | Size | Status |
|--------|-------|------|--------|
| Jan 1-8 | 2 | 4.7-4.9 KB | ✅ Unique |
| Jan 20-29 | 10 | 2.5 KB | ❌ **Duplicates** |
| Jan 30 - Feb 3 | 5 | 0 bytes | ⚠️ Empty (DNS block) |
| Feb 4-17 | 14 | 5.5 KB | ✅ Unique |

### Content Analysis

**Duplicate Reports (Jan 20-29):**
```markdown
🔍 Council Scout Mission Starting...

Target Niche: developer tools
Scan Depth: normal
Max Repos: 25

📡 Step 1: Scanning GitHub for trending repositories...
  📦 Using cached repository data  ← CACHED DATA
✓ Found 25 repositories

🔬 Step 2: Extracting pain points...
  [same 25 repos scanned]
✓ Extracted 2 pain points

💡 Step 4: Identifying product opportunities...
✓ Found 2 opportunities
```

**Fresh Reports (Feb 4-17):**
```markdown
# Blue Ocean Opportunities: developer tools

**Generated:** 2/4/2026, 6:42:28 AM  ← Different timestamps
**Total Found:** 27  ← Different data

[Fresh content with real dates and updated stats]
```

## Root Cause Analysis

### 1. Cache Duration Issue

**Code Location:** `src/lib/scout.ts:399`

```typescript
const config: ScoutConfig = {
  niche: targetNiche,
  scanDepth: "normal",
  maxRepos: 25,
  maxIssues: 100,
  cacheExpiry: 24 // ← 24 HOURS
};
```

**Problem:**
- Workflow runs **daily at 6:00 AM** (`.github/workflows/daily-scout.yml:4`)
- Cache expires after **24 hours**
- If cache created at 6:00 AM Day 1, valid until 6:00 AM Day 2
- Day 2 run uses cached data → generates identical report
- Cache gets renewed with SAME data
- Cycle repeats indefinitely

**Cache Validation Logic:**

```typescript
async function isCacheValid(file: string, expiryHours: number): Promise<boolean> {
  if (!fs.existsSync(file)) return false;
  const stats = fs.statSync(file);
  const age = Date.now() - stats.mtimeMs;
  return age < expiryHours * 60 * 60 * 1000;  // 24 hours = 86,400,000 ms
}
```

### 2. Cache Not Invalidated on Stale Data

When cache expires and new data is fetched:
- If GitHub API returns same repositories (trending doesn't change much)
- New cache is created with identical content
- Reports remain identical for extended periods

### 3. Double-Write Configuration (Secondary Issue)

**Workflow:** `.github/workflows/daily-scout.yml:26`
```yaml
- name: Run Phantom Scout
  run: npx tsx src/lib/scout.ts > data/intelligence/blue-ocean-$(date +%Y-%m-%d).md
```

**Script:** `src/lib/scout.ts:244`
```typescript
async function saveBlueOceanReport(opportunities: Opportunity[], topic: string) {
  const mdPath = path.join(process.cwd(), "data", "intelligence", `blue-ocean-${today}.md`);
  fs.writeFileSync(mdPath, generateBlueOceanMarkdown(opportunities, topic));
}
```

**Problem:**
- Workflow redirects stdout to file (console output)
- Script also writes to same file (formatted markdown)
- During API errors, creates empty files (Jan 30 - Feb 3)
- Script output overwrites stdout redirect

## Timeline Analysis

### Period 1: Jan 1-8 (Fresh Data)
- **Files:** 2
- **Status:** ✅ Unique content
- **Reason:** Initial runs, no cache

### Period 2: Jan 20-29 (Duplicates)
- **Files:** 10
- **Status:** ❌ Identical copies
- **Reason:** Cache valid for 10 consecutive days
- **Pattern:** "Using cached repository data"

### Period 3: Jan 30 - Feb 3 (Empty)
- **Files:** 5 (0 bytes each)
- **Status:** ⚠️ Empty files
- **Reason:** DNS blocking GitHub API
- **Note:** Double-write issue creates empty files

### Period 4: Feb 4-17 (Fresh Data)
- **Files:** 14
- **Status:** ✅ Unique content
- **Reason:** Cache expired, fresh API calls
- **Pattern:** Different dates, stats, scores

## Impact Assessment

### Statistics

- **Total Reports:** 31
- **Unique Reports:** 16 (52%)
- **Duplicate Reports:** 10 (32%)
- **Empty Reports:** 5 (16%)

### Data Quality Impact

**Duplicate Content:**
- 10 days of identical intelligence
- Same repositories analyzed
- Same pain points identified
- Same opportunities listed
- Same Blue Ocean scores

**User Impact:**
- Wasted storage (10 x 2.5 KB = 25 KB)
- Misleading historical data
- Reduced value for trend analysis
- Confusion about data freshness

## Solutions

### Solution 1: Reduce Cache Duration ⭐ RECOMMENDED

**Change:** Reduce cache expiry from 24 to 12 hours

**Implementation:**
```typescript
// src/lib/scout.ts line 399
const config: ScoutConfig = {
  niche: targetNiche,
  scanDepth: "normal",
  maxRepos: 25,
  maxIssues: 100,
  cacheExpiry: 12 // Changed from 24 to 12 hours
};
```

**Pros:**
- ✅ Simple one-line change
- ✅ Ensures cache expires before next daily run
- ✅ Still provides performance benefit (12-hour cache)
- ✅ Low risk

**Cons:**
- ⚠️ More API calls if run multiple times per day
- ⚠️ Doesn't guarantee unique data if GitHub trending doesn't change

**Expected Result:** Cache always expires between 6 AM runs (18-hour gap), forcing fresh data

### Solution 2: Date-Based Cache Keys

**Change:** Include date in cache filename

**Implementation:**
```typescript
// src/lib/scout.ts - modify scanTrendingRepos function
async function scanTrendingRepos(config: ScoutConfig): Promise<TrendingRepo[]> {
  const today = new Date().toISOString().split("T")[0];
  const cacheFile = path.join(
    process.cwd(), 
    "data", 
    "cache", 
    `repos-${today}.json`  // Include date in filename
  );
  
  // Check cache
  if (await isCacheValid(cacheFile, config.cacheExpiry)) {
    console.log(`  📦 Using cached repository data from ${today}`);
    return JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
  }
  
  // ... rest of function
}
```

**Pros:**
- ✅ Guarantees unique data per day
- ✅ No duplicate reports possible
- ✅ Clear cache organization
- ✅ Easy debugging (can see which day's cache)

**Cons:**
- ⚠️ More cache files accumulate
- ⚠️ Requires cleanup logic for old caches
- ⚠️ Slightly more complex

**Expected Result:** New cache file created daily, ensuring fresh data

### Solution 3: Remove Workflow Stdout Redirect

**Change:** Let script handle all file writing

**Implementation:**
```yaml
# .github/workflows/daily-scout.yml line 26
# Change from:
- name: Run Phantom Scout
  run: npx tsx src/lib/scout.ts > data/intelligence/blue-ocean-$(date +%Y-%m-%d).md

# To:
- name: Run Phantom Scout
  run: npx tsx src/lib/scout.ts
```

**Pros:**
- ✅ Cleaner architecture
- ✅ Single source of truth for file writing
- ✅ Prevents empty files during API errors
- ✅ Script has full control

**Cons:**
- ⚠️ Doesn't directly fix duplicate issue
- ⚠️ Script must handle all error cases

**Expected Result:** No more double-write issues, cleaner error handling

### Solution 4: Content Hash Check

**Change:** Skip writing if content unchanged

**Implementation:**
```typescript
import crypto from 'crypto';

async function saveBlueOceanReport(opportunities: Opportunity[], topic: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const mdPath = path.join(process.cwd(), "data", "intelligence", `blue-ocean-${today}.md`);
  const markdown = generateBlueOceanMarkdown(opportunities, topic);
  
  // Calculate hash of new content
  const newHash = crypto.createHash('md5').update(markdown).digest('hex');
  
  // Calculate hash of existing file (if exists)
  let existingHash = null;
  if (fs.existsSync(mdPath)) {
    const existingContent = fs.readFileSync(mdPath, 'utf-8');
    existingHash = crypto.createHash('md5').update(existingContent).digest('hex');
  }
  
  // Only write if content changed
  if (newHash !== existingHash) {
    fs.writeFileSync(mdPath, markdown);
    console.log(`✅ Saved fresh report (hash: ${newHash.substring(0, 8)}...)`);
  } else {
    console.log(`⏭️  Skipped - content unchanged (hash: ${newHash.substring(0, 8)}...)`);
  }
}
```

**Pros:**
- ✅ Explicit duplicate detection
- ✅ Prevents writing unchanged content
- ✅ Clear logging of when content changes

**Cons:**
- ⚠️ More complex code
- ⚠️ Doesn't solve root cache issue
- ⚠️ May hide real problems

**Expected Result:** Duplicate files not created, but cache still returns stale data

## Recommended Action Plan

### Priority 1: Reduce Cache Duration (IMMEDIATE)

**File:** `src/lib/scout.ts`  
**Line:** 399  
**Change:**
```typescript
cacheExpiry: 12  // Changed from 24 to 12 hours
```

**Effort:** 1 minute  
**Risk:** LOW  
**Impact:** HIGH - Eliminates most duplicates

### Priority 2: Remove Workflow Redirect (SHORT-TERM)

**File:** `.github/workflows/daily-scout.yml`  
**Line:** 26  
**Change:**
```yaml
run: npx tsx src/lib/scout.ts
# Remove: > data/intelligence/blue-ocean-$(date +%Y-%m-%d).md
```

**Effort:** 1 minute  
**Risk:** LOW  
**Impact:** MEDIUM - Fixes double-write issue

### Priority 3: Add Date-Based Cache Keys (LONG-TERM)

**File:** `src/lib/scout.ts`  
**Function:** `scanTrendingRepos`  
**Change:** Include date in cache filename

**Effort:** 10 minutes  
**Risk:** LOW  
**Impact:** HIGH - Guarantees unique daily data

### Optional: Add Content Hash Check

**File:** `src/lib/scout.ts`  
**Function:** `saveBlueOceanReport`  
**Change:** Check hash before writing

**Effort:** 15 minutes  
**Risk:** LOW  
**Impact:** MEDIUM - Explicit duplicate prevention

## Verification Steps

### After Implementing Fixes

1. **Check Cache Behavior**
   ```bash
   # Run scout twice within 12 hours
   npx tsx src/lib/scout.ts
   sleep 60
   npx tsx src/lib/scout.ts
   
   # Should use cache on second run
   ```

2. **Verify Daily Uniqueness**
   ```bash
   # Run on consecutive days
   # Check MD5 hashes differ
   md5sum data/intelligence/blue-ocean-*.md | sort
   ```

3. **Monitor Workflow Runs**
   ```bash
   # Check GitHub Actions logs for:
   # - "Using cached repository data" (should be less frequent)
   # - "Fetching from GitHub API" (should be daily)
   ```

4. **Validate Report Content**
   ```bash
   # Check for unique dates and data
   grep "Generated:" data/intelligence/blue-ocean-*.md | sort
   ```

## Related Issues

### Phantom Scout Double-Write Issue

**Documented:** PHANTOM_SCOUT_DIAGNOSIS.md  
**Status:** Partially addressed by Solution 3  
**Recommendation:** Remove workflow stdout redirect

### DNS Blocking Period

**Documented:** DNS_BLOCKING_ANALYSIS.md  
**Period:** Jan 30 - Feb 3, 2026  
**Impact:** 5 empty files created  
**Related:** Double-write issue created empty files during API errors

## Conclusion

The duplicate blue-ocean reports issue is caused by an overly aggressive 24-hour cache duration combined with daily workflow execution. This results in 10 consecutive days (32% of all reports) containing identical data.

**Root Cause:** 24-hour cache + daily 6 AM workflow = cache valid between runs

**Recommended Fix:** Reduce cache to 12 hours + remove workflow redirect

**Implementation Time:** 5 minutes  
**Risk Level:** LOW  
**Benefit:** Eliminates duplicate reports, improves data quality

---

**Investigation Complete:** ✅  
**Solutions Provided:** 4 options  
**Recommended Actions:** 3 priorities  
**Status:** READY FOR IMPLEMENTATION
