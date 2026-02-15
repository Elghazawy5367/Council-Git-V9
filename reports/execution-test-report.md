# Feature Execution Test Report

**Date:** 2026-02-15T21:21:42.438Z
**Features Tested:** 12

## Summary

| Feature | Script Used | Command Used | Status | Time (s) | Reports | Issues |
|---------|-------------|--------------|--------|----------|---------|--------|
| Mining Drill | `scripts/run-mining-drill.ts` | `npm run mining-drill` | ❌ FAILED | 0.40 | 0/4 | 1 |
| Stargazer Analysis | `scripts/analyze-stargazers.ts` | `npm run stargazer` | ❌ FAILED | 0.63 | 4/4 | 1 |
| Fork Evolution | `scripts/track-forks.ts` | `npm run fork-evolution` | ❌ FAILED | 0.63 | 4/4 | 1 |
| Goldmine Detector | `scripts/detect-goldmines.ts` | `npm run goldmine` | ❌ FAILED | 300.00 | 0/4 | 1 |
| HackerNews Intelligence | `scripts/scan-hackernews.ts` | `npm run hackernews` | ❌ FAILED | 0.43 | 4/4 | 1 |
| Reddit Sniper | `scripts/snipe-reddit.ts` | `npm run reddit-sniper` | ❌ FAILED | 82.53 | 4/4 | 1 |
| Viral Radar | `scripts/scan-viral.ts` | `npm run viral-radar` | ❌ FAILED | 0.41 | 4/4 | 1 |
| Reddit Pain Points | `scripts/extract-reddit-pain.ts` | `npm run reddit-pain-points` | ❌ FAILED | 0.47 | 4/4 | 1 |
| Market Gap Identifier | `scripts/analyze-market-gaps.ts` | `npm run market-gaps` | ✅ SUCCESS | 0.40 | 4/4 | 0 |
| GitHub Trending | `scripts/scan-github-trending.ts` | `npm run github-trending` | ❌ FAILED | 0.58 | 4/4 | 1 |
| Quality Pipeline | `scripts/run-quality-pipeline-intelligence.ts` | `npm run quality-pipeline` | ✅ SUCCESS | 0.42 | 4/4 | 0 |
| Phantom Scout | `src/lib/scout.ts` | `npm run scout` | ❌ FAILED | 79.19 | 0/4 | 1 |

## Detailed Results

### Mining Drill

- **Script Used:** `scripts/run-mining-drill.ts`
- **Command Used:** `npm run mining-drill`
- **Status:** FAILED
- **Execution Time:** 0.40s
- **Reports Generated:** 0/4

**Errors:**
- ❌ Mining Drill failed: TypeError: niche.github_search_queries is not iterable\n    at runMiningDrill (/home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/mining-drill.ts:553:33)\n    at async main (/home/runner/work/Council-Git-V9/Council-Git-V9/scripts/run-mining-drill.ts:5:5)\n❌ Mining Drill failed: TypeError: niche.github_search_queries is not iterable\n    at runMiningDrill (/home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/mining-drill.ts:553:33)\n    at async main (/home/runner/work/Council-Git-V9/Council-Git-V9/scripts/run-mining-drill.ts:5:5)

---

### Stargazer Analysis

- **Script Used:** `scripts/analyze-stargazers.ts`
- **Command Used:** `npm run stargazer`
- **Status:** FAILED
- **Execution Time:** 0.63s
- **Reports Generated:** 4/4

**Report Files:**
- stargazer-digital-educators-2026-02-15.md
- stargazer-etsy-sellers-2026-02-15.md
- stargazer-freelancers-consultants-2026-02-15.md
- stargazer-maritime-professionals-2026-02-15.md

