# State Management & Data Fetching Refactoring Plan

## Executive Summary

This document outlines the complete refactoring plan for The Council's state management and data fetching patterns. The goal is to split the bloated 594-line `council.store.ts` into focused slices, integrate React Query for API calls with optimistic updates, and improve TypeScript typing throughout.

## Current State Analysis

### Problems Identified

1. **Bloated Store** (`council.store.ts`: 594 lines)
   - Mixed concerns: UI state + business logic + execution + control
   - Hard to test, maintain, and understand
   - All state updates in one place

2. **Manual State Management**
   - Manual loading states
   - Manual error handling
   - No optimistic updates
   - Complex update logic scattered throughout

3. **Mixed Data Fetching**
   - Some React Query usage (`use-council-queries.ts`)
   - Most logic still in stores
   - Inconsistent patterns

4. **TypeScript Issues**
   - Some `any` types
   - Missing return types
   - Weak typing in callbacks

### Current File Structure

```
src/
├── stores/
│   ├── council.store.ts (594 lines) ⚠️ BLOATED
│   ├── ui.store.ts
│   └── analytics.store.ts
├── features/council/
│   ├── store/
│   │   ├── expert-store.ts (54 lines)
│   │   ├── execution-store.ts (258 lines)
│   │   ├── control-panel-store.ts (88 lines)
│   │   ├── memory-store.ts (137 lines)
│   │   └── feature-config-store.ts (518 lines)
│   └── hooks/
│       └── use-council-queries.ts (already using React Query!)
└── services/
    └── council.service.ts
```

## Target Architecture

### New Store Structure (Zustand Slices)

Split into **4 focused slices** + **1 barrel export**:

```
src/features/council/store/
├── slices/
│   ├── expert-slice.ts          (~80 lines)  - Expert CRUD operations
│   ├── execution-slice.ts       (~60 lines)  - Execution state (phase, loading)
│   ├── ui-slice.ts              (~40 lines)  - UI state (messages, modals)
│   └── control-slice.ts         (~60 lines)  - Task, mode, judge settings
├── index.ts                     (~30 lines)  - Combine slices + barrel export
└── selectors.ts                 (~20 lines)  - Reusable selectors
```

**Total: ~290 lines** (down from 594 lines = **51% reduction**)

### React Query Integration

```
src/features/council/api/
├── client.ts                    - Type-safe API client
├── types.ts                     - API request/response types
└── hooks/
    ├── use-council-execution.ts - Execute experts (query)
    ├── use-council-synthesis.ts - Synthesis (mutation)
    ├── use-expert-mutation.ts   - Update experts (mutation)
    └── use-optimistic-updates.ts - Optimistic UI patterns
```

### Type Safety Improvements

```
src/features/council/types/
├── state.ts                     - Store state types
├── api.ts                       - API types (requests/responses)
└── schemas.ts                   - Zod schemas for validation
```

## Implementation Plan

### Phase 1: Store Slicing (Week 1, Days 1-3)

#### Step 1.1: Create Expert Slice
```typescript
// src/features/council/store/slices/expert-slice.ts
export interface ExpertSlice {
  experts: Expert[];
  setExperts: (experts: Expert[]) => void;
  updateExpert: (index: number, expert: Partial<Expert>) => void;
  addKnowledge: (expertIndex: number, files: KnowledgeFile[]) => void;
  removeKnowledge: (expertIndex: number, fileId: string) => void;
  loadPersona: (expertIndex: number, personaId: string) => void;
  clearPersona: (expertIndex: number) => void;
  resetToDefault: () => void;
}

export const createExpertSlice: StateCreator<
  ExpertSlice & ExecutionSlice & UISlice & ControlSlice,
  [],
  [],
  ExpertSlice
> = (set, get) => ({
  experts: [],
  setExperts: (experts) => set({ experts }),
  updateExpert: (index, expertUpdates) => set((state) => ({
    experts: state.experts.map((e, i) => i === index ? { ...e, ...expertUpdates } : e)
  })),
  // ... rest of expert operations
});
```

