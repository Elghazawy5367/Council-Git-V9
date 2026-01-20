import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { Play, CheckCircle2, Clock, ExternalLink, ArrowLeft, Github, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GITHUB_OWNER, GITHUB_REPO, GITHUB_REPO_URL } from '@/lib/config';
import { useFeatureConfigStore } from '@/features/council/store/feature-config-store';
import { parseCronSchedule } from '@/lib/workflow-dispatcher';
import { MiningDrillPanel } from '@/features/council/components/MiningDrillPanel';
import { GoldmineDetector } from '@/features/council/components/GoldmineDetector';
import { loadAllOpportunities } from '@/lib/opportunity-loader';
import { Opportunity } from '@/lib/goldmine-detector';
import { getSessionKeys } from '@/features/council/lib/vault';

const FeatureConfigModal = lazy(() => import('@/features/council/components/FeatureConfigModal'));

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string;
  workflow: string;
  schedule: string;
  lastRun?: string;
  status: 'idle' | 'scheduled' | 'active';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const repoOwner = GITHUB_OWNER;
  const repoName = GITHUB_REPO;
  
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);
  
  const { 
    scout, 
    mirror, 
    quality, 
    selfImprove, 
    redditSniper, 
    redditPainPoints, 
    viralRadar,
    twinMimicry,
    forkEvolution,
    githubTrending, 
    marketGap,
    stargazerAnalysis 
  } = useFeatureConfigStore();
  
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setLoadingOpportunities(true);
      try {
        const keys = getSessionKeys();
        const opps = await loadAllOpportunities(keys?.githubApiKey);
        setOpportunities(opps);
      } catch (error) {
        console.error('Failed to load opportunities:', error);
      } finally {
        setLoadingOpportunities(false);
      }
    };
    
    void loadData();
  }, []);
  
  const [features, setFeatures] = useState<Feature[]>([]);
  
  useEffect(() => {
    setFeatures([
      {
        id: 'github-trending',
        name: 'GitHub Trending',
        description: 'Scans trending repositories for market opportunities',
        icon: '📈',
        workflow: 'github-trending.yml',
        schedule: githubTrending.schedule,
        status: githubTrending.enabled ? 'active' : 'idle',
      },
      {
        id: 'market-gap',
        name: 'Market Gap Identifier',
        description: 'Identifies underserved market gaps using GitHub & Reddit',
        icon: '🎯',
        workflow: 'market-gap.yml',
        schedule: marketGap.schedule,
        status: marketGap.enabled ? 'active' : 'idle',
      },
      {
        id: 'stargazer',
        name: 'Stargazer Analysis',
        description: 'Analyze repository stars for institutional backing',
        icon: '⭐',
        workflow: 'stargazer-analysis.yml',
        schedule: '0 0 * * *',
        status: stargazerAnalysis.enabled ? 'active' : 'idle',
      },
      {
        id: 'mirror',
        name: 'Code Mirror System',
        description: 'Analyze codebase against elite repository standards',
        icon: '🔄',
        workflow: 'code-mirror.yml',
        schedule: mirror.schedule,
        status: mirror.enabled ? 'active' : 'idle',
      },
      {
        id: 'quality',
        name: 'QUALITY Amplification Pipeline',
        description: 'Run full quality analysis and improvement pipeline',
        icon: '⚡',
        workflow: 'quality-pipeline.yml',
        schedule: quality.schedule,
        status: quality.enabled ? 'active' : 'idle',
      },
      {
        id: 'learn',
        name: 'Self-Improving Loop',
        description: 'Learn patterns from successful repositories',
        icon: '🧠',
        workflow: 'self-improve.yml',
        schedule: selfImprove.schedule,
        status: selfImprove.enabled ? 'active' : 'idle',
      },
      {
        id: 'reddit-sniper',
        name: 'Reddit Sniper',
        description: 'Detect high-intent buying signals on Reddit in real-time',
        icon: '🎯',
        workflow: 'reddit-sniper.yml',
        schedule: redditSniper.schedule,
        status: redditSniper.enabled ? 'active' : 'idle',
      },
      {
        id: 'reddit-pain-points',
        name: 'Reddit Pain Points',
        description: 'Extract market gaps and user frustrations from subreddits',
        icon: '💬',
        workflow: 'reddit-pain-points.yml',
        schedule: redditPainPoints.schedule,
        status: redditPainPoints.enabled ? 'active' : 'idle',
      },
      {
        id: 'viral-radar',
        name: 'Viral Radar',
        description: 'Track viral trends across Twitter, Reddit, and HN',
        icon: '📡',
        workflow: 'viral-radar.yml',
        schedule: viralRadar.schedule,
        status: viralRadar.enabled ? 'active' : 'idle',
      },
      {
        id: 'twin-mimicry',
        name: 'Twin Mimicry',
        description: 'Mimic high-performing repository styles and patterns',
        icon: '👯',
        workflow: 'twin-mimicry.yml',
        schedule: twinMimicry.schedule,
        status: twinMimicry.enabled ? 'active' : 'idle',
      },
      {
        id: 'fork-evolution',
        name: 'Fork Evolution',
        description: 'Track high-value forks and their innovative changes',
        icon: '🍴',
        workflow: 'fork-evolution.yml',
        schedule: forkEvolution.schedule,
        status: forkEvolution.enabled ? 'active' : 'idle',
      },
      {
        id: 'scout',
        name: 'Phantom Scout',
        description: '24/7 automated GitHub intelligence gathering',
        icon: '👻',
        workflow: 'daily-scout.yml',
        schedule: scout.schedule,
        status: scout.enabled ? 'active' : 'idle',
      },
      {
        id: 'sonar',
        name: 'Sonar (Blue Ocean Scanner)',
        description: 'Detect abandoned high-value repositories',
        icon: '📡',
        workflow: 'daily-scout.yml',
        schedule: scout.schedule,
        status: scout.enabled ? 'active' : 'idle',
      },
    ]);
  }, [githubTrending, marketGap, stargazerAnalysis, mirror, quality, selfImprove, redditSniper, redditPainPoints, viralRadar, twinMimicry, forkEvolution, scout]);

  const getWorkflowUrl = (workflow: string): string => {
    return `https://github.com/${repoOwner}/${repoName}/actions/workflows/${workflow}`;
  };

  const getTriggerUrl = (workflow: string): string => {
    return `https://github.com/${repoOwner}/${repoName}/actions/workflows/${workflow}`;
  };

  const getStatusBadge = (status: Feature['status']): JSX.Element => {
    const variants: Record<Feature['status'], { className: string; label: string; icon: JSX.Element }> = {
      idle: { 
        className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400', 
        label: 'Disabled',
        icon: <Clock className="h-3 w-3" />
      },
      scheduled: { 
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', 
        label: 'Scheduled',
        icon: <Clock className="h-3 w-3" />
      },
      active: { 
        className: 'bg-green-500/10 text-green-600 dark:text-green-400', 
        label: 'Active',
        icon: <CheckCircle2 className="h-3 w-3" />
      },
    };

    const { className, label, icon } = variants[status];
    return (
      <Badge className={`${className} flex items-center gap-1`}>
        {icon}
        {label}
      </Badge>
    );
  };

  const getFeatureConfig = (featureId: string): string => {
    switch (featureId) {
      case 'scout':
      case 'sonar':
        return `Niche: ${scout.targetNiche} | Min Stars: ${scout.minStars} | Depth: ${scout.depth}`;
      case 'reddit-sniper':
        return `Intent: >${redditSniper.minIntentScore}/10 | Subs: ${redditSniper.subreddits.join(', ')}`;
      case 'reddit-pain-points':
        return `Model: ${redditPainPoints.analysisModel} | Subs: ${redditPainPoints.targetSubreddits.join(', ')}`;
      case 'viral-radar':
        return `Score: >${viralRadar.minViralScore} | Platforms: ${viralRadar.platforms.join(', ')}`;
      case 'twin-mimicry':
        return `Target: ${twinMimicry.targetRepo || 'None'} | Style: ${twinMimicry.mimicStyle}`;
      case 'fork-evolution':
        return `Min Forks: ${forkEvolution.minForks} | Tracking: ${forkEvolution.trackChanges ? 'Yes' : 'No'}`;
      case 'github-trending':
        return `Topics: ${githubTrending.topics.join(', ')} | Langs: ${githubTrending.languages.join(', ')}`;
      case 'market-gap':
        return `Quality: >${marketGap.minQualityScore} | AI: ${marketGap.deepAnalysis ? 'Deep' : 'Fast'}`;
      case 'stargazer':
        return `Min Followers: ${stargazerAnalysis.minFollowers} | Co: ${stargazerAnalysis.targetCompanies.slice(0, 3).join(', ')}...`;
      case 'mirror':
        return `Report: ${mirror.generateReport ? 'Yes' : 'No'} | Standards: ${mirror.standards.length}`;
      case 'quality':
        return `Auto-fix: ${quality.autoFix ? 'Yes' : 'No'} | Lint: ${quality.runLinter ? 'Yes' : 'No'}`;
      case 'learn':
        return `Niche: ${selfImprove.niche} | Min Stars: ${selfImprove.minStars}`;
      default:
        return '';
    }
  };

  const handleOpenConfig = (id?: string) => {
    // Map feature IDs to modal tab IDs if necessary
    const tabMap: Record<string, string> = {
      'github-trending': 'github-trending',
      'market-gap': 'market-gap',
      'stargazer': 'stargazer',
      'mirror': 'mirror',
      'quality': 'quality',
      'learn': 'self-improve',
      'reddit-sniper': 'reddit-sniper',
      'reddit-pain-points': 'reddit-pain-points',
      'viral-radar': 'viral-radar',
      'twin-mimicry': 'twin-mimicry',
      'fork-evolution': 'fork-evolution',
      'scout': 'scout',
      'sonar': 'scout'
    };
    
    setSelectedFeatureId(id ? (tabMap[id] || id) : null);
    setShowConfigModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-panel border-b border-border/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-violet-500/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  Council Command Center
                </h1>
                <p className="text-xs text-muted-foreground">Manage your Mixture of Experts (MoE) agents • {features.filter(f => f.status === 'active' || f.status === 'scheduled').length} active</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/features')} 
                className="gap-2 glass-panel border-green-500/20 hover:bg-green-500/10"
              >
                <span className="text-lg">🤖</span>
                Jump To Controls
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleOpenConfig()} 
                className="gap-2 glass-panel border-violet-500/20 hover:bg-violet-500/10"
              >
                <Settings className="h-4 w-4" />
                System Config
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Suspense fallback={<div>Loading...</div>}>
        <FeatureConfigModal 
          isOpen={showConfigModal} 
          onClose={() => setShowConfigModal(false)} 
          initialTab={selectedFeatureId}
        />
      </Suspense>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Core Experts
              </h2>
              <Badge variant="outline" className="gap-2 glass-panel">
                <Github className="h-4 w-4" />
                Powered by GitHub Actions
              </Badge>
            </div>
            
            {features.map((feature) => (
              <Card key={feature.id} className="hover:shadow-xl hover:scale-[1.02] transition-all glass-panel border-2 border-violet-500/10">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{feature.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{feature.name}</CardTitle>
                        <CardDescription className="mt-1">{feature.description}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(feature.status)}
                  </div>
                  {feature.status === 'active' && (
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-green-400 font-mono">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      LIVE SIGNAL DETECTED
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{parseCronSchedule(feature.schedule)}</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded">
                    {getFeatureConfig(feature.id)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleOpenConfig(feature.id)}
                      size="sm"
                      variant="default"
                      className="gap-2 bg-violet-600/20 hover:bg-violet-600/40 text-violet-100 border border-violet-500/30"
                    >
                      <Settings className="h-4 w-4" />
                      Configure
                    </Button>
                    <Button
                      onClick={() => window.open(getTriggerUrl(feature.workflow), '_blank')}
                      size="sm"
                      className="gap-2 flex-1 bg-fuchsia-600/20 hover:bg-fuchsia-600/40 text-fuchsia-100 border border-fuchsia-500/30"
                    >
                      <Play className="h-4 w-4" />
                      Trigger
                    </Button>
                    <Button
                      onClick={() => window.open(getWorkflowUrl(feature.workflow), '_blank')}
                      size="sm"
                      variant="outline"
                      className="gap-2 glass-panel border-white/10 hover:bg-white/5"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Runs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 border-2 border-violet-500/20 glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Github className="h-6 w-6 text-violet-500" />
                  System Health
                </CardTitle>
                <CardDescription className="text-base">Real-time workflow monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs">API Gateway</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">ONLINE</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-violet-500/5 border border-violet-500/10">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Active Runs</p>
                    <p className="text-lg font-bold text-violet-300">13/13</p>
                  </div>
                  <div className="p-2 rounded bg-fuchsia-500/5 border border-fuchsia-500/10">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Last Sync</p>
                    <p className="text-lg font-bold text-fuchsia-300">Just Now</p>
                  </div>
                </div>

                <div className="p-3 bg-background/50 rounded-lg border border-violet-500/20">
                  <h4 className="font-semibold text-sm mb-2">Operational Controls</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start hover:bg-violet-500/10"
                      onClick={() => window.open(`${GITHUB_REPO_URL}/actions`, '_blank')}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub Actions Console
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start hover:bg-violet-500/10"
                      onClick={() => navigate('/quality')}
                    >
                      📊 Quality Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-2 border-violet-500/10">
              <CardHeader>
                <CardTitle className="text-lg">Intelligence Feed</CardTitle>
                <CardDescription>Access generated data and reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start glass-panel hover:bg-violet-500/10"
                  onClick={() => navigate('/features/scout')}
                >
                  👻 Phantom Scout (Active)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start glass-panel hover:bg-violet-500/10"
                  onClick={() => navigate('/features/scout')}
                >
                  📡 Sonar Scanner
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start glass-panel hover:bg-violet-500/10"
                  onClick={() => window.open(`${GITHUB_REPO_URL}/blob/main/data/intelligence/latest.md`, '_blank')}
                >
                  📄 Latest Scout Report
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start glass-panel hover:bg-violet-500/10"
                  onClick={() => window.open(`${GITHUB_REPO_URL}/blob/main/data/opportunities/latest.json`, '_blank')}
                >
                  🎯 Blue Ocean Ops
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start glass-panel hover:bg-violet-500/10"
                  onClick={() => navigate('/features')}
                >
                  🪞 Mirror Reports
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start glass-panel hover:bg-violet-500/10"
                  onClick={() => navigate('/quality')}
                >
                  🧠 Learned Patterns
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <MiningDrillPanel />
        </div>

        <div className="mt-8">
          {loadingOpportunities ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent></Card>
          ) : (
            <GoldmineDetector opportunities={opportunities} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;