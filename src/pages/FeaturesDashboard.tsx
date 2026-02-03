import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { ArrowLeft, TrendingUp, Users, Target, Code, Settings } from 'lucide-react';
import {
  DashboardLayout,
  DashboardHeader,
  DashboardGrid,
  StatCard,
  LineChartCard,
  PieChartCard,
  DataTable,
  Column,
} from '@/components/dashboard';
import { useFeatureConfigStore } from '@/features/council/store/feature-config-store';

interface FeatureMetric {
  feature: string;
  usage: number;
  performance: number;
  status: 'excellent' | 'good' | 'needs-attention';
}

/**
 * FeaturesDashboard - Professional dashboard for feature analytics
 * Replaces the previous 572-line implementation with reusable components
 */
const FeaturesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const featureConfig = useFeatureConfigStore();

  // Sample metrics data
  const [performanceData] = useState([
    { name: 'Week 1', performance: 85, usage: 120 },
    { name: 'Week 2', performance: 88, usage: 145 },
    { name: 'Week 3', performance: 82, usage: 132 },
    { name: 'Week 4', performance: 92, usage: 178 },
    { name: 'Week 5', performance: 90, usage: 165 },
    { name: 'Week 6', performance: 94, usage: 190 },
  ]);

  const [categoryDistribution] = useState([
    { name: 'GitHub Intelligence', value: 35 },
    { name: 'Reddit Analysis', value: 25 },
    { name: 'Code Quality', value: 20 },
    { name: 'Market Research', value: 15 },
    { name: 'Other', value: 5 },
  ]);

  const [featureMetrics] = useState<FeatureMetric[]>([
    { feature: 'GitHub Trending', usage: 234, performance: 95, status: 'excellent' },
    { feature: 'Scout Analysis', usage: 198, performance: 92, status: 'excellent' },
    { feature: 'Reddit Sniper', usage: 156, performance: 88, status: 'good' },
    { feature: 'Mirror Quality', usage: 143, performance: 94, status: 'excellent' },
    { feature: 'Market Gap', usage: 121, performance: 85, status: 'good' },
    { feature: 'Viral Radar', usage: 98, performance: 79, status: 'needs-attention' },
    { feature: 'Twin Mimicry', usage: 87, performance: 91, status: 'excellent' },
    { feature: 'Fork Evolution', usage: 76, performance: 86, status: 'good' },
  ]);

  const totalUsage = featureMetrics.reduce((acc, f) => acc + f.usage, 0);
  const avgPerformance = (
    featureMetrics.reduce((acc, f) => acc + f.performance, 0) / featureMetrics.length
  ).toFixed(1);
  const excellentCount = featureMetrics.filter((f) => f.status === 'excellent').length;

  const columns: Column<FeatureMetric>[] = [
    {
      key: 'feature',
      header: 'Feature',
      sortable: true,
    },
    {
      key: 'usage',
      header: 'Usage Count',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'performance',
      header: 'Performance Score',
      sortable: true,
      render: (value) => {
        const score = value as number;
        const color = score >= 90 ? 'text-green-600' : score >= 80 ? 'text-yellow-600' : 'text-red-600';
        return <span className={color}>{score}%</span>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => {
        const status = value as string;
        const statusConfig = {
          excellent: { label: 'Excellent', className: 'bg-green-500/10 text-green-600 dark:text-green-400' },
          good: { label: 'Good', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
          'needs-attention': {
            label: 'Needs Attention',
            className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
          },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Badge className={config.className}>{config.label}</Badge>;
      },
    },
  ];

  const chartColors = ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

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
                <h1 className="text-xl font-bold">Features Analytics</h1>
                <p className="text-xs text-muted-foreground">
                  Performance insights and usage metrics
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
        <DashboardHeader
          heading="Features Overview"
          text="Track performance and usage across all automation features"
        />

        {/* Key Metrics */}
        <DashboardGrid cols={4}>
          <StatCard
            title="Total Usage"
            value={totalUsage.toLocaleString()}
            description="across all features"
            icon={Users}
            trend={{ value: 15.3, label: 'from last month' }}
          />
          <StatCard
            title="Avg Performance"
            value={`${avgPerformance}%`}
            description="system-wide score"
            icon={TrendingUp}
            trend={{ value: 3.2, label: 'from last month' }}
          />
          <StatCard
            title="Top Performers"
            value={excellentCount}
            description={`of ${featureMetrics.length} features`}
            icon={Target}
            trend={{ value: 12.5, label: 'from last month' }}
          />
          <StatCard
            title="Code Quality"
            value="A+"
            description="overall grade"
            icon={Code}
          />
        </DashboardGrid>

        {/* Performance Charts */}
        <DashboardGrid cols={2}>
          <LineChartCard
            title="Performance Trends"
            description="Feature performance and usage over time"
            data={performanceData}
            dataKeys={[
              { key: 'performance', color: '#8b5cf6', label: 'Performance Score' },
              { key: 'usage', color: '#10b981', label: 'Usage Count' },
            ]}
            height={300}
          />

          <PieChartCard
            title="Feature Categories"
            description="Distribution by feature type"
            data={categoryDistribution}
            colors={chartColors}
            height={300}
            innerRadius={60}
            outerRadius={100}
          />
        </DashboardGrid>

        {/* Feature Metrics Table */}
        <DataTable
          title="Feature Performance Metrics"
          description="Detailed breakdown of all feature analytics"
          data={featureMetrics}
          columns={columns}
          searchable={true}
          searchKey="feature"
          searchPlaceholder="Search features..."
          pageSize={10}
        />
      </DashboardLayout>
    </div>
  );
};

export default FeaturesDashboard;
