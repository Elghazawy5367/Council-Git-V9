import React from 'react';
import { useDashboardStore } from '../store/dashboard-store';
import { MetricCard } from './MetricCard';
import { DecisionTimeline } from './DecisionTimeline';
import { ModeDistribution } from './ModeDistribution';
import { CostAnalytics } from './CostAnalytics';
import { HistoricalView } from './HistoricalView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/tabs';
import {
  Brain,
  Clock,
  DollarSign,
  TrendingUp,
  Target,
  BarChart3,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { metrics } = useDashboardStore();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Council Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Insights from your AI council decisions
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Decisions"
          value={metrics.totalDecisions}
          subtitle="All time"
          icon={Brain}
          colorClass="from-violet-500 to-purple-600"
        />
        <MetricCard
          title="Avg. Decision Time"
          value={`${Math.round(metrics.averageTime)}s`}
          subtitle="Per decision"
          icon={Clock}
          colorClass="from-blue-500 to-cyan-500"
        />
        <MetricCard
          title="Avg. Cost"
          value={`$${metrics.averageCost.toFixed(4)}`}
          subtitle="Per decision"
          icon={DollarSign}
          colorClass="from-green-500 to-emerald-600"
        />
        <MetricCard
          title="Success Rate"
          value={`${Math.round(metrics.successRate)}%`}
          subtitle="Completed successfully"
          icon={TrendingUp}
          colorClass="from-orange-500 to-red-500"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Clock className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="modes">
            <Target className="h-4 w-4 mr-2" />
            Modes
          </TabsTrigger>
          <TabsTrigger value="history">
            <Brain className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Mode Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ModeDistribution data={metrics.modeDistribution} />
              </CardContent>
            </Card>
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Cost Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CostAnalytics />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Decision Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <DecisionTimeline />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modes">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Execution Mode Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ModeDistribution data={metrics.modeDistribution} detailed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <HistoricalView />
        </TabsContent>
      </Tabs>
    </div>
  );
};