#### Step 1.2: Create Execution Slice
```typescript
// src/features/council/store/slices/execution-slice.ts
export interface ExecutionSlice {
  executionPhase: 'idle' | 'phase1-experts' | 'phase1-complete' | 'phase2-synthesis' | 'complete';
  outputs: Record<string, string>;
  cost: CostBreakdown;
  synthesisResult: SynthesisResult | null;
  verdict: string;
  // Methods moved to React Query hooks
}
```

#### Step 1.3: Create UI Slice
```typescript
// src/features/council/store/slices/ui-slice.ts
export interface UISlice {
  isLoading: boolean;
  isSynthesizing: boolean;
  statusMessage: string;
  status: string;
  setLoading: (isLoading: boolean) => void;
  setStatusMessage: (message: string) => void;
}
```

#### Step 1.4: Create Control Slice
```typescript
// src/features/council/store/slices/control-slice.ts
export interface ControlSlice {
  task: string;
  mode: ExecutionMode;
  judgeMode: 'ruthless-judge' | 'consensus-judge' | 'debate-judge' | 'pipeline-judge';
  activeExpertCount: number;
  debateRounds: number;
  fileData: FileData | null;
  setTask: (task: string) => void;
  setMode: (mode: ExecutionMode) => void;
  setJudgeMode: (mode: string) => void;
  setActiveExpertCount: (count: number) => void;
  setDebateRounds: (rounds: number) => void;
  setFileData: (fileData: FileData | null) => void;
  loadTeam: (teamId: string) => void;
}
```

#### Step 1.5: Combine Slices
```typescript
// src/features/council/store/index.ts
import { create } from 'zustand';
import { createExpertSlice } from './slices/expert-slice';
import { createExecutionSlice } from './slices/execution-slice';
import { createUISlice } from './slices/ui-slice';
import { createControlSlice } from './slices/control-slice';

export const useCouncilStore = create<
  ExpertSlice & ExecutionSlice & UISlice & ControlSlice
>((...a) => ({
  ...createExpertSlice(...a),
  ...createExecutionSlice(...a),
  ...createUISlice(...a),
  ...createControlSlice(...a),
}));

// Backward-compatible exports
export const useCouncilExperts = () => useCouncilStore((state) => ({
  experts: state.experts,
  setExperts: state.setExperts,
  updateExpert: state.updateExpert,
  // ...
}));

export const useCouncilExecution = () => useCouncilStore((state) => ({
  executionPhase: state.executionPhase,
  outputs: state.outputs,
  cost: state.cost,
  // ...
}));

export const useCouncilUI = () => useCouncilStore((state) => ({
  isLoading: state.isLoading,
  statusMessage: state.statusMessage,
  // ...
}));

export const useCouncilControl = () => useCouncilStore((state) => ({
  task: state.task,
  mode: state.mode,
  setTask: state.setTask,
  // ...
}));
```

### Phase 2: React Query Integration (Week 1, Days 4-5)

#### Step 2.1: Create Type-Safe API Client
```typescript
// src/features/council/api/client.ts
import { z } from 'zod';
import { Expert, ExecutionMode, SynthesisConfig } from '../types';

// Request types
export const ExecuteExpertsRequestSchema = z.object({
  task: z.string().min(1),
  mode: z.enum(['parallel', 'synthesis', 'debate', 'pipeline']),
  experts: z.array(z.any()), // TODO: Define ExpertSchema
  apiKey: z.string(),
  config: z.any(), // TODO: Define ConfigSchema
});

export type ExecuteExpertsRequest = z.infer<typeof ExecuteExpertsRequestSchema>;

// Response types
export interface ExecuteExpertsResponse {
  outputs: Record<string, { expertName: string; output: string; model: string }>;
  expertsCost: number;
  success: boolean;
  error?: Error;
}

export interface SynthesisRequest {
  expertOutputs: Array<{ name: string; model: string; content: string }>;
  task: string;
  config: SynthesisConfig;
  apiKey: string;
}

export interface SynthesisResponse {
  content: string;
  tier: string;
  model: string;
  tokens: { prompt: number; completion: number };
  cost: number;
}

// API functions
export async function executeExperts(
  request: ExecuteExpertsRequest,
  onProgress?: (index: number, update: { output?: string; isLoading?: boolean }) => void,
  onStatusUpdate?: (message: string) => void
): Promise<ExecuteExpertsResponse> {
  // Validate request
  ExecuteExpertsRequestSchema.parse(request);
  
  // Import service
  const * as councilService = await import('@/services/council.service');
  
  return councilService.executeCouncilExperts(
    {
      task: request.task,
      mode: request.mode,
      activeExperts: request.experts,
      apiKey: request.apiKey,
      synthesisConfig: request.config,
    },
    onProgress,
    onStatusUpdate
  );
}

export async function executeSynthesis(
  request: SynthesisRequest
): Promise<SynthesisResponse> {
  const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
  
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${request.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "The Council V18 - Synthesizer"
    },
    body: JSON.stringify({
      model: request.config.model || 'google/gemini-2.0-flash-001',
      messages: [{
        role: "user",
        content: buildSynthesisPrompt(request.expertOutputs, request.task, request.config)
      }],
      temperature: request.config.temperature,
      max_tokens: request.config.maxTokens
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    content: data.choices?.[0]?.message?.content || "Synthesis failed",
    tier: request.config.tier,
    model: request.config.model || 'google/gemini-2.0-flash-001',
    tokens: {
      prompt: data.usage?.prompt_tokens || 0,
      completion: data.usage?.completion_tokens || 0
    },
    cost: calculateCost(data.usage, request.config.model)
  };
}
```

