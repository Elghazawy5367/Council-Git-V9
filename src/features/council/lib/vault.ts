// src/features/council/lib/vault.ts — COMPLETE REWRITE
// Uses Web Crypto API for AES-256-GCM encryption
// Public API stays identical to previous version for compatibility

const VAULT_KEY = 'council_vault_v19'; // bump version to invalidate old insecure data
const OLD_VAULT_KEY = 'council_vault_v18';
const PBKDF2_ITERATIONS = 600_000;     // OWASP 2024 recommendation for PBKDF2-SHA256

export interface VaultStatus {
  hasVault: boolean;
  isLocked: boolean;
}

// Session keys stored in module-level memory (wiped on page reload)
const sessionKeys = new Map<string, string>();

// ── Key Derivation ─────────────────────────────────────────────────────────
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// ── Encrypt ────────────────────────────────────────────────────────────────
async function encryptData(password: string, plaintext: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));
  const key  = await deriveKey(password, salt);
  const enc  = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, key, enc.encode(plaintext)
  );
  // Bundle salt + iv + ciphertext into one Base64 blob
  const bundle = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  bundle.set(salt, 0);
  bundle.set(iv, 16);
  bundle.set(new Uint8Array(ciphertext), 28);
  return btoa(String.fromCharCode(...bundle));
}

// ── Decrypt ────────────────────────────────────────────────────────────────
async function decryptData(password: string, blob: string): Promise<string> {
  const bundle = Uint8Array.from(atob(blob), c => c.charCodeAt(0));
  const salt   = bundle.slice(0, 16);
  const iv     = bundle.slice(16, 28);
  const data   = bundle.slice(28);
  const key    = await deriveKey(password, salt);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return new TextDecoder().decode(decrypted);
}

// ── Public Vault Interface ──────────────────────────────────────────────────

/**
 * Initialize vault status and cleanup old data
 */
export function initializeVault(): VaultStatus {
  // Force removal of old insecure vault data
  if (localStorage.getItem(OLD_VAULT_KEY)) {
    localStorage.removeItem(OLD_VAULT_KEY);
  }

  const vault = localStorage.getItem(VAULT_KEY);
  return {
    hasVault: !!vault,
    isLocked: sessionKeys.size === 0
  };
}

/**
 * Get current vault status
 */
export function getVaultStatus(): VaultStatus {
  return initializeVault();
}

/**
 * Create a new secure vault
 */
export async function createVault(data: {
  password: string;
  openRouterKey: string;
  serperKey?: string;
  githubApiKey?: string;
  redditApiKey?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const keysToStore = {
      openRouterKey: data.openRouterKey,
      serperKey: data.serperKey || '',
      githubApiKey: data.githubApiKey || '',
      redditApiKey: data.redditApiKey || '',
    };

    const encrypted = await encryptData(data.password, JSON.stringify(keysToStore));
    localStorage.setItem(VAULT_KEY, encrypted);

    // Auto-unlock after creation
    Object.entries(keysToStore).forEach(([k, v]) => sessionKeys.set(k, v));

    return { success: true };
  } catch (error) {
    console.error('Failed to create vault:', error);
    return { success: false, error: 'Failed to create vault' };
  }
}

/**
 * Unlock the vault with a password
 */
export async function unlockVault(password: string): Promise<{
  success: boolean;
  error?: string;
  keys?: {
    openRouterKey: string;
    serperKey?: string;
    githubApiKey?: string;
    redditApiKey?: string
  }
}> {
  try {
    const blob = localStorage.getItem(VAULT_KEY);
    if (!blob) {
      return { success: false, error: 'No vault found' };
    }

    const decrypted = await decryptData(password, blob);
    const keys = JSON.parse(decrypted);

    // Store in memory session
    Object.entries(keys).forEach(([k, v]) => sessionKeys.set(k, v as string));

    return { 
      success: true, 
      keys
    };
  } catch (error) {
    console.error('Failed to unlock vault:', error);
    return { success: false, error: 'Invalid password' };
  }
}

/**
 * Lock the vault by clearing in-memory session
 */
export function lockVault(): void {
  sessionKeys.clear();
}

/**
 * Get API keys from in-memory session store
 */
export function getSessionKeys(): {
  openRouterKey: string;
  serperKey?: string;
  githubApiKey?: string;
  redditApiKey?: string
} | null {
  if (sessionKeys.size === 0) return null;

  return {
    openRouterKey: sessionKeys.get('openRouterKey') || '',
    serperKey: sessionKeys.get('serperKey'),
    githubApiKey: sessionKeys.get('githubApiKey'),
    redditApiKey: sessionKeys.get('redditApiKey'),
  };
}

/**
 * Delete the vault and clear session
 */
export function deleteVault(): void {
  localStorage.removeItem(VAULT_KEY);
  sessionKeys.clear();
}

/**
 * Clear the vault (alias for deleteVault for API compatibility)
 */
export function clearVault(): void {
  deleteVault();
}

/**
 * Check if the vault is currently locked
 */
export function isLocked(): boolean {
  return sessionKeys.size === 0;
}
