import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useDashboardStore } from '../store/dashboard-store';

export const DecisionTimeline: React.FC = () => {
  const { recentDecisions } = useDashboardStore();

  // Group decisions by date
  const timelineData = React.useMemo(() => {
    const grouped = recentDecisions.reduce((acc, decision) => {
      const date = new Date(decision.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, count: 0, totalCost: 0 };
      }
      acc[date].count++;
      acc[date].totalCost += decision.cost;
      return acc;
    }, {} as Record<string, { date: string; count: number; totalCost: number }>);

    return Object.values(grouped)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14); // Last 14 days
  }, [recentDecisions]);

  if (timelineData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No decision history yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={timelineData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="date"
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
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Decisions"
          dot={{ fill: '#3b82f6', r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="totalCost"
          stroke="#10b981"
          strokeWidth={2}
          name="Total Cost ($)"
          dot={{ fill: '#10b981', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