**Errors:**
- GET /search/repositories?q=topic%3Amaritime%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 61ms\n    ⚠️ Error searching topic maritime: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Ashipping%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 9ms\n    ⚠️ Error searching topic shipping: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Amarine%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic marine: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Anavigation%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic navigation: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Avessel%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 8ms\n    ⚠️ Error searching topic vessel: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Alogistics%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 8ms\n    ⚠️ Error searching topic logistics: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Afleet-management%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 7ms\n    ⚠️ Error searching topic fleet-management: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Acompliance%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 7ms\n    ⚠️ Error searching topic compliance: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Acertification%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 8ms\n    ⚠️ Error searching topic certification: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Afreelancing%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 7ms\n    ⚠️ Error searching topic freelancing: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Ainvoicing%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 7ms\n    ⚠️ Error searching topic invoicing: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Atime-tracking%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic time-tracking: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aproject-management%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic project-management: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aclient-management%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic client-management: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Abilling%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic billing: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Acontract-management%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic contract-management: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aetsy%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 5ms\n    ⚠️ Error searching topic etsy: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aecommerce%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic ecommerce: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Amarketplace%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic marketplace: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aseo%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 5ms\n    ⚠️ Error searching topic seo: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Apricing%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic pricing: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aanalytics%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic analytics: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aeducation%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic education: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aelearning%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic elearning: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aonline-courses%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic online-courses: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Adigital-products%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 5ms\n    ⚠️ Error searching topic digital-products: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Acopyright%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic copyright: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Acontent-protection%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic content-protection: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Alms%20stars%3A%3E100&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic lms: Blocked by DNS monitoring proxy

---

### Fork Evolution

- **Script Used:** `scripts/track-forks.ts`
- **Command Used:** `npm run fork-evolution`
- **Status:** FAILED
- **Execution Time:** 0.63s
- **Reports Generated:** 4/4

**Report Files:**
- fork-evolution-digital-educators-2026-02-15.md
- fork-evolution-etsy-sellers-2026-02-15.md
- fork-evolution-freelancers-consultants-2026-02-15.md
- fork-evolution-maritime-professionals-2026-02-15.md

**Errors:**
- GET /search/repositories?q=topic%3Amaritime%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 59ms\n    ⚠️ Error searching topic maritime: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Ashipping%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 10ms\n    ⚠️ Error searching topic shipping: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Amarine%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 15ms\n    ⚠️ Error searching topic marine: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Anavigation%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 8ms\n    ⚠️ Error searching topic navigation: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Avessel%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 7ms\n    ⚠️ Error searching topic vessel: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Alogistics%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 7ms\n    ⚠️ Error searching topic logistics: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Afleet-management%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 8ms\n    ⚠️ Error searching topic fleet-management: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Acompliance%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 7ms\n    ⚠️ Error searching topic compliance: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Acertification%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 8ms\n    ⚠️ Error searching topic certification: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Afreelancing%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 8ms\n    ⚠️ Error searching topic freelancing: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Ainvoicing%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic invoicing: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Atime-tracking%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic time-tracking: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aproject-management%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic project-management: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aclient-management%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 5ms\n    ⚠️ Error searching topic client-management: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Abilling%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic billing: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Acontract-management%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic contract-management: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aetsy%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic etsy: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aecommerce%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 5ms\n    ⚠️ Error searching topic ecommerce: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Amarketplace%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 5ms\n    ⚠️ Error searching topic marketplace: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aseo%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic seo: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Apricing%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic pricing: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aanalytics%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 5ms\n    ⚠️ Error searching topic analytics: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aeducation%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic education: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aelearning%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic elearning: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aonline-courses%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic online-courses: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Adigital-products%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 5ms\n    ⚠️ Error searching topic digital-products: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Acopyright%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n    ⚠️ Error searching topic copyright: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Acontent-protection%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 5ms\n    ⚠️ Error searching topic content-protection: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Alms%20stars%3A%3E1000%20forks%3A%3E100&sort=forks&order=desc&per_page=20 - 403 with id UNKNOWN in 5ms\n    ⚠️ Error searching topic lms: Blocked by DNS monitoring proxy

---

### Goldmine Detector

- **Script Used:** `scripts/detect-goldmines.ts`
- **Command Used:** `npm run goldmine`
- **Status:** FAILED
- **Execution Time:** 300.00s
- **Reports Generated:** 0/4

