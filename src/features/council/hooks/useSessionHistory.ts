import { useState, useEffect, useCallback } from 'react';
import { CouncilSession } from '@/features/council/lib/types';
import { getSessions, deleteSession, clearHistory } from '@/features/council/lib/session-history';
import { toast } from 'sonner';

/**
 * Custom hook for managing session history state
 * Reduces code duplication and improves performance
 */
export function useSessionHistory(loadOnMount: boolean = true) {
  const [sessions, setSessions] = useState<CouncilSession[]>([]);

  const loadSessions = useCallback(() => {
    setSessions(getSessions() || []);
  }, []);

  useEffect(() => {
    if (loadOnMount) {
      loadSessions();
    }
  }, [loadOnMount, loadSessions]);

  const handleDelete = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    deleteSession(id);
    loadSessions();
    toast.success('Session deleted');
  }, [loadSessions]);

  const handleClearAll = useCallback(() => {
    clearHistory();
    setSessions([]);
    toast.success('History cleared');
  }, []);

  return {
    sessions,
    loadSessions,
    handleDelete,
    handleClearAll,
  };
}
