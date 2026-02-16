# TypeScript Type Check Report

**Date:** 2026-02-16T10:26:35.890Z
**Features Checked:** 12

## Summary

| Feature | Requested File | Checked File | Status | Errors |
|---------|----------------|--------------|--------|--------|
| mining-drill | `src/lib/mining-drill.ts` | `src/lib/mining-drill.ts` | PASSED | 0 |
| stargazer-intelligence | `src/lib/stargazer-intelligence.ts` | `src/lib/stargazer-intelligence.ts` | FAILED | 2 |
| fork-evolution | `src/lib/fork-evolution.ts` | `src/lib/fork-evolution.ts` | FAILED | 2 |
| goldmine-detector | `src/lib/goldmine-detector.ts` | `src/lib/goldmine-detector.ts` | PASSED | 0 |
| hackernews-intelligence | `src/lib/hackernews-intelligence.ts` | `src/lib/hackernews-intelligence.ts` | PASSED | 0 |
| reddit-sniper | `src/lib/reddit-sniper.ts` | `src/lib/reddit-sniper.ts` | PASSED | 0 |
| viral-radar | `src/lib/viral-radar.ts` | `src/lib/viral-radar.ts` | PASSED | 0 |
| reddit-pain-points | `src/lib/reddit-pain-points.ts` | `src/lib/reddit-pain-points.ts` | PASSED | 0 |
| market-gap-identifier | `src/lib/market-gap-identifier.ts` | `src/lib/market-gap-identifier.ts` | PASSED | 0 |
| github-trending | `src/lib/github-trending.ts` | `src/lib/github-trending.ts` | PASSED | 0 |
| quality-pipeline | `src/lib/quality-pipeline.ts` | `src/lib/quality-pipeline-intelligence.ts` | PASSED | 0 |
| phantom-scout | `src/lib/phantom-scout.ts` | `src/lib/scout.ts` | PASSED | 0 |

## Detailed Results

### mining-drill

- **Requested File:** `src/lib/mining-drill.ts`
- **Checked File:** `src/lib/mining-drill.ts`
- **Status:** PASSED
- **Errors:** 0

### stargazer-intelligence

- **Requested File:** `src/lib/stargazer-intelligence.ts`
- **Checked File:** `src/lib/stargazer-intelligence.ts`
- **Status:** FAILED
- **Errors:** 2

**Details:**
```
src/lib/stargazer-intelligence.ts(104,18): error TS2345: Argument of type '{ id: number; node_id: string; name: string; full_name: string; owner: { name?: string | null | undefined; email?: string | null | undefined; login: string; id: number; node_id: string; avatar_url: string; ... 15 more ...; user_view_type?: string | undefined; } | null; ... 83 more ...; web_commit_signoff_required?: ...' is not assignable to parameter of type '{ id: number; full_name: string; name: string; owner: { login: string; }; description: string | null; stargazers_count: number; forks_count: number; created_at: string; updated_at: string; html_url: string; }'.
  Types of property 'owner' are incompatible.
    Type '{ name?: string | null | undefined; email?: string | null | undefined; login: string; id: number; node_id: string; avatar_url: string; gravatar_id: string | null; url: string; html_url: string; ... 12 more ...; user_view_type?: string | undefined; } | null' is not assignable to type '{ login: string; }'.
      Type 'null' is not assignable to type '{ login: string; }'.
src/lib/stargazer-intelligence.ts(178,30): error TS2339: Property 'user' does not exist on type '{ name?: string | null | undefined; email?: string | null | undefined; login: string; id: number; node_id: string; avatar_url: string; gravatar_id: string | null; url: string; html_url: string; ... 12 more ...; user_view_type?: string | undefined; } | { ...; }'.
  Property 'user' does not exist on type '{ name?: string | null | undefined; email?: string | null | undefined; login: string; id: number; node_id: string; avatar_url: string; gravatar_id: string | null; url: string; html_url: string; ... 12 more ...; user_view_type?: string | undefined; }'.

```

### fork-evolution

- **Requested File:** `src/lib/fork-evolution.ts`
- **Checked File:** `src/lib/fork-evolution.ts`
- **Status:** FAILED
- **Errors:** 2

**Details:**
```
src/lib/fork-evolution.ts(196,20): error TS2769: No overload matches this call.
  Overload 1 of 4, '(value: string | number | Date): Date', gave the following error.
    Argument of type 'string | null | undefined' is not assignable to parameter of type 'string | number | Date'.
      Type 'undefined' is not assignable to type 'string | number | Date'.
  Overload 2 of 4, '(value: string | number): Date', gave the following error.
    Argument of type 'string | null | undefined' is not assignable to parameter of type 'string | number'.
      Type 'undefined' is not assignable to type 'string | number'.
src/lib/fork-evolution.ts(201,11): error TS18048: 'fork.stargazers_count' is possibly 'undefined'.

```

### goldmine-detector

- **Requested File:** `src/lib/goldmine-detector.ts`
- **Checked File:** `src/lib/goldmine-detector.ts`
- **Status:** PASSED
- **Errors:** 0

### hackernews-intelligence

- **Requested File:** `src/lib/hackernews-intelligence.ts`
- **Checked File:** `src/lib/hackernews-intelligence.ts`
- **Status:** PASSED
- **Errors:** 0

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
- **Status:** PASSED
- **Errors:** 0

### market-gap-identifier

- **Requested File:** `src/lib/market-gap-identifier.ts`
- **Checked File:** `src/lib/market-gap-identifier.ts`
- **Status:** PASSED
- **Errors:** 0

### github-trending

- **Requested File:** `src/lib/github-trending.ts`
- **Checked File:** `src/lib/github-trending.ts`
- **Status:** PASSED
- **Errors:** 0

### quality-pipeline

- **Requested File:** `src/lib/quality-pipeline.ts`
- **Checked File:** `src/lib/quality-pipeline-intelligence.ts`
- **Status:** PASSED
- **Errors:** 0

### phantom-scout

- **Requested File:** `src/lib/phantom-scout.ts`
- **Checked File:** `src/lib/scout.ts`
- **Status:** PASSED
- **Errors:** 0

