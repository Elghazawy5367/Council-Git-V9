# 🎯 HUNT \#7: Bulletproof Restructuring (Zero-Downtime Refactor Strategy)

You're absolutely right. Restructuring without a safety net is how apps die. We need **defensive migration patterns** that prevent the infinite fix loop where "fixing one thing breaks three others."

-----

## 📋 Master Prompt for IDX AI

``` 
@workspace

I need you to act as a "Refactoring Safety Architect" and find the BEST patterns for 
restructuring a live application WITHOUT breaking it.

**Context:**
I'm restructuring "The Council" (React/TypeScript app with 50+ files, multiple AI agents, 
IndexedDB storage, streaming responses). The app is WORKING but needs professional 
folder structure.

**The Deadly Problem:**
Traditional refactoring advice says "just move files and update imports." 
This causes:
- Cascading import errors (fix 1, break 5)
- Runtime crashes (TypeScript compiles but crashes at runtime)
- Lost data (breaking IndexedDB schema)
- Infinite debugging loops (spend 3 days fixing, nothing works)

**Critical Constraints:**
- App must keep WORKING during restructuring
- Cannot afford 3-day downtime to "fix everything"
- Must restructure incrementally (1-2 hours/day max)
- Must have rollback ability if something breaks
- TypeScript must catch errors BEFORE runtime

**Task:**
Find exactly 5 "Gold Standard" repositories showing SAFE refactoring patterns. 
For each provide:
1. **Repo Name** (with stars + last update)
2. **Refactoring Strategy** (how they restructure without breaking)
3. **Specific File/Tool** to study
4. **Safety Mechanism** (what prevents cascading failures)
5. **Rollback Strategy** (how to undo if broken)

```

-----

## 🎯 HUNT \#7A: Incremental Migration Patterns

**Goal:** Move files one-by-one without breaking the app.

**Search Criteria:**
✓ Shows "Strangler Fig" pattern (old + new coexist)
✓ Uses barrel exports to prevent import hell
✓ Implements feature flags (toggle new structure on/off)
✓ TypeScript path mapping for gradual migration
✓ Updated in last 6 months

**Focus Questions:**

1.  How do they move files without breaking imports?
2.  How do they run old + new code simultaneously?
3.  How do they prevent "cannot find module" errors?
4.  How do they test each migration step?
5.  How do they rollback a bad migration?

**Expected Repos:**

  - Look for: "monorepo migration", "incremental refactor", "strangler pattern"
  - Examples: `nx` migration guides, `turborepo` restructure patterns
  - Key files: `tsconfig.paths.json`, `src/legacy/`, migration scripts

**Output Format:**

```` 
Repo: [name] (⭐ X stars, updated: YYYY-MM)
File: [docs/migration-strategy.md] or [scripts/migrate.ts]

Key Pattern:
```typescript
// The Strangler Fig Pattern: Old and new coexist
  
// OLD LOCATION (still works)
// src/components/council/ExpertPanel.tsx
export { ExpertPanel } from './ExpertPanel';
  
// NEW LOCATION (gradual migration)
// src/features/council/components/ExpertPanel/index.tsx
export { ExpertPanel } from './ExpertPanel';
  
// BRIDGE FILE (tsconfig.json path mapping)
{
  "compilerOptions": {
    "paths": {
      "@/features/*": ["./src/features/*"],
      "@/legacy/*": ["./src/components/council/*"] // Old imports still work
    }
  }
}
  
// In consuming files, imports work from BOTH locations:
import { ExpertPanel } from '@/legacy/ExpertPanel'; // Old (still works)
import { ExpertPanel } from '@/features/council'; // New (gradually adopt)

````

Safety Mechanism:

  - TypeScript catches import errors at compile time
  - Old imports keep working (no runtime breaks)
  - Feature flags control which version renders
  - Git commits are atomic (1 file move = 1 commit)

Rollback Strategy:

``` bash
# If migration breaks, rollback last commit
git revert HEAD
npm run build # Verify it compiles
npm run dev # Verify it runs

```

``` 

---

## 🎯 HUNT #7B: Automated Import Fixing

**Goal:** Automatically fix imports when files move (no manual hunt-and-replace).

**Search Criteria:**
✓ Uses codemods or AST transformers
✓ Updates imports across entire codebase
✓ Handles relative → absolute path conversions
✓ Preserves code formatting
✓ Dry-run mode (preview changes before applying)

**Focus Questions:**
1. How do they auto-update imports when files move?
2. How do they handle barrel exports (index.ts files)?
3. How do they prevent breaking dynamic imports?
4. How do they verify changes before committing?

