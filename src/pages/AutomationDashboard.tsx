import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { ArrowLeft, Settings, Activity, Clock, CheckCircle2, XCircle, Calendar } from 'lucide-react';
import {
  DashboardLayout,
  DashboardHeader,
  DashboardGrid,
  StatCard,
  LineChartCard,
  BarChartCard,
  DataTable,
  Column,
} from '@/components/dashboard';
import { useFeatureConfigStore } from '@/features/council/store/feature-config-store';

interface FeatureActivity {
  name: string;
  runs: number;
  status: 'active' | 'idle' | 'error';
  lastRun?: string;
}

/**
 * AutomationDashboard - Professional dashboard for automation features
 * Replaces the previous 573-line implementation with reusable components
 */
const AutomationDashboard: React.FC = () => {
  const navigate = useNavigate();
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
    stargazerAnalysis,
  } = useFeatureConfigStore();

  // Sample data for demonstration - in production, this would come from your actual data sources
  const [activityData] = useState([
    { name: 'Mon', runs: 12, successes: 10, failures: 2 },
    { name: 'Tue', runs: 15, successes: 14, failures: 1 },
    { name: 'Wed', runs: 8, successes: 8, failures: 0 },
    { name: 'Thu', runs: 18, successes: 15, failures: 3 },
    { name: 'Fri', runs: 14, successes: 13, failures: 1 },
    { name: 'Sat', runs: 10, successes: 10, failures: 0 },
    { name: 'Sun', runs: 6, successes: 6, failures: 0 },
  ]);

  const [featureUsageData] = useState([
    { name: 'Scout', value: 145 },
    { name: 'Mirror', value: 98 },
    { name: 'Reddit Sniper', value: 76 },
    { name: 'Trending', value: 134 },
    { name: 'Quality', value: 87 },
  ]);

  const features = [
    { id: 'github-trending', name: 'GitHub Trending', enabled: githubTrending.enabled },
    { id: 'market-gap', name: 'Market Gap', enabled: marketGap.enabled },
    { id: 'reddit-sniper', name: 'Reddit Sniper', enabled: redditSniper.enabled },
    { id: 'scout', name: 'Scout', enabled: scout.enabled },
    { id: 'mirror', name: 'Mirror', enabled: mirror.enabled },
    { id: 'quality', name: 'Quality Pipeline', enabled: quality.enabled },
    { id: 'self-improve', name: 'Self Improve', enabled: selfImprove.enabled },
    { id: 'reddit-pain', name: 'Reddit Pain Points', enabled: redditPainPoints.enabled },
    { id: 'viral-radar', name: 'Viral Radar', enabled: viralRadar.enabled },
    { id: 'hackernews', name: 'Hacker News', enabled: hackerNews.enabled },
    { id: 'twin-mimicry', name: 'Twin Mimicry', enabled: twinMimicry.enabled },
    { id: 'fork-evolution', name: 'Fork Evolution', enabled: forkEvolution.enabled },
    { id: 'heist', name: 'Prompt Heist', enabled: promptHeist.enabled },
    { id: 'stargazer', name: 'Stargazer Analysis', enabled: stargazerAnalysis.enabled },
  ];

  const activeFeatures = features.filter((f) => f.enabled).length;
  const totalRuns = activityData.reduce((acc, day) => acc + day.runs, 0);
  const successRate = (
    (activityData.reduce((acc, day) => acc + day.successes, 0) / totalRuns) *
    100
  ).toFixed(1);

  const [recentActivity] = useState<FeatureActivity[]>([
    { name: 'GitHub Trending', runs: 134, status: 'active', lastRun: '2 hours ago' },
    { name: 'Scout Analysis', runs: 145, status: 'active', lastRun: '3 hours ago' },
    { name: 'Mirror Quality Check', runs: 98, status: 'active', lastRun: '5 hours ago' },
    { name: 'Reddit Sniper', runs: 76, status: 'idle', lastRun: '1 day ago' },
    { name: 'Market Gap Detector', runs: 54, status: 'active', lastRun: '6 hours ago' },
  ]);

  const columns: Column<FeatureActivity>[] = [
    {
      key: 'name',
      header: 'Feature',
      sortable: true,
    },
    {
      key: 'runs',
      header: 'Total Runs',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => {
        const status = value as string;
        const statusConfig = {
          active: { label: 'Active', className: 'bg-green-500/10 text-green-600 dark:text-green-400' },
          idle: { label: 'Idle', className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
          error: { label: 'Error', className: 'bg-red-500/10 text-red-600 dark:text-red-400' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Badge className={config.className}>{config.label}</Badge>;
      },
    },
    {
      key: 'lastRun',
      header: 'Last Run',
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Automation Control Center</h1>
                <p className="text-xs text-muted-foreground">
                  Manage {features.length} automation features • {activeFeatures} active
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Configure
            </Button>
          </div>
        </div>
      </header>

      <DashboardLayout>
        {/* Stats Overview */}
        <DashboardGrid cols={4}>
          <StatCard
            title="Active Features"
            value={activeFeatures}
            description={`of ${features.length} total`}
            icon={Activity}
            trend={{ value: 12.5, label: 'from last week' }}
          />
          <StatCard
            title="Total Runs"
            value={totalRuns}
            description="this week"
            icon={Clock}
            trend={{ value: 8.2, label: 'from last week' }}
          />
          <StatCard
            title="Success Rate"
            value={`${successRate}%`}
            description="of all runs"
            icon={CheckCircle2}
            trend={{ value: 2.4, label: 'from last week' }}
          />
          <StatCard
            title="Last Updated"
            value="2h ago"
            description="GitHub Trending"
            icon={Calendar}
          />
        </DashboardGrid>

        {/* Charts */}
        <DashboardGrid cols={2}>
          <LineChartCard
            title="Weekly Activity"
            description="Automation runs over the past week"
            data={activityData}
            dataKeys={[
              { key: 'runs', color: '#8b5cf6', label: 'Total Runs' },
              { key: 'successes', color: '#10b981', label: 'Successful' },
              { key: 'failures', color: '#ef4444', label: 'Failed' },
            ]}
            height={300}
          />

          <BarChartCard
            title="Feature Usage"
            description="Most active automation features"
            data={featureUsageData}
            dataKeys={[{ key: 'value', color: '#8b5cf6', label: 'Runs' }]}
            height={300}
          />
        </DashboardGrid>

        {/* Recent Activity Table */}
        <DataTable
          title="Recent Activity"
          description="Latest automation runs and their status"
          data={recentActivity}
          columns={columns}
          searchable={true}
          searchKey="name"
          searchPlaceholder="Search features..."
          pageSize={10}
        />
      </DashboardLayout>
    </div>
  );
};

export default AutomationDashboard;
