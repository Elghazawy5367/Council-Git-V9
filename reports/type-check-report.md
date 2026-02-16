# TypeScript Type Check Report

**Date:** 2026-02-15T21:05:32.806Z
**Features Checked:** 12

## Summary

| Feature | Requested File | Checked File | Status | Errors |
|---------|----------------|--------------|--------|--------|
| mining-drill | `src/lib/mining-drill.ts` | `src/lib/mining-drill.ts` | FAILED | 1 |
| stargazer-intelligence | `src/lib/stargazer-intelligence.ts` | `src/lib/stargazer-intelligence.ts` | FAILED | 2 |
| fork-evolution | `src/lib/fork-evolution.ts` | `src/lib/fork-evolution.ts` | FAILED | 1 |
| goldmine-detector | `src/lib/goldmine-detector.ts` | `src/lib/goldmine-detector.ts` | FAILED | 1 |
| hackernews-intelligence | `src/lib/hackernews-intelligence.ts` | `src/lib/hackernews-intelligence.ts` | FAILED | 1 |
| reddit-sniper | `src/lib/reddit-sniper.ts` | `src/lib/reddit-sniper.ts` | PASSED | 0 |
| viral-radar | `src/lib/viral-radar.ts` | `src/lib/viral-radar.ts` | PASSED | 0 |
| reddit-pain-points | `src/lib/reddit-pain-points.ts` | `src/lib/reddit-pain-points.ts` | FAILED | 6 |
| market-gap-identifier | `src/lib/market-gap-identifier.ts` | `src/lib/market-gap-identifier.ts` | FAILED | 7 |
| github-trending | `src/lib/github-trending.ts` | `src/lib/github-trending.ts` | FAILED | 1 |
| quality-pipeline | `src/lib/quality-pipeline.ts` | `src/lib/quality-pipeline-intelligence.ts` | FAILED | 7 |
| phantom-scout | `src/lib/phantom-scout.ts` | `src/lib/scout.ts` | FAILED | 5 |

## Detailed Results

### mining-drill

- **Requested File:** `src/lib/mining-drill.ts`
- **Checked File:** `src/lib/mining-drill.ts`
- **Status:** FAILED
- **Errors:** 1

**Details:**
```
node_modules/@octokit/request-error/dist-types/types.d.ts(2,46): error TS2304: Cannot find name 'ErrorOptions'.

```

### stargazer-intelligence

- **Requested File:** `src/lib/stargazer-intelligence.ts`
- **Checked File:** `src/lib/stargazer-intelligence.ts`
- **Status:** FAILED
- **Errors:** 2

**Details:**
```
node_modules/@octokit/request-error/dist-types/types.d.ts(2,46): error TS2304: Cannot find name 'ErrorOptions'.
src/lib/stargazer-intelligence.ts(178,30): error TS2339: Property 'user' does not exist on type '{ name?: string; email?: string; login: string; id: number; node_id: string; avatar_url: string; gravatar_id: string; url: string; html_url: string; followers_url: string; following_url: string; gists_url: string; ... 9 more ...; user_view_type?: string; } | { ...; }'.
  Property 'user' does not exist on type '{ name?: string; email?: string; login: string; id: number; node_id: string; avatar_url: string; gravatar_id: string; url: string; html_url: string; followers_url: string; following_url: string; gists_url: string; ... 9 more ...; user_view_type?: string; }'.

```

### fork-evolution

- **Requested File:** `src/lib/fork-evolution.ts`
- **Checked File:** `src/lib/fork-evolution.ts`
- **Status:** FAILED
- **Errors:** 1

**Details:**
```
node_modules/@octokit/request-error/dist-types/types.d.ts(2,46): error TS2304: Cannot find name 'ErrorOptions'.

```

### goldmine-detector

- **Requested File:** `src/lib/goldmine-detector.ts`
- **Checked File:** `src/lib/goldmine-detector.ts`
- **Status:** FAILED
- **Errors:** 1

**Details:**
```
node_modules/@octokit/request-error/dist-types/types.d.ts(2,46): error TS2304: Cannot find name 'ErrorOptions'.

```

### hackernews-intelligence

- **Requested File:** `src/lib/hackernews-intelligence.ts`
- **Checked File:** `src/lib/hackernews-intelligence.ts`
- **Status:** FAILED
- **Errors:** 1

