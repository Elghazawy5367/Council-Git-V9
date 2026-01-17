import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { Play, CheckCircle2, Clock, ExternalLink, ArrowLeft, Github, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

const FeaturesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const repoOwner = 'Elghazawy5367';
  const repoName = 'Council-Git-V7-RRR';
  
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);
  
  const { scout, mirror, quality, selfImprove } = useFeatureConfigStore();
  
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
      } finally {
        setLoadingOpportunities(false);
      }
    };
    
    void loadData();
  }, []);
  
  const [features] = useState<Feature[]>([
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
                  Feature Control Center
                </h1>
                <p className="text-xs text-muted-foreground">Run and manage core features • {features.filter(f => f.status === 'active').length} active</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/dashboard')} 
                className="gap-2 glass-panel border-green-500/20 hover:bg-green-500/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowConfigModal(true)} 
                className="gap-2 glass-panel border-violet-500/20 hover:bg-violet-500/10"
              >
                <Settings className="h-4 w-4" />
                Configure Features
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Suspense fallback={<div>Loading...</div>}>
        <FeatureConfigModal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} />
      </Suspense>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Features List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Core Features
              </h2>
              <Badge variant="outline" className="gap-2 glass-panel">
                <Github className="h-4 w-4" />
                Powered by GitHub Actions
              </Badge>
            </div>
            
            {features.map((feature) => (
              <Card key={feature.id} className="hover:shadow-xl hover:scale-[1.02] transition-all glass-panel border-2 border-violet-500/10">\n                <CardHeader>\n                  <div className="flex items-start justify-between">\n                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{feature.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{feature.name}</CardTitle>
                        <CardDescription className="mt-1">{feature.description}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(feature.status)}
                  </div>
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
                    {feature.id === 'scout' || feature.id === 'sonar' ? (
                      <Button
                        onClick={() => navigate('/features/scout')}
                        size="sm"
                        variant="default"
                        className="gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Configure
                      </Button>
                    ) : null}
                    <Button
                      onClick={() => window.open(getTriggerUrl(feature.workflow), '_blank')}
                      size="sm"
                      className="gap-2 flex-1"
                    >
                      <Play className="h-4 w-4" />
                      Trigger
                    </Button>
                    <Button
                      onClick={() => window.open(getWorkflowUrl(feature.workflow), '_blank')}
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Runs
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                    <code>Workflow: {feature.workflow}</code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

            {/* Info Panel */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 border-2 border-violet-500/20 glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Github className="h-6 w-6 text-violet-500" />
                  GitHub Actions Integration
                </CardTitle>
                <CardDescription className="text-base">Zero-cost automated intelligence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">How It Works</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-lg">✨</span>
                      Features run automatically on schedule
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-lg">🚀</span>
                      Trigger workflows manually anytime
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-lg">💾</span>
                      Results stored in repository
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-lg">🆓</span>
                      Completely free using GitHub Actions
                    </li>
                  </ul>
                </div>
                
                <div className="p-3 bg-background/50 rounded-lg border border-violet-500/20">
                  <h4 className="font-semibold text-sm mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start hover:bg-violet-500/10"
                      onClick={() => window.open(`https://github.com/${repoOwner}/${repoName}/actions`, '_blank')}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      View All Workflows
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
                <CardTitle className="text-lg">Latest Results</CardTitle>
                <CardDescription>Access generated reports and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start glass-panel hover:bg-violet-500/10"
                  onClick={() => window.open('/data/intelligence/latest.md', '_blank')}
                >
                  📄 Scout Intelligence Report
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start glass-panel hover:bg-violet-500/10"
                  onClick={() => window.open('/data/opportunities/latest.json', '_blank')}
                >
                  🎯 Blue Ocean Opportunities
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start glass-panel hover:bg-violet-500/10"
                  onClick={() => window.open('/attached_assets/', '_blank')}
                >
                  🪞 Mirror Reports
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start glass-panel hover:bg-violet-500/10"
                  onClick={() => window.open('/src/lib/knowledge-base/', '_blank')}
                >
                  🧠 Learned Patterns
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mining Drill Section */}
        <div className="mt-8">
          <MiningDrillPanel />
        </div>

        {/* Goldmine Detector Section */}
        <div className="mt-8">
          {loadingOpportunities ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Loading opportunities...
              </CardContent>
            </Card>
          ) : (
            <GoldmineDetector opportunities={opportunities} />
          )}
        </div>
      </main>
    </div>
  );
};

export default FeaturesDashboard;
