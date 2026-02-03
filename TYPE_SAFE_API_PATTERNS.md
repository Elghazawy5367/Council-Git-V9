# Type-Safe API Client Patterns

Complete guide to building type-safe API clients for The Council with TypeScript and Zod.

## Table of Contents

1. [Core Principles](#core-principles)
2. [API Client Architecture](#api-client-architecture)
3. [Type Definitions](#type-definitions)
4. [Zod Schema Validation](#zod-schema-validation)
5. [API Request Functions](#api-request-functions)
6. [Error Handling](#error-handling)
7. [Real-World Examples](#real-world-examples)

## Core Principles

### 1. Type Safety Everywhere
- No `any` types
- Proper generic types
- Runtime validation with Zod
- Compile-time type checking

### 2. Single Source of Truth
- Types derived from schemas
- Schemas used for validation
- No duplicate type definitions

### 3. Proper Error Handling
- Custom error classes
- Type-safe error responses
- Detailed error messages

## API Client Architecture

```
src/features/council/api/
├── client.ts           - Base API client with fetch wrapper
├── types.ts            - TypeScript type definitions
├── schemas.ts          - Zod schemas for validation
├── errors.ts           - Custom error classes
└── endpoints/
    ├── experts.ts      - Expert-related API calls
    ├── execution.ts    - Execution API calls
    └── synthesis.ts    - Synthesis API calls
```

## Type Definitions

### Base Types

```typescript
// src/features/council/api/types.ts
import { z } from 'zod';
import { 
  ExpertSchema, 
  ExecutionModeSchema,
  SynthesisConfigSchema,
  SynthesisResultSchema 
} from './schemas';

// Infer types from schemas (single source of truth)
export type Expert = z.infer<typeof ExpertSchema>;
export type ExecutionMode = z.infer<typeof ExecutionModeSchema>;
export type SynthesisConfig = z.infer<typeof SynthesisConfigSchema>;
export type SynthesisResult = z.infer<typeof SynthesisResultSchema>;

// API Request types
export interface ExecuteExpertsRequest {
  task: string;
  mode: ExecutionMode;
  experts: Expert[];
  apiKey: string;
  config: SynthesisConfig;
}

export interface ExecuteExpertsResponse {
  outputs: Record<string, ExpertOutput>;
  expertsCost: number;
  duration: number;
  success: true;
}

export interface ExpertOutput {
  expertName: string;
  output: string;
  model: string;
  tokens: {
    prompt: number;
    completion: number;
  };
  cost: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  readonly data: T;
  readonly status: number;
  readonly headers: Headers;
  readonly timestamp: Date;
}

// Error response
export interface ApiError {
  readonly message: string;
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, unknown>;
}

// Result type for operations that can fail
export type Result<T, E = Error> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: E };

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
```

## Zod Schema Validation

### Schema Definitions

```typescript
// src/features/council/api/schemas.ts
import { z } from 'zod';

// Expert schema
export const ExpertSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100),
  role: z.string().min(1, 'Role is required'),
  model: z.string().min(1, 'Model is required'),
  basePersona: z.string().optional(),
  knowledge: z.array(z.object({
    id: z.string(),
    name: z.string(),
    content: z.string(),
    type: z.enum(['file', 'url', 'text']),
  })).default([]),
  config: z.record(z.unknown()).optional(),
  modeBehavior: z.object({
    modeName: z.string(),
    description: z.string(),
    isEnabled: z.boolean(),
  }).optional(),
  output: z.string().optional(),
  isLoading: z.boolean().default(false),
  hasWebSearch: z.boolean().default(false),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  icon: z.string().optional(),
});

// Execution mode schema
export const ExecutionModeSchema = z.enum([
  'parallel',
  'synthesis',
  'debate',
  'pipeline',
]);

// Synthesis config schema
export const SynthesisConfigSchema = z.object({
  tier: z.enum(['quick', 'balanced', 'deep']),
  model: z.string().default('google/gemini-2.0-flash-001'),
  fallbackModel: z.string().default('deepseek/deepseek-chat'),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional(),
  customInstructions: z.string().optional(),
  judgeMode: z.enum([
    'ruthless-judge',
    'consensus-judge',
    'debate-judge',
    'pipeline-judge',
  ]).optional(),
});

// Synthesis result schema
export const SynthesisResultSchema = z.object({
  content: z.string().min(1),
  tier: z.enum(['quick', 'balanced', 'deep']),
  model: z.string(),
  tokens: z.object({
    prompt: z.number().int().nonnegative(),
    completion: z.number().int().nonnegative(),
  }),
  cost: z.number().nonnegative(),
});

// API request schemas
export const ExecuteExpertsRequestSchema = z.object({
  task: z.string().min(1, 'Task is required'),
  mode: ExecutionModeSchema,
  experts: z.array(ExpertSchema).min(1, 'At least one expert required'),
  apiKey: z.string().min(1, 'API key is required'),
  config: SynthesisConfigSchema,
});

export const ExecuteExpertsResponseSchema = z.object({
  outputs: z.record(z.object({
    expertName: z.string(),
    output: z.string(),
    model: z.string(),
    tokens: z.object({
      prompt: z.number(),
      completion: z.number(),
    }),
    cost: z.number(),
  })),
  expertsCost: z.number().nonnegative(),
  duration: z.number().int().nonnegative(),
  success: z.literal(true),
});

// Validation helpers
export function validateExpert(data: unknown): Expert {
  return ExpertSchema.parse(data);
}

export function validateExpertPartial(data: unknown): Partial<Expert> {
  return ExpertSchema.partial().parse(data);
}

export function validateExecuteExpertsRequest(data: unknown): ExecuteExpertsRequest {
  return ExecuteExpertsRequestSchema.parse(data);
}

export function validateSynthesisResult(data: unknown): SynthesisResult {
  return SynthesisResultSchema.parse(data);
}
```

## API Request Functions

### Base API Client

```typescript
// src/features/council/api/client.ts
import { ApiError, ApiResponse } from './types';
import { ApiClientError, ValidationError, NetworkError } from './errors';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      // Parse response
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new ApiClientError(
          data?.message || `Request failed with status ${response.status}`,
          response.status,
          data?.code,
          data?.details
        );
      }

      return {
        data: data as T,
        status: response.status,
        headers: response.headers,
        timestamp: new Date(),
      };
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError('Network request failed. Please check your connection.');
      }
      
      throw new ApiClientError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Singleton instance
export const apiClient = new ApiClient();
```

### Endpoint-Specific Functions

```typescript
// src/features/council/api/endpoints/experts.ts
import { apiClient } from '../client';
import { Expert } from '../types';
import { validateExpert, validateExpertPartial, ExpertSchema } from '../schemas';

export async function fetchExperts(): Promise<Expert[]> {
  const response = await apiClient.get<Expert[]>('/experts');
  
  // Validate response
  return response.data.map((expert) => validateExpert(expert));
}

export async function fetchExpertById(id: string): Promise<Expert> {
  const response = await apiClient.get<Expert>(`/experts/${id}`);
  
  // Validate response
  return validateExpert(response.data);
}

export async function createExpert(expert: Partial<Expert>): Promise<Expert> {
  // Validate input
  const validatedExpert = validateExpertPartial(expert);
  
  const response = await apiClient.post<Expert>('/experts', validatedExpert);
  
  // Validate response
  return validateExpert(response.data);
}

export async function updateExpert(
  id: string,
  updates: Partial<Expert>
): Promise<Expert> {
  // Validate input
  const validatedUpdates = validateExpertPartial(updates);
  
  const response = await apiClient.patch<Expert>(`/experts/${id}`, validatedUpdates);
  
  // Validate response
  return validateExpert(response.data);
}

export async function deleteExpert(id: string): Promise<void> {
  await apiClient.delete(`/experts/${id}`);
}
```

```typescript
// src/features/council/api/endpoints/execution.ts
import { apiClient } from '../client';
import { 
  ExecuteExpertsRequest, 
  ExecuteExpertsResponse 
} from '../types';
import { 
  validateExecuteExpertsRequest,
  ExecuteExpertsResponseSchema 
} from '../schemas';

export async function executeExperts(
  request: ExecuteExpertsRequest,
  onProgress?: (progress: { current: number; total: number; message: string }) => void
): Promise<ExecuteExpertsResponse> {
  // Validate input
  const validatedRequest = validateExecuteExpertsRequest(request);
  
  // For now, just make the API call
  // In a real implementation, you might use SSE or WebSockets for progress
  const response = await apiClient.post<ExecuteExpertsResponse>(
    '/council/execute-experts',
    validatedRequest
  );
  
  // Validate response
  const validatedResponse = ExecuteExpertsResponseSchema.parse(response.data);
  
  return validatedResponse;
}
```

## Error Handling

### Custom Error Classes

```typescript
// src/features/council/api/errors.ts

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiClientError';
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
    };
  }
}

export class ValidationError extends ApiClientError {
  constructor(
    message: string,
    public readonly validationErrors: Record<string, string[]>
  ) {
    super(message, 400, 'VALIDATION_ERROR', { validationErrors });
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends ApiClientError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends ApiClientError {
  constructor(message: string = 'Authorization failed') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends ApiClientError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class RateLimitError extends ApiClientError {
  constructor(
    message: string = 'Rate limit exceeded',
    public readonly retryAfter?: number
  ) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', { retryAfter });
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

// Helper to check error types
export function isApiError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isAuthError(error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError;
}
```

### Error Handling in Components

```typescript
// Example usage
import { 
  isApiError, 
  isValidationError, 
  isAuthError, 
  isRateLimitError 
} from '@/features/council/api/errors';

function handleError(error: unknown): void {
  if (isValidationError(error)) {
    // Handle validation errors
    toast.error('Validation failed', {
      description: Object.entries(error.validationErrors)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
        .join('\n'),
    });
  } else if (isAuthError(error)) {
    // Handle authentication errors
    toast.error('Authentication required', {
      action: {
        label: 'Login',
        onClick: () => router.push('/login'),
      },
    });
  } else if (isRateLimitError(error)) {
    // Handle rate limit errors
    const retryAfter = error.retryAfter 
      ? `Try again in ${error.retryAfter} seconds`
      : 'Try again later';
    toast.error('Rate limit exceeded', {
      description: retryAfter,
    });
  } else if (isApiError(error)) {
    // Handle generic API errors
    toast.error('Request failed', {
      description: error.message,
    });
  } else {
    // Handle unknown errors
    toast.error('An unexpected error occurred');
    console.error(error);
  }
}
```

## Real-World Examples

### Complete Type-Safe API Module

```typescript
// src/features/council/api/index.ts
export { apiClient, ApiClient } from './client';
export * from './types';
export * from './schemas';
export * from './errors';

// Re-export endpoint functions
export {
  fetchExperts,
  fetchExpertById,
  createExpert,
  updateExpert,
  deleteExpert,
} from './endpoints/experts';

export {
  executeExperts,
} from './endpoints/execution';

export {
  executeSynthesis,
} from './endpoints/synthesis';
```

### Usage in React Query Hook

```typescript
// src/features/council/hooks/use-experts-query.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchExperts,
  fetchExpertById,
  createExpert,
  updateExpert,
  deleteExpert,
  Expert,
} from '../api';
import { toast } from 'sonner';

export function useExperts() {
  return useQuery({
    queryKey: ['experts'],
    queryFn: fetchExperts,
    staleTime: 5 * 60 * 1000,
  });
}

export function useExpert(id: string) {
  return useQuery({
    queryKey: ['experts', id],
    queryFn: () => fetchExpertById(id),
    enabled: !!id,
  });
}

export function useCreateExpert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createExpert,
    onSuccess: (newExpert) => {
      queryClient.invalidateQueries({ queryKey: ['experts'] });
      toast.success('Expert created successfully');
    },
    onError: (error) => {
      handleError(error);
    },
  });
}

export function useUpdateExpert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Expert> }) =>
      updateExpert(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['experts'] });
      
      const previousExperts = queryClient.getQueryData<Expert[]>(['experts']);
      
      queryClient.setQueryData<Expert[]>(['experts'], (old) => {
        if (!old) return old;
        return old.map((expert) =>
          expert.id === id ? { ...expert, ...updates } : expert
        );
      });
      
      return { previousExperts };
    },
    onError: (error, variables, context) => {
      if (context?.previousExperts) {
        queryClient.setQueryData(['experts'], context.previousExperts);
      }
      handleError(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['experts'] });
    },
  });
}
```

### Usage in Component

```typescript
// src/components/ExpertManager.tsx
import { useExperts, useCreateExpert, useUpdateExpert } from '../hooks/use-experts-query';
import { Expert } from '../api/types';

export function ExpertManager() {
  const { data: experts, isLoading, isError, error } = useExperts();
  const createMutation = useCreateExpert();
  const updateMutation = useUpdateExpert();
  
  if (isLoading) return <Spinner />;
  if (isError) return <ErrorDisplay error={error} />;
  if (!experts) return null;
  
  const handleCreate = () => {
    createMutation.mutate({
      name: 'New Expert',
      role: 'Analyst',
      model: 'gpt-4',
    });
  };
  
  const handleUpdate = (id: string, name: string) => {
    updateMutation.mutate({ id, updates: { name } });
  };
  
  return (
    <div>
      <Button onClick={handleCreate} disabled={createMutation.isPending}>
        Create Expert
      </Button>
      
      {experts.map((expert) => (
        <ExpertCard
          key={expert.id}
          expert={expert}
          onUpdate={(name) => handleUpdate(expert.id, name)}
          isUpdating={updateMutation.isPending}
        />
      ))}
    </div>
  );
}
```

## Summary

Type-safe API clients provide:
- ✅ Compile-time type checking
- ✅ Runtime validation with Zod
- ✅ Custom error classes for better error handling
- ✅ Single source of truth for types
- ✅ Consistent API client interface
- ✅ Easy integration with React Query
- ✅ Better developer experience

Use these patterns for all API calls in The Council!

---

**Related Documents**:
- [State Management Refactoring Plan](./STATE_MANAGEMENT_REFACTORING_PLAN.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [React Query Examples](./REACT_QUERY_EXAMPLES.md)