**Errors:**
- GET /search/repositories?q=topic%3Amaritime%20stars%3A%3E1000%20pushed%3A%3C2025-02-15&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 57ms\n    ⚠️ Error searching topic maritime: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Ashipping%20stars%3A%3E1000%20pushed%3A%3C2025-02-15&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 10ms\n    ⚠️ Error searching topic shipping: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Amarine%20stars%3A%3E1000%20pushed%3A%3C2025-02-15&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 13ms\n    ⚠️ Error searching topic marine: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Afreelancing%20stars%3A%3E1000%20pushed%3A%3C2025-02-15&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 10ms\n    ⚠️ Error searching topic freelancing: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Ainvoicing%20stars%3A%3E1000%20pushed%3A%3C2025-02-15&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 15ms\n    ⚠️ Error searching topic invoicing: Blocked by DNS monitoring proxy

---

### HackerNews Intelligence

- **Script Used:** `scripts/scan-hackernews.ts`
- **Command Used:** `npm run hackernews`
- **Status:** FAILED
- **Execution Time:** 0.43s
- **Reports Generated:** 4/4

**Report Files:**
- hackernews-digital-educators-2026-02-15.md
- hackernews-etsy-sellers-2026-02-15.md
- hackernews-freelancers-consultants-2026-02-15.md
- hackernews-maritime-professionals-2026-02-15.md

**Errors:**
- Error searching HN for "maritime career OR seafarer certification OR stcw OR license upgrade OR marine officer OR deck officer OR marine engineer OR chief mate OR master mariner OR chief engineer OR sea time OR maritime compliance OR ship management OR vessel operations OR crew management OR maritime logistics OR port operations OR fleet management OR maritime safety OR vessel documentation OR crew records OR maritime inspection OR shipping compliance OR merchant marine OR commercial shipping": fetch failed\nError searching HN for ""Show HN" maritime career": fetch failed\nError searching HN for ""Ask HN" maritime career": fetch failed\nError searching HN for "maritime career seafarer certification": fetch failed\nError searching HN for "freelance OR scope creep OR client management OR project scope OR freelance invoicing OR unpaid work OR freelance contract OR time tracking OR billable hours OR project pricing OR late payment OR client requests OR freelance boundaries OR upwork OR fiverr OR consultant OR independent contractor OR solopreneur OR freelance accounting OR proposal writing": fetch failed\nError searching HN for ""Show HN" freelance": fetch failed\nError searching HN for ""Ask HN" freelance": fetch failed\nError searching HN for "freelance scope creep": fetch failed\nError searching HN for "etsy seo OR etsy pricing OR etsy tags OR etsy ranking OR etsy sales OR etsy keywords OR etsy algorithm OR etsy visibility OR etsy shop OR etsy seller OR etsy analytics OR etsy competition OR etsy shipping OR etsy fees OR etsy marketing OR etsy handmade OR etsy digital OR print on demand OR etsy listings OR etsy optimization": fetch failed\nError searching HN for ""Show HN" etsy seo": fetch failed\nError searching HN for ""Ask HN" etsy seo": fetch failed\nError searching HN for "etsy seo etsy pricing": fetch failed\nError searching HN for "teachers pay teachers OR tpt OR gumroad OR teachable OR udemy OR course creator OR copyright protection OR content theft OR digital products OR course pricing OR course marketing OR student engagement OR tpt seo OR online course OR educational resources OR lesson plans OR course analytics OR digital piracy OR dmca OR watermarking": fetch failed\nError searching HN for ""Show HN" teachers pay teachers": fetch failed\nError searching HN for ""Ask HN" teachers pay teachers": fetch failed\nError searching HN for "teachers pay teachers tpt": fetch failed

---

### Reddit Sniper

- **Script Used:** `scripts/snipe-reddit.ts`
- **Command Used:** `npm run reddit-sniper`
- **Status:** FAILED
- **Execution Time:** 82.53s
- **Reports Generated:** 4/4

