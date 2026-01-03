import { get, set, del, clear } from 'idb-keyval';
import type { Expert, SynthesisConfig, CouncilSession, ExecutionMode } from './types';

// IndexedDB keys
const KEYS = {
  EXPERTS: 'council_experts',
  SYNTHESIS_CONFIG: 'council_synthesis_config',
  SESSIONS: 'council_sessions',
  LAST_SESSION: 'council_last_session',
  APP_STATE: 'council_app_state',
} as const;

// App state to persist
interface PersistedAppState {
  task: string;
  mode: ExecutionMode;
  activeExpertCount: number;
  debateRounds: number;
  lastUpdated: number;
}

/**
 * Save experts configuration to IndexedDB
 */
export async function saveExperts(experts: Expert[]): Promise<void> {
  try {
    await set(KEYS.EXPERTS, experts);
  } catch (error) {
    console.error('Failed to save experts to IndexedDB:', error);
    // Fallback to localStorage
    try {
      localStorage.setItem('council_experts_v18', JSON.stringify(experts));
    } catch (e) {
      console.error('Fallback to localStorage also failed:', e);
    }
  }
}

/**
 * Load experts configuration from IndexedDB
 */
export async function loadExperts(): Promise<Expert[] | null> {
  try {
    const experts = await get<Expert[]>(KEYS.EXPERTS);
    if (experts) return experts;
    
    // Check localStorage fallback
    const stored = localStorage.getItem('council_experts_v18');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate to IndexedDB
      await saveExperts(parsed);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Failed to load experts from IndexedDB:', error);
    return null;
  }
}

/**
 * Save synthesis configuration to IndexedDB
 */
export async function saveSynthesisConfig(config: SynthesisConfig): Promise<void> {
  try {
    await set(KEYS.SYNTHESIS_CONFIG, config);
  } catch (error) {
    console.error('Failed to save synthesis config to IndexedDB:', error);
    try {
      localStorage.setItem('council_synthesis_config_v18', JSON.stringify(config));
    } catch (e) {
      console.error('Fallback to localStorage also failed:', e);
    }
  }
}

/**
 * Load synthesis configuration from IndexedDB
 */
export async function loadSynthesisConfig(): Promise<SynthesisConfig | null> {
  try {
    const config = await get<SynthesisConfig>(KEYS.SYNTHESIS_CONFIG);
    if (config) return config;
    
    // Check localStorage fallback
    const stored = localStorage.getItem('council_synthesis_config_v18');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate to IndexedDB
      await saveSynthesisConfig(parsed);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Failed to load synthesis config from IndexedDB:', error);
    return null;
  }
}

/**
 * Save session history to IndexedDB
 */
export async function saveSessions(sessions: CouncilSession[]): Promise<void> {
  try {
    await set(KEYS.SESSIONS, sessions);
  } catch (error) {
    console.error('Failed to save sessions to IndexedDB:', error);
    try {
      localStorage.setItem('council_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.error('Fallback to localStorage also failed:', e);
    }
  }
}

/**
 * Load session history from IndexedDB
 */
export async function loadSessions(): Promise<CouncilSession[]> {
  try {
    const sessions = await get<CouncilSession[]>(KEYS.SESSIONS);
    if (sessions) return sessions;
    
    // Check localStorage fallback
    const stored = localStorage.getItem('council_sessions');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate to IndexedDB
      await saveSessions(parsed);
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Failed to load sessions from IndexedDB:', error);
    return [];
  }
}

/**
 * Save app state for auto-restore
 */
export async function saveAppState(state: PersistedAppState): Promise<void> {
  try {
    await set(KEYS.APP_STATE, { ...state, lastUpdated: Date.now() });
  } catch (error) {
    console.error('Failed to save app state:', error);
  }
}

/**
 * Load app state
 */
export async function loadAppState(): Promise<PersistedAppState | null> {
  try {
    return await get<PersistedAppState>(KEYS.APP_STATE);
  } catch (error) {
    console.error('Failed to load app state:', error);
    return null;
  }
}

/**
 * Clear all persisted data
 */
export async function clearAllData(): Promise<void> {
  try {
    await clear();
    localStorage.removeItem('council_experts_v18');
    localStorage.removeItem('council_synthesis_config_v18');
    localStorage.removeItem('council_sessions');
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}