#### Step 2.2: Create React Query Hooks
```typescript
// src/features/council/hooks/use-council-execution.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { executeExperts, ExecuteExpertsRequest } from '../api/client';
import { useCouncilStore } from '../store';
import { toast } from 'sonner';

export function useCouncilExecution() {
  const queryClient = useQueryClient();
  const { setLoading, setStatusMessage, updateExpert } = useCouncilStore();
  
  return useMutation({
    mutationKey: ['council-execution'],
    mutationFn: async (request: ExecuteExpertsRequest) => {
      return executeExperts(
        request,
        // onProgress
        (index, update) => {
          updateExpert(index, update);
        },
        // onStatusUpdate
        (message) => {
          setStatusMessage(message);
        }
      );
    },
    onMutate: async () => {
      setLoading(true);
      setStatusMessage('Initializing Council...');
    },
    onSuccess: (data) => {
      setLoading(false);
      setStatusMessage('Phase 1 Complete!');
      toast.success('Phase 1 Complete! Ready for synthesis.');
      
      // Update cache
      queryClient.setQueryData(['council-outputs'], data.outputs);
    },
    onError: (error) => {
      setLoading(false);
      setStatusMessage('');
      toast.error('Execution Failed', { description: error.message });
    },
    retry: 1,
    retryDelay: 1000,
  });
}
```

```typescript
// src/features/council/hooks/use-council-synthesis.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { executeSynthesis, SynthesisRequest } from '../api/client';
import { useCouncilStore } from '../store';
import { toast } from 'sonner';

export function useCouncilSynthesis() {
  const queryClient = useQueryClient();
  const { setLoading, setStatusMessage } = useCouncilStore();
  
  return useMutation({
    mutationKey: ['council-synthesis'],
    mutationFn: executeSynthesis,
    onMutate: async () => {
      setLoading(true);
      setStatusMessage('Synthesizing insights...');
      
      // Optimistic update: show loading state
      queryClient.setQueryData(['synthesis-result'], { loading: true });
    },
    onSuccess: (data) => {
      setLoading(false);
      setStatusMessage('Analysis complete');
      toast.success('Council analysis complete!');
      
      // Update cache
      queryClient.setQueryData(['synthesis-result'], data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['council-history'] });
    },
    onError: (error, variables, context) => {
      setLoading(false);
      setStatusMessage('');
      toast.error('Synthesis Failed', { description: error.message });
      
      // Rollback optimistic update
      queryClient.setQueryData(['synthesis-result'], null);
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
```

```typescript
// src/features/council/hooks/use-expert-mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCouncilStore } from '../store';

export function useExpertMutation() {
  const queryClient = useQueryClient();
  const { updateExpert } = useCouncilStore();
  
  return useMutation({
    mutationKey: ['update-expert'],
    mutationFn: async ({ index, updates }: { index: number; updates: Partial<Expert> }) => {
      // API call if needed (e.g., save to backend)
      // For now, just update local state
      return { index, updates };
    },
    onMutate: async ({ index, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['experts'] });
      
      // Snapshot previous value
      const previousExperts = queryClient.getQueryData(['experts']);
      
      // Optimistically update
      updateExpert(index, updates);
      queryClient.setQueryData(['experts'], (old: Expert[] | undefined) => {
        if (!old) return old;
        return old.map((expert, i) => i === index ? { ...expert, ...updates } : expert);
      });
      
      return { previousExperts };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousExperts) {
        queryClient.setQueryData(['experts'], context.previousExperts);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['experts'] });
    },
  });
}
```

