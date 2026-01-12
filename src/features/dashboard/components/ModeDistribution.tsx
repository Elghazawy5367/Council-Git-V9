import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { ExecutionMode } from '@/features/council/lib/types';

interface ModeDistributionProps {
  data: Record<ExecutionMode, number>;
  detailed?: boolean;
}

const MODE_COLORS: Record<ExecutionMode, string> = {
  parallel: '#3b82f6', // blue
  consensus: '#8b5cf6', // purple
  adversarial: '#ef4444', // red
  sequential: '#10b981', // green
};

const MODE_LABELS: Record<ExecutionMode, string> = {
  parallel: 'Parallel',
  consensus: 'Consensus',
  adversarial: 'Adversarial',
  sequential: 'Sequential',
};

export const ModeDistribution: React.FC<ModeDistributionProps> = ({
  data,
  detailed = false,
}) => {
  const chartData = Object.entries(data).map(([mode, value]) => ({
    name: MODE_LABELS[mode as ExecutionMode],
    value,
    mode: mode as ExecutionMode,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No execution data yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={detailed ? 400 : 280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={detailed ? 120 : 90}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.mode}`}
                fill={MODE_COLORS[entry.mode]}
              />
            ))}
          </Pie>
          <Tooltip />
          {detailed && <Legend />}
        </PieChart>
      </ResponsiveContainer>

      {detailed && (
        <div className="grid grid-cols-2 gap-4">
          {chartData.map((item) => (
            <div
              key={item.mode}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: MODE_COLORS[item.mode] }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <span className="text-lg font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
