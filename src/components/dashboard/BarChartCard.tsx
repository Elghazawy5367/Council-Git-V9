import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export interface BarChartData {
  name: string;
  [key: string]: string | number;
}

export interface BarChartCardProps {
  title: string;
  description?: string;
  data: BarChartData[];
  dataKeys: { key: string; color: string; label?: string }[];
  xAxisKey?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export const BarChartCard: React.FC<BarChartCardProps> = ({
  title,
  description,
  data,
  dataKeys,
  xAxisKey = 'name',
  height = 300,
  showLegend = true,
  showGrid = true,
  layout = 'horizontal',
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} layout={layout}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
            <XAxis 
              dataKey={xAxisKey} 
              className="text-xs"
              stroke="currentColor"
              type={layout === 'vertical' ? 'number' : 'category'}
            />
            <YAxis 
              className="text-xs"
              stroke="currentColor"
              type={layout === 'vertical' ? 'category' : 'number'}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            {showLegend && <Legend />}
            {dataKeys.map((item) => (
              <Bar
                key={item.key}
                dataKey={item.key}
                fill={item.color}
                name={item.label || item.key}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
