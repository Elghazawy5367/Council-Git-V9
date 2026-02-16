# Feature Execution Test Report

**Date:** 2026-02-16T12:47:19.865Z
**Features Tested:** 12

## Summary

| Feature | Script Used | Command Used | Status | Time (s) | Reports | Issues |
|---------|-------------|--------------|--------|----------|---------|--------|
| Mining Drill | `scripts/run-mining-drill.ts` | `npm run mining-drill` | ❌ FAILED | 0.37 | 0/4 | 1 |
| Stargazer Analysis | `scripts/analyze-stargazers.ts` | `npm run stargazer` | ❌ FAILED | 0.36 | 0/4 | 1 |
| Fork Evolution | `scripts/track-forks.ts` | `npm run fork-evolution` | ❌ FAILED | 0.36 | 0/4 | 1 |
| Goldmine Detector | `scripts/detect-goldmines.ts` | `npm run goldmine` | ❌ FAILED | 0.38 | 0/4 | 1 |
| HackerNews Intelligence | `scripts/scan-hackernews.ts` | `npm run hackernews` | ❌ FAILED | 0.36 | 0/4 | 1 |
| Reddit Sniper | `scripts/snipe-reddit.ts` | `npm run reddit-sniper` | ❌ FAILED | 0.36 | 0/4 | 1 |
| Viral Radar | `scripts/scan-viral.ts` | `npm run viral-radar` | ❌ FAILED | 0.37 | 0/4 | 1 |
| Reddit Pain Points | `scripts/extract-reddit-pain.ts` | `npm run reddit-pain-points` | ❌ FAILED | 0.36 | 0/4 | 1 |
| Market Gap Identifier | `scripts/analyze-market-gaps.ts` | `npm run market-gaps` | ❌ FAILED | 0.36 | 0/4 | 1 |
| GitHub Trending | `scripts/scan-github-trending.ts` | `npm run github-trending` | ❌ FAILED | 0.36 | 0/4 | 1 |
| Quality Pipeline | `scripts/run-quality-pipeline-intelligence.ts` | `npm run quality-pipeline` | ❌ FAILED | 0.36 | 0/4 | 1 |
| Phantom Scout | `src/lib/scout.ts` | `npm run scout` | ❌ FAILED | 79.73 | 0/4 | 1 |

## Detailed Results

### Mining Drill

- **Script Used:** `scripts/run-mining-drill.ts`
- **Command Used:** `npm run mining-drill`
- **Status:** FAILED
- **Execution Time:** 0.37s
- **Reports Generated:** 0/4

**Errors:**
- node:internal/modules/run_main:107\n    triggerUncaughtException(\n    ^\nError [ERR_MODULE_NOT_FOUND]: Cannot find package '@octokit/rest' imported from /home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/mining-drill.ts\n    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:316:9)\n    at packageResolve (node:internal/modules/esm/resolve:768:81)\n    at moduleResolve (node:internal/modules/esm/resolve:858:18)\n    at defaultResolve (node:internal/modules/esm/resolve:990:11)\n    at nextResolve (node:internal/modules/esm/hooks:785:28)\n    at resolveBase (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245956357:2:3744)\n    at resolveDirectory (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245956357:2:4243)\n    at resolveTsPaths (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245956357:2:4984)\n    at async resolve (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245956357:2:5355)\n    at async nextResolve (node:internal/modules/esm/hooks:785:22) {\n  code: 'ERR_MODULE_NOT_FOUND'\n}\n\nNode.js v24.13.0

---

### Stargazer Analysis

- **Script Used:** `scripts/analyze-stargazers.ts`
- **Command Used:** `npm run stargazer`
- **Status:** FAILED
- **Execution Time:** 0.36s
- **Reports Generated:** 0/4

