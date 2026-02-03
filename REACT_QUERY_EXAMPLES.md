# React Query Integration Examples

Complete examples showing how to use React Query with The Council.

## Table of Contents

1. [Basic Query Example](#basic-query-example)
2. [Mutation with Optimistic Updates](#mutation-with-optimistic-updates)
3. [Chained Mutations (Phase 1 → Phase 2)](#chained-mutations)
4. [Error Handling & Retry Logic](#error-handling--retry-logic)
5. [Caching & Invalidation](#caching--invalidation)
6. [Real-World Component Examples](#real-world-component-examples)

## Basic Query Example

### Fetching Expert Outputs

```typescript
// src/features/council/hooks/use-expert-outputs.ts
import { useQuery } from '@tanstack/react-query';

export function useExpertOutputs(sessionId: string) {
  return useQuery({
    queryKey: ['expert-outputs', sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/sessions/${sessionId}/outputs`);
      if (!response.ok) throw new Error('Failed to fetch outputs');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Usage in component
function ExpertOutputsView({ sessionId }: { sessionId: string }) {
  const { data, isLoading, isError, error } = useExpertOutputs(sessionId);
  
  if (isLoading) return <Spinner />;
  if (isError) return <Error message={error.message} />;
  
  return (
    <div>
      {data.outputs.map((output) => (
        <ExpertCard key={output.id} output={output} />
      ))}
    </div>
  );
}
```

## Mutation with Optimistic Updates

### Updating Expert Name (Instant Feedback)

```typescript
// src/features/council/hooks/use-update-expert.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Expert } from '../types';

interface UpdateExpertParams {
  expertId: string;
  updates: Partial<Expert>;
}

export function useUpdateExpert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['update-expert'],
    mutationFn: async ({ expertId, updates }: UpdateExpertParams) => {
      const response = await fetch(`/api/experts/${expertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error('Failed to update expert');
      return response.json();
    },
    
    // Optimistic update
    onMutate: async ({ expertId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['experts'] });
      
      // Snapshot the previous value
      const previousExperts = queryClient.getQueryData<Expert[]>(['experts']);
      
      // Optimistically update to the new value
      queryClient.setQueryData<Expert[]>(['experts'], (old) => {
        if (!old) return old;
        return old.map((expert) =>
          expert.id === expertId ? { ...expert, ...updates } : expert
        );
      });
      
      // Return context with the snapshot
      return { previousExperts };
    },
    
    // If mutation fails, use the context to roll back
    onError: (err, variables, context) => {
      if (context?.previousExperts) {
        queryClient.setQueryData(['experts'], context.previousExperts);
      }
      toast.error('Failed to update expert', { description: err.message });
    },
    
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['experts'] });
    },
    
    // Success feedback
    onSuccess: () => {
      toast.success('Expert updated successfully');
    },
  });
}

// Usage in component
function ExpertEditor({ expert }: { expert: Expert }) {
  const updateMutation = useUpdateExpert();
  
  const handleNameChange = (name: string) => {
    updateMutation.mutate({
      expertId: expert.id,
      updates: { name },
    });
  };
  
  return (
    <Input
      value={expert.name}
      onChange={(e) => handleNameChange(e.target.value)}
      disabled={updateMutation.isPending}
    />
  );
}
```

## Chained Mutations

### Phase 1 → Phase 2 Execution

```typescript
// src/features/council/hooks/use-council-flow.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCouncilFlow() {
  const queryClient = useQueryClient();
  
  // Phase 1: Execute all experts
  const phase1Mutation = useMutation({
    mutationKey: ['council-phase1'],
    mutationFn: async ({ task, experts, config }) => {
      const response = await fetch('/api/council/execute-experts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, experts, config }),
      });
      
      if (!response.ok) throw new Error('Phase 1 failed');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['expert-outputs'], data.outputs);
      toast.success('Phase 1 Complete! Ready for synthesis.');
    },
    retry: 1,
    retryDelay: 2000,
  });
  
  // Phase 2: Synthesize outputs
  const phase2Mutation = useMutation({
    mutationKey: ['council-phase2'],
    mutationFn: async ({ outputs, task, config }) => {
      const response = await fetch('/api/council/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outputs, task, config }),
      });
      
      if (!response.ok) throw new Error('Synthesis failed');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['synthesis-result'], data);
      toast.success('Council analysis complete!');
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  
  // Convenience method to run both phases
  const executeFullCouncil = async (params: any) => {
    try {
      // Phase 1
      const phase1Result = await phase1Mutation.mutateAsync(params);
      
      // Phase 2 (only if Phase 1 succeeds)
      const phase2Result = await phase2Mutation.mutateAsync({
        outputs: phase1Result.outputs,
        task: params.task,
        config: params.config,
      });
      
      return { phase1: phase1Result, phase2: phase2Result };
    } catch (error) {
      console.error('Council execution failed:', error);
      throw error;
    }
  };
  
  return {
    phase1Mutation,
    phase2Mutation,
    executeFullCouncil,
    isExecuting: phase1Mutation.isPending || phase2Mutation.isPending,
  };
}

// Usage in component
function CouncilExecutor() {
  const { task } = useCouncilControl();
  const { experts } = useCouncilExperts();
  const { phase1Mutation, phase2Mutation, executeFullCouncil } = useCouncilFlow();
  
  const handleFullExecution = () => {
    executeFullCouncil({
      task,
      experts,
      config: getConfig(),
    });
  };
  
  const handlePhase1Only = () => {
    phase1Mutation.mutate({
      task,
      experts,
      config: getConfig(),
    });
  };
  
  const handlePhase2 = () => {
    if (phase1Mutation.data) {
      phase2Mutation.mutate({
        outputs: phase1Mutation.data.outputs,
        task,
        config: getConfig(),
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <Button 
        onClick={handlePhase1Only}
        disabled={phase1Mutation.isPending}
      >
        {phase1Mutation.isPending ? 'Executing Experts...' : 'Run Phase 1'}
      </Button>
      
      {phase1Mutation.isSuccess && (
        <Button 
          onClick={handlePhase2}
          disabled={phase2Mutation.isPending}
        >
          {phase2Mutation.isPending ? 'Synthesizing...' : 'Run Phase 2'}
        </Button>
      )}
      
      <Button
        onClick={handleFullExecution}
        disabled={phase1Mutation.isPending || phase2Mutation.isPending}
      >
        Run Full Council
      </Button>
    </div>
  );
}
```

## Error Handling & Retry Logic

### Advanced Error Handling

```typescript
// src/features/council/hooks/use-council-execution-with-fallback.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCouncilExecutionWithFallback() {
  return useMutation({
    mutationKey: ['council-execution'],
    mutationFn: async ({ task, experts, primaryModel, fallbackModel }) => {
      try {
        // Try primary model
        const response = await fetch('/api/council/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task,
            experts,
            model: primaryModel,
          }),
        });
        
        if (!response.ok) throw new Error('Primary model failed');
        return { ...await response.json(), model: primaryModel };
      } catch (error) {
        // Fallback to secondary model
        toast.info('Retrying with fallback model...');
        
        const response = await fetch('/api/council/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task,
            experts,
            model: fallbackModel,
          }),
        });
        
        if (!response.ok) throw new Error('Both models failed');
        return { ...await response.json(), model: fallbackModel };
      }
    },
    
    // Custom retry logic
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error.message.includes('401')) return false;
      
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s, 8s (max)
      return Math.min(1000 * 2 ** attemptIndex, 8000);
    },
    
    // Error callback with detailed handling
    onError: (error, variables, context) => {
      if (error.message.includes('401')) {
        toast.error('Authentication failed', {
          description: 'Please check your API key',
          action: {
            label: 'Settings',
            onClick: () => openSettings(),
          },
        });
      } else if (error.message.includes('rate limit')) {
        toast.error('Rate limit exceeded', {
          description: 'Please wait a moment and try again',
        });
      } else {
        toast.error('Execution failed', {
          description: error.message,
        });
      }
    },
  });
}

// Usage
function ExecutorWithFallback() {
  const mutation = useCouncilExecutionWithFallback();
  
  const handleExecute = () => {
    mutation.mutate({
      task: 'Analyze this data',
      experts: getExperts(),
      primaryModel: 'gpt-4',
      fallbackModel: 'gpt-3.5-turbo',
    });
  };
  
  return (
    <div>
      <Button onClick={handleExecute} disabled={mutation.isPending}>
        Execute
      </Button>
      
      {mutation.isError && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {mutation.error.message}
            <Button onClick={() => mutation.reset()}>Try Again</Button>
          </AlertDescription>
        </Alert>
      )}
      
      {mutation.isSuccess && (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Executed with {mutation.data.model}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

## Caching & Invalidation

### Smart Cache Management

```typescript
// src/features/council/hooks/use-council-cache.ts
import { useQueryClient } from '@tanstack/react-query';

export function useCouncilCache() {
  const queryClient = useQueryClient();
  
  const invalidateExpertOutputs = () => {
    queryClient.invalidateQueries({ queryKey: ['expert-outputs'] });
  };
  
  const invalidateSynthesis = () => {
    queryClient.invalidateQueries({ queryKey: ['synthesis-result'] });
  };
  
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['council'] });
  };
  
  const prefetchExpertOutputs = async (sessionId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['expert-outputs', sessionId],
      queryFn: () => fetchExpertOutputs(sessionId),
      staleTime: 5 * 60 * 1000,
    });
  };
  
  const getExpertOutputs = (sessionId: string) => {
    return queryClient.getQueryData(['expert-outputs', sessionId]);
  };
  
  const setExpertOutputs = (sessionId: string, data: any) => {
    queryClient.setQueryData(['expert-outputs', sessionId], data);
  };
  
  return {
    invalidateExpertOutputs,
    invalidateSynthesis,
    invalidateAll,
    prefetchExpertOutputs,
    getExpertOutputs,
    setExpertOutputs,
  };
}

// Usage: Prefetch on hover
function SessionList({ sessions }: { sessions: Session[] }) {
  const { prefetchExpertOutputs } = useCouncilCache();
  
  return (
    <div>
      {sessions.map((session) => (
        <div
          key={session.id}
          onMouseEnter={() => prefetchExpertOutputs(session.id)}
        >
          <SessionCard session={session} />
        </div>
      ))}
    </div>
  );
}
```

## Real-World Component Examples

### Complete Council Panel with React Query

```typescript
// src/components/CouncilPanel.tsx
import { useState } from 'react';
import { useCouncilStore } from '@/features/council/store';
import { useCouncilFlow } from '@/features/council/hooks/use-council-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export function CouncilPanel() {
  const { task, setTask, experts } = useCouncilStore();
  const { phase1Mutation, phase2Mutation, executeFullCouncil, isExecuting } = useCouncilFlow();
  
  const [executionMode, setExecutionMode] = useState<'phased' | 'full'>('phased');
  
  const handlePhase1 = () => {
    phase1Mutation.mutate({
      task,
      experts,
      config: getConfig(),
    });
  };
  
  const handlePhase2 = () => {
    if (phase1Mutation.data) {
      phase2Mutation.mutate({
        outputs: phase1Mutation.data.outputs,
        task,
        config: getConfig(),
      });
    }
  };
  
  const handleFullExecution = () => {
    executeFullCouncil({
      task,
      experts,
      config: getConfig(),
    });
  };
  
  const progress = phase1Mutation.isPending ? 50 : phase2Mutation.isPending ? 75 : 100;
  
  return (
    <div className="space-y-6">
      <div>
        <label>Task</label>
        <Input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter your task..."
          disabled={isExecuting}
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={executionMode === 'phased' ? handlePhase1 : handleFullExecution}
          disabled={isExecuting || !task.trim()}
        >
          {executionMode === 'phased' ? 'Run Phase 1' : 'Run Full Council'}
        </Button>
        
        {executionMode === 'phased' && phase1Mutation.isSuccess && (
          <Button
            onClick={handlePhase2}
            disabled={phase2Mutation.isPending}
          >
            Run Phase 2
          </Button>
        )}
      </div>
      
      {isExecuting && (
        <div>
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground mt-2">
            {phase1Mutation.isPending && 'Executing experts...'}
            {phase2Mutation.isPending && 'Synthesizing results...'}
          </p>
        </div>
      )}
      
      {phase1Mutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            Phase 1 failed: {phase1Mutation.error.message}
          </AlertDescription>
        </Alert>
      )}
      
      {phase2Mutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            Phase 2 failed: {phase2Mutation.error.message}
          </AlertDescription>
        </Alert>
      )}
      
      {phase1Mutation.isSuccess && (
        <Alert>
          <AlertDescription>
            Phase 1 complete! {Object.keys(phase1Mutation.data.outputs).length} experts responded.
          </AlertDescription>
        </Alert>
      )}
      
      {phase2Mutation.isSuccess && (
        <Alert>
          <AlertDescription>
            Synthesis complete!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

### Expert List with Optimistic Updates

```typescript
// src/components/ExpertList.tsx
import { useCouncilStore } from '@/features/council/store';
import { useUpdateExpert } from '@/features/council/hooks/use-update-expert';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function ExpertList() {
  const { experts } = useCouncilStore();
  const updateMutation = useUpdateExpert();
  
  const handleUpdateName = (expertId: string, name: string) => {
    updateMutation.mutate({
      expertId,
      updates: { name },
    });
  };
  
  return (
    <div className="space-y-4">
      {experts.map((expert) => (
        <Card key={expert.id} className="p-4">
          <div className="flex items-center gap-4">
            <Input
              value={expert.name}
              onChange={(e) => handleUpdateName(expert.id, e.target.value)}
              className="flex-1"
              disabled={updateMutation.isPending}
            />
            
            <Badge variant="outline">{expert.model}</Badge>
            
            {updateMutation.isPending && (
              <Badge variant="secondary">Saving...</Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
```

## Best Practices

### 1. Always Handle Loading States

```typescript
if (query.isLoading) return <Skeleton />;
if (query.isError) return <Error error={query.error} />;
if (!query.data) return null;

// Render with data
return <Component data={query.data} />;
```

### 2. Use Optimistic Updates for Better UX

```typescript
onMutate: async (newData) => {
  // Cancel refetches
  await queryClient.cancelQueries({ queryKey: ['data'] });
  
  // Snapshot previous value
  const previous = queryClient.getQueryData(['data']);
  
  // Optimistically update
  queryClient.setQueryData(['data'], newData);
  
  return { previous };
},
onError: (err, newData, context) => {
  // Rollback
  queryClient.setQueryData(['data'], context.previous);
},
```

### 3. Invalidate Related Queries

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['related-data'] });
},
```

### 4. Use Proper staleTime and gcTime

```typescript
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 5 * 60 * 1000,  // 5 minutes (data considered fresh)
  gcTime: 10 * 60 * 1000,    // 10 minutes (cache retention)
});
```

### 5. Implement Retry Logic

```typescript
retry: (failureCount, error) => {
  // Don't retry auth errors
  if (error.message.includes('401')) return false;
  
  // Retry other errors up to 3 times
  return failureCount < 3;
},
retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
```

## Summary

React Query provides:
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Automatic retry logic
- ✅ Loading/error states
- ✅ Request deduplication
- ✅ Query invalidation

Use it for all API calls in The Council!

---

**More Resources**:
- [React Query Docs](https://tanstack.com/query/latest/docs/react)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [Migration Guide](./MIGRATION_GUIDE.md)
