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
    Promise.reject(new Error('Test unhandled rejection - app should not crash'));
    setTimeout(() => {}, 1000);
  },
  /**
   * Test 2: Uncaught Error
   * Expected: Global error handler catches it, app continues
   */
  testUncaughtError() {
    setTimeout(() => {
      throw new Error('Test uncaught error - should be caught by global handler');
    }, 100);
  },
  /**
   * Test 3: Large State Object Warning
   * Expected: Console warning about large state size
   */
  testLargeStateWarning() {
    const largeObject = {
      data: new Array(100000).fill('x').join('')
    };
    JSON.stringify(largeObject);
  },
  /**
   * Test 4: Memory Leak Detection
   * Expected: Warning after 100 event listeners
   */
  testMemoryLeakDetection() {
    const button = document.createElement('button');
    for (let i = 0; i < 105; i++) {
      button.addEventListener('click', () => {});
    }
  },
  /**
   * Test 5: Component Error Boundary
   * This would need to be run inside a React component
   */
  testComponentError() {},
  /**
   * Test 6: HMR State Preservation
   */
  testHMRPreservation() {
    localStorage.setItem('test_hmr', `Test at ${new Date().toISOString()}`);
  },
  /**
   * Run all automated tests
   */
  runAll() {
    this.testUnhandledRejection();
    setTimeout(() => {
      this.testLargeStateWarning();
    }, 1500);
    setTimeout(() => {
      this.testMemoryLeakDetection();
    }, 2500);
    setTimeout(() => {
      this.testHMRPreservation();
    }, 3500);
    setTimeout(() => {
      this.testComponentError();
    }, 4500);
    setTimeout(() => {
      this.testUncaughtError();
    }, 5500);
    setTimeout(() => {}, 7000);
  },
  /**
   * Check protection status
   */
  checkStatus() {}
};
declare global {
  interface Window {
    ProtectionTests?: typeof ProtectionTests;
  }
}

// Make available in browser console
if (typeof window !== 'undefined') {
  window.ProtectionTests = ProtectionTests;
}