### Phase 3: TypeScript Improvements (Week 2, Days 1-2)

#### Step 3.1: Strengthen Types
```typescript
// src/features/council/types/state.ts
import { Expert, ExecutionMode, SynthesisResult } from './models';

// Discriminated union for execution phases
export type ExecutionPhase =
  | { type: 'idle' }
  | { type: 'phase1-experts'; progress: number }
  | { type: 'phase1-complete'; outputs: Record<string, string> }
  | { type: 'phase2-synthesis'; progress: number }
  | { type: 'complete'; result: SynthesisResult };

// Strict cost breakdown
export interface CostBreakdown {
  readonly experts: number;
  readonly synthesis: number;
  readonly total: number;
}

// Result types with proper error handling
export type ExecutionResult<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: Error };

// API response wrapper
export interface ApiResponse<T> {
  readonly data: T;
  readonly status: number;
  readonly timestamp: Date;
}
```

#### Step 3.2: Add Zod Schemas
```typescript
// src/features/council/types/schemas.ts
import { z } from 'zod';

export const ExpertSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  role: z.string().min(1),
  model: z.string(),
  basePersona: z.string().optional(),
  knowledge: z.array(z.any()).default([]),
  config: z.record(z.any()).optional(),
  output: z.string().optional(),
  isLoading: z.boolean().default(false),
});

export const ExecutionModeSchema = z.enum(['parallel', 'synthesis', 'debate', 'pipeline']);

export const CostBreakdownSchema = z.object({
  experts: z.number().nonnegative(),
  synthesis: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

export const SynthesisResultSchema = z.object({
  content: z.string(),
  tier: z.string(),
  model: z.string(),
  tokens: z.object({
    prompt: z.number().int().nonnegative(),
    completion: z.number().int().nonnegative(),
  }),
  cost: z.number().nonnegative(),
});

// Runtime validation helper
export function validateExpert(data: unknown): Expert {
  return ExpertSchema.parse(data);
}

export function validateSynthesisResult(data: unknown): SynthesisResult {
  return SynthesisResultSchema.parse(data);
}
```

### Phase 4: Migration & Testing (Week 2, Days 3-5)

#### Step 4.1: Create Migration Script
```typescript
// scripts/migrate-council-store.ts
/**
 * Migration script to help transition from old store to new slices
 * 
 * Usage: npx tsx scripts/migrate-council-store.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const REPLACEMENTS = [
  // Old -> New imports
  { from: "import { useCouncilStore } from '@/stores/council.store'", to: "import { useCouncilStore, useCouncilExperts, useCouncilExecution } from '@/features/council/store'" },
  
  // Old -> New hook names (if needed)
  { from: "useCouncilStore()", to: "useCouncilStore()" },
  
  // Update execution methods to use React Query
  { from: "executePhase1()", to: "executionMutation.mutate({ ... })" },
  { from: "executePhase2()", to: "synthesisMutation.mutate({ ... })" },
];

function migrateFile(filePath: string): void {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  REPLACEMENTS.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from, 'g'), to);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Migrated: ${filePath}`);
  }
}

// Find all files that import council store
const srcDir = path.join(process.cwd(), 'src');
// ... implement file traversal and migration
```

#### Step 4.2: Testing Strategy
```typescript
// src/features/council/store/__tests__/expert-slice.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCouncilStore } from '../index';

