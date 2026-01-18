import { fetchHNTrends } from '@/lib/hackernews-intelligence';
import { fetchPHLaunches } from '@/lib/producthunt-intelligence';

export async function generateConsolidatedReport() {
  const [hnTrends, phLaunches] = await Promise.all([
    fetchHNTrends(),
    fetchPHLaunches()
  ]);

  return {
    timestamp: new Date().toISOString(),
    hnTrends,
    phLaunches,
    summary: `Found ${hnTrends.length} HackerNews trends and ${phLaunches.length} ProductHunt launches.`
  };
}