**Report Files:**
- reddit-sniper-digital-educators-2026-02-15.md
- reddit-sniper-etsy-sellers-2026-02-15.md
- reddit-sniper-freelancers-consultants-2026-02-15.md
- reddit-sniper-maritime-professionals-2026-02-15.md

**Errors:**
- Error searching r/maritime: fetch failed\nError searching r/navy: fetch failed\nError searching r/sailing: fetch failed\nError searching r/MerchantMarine: fetch failed\nError searching r/seamanship: fetch failed\nError searching r/shipping: fetch failed\nError searching r/logistics: fetch failed\nError searching r/supplychain: fetch failed\nError searching r/engineering: fetch failed\nError searching r/Transportation: fetch failed\nError searching r/freelance: fetch failed\nError searching r/Upwork: fetch failed\nError searching r/Fiverr: fetch failed\nError searching r/freelance_forhire: fetch failed\nError searching r/consulting: fetch failed\nError searching r/entrepreneur: fetch failed\nError searching r/smallbusiness: fetch failed\nError searching r/freelanceWriters: fetch failed\nError searching r/webdev: fetch failed\nError searching r/designjobs: fetch failed\nError searching r/Etsy: fetch failed\nError searching r/EtsySellers: fetch failed\nError searching r/etsypromos: fetch failed\nError searching r/ArtisanGifts: fetch failed\nError searching r/crafts: fetch failed\nError searching r/smallbusiness: fetch failed\nError searching r/ecommerce: fetch failed\nError searching r/Entrepreneur: fetch failed\nError searching r/handmade: fetch failed\nError searching r/printondemand: fetch failed\nError searching r/Teachers: fetch failed\nError searching r/TeachersPayTeachers: fetch failed\nError searching r/teaching: fetch failed\nError searching r/education: fetch failed\nError searching r/elearning: fetch failed\nError searching r/onlinecourses: fetch failed\nError searching r/entrepreneur: fetch failed\nError searching r/digitalnomad: fetch failed\nError searching r/passiveincome: fetch failed\nError searching r/Teachable: fetch failed\nError searching r/Udemy: fetch failed

---

### Viral Radar

- **Script Used:** `scripts/scan-viral.ts`
- **Command Used:** `npm run viral-radar`
- **Status:** FAILED
- **Execution Time:** 0.41s
- **Reports Generated:** 4/4

**Report Files:**
- viral-radar-digital-educators-2026-02-15.md
- viral-radar-etsy-sellers-2026-02-15.md
- viral-radar-freelancers-consultants-2026-02-15.md
- viral-radar-maritime-professionals-2026-02-15.md

**Errors:**
- ✗ Error scanning Reddit: fetch failed\n    ✗ Error scanning HackerNews: fetch failed\n    ✗ Error scanning Reddit: fetch failed\n    ✗ Error scanning HackerNews: fetch failed\n    ✗ Error scanning Reddit: fetch failed\n    ✗ Error scanning HackerNews: fetch failed\n    ✗ Error scanning Reddit: fetch failed\n    ✗ Error scanning HackerNews: fetch failed

---

### Reddit Pain Points

- **Script Used:** `scripts/extract-reddit-pain.ts`
- **Command Used:** `npm run reddit-pain-points`
- **Status:** FAILED
- **Execution Time:** 0.47s
- **Reports Generated:** 4/4

**Report Files:**
- reddit-pain-points-digital-educators-2026-02-15.md
- reddit-pain-points-etsy-sellers-2026-02-15.md
- reddit-pain-points-freelancers-consultants-2026-02-15.md
- reddit-pain-points-maritime-professionals-2026-02-15.md