**Errors:**
- node:internal/modules/run_main:107\n    triggerUncaughtException(\n    ^\nError [ERR_MODULE_NOT_FOUND]: Cannot find package 'js-yaml' imported from /home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/stargazer-intelligence.ts\n    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:316:9)\n    at packageResolve (node:internal/modules/esm/resolve:768:81)\n    at moduleResolve (node:internal/modules/esm/resolve:858:18)\n    at defaultResolve (node:internal/modules/esm/resolve:990:11)\n    at nextResolve (node:internal/modules/esm/hooks:785:28)\n    at resolveBase (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245956733:2:3744)\n    at resolveDirectory (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245956733:2:4243)\n    at resolveTsPaths (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245956733:2:4984)\n    at async resolve (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245956733:2:5355)\n    at async nextResolve (node:internal/modules/esm/hooks:785:22) {\n  code: 'ERR_MODULE_NOT_FOUND'\n}\n\nNode.js v24.13.0

---

### Fork Evolution

- **Script Used:** `scripts/track-forks.ts`
- **Command Used:** `npm run fork-evolution`
- **Status:** FAILED
- **Execution Time:** 0.36s
- **Reports Generated:** 0/4

**Errors:**
- node:internal/modules/run_main:107\n    triggerUncaughtException(\n    ^\nError [ERR_MODULE_NOT_FOUND]: Cannot find package 'js-yaml' imported from /home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/fork-evolution.ts\n    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:316:9)\n    at packageResolve (node:internal/modules/esm/resolve:768:81)\n    at moduleResolve (node:internal/modules/esm/resolve:858:18)\n    at defaultResolve (node:internal/modules/esm/resolve:990:11)\n    at nextResolve (node:internal/modules/esm/hooks:785:28)\n    at resolveBase (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245957094:2:3744)\n    at resolveDirectory (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245957094:2:4243)\n    at resolveTsPaths (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245957094:2:4984)\n    at async resolve (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245957094:2:5355)\n    at async nextResolve (node:internal/modules/esm/hooks:785:22) {\n  code: 'ERR_MODULE_NOT_FOUND'\n}\n\nNode.js v24.13.0

---

### Goldmine Detector

- **Script Used:** `scripts/detect-goldmines.ts`
- **Command Used:** `npm run goldmine`
- **Status:** FAILED
- **Execution Time:** 0.38s
- **Reports Generated:** 0/4

**Errors:**
- node:internal/modules/run_main:107\n    triggerUncaughtException(\n    ^\nError [ERR_MODULE_NOT_FOUND]: Cannot find package '@octokit/rest' imported from /home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/goldmine-detector.ts\n    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:316:9)\n    at packageResolve (node:internal/modules/esm/resolve:768:81)\n    at moduleResolve (node:internal/modules/esm/resolve:858:18)\n    at defaultResolve (node:internal/modules/esm/resolve:990:11)\n    at nextResolve (node:internal/modules/esm/hooks:785:28)\n    at resolveBase (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245957452:2:3744)\n    at resolveDirectory (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245957452:2:4243)\n    at resolveTsPaths (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245957452:2:4984)\n    at async resolve (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245957452:2:5355)\n    at async nextResolve (node:internal/modules/esm/hooks:785:22) {\n  code: 'ERR_MODULE_NOT_FOUND'\n}\n\nNode.js v24.13.0

---

### HackerNews Intelligence

- **Script Used:** `scripts/scan-hackernews.ts`
- **Command Used:** `npm run hackernews`
- **Status:** FAILED
- **Execution Time:** 0.36s
- **Reports Generated:** 0/4

**Errors:**
- node:internal/modules/run_main:107\n    triggerUncaughtException(\n    ^\nError [ERR_MODULE_NOT_FOUND]: Cannot find package 'js-yaml' imported from /home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/hackernews-intelligence.ts\n    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:316:9)\n    at packageResolve (node:internal/modules/esm/resolve:768:81)\n    at moduleResolve (node:internal/modules/esm/resolve:858:18)\n    at defaultResolve (node:internal/modules/esm/resolve:990:11)\n    at nextResolve (node:internal/modules/esm/hooks:785:28)\n    at resolveBase (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245957835:2:3744)\n    at resolveDirectory (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245957835:2:4243)\n    at resolveTsPaths (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245957835:2:4984)\n    at async resolve (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245957835:2:5355)\n    at async nextResolve (node:internal/modules/esm/hooks:785:22) {\n  code: 'ERR_MODULE_NOT_FOUND'\n}\n\nNode.js v24.13.0

