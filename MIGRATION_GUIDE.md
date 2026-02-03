# Migration Guide: Council Store Refactoring

## Quick Reference

This guide helps you migrate from the old unified `council.store.ts` to the new sliced architecture with React Query.

## TL;DR

```typescript
// OLD
import { useCouncilStore } from '@/stores/council.store';

const Component = () => {
  const { experts, task, setTask, executePhase1 } = useCouncilStore();
  // ...
};

// NEW
import { useCouncilExperts, useCouncilControl } from '@/features/council/store';
import { useCouncilExecution } from '@/features/council/hooks/use-council-execution';

const Component = () => {
  const { experts } = useCouncilExperts();
  const { task, setTask } = useCouncilControl();
  const executionMutation = useCouncilExecution();
  
  // Execute with React Query
  executionMutation.mutate({ task, experts, ... });
};
```

## Step-by-Step Migration

### 1. Update Imports

#### Before
```typescript
import { useCouncilStore } from '@/stores/council.store';
```

#### After
```typescript
// Import specific hooks for what you need
import { 
  useCouncilExperts,   // For expert management
  useCouncilExecution, // For execution state
  useCouncilUI,        // For UI state (loading, messages)
  useCouncilControl    // For task, mode, settings
} from '@/features/council/store';

// Import React Query hooks for actions
import { useCouncilExecution } from '@/features/council/hooks/use-council-execution';
import { useCouncilSynthesis } from '@/features/council/hooks/use-council-synthesis';
import { useExpertMutation } from '@/features/council/hooks/use-expert-mutation';
```

### 2. Update State Access

#### Before
```typescript
const Component = () => {
  const { 
    experts, 
    task, 
    isLoading, 
    statusMessage,
    executionPhase,
    outputs,
    cost,
    synthesisResult
  } = useCouncilStore();
  
  // ...
};
```

#### After
```typescript
const Component = () => {
  // Split into focused hooks
  const { experts, setExperts, updateExpert } = useCouncilExperts();
  const { task, mode, setTask, setMode } = useCouncilControl();
  const { isLoading, statusMessage } = useCouncilUI();
  const { executionPhase, outputs, cost, synthesisResult } = useCouncilExecution();
  
  // ...
};
```

### 3. Update Actions (Most Important!)

#### Before: Manual State Updates
```typescript
const Component = () => {
  const { executePhase1, executePhase2 } = useCouncilStore();
  
  const handleExecute = () => {
    executePhase1();  // Manual state management
  };
  
  const handleSynthesize = () => {
    executePhase2(synthesisMutation);  // Manual state management
  };
  
  return (
    <button onClick={handleExecute}>Execute</button>
  );
};
```

#### After: React Query Mutations
```typescript
const Component = () => {
  const { experts } = useCouncilExperts();
  const { task, mode } = useCouncilControl();
  const executionMutation = useCouncilExecution();
  const synthesisMutation = useCouncilSynthesis();
  
  const handleExecute = () => {
    executionMutation.mutate({
      task,
      mode,
      experts,
      apiKey,
      config,
    });
  };
  
  const handleSynthesize = () => {
    synthesisMutation.mutate({
      expertOutputs,
      task,
      config,
      apiKey,
    });
  };
  
  return (
    <>
      <button 
        onClick={handleExecute}
        disabled={executionMutation.isPending}
      >
        {executionMutation.isPending ? 'Executing...' : 'Execute'}
      </button>
      
      {executionMutation.isError && (
        <div>Error: {executionMutation.error.message}</div>
      )}
    </>
  );
};
```

### 4. Optimistic Updates

#### Before: Manual Optimistic Updates
```typescript
const handleUpdateExpert = (index: number, updates: Partial<Expert>) => {
  // Manually update state
  updateExpert(index, updates);
  
  // Then maybe save to backend (but no rollback on error)
  saveToBackend(updates).catch(error => {
    // Oops, state is already updated but save failed!
    console.error(error);
  });
};
```

#### After: React Query Optimistic Updates
```typescript
const expertMutation = useExpertMutation();

const handleUpdateExpert = (index: number, updates: Partial<Expert>) => {
  expertMutation.mutate(
    { index, updates },
    {
      // Optimistic update happens automatically in the hook
      // If it fails, React Query rolls back automatically!
    }
  );
};
```

### 5. Loading States