describe('Expert Slice', () => {
  beforeEach(() => {
    // Reset store state
    useCouncilStore.setState({ experts: [] });
  });
  
  it('should add expert', () => {
    const { result } = renderHook(() => useCouncilStore());
    
    act(() => {
      result.current.setExperts([{
        id: '1',
        name: 'Test Expert',
        role: 'Analyst',
        model: 'gpt-4',
      }]);
    });
    
    expect(result.current.experts).toHaveLength(1);
    expect(result.current.experts[0].name).toBe('Test Expert');
  });
  
  it('should update expert', () => {
    const { result } = renderHook(() => useCouncilStore());
    
    act(() => {
      result.current.setExperts([{
        id: '1',
        name: 'Test Expert',
        role: 'Analyst',
        model: 'gpt-4',
      }]);
    });
    
    act(() => {
      result.current.updateExpert(0, { name: 'Updated Expert' });
    });
    
    expect(result.current.experts[0].name).toBe('Updated Expert');
  });
});
```

## Benefits of This Refactoring

### Code Quality
- ✅ **51% code reduction** (594 → 290 lines)
- ✅ **Separation of concerns** (UI, business logic, API)
- ✅ **Easier to test** (focused slices)
- ✅ **Better maintainability** (smaller files)

### Developer Experience
- ✅ **Type safety** (Zod schemas, strict types)
- ✅ **Better intellisense** (explicit types)
- ✅ **Clearer patterns** (React Query conventions)
- ✅ **Easier onboarding** (standard patterns)

### User Experience
- ✅ **Optimistic updates** (instant feedback)
- ✅ **Better error handling** (automatic retries)
- ✅ **Loading states** (automatic from React Query)
- ✅ **Caching** (avoid unnecessary API calls)

### Performance
- ✅ **Selective re-renders** (fine-grained selectors)
- ✅ **Request deduplication** (React Query)
- ✅ **Background refetching** (keep data fresh)
- ✅ **Stale-while-revalidate** (instant + fresh)

## Migration Timeline

### Week 1
- **Day 1-3**: Create store slices, combine, test
- **Day 4-5**: Create API client, React Query hooks

### Week 2
- **Day 1-2**: TypeScript improvements, Zod schemas
- **Day 3**: Migration script, backward compatibility
- **Day 4-5**: Testing, documentation, final polish

### Total Effort
**10 working days** (part-time development)

## Rollback Plan

### If Issues Arise

1. **Keep old store** (`council.store.ts` → `council.store.legacy.ts`)
2. **Feature flag** for new vs old system
3. **Gradual migration** (one feature at a time)
4. **A/B testing** (some users on new, some on old)
5. **Quick revert** (`git revert` + rebuild)

### Rollback Procedure
```bash
# If new system has issues
git revert HEAD~10..HEAD  # Revert last 10 commits
npm run build
npm run deploy

# If partial rollback needed
# Use feature flag in code:
const USE_NEW_STORE = false;  // Switch back to old
```

## Success Metrics

### Code Metrics
- [ ] Store size reduced by 50%+
- [ ] TypeScript strict mode enabled
- [ ] Zero `any` types in new code
- [ ] 90%+ test coverage on slices

### Performance Metrics
- [ ] Faster re-renders (measured with React DevTools)
- [ ] Fewer API calls (React Query deduplication)
- [ ] Better UX (optimistic updates working)

### Developer Metrics
- [ ] Faster feature development (clearer patterns)
- [ ] Fewer bugs (type safety)
- [ ] Easier debugging (focused slices)

## Next Steps

1. ✅ Review this plan
2. ✅ Approve architecture
3. ⬜ Start Phase 1 (store slicing)
4. ⬜ Implement Phase 2 (React Query)
5. ⬜ Complete Phase 3 (TypeScript)
6. ⬜ Test Phase 4 (migration)
7. ⬜ Deploy to production

## Questions & Concerns

### Q: Will this break existing features?
**A**: No. We'll maintain backward compatibility with barrel exports and gradual migration.

### Q: Is this too much work for the benefit?
**A**: 51% code reduction, better UX with optimistic updates, and proper patterns are worth 10 days.

### Q: What if React Query doesn't work for our use case?
**A**: We can keep some logic in stores. React Query is for API calls, stores for local state.

### Q: How do we test this?
**A**: Unit tests for slices, integration tests for React Query hooks, E2E tests for full flow.

## Additional Resources

- [Zustand Slices Pattern](https://docs.pmnd.rs/zustand/guides/slices-pattern)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/best-practices)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [Zod Runtime Validation](https://zod.dev)

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-03  
**Author**: Council Refactoring Team  
**Status**: Ready for Review