**Errors:**
- Error searching r/maritime: fetch failed\nError searching r/navy: fetch failed\nError searching r/sailing: fetch failed\nError searching r/MerchantMarine: fetch failed\nError searching r/seamanship: fetch failed\nError searching r/shipping: fetch failed\nError searching r/logistics: fetch failed\nError searching r/supplychain: fetch failed\nError searching r/engineering: fetch failed\nError searching r/Transportation: fetch failed\nError searching r/freelance: fetch failed\nError searching r/Upwork: fetch failed\nError searching r/Fiverr: fetch failed\nError searching r/freelance_forhire: fetch failed\nError searching r/consulting: fetch failed\nError searching r/entrepreneur: fetch failed\nError searching r/smallbusiness: fetch failed\nError searching r/freelanceWriters: fetch failed\nError searching r/webdev: fetch failed\nError searching r/designjobs: fetch failed\nError searching r/Etsy: fetch failed\nError searching r/EtsySellers: fetch failed\nError searching r/etsypromos: fetch failed\nError searching r/ArtisanGifts: fetch failed\nError searching r/crafts: fetch failed\nError searching r/smallbusiness: fetch failed\nError searching r/ecommerce: fetch failed\nError searching r/Entrepreneur: fetch failed\nError searching r/handmade: fetch failed\nError searching r/printondemand: fetch failed\nError searching r/Teachers: fetch failed\nError searching r/TeachersPayTeachers: fetch failed\nError searching r/teaching: fetch failed\nError searching r/education: fetch failed\nError searching r/elearning: fetch failed\nError searching r/onlinecourses: fetch failed\nError searching r/entrepreneur: fetch failed\nError searching r/digitalnomad: fetch failed\nError searching r/passiveincome: fetch failed\nError searching r/Teachable: fetch failed\nError searching r/Udemy: fetch failed

---

### Market Gap Identifier

- **Script Used:** `scripts/analyze-market-gaps.ts`
- **Command Used:** `npm run market-gaps`
- **Status:** SUCCESS
- **Execution Time:** 0.40s
- **Reports Generated:** 4/4

**Report Files:**
- market-gaps-digital-educators-2026-02-15.md
- market-gaps-etsy-sellers-2026-02-15.md
- market-gaps-freelancers-consultants-2026-02-15.md
- market-gaps-maritime-professionals-2026-02-15.md

---

### GitHub Trending

- **Script Used:** `scripts/scan-github-trending.ts`
- **Command Used:** `npm run github-trending`
- **Status:** FAILED
- **Execution Time:** 0.58s
- **Reports Generated:** 4/4

**Report Files:**
- github-trending-digital-educators-2026-02-15.md
- github-trending-etsy-sellers-2026-02-15.md
- github-trending-freelancers-consultants-2026-02-15.md
- github-trending-maritime-professionals-2026-02-15.md

