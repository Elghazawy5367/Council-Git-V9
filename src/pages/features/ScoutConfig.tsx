import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';
import { Switch } from '@/components/primitives/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/select';
import { useFeatureConfigStore } from '@/features/council/store/feature-config-store';
import { toast } from 'sonner';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ScoutConfig: React.FC = () => {
  const navigate = useNavigate();
  const { scout, updateScoutConfig } = useFeatureConfigStore();
  const [localConfig, setLocalConfig] = useState(scout);

  const handleSave = (): void => {
    updateScoutConfig(localConfig);
    toast.success('Scout configuration saved');
  };

  const handleReset = (): void => {
    setLocalConfig(scout);
    toast.info('Reset to saved configuration');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-panel border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/features')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">👻 Phantom Scout Configuration</h1>
                <p className="text-xs text-muted-foreground">Configure GitHub intelligence gathering</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic configuration for Scout automation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label htmlFor="scout-enabled" className="text-base font-medium">Enable Scout</Label>
                  <p className="text-sm text-muted-foreground">Activate automated intelligence gathering</p>
                </div>
                <Switch
                  id="scout-enabled"
                  checked={localConfig.enabled}
                  onCheckedChange={(checked) => setLocalConfig({ ...localConfig, enabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scout-schedule">Cron Schedule</Label>
                <Input
                  id="scout-schedule"
                  value={localConfig.schedule}
                  onChange={(e) => setLocalConfig({ ...localConfig, schedule: e.target.value })}
                  placeholder="0 6 * * *"
                />
                <p className="text-xs text-muted-foreground">Format: minute hour day month weekday (e.g., "0 6 * * *" = Daily at 6 AM UTC)</p>
              </div>
            </CardContent>
          </Card>

          {/* Target Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Target Configuration</CardTitle>
              <CardDescription>Define what repositories to scout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scout-niche">Target Niche</Label>
                <Input
                  id="scout-niche"
                  value={localConfig.targetNiche}
                  onChange={(e) => setLocalConfig({ ...localConfig, targetNiche: e.target.value })}
                  placeholder="e.g., developer-tools, react-native, ai-tools"
                />
                <p className="text-xs text-muted-foreground">Enter keywords for GitHub search. Scout will find repositories matching this niche.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scout-min-stars">Minimum Stars</Label>
                  <Input
                    id="scout-min-stars"
                    type="number"
                    value={localConfig.minStars}
                    onChange={(e) => setLocalConfig({ ...localConfig, minStars: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Only scan repos with at least this many stars</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scout-max-repos">Maximum Repositories</Label>
                  <Input
                    id="scout-max-repos"
                    type="number"
                    value={localConfig.maxRepos}
                    onChange={(e) => setLocalConfig({ ...localConfig, maxRepos: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Limit the number of repos to analyze per run</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scout-depth">Scan Depth</Label>
                <Select 
                  value={localConfig.depth} 
                  onValueChange={(value: 'shallow' | 'normal' | 'deep') => setLocalConfig({ ...localConfig, depth: value })}
                >
                  <SelectTrigger id="scout-depth">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shallow">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Shallow</span>
                        <span className="text-xs text-muted-foreground">Fast scan, basic metrics only</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="normal">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Normal</span>
                        <span className="text-xs text-muted-foreground">Balanced depth and speed</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="deep">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Deep</span>
                        <span className="text-xs text-muted-foreground">Thorough analysis with all insights</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Output Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Output & Reporting</CardTitle>
              <CardDescription>Configure how Scout saves and reports findings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Data Storage Location</Label>
                <div className="p-3 bg-muted/30 rounded-md font-mono text-sm">
                  data/opportunities/
                </div>
                <p className="text-xs text-muted-foreground">Scout saves opportunity data as JSON files in this directory</p>
              </div>

              <div className="space-y-2">
                <Label>Reports Location</Label>
                <div className="p-3 bg-muted/30 rounded-md font-mono text-sm">
                  data/reports/
                </div>
                <p className="text-xs text-muted-foreground">Markdown reports with actionable insights</p>
              </div>
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>GitHub API authentication and rate limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">⚠️ GitHub Token Required</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Scout requires a GitHub personal access token to function. Configure your token in the main Settings panel (⚙️ button in header).
                </p>
              </div>

              <div className="space-y-2">
                <Label>Rate Limit Protection</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 bg-muted/30 rounded-md">
                    <span className="text-sm">Automatic retry with exponential backoff</span>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md text-sm font-medium">
                    Enabled
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Scout automatically handles API rate limits</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ScoutConfig;
