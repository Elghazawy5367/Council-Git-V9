import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboardStore } from '../store/dashboard-store';

export const CostAnalytics: React.FC = () => {
  const { recentDecisions } = useDashboardStore();

  const costData = React.useMemo(() => {
    // Get last 7 decisions
    return recentDecisions
      .slice(0, 7)
      .reverse()
      .map((decision, index) => ({
        name: `Decision ${index + 1}`,
        cost: decision.cost,
        time: decision.duration,
      }));
  }, [recentDecisions]);

  if (costData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No cost data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={costData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="name"
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
          }}
          formatter={(value: number) => [`$${value.toFixed(4)}`, 'Cost']}
        />
        <Bar dataKey="cost" fill="#10b981" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
