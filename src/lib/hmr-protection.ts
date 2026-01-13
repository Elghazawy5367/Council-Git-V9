/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Hot Module Replacement (HMR) Protection Layer
 * Prevents console crashes during development when files are modified
 */

// Store previous state before HMR updates
const stateBackup = new Map<string, unknown>();

/**
 * Safely handle HMR updates without losing application state
 */
export function setupHMRProtection(): void {
  if (import.meta.hot) {
    console.log('[HMR] Protection layer activated');

    // Accept all HMR updates gracefully
    import.meta.hot.accept((newModule) => {
      if (newModule) {
        console.log('[HMR] Module updated successfully');
      }
    });

    // Handle HMR errors without crashing
    import.meta.hot.on('vite:error', (error) => {
      console.error('[HMR] Build error detected:', error);
      // Error is logged but app continues
    });

    // Preserve state before updates
    import.meta.hot.on('vite:beforeUpdate', () => {
      console.log('[HMR] Saving state before update...');
      
      // Backup Zustand stores
      try {
        const localStorageState: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('council_') || key?.startsWith('settings_') || key?.startsWith('memory_')) {
            localStorageState[key] = localStorage.getItem(key) || '';
          }
        }
        stateBackup.set('localStorage', localStorageState);
      } catch (error) {
        console.warn('[HMR] Could not backup localStorage:', error);
      }
    });

    // Restore state after updates
    import.meta.hot.on('vite:afterUpdate', () => {
      console.log('[HMR] Restoring state after update...');
      
      try {
        const localStorageState = stateBackup.get('localStorage') as Record<string, string>;
        if (localStorageState) {
          Object.entries(localStorageState).forEach(([key, value]) => {
            localStorage.setItem(key, value);
          });
        }
      } catch (error) {
        console.warn('[HMR] Could not restore localStorage:', error);
      }
    });

    // Track reload count to prevent infinite loops
    let reloadCount = 0;
    const checkReloadInterval = setInterval(() => {
      reloadCount = 0; // Reset every 5 seconds
    }, 5000);
    
    import.meta.hot.on('vite:beforeUpdate', () => {
      reloadCount++;
      if (reloadCount > 3) {
        console.error('[HMR] Too many reloads detected, please check for errors');
        clearInterval(checkReloadInterval);
      }
    });
  }
}

/**
 * Global error handler for runtime errors
 * Prevents white screen of death
 */
export function setupGlobalErrorHandler(): void {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[GLOBAL] Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent crash
    
    // Show user-friendly notification
    try {
      const toast = (window as any).toast;
      if (toast?.error) {
        toast.error('Background operation failed', {
          description: 'The app is still running. Check console for details.',
        });
      }
    } catch {
      // Toast not available, silently continue
    }
  });

  // Catch uncaught errors
  window.addEventListener('error', (event) => {
    console.error('[GLOBAL] Uncaught error:', event.error);
    
    // Don't crash on module loading errors during HMR
    if (event.message?.includes('dynamically imported module') || 
        event.message?.includes('Failed to fetch')) {
      event.preventDefault();
      console.log('[GLOBAL] Module loading error suppressed during development');
    }
  });

  // Detect infinite loops in React rendering
  let renderErrorCount = 0;
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    
    // Detect React infinite render loop
    if (message.includes('Maximum update depth exceeded') || 
        message.includes('Too many re-renders')) {
      renderErrorCount++;
      if (renderErrorCount > 5) {
        console.warn('[GLOBAL] Infinite render loop detected, reloading page...');
        setTimeout(() => window.location.reload(), 1000);
        return;
      }
    }
    
    originalConsoleError.apply(console, args);
  };
}

/**
 * Development mode safeguards
 */
export function setupDevSafeguards(): void {
  if (import.meta.env.DEV) {
    // Detect and prevent memory leaks from abandoned event listeners
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const listenerCounts = new Map<string, number>();
    
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      const count = listenerCounts.get(type) || 0;
      listenerCounts.set(type, count + 1);
      
      if (count > 100) {
        console.warn(`[DEV] Potential memory leak: ${count} listeners for "${type}" event`);
      }
      
      return originalAddEventListener.call(this, type, listener, options);
    };

    // Warn about large state objects
    const originalStringify = JSON.stringify;
    (JSON as any).stringify = function(value: any, replacer?: any, space?: any) {
      try {
        const result = originalStringify.call(JSON, value, replacer, space);
        if (result.length > 1024 * 1024) { // 1MB
          console.warn('[DEV] Large state object detected:', (result.length / 1024).toFixed(2), 'KB');
        }
        return result;
      } catch (error) {
        console.error('[DEV] JSON stringify failed:', error);
        return '{}';
      }
    };
  }
}

/**
 * Initialize all protection mechanisms
 */
export function initializeProtection(): void {
  setupHMRProtection();
  setupGlobalErrorHandler();
  setupDevSafeguards();
  console.log('[PROTECTION] All safeguards initialized');
}