#### Before: Manual Loading States
```typescript
const { isLoading, isSynthesizing } = useCouncilStore();

return (
  <div>
    {isLoading && <Spinner />}
    {isSynthesizing && <Spinner />}
  </div>
);
```

#### After: React Query Loading States
```typescript
const executionMutation = useCouncilExecution();
const synthesisMutation = useCouncilSynthesis();

return (
  <div>
    {executionMutation.isPending && <Spinner />}
    {synthesisMutation.isPending && <Spinner />}
    
    {/* Or combined */}
    {(executionMutation.isPending || synthesisMutation.isPending) && <Spinner />}
  </div>
);
```

### 6. Error Handling

#### Before: Manual Error Handling
```typescript
const { status } = useCouncilStore();

return (
  <div>
    {status === 'error' && <div>Something went wrong</div>}
  </div>
);
```

#### After: React Query Error Handling
```typescript
const executionMutation = useCouncilExecution();

return (
  <div>
    {executionMutation.isError && (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {executionMutation.error.message}
        </AlertDescription>
      </Alert>
    )}
  </div>
);
```

## Common Patterns

### Pattern 1: Execute Council (Full Flow)

#### Before
```typescript
const Component = () => {
  const { 
    task, 
    experts, 
    mode, 
    executeCouncil 
  } = useCouncilStore();
  
  const synthesisMutation = useExecuteSynthesis();
  
  const handleExecute = () => {
    executeCouncil(synthesisMutation);
  };
  
  return <button onClick={handleExecute}>Execute</button>;
};
```

#### After
```typescript
const Component = () => {
  const { task } = useCouncilControl();
  const { experts } = useCouncilExperts();
  const executionMutation = useCouncilExecution();
  const synthesisMutation = useCouncilSynthesis();
  
  const handleExecutePhase1 = () => {
    executionMutation.mutate({ task, experts, ... });
  };
  
  const handleExecutePhase2 = () => {
    if (executionMutation.isSuccess) {
      synthesisMutation.mutate({ 
        expertOutputs: executionMutation.data.outputs,
        task,
        ...
      });
    }
  };
  
  return (
    <>
      <button 
        onClick={handleExecutePhase1}
        disabled={executionMutation.isPending}
      >
        Execute Phase 1
      </button>
      
      {executionMutation.isSuccess && (
        <button 
          onClick={handleExecutePhase2}
          disabled={synthesisMutation.isPending}
        >
          Execute Phase 2
        </button>
      )}
    </>
  );
};
```

### Pattern 2: Update Expert

#### Before
```typescript
const { updateExpert } = useCouncilStore();

const handleChange = (index: number, name: string) => {
  updateExpert(index, { name });
};
```

#### After
```typescript
const expertMutation = useExpertMutation();

const handleChange = (index: number, name: string) => {
  expertMutation.mutate({ index, updates: { name } });
};
```

### Pattern 3: Load Persona

#### Before
```typescript
const { loadPersona } = useCouncilStore();

const handleLoadPersona = (expertIndex: number, personaId: string) => {
  loadPersona(expertIndex, personaId);
};
```

#### After
```typescript
const { loadPersona } = useCouncilExperts();

const handleLoadPersona = (expertIndex: number, personaId: string) => {
  loadPersona(expertIndex, personaId);  // Still in store (no API call)
};
```

## File Mapping

### Old Structure → New Structure

| Old File | New File(s) | Purpose |
|----------|------------|---------|
| `stores/council.store.ts` (594 lines) | `features/council/store/slices/expert-slice.ts` (~80 lines) | Expert management |
| | `features/council/store/slices/execution-slice.ts` (~60 lines) | Execution state |
| | `features/council/store/slices/ui-slice.ts` (~40 lines) | UI state |
| | `features/council/store/slices/control-slice.ts` (~60 lines) | Control settings |
| | `features/council/store/index.ts` (~30 lines) | Barrel export |
| | `features/council/hooks/use-council-execution.ts` (~80 lines) | Execution API |
| | `features/council/hooks/use-council-synthesis.ts` (~80 lines) | Synthesis API |
| | `features/council/hooks/use-expert-mutation.ts` (~60 lines) | Expert updates |

**Total**: 594 lines → ~490 lines (but better organized and with React Query benefits)

## Breaking Changes

### 1. Execution Methods

**BREAKING**: `executePhase1()` and `executePhase2()` are now React Query mutations.

```typescript
// OLD
const { executePhase1 } = useCouncilStore();
executePhase1();

// NEW
const executionMutation = useCouncilExecution();
executionMutation.mutate({ ... });
```

