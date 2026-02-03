import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/card';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  icon?: LucideIcon;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  trend,
  icon: Icon,
  className,
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value > 0) {
      return <ArrowUpRight className="h-4 w-4" />;
    } else if (trend.value < 0) {
      return <ArrowDownRight className="h-4 w-4" />;
    }
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    if (trend.value > 0) {
      return 'text-green-600 dark:text-green-400';
    } else if (trend.value < 0) {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-muted-foreground';
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            {trend && (
              <span className={cn('flex items-center gap-1 font-medium', getTrendColor())}>
                {getTrendIcon()}
                {Math.abs(trend.value)}%
              </span>
            )}
            {(description || trend?.label) && (
              <span>{trend?.label || description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
