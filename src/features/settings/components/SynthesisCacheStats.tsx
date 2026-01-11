// Cache Stats Display Component
import { useEffect, useState } from 'react';
import { getCacheStats, clearSynthesisCache, removeExpiredEntries } from '@/lib/synthesis-cache';
import { Button } from '@/components/primitives/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';

interface CacheStatsData {
  totalEntries: number;
  totalHits: number;
  totalSaved: number;
  cacheSize: number;
  oldestEntry: number;
  newestEntry: number;
}

export function SynthesisCacheStats(): JSX.Element {
  const [stats, setStats] = useState<CacheStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async (): Promise<void> => {
    try {
      const data = await getCacheStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load cache stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async (): Promise<void> => {
    if (!confirm('Clear all cached synthesis results?')) return;
    
    try {
      await clearSynthesisCache();
      await loadStats();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const handleCleanup = async (): Promise<void> => {
    try {
      const removed = await removeExpiredEntries();
      alert(`Removed ${removed} expired entries`);
      await loadStats();
    } catch (error) {
      console.error('Failed to cleanup cache:', error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading cache stats...</div>;
  }

  if (!stats) {
    return <div className="text-sm text-destructive">Failed to load cache stats</div>;
  }

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
  };

  const formatDate = (timestamp: number): string => {
    if (timestamp === 0) return 'Never';
    return new Date(timestamp).toLocaleDateString();
  };

  const hitRate = stats.totalEntries > 0 
    ? ((stats.totalHits / (stats.totalHits + stats.totalEntries)) * 100).toFixed(1)
    : '0';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💾 Synthesis Cache
        </CardTitle>
        <CardDescription>
          Semantic caching reduces costs by reusing similar synthesis results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Cached Entries</div>
            <div className="text-2xl font-bold">{stats.totalEntries}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Hits</div>
            <div className="text-2xl font-bold">{stats.totalHits}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Hit Rate</div>
            <div className="text-2xl font-bold">{hitRate}%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Saved</div>
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalSaved.toFixed(4)}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cache Size:</span>
            <span className="font-mono">{formatSize(stats.cacheSize)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Oldest Entry:</span>
            <span className="font-mono">{formatDate(stats.oldestEntry)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Newest Entry:</span>
            <span className="font-mono">{formatDate(stats.newestEntry)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCleanup}
            className="flex-1"
          >
            🧹 Cleanup Expired
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleClear}
            className="flex-1"
          >
            🗑️ Clear All
          </Button>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-2">
          <strong>Note:</strong> Cache entries expire after 7 days. Hit rate measures how often 
          cached results are reused vs new syntheses performed.
        </div>
      </CardContent>
    </Card>
  );
}
