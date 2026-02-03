# Dashboard Components - Quick Reference

## Component Import

```typescript
import {
  // Layout Components
  DashboardLayout,
  DashboardHeader,
  DashboardGrid,
  
  // Chart Components
  LineChartCard,
  BarChartCard,
  PieChartCard,
  
  // Metric Components
  StatCard,
  
  // Table Components
  DataTable,
  Column,
  
  // Type Exports
  LineChartData,
  BarChartData,
  PieChartData,
  StatCardProps,
  DataTableProps,
} from '@/components/dashboard';
```

## Quick Start Example

```typescript
import React, { useState } from 'react';
import {
  DashboardLayout,
  DashboardHeader,
  DashboardGrid,
  StatCard,
  LineChartCard,
  BarChartCard,
  PieChartCard,
  DataTable,
  Column,
} from '@/components/dashboard';
import { Activity, Users, TrendingUp, DollarSign } from 'lucide-react';

const MyDashboard: React.FC = () => {
  // Sample data
  const lineData = [
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 145 },
    { name: 'Wed', value: 132 },
    { name: 'Thu', value: 178 },
    { name: 'Fri', value: 165 },
  ];

  const barData = [
    { name: 'Product A', sales: 234 },
    { name: 'Product B', sales: 198 },
    { name: 'Product C', sales: 156 },
  ];

  const pieData = [
    { name: 'Category 1', value: 35 },
    { name: 'Category 2', value: 25 },
    { name: 'Category 3', value: 20 },
    { name: 'Category 4', value: 20 },
  ];

  const tableData = [
    { id: 1, name: 'Item 1', status: 'active', value: 100 },
    { id: 2, name: 'Item 2', status: 'pending', value: 200 },
    { id: 3, name: 'Item 3', status: 'active', value: 150 },
  ];

  const columns: Column<typeof tableData[0]>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'status', header: 'Status', sortable: true },
    { key: 'value', header: 'Value', sortable: true },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <DashboardHeader
        heading="My Dashboard"
        text="Overview of your key metrics"
      />

      {/* Stats Grid */}
      <DashboardGrid cols={4}>
        <StatCard
          title="Total Users"
          value="1,234"
          icon={Users}
          trend={{ value: 12.5, label: 'from last month' }}
        />
        <StatCard
          title="Active Sessions"
          value="543"
          icon={Activity}
          trend={{ value: 8.2, label: 'from last week' }}
        />
        <StatCard
          title="Growth Rate"
          value="23.5%"
          icon={TrendingUp}
          trend={{ value: -2.4, label: 'from last month' }}
        />
        <StatCard
          title="Revenue"
          value="$45.2K"
          icon={DollarSign}
        />
      </DashboardGrid>

      {/* Charts Grid */}
      <DashboardGrid cols={2}>
        <LineChartCard
          title="Weekly Trend"
          description="Activity over the past week"
          data={lineData}
          dataKeys={[
            { key: 'value', color: '#8b5cf6', label: 'Activity' }
          ]}
        />

        <BarChartCard
          title="Product Sales"
          description="Top selling products"
          data={barData}
          dataKeys={[
            { key: 'sales', color: '#10b981', label: 'Sales' }
          ]}
        />
      </DashboardGrid>

      {/* Pie Chart */}
      <PieChartCard
        title="Category Distribution"
        description="Breakdown by category"
        data={pieData}
        colors={['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b']}
        innerRadius={60}
      />

      {/* Data Table */}
      <DataTable
        title="Recent Items"
        description="Latest activity"
        data={tableData}
        columns={columns}
        searchable={true}
        searchKey="name"
        pageSize={10}
      />
    </DashboardLayout>
  );
};

export default MyDashboard;
```

## Component Cheat Sheet

### StatCard
```typescript
<StatCard
  title="Metric Name"
  value="1,234"
  description="Additional info"
  icon={IconComponent}
  trend={{ value: 12.5, label: 'from last week' }}
/>
```

### LineChartCard
```typescript
<LineChartCard
  title="Chart Title"
  data={[{ name: 'A', value: 100 }]}
  dataKeys={[{ key: 'value', color: '#8b5cf6' }]}
  height={300}
/>
```

### BarChartCard
```typescript
<BarChartCard
  title="Chart Title"
  data={[{ name: 'A', value: 100 }]}
  dataKeys={[{ key: 'value', color: '#10b981' }]}
  layout="horizontal"
/>
```

### PieChartCard
```typescript
<PieChartCard
  title="Distribution"
  data={[{ name: 'A', value: 35 }]}
  colors={['#8b5cf6', '#10b981']}
  innerRadius={60}  // 0 for pie, >0 for donut
/>
```

### DataTable
```typescript
<DataTable
  title="Table Title"
  data={myData}
  columns={columns}
  searchable={true}
  searchKey="name"
  pageSize={10}
/>
```

### DashboardGrid
```typescript
<DashboardGrid cols={4}>  {/* 1, 2, 3, or 4 */}
  {/* Components */}
</DashboardGrid>
```

## Color Palette

Use these colors for consistency:

```typescript
const colors = {
  primary: '#8b5cf6',   // Purple
  success: '#10b981',   // Green
  info: '#3b82f6',      // Blue
  warning: '#f59e0b',   // Amber
  error: '#ef4444',     // Red
};
```

## Responsive Breakpoints

- Mobile: `< 768px` → 1 column
- Tablet: `>= 768px` → 2 columns
- Desktop: `>= 1024px` → 3-4 columns

## Common Patterns

### Loading State
```typescript
{loading ? (
  <div>Loading...</div>
) : (
  <StatCard {...props} />
)}
```

### Error State
```typescript
{error ? (
  <div>Error: {error.message}</div>
) : (
  <DataTable {...props} />
)}
```

### Empty State
```typescript
{data.length === 0 ? (
  <div>No data available</div>
) : (
  <LineChartCard data={data} {...props} />
)}
```

## Tips

1. **Keep data arrays small** (< 100 items for smooth rendering)
2. **Use consistent color scheme** across all charts
3. **Always provide meaningful labels** for data series
4. **Test in both light and dark mode**
5. **Check responsive behavior** at all breakpoints
6. **Add loading states** for async data
7. **Handle empty/error states** gracefully

---

For full documentation, see [DASHBOARD_COMPONENTS_GUIDE.md](./DASHBOARD_COMPONENTS_GUIDE.md)