**Errors:**
- GET /search/repositories?q=topic%3Amaritime%20stars%3A%3E50%20pushed%3A%3E2026-01-16&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 57ms\n  ⚠️  Failed to search topic maritime: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Ashipping%20stars%3A%3E50%20pushed%3A%3E2026-01-16&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 11ms\n  ⚠️  Failed to search topic shipping: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Amarine%20stars%3A%3E50%20pushed%3A%3E2026-01-16&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 8ms\n  ⚠️  Failed to search topic marine: Blocked by DNS monitoring proxy\nGET /search/repositories?q=maritime%20career%20created%3A%3E2025-11-17%20stars%3A%3E50&sort=stars&order=desc&per_page=20 - 403 with id UNKNOWN in 7ms\n  ⚠️  Failed to search keyword maritime career: Blocked by DNS monitoring proxy\nGET /search/repositories?q=seafarer%20certification%20created%3A%3E2025-11-17%20stars%3A%3E50&sort=stars&order=desc&per_page=20 - 403 with id UNKNOWN in 8ms\n  ⚠️  Failed to search keyword seafarer certification: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Afreelancing%20stars%3A%3E50%20pushed%3A%3E2026-01-16&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 7ms\n  ⚠️  Failed to search topic freelancing: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Ainvoicing%20stars%3A%3E50%20pushed%3A%3E2026-01-16&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 8ms\n  ⚠️  Failed to search topic invoicing: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Atime-tracking%20stars%3A%3E50%20pushed%3A%3E2026-01-16&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 7ms\n  ⚠️  Failed to search topic time-tracking: Blocked by DNS monitoring proxy\nGET /search/repositories?q=freelance%20created%3A%3E2025-11-17%20stars%3A%3E50&sort=stars&order=desc&per_page=20 - 403 with id UNKNOWN in 8ms\n  ⚠️  Failed to search keyword freelance: Blocked by DNS monitoring proxy\nGET /search/repositories?q=scope%20creep%20created%3A%3E2025-11-17%20stars%3A%3E50&sort=stars&order=desc&per_page=20 - 403 with id UNKNOWN in 8ms\n  ⚠️  Failed to search keyword scope creep: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aetsy%20stars%3A%3E50%20pushed%3A%3E2026-01-16&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 7ms\n  ⚠️  Failed to search topic etsy: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aecommerce%20stars%3A%3E50%20pushed%3A%3E2026-01-16&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n  ⚠️  Failed to search topic ecommerce: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Amarketplace%20stars%3A%3E50%20pushed%3A%3E2026-01-16&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n  ⚠️  Failed to search topic marketplace: Blocked by DNS monitoring proxy\nGET /search/repositories?q=etsy%20seo%20created%3A%3E2025-11-17%20stars%3A%3E50&sort=stars&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n  ⚠️  Failed to search keyword etsy seo: Blocked by DNS monitoring proxy\nGET /search/repositories?q=etsy%20pricing%20created%3A%3E2025-11-17%20stars%3A%3E50&sort=stars&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n  ⚠️  Failed to search keyword etsy pricing: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aeducation%20stars%3A%3E50%20pushed%3A%3E2026-01-16&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n  ⚠️  Failed to search topic education: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aelearning%20stars%3A%3E50%20pushed%3A%3E2026-01-16&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 5ms\n  ⚠️  Failed to search topic elearning: Blocked by DNS monitoring proxy\nGET /search/repositories?q=topic%3Aonline-courses%20stars%3A%3E50%20pushed%3A%3E2026-01-16&sort=stars&order=desc&per_page=30 - 403 with id UNKNOWN in 6ms\n  ⚠️  Failed to search topic online-courses: Blocked by DNS monitoring proxy\nGET /search/repositories?q=teachers%20pay%20teachers%20created%3A%3E2025-11-17%20stars%3A%3E50&sort=stars&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n  ⚠️  Failed to search keyword teachers pay teachers: Blocked by DNS monitoring proxy\nGET /search/repositories?q=tpt%20created%3A%3E2025-11-17%20stars%3A%3E50&sort=stars&order=desc&per_page=20 - 403 with id UNKNOWN in 6ms\n  ⚠️  Failed to search keyword tpt: Blocked by DNS monitoring proxy

---

### Quality Pipeline

- **Script Used:** `scripts/run-quality-pipeline-intelligence.ts`
- **Command Used:** `npm run quality-pipeline`
- **Status:** SUCCESS
- **Execution Time:** 0.42s
- **Reports Generated:** 4/4

**Report Files:**
- quality-pipeline-digital-educators-2026-02-15.md
- quality-pipeline-etsy-sellers-2026-02-15.md
- quality-pipeline-freelancers-consultants-2026-02-15.md
- quality-pipeline-maritime-professionals-2026-02-15.md

---

### Phantom Scout

- **Script Used:** `src/lib/scout.ts`
- **Command Used:** `npm run scout`
- **Status:** FAILED
- **Execution Time:** 79.19s
- **Reports Generated:** 0/4

**Errors:**
- Blue Ocean scan failed: Error: GitHub API error: 403 Forbidden\n    at GitHubService.fetchWithRetry (/home/runner/work/Council-Git-V9/Council-Git-V9/src/services/github.service.ts:73:17)\n    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)\n    at async GitHubService.searchRepositories (/home/runner/work/Council-Git-V9/Council-Git-V9/src/services/github.service.ts:101:22)\n    at async scanBlueOcean (/home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/scout.ts:139:20)\n    at async runScout (/home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/scout.ts:350:25)

---

