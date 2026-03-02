// Vault service for secure API key storage
// Uses AES-256-GCM encryption via Web Crypto API (zero new deps)

const VAULT_KEY = 'council_vault_v19';
const OLD_VAULT_KEYS = ['council_vault_v18'];
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
const PBKDF2_ITERATIONS = 600_000;

interface VaultData {
  salt: string;      // base64-encoded random salt
  iv: string;        // base64-encoded random IV
  ciphertext: string; // base64-encoded encrypted data
}

interface SessionKeys {
  openRouterKey: string;
  serperKey?: string;
  githubApiKey?: string;
  redditApiKey?: string;
}

interface SessionEntry {
  keys: SessionKeys;
  unlockTime: number;
}

export interface VaultStatus {
  hasVault: boolean;
  isLocked: boolean;
}

// Module-level session cache (not sessionStorage — no plaintext on disk)
const sessionCache = new Map<string, SessionEntry>();

// Clean up old vault versions on module load
for (const oldKey of OLD_VAULT_KEYS) {
  try { localStorage.removeItem(oldKey); } catch { /* ignore */ }
}

// --- Crypto helpers (Web Crypto API, zero deps) ---

function toBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function fromBase64(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encrypt(plaintext: string, password: string): Promise<VaultData> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const encoder = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  );

  return {
    salt: toBase64(salt.buffer),
    iv: toBase64(iv.buffer),
    ciphertext: toBase64(ciphertext),
  };
}

async function decrypt(vaultData: VaultData, password: string): Promise<string> {
  const salt = new Uint8Array(fromBase64(vaultData.salt));
  const iv = new Uint8Array(fromBase64(vaultData.iv));
  const ciphertext = fromBase64(vaultData.ciphertext);
  const key = await deriveKey(password, salt);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(plaintext);
}

// --- Public API (same interface as before) ---

export function initializeVault(): VaultStatus {
  const vault = localStorage.getItem(VAULT_KEY);
  const session = sessionCache.get(VAULT_KEY);

  if (!vault) {
    return { hasVault: false, isLocked: true };
  }

  if (!session) {
    return { hasVault: true, isLocked: true };
  }

  const now = Date.now();
  if (now - session.unlockTime > SESSION_TIMEOUT) {
    sessionCache.delete(VAULT_KEY);
    return { hasVault: true, isLocked: true };
  }

  return { hasVault: true, isLocked: false };
}

export function getVaultStatus(): VaultStatus {
  return initializeVault();
}

export async function createVault(data: {
  password: string;
  openRouterKey: string;
  serperKey?: string;
  githubApiKey?: string;
  redditApiKey?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const keysToStore = JSON.stringify({
      openRouterKey: data.openRouterKey,
      serperKey: data.serperKey || '',
      githubApiKey: data.githubApiKey || '',
      redditApiKey: data.redditApiKey || '',
    });

    const vaultData = await encrypt(keysToStore, data.password);
    localStorage.setItem(VAULT_KEY, JSON.stringify(vaultData));

    // Auto-unlock after creation (store in module-level Map, not sessionStorage)
    sessionCache.set(VAULT_KEY, {
      keys: {
        openRouterKey: data.openRouterKey,
        serperKey: data.serperKey,
        githubApiKey: data.githubApiKey,
        redditApiKey: data.redditApiKey,
      },
      unlockTime: Date.now(),
    });

    return { success: true };
  } catch (error) {
    console.warn('Failed to create vault:', error);
    return { success: false, error: 'Failed to create vault' };
  }
}

export async function unlockVault(password: string): Promise<{
  success: boolean;
  error?: string;
  keys?: SessionKeys;
}> {
  try {
    const vaultStr = localStorage.getItem(VAULT_KEY);
    if (!vaultStr) {
      return { success: false, error: 'No vault found' };
    }

    const vaultData: VaultData = JSON.parse(vaultStr);
    const decrypted = await decrypt(vaultData, password);
    const keys: SessionKeys = JSON.parse(decrypted);

    sessionCache.set(VAULT_KEY, {
      keys,
      unlockTime: Date.now(),
    });

    return { success: true, keys };
  } catch (error) {
    console.warn('Failed to unlock vault:', error);
    return { success: false, error: 'Invalid password' };
  }
}

export function lockVault(): void {
  sessionCache.delete(VAULT_KEY);
}

export function getSessionKeys(): SessionKeys | null {
  const session = sessionCache.get(VAULT_KEY);
  if (!session) return null;

  const now = Date.now();
  if (now - session.unlockTime > SESSION_TIMEOUT) {
    sessionCache.delete(VAULT_KEY);
    return null;
  }

  // Refresh session
  session.unlockTime = now;
  return { ...session.keys };
}

export function deleteVault(): void {
  localStorage.removeItem(VAULT_KEY);
  sessionCache.delete(VAULT_KEY);
}