### 2. Synthesis Method

**BREAKING**: `executeCouncil()` is split into two phases with React Query.

```typescript
// OLD
const { executeCouncil } = useCouncilStore();
executeCouncil(synthesisMutation);

// NEW
const executionMutation = useCouncilExecution();
const synthesisMutation = useCouncilSynthesis();

executionMutation.mutate({ ... });
// Then when ready:
synthesisMutation.mutate({ ... });
```

### 3. Loading States

**BREAKING**: `isLoading` and `isSynthesizing` are now in mutation objects.

```typescript
// OLD
const { isLoading, isSynthesizing } = useCouncilStore();

// NEW
const executionMutation = useCouncilExecution();
const synthesisMutation = useCouncilSynthesis();
const isLoading = executionMutation.isPending;
const isSynthesizing = synthesisMutation.isPending;
```

## Non-Breaking Changes

These work the same as before:

- ✅ `experts`, `setExperts`, `updateExpert`
- ✅ `task`, `setTask`
- ✅ `mode`, `setMode`
- ✅ `activeExpertCount`, `setActiveExpertCount`
- ✅ `loadPersona`, `clearPersona`, `resetToDefault`
- ✅ `loadTeam`

## Testing Your Migration

### Step 1: Check TypeScript Compilation

```bash
npm run typecheck
```

Fix any type errors that appear.

### Step 2: Test in Development

```bash
npm run dev
```

Test all council execution flows:
- Execute Phase 1
- Execute Phase 2
- Full execution
- Update experts
- Load personas
- Error handling

### Step 3: Verify No Regressions

Check that existing features still work:
- [ ] Council execution completes
- [ ] Synthesis works
- [ ] Experts can be updated
- [ ] Personas can be loaded
- [ ] Cost tracking works
- [ ] Session history saves
- [ ] Error messages show

## Troubleshooting

### Problem: "Cannot read property 'mutate' of undefined"

**Solution**: Make sure you're calling the React Query hook:

```typescript
// ❌ Wrong
const { executePhase1 } = useCouncilStore();
executePhase1();  // This doesn't exist anymore!

// ✅ Correct
const executionMutation = useCouncilExecution();
executionMutation.mutate({ ... });
```

### Problem: "Loading state not updating"

**Solution**: Use React Query's loading state:

```typescript
// ❌ Wrong
const { isLoading } = useCouncilUI();  // This won't update for mutations

// ✅ Correct
const executionMutation = useCouncilExecution();
const isLoading = executionMutation.isPending;
```

### Problem: "Optimistic update not rolling back on error"

**Solution**: Make sure you're using the mutation hook:

```typescript
// ❌ Wrong
const { updateExpert } = useCouncilExperts();
updateExpert(0, { name: 'New Name' });  // No rollback on error

// ✅ Correct
const expertMutation = useExpertMutation();
expertMutation.mutate({ index: 0, updates: { name: 'New Name' } });
// Automatically rolls back if save fails!
```

### Problem: "State not persisting"

**Solution**: React Query has its own cache. For persistence, use `queryClient.setQueryData`:

```typescript
const queryClient = useQueryClient();

// Persist to cache
queryClient.setQueryData(['experts'], experts);

// Or use a mutation with onSuccess
expertMutation.mutate({ ... }, {
  onSuccess: (data) => {
    queryClient.setQueryData(['experts'], data);
  }
});
```

## Gradual Migration Strategy

You don't have to migrate everything at once! Here's a gradual approach:

### Phase 1: Import Aliases (Week 1)
```typescript
// Add this to keep old code working
export { useCouncilStore } from './legacy/council.store';
```

### Phase 2: Migrate One Component at a Time (Week 2-3)
```typescript
// Migrate the main Council component first
// Then child components
// Then utilities
```

### Phase 3: Remove Old Store (Week 4)
```typescript
// Once all migrations complete
// Delete stores/council.store.ts
// Remove legacy imports
```

## Rollback Procedure

If you need to revert:

### Option 1: Quick Revert (5 minutes)
```bash
git revert HEAD~N  # Where N is number of commits
npm install
npm run build
```

### Option 2: Feature Flag (0 minutes)
```typescript
const USE_NEW_STORE = false;  // Set to false to use old store

const Component = () => {
  if (USE_NEW_STORE) {
    // New code
    const executionMutation = useCouncilExecution();
    // ...
  } else {
    // Old code
    const { executePhase1 } = useCouncilStore();
    // ...
  }
};
```

