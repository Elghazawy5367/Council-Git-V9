import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/primitives/dialog';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';
import { Switch } from '@/components/primitives/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/tabs';
import { useFeatureConfigStore } from '@/features/council/store/feature-config-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { toast } from 'sonner';

interface FeatureConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string | null;
}

export const FeatureConfigModal: React.FC<FeatureConfigModalProps> = ({ isOpen, onClose, initialTab }) => {
  const defaultTab = initialTab && ['scout', 'mirror', 'quality', 'self-improve', 'stargazer', 'data', 'forms', 'errors', 'auth', 'more', 'reddit-sniper', 'reddit-pain-points', 'github-trending', 'market-gap', 'viral-radar', 'twin-mimicry', 'fork-evolution', 'hackernews'].includes(initialTab) 
    ? initialTab 
    : "scout";

  const {
    scout,
    mirror,
    quality,
    selfImprove,
    stargazerAnalysis,
    githubTrending,
    marketGap,
    redditSniper,
    redditPainPoints,
    viralRadar,
    hackerNews,
    twinMimicry,
    forkEvolution,
    hiest,
    dataFetching,
    typeSafeForms,
    errorHandling,
    mobileDrawers,
    localDatabase,
    updateScoutConfig,
    updateMirrorConfig,
    updateQualityConfig,
    updateSelfImproveConfig,
    updateStargazerAnalysisConfig,
    updateGitHubTrendingConfig,
    updateMarketGapConfig,
    updateRedditSniperConfig,
    updateRedditPainPointsConfig,
    updateViralRadarConfig,
    updateHackerNewsConfig,
    updateTwinMimicryConfig,
    updateForkEvolutionConfig,
    updateHIESTConfig,
    updateDataFetchingConfig,
    updateTypeSafeFormsConfig,
    updateErrorHandlingConfig,
    updateMobileDrawersConfig,
    updateLocalDatabaseConfig,
    resetToDefaults,
  } = useFeatureConfigStore();

  const handleSave = (): void => {
    toast.success('Configuration saved successfully');
    onClose();
  };

  const handleReset = (): void => {
    resetToDefaults();
    toast.info('Reset to default configuration');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto glass-panel">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            ⚙️ Feature Configuration Center
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Fine-tune each feature with scheduling, thresholds, and advanced options
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-1 bg-muted/30 p-1 h-auto">
            <TabsTrigger value="scout" className="text-xs px-2 py-2">
              <span className="mr-1">👻</span> Scout
            </TabsTrigger>
            <TabsTrigger value="mirror" className="text-xs px-2 py-2">
              <span className="mr-1">🪞</span> Mirror
            </TabsTrigger>
            <TabsTrigger value="quality" className="text-xs px-2 py-2">
              <span className="mr-1">⚡</span> Quality
            </TabsTrigger>
            <TabsTrigger value="self-improve" className="text-xs px-2 py-2">
              <span className="mr-1">🧠</span> Improve
            </TabsTrigger>
            <TabsTrigger value="stargazer" className="text-xs px-2 py-2">
              <span className="mr-1">⭐</span> Stargazer
            </TabsTrigger>
            <TabsTrigger value="reddit-sniper" className="text-xs px-2 py-2">
              <span className="mr-1">🎯</span> Sniper
            </TabsTrigger>
            <TabsTrigger value="reddit-pain-points" className="text-xs px-2 py-2">
              <span className="mr-1">💬</span> Pain
            </TabsTrigger>
            <TabsTrigger value="viral-radar" className="text-xs px-2 py-2">
              <span className="mr-1">📡</span> Viral
            </TabsTrigger>
            <TabsTrigger value="hackernews" className="text-xs px-2 py-2">
              <span className="mr-1">🗞️</span> HN/PH
            </TabsTrigger>
            <TabsTrigger value="twin-mimicry" className="text-xs px-2 py-2">
              <span className="mr-1">👯</span> Mimic
            </TabsTrigger>
            <TabsTrigger value="fork-evolution" className="text-xs px-2 py-2">
              <span className="mr-1">🍴</span> Fork
            </TabsTrigger>
            <TabsTrigger value="data" className="text-xs px-2 py-2">
              <span className="mr-1">📊</span> Data
            </TabsTrigger>
            <TabsTrigger value="forms" className="text-xs px-2 py-2">
              <span className="mr-1">📝</span> Forms
            </TabsTrigger>
            <TabsTrigger value="errors" className="text-xs px-2 py-2">
              <span className="mr-1">🛡️</span> Errors
            </TabsTrigger>
            <TabsTrigger value="github-trending" className="text-xs px-2 py-2">
              <span className="mr-1">📈</span> Trending
            </TabsTrigger>
            <TabsTrigger value="market-gap" className="text-xs px-2 py-2">
              <span className="mr-1">🎯</span> Gaps
            </TabsTrigger>
            <TabsTrigger value="scout" className="text-xs px-2 py-2">
              <span className="mr-1">👻</span> Scout
            </TabsTrigger>
            <TabsTrigger value="hiest" className="text-xs px-2 py-2">
              <span className="mr-1">💎</span> HIEST
            </TabsTrigger>
            <TabsTrigger value="more" className="text-xs px-2 py-2">
              <span className="mr-1">➕</span> More
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scout" className="space-y-4">
            <Card className="border-2 border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">👻</div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Phantom Scout Configuration</CardTitle>
                    <CardDescription className="mt-1">
                      Automated GitHub intelligence gathering & Blue Ocean opportunity discovery
                    </CardDescription>
                  </div>
                  <Switch
                    checked={scout.enabled}
                    onCheckedChange={(checked) => updateScoutConfig({ enabled: checked })}
                    className="ml-auto"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scout-niche" className="flex items-center gap-2">🎯 Target Niche</Label>
                    <Input
                      id="scout-niche"
                      value={scout.targetNiche}
                      onChange={(e) => updateScoutConfig({ targetNiche: e.target.value })}
                      placeholder="e.g., developer-tools, react-native"
                      className="glass-panel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scout-depth" className="flex items-center gap-2">🔍 Scan Depth</Label>
                    <Select value={scout.depth} onValueChange={(value: 'shallow' | 'normal' | 'deep') => updateScoutConfig({ depth: value })}>
                      <SelectTrigger id="scout-depth" className="glass-panel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shallow">⚡ Shallow (Fast - 30s)</SelectItem>
                        <SelectItem value="normal">🎯 Normal (Balanced - 2min)</SelectItem>
                        <SelectItem value="deep">🔬 Deep (Thorough - 5min)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scout-min-stars">⭐ Minimum Stars</Label>
                    <Input
                      id="scout-min-stars"
                      type="number"
                      value={scout.minStars}
                      onChange={(e) => updateScoutConfig({ minStars: parseInt(e.target.value) })}
                      className="glass-panel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scout-min-upvotes">👍 Minimum Upvotes</Label>
                    <Input
                      id="scout-min-upvotes"
                      type="number"
                      value={scout.minUpvotes}
                      onChange={(e) => updateScoutConfig({ minUpvotes: parseInt(e.target.value) })}
                      className="glass-panel"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mirror" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🔄 Code Mirror Configuration</CardTitle>
                <CardDescription>Code quality analysis settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mirror-enabled">Enable Mirror</Label>
                  <Switch
                    id="mirror-enabled"
                    checked={mirror.enabled}
                    onCheckedChange={(checked) => updateMirrorConfig({ enabled: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="mirror-report">Generate Detailed Report</Label>
                  <Switch
                    id="mirror-report"
                    checked={mirror.generateReport}
                    onCheckedChange={(checked) => updateMirrorConfig({ generateReport: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>⚡ QUALITY Pipeline Configuration</CardTitle>
                <CardDescription>Automated quality improvements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quality-enabled">Enable Quality Pipeline</Label>
                  <Switch
                    id="quality-enabled"
                    checked={quality.enabled}
                    onCheckedChange={(checked) => updateQualityConfig({ enabled: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="quality-autofix">Auto-Fix Issues</Label>
                  <Switch
                    id="quality-autofix"
                    checked={quality.autoFix}
                    onCheckedChange={(checked) => updateQualityConfig({ autoFix: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="self-improve" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🧠 Self-Improve Configuration</CardTitle>
                <CardDescription>Learn from successful repositories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="improve-enabled">Enable Self-Improve</Label>
                  <Switch
                    id="improve-enabled"
                    checked={selfImprove.enabled}
                    onCheckedChange={(checked) => updateSelfImproveConfig({ enabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stargazer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>⭐ Stargazer Quality Analysis</CardTitle>
                <CardDescription>Analyze star quality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stargazer-enabled">Enable Analysis</Label>
                  <Switch
                    id="stargazer-enabled"
                    checked={stargazerAnalysis.enabled}
                    onCheckedChange={(checked) => updateStargazerAnalysisConfig({ enabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reddit-sniper" className="space-y-4">
            <Card className="border-2 border-red-500/20 bg-gradient-to-br from-red-500/5 to-orange-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🎯</div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Reddit Sniper Configuration</CardTitle>
                    <CardDescription className="mt-1">
                      Detect high-intent buying signals on Reddit in real-time
                    </CardDescription>
                  </div>
                  <Switch
                    checked={redditSniper.enabled}
                    onCheckedChange={(checked) => updateRedditSniperConfig({ enabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>🎯 Min Intent Score (0-10)</Label>
                    <Input 
                      type="number" 
                      value={redditSniper.minIntentScore} 
                      onChange={(e) => updateRedditSniperConfig({ minIntentScore: parseInt(e.target.value) })}
                      className="glass-panel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>📡 Target Subreddits</Label>
                    <Input 
                      value={redditSniper.subreddits.join(', ')} 
                      onChange={(e) => updateRedditSniperConfig({ subreddits: e.target.value.split(',').map(s => s.trim()) })}
                      placeholder="e.g. saas, entrepreneur"
                      className="glass-panel"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reddit-pain-points" className="space-y-4">
            <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">💬</div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Pain Point Extractor</CardTitle>
                    <CardDescription className="mt-1">
                      Extract market gaps and user frustrations from targeted subreddits
                    </CardDescription>
                  </div>
                  <Switch
                    checked={redditPainPoints.enabled}
                    onCheckedChange={(checked) => updateRedditPainPointsConfig({ enabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>📡 Target Subreddits</Label>
                    <Input 
                      value={redditPainPoints.targetSubreddits.join(', ')} 
                      onChange={(e) => updateRedditPainPointsConfig({ targetSubreddits: e.target.value.split(',').map(s => s.trim()) })}
                      placeholder="e.g. startup, programming"
                      className="glass-panel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>🧠 Analysis Model</Label>
                    <Select value={redditPainPoints.analysisModel} onValueChange={(value) => updateRedditPainPointsConfig({ analysisModel: value })}>
                      <SelectTrigger className="glass-panel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o (Deep Analysis)</SelectItem>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini (Fast/Efficient)</SelectItem>
                        <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet (Nuanced)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="viral-radar" className="space-y-4">
            <Card className="border-2 border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">📡</div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Viral Radar Configuration</CardTitle>
                    <CardDescription className="mt-1">
                      Track viral trends across Twitter, Reddit, and HN
                    </CardDescription>
                  </div>
                  <Switch
                    checked={viralRadar.enabled}
                    onCheckedChange={(checked) => updateViralRadarConfig({ enabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>🔥 Min Viral Score (0-10)</Label>
                    <Input 
                      type="number" 
                      value={viralRadar.minViralScore} 
                      onChange={(e) => updateViralRadarConfig({ minViralScore: parseInt(e.target.value) })}
                      className="glass-panel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>🌐 Active Platforms</Label>
                    <Input 
                      value={viralRadar.platforms.join(', ')} 
                      onChange={(e) => updateViralRadarConfig({ platforms: e.target.value.split(',').map(s => s.trim()) })}
                      placeholder="twitter, reddit, hackernews"
                      className="glass-panel"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hackernews" className="space-y-4">
            <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-yellow-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🗞️</div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">HackerNews & ProductHunt Intelligence</CardTitle>
                    <CardDescription className="mt-1">
                      Extract buying intent signals and tech trends from the tech community
                    </CardDescription>
                  </div>
                  <Switch
                    checked={hackerNews.enabled}
                    onCheckedChange={(checked) => updateHackerNewsConfig({ enabled: checked, schedule: hackerNews.schedule })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>⏰ Run Schedule (Cron)</Label>
                  <Input 
                    value={hackerNews.schedule} 
                    onChange={(e) => updateHackerNewsConfig({ enabled: hackerNews.enabled, schedule: e.target.value })}
                    placeholder="0 12 * * *"
                    className="glass-panel"
                  />
                  <p className="text-xs text-muted-foreground italic">Current: {hackerNews.schedule === '0 12 * * *' ? 'Every day at 12 PM UTC' : hackerNews.schedule}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="twin-mimicry" className="space-y-4">
            <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">👯</div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Twin Mimicry Configuration</CardTitle>
                    <CardDescription className="mt-1">
                      Mimic high-performing repository styles and patterns
                    </CardDescription>
                  </div>
                  <Switch
                    checked={twinMimicry.enabled}
                    onCheckedChange={(checked) => updateTwinMimicryConfig({ enabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>🎯 Target Repository</Label>
                    <Input 
                      value={twinMimicry.targetRepo} 
                      onChange={(e) => updateTwinMimicryConfig({ targetRepo: e.target.value })}
                      placeholder="owner/repo"
                      className="glass-panel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>🎨 Mimic Style</Label>
                    <Select value={twinMimicry.mimicStyle} onValueChange={(value: 'exact' | 'balanced' | 'creative') => updateTwinMimicryConfig({ mimicStyle: value })}>
                      <SelectTrigger className="glass-panel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exact">🏗️ Exact (Structural)</SelectItem>
                        <SelectItem value="balanced">🧠 Balanced (Logic)</SelectItem>
                        <SelectItem value="creative">🚀 Creative (Full)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fork-evolution" className="space-y-4">
            <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-yellow-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🍴</div>
                  <CardTitle className="text-xl">Fork Evolution</CardTitle>
                  <Switch
                    checked={forkEvolution.enabled}
                    onCheckedChange={(checked) => updateForkEvolutionConfig({ enabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>🍴 Minimum Forks</Label>
                  <Input 
                    type="number" 
                    value={forkEvolution.minForks} 
                    onChange={(e) => updateForkEvolutionConfig({ minForks: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>📊 Data & Caching</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Caching</Label>
                  <Switch checked={dataFetching.useCaching} onCheckedChange={(checked) => updateDataFetchingConfig({ useCaching: checked })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>📝 Type-Safe Forms</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Use Zod</Label>
                  <Switch checked={typeSafeForms.useZod} onCheckedChange={(checked) => updateTypeSafeFormsConfig({ useZod: checked })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>🛡️ Error Handling</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Retry</Label>
                  <Switch checked={errorHandling.useRetry} onCheckedChange={(checked) => updateErrorHandlingConfig({ useRetry: checked })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="github-trending" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>📈 GitHub Trending</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Scans</Label>
                  <Switch checked={githubTrending.enabled} onCheckedChange={(checked) => updateGitHubTrendingConfig({ enabled: checked })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market-gap" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>🎯 Market Gaps</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Analysis</Label>
                  <Switch checked={marketGap.enabled} onCheckedChange={(checked) => updateMarketGapConfig({ enabled: checked })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hiest" className="space-y-4">
            <Card className="border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">💎</div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">HIEST Master Orchestration</CardTitle>
                    <CardDescription className="mt-1">
                      High-Impact Intelligence & Extraction Strategy Tool - Cross-platform correlation engine
                    </CardDescription>
                  </div>
                  <Switch
                    checked={hiest.enabled}
                    onCheckedChange={(checked) => updateHIESTConfig({ enabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>🎯 Orchestration Mode</Label>
                    <Select value={hiest.orchestrationMode} onValueChange={(value: 'aggressive' | 'balanced' | 'conservative') => updateHIESTConfig({ orchestrationMode: value })}>
                      <SelectTrigger className="glass-panel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aggressive">🚀 Aggressive (Maximum Signals)</SelectItem>
                        <SelectItem value="balanced">⚖️ Balanced (Optimal ROI)</SelectItem>
                        <SelectItem value="conservative">🛡️ Conservative (High Precision)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>🔬 Correlation Depth (1-10)</Label>
                    <Input 
                      type="number" 
                      value={hiest.correlationDepth} 
                      onChange={(e) => updateHIESTConfig({ correlationDepth: parseInt(e.target.value) })}
                      className="glass-panel"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <div className="space-y-0.5">
                    <Label>✨ Auto-Extract Insights</Label>
                    <p className="text-xs text-muted-foreground">Automatically synthesize correlated signals into reports</p>
                  </div>
                  <Switch 
                    checked={hiest.autoExtract}
                    onCheckedChange={(checked) => updateHIESTConfig({ autoExtract: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="more" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>📱 UI/UX & Storage</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Mobile Drawers</Label>
                  <Switch checked={mobileDrawers.enabled} onCheckedChange={(checked) => updateMobileDrawersConfig({ enabled: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Local Database</Label>
                  <Switch checked={localDatabase.enabled} onCheckedChange={(checked) => updateLocalDatabaseConfig({ enabled: checked })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4 border-t flex justify-between">
          <Button variant="outline" onClick={handleReset}>🔄 Reset</Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>💾 Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureConfigModal;