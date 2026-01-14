import React, { useState, useEffect } from 'react';  
import {   
  TrendingUp,   
  Activity,   
  Target,   
  Zap,  
  GitBranch,  
  DollarSign,  
  Users,  
  Clock,  
  ArrowUpRight,  
  ArrowDownRight,  
  RefreshCw,
  ArrowLeft
} from 'lucide-react';  
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/primitives/button';

interface DashboardStats {  
  totalOpportunities: number;  
  activeProjects: number;  
  revenueProjection: number;  
  completionRate: number;  
  trends: {  
    opportunities: number;  
    projects: number;  
    revenue: number;  
  };  
}

interface ChartData {  
  name: string;  
  value: number;  
  growth?: number;  
}

const Dashboard: React.FC = () => {  
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({  
    totalOpportunities: 0,  
    activeProjects: 0,  
    revenueProjection: 0,  
    completionRate: 0,  
    trends: { opportunities: 0, projects: 0, revenue: 0 }  
  });  
    
  const [loading, setLoading] = useState(true);  
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {  
    fetchDashboardData();  
  }, []);

  const fetchDashboardData = async () => {  
    setLoading(true);  
    try {  
      await new Promise(resolve => setTimeout(resolve, 1000));  
        
      setStats({  
        totalOpportunities: 847,  
        activeProjects: 23,  
        revenueProjection: 45600,  
        completionRate: 78,  
        trends: {  
          opportunities: 12.5,  
          projects: 8.3,  
          revenue: 15.7  
        }  
      });  
        
      setLastUpdate(new Date());  
    } catch (error) {  
      console.error('Failed to fetch dashboard data:', error);  
    } finally {  
      setLoading(false);  
    }  
  };

  const weeklyData: ChartData[] = [  
    { name: 'Mon', value: 120, growth: 5 },  
    { name: 'Tue', value: 150, growth: 8 },  
    { name: 'Wed', value: 180, growth: 12 },  
    { name: 'Thu', value: 160, growth: -3 },  
    { name: 'Fri', value: 200, growth: 15 },  
    { name: 'Sat', value: 170, growth: 6 },  
    { name: 'Sun', value: 140, growth: -8 },  
  ];

  const categoryData: ChartData[] = [  
    { name: 'Developer Tools', value: 320 },  
    { name: 'SaaS Products', value: 280 },  
    { name: 'Mobile Apps', value: 180 },  
    { name: 'Web Services', value: 67 },  
  ];

  const revenueData: ChartData[] = [  
    { name: 'Jan', value: 12000 },  
    { name: 'Feb', value: 19000 },  
    { name: 'Mar', value: 25000 },  
    { name: 'Apr', value: 31000 },  
    { name: 'May', value: 38000 },  
    { name: 'Jun', value: 45600 },  
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  const StatCard: React.FC<{  
    title: string;  
    value: string | number;  
    trend?: number;  
    icon: React.ReactNode;  
    color: string;  
  }> = ({ title, value, trend, icon, color }) => (  
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-shadow">  
      <div className="flex items-start justify-between">  
        <div className="flex-1">  
          <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">{title}</p>  
          <h3 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">{value}</h3>  
          {trend !== undefined && (  
            <div className={`flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>  
              {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}  
              <span className="font-medium">{Math.abs(trend)}%</span>  
              <span className="text-gray-500 dark:text-slate-500 ml-1">vs last month</span>  
            </div>  
          )}  
        </div>  
        <div className={`p-3 rounded-lg ${color}`}>  
          {icon}  
        </div>  
      </div>  
    </div>  
  );

  if (loading) {  
    return (  
      <div className="flex items-center justify-center h-screen">  
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />  
      </div>  
    );  
  }

  return (  
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-background min-h-screen">  
      {/* Header */}  
      <div className="flex items-center justify-between">  
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-blue-500/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>  
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Analytics Dashboard</h1>  
            <p className="text-gray-600 dark:text-slate-400 mt-1">  
              Performance tracking and project insights.  
            </p>  
          </div>  
        </div>
        <div className="flex items-center gap-4">  
          <div className="text-sm text-gray-600 dark:text-slate-400 hidden sm:block">  
            Last updated: {lastUpdate.toLocaleTimeString()}  
          </div>  
          <button  
            onClick={fetchDashboardData}  
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"  
          >  
            <RefreshCw className="w-4 h-4" />  
            Refresh  
          </button>  
        </div>  
      </div>

      {/* Stats Grid */}  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">  
        <StatCard  
          title="Total Opportunities"  
          value={stats.totalOpportunities.toLocaleString()}  
          trend={stats.trends.opportunities}  
          icon={<Target className="w-6 h-6 text-blue-600" />}  
          color="bg-blue-100 dark:bg-blue-900/30"  
        />  
        <StatCard  
          title="Active Projects"  
          value={stats.activeProjects}  
          trend={stats.trends.projects}  
          icon={<Activity className="w-6 h-6 text-purple-600" />}  
          color="bg-purple-100 dark:bg-purple-900/30"  
        />  
        <StatCard  
          title="Revenue Projection"  
          value={`$${(stats.revenueProjection / 1000).toFixed(1)}K`}  
          trend={stats.trends.revenue}  
          icon={<DollarSign className="w-6 h-6 text-green-600" />}  
          color="bg-green-100 dark:bg-green-900/30"  
        />  
        <StatCard  
          title="Completion Rate"  
          value={`${stats.completionRate}%`}  
          icon={<Zap className="w-6 h-6 text-orange-600" />}  
          color="bg-orange-100 dark:bg-orange-900/30"  
        />  
      </div>

      {/* Charts Row */}  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">  
        {/* Weekly Activity */}  
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-slate-800">  
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">Weekly Activity</h3>  
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">  
              <LineChart data={weeklyData}>  
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />  
                <XAxis dataKey="name" stroke="#6b7280" />  
                <YAxis stroke="#6b7280" />  
                <Tooltip   
                  contentStyle={{   
                    backgroundColor: '#fff',   
                    border: '1px solid #e5e7eb',  
                    borderRadius: '8px'  
                  }}  
                />  
                <Line   
                  type="monotone"   
                  dataKey="value"   
                  stroke="#3b82f6"   
                  strokeWidth={2}  
                  dot={{ fill: '#3b82f6', r: 4 }}  
                  activeDot={{ r: 6 }}  
                />  
              </LineChart>  
            </ResponsiveContainer>  
          </div>
        </div>

        {/* Category Distribution */}  
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-slate-800">  
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">Opportunities by Category</h3>  
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">  
              <PieChart>  
                <Pie  
                  data={categoryData}  
                  cx="50%"  
                  cy="50%"  
                  labelLine={false}  
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}  
                  outerRadius={100}  
                  fill="#8884d8"  
                  dataKey="value"  
                >  
                  {categoryData.map((entry, index) => (  
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />  
                  ))}  
                </Pie>  
                <Tooltip />  
              </PieChart>  
            </ResponsiveContainer>  
          </div>
        </div>  
      </div>

      {/* Revenue Chart */}  
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-slate-800">  
        <div className="flex items-center justify-between mb-4">  
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">Revenue Growth</h3>  
          <div className="flex items-center gap-2 text-green-600">  
            <TrendingUp className="w-4 h-4" />  
            <span className="text-sm font-medium">+24% this quarter</span>  
          </div>  
        </div>  
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">  
            <BarChart data={revenueData}>  
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />  
              <XAxis dataKey="name" stroke="#6b7280" />  
              <YAxis stroke="#6b7280" />  
              <Tooltip   
                contentStyle={{   
                  backgroundColor: '#fff',   
                  border: '1px solid #e5e7eb',  
                  borderRadius: '8px'  
                }}  
                formatter={(value: number) => `$${value.toLocaleString()}`}  
              />  
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />  
            </BarChart>  
          </ResponsiveContainer>  
        </div>
      </div>

      {/* Recent Activity */}  
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-slate-800">  
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">Recent Activity</h3>  
        <div className="space-y-4">  
          {[  
            { icon: GitBranch, text: 'New repository detected: awesome-react-components', time: '2 hours ago', color: 'text-blue-600' },  
            { icon: Users, text: 'Scout discovered 15 new opportunities', time: '4 hours ago', color: 'text-purple-600' },  
            { icon: Zap, text: 'Goldmine Detector found high-value niche', time: '6 hours ago', color: 'text-yellow-600' },  
            { icon: Clock, text: 'Mining Drill completed deep analysis', time: '8 hours ago', color: 'text-green-600' },  
          ].map((activity, idx) => (  
            <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors">  
              <activity.icon className={`w-5 h-5 ${activity.color} mt-0.5`} />  
              <div className="flex-1">  
                <p className="text-sm text-gray-900 dark:text-slate-200">{activity.text}</p>  
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{activity.time}</p>  
              </div>  
            </div>  
          ))}  
        </div>  
      </div>  
    </div>  
  );  
};

export default Dashboard;