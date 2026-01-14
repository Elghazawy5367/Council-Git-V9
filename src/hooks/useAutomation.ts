import { useState, useCallback } from 'react';

export interface AutomationStatus {  
  id: string;  
  name: string;  
  status: 'idle' | 'running' | 'completed' | 'failed';  
  progress: number;  
  startTime?: Date;  
  endTime?: Date;  
  result?: any;  
  error?: string;  
}

export interface UseAutomationReturn {  
  automations: AutomationStatus[];  
  loading: boolean;  
  error: Error | null;  
  start: (automationId: string) => Promise<void>;  
  stop: (automationId: string) => Promise<void>;  
  getStatus: (automationId: string) => AutomationStatus | undefined;  
}

export const useAutomation = (): UseAutomationReturn => {  
  const [automations, setAutomations] = useState<AutomationStatus[]>([]);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState<Error | null>(null);

  const start = useCallback(async (automationId: string) => {  
    setLoading(true);  
    setError(null);

    try {  
      setAutomations(prev => prev.map(auto =>   
        auto.id === automationId   
          ? { ...auto, status: 'running' as const, startTime: new Date(), progress: 0 }  
          : auto  
      ));

      await new Promise(resolve => setTimeout(resolve, 2000));

      setAutomations(prev => prev.map(auto =>   
        auto.id === automationId   
          ? { ...auto, status: 'completed' as const, endTime: new Date(), progress: 100 }  
          : auto  
      ));  
    } catch (err) {  
      setError(err as Error);  
      setAutomations(prev => prev.map(auto =>   
        auto.id === automationId   
          ? { ...auto, status: 'failed' as const, error: (err as Error).message }  
          : auto  
      ));  
    } finally {  
      setLoading(false);  
    }  
  }, []);

  const stop = useCallback(async (automationId: string) => {  
    setAutomations(prev => prev.map(auto =>   
      auto.id === automationId   
        ? { ...auto, status: 'idle' as const, progress: 0 }  
        : auto  
    ));  
  }, []);

  const getStatus = useCallback((automationId: string) => {  
    return automations.find(auto => auto.id === automationId);  
  }, [automations]);

  return {  
    automations,  
    loading,  
    error,  
    start,  
    stop,  
    getStatus,  
  };  
};