### Option 3: Gradual Rollback (As needed)
Keep both systems running, roll back one component at a time.

## Getting Help

If you run into issues:

1. Check this migration guide
2. Check the main refactoring plan (STATE_MANAGEMENT_REFACTORING_PLAN.md)
3. Look at example components in `src/features/council/`
4. Check React Query docs: https://tanstack.com/query/latest/docs/react
5. Open an issue with details

## Example: Full Component Migration

### Before (Old Store)
```typescript
import { useCouncilStore } from '@/stores/council.store';
import { useExecuteSynthesis } from '@/features/council/hooks/use-council-queries';
import { Button } from '@/components/ui/button';

export function CouncilPanel() {
  const { 
    task, 
    setTask, 
    experts,
    isLoading,
    isSynthesizing,
    statusMessage,
    executePhase1,
    executePhase2,
    executionPhase,
  } = useCouncilStore();
  
  const synthesisMutation = useExecuteSynthesis();
  
  const handlePhase1 = () => {
    executePhase1();
  };
  
  const handlePhase2 = () => {
    executePhase2(synthesisMutation);
  };
  
  return (
    <div>
      <input value={task} onChange={(e) => setTask(e.target.value)} />
      
      <Button onClick={handlePhase1} disabled={isLoading}>
        {isLoading ? 'Running...' : 'Run Phase 1'}
      </Button>
      
      {executionPhase === 'phase1-complete' && (
        <Button onClick={handlePhase2} disabled={isSynthesizing}>
          {isSynthesizing ? 'Synthesizing...' : 'Run Phase 2'}
        </Button>
      )}
      
      {statusMessage && <div>{statusMessage}</div>}
    </div>
  );
}
```

### After (New Slices + React Query)
```typescript
import { useCouncilControl, useCouncilExperts, useCouncilExecution, useCouncilUI } from '@/features/council/store';
import { useCouncilExecution as useExecutionMutation } from '@/features/council/hooks/use-council-execution';
import { useCouncilSynthesis } from '@/features/council/hooks/use-council-synthesis';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CouncilPanel() {
  // Split state into focused hooks
  const { task, setTask } = useCouncilControl();
  const { experts } = useCouncilExperts();
  const { executionPhase } = useCouncilExecution();
  const { statusMessage } = useCouncilUI();
  
  // React Query mutations
  const executionMutation = useExecutionMutation();
  const synthesisMutation = useCouncilSynthesis();
  
  const handlePhase1 = () => {
    executionMutation.mutate({
      task,
      mode: 'parallel',
      experts,
      apiKey: getApiKey(),
      config: getConfig(),
    });
  };
  
  const handlePhase2 = () => {
    if (executionMutation.data) {
      synthesisMutation.mutate({
        expertOutputs: executionMutation.data.outputs,
        task,
        config: getConfig(),
        apiKey: getApiKey(),
      });
    }
  };
  
  return (
    <div>
      <input value={task} onChange={(e) => setTask(e.target.value)} />
      
      <Button 
        onClick={handlePhase1} 
        disabled={executionMutation.isPending}
      >
        {executionMutation.isPending ? 'Running...' : 'Run Phase 1'}
      </Button>
      
      {executionMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {executionMutation.error.message}
          </AlertDescription>
        </Alert>
      )}
      
      {executionPhase === 'phase1-complete' && (
        <Button 
          onClick={handlePhase2} 
          disabled={synthesisMutation.isPending}
        >
          {synthesisMutation.isPending ? 'Synthesizing...' : 'Run Phase 2'}
        </Button>
      )}
      
      {statusMessage && <div>{statusMessage}</div>}
    </div>
  );
}
```

## Summary

✅ **Do's**:
- Use focused hooks (`useCouncilExperts`, `useCouncilControl`, etc.)
- Use React Query mutations for API calls
- Use `mutation.isPending` for loading states
- Use `mutation.isError` for error states
- Let React Query handle optimistic updates

❌ **Don'ts**:
- Don't use `executePhase1()` directly (use mutation)
- Don't manually manage loading states
- Don't manually handle errors without React Query
- Don't mix old and new patterns in same component

**Migration Time**: ~30 minutes per component (medium complexity)

---

**Need Help?** Check STATE_MANAGEMENT_REFACTORING_PLAN.md for full details.