---

### Reddit Sniper

- **Script Used:** `scripts/snipe-reddit.ts`
- **Command Used:** `npm run reddit-sniper`
- **Status:** FAILED
- **Execution Time:** 0.36s
- **Reports Generated:** 0/4

**Errors:**
- node:internal/modules/run_main:107\n    triggerUncaughtException(\n    ^\nError [ERR_MODULE_NOT_FOUND]: Cannot find package 'js-yaml' imported from /home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/reddit-sniper.ts\n    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:316:9)\n    at packageResolve (node:internal/modules/esm/resolve:768:81)\n    at moduleResolve (node:internal/modules/esm/resolve:858:18)\n    at defaultResolve (node:internal/modules/esm/resolve:990:11)\n    at nextResolve (node:internal/modules/esm/hooks:785:28)\n    at resolveBase (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245958196:2:3744)\n    at resolveDirectory (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245958196:2:4243)\n    at resolveTsPaths (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245958196:2:4984)\n    at async resolve (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245958196:2:5355)\n    at async nextResolve (node:internal/modules/esm/hooks:785:22) {\n  code: 'ERR_MODULE_NOT_FOUND'\n}\n\nNode.js v24.13.0

---

### Viral Radar

- **Script Used:** `scripts/scan-viral.ts`
- **Command Used:** `npm run viral-radar`
- **Status:** FAILED
- **Execution Time:** 0.37s
- **Reports Generated:** 0/4

**Errors:**
- node:internal/modules/run_main:107\n    triggerUncaughtException(\n    ^\nError [ERR_MODULE_NOT_FOUND]: Cannot find package 'js-yaml' imported from /home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/viral-radar.ts\n    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:316:9)\n    at packageResolve (node:internal/modules/esm/resolve:768:81)\n    at moduleResolve (node:internal/modules/esm/resolve:858:18)\n    at defaultResolve (node:internal/modules/esm/resolve:990:11)\n    at nextResolve (node:internal/modules/esm/hooks:785:28)\n    at resolveBase (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245958562:2:3744)\n    at resolveDirectory (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245958562:2:4243)\n    at resolveTsPaths (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245958562:2:4984)\n    at async resolve (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245958562:2:5355)\n    at async nextResolve (node:internal/modules/esm/hooks:785:22) {\n  code: 'ERR_MODULE_NOT_FOUND'\n}\n\nNode.js v24.13.0

---

### Reddit Pain Points

- **Script Used:** `scripts/extract-reddit-pain.ts`
- **Command Used:** `npm run reddit-pain-points`
- **Status:** FAILED
- **Execution Time:** 0.36s
- **Reports Generated:** 0/4

**Errors:**
- node:internal/modules/run_main:107\n    triggerUncaughtException(\n    ^\nError [ERR_MODULE_NOT_FOUND]: Cannot find package 'js-yaml' imported from /home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/reddit-pain-points.ts\n    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:316:9)\n    at packageResolve (node:internal/modules/esm/resolve:768:81)\n    at moduleResolve (node:internal/modules/esm/resolve:858:18)\n    at defaultResolve (node:internal/modules/esm/resolve:990:11)\n    at nextResolve (node:internal/modules/esm/hooks:785:28)\n    at resolveBase (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245958921:2:3744)\n    at resolveDirectory (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245958921:2:4243)\n    at resolveTsPaths (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245958921:2:4984)\n    at async resolve (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245958921:2:5355)\n    at async nextResolve (node:internal/modules/esm/hooks:785:22) {\n  code: 'ERR_MODULE_NOT_FOUND'\n}\n\nNode.js v24.13.0

---

### Market Gap Identifier

- **Script Used:** `scripts/analyze-market-gaps.ts`
- **Command Used:** `npm run market-gaps`
- **Status:** FAILED
- **Execution Time:** 0.36s
- **Reports Generated:** 0/4

