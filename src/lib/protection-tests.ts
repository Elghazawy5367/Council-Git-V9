/**
 * Test Suite for Web Console Protections
 * Run these tests in the browser console to verify protection mechanisms
 */

export const ProtectionTests = {
  /**
   * Test 1: Unhandled Promise Rejection
   * Expected: Console error + toast notification, app continues running
   */
  testUnhandledRejection() {
    console.log('[TEST] Triggering unhandled promise rejection...');
    Promise.reject(new Error('Test unhandled rejection - app should not crash'));
    setTimeout(() => {
      console.log('[TEST] ✅ App still running after unhandled rejection');
    }, 1000);
  },

  /**
   * Test 2: Uncaught Error
   * Expected: Global error handler catches it, app continues
   */
  testUncaughtError() {
    console.log('[TEST] Triggering uncaught error...');
    setTimeout(() => {
      throw new Error('Test uncaught error - should be caught by global handler');
    }, 100);
  },

  /**
   * Test 3: Large State Object Warning
   * Expected: Console warning about large state size
   */
  testLargeStateWarning() {
    console.log('[TEST] Creating large state object...');
    const largeObject = { data: new Array(100000).fill('x').join('') };
    JSON.stringify(largeObject);
    console.log('[TEST] ✅ Large state warning should appear above');
  },

  /**
   * Test 4: Memory Leak Detection
   * Expected: Warning after 100 event listeners
   */
  testMemoryLeakDetection() {
    console.log('[TEST] Adding multiple event listeners...');
    const button = document.createElement('button');
    for (let i = 0; i < 105; i++) {
      button.addEventListener('click', () => {});
    }
    console.log('[TEST] ✅ Memory leak warning should appear above');
  },

  /**
   * Test 5: Component Error Boundary
   * This would need to be run inside a React component
   */
  testComponentError() {
    console.log('[TEST] To test component error boundary:');
    console.log('1. Add this to any component: throw new Error("Test error");');
    console.log('2. Expected: Inline error fallback, other components keep working');
    console.log('3. Click "Retry" to recover');
  },

  /**
   * Test 6: HMR State Preservation
   */
  testHMRPreservation() {
    console.log('[TEST] Testing HMR state preservation...');
    console.log('1. Set some data: localStorage.setItem("test_hmr", "test value")');
    console.log('2. Make a code change to trigger HMR');
    console.log('3. Check: localStorage.getItem("test_hmr")');
    console.log('Expected: Value should be preserved');
    
    localStorage.setItem('test_hmr', `Test at ${new Date().toISOString()}`);
    console.log('[TEST] ✅ Test value set:', localStorage.getItem('test_hmr'));
  },

  /**
   * Run all automated tests
   */
  runAll() {
    console.log('='.repeat(60));
    console.log('🧪 Running Protection Test Suite');
    console.log('='.repeat(60));
    
    console.log('\n1/6: Testing unhandled rejection...');
    this.testUnhandledRejection();
    
    setTimeout(() => {
      console.log('\n2/6: Testing large state warning...');
      this.testLargeStateWarning();
    }, 1500);
    
    setTimeout(() => {
      console.log('\n3/6: Testing memory leak detection...');
      this.testMemoryLeakDetection();
    }, 2500);
    
    setTimeout(() => {
      console.log('\n4/6: Testing HMR preservation...');
      this.testHMRPreservation();
    }, 3500);
    
    setTimeout(() => {
      console.log('\n5/6: Component error boundary test (manual)');
      this.testComponentError();
    }, 4500);
    
    setTimeout(() => {
      console.log('\n6/6: Uncaught error test...');
      this.testUncaughtError();
    }, 5500);
    
    setTimeout(() => {
      console.log('\n' + '='.repeat(60));
      console.log('✅ Test Suite Complete - Check console for results');
      console.log('📊 App should still be running without crashes');
      console.log('='.repeat(60));
    }, 7000);
  },

  /**
   * Check protection status
   */
  checkStatus() {
    console.log('🛡️ Protection Status:');
    console.log('- HMR Protection:', import.meta.hot ? '✅ Active' : '❌ Inactive');
    console.log('- Error Boundaries:', document.querySelector('[data-testid="button-error-retry"]') ? '✅ Rendered' : '⏳ No errors yet');
    console.log('- Global Handlers:', window.onunhandledrejection ? '✅ Active' : '❌ Inactive');
    console.log('- State Backup:', localStorage.getItem('council_experts') ? '✅ Data present' : '⚠️ No data');
    console.log('\nRun ProtectionTests.runAll() to test all protections');
  }
};

declare global {
  interface Window {
    ProtectionTests?: typeof ProtectionTests;
  }
}

// Make available in browser console
if (typeof window !== 'undefined') {
  window.ProtectionTests = ProtectionTests;
  console.log('🧪 Protection Tests loaded. Run: ProtectionTests.checkStatus()');
}