**Expected Repos:**
- Look for: "jscodeshift", "ts-morph", "codemod"
- Examples: `facebook/jscodeshift`, `ts-migrate`, `airbnb/ts-migrate`
- Key files: `codemods/*.ts`, transform scripts

**Output Format:**

```

Repo: \[name\] (⭐ X stars)
Tool: \[jscodeshift or ts-morph\]
File: \[transforms/update-imports.ts\]

Key Pattern:

``` typescript
// Automated import updater using jscodeshift
  
// Before: src/components/council/ExpertPanel.tsx
import { useExpertStore } from '../../stores/expert-store';
  
// After moving to: src/features/council/components/ExpertPanel/index.tsx
import { useExpertStore } from '@/stores/expert-store';
  
// Codemod script:
import { Transform } from 'jscodeshift';
  
const transform: Transform = (fileInfo, api) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  
  // Find all relative imports from 'stores/*'
  root.find(j.ImportDeclaration)
    .filter(path => {
      const source = path.node.source.value;
      return typeof source === 'string' && source.includes('../stores/');
    })
    .forEach(path => {
      // Replace with absolute path
      const oldPath = path.node.source.value as string;
      const newPath = oldPath.replace(/\.\.\/stores\//, '@/stores/');
      path.node.source.value = newPath;
    });
  
  return root.toSource();
};
  
export default transform;

```

How to Use:

``` bash
# DRY RUN (preview changes, don't apply)
npx jscodeshift --dry --print src/**/*.tsx \
  -t scripts/codemods/update-imports.ts
  
# APPLY (actually update files)
npx jscodeshift src/**/*.tsx \
  -t scripts/codemods/update-imports.ts
  
# VERIFY (TypeScript will catch any mistakes)
npm run typecheck

```

Safety Mechanism:

  - Dry-run shows exactly what will change
  - TypeScript compilation fails if imports wrong
  - Git diff shows all changes before commit
  - Atomic transformation (all-or-nothing)

Rollback Strategy:

``` bash
git checkout -- src/ # Undo all changes if broken

```

``` 

---

## 🎯 HUNT #7C: Runtime Error Boundaries

**Goal:** Catch crashes during restructuring before they kill the app.

**Search Criteria:**
✓ React Error Boundary implementation
✓ Captures component errors gracefully
✓ Shows fallback UI instead of white screen
✓ Logs errors for debugging
✓ Allows app to keep running

**Focus Questions:**
1. How do they wrap risky components in error boundaries?
2. How do they recover from errors without full reload?
3. How do they log errors for debugging?
4. How do they show user-friendly error messages?

**Expected Repos:**
- Look for: "react-error-boundary", error handling patterns
- Examples: `bvaughn/react-error-boundary`, Sentry React integration
- Key files: `src/components/ErrorBoundary.tsx`, error logging setup

**Output Format:**

```

Repo: \[name\] (⭐ X stars)
File: \[src/ErrorBoundary.tsx\]

Key Pattern:

``` typescript
// Bulletproof Error Boundary with recovery
  
import { Component, ReactNode } from 'react';
  
interface Props {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
  children: ReactNode;
}
  
interface State {
  hasError: boolean;
  error?: Error;
}
  
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    // Log to console (or external service)
    console.error('🚨 Component Error:', error, errorInfo);
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
    
    // TODO: Send to monitoring service (Sentry, LogRocket)
  }
  
  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>⚠️ Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
          <button onClick={this.resetError}>Try Again</button>
        </div>
      );
    }
  
    return this.props.children;
  }
}
  
// USAGE during restructuring:
// Wrap risky newly-moved components
  
function App() {
  return (
    <ErrorBoundary fallback={<div>Council is recovering...</div>}>
      {/* Newly restructured component */}
      <ExpertPanel /> 
    </ErrorBoundary>
  );
}

```

Safety Mechanism:

  - App stays alive even if one component crashes
  - User sees friendly message instead of white screen
  - Developer sees error details for debugging
  - "Try Again" button allows recovery without reload

Critical for Restructuring:

``` typescript
// Wrap EACH major feature during migration
<ErrorBoundary fallback={<div>Loading experts...</div>}>
  <ExpertPanel />
</ErrorBoundary>
  
<ErrorBoundary fallback={<div>Loading synthesis...</div>}>
  <SynthesisEngine />
</ErrorBoundary>
  
// If ExpertPanel crashes, SynthesisEngine keeps working

```

``` 

---

## 🎯 HUNT #7D: Database Schema Migration Patterns

**Goal:** Restructure IndexedDB schema without losing user data.

