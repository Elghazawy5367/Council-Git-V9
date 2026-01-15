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
  const defaultTab = initialTab && ['scout', 'mirror', 'quality', 'self-improve', 'stargazer', 'data', 'forms', 'errors', 'auth', 'more', 'reddit-sniper', 'reddit-pain-points', 'github-trending', 'market-gap'].includes(initialTab) 
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
    dataFetching,
    typeSafeForms,
    errorHandling,
    authSecurity,
    mobileDrawers,
    virtualizedLists,
    streamingAI,
    agentOrchestration,
    localDatabase,
    updateScoutConfig,
    updateMirrorConfig,
    updateQualityConfig,
    updateSelfImproveConfig,
    updateStargazerAnalysisConfig,
    updateGitHubTrendingConfig,
    updateMarketGapConfig,
    updateDataFetchingConfig,
    updateTypeSafeFormsConfig,
    updateErrorHandlingConfig,
    updateAuthSecurityConfig,
    updateMobileDrawersConfig,
    updateVirtualizedListsConfig,
    updateStreamingAIConfig,
    updateAgentOrchestrationConfig,
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
            <TabsTrigger value="data" className="text-xs px-2 py-2">
              <span className="mr-1">📊</span> Data
            </TabsTrigger>
            <TabsTrigger value="forms" className="text-xs px-2 py-2">
              <span className="mr-1">📝</span> Forms
            </TabsTrigger>
            <TabsTrigger value="errors" className="text-xs px-2 py-2">
              <span className="mr-1">🛡️</span> Errors
            </TabsTrigger>
            <TabsTrigger value="auth" className="text-xs px-2 py-2">
              <span className="mr-1">🔐</span> Auth
            </TabsTrigger>
            <TabsTrigger value="reddit-sniper" className="text-xs px-2 py-2">
              <span className="mr-1">🎯</span> Sniper
            </TabsTrigger>
            <TabsTrigger value="reddit-pain-points" className="text-xs px-2 py-2">
              <span className="mr-1">💬</span> Pain
            </TabsTrigger>
            <TabsTrigger value="github-trending" className="text-xs px-2 py-2">
              <span className="mr-1">📈</span> Trending
            </TabsTrigger>
            <TabsTrigger value="market-gap" className="text-xs px-2 py-2">
              <span className="mr-1">🎯</span> Gaps
            </TabsTrigger>
            <TabsTrigger value="more" className="text-xs px-2 py-2">
              <span className="mr-1">➕</span> More
            </TabsTrigger>
          </TabsList>

          {/* Scout Configuration */}
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
                    <Label htmlFor="scout-niche" className="flex items-center gap-2">
                      🎯 Target Niche
                    </Label>
                    <Input
                      id="scout-niche"
                      value={scout.targetNiche}
                      onChange={(e) => updateScoutConfig({ targetNiche: e.target.value })}
                      placeholder="e.g., developer-tools, react-native"
                      className="glass-panel"
                    />
                    <p className="text-xs text-muted-foreground">The market segment to analyze</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scout-depth" className="flex items-center gap-2">
                      🔍 Scan Depth
                    </Label>
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
                    <p className="text-xs text-muted-foreground">Analysis depth vs speed trade-off</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scout-min-stars" className="flex items-center gap-2">
                      ⭐ Minimum Stars
                    </Label>
                    <Input
                      id="scout-min-stars"
                      type="number"
                      value={scout.minStars}
                      onChange={(e) => updateScoutConfig({ minStars: parseInt(e.target.value) })}
                      className="glass-panel"
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">Filter out low-quality repos</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scout-max-repos" className="flex items-center gap-2">
                      📊 Maximum Repositories
                    </Label>
                    <Input
                      id="scout-max-repos"
                      type="number"
                      value={scout.maxRepos}
                      onChange={(e) => updateScoutConfig({ maxRepos: parseInt(e.target.value) })}
                      className="glass-panel"
                      min="1"
                      max="200"
                    />
                    <p className="text-xs text-muted-foreground">Cap analysis to avoid rate limits</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label htmlFor="scout-schedule" className="flex items-center gap-2">
                    ⏰ Automation Schedule (Cron)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="scout-schedule"
                      value={scout.schedule}
                      onChange={(e) => updateScoutConfig({ schedule: e.target.value })}
                      placeholder="0 6 * * *"
                      className="glass-panel flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="glass-panel"
                      onClick={() => updateScoutConfig({ schedule: '0 6 * * *' })}
                    >
                      Reset
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    <span>Daily at 6 AM UTC • Next run in ~12 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mirror Configuration */}
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

                <div className="space-y-2">
                  <Label htmlFor="mirror-schedule">Cron Schedule</Label>
                  <Input
                    id="mirror-schedule"
                    value={mirror.schedule}
                    onChange={(e) => updateMirrorConfig({ schedule: e.target.value })}
                    placeholder="0 8 * * 0"
                  />
                  <p className="text-xs text-muted-foreground">Weekly on Sundays at 8 AM UTC</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Configuration */}
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

                <div className="flex items-center justify-between">
                  <Label htmlFor="quality-linter">Run Linter</Label>
                  <Switch
                    id="quality-linter"
                    checked={quality.runLinter}
                    onCheckedChange={(checked) => updateQualityConfig({ runLinter: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="quality-typecheck">Run TypeScript Check</Label>
                  <Switch
                    id="quality-typecheck"
                    checked={quality.runTypeCheck}
                    onCheckedChange={(checked) => updateQualityConfig({ runTypeCheck: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality-schedule">Cron Schedule</Label>
                  <Input
                    id="quality-schedule"
                    value={quality.schedule}
                    onChange={(e) => updateQualityConfig({ schedule: e.target.value })}
                    placeholder="0 10 * * 2,5"
                  />
                  <p className="text-xs text-muted-foreground">Twice weekly - Tuesday and Friday at 10 AM UTC</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Self-Improve Configuration */}
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

                <div className="space-y-2">
                  <Label htmlFor="improve-niche">Target Niche</Label>
                  <Input
                    id="improve-niche"
                    value={selfImprove.niche}
                    onChange={(e) => updateSelfImproveConfig({ niche: e.target.value })}
                    placeholder="e.g., AI tools, React libraries"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improve-min-stars">Minimum Stars</Label>
                  <Input
                    id="improve-min-stars"
                    type="number"
                    value={selfImprove.minStars}
                    onChange={(e) => updateSelfImproveConfig({ minStars: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improve-max-repos">Maximum Repositories</Label>
                  <Input
                    id="improve-max-repos"
                    type="number"
                    value={selfImprove.maxRepos}
                    onChange={(e) => updateSelfImproveConfig({ maxRepos: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improve-schedule">Cron Schedule</Label>
                  <Input
                    id="improve-schedule"
                    value={selfImprove.schedule}
                    onChange={(e) => updateSelfImproveConfig({ schedule: e.target.value })}
                    placeholder="0 9 * * 1"
                  />
                  <p className="text-xs text-muted-foreground">Weekly on Mondays at 9 AM UTC</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stargazer Analysis Configuration */}
          <TabsContent value="stargazer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>⭐ Stargazer Quality Analysis</CardTitle>
                <CardDescription>Analyze WHO starred repos for institutional backing</CardDescription>
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

                <div className="space-y-2">
                  <Label htmlFor="stargazer-min-followers">Minimum Followers (Influencer)</Label>
                  <Input
                    id="stargazer-min-followers"
                    type="number"
                    value={stargazerAnalysis.minFollowers}
                    onChange={(e) => updateStargazerAnalysisConfig({ minFollowers: parseInt(e.target.value) })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="stargazer-check-companies">Check Company Affiliations</Label>
                  <Switch
                    id="stargazer-check-companies"
                    checked={stargazerAnalysis.checkCompanies}
                    onCheckedChange={(checked) => updateStargazerAnalysisConfig({ checkCompanies: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stargazer-max">Max Stargazers to Analyze</Label>
                  <Input
                    id="stargazer-max"
                    type="number"
                    value={stargazerAnalysis.maxStargazers}
                    onChange={(e) => updateStargazerAnalysisConfig({ maxStargazers: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Higher values = better accuracy but slower</p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <p className="font-medium mb-1">Target Companies:</p>
                  <p className="text-xs text-muted-foreground">
                    {stargazerAnalysis.targetCompanies.join(', ')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reddit Sniper Configuration */}
          <TabsContent value="reddit-sniper" className="space-y-4">
            <Card className="border-2 border-red-500/20 bg-gradient-to-br from-red-500/5 to-orange-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🎯</div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Reddit Sniper Configuration</CardTitle>
                    <CardDescription className="mt-1">
                      Real-time buying intent detection and lead generation
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>🎯 Minimum Intent Score (0-10)</Label>
                    <Input type="number" defaultValue={7} className="glass-panel" />
                  </div>
                  <div className="space-y-2">
                    <Label>📡 Target Subreddits</Label>
                    <Input defaultValue="SaaS, Entrepreneur, startups" className="glass-panel" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-500/10 rounded border border-red-500/20">
                  <span className="text-sm">Instant Notifications</span>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reddit Pain Points Configuration */}
          <TabsContent value="reddit-pain-points" className="space-y-4">
            <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">💬</div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Pain Point Extractor Configuration</CardTitle>
                    <CardDescription className="mt-1">
                      AI-powered market gap analysis and frustration mapping
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>🤖 Analysis Model</Label>
                  <Select defaultValue="gemini-2.0">
                    <SelectTrigger className="glass-panel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini-2.0">Gemini 2.0 Flash Thinking</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded border border-blue-500/20">
                  <span className="text-sm">Deep AI Analysis</span>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GitHub Trending Configuration */}
          <TabsContent value="github-trending" className="space-y-4">
            <Card className="border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">📈</div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">GitHub Trending Scanner</CardTitle>
                    <CardDescription className="mt-1">
                      Identify emerging technologies and market opportunities
                    </CardDescription>
                  </div>
                  <Switch
                    checked={githubTrending.enabled}
                    onCheckedChange={(checked) => updateGitHubTrendingConfig({ enabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>🎯 Topics</Label>
                    <Input 
                      value={githubTrending.topics.join(', ')} 
                      onChange={(e) => updateGitHubTrendingConfig({ topics: e.target.value.split(',').map(s => s.trim()) })}
                      className="glass-panel" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>💻 Languages</Label>
                    <Input 
                      value={githubTrending.languages.join(', ')} 
                      onChange={(e) => updateGitHubTrendingConfig({ languages: e.target.value.split(',').map(s => s.trim()) })}
                      className="glass-panel" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Gap Identifier Configuration */}
          <TabsContent value="market-gap" className="space-y-4">
            <Card className="border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🎯</div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Market Gap Identifier</CardTitle>
                    <CardDescription className="mt-1">
                      Hybrid analysis of GitHub and Reddit data
                    </CardDescription>
                  </div>
                  <Switch
                    checked={marketGap.enabled}
                    onCheckedChange={(checked) => updateMarketGapConfig({ enabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded border border-amber-500/20">
                  <span className="text-sm">Deep AI Analysis</span>
                  <Switch 
                    checked={marketGap.deepAnalysis}
                    onCheckedChange={(checked) => updateMarketGapConfig({ deepAnalysis: checked })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>✨ Minimum Quality Score</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    value={marketGap.minQualityScore} 
                    onChange={(e) => updateMarketGapConfig({ minQualityScore: parseFloat(e.target.value) })}
                    className="glass-panel" 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Fetching Configuration */}
          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📊 Data Fetching & Caching</CardTitle>
                <CardDescription>React Query configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-enabled">Enable Advanced Fetching</Label>
                  <Switch
                    id="data-enabled"
                    checked={dataFetching.enabled}
                    onCheckedChange={(checked) => updateDataFetchingConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="data-caching">Enable Caching</Label>
                  <Switch
                    id="data-caching"
                    checked={dataFetching.useCaching}
                    onCheckedChange={(checked) => updateDataFetchingConfig({ useCaching: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-expiry">Cache Expiry (hours)</Label>
                  <Input
                    id="data-expiry"
                    type="number"
                    value={dataFetching.cacheExpiry}
                    onChange={(e) => updateDataFetchingConfig({ cacheExpiry: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Type-Safe Forms Configuration */}
          <TabsContent value="forms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📝 Type-Safe Forms</CardTitle>
                <CardDescription>Zod validation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="forms-enabled">Enable Type-Safe Forms</Label>
                  <Switch
                    id="forms-enabled"
                    checked={typeSafeForms.enabled}
                    onCheckedChange={(checked) => updateTypeSafeFormsConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="forms-zod">Use Zod Validation</Label>
                  <Switch
                    id="forms-zod"
                    checked={typeSafeForms.useZod}
                    onCheckedChange={(checked) => updateTypeSafeFormsConfig({ useZod: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="forms-validate-change">Validate on Change</Label>
                  <Switch
                    id="forms-validate-change"
                    checked={typeSafeForms.validateOnChange}
                    onCheckedChange={(checked) => updateTypeSafeFormsConfig({ validateOnChange: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Error Handling Configuration */}
          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🛡️ Error Handling</CardTitle>
                <CardDescription>Retry and circuit breaker settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="errors-enabled">Enable Advanced Error Handling</Label>
                  <Switch
                    id="errors-enabled"
                    checked={errorHandling.enabled}
                    onCheckedChange={(checked) => updateErrorHandlingConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="errors-retry">Enable Automatic Retry</Label>
                  <Switch
                    id="errors-retry"
                    checked={errorHandling.useRetry}
                    onCheckedChange={(checked) => updateErrorHandlingConfig({ useRetry: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="errors-max-retries">Max Retry Attempts</Label>
                  <Input
                    id="errors-max-retries"
                    type="number"
                    value={errorHandling.maxRetries}
                    onChange={(e) => updateErrorHandlingConfig({ maxRetries: parseInt(e.target.value) })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="errors-circuit-breaker">Circuit Breaker</Label>
                  <Switch
                    id="errors-circuit-breaker"
                    checked={errorHandling.circuitBreaker}
                    onCheckedChange={(checked) => updateErrorHandlingConfig({ circuitBreaker: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auth & Security Configuration */}
          <TabsContent value="auth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🔐 Authentication & Security</CardTitle>
                <CardDescription>Vault and session settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auth-enabled">Enable Security Features</Label>
                  <Switch
                    id="auth-enabled"
                    checked={authSecurity.enabled}
                    onCheckedChange={(checked) => updateAuthSecurityConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auth-vault">Use Encrypted Vault</Label>
                  <Switch
                    id="auth-vault"
                    checked={authSecurity.useVault}
                    onCheckedChange={(checked) => updateAuthSecurityConfig({ useVault: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auth-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="auth-timeout"
                    type="number"
                    value={authSecurity.sessionTimeout}
                    onChange={(e) => updateAuthSecurityConfig({ sessionTimeout: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* More Features (Remaining 5) */}
          <TabsContent value="more" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📱 Mobile & UI Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mobile Drawers */}
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Touch Gestures & Drawers</Label>
                      <p className="text-xs text-muted-foreground">Mobile-first UI patterns</p>
                    </div>
                    <Switch
                      checked={mobileDrawers.enabled}
                      onCheckedChange={(checked) => updateMobileDrawersConfig({ enabled: checked })}
                    />
                  </div>
                  {mobileDrawers.enabled && (
                    <div className="pl-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Enable Swipe Gestures</span>
                        <Switch
                          checked={mobileDrawers.gesturesEnabled}
                          onCheckedChange={(checked) => updateMobileDrawersConfig({ gesturesEnabled: checked })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Virtualized Lists */}
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Virtualized Lists</Label>
                      <p className="text-xs text-muted-foreground">Handle 1000+ items smoothly</p>
                    </div>
                    <Switch
                      checked={virtualizedLists.enabled}
                      onCheckedChange={(checked) => updateVirtualizedListsConfig({ enabled: checked })}
                    />
                  </div>
                </div>

                {/* Streaming AI */}
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Streaming AI Responses</Label>
                      <p className="text-xs text-muted-foreground">Typewriter effect for agents</p>
                    </div>
                    <Switch
                      checked={streamingAI.enabled}
                      onCheckedChange={(checked) => updateStreamingAIConfig({ enabled: checked })}
                    />
                  </div>
                </div>

                {/* Agent Orchestration */}
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Agent Orchestration</Label>
                      <p className="text-xs text-muted-foreground">Multi-expert coordination</p>
                    </div>
                    <Switch
                      checked={agentOrchestration.enabled}
                      onCheckedChange={(checked) => updateAgentOrchestrationConfig({ enabled: checked })}
                    />
                  </div>
                  {agentOrchestration.enabled && (
                    <div className="pl-4 space-y-2">
                      <Label className="text-sm">Execution Mode</Label>
                      <Select
                        value={agentOrchestration.executionMode}
                        onValueChange={(value) => updateAgentOrchestrationConfig({ executionMode: value as "parallel" | "consensus" | "adversarial" | "sequential" })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parallel">Separated (Parallel)</SelectItem>
                          <SelectItem value="consensus">Synthesis (Consensus)</SelectItem>
                          <SelectItem value="adversarial">Debate (Adversarial)</SelectItem>
                          <SelectItem value="sequential">Pipeline (Sequential)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Local Database */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Local-First Database</Label>
                      <p className="text-xs text-muted-foreground">Offline-capable with Dexie</p>
                    </div>
                    <Switch
                      checked={localDatabase.enabled}
                      onCheckedChange={(checked) => updateLocalDatabaseConfig({ enabled: checked })}
                    />
                  </div>
                  {localDatabase.enabled && (
                    <div className="pl-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Auto-Sync</span>
                        <Switch
                          checked={localDatabase.autoSync}
                          onCheckedChange={(checked) => updateLocalDatabaseConfig({ autoSync: checked })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="glass-panel border-destructive/20 text-destructive hover:bg-destructive/10"
          >
            🔄 Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose} className="glass-panel">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
              💾 Save Configuration
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureConfigModal;
