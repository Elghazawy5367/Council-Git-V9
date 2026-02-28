import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { Play, CheckCircle2, Clock, ExternalLink, ArrowLeft, Github, Calendar, Settings, Zap, Shield, BarChart3, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GITHUB_OWNER, GITHUB_REPO, GITHUB_REPO_URL } from '@/lib/config';
import { useFeatureConfigStore } from '@/features/council/store/feature-config-store';
import { parseCronSchedule } from '@/lib/workflow-dispatcher';
import { MiningDrillPanel } from '@/features/council/components/MiningDrillPanel';
import { GoldmineDetector } from '@/features/council/components/GoldmineDetector';
import { loadAllOpportunities } from '@/lib/opportunity-loader';
import { Opportunity } from '@/lib/goldmine-detector';
import { getSessionKeys } from '@/features/council/lib/vault';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/tabs';
import { ReportsViewer } from '@/features/automation/components/ReportsViewer';
import { FeaturesDashboard } from '@/features/automation/components/FeaturesDashboard';
import { DashboardLayout as AnalyticsDashboard } from '@/features/dashboard/components/DashboardLayout';

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
  category: 'github' | 'reddit' | 'hybrid' | 'intelligence' | 'system';
}

/**
 * AutomationDashboard - Unified Intelligence Command Center
 * Consolidates all core automation, monitoring, and analytics features
 */
const AutomationDashboard: React.FC = () => {
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
    githubTrending,
    marketGap,
    redditSniper,
    redditPainPoints,
    viralRadar,
    hackerNews,
    twinMimicry,
    forkEvolution,
    promptHeist,
    stargazerAnalysis
  } = useFeatureConfigStore();
  
  // Load opportunities on mount
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setLoadingOpportunities(true);
      try {
        const keys = getSessionKeys();
        const opps = await loadAllOpportunities(keys?.githubApiKey);
        setOpportunities(opps);
      } catch (error) {
        console.error('Failed to load opportunities:', error);
        toast.error('Failed to load opportunities');
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
        category: 'github'
      },
      {
        id: 'market-gap',
        name: 'Market Gap Identifier',
        description: 'Identifies underserved market gaps using GitHub & Reddit',
        icon: '🎯',
        workflow: 'market-gap.yml',
        schedule: marketGap.schedule,
        status: marketGap.enabled ? 'active' : 'idle',
        category: 'hybrid'
      },
      {
        id: 'stargazer',
        name: 'Stargazer Analysis',
        description: 'Analyze repository stars for institutional backing',
        icon: '⭐',
        workflow: 'stargazer-analysis.yml',
        schedule: '0 0 * * *',
        status: stargazerAnalysis.enabled ? 'active' : 'idle',
        category: 'github'
      },
      {
        id: 'mirror',
        name: 'Code Mirror System',
        description: 'Analyze codebase against elite repository standards',
        icon: '🔄',
        workflow: 'code-mirror.yml',
        schedule: mirror.schedule,
        status: mirror.enabled ? 'active' : 'idle',
        category: 'system'
      },
      {
        id: 'quality',
        name: 'QUALITY Amplification Pipeline',
        description: 'Run full quality analysis and improvement pipeline',
        icon: '⚡',
        workflow: 'quality-pipeline.yml',
        schedule: quality.schedule,
        status: quality.enabled ? 'active' : 'idle',
        category: 'system'
      },
      {
        id: 'learn',
        name: 'Self-Improving Loop',
        description: 'Learn patterns from successful repositories',
        icon: '🧠',
        workflow: 'self-improve.yml',
        schedule: selfImprove.schedule,
        status: selfImprove.enabled ? 'active' : 'idle',
        category: 'intelligence'
      },
      {
        id: 'reddit-sniper',
        name: 'Reddit Sniper',
        description: 'Detect high-intent buying signals on Reddit in real-time',
        icon: '🎯',
        workflow: 'reddit-sniper.yml',
        schedule: redditSniper.schedule,
        status: redditSniper.enabled ? 'active' : 'idle',
        category: 'reddit'
      },
      {
        id: 'reddit-pain-points',
        name: 'Reddit Pain Points',
        description: 'Extract market gaps and user frustrations from subreddits',
        icon: '💬',
        workflow: 'reddit-pain-points.yml',
        schedule: redditPainPoints.schedule,
        status: redditPainPoints.enabled ? 'active' : 'idle',
        category: 'reddit'
      },
      {
        id: 'viral-radar',
        name: 'Viral Radar',
        description: 'Track viral trends across Twitter, Reddit, and HN',
        icon: '📡',
        workflow: 'viral-radar.yml',
        schedule: viralRadar.schedule,
        status: viralRadar.enabled ? 'active' : 'idle',
        category: 'intelligence'
      },
      {
        id: 'hackernews',
        name: 'HackerNews Intelligence',
        description: 'Extract buying intent signals and tech trends from HN',
        icon: '🗞️',
        workflow: 'hackernews-producthunt.yml',
        schedule: hackerNews.schedule,
        status: hackerNews.enabled ? 'active' : 'idle',
        category: 'intelligence'
      },
      {
        id: 'twin-mimicry',
        name: 'Twin Mimicry',
        description: 'Mimic high-performing repository styles and patterns',
        icon: '👯',
        workflow: 'twin-mimicry.yml',
        schedule: twinMimicry.schedule,
        status: twinMimicry.enabled ? 'active' : 'idle',
        category: 'intelligence'
      },
      {
        id: 'fork-evolution',
        name: 'Fork Evolution',
        description: 'Track high-value forks and their innovative changes',
        icon: '🍴',
        workflow: 'fork-evolution.yml',
        schedule: forkEvolution.schedule,
        status: forkEvolution.enabled ? 'active' : 'idle',
        category: 'github'
      },
      {
        id: 'heist',
        name: 'The HEIST',
        description: 'Import 290+ world-class prompts from danielmiessler/fabric',
        icon: '🎭',
        workflow: 'heist-prompts.ts',
        schedule: 'monthly',
        status: promptHeist.enabled ? 'active' : 'idle',
        category: 'intelligence'
      },
      {
        id: 'scout',
        name: 'Phantom Scout',
        description: '24/7 automated GitHub intelligence gathering',
        icon: '👻',
        workflow: 'daily-scout.yml',
        schedule: scout.schedule,
        status: scout.enabled ? 'active' : 'idle',
        category: 'github'
      },
    ]);
  }, [scout, mirror, quality, selfImprove, githubTrending, marketGap, redditSniper, redditPainPoints, viralRadar, twinMimicry, forkEvolution, promptHeist, stargazerAnalysis, hackerNews]);

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
        return `Niche: ${scout.targetNiche} | Min Stars: ${scout.minStars} | Depth: ${scout.depth}`;
      case 'reddit-sniper':
        return `Intent: >${redditSniper.minIntentScore}/10 | Subs: ${redditSniper.subreddits.join(', ')}`;
      case 'reddit-pain-points':
        return `Model: ${redditPainPoints.analysisModel} | Subs: ${redditPainPoints.targetSubreddits.join(', ')}`;
      case 'viral-radar':
        return `Score: >${viralRadar.minViralScore} | Platforms: ${viralRadar.platforms.join(', ')}`;
      case 'hackernews':
        return `Schedule: ${hackerNews.schedule}`;
      case 'twin-mimicry':
        return `Target: ${twinMimicry.targetRepo || 'None'} | Style: ${twinMimicry.mimicStyle}`;
      case 'fork-evolution':
        return `Min Forks: ${forkEvolution.minForks} | Tracking: ${forkEvolution.trackChanges ? 'Yes' : 'No'}`;
      case 'heist':
        return `Patterns: ${promptHeist.patternsEnabled.length} enabled | Cache: ${promptHeist.cacheExpiry}h | Auto-update: ${promptHeist.autoUpdate ? 'On' : 'Off'}`;
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
      'hackernews': 'hackernews',
      'twin-mimicry': 'twin-mimicry',
      'fork-evolution': 'fork-evolution',
      'scout': 'scout',
    };
    
    setSelectedFeatureId(id ? (tabMap[id] || id) : null);
    setShowConfigModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-panel border-b border-border/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-violet-500/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  Intelligence Command Center
                </h1>
                <p className="text-xs text-muted-foreground">Unified management for {features.length} intelligence vectors</p>
              </div>
            </div>
            <div className="flex gap-2">
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
        <Tabs defaultValue="features" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto glass-panel p-1">
            <TabsTrigger value="features" className="gap-2">
              <Zap className="h-4 w-4" />
              Features
            </TabsTrigger>
            <TabsTrigger value="automation" className="gap-2">
              <Shield className="h-4 w-4" />
              Live Monitoring
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <Database className="h-4 w-4" />
              Intelligence Feed
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Council Metrics
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="gap-2">
              <Play className="h-4 w-4" />
              Blue Ocean
            </TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Features List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Core Vectors
                  </h2>
                  <Badge variant="outline" className="gap-2 glass-panel">
                    <Github className="h-4 w-4" />
                    Actionable Intelligence
                  </Badge>
                </div>
                
                {features.map((feature) => (
                  <Card key={feature.id} className="hover:shadow-xl hover:scale-[1.01] transition-all glass-panel border-2 border-violet-500/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{feature.icon}</span>
                          <div>
                            <CardTitle className="text-lg">{feature.name}</CardTitle>
                            <CardDescription className="mt-1 line-clamp-1">{feature.description}</CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(feature.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{parseCronSchedule(feature.schedule)}</span>
                      </div>

                      <div className="text-[10px] text-muted-foreground bg-muted/20 p-2 rounded font-mono truncate">
                        {getFeatureConfig(feature.id)}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleOpenConfig(feature.id)}
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs gap-2 hover:bg-violet-500/10"
                        >
                          <Settings className="h-3 w-3" />
                          Config
                        </Button>
                        <Button
                          onClick={() => window.open(getTriggerUrl(feature.workflow), '_blank')}
                          size="sm"
                          className="h-8 text-xs gap-2 flex-1 bg-violet-600/20 hover:bg-violet-600/40 text-violet-100 border border-violet-500/30"
                        >
                          <Play className="h-3 w-3" />
                          Trigger
                        </Button>
                        <Button
                          onClick={() => window.open(getWorkflowUrl(feature.workflow), '_blank')}
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs gap-2 hover:bg-white/5"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Runs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Info & Mining Panel */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 border-2 border-violet-500/20 glass-panel">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Zap className="h-6 w-6 text-violet-500" />
                      Live Intelligence
                    </CardTitle>
                    <CardDescription>Real-time data mining from global sources</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-mono text-[10px]">INTELLIGENCE GATEWAY</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">SYNCED</Badge>
                      </div>
                    </div>

                    <MiningDrillPanel />
                  </CardContent>
                </Card>

                <Card className="glass-panel border-2 border-violet-500/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Access Feed</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline"
                      size="sm" 
                      className="w-full justify-start glass-panel hover:bg-violet-500/10 gap-2"
                      onClick={() => window.open(`${GITHUB_REPO_URL}/actions`, '_blank')}
                    >
                      <Github className="h-4 w-4" />
                      View Workflow History
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm" 
                      className="w-full justify-start glass-panel hover:bg-violet-500/10 gap-2"
                      onClick={() => navigate('/quality')}
                    >
                      📊 System Quality Report
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start glass-panel hover:bg-violet-500/10 gap-2"
                      onClick={() => window.open(`${GITHUB_REPO_URL}/blob/main/data/intelligence/latest.md`, '_blank')}
                    >
                      📄 Latest Scout Summary
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automation">
            <FeaturesDashboard />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsViewer />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="opportunities">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Blue Ocean Opportunities</h2>
                  <p className="text-muted-foreground mt-2">
                    Detected high-demand repositories with low maintenance
                  </p>
                </div>
              </div>

              {loadingOpportunities ? (
                <Card>
                  <CardContent className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-12 w-12 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                      <p className="text-muted-foreground animate-pulse">Scanning the deep ocean...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <GoldmineDetector opportunities={opportunities} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AutomationDashboard;