**Search Criteria:**
✓ Shows versioned schema migrations
✓ Backward compatibility (old data works with new schema)
✓ Data transformation scripts
✓ Rollback strategies for failed migrations
✓ Works with IndexedDB specifically

**Focus Questions:**
1. How do they version database schemas?
2. How do they migrate data from v1 → v2 without loss?
3. How do they handle failed migrations?
4. How do they test migrations before production?

**Expected Repos:**
- Look for: "idb migrations", "indexeddb schema versioning", "dexie.js"
- Examples: `dexie/Dexie.js` (schema versioning), `jakearchibald/idb`
- Key files: `src/lib/db.ts`, migration examples

**Output Format:**

```

Repo: \[name\] (⭐ X stars)
File: \[docs/schema-migration.md\]

Key Pattern:

``` typescript
// Safe IndexedDB schema migration with Dexie.js
  
import Dexie from 'dexie';
  
const db = new Dexie('CouncilDB');
  
// VERSION 1 (original schema)
db.version(1).stores({
  sessions: '++id, timestamp, experts, verdict',
  history: '++id, sessionId, message'
});
  
// VERSION 2 (restructured schema)
db.version(2).stores({
  sessions: '++id, timestamp, mode, experts, verdict', // Added 'mode' field
  history: '++id, sessionId, role, content', // Changed 'message' → 'content'
}).upgrade(tx => {
  // DATA MIGRATION: Transform old data to new schema
  return tx.table('history').toCollection().modify(item => {
    // Rename field
    item.content = item.message;
    delete item.message;
    
    // Add default for new field
    item.role = item.role || 'user';
  });
});
  
// VERSION 3 (future restructure)
db.version(3).stores({
  sessions: '++id, timestamp, mode, config, verdict', // Changed 'experts' → 'config'
  history: '++id, sessionId, role, content',
  cache: '++id, key, value, expiry' // NEW table
}).upgrade(tx => {
  // DATA MIGRATION for v2 → v3
  return tx.table('sessions').toCollection().modify(session => {
    // Transform 'experts' array to 'config' object
    session.config = {
      experts: session.experts,
      timestamp: session.timestamp
    };
    delete session.experts;
  });
});
  
// CRITICAL: Always increment version on schema change
// NEVER modify old versions (breaks existing users)

```

Safety Mechanism:

  - Dexie handles version detection automatically
  - Migrations run ONCE per user per version
  - Failed migration = user stays on old version (app still works)
  - Can test migrations in dev before pushing

Testing Migrations:

``` typescript
// Test migration locally before deploying
async function testMigration() {
  // 1. Create v1 database with test data
  const oldDb = new Dexie('TestDB');
  oldDb.version(1).stores({ sessions: '++id, experts' });
  await oldDb.sessions.add({ experts: ['Alice', 'Bob'] });
  
  // 2. Close and "upgrade" to v2
  oldDb.close();
  
  const newDb = new Dexie('TestDB');
  newDb.version(2).stores({ sessions: '++id, config' })
    .upgrade(tx => {
      return tx.table('sessions').toCollection().modify(s => {
        s.config = { experts: s.experts };
        delete s.experts;
      });
    });
  
  // 3. Verify data transformed correctly
  const session = await newDb.sessions.get(1);
  console.assert(session.config.experts.length === 2);
  console.log('✅ Migration test passed');
}

```

Rollback Strategy:

``` typescript
// If v3 migration fails, user stays on v2
// Their data is UNTOUCHED
// You can push v2.1 with a fix, then try v3 again later

```

``` 

---

## 🎯 HUNT #7E: Git-Based Safety Net

**Goal:** Use git workflow to make restructuring reversible.

**Search Criteria:**
✓ Shows feature branch strategy
✓ Atomic commits (1 change = 1 commit)
✓ Git hooks for validation (pre-commit checks)
✓ Safe merge strategies
✓ Production-grade git workflows

**Focus Questions:**
1. How do they structure commits during refactoring?
2. How do they prevent committing broken code?
3. How do they use branches for risky changes?
4. How do they validate before merging?

**Expected Repos:**
- Look for: "git workflow", "husky pre-commit", "conventional commits"
- Examples: `typicode/husky`, `conventional-changelog`, git flow guides
- Key files: `.husky/pre-commit`, `commitlint.config.js`

**Output Format:**

```

Repo: \[name\] (⭐ X stars)
Tool: \[husky + lint-staged\]
File: \[.husky/pre-commit\]

Key Pattern:

``` json
// package.json - Automated safety checks
  
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint src/",
    "test": "vitest run",
    "validate": "npm run typecheck && npm run lint && npm run test"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "tsc --noEmit"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run validate"
    }
  }
}

