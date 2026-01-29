# Error Handling Guide

This document describes the error handling patterns and utilities available in The Council application.

## Overview

The Council implements comprehensive error handling with:
- Try/catch blocks in all async functions
- User-friendly toast notifications
- Error boundaries for component isolation
- Retry logic with exponential backoff
- Custom error types for different scenarios

## Error Handler Utilities

Located in `src/lib/error-handler.ts`

### Custom Error Types

```typescript
import { APIError, ValidationError, NetworkError, TimeoutError, RateLimitError } from '@/lib/error-handler';

// API errors with automatic retry logic
throw new APIError('Failed to fetch', '/api/data', 500);

// Validation errors (not retryable)
throw new ValidationError('Invalid email format', 'email', userInput);

// Network connectivity issues (retryable)
throw new NetworkError('Connection lost');

// Timeout errors (retryable)
throw new TimeoutError('Request timed out', 30000);

// Rate limit errors with retry timing
throw new RateLimitError('Rate limit exceeded', 60);
```

### Safe Async Wrapper

The `safeAsync` function wraps async operations and returns a `{ data, error }` pattern:

```typescript
import { safeAsync } from '@/lib/error-handler';

// Basic usage
const { data, error } = await safeAsync(
  async () => await fetchUserData(userId),
  {
    errorMessage: 'Failed to load user data',
    successMessage: 'User data loaded successfully',
    showToast: true
  }
);

if (error) {
  // Handle error case
  console.error('Failed:', error);
  return;
}

// Use data
console.log('Success:', data);
```

### Retry with Toast

Automatically retry operations with exponential backoff and toast notifications:

```typescript
import { retryWithToast } from '@/lib/error-handler';

const { data, error } = await retryWithToast(
  async () => await syncDataToServer(),
  {
    maxRetries: 3,
    delayMs: 1000,
    errorMessage: 'Failed to sync data after 3 attempts',
    successMessage: 'Data synced successfully'
  }
);
```

### Error Recovery Strategies

```typescript
import { errorRecovery } from '@/lib/error-handler';

// Retry with exponential backoff
const data = await errorRecovery.retry(
  async () => await fetchData(),
  3,    // maxRetries
  1000  // initial delay in ms
);

// Fallback to alternative method
const result = await errorRecovery.withFallback(
  async () => await primaryAPI(),
  async () => await backupAPI()
);

// Graceful degradation with default value
const config = await errorRecovery.gracefulDegrade(
  async () => await loadConfig(),
  DEFAULT_CONFIG
);

// Timeout protection
const response = await errorRecovery.withTimeout(
  async () => await slowOperation(),
  5000 // 5 second timeout
);

// Circuit breaker for repeated failures
const breaker = errorRecovery.createCircuitBreaker(
  async () => await unreliableService(),
  5,     // failure threshold
  60000  // reset timeout (1 minute)
);
const result = await breaker();
```

## Component Error Handling

### Async Event Handlers

All async event handlers should use try/catch:

```typescript
const handleSave = async () => {
  try {
    await saveData(formData);
    toast.success('Data saved successfully');
  } catch (error) {
    console.error('Failed to save:', error);
    toast.error('Failed to save data');
  }
};
```

### Using safeAsync in Components

```typescript
import { safeAsync } from '@/lib/error-handler';
import { toast } from 'sonner';

const handleSubmit = async () => {
  const { data, error } = await safeAsync(
    () => submitForm(formData),
    {
      errorMessage: 'Failed to submit form',
      successMessage: 'Form submitted successfully'
    }
  );
  
  if (error) {
    // Additional error handling if needed
    setIsSubmitting(false);
    return;
  }
  
  // Handle success
  navigate('/success');
};
```

## Error Boundaries

### Root Error Boundary

The entire app is wrapped in a root error boundary (see `src/App.tsx`):

```typescript
import RootErrorBoundary from "@/components/ErrorBoundary";

<RootErrorBoundary>
  <App />
</RootErrorBoundary>
```

### Feature Error Boundary

For isolating errors to specific features:

```typescript
import { FeatureErrorBoundary } from '@/components/ErrorBoundary';

<FeatureErrorBoundary featureName="Dashboard" fallback={<CustomFallback />}>
  <DashboardComponent />
</FeatureErrorBoundary>
```

### Component-Level Error Boundaries

Example from `src/pages/Index.tsx`:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

const ComponentErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="error-container">
    <p>Error: {error.message}</p>
    <button onClick={resetErrorBoundary}>Retry</button>
  </div>
);

<ErrorBoundary FallbackComponent={ComponentErrorFallback}>
  <MyComponent />
</ErrorBoundary>
```

## Best Practices

### 1. Always Handle Async Operations

❌ **Bad:**
```typescript
const handleClick = async () => {
  await riskyOperation();
};
```

✅ **Good:**
```typescript
const handleClick = async () => {
  try {
    await riskyOperation();
    toast.success('Operation completed');
  } catch (error) {
    console.error('Operation failed:', error);
    toast.error('Operation failed');
  }
};
```

### 2. Use Specific Error Types

❌ **Bad:**
```typescript
throw new Error('Something went wrong');
```

✅ **Good:**
```typescript
throw new APIError('Failed to fetch user', '/api/users/123', 404);
```

### 3. Provide User Feedback

❌ **Bad:**
```typescript
try {
  await saveData();
} catch (error) {
  console.error(error);
}
```

✅ **Good:**
```typescript
try {
  await saveData();
  toast.success('Data saved successfully');
} catch (error) {
  console.error('Failed to save:', error);
  toast.error('Failed to save data. Please try again.');
}
```

### 4. Use safeAsync for Cleaner Code

❌ **Verbose:**
```typescript
let userData = null;
let userError = null;

try {
  userData = await fetchUser();
} catch (error) {
  userError = error;
  toast.error('Failed to load user');
}

if (userError) return;
```

✅ **Clean:**
```typescript
const { data: userData, error } = await safeAsync(
  () => fetchUser(),
  { errorMessage: 'Failed to load user' }
);

if (error) return;
```

### 5. Implement Retry Logic for Transient Failures

```typescript
// For API calls that might fail due to network issues
const { data, error } = await retryWithToast(
  () => apiClient.post('/data', payload),
  {
    maxRetries: 3,
    delayMs: 1000,
    errorMessage: 'Failed to save after 3 attempts'
  }
);
```

### 6. Log Errors with Context

```typescript
import { logError } from '@/lib/error-handler';

try {
  await complexOperation();
} catch (error) {
  logError(error as Error, {
    userId: currentUser.id,
    operation: 'dataSync',
    timestamp: Date.now()
  });
  toast.error('Operation failed');
}
```

## Testing Error Handling

### Simulating Errors

```typescript
// Test error boundaries
const ThrowError = () => {
  throw new Error('Test error');
};

// Test async error handling
const testAsyncError = async () => {
  const { error } = await safeAsync(
    async () => {
      throw new APIError('Test API error', '/test', 500);
    }
  );
  
  expect(error).toBeDefined();
  expect(error?.message).toContain('Test API error');
};
```

## Summary

- ✅ All async functions have try/catch blocks
- ✅ User-friendly toast notifications on errors
- ✅ Error boundaries prevent full app crashes
- ✅ Retry logic with exponential backoff
- ✅ Custom error types for different scenarios
- ✅ Comprehensive logging for debugging
- ✅ Graceful degradation strategies

For more information, see:
- `src/lib/error-handler.ts` - Core error handling utilities
- `src/components/ErrorBoundary.tsx` - Error boundary implementation
- Individual component files for specific error handling examples