**Errors:**
- node:internal/modules/run_main:107\n    triggerUncaughtException(\n    ^\nError [ERR_MODULE_NOT_FOUND]: Cannot find package 'js-yaml' imported from /home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/market-gap-identifier.ts\n    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:316:9)\n    at packageResolve (node:internal/modules/esm/resolve:768:81)\n    at moduleResolve (node:internal/modules/esm/resolve:858:18)\n    at defaultResolve (node:internal/modules/esm/resolve:990:11)\n    at nextResolve (node:internal/modules/esm/hooks:785:28)\n    at resolveBase (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245959287:2:3744)\n    at resolveDirectory (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245959287:2:4243)\n    at resolveTsPaths (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245959287:2:4984)\n    at async resolve (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245959287:2:5355)\n    at async nextResolve (node:internal/modules/esm/hooks:785:22) {\n  code: 'ERR_MODULE_NOT_FOUND'\n}\n\nNode.js v24.13.0

---

### GitHub Trending

- **Script Used:** `scripts/scan-github-trending.ts`
- **Command Used:** `npm run github-trending`
- **Status:** FAILED
- **Execution Time:** 0.36s
- **Reports Generated:** 0/4

**Errors:**
- node:internal/modules/run_main:107\n    triggerUncaughtException(\n    ^\nError [ERR_MODULE_NOT_FOUND]: Cannot find package 'js-yaml' imported from /home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/github-trending.ts\n    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:316:9)\n    at packageResolve (node:internal/modules/esm/resolve:768:81)\n    at moduleResolve (node:internal/modules/esm/resolve:858:18)\n    at defaultResolve (node:internal/modules/esm/resolve:990:11)\n    at nextResolve (node:internal/modules/esm/hooks:785:28)\n    at resolveBase (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245959650:2:3744)\n    at resolveDirectory (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245959650:2:4243)\n    at resolveTsPaths (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245959650:2:4984)\n    at async resolve (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245959650:2:5355)\n    at async nextResolve (node:internal/modules/esm/hooks:785:22) {\n  code: 'ERR_MODULE_NOT_FOUND'\n}\n\nNode.js v24.13.0

---

### Quality Pipeline

- **Script Used:** `scripts/run-quality-pipeline-intelligence.ts`
- **Command Used:** `npm run quality-pipeline`
- **Status:** FAILED
- **Execution Time:** 0.36s
- **Reports Generated:** 0/4

**Errors:**
- node:internal/modules/run_main:107\n    triggerUncaughtException(\n    ^\nError [ERR_MODULE_NOT_FOUND]: Cannot find package 'js-yaml' imported from /home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/quality-pipeline-intelligence.ts\n    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:316:9)\n    at packageResolve (node:internal/modules/esm/resolve:768:81)\n    at moduleResolve (node:internal/modules/esm/resolve:858:18)\n    at defaultResolve (node:internal/modules/esm/resolve:990:11)\n    at nextResolve (node:internal/modules/esm/hooks:785:28)\n    at resolveBase (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245960006:2:3744)\n    at resolveDirectory (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245960006:2:4243)\n    at resolveTsPaths (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245960006:2:4984)\n    at async resolve (file:///home/runner/.npm/_npx/fd45a72a545557e9/node_modules/tsx/dist/esm/index.mjs?1771245960006:2:5355)\n    at async nextResolve (node:internal/modules/esm/hooks:785:22) {\n  code: 'ERR_MODULE_NOT_FOUND'\n}\n\nNode.js v24.13.0

---

### Phantom Scout

- **Script Used:** `src/lib/scout.ts`
- **Command Used:** `npm run scout`
- **Status:** FAILED
- **Execution Time:** 79.73s
- **Reports Generated:** 0/4

**Errors:**
- Blue Ocean scan failed: Error: GitHub API error: 403 Forbidden\n    at GitHubService.fetchWithRetry (/home/runner/work/Council-Git-V9/Council-Git-V9/src/services/github.service.ts:73:17)\n    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)\n    at async GitHubService.searchRepositories (/home/runner/work/Council-Git-V9/Council-Git-V9/src/services/github.service.ts:101:22)\n    at async scanBlueOcean (/home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/scout.ts:139:20)\n    at async runScout (/home/runner/work/Council-Git-V9/Council-Git-V9/src/lib/scout.ts:350:25)

---

