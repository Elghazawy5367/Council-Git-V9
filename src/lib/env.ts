/**
 * Environment Utility
 * Detects whether the code is running in a browser or Node.js environment.
 */

export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
export const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

/**
 * Browser-safe File System Mock/Stub
 * Prevents crashes when Node-specific 'fs' is imported in browser
 */
// Use eval('require') to trick Vite/bundlers so they don't try to bundle 'fs'
const getRuntimeRequire = () => {
  if (typeof require !== 'undefined') return require;
  if (typeof globalThis !== 'undefined' && (globalThis as any).require) return (globalThis as any).require;
  return null;
};

export const fsSafe = {
  readFileSync: (...args: any[]) => {
    if (isNode) {
      const req = getRuntimeRequire();
      const fs = req ? req('fs') : null;
      return fs ? fs.readFileSync(...args) : '';
    }
    console.warn('fs.readFileSync called in browser - returning empty string');
    return '';
  },
  writeFileSync: (...args: any[]) => {
    if (isNode) {
      const req = getRuntimeRequire();
      const fs = req ? req('fs') : null;
      if (fs) return fs.writeFileSync(...args);
    }
    console.warn('fs.writeFileSync called in browser - operation ignored');
  },
  mkdirSync: (...args: any[]) => {
    if (isNode) {
      const req = getRuntimeRequire();
      const fs = req ? req('fs') : null;
      if (fs) return fs.mkdirSync(...args);
    }
  },
  existsSync: (...args: any[]) => {
    if (isNode) {
      const req = getRuntimeRequire();
      const fs = req ? req('fs') : null;
      return fs ? fs.existsSync(...args) : false;
    }
    return false;
  }
};
