// Simplified Vault service for secure API key storage
// Uses localStorage with base64 encoding (demo version)

const VAULT_KEY = 'council_vault_v18';
const SESSION_KEY = 'council_session_v18';
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour

interface VaultData {
  encodedKeys: string;
  passwordHash: string;
}

interface SessionData {
  openRouterKey: string;
  serperKey?: string;
  unlockTime: number;
}

export interface VaultStatus {
  hasVault: boolean;
  isLocked: boolean;
}

// Simple hash function for demo
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Initialize vault status
export function initializeVault(): VaultStatus {
  const vault = localStorage.getItem(VAULT_KEY);
  const session = sessionStorage.getItem(SESSION_KEY);

  if (!vault) {
    return { hasVault: false, isLocked: true };
  }

  if (!session) {
    return { hasVault: true, isLocked: true };
  }

  try {
    const sessionData: SessionData = JSON.parse(session);
    const now = Date.now();
    
    if (now - sessionData.unlockTime > SESSION_TIMEOUT) {
      sessionStorage.removeItem(SESSION_KEY);
      return { hasVault: true, isLocked: true };
    }

    return { hasVault: true, isLocked: false };
  } catch {
    return { hasVault: true, isLocked: true };
  }
}

// Get vault status
export function getVaultStatus(): VaultStatus {
  return initializeVault();
}

// Create new vault
export async function createVault(data: {
  password: string;
  openRouterKey: string;
  serperKey?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const keysToStore = JSON.stringify({
      openRouterKey: data.openRouterKey,
      serperKey: data.serperKey || '',
    });

    const vaultData: VaultData = {
      encodedKeys: btoa(keysToStore),
      passwordHash: simpleHash(data.password),
    };
    localStorage.setItem(VAULT_KEY, JSON.stringify(vaultData));

    // Auto-unlock after creation
    const sessionData: SessionData = {
      openRouterKey: data.openRouterKey,
      serperKey: data.serperKey,
      unlockTime: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    return { success: true };
  } catch (error) {
    console.error('Failed to create vault:', error);
    return { success: false, error: 'Failed to create vault' };
  }
}

// Unlock vault
export async function unlockVault(password: string): Promise<{ success: boolean; error?: string; keys?: { openRouterKey: string; serperKey?: string } }> {
  try {
    const vaultStr = localStorage.getItem(VAULT_KEY);
    if (!vaultStr) {
      return { success: false, error: 'No vault found' };
    }

    const vaultData: VaultData = JSON.parse(vaultStr);
    
    if (simpleHash(password) !== vaultData.passwordHash) {
      return { success: false, error: 'Invalid password' };
    }

    const keys = JSON.parse(atob(vaultData.encodedKeys));

    const sessionData: SessionData = {
      openRouterKey: keys.openRouterKey,
      serperKey: keys.serperKey,
      unlockTime: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    return { 
      success: true, 
      keys: { 
        openRouterKey: keys.openRouterKey, 
        serperKey: keys.serperKey 
      } 
    };
  } catch (error) {
    console.error('Failed to unlock vault:', error);
    return { success: false, error: 'Invalid password' };
  }
}

// Lock vault
export function lockVault(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

// Get session keys
export function getSessionKeys(): { openRouterKey: string; serperKey?: string } | null {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (!session) return null;

  try {
    const sessionData: SessionData = JSON.parse(session);
    const now = Date.now();

    if (now - sessionData.unlockTime > SESSION_TIMEOUT) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }

    // Refresh session
    sessionData.unlockTime = now;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    return {
      openRouterKey: sessionData.openRouterKey,
      serperKey: sessionData.serperKey,
    };
  } catch {
    return null;
  }
}

// Delete vault
export function deleteVault(): void {
  localStorage.removeItem(VAULT_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}
