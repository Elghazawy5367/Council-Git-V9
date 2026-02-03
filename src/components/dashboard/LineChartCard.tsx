import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export interface LineChartData {
  name: string;
  [key: string]: string | number;
}

export interface LineChartCardProps {
  title: string;
  description?: string;
  data: LineChartData[];
  dataKeys: { key: string; color: string; label?: string }[];
  xAxisKey?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
}

export const LineChartCard: React.FC<LineChartCardProps> = ({
  title,
  description,
  data,
  dataKeys,
  xAxisKey = 'name',
  height = 300,
  showLegend = true,
  showGrid = true,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
            <XAxis 
              dataKey={xAxisKey} 
              className="text-xs"
              stroke="currentColor"
            />
            <YAxis 
              className="text-xs"
              stroke="currentColor"
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
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                stroke={item.color}
                strokeWidth={2}
                name={item.label || item.key}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