**Details:**
```
src/lib/hackernews-intelligence.ts(137,14): error TS1252: Function declarations are not allowed inside blocks in strict mode when targeting 'ES5'. Modules are automatically in strict mode.

```

### reddit-sniper

- **Requested File:** `src/lib/reddit-sniper.ts`
- **Checked File:** `src/lib/reddit-sniper.ts`
- **Status:** PASSED
- **Errors:** 0

### viral-radar

- **Requested File:** `src/lib/viral-radar.ts`
- **Checked File:** `src/lib/viral-radar.ts`
- **Status:** PASSED
- **Errors:** 0

### reddit-pain-points

- **Requested File:** `src/lib/reddit-pain-points.ts`
- **Checked File:** `src/lib/reddit-pain-points.ts`
- **Status:** FAILED
- **Errors:** 6

**Details:**
```
src/lib/reddit-pain-points.ts(235,27): error TS2802: Type 'Map<string, ExtractedPain>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.
src/lib/reddit-pain-points.ts(272,36): error TS2802: Type 'Set<string>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.
src/lib/reddit-pain-points.ts(273,29): error TS2802: Type 'Set<string>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.
src/lib/reddit-pain-points.ts(273,38): error TS2802: Type 'Set<string>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.
src/lib/reddit-pain-points.ts(290,27): error TS2802: Type 'Map<string, ExtractedPain>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.
src/lib/reddit-pain-points.ts(461,35): error TS2802: Type 'Map<string, number>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.

```

### market-gap-identifier

- **Requested File:** `src/lib/market-gap-identifier.ts`
- **Checked File:** `src/lib/market-gap-identifier.ts`
- **Status:** FAILED
- **Errors:** 7

**Details:**
```
node_modules/glob/dist/commonjs/pattern.d.ts(19,5): error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.
node_modules/glob/dist/commonjs/walker.d.ts(54,5): error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.
node_modules/glob/node_modules/minimatch/dist/commonjs/ast.d.ts(4,5): error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.
node_modules/lru-cache/dist/commonjs/index.d.ts(23,5): error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.
node_modules/lru-cache/dist/commonjs/index.d.ts(878,5): error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.
node_modules/path-scurry/dist/commonjs/index.d.ts(115,5): error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.
node_modules/path-scurry/dist/commonjs/index.d.ts(586,5): error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.

```

### github-trending

- **Requested File:** `src/lib/github-trending.ts`
- **Checked File:** `src/lib/github-trending.ts`
- **Status:** FAILED
- **Errors:** 1

**Details:**
```
node_modules/@octokit/request-error/dist-types/types.d.ts(2,46): error TS2304: Cannot find name 'ErrorOptions'.

```

### quality-pipeline

- **Requested File:** `src/lib/quality-pipeline.ts`
- **Checked File:** `src/lib/quality-pipeline-intelligence.ts`
- **Status:** FAILED
- **Errors:** 7

**Details:**
```
node_modules/glob/dist/commonjs/pattern.d.ts(19,5): error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.
node_modules/glob/dist/commonjs/walker.d.ts(54,5): error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.
node_modules/glob/node_modules/minimatch/dist/commonjs/ast.d.ts(4,5): error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.
node_modules/lru-cache/dist/commonjs/index.d.ts(23,5): error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.
node_modules/lru-cache/dist/commonjs/index.d.ts(878,5): error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.
node_modules/path-scurry/dist/commonjs/index.d.ts(115,5): error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.
node_modules/path-scurry/dist/commonjs/index.d.ts(586,5): error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.

```

### phantom-scout

- **Requested File:** `src/lib/phantom-scout.ts`
- **Checked File:** `src/lib/scout.ts`
- **Status:** FAILED
- **Errors:** 5

**Details:**
```
src/lib/config.ts(2,36): error TS2307: Cannot find module '@/features/council/lib/types' or its corresponding type declarations.
src/lib/scout.ts(18,34): error TS2307: Cannot find module '@/services/github.service' or its corresponding type declarations.
src/lib/scout.ts(521,28): error TS2802: Type 'Map<string, PainPoint[]>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.
src/lib/scout.ts(585,34): error TS2802: Type 'Map<string, number>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.
src/lib/scout.ts(706,14): error TS2802: Type 'Set<string>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.

```

