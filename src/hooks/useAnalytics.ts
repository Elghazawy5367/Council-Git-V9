import { useState, useEffect, useCallback } from 'react';

export interface AnalyticsData {  
  pageViews: number;  
  uniqueVisitors: number;  
  bounceRate: number;  
  avgSessionDuration: number;  
  topPages: Array<{ path: string; views: number }>;  
  conversions: number;  
  revenue: number;  
}

export interface UseAnalyticsReturn {  
  data: AnalyticsData | null;  
  loading: boolean;  
  error: Error | null;  
  fetch: (dateRange: { start: Date; end: Date }) => Promise<void>;  
  track: (event: string, properties?: Record<string, any>) => void;  
}

export const useAnalytics = (): UseAnalyticsReturn => {  
  const [data, setData] = useState<AnalyticsData | null>(null);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async (dateRange: { start: Date; end: Date }) => {  
    setLoading(true);  
    setError(null);
    console.log('Fetching analytics for:', dateRange);  
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData: AnalyticsData = {  
        pageViews: 15420,  
        uniqueVisitors: 3840,  
        bounceRate: 42.5,  
        avgSessionDuration: 245,  
        topPages: [  
          { path: '/dashboard', views: 4200 },  
          { path: '/intelligence', views: 3100 },  
          { path: '/settings', views: 1800 },  
        ],  
        conversions: 186,  
        revenue: 12450,  
      };

      setData(mockData);  
    } catch (err) {  
      setError(err as Error);  
      console.error('Analytics fetch failed:', err);  
    } finally {  
      setLoading(false);  
    }  
  }, []);

  const track = useCallback((event: string, properties?: Record<string, any>) => {  
    console.log('Track event:', event, properties);  
  }, []);

  useEffect(() => {  
    const now = new Date();  
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);  
    fetch({ start: thirtyDaysAgo, end: now });  
  }, [fetch]);

  return {  
    data,  
    loading,  
    error,  
    fetch,  
    track,  
  };  
};