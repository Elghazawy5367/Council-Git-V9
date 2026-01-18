/**
 * Stargazer Quality Analysis Card
 * Displays institutional backing analysis for GitHub repositories
 */

import { Star, Building2, Users, TrendingUp, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { StargazerAnalysis } from '@/lib/stargazer-intelligence';

interface StargazerQualityCardProps {
  data: StargazerAnalysis;
  isLoading?: boolean;
  error?: Error | null;
}

export function StargazerQualityCard({ data, isLoading, error }: StargazerQualityCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6 animate-pulse">
        <div className="h-6 w-48 bg-muted rounded mb-4"></div>
        <div className="h-4 w-full bg-muted rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-muted rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
        <div className="flex items-center gap-2 text-destructive mb-2">
          <XCircle className="h-5 w-5" />
          <h3 className="font-semibold">Analysis Failed</h3>
        </div>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!data) return null;

  const getVerdictColor = () => {
    switch (data.verdict) {
      case 'INSTITUTIONAL_BACKING': return 'text-green-600 dark:text-green-400';
      case 'COMMUNITY_VALIDATED': return 'text-yellow-600 dark:text-yellow-400';
      case 'UNVALIDATED': return 'text-red-600 dark:text-red-400';
    }
  };

  const getVerdictIcon = () => {
    switch (data.verdict) {
      case 'INSTITUTIONAL_BACKING': return <CheckCircle2 className="h-5 w-5" />;
      case 'COMMUNITY_VALIDATED': return <AlertCircle className="h-5 w-5" />;
      case 'UNVALIDATED': return <XCircle className="h-5 w-5" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Stargazer Quality Analysis</h3>
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(data.qualityScore)}`}>
            {data.qualityScore}/100
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`${getVerdictColor()} flex items-center gap-1 font-medium`}>
            {getVerdictIcon()}
            {data.verdict.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>Big Tech</span>
          </div>
          <div className="text-2xl font-semibold">{data.bigTechCount}</div>
          <div className="text-xs text-muted-foreground">
            {data.companyBackers.slice(0, 2).join(', ') || 'None'}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Influencers</span>
          </div>
          <div className="text-2xl font-semibold">{data.influencerCount}</div>
          <div className="text-xs text-muted-foreground">1000+ followers</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>Organizations</span>
          </div>
          <div className="text-2xl font-semibold">{data.organizationCount}</div>
          <div className="text-xs text-muted-foreground">Official accounts</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Analyzed</span>
          </div>
          <div className="text-2xl font-semibold">{data.analyzed}</div>
          <div className="text-xs text-muted-foreground">of {data.totalStargazers} total</div>
        </div>
      </div>

      {/* Analysis */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Institutional Strength</span>
            <span className={`font-medium capitalize ${
              data.analysis.institutionalStrength === 'strong' ? 'text-green-600' :
              data.analysis.institutionalStrength === 'moderate' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {data.analysis.institutionalStrength}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Community Trust</span>
            <span className={`font-medium capitalize ${
              data.analysis.communityTrust === 'high' ? 'text-green-600' :
              data.analysis.communityTrust === 'medium' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {data.analysis.communityTrust}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted/50">
          <p className="text-sm leading-relaxed">{data.analysis.recommendation}</p>
        </div>
      </div>

      {/* Notable Backers */}
      {data.notableBackers.length > 0 && (
        <div className="p-6 border-t">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Top Notable Backers
          </h4>
          <div className="space-y-2">
            {data.notableBackers.slice(0, 5).map((backer) => (
              <div 
                key={backer.login}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    backer.type === 'big_tech' ? 'bg-green-500' :
                    backer.type === 'organization' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <a 
                    href={`https://github.com/${backer.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {backer.login}
                  </a>
                </div>
                <div className="text-sm text-muted-foreground">
                  {backer.detail}
                </div>
              </div>
            ))}
          </div>

          {data.notableBackers.length > 5 && (
            <div className="mt-2 text-sm text-center text-muted-foreground">
              +{data.notableBackers.length - 5} more notable backers
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
        Repository: {data.repoFullName}
      </div>
    </div>
  );
}
