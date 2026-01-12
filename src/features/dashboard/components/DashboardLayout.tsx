import React, { useState } from 'react';
import { useDashboardStore } from '../store/dashboard-store';
import { MetricCard } from './MetricCard';
import { DecisionTimeline } from './DecisionTimeline';
import { ModeDistribution } from './ModeDistribution';
import { CostAnalytics } from './CostAnalytics';
import { HistoricalView } from './HistoricalView';
import { ExpertPerformance } from './ExpertPerformance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/tabs';
import { Button } from '@/components/primitives/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/select';
import {
  Brain,
  Clock,
  DollarSign,
  TrendingUp,
  Target,
  BarChart3,
  Calendar,
  Trash2,
} from 'lucide-react';

const DATE_RANGES = {
  '7d': { label: 'Last 7 days', days: 7 },
  '30d': { label: 'Last 30 days', days: 30 },
  '90d': { label: 'Last 90 days', days: 90 },
  'all': { label: 'All time', days: null },
};

export const DashboardLayout: React.FC = () => {
  const { metrics, setDateRange } = useDashboardStore();
  const [selectedRange, setSelectedRange] = useState<keyof typeof DATE_RANGES>('30d');

  const handleDateRangeChange = (value: string) => {
    setSelectedRange(value as keyof typeof DATE_RANGES);
    const range = DATE_RANGES[value as keyof typeof DATE_RANGES];
    
    if (range.days === null) {
      // All time
      setDateRange(new Date(0), new Date());
    } else {
      const end = new Date();
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearData}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Data
          </Button>
        </div>
      const start = new Date(Date.now() - range.days * 24 * 60 * 60 * 1000);
      setDateRange(start, end);
    }
  };

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
      {hasData ? (
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
      ) : (
        <Card className="glass-panel border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Brain className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Analytics Data Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Execute your first Council analysis to start tracking metrics, costs, and performance insights.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Go to Council
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      {hasData && (
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
          <ExpertPerformance />
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
      )}
    </div>
  );
};
