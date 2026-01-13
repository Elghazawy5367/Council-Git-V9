/**
 * Example: Blue Ocean Scanner Dashboard
 * Demonstrates all 5 critical patterns in a real component
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FeatureErrorBoundary } from '@/components/ErrorBoundary';
import { useBlueOceanScanner, useInvalidateGitHub } from '@/hooks/useGitHub';
import { Button } from '@/components/primitives/button';
import { Loader2, RefreshCw, Star, GitFork, Calendar } from 'lucide-react';

/**
 * Main component with error boundary wrapper
 */
export function BlueOceanDashboard() {
  return (
    <FeatureErrorBoundary featureName="Blue Ocean Scanner">
      <BlueOceanContent />
    </FeatureErrorBoundary>
  );
}

/**
 * Inner content - uses professional patterns
 */
function BlueOceanContent() {
  const [niche, setNiche] = React.useState('react-native');
  
  // ✅ Pattern 4: React Query Hook (automatic cache, retry, error handling)
  const { 
    data: opportunities, 
    isLoading, 
    error, 
    refetch 
  } = useBlueOceanScanner(niche, {
    minStars: 500,
    maxForks: 200,
    daysAbandoned: 365,
    language: 'javascript'
  });

  // Cache invalidation
  const invalidate = useInvalidateGitHub();

  const handleRefresh = () => {
    invalidate.invalidateBlueOcean(niche);
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">
          Scanning GitHub for opportunities...
        </span>
      </div>
    );
  }

  // ✅ Pattern 1: Error handling (caught by error boundary above)
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">
          Failed to scan repositories: {error.message}
        </p>
        <Button onClick={handleRefresh} variant="outline" className="mt-3">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // ✅ Pattern 3: Type-safe data (validated by Zod in the hook)
  // opportunities is properly typed as BlueOceanOpportunity[]
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blue Ocean Scanner</h2>
          <p className="text-muted-foreground">
            Found {opportunities?.length || 0} abandoned goldmines in "{niche}"
          </p>
        </div>
        
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Niche Selector */}
      <div className="flex gap-2">
        {['react-native', 'vue', 'electron', 'flutter', 'nextjs'].map(n => (
          <Button
            key={n}
            onClick={() => setNiche(n)}
            variant={niche === n ? 'default' : 'outline'}
            size="sm"
          >
            {n}
          </Button>
        ))}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities?.map(opportunity => (
          <OpportunityCard key={opportunity.repo.id} opportunity={opportunity} />
        ))}
      </div>

      {/* Empty State */}
      {opportunities?.length === 0 && (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-muted-foreground">
            No opportunities found. Try adjusting the filters.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Opportunity Card Component
 * Shows how validated data is used safely
 */
function OpportunityCard({ opportunity }: { opportunity: any }) {
  const { repo, score, signals, actionableInsights } = opportunity;
  
  // Calculate days since last update
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Score color
  const scoreColor = score >= 80 
    ? 'text-green-600 bg-green-50 border-green-200'
    : score >= 60
    ? 'text-blue-600 bg-blue-50 border-blue-200'
    : 'text-yellow-600 bg-yellow-50 border-yellow-200';

  return (
    <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <a 
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-lg hover:text-primary"
          >
            {repo.full_name}
          </a>
          {repo.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {repo.description}
            </p>
          )}
        </div>
        
        {/* Score Badge */}
        <div className={`px-3 py-1 rounded-full border font-bold ${scoreColor}`}>
          {score}
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          <span>{repo.stargazers_count.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <GitFork className="h-4 w-4" />
          <span>{repo.forks_count.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{daysSinceUpdate}d ago</span>
        </div>
      </div>

      {/* Signals */}
      <div className="flex flex-wrap gap-2 mb-3">
        {signals.isAbandoned && (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
            🕰️ Abandoned
          </span>
        )}
        {signals.hasProvenDemand && (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
            ⭐ High Demand
          </span>
        )}
        {signals.lowCompetition && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
            🎯 Low Competition
          </span>
        )}
      </div>

      {/* Insights */}
      <div className="border-t pt-3">
        <p className="text-xs font-semibold text-muted-foreground mb-2">
          Actionable Insights:
        </p>
        <ul className="text-xs space-y-1">
          {actionableInsights.slice(0, 3).map((insight: string, i: number) => (
            <li key={i} className="text-muted-foreground">
              {insight}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-3"
        onClick={() => window.open(repo.html_url, '_blank')}
      >
        Explore Opportunity →
      </Button>
    </div>
  );
}

export default BlueOceanDashboard;
