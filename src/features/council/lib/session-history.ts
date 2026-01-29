// Session History Management
import { CouncilSession } from './types';
const HISTORY_STORAGE_KEY = 'council_session_history_v18';
const MAX_SESSIONS = 50;

// Get all sessions from localStorage
export function getSessions(): CouncilSession[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return [];
    const sessions = JSON.parse(stored);
    if (!Array.isArray(sessions)) {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      return [];
    }

    // Convert timestamp strings back to Date objects and validate structure
    return sessions.map((s: Partial<CouncilSession>) => ({
      ...s,
      timestamp: new Date(s.timestamp!)
    })).filter(s => s.id && s.timestamp) as CouncilSession[]; // Basic validation
  } catch (e) {
    console.error('Failed to load session history:', e);
    // If parsing fails, also clear the corrupted data.
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (removeError) {
      console.error('Failed to clear corrupted history:', removeError);
    }
    return [];
  }
}

// Save a new session
export function saveSession(session: Omit<CouncilSession, 'id' | 'timestamp'>): CouncilSession {
  const newSession: CouncilSession = {
    ...session,
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date()
  };
  try {
    const sessions = getSessions();
    // Add new session at the beginning
    sessions.unshift(newSession);

    // Keep only the most recent sessions
    const trimmed = sessions.slice(0, MAX_SESSIONS);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
    return newSession;
  } catch (e) {
    console.error('Failed to save session:', e);
    return newSession;
  }
}

// Get a specific session by ID
export function getSession(id: string): CouncilSession | null {
  const sessions = getSessions();
  return sessions.find(s => s.id === id) || null;
}

// Delete a session
export function deleteSession(id: string): void {
  try {
    const sessions = getSessions();
    const filtered = sessions.filter(s => s.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete session:', e);
  }
}

// Clear all sessions
export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

// Format session for display
export function formatSessionPreview(session: CouncilSession): string {
  if (!session || !session.task || typeof session.task !== 'string') {
    return '[Untitled Session]';
  }
  const taskPreview = session.task.length > 60 ? session.task.slice(0, 60) + '...' : session.task;
  return taskPreview;
}

// Format relative time
export function formatRelativeTime(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}