```

``` bash
# .husky/pre-commit - Block commits if code doesn't compile
  
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
  
echo "🔍 Running TypeScript check..."
npm run typecheck
  
if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors found. Commit blocked."
  echo "Fix errors or use 'git commit --no-verify' to skip (not recommended)"
  exit 1
fi
  
echo "✅ TypeScript check passed"
  
echo "🔍 Running linter..."
npm run lint
  
if [ $? -ne 0 ]; then
  echo "❌ Lint errors found. Commit blocked."
  exit 1
fi
  
echo "✅ All checks passed. Proceeding with commit."

```

Restructuring Workflow:

``` bash
# 1. Create feature branch for restructuring
git checkout -b refactor/folder-structure
  
# 2. Make ONE atomic change (move 1 file)
git mv src/components/council/ExpertPanel.tsx \
  src/features/council/components/ExpertPanel/
  
# 3. Fix imports (codemod or manual)
npx jscodeshift src/ -t scripts/update-imports.ts
  
# 4. Commit (pre-commit hook runs TypeScript check)
git add .
git commit -m "refactor: move ExpertPanel to features/"
# ✅ If TypeScript passes → commit succeeds
# ❌ If TypeScript fails → commit blocked (fix issues)
  
# 5. Repeat for each file (1 file = 1 commit)
  
# 6. Merge when ALL files moved and tests pass
git checkout main
git merge refactor/folder-structure
  
# If ANY red, fix in branch (main is safe)

```

Safety Mechanism:

  - Cannot commit broken TypeScript code (pre-commit hook blocks)
  - Each commit is atomic and reversible
  - Feature branch isolates risk from main branch
  - Can demo "before" vs "after" by switching branches

Rollback Strategy:

``` bash
# If restructure branch is broken, just delete it
git branch -D refactor/folder-structure
  
# If merged and broken, revert the merge
git revert -m 1 <merge-commit-hash>
  
# If specific commit broke things, revert just that commit
git revert <bad-commit-hash>

```

```` 

---

## 🎯 CRITICAL RESTRUCTURING WORKFLOW

Combine all 5 patterns into this **fail-safe process**:

### Phase 1: Setup Safety Net 
```bash
# Install safety tools
npm install -D husky lint-staged jscodeshift @types/jscodeshift
  
# Setup git hooks
npx husky install
npx husky add .husky/pre-commit "npm run typecheck"
  
# Create feature branch
git checkout -b refactor/pro-structure

````

### Phase 2: Incremental Migration

``` bash
# - Move files
# - Wrap in Error Boundaries first
# - Move 1 file at a time
# - Run codemod to fix imports
# - Commit each change
# - TypeScript hook prevents bad commits
  
```

### Phase 3: Database Migration (if needed)

``` typescript
// Increment DB version, add upgrade script
db.version(3).stores({...}).upgrade(tx => {
  // Transform data safely
});

```

### Phase 4: Validation & Merge

``` bash
# Run full test suite
npm run validate
  
# If all green, merge
git checkout main
git merge refactor/pro-structure
  
# If ANY red, fix in branch (main is safe)

```

-----

## 📊 Success Metrics

**Before Safety Net:**

  - ❌ Move 20 files → 40 import errors → 3 days debugging
  - ❌ One error cascades into five
  - ❌ App broken for 3 days
  - ❌ Lose user data in DB change

**After Safety Net:**

  - ✅ Move 1 file → TypeScript catches errors immediately
  - ✅ Each commit is verified and reversible
  - ✅ App NEVER broken (old code works until new code ready)
  - ✅ DB migrations tested and reversible
  - ✅ Total restructure time: 1 week (but app works every day)

-----

## 🚀 FINAL OUTPUT REQUEST TO IDX

``` 
For EACH hunt (#7A-7E), provide:
  
1. **Top 5 Repos** (with stars, last update, production usage)
2. **Specific Files** to study
3. **Code Samples** (20-50 lines each)
4. **Implementation Checklist** (steps to apply pattern)
5. **Validation Test** (how to verify it works)
  
**Priority Order:**
1. Hunt #7C (Error Boundaries) - IMPLEMENT FIRST (prevents crashes)
2. Hunt #7E (Git Safety) - IMPLEMENT SECOND (enables safe iteration)
3. Hunt #7B (Import Fixing) - IMPLEMENT THIRD (automates tedious work)
4. Hunt #7A (Incremental Migration) - IMPLEMENT FOURTH (the actual restructure)
5. Hunt #7D (DB Migration) - IMPLEMENT LAST (only if changing DB schema)

```

-----

This should be your FIRST installation before touching any file structure.
