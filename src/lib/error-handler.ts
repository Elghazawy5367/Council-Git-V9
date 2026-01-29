/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Global Error Handler
 * Mirrors: Sentry error handling patterns
 * Prevents app crashes, logs errors, provides recovery
 * 
 * Usage:
 * - throw new APIError("Failed to fetch", "/api/endpoint", 429)
 * - await errorRecovery.retry(() => fetchData())
 * - const data = await errorRecovery.gracefulDegrade(() => riskyOperation(), fallbackValue)
 */

export class AppError extends Error {
  constructor(message: string, public code: string, public statusCode: number = 500, public isRetryable: boolean = false, public context?: Record<string, any>) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace?.(this, this.constructor);
  }
}
export class APIError extends AppError {
  constructor(message: string, public endpoint: string, statusCode: number = 500, public method: string = 'GET') {
    super(message, 'API_ERROR', statusCode, statusCode >= 500 || statusCode === 429,
    // Retry on server errors or rate limits
    {
      endpoint,
      method
    });
  }
}
export class ValidationError extends AppError {
  constructor(message: string, public field?: string, public value?: any) {
    super(message, 'VALIDATION_ERROR', 400, false, {
      field,
      value
    });
  }
}
export class NetworkError extends AppError {
  constructor(message: string = 'Network connection failed') {
    super(message, 'NETWORK_ERROR', 0, true);
  }
}
export class TimeoutError extends AppError {
  constructor(message: string = 'Request timed out', timeoutMs: number = 0) {
    super(message, 'TIMEOUT_ERROR', 408, true, {
      timeoutMs
    });
  }
}
export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', public retryAfter?: number) {
    super(message, 'RATE_LIMIT_ERROR', 429, true, {
      retryAfter
    });
  }
}

/**
 * Error Recovery Strategies
 * Provides resilient error handling patterns
 */
export const errorRecovery = {
  /**
   * Retry a function with exponential backoff
   * @param fn Function to retry
   * @param maxRetries Maximum number of retry attempts
   * @param delayMs Initial delay in milliseconds
   * @param backoffMultiplier Multiplier for exponential backoff (default: 2)
   */
  async retry<T>(fn: () => Promise<T>, maxRetries: number = 3, delayMs: number = 1000, backoffMultiplier: number = 2): Promise<T> {
    let lastError: Error;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // Don't retry non-retryable errors
        if (error instanceof AppError && !error.isRetryable) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt < maxRetries - 1) {
          // Handle rate limit errors specially
          let waitTime = delayMs * Math.pow(backoffMultiplier, attempt);
          if (error instanceof RateLimitError && error.retryAfter) {
            waitTime = error.retryAfter * 1000; // Convert to ms
          }
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }
    console.error(`[ErrorRecovery] All ${maxRetries} attempts failed`, lastError!);
    throw lastError!;
  },
  /**
   * Try primary function, fall back to secondary on failure
   * @param primary Primary function to attempt
   * @param fallback Fallback function to use if primary fails
   */
  async withFallback<T>(primary: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    try {
      return await primary();
    } catch (error) {
      return await fallback();
    }
  },
  /**
   * Execute function and return default value on failure
   * @param fn Function to execute
   * @param defaultValue Default value to return on failure
   */
  async gracefulDegrade<T>(fn: () => Promise<T>, defaultValue: T): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      console.error('[ErrorRecovery] Operation failed, using default value:', error);
      return defaultValue;
    }
  },
  /**
   * Execute function with timeout
   * @param fn Function to execute
   * @param timeoutMs Timeout in milliseconds
   */
  async withTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([fn(), new Promise<T>((_, reject) => setTimeout(() => reject(new TimeoutError(`Operation timed out after ${timeoutMs}ms`, timeoutMs)), timeoutMs))]);
  },
  /**
   * Circuit breaker pattern - stop trying after too many failures
   * @param fn Function to execute
   * @param failureThreshold Number of failures before opening circuit
   * @param resetTimeoutMs Time to wait before attempting to close circuit
   */
  createCircuitBreaker<T>(fn: () => Promise<T>, failureThreshold: number = 5, resetTimeoutMs: number = 60000) {
    let failures = 0;
    let lastFailureTime = 0;
    let state: 'closed' | 'open' | 'half-open' = 'closed';
    return async (): Promise<T> => {
      // Check if circuit should be half-open (try again after timeout)
      if (state === 'open' && Date.now() - lastFailureTime > resetTimeoutMs) {
        state = 'half-open';
        failures = 0;
      }

      // Reject immediately if circuit is open
      if (state === 'open') {
        throw new AppError('Circuit breaker is open - too many failures', 'CIRCUIT_OPEN', 503, false, {
          failures,
          lastFailureTime
        });
      }
      try {
        const result = await fn();

        // Success - close circuit
        if (state === 'half-open') {
          state = 'closed';
          failures = 0;
        }
        return result;
      } catch (error) {
        failures++;
        lastFailureTime = Date.now();

        // Open circuit if threshold reached
        if (failures >= failureThreshold) {
          state = 'open';
          console.error(`[CircuitBreaker] Circuit opened after ${failures} failures. Will retry after ${resetTimeoutMs}ms`);
        }
        throw error;
      }
    };
  }
};

/**
 * Global error logger with context
 * In production, this would send to Sentry, LogRocket, etc.
 */
export const logError = (error: Error, context?: Record<string, any>, level: 'error' | 'warn' | 'info' = 'error') => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    level,
    name: error.name,
    message: error.message,
    stack: error.stack,
    code: error instanceof AppError ? error.code : 'UNKNOWN_ERROR',
    statusCode: error instanceof AppError ? error.statusCode : undefined,
    isRetryable: error instanceof AppError ? error.isRetryable : undefined,
    context: {
      ...(error instanceof AppError ? error.context : {}),
      ...context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    }
  };

  // Log to console
  if (level === 'error') {
    console.error('🔴 [ErrorHandler]', errorLog);
  } else if (level === 'warn')
    {} else {console.info('🔵 [ErrorHandler]', errorLog);
  }

  // In production, send to error tracking service
  if (import.meta.env.PROD && typeof window !== 'undefined')
    {







      // Sentry.captureException(error, {
      //   contexts: { custom: errorLog.context },
      //   level: errorLog.level
      // });
    }return errorLog;}; /**
* Parse error into AppError
* Useful for handling unknown error types
*/export const parseError = (error: unknown): AppError => {// Already an AppError
  if (error instanceof AppError) {return error;}

  // Standard Error
  if (error instanceof Error) {
    // Check for network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new NetworkError(error.message);
    }

    // Check for timeout errors
    if (error.message.includes('timeout') || error.message.includes('aborted')) {
      return new TimeoutError(error.message);
    }

    // Generic error
    return new AppError(error.message, 'UNKNOWN_ERROR', 500, false);
  }

  // String error
  if (typeof error === 'string') {
    return new AppError(error, 'UNKNOWN_ERROR', 500, false);
  }

  // Unknown error type
  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR', 500, false, {
    originalError: error
  });
};

/**
 * Error handler for async functions
 * Wraps a function and handles errors gracefully
 */
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>,>(fn: T, errorHandler?: (error: Error) => void): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = parseError(error);
      logError(appError);
      if (errorHandler) {
        errorHandler(appError);
      } else {
        throw appError;
      }
    }
  }) as T;
};