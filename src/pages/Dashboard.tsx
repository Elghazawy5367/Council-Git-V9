import React, { useState, useEffect, lazy, Suspense } from 'react';  
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
  ArrowLeft,
  Settings,
  Calendar,
  Play,
  ExternalLink,
  Github
} from 'lucide-react';  
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/tabs';
import { useFeatureConfigStore } from '@/features/council/store/feature-config-store';
import { parseCronSchedule } from '@/lib/workflow-dispatcher';
import { MiningDrillPanel } from '@/features/council/components/MiningDrillPanel';
import { GoldmineDetector } from '@/features/council/components/GoldmineDetector';
import { loadAllOpportunities } from '@/lib/opportunity-loader';
import { Opportunity } from '@/lib/goldmine-detector';
import { getSessionKeys } from '@/features/council/lib/vault';

const FeatureConfigModal = lazy(() => import('@/features/council/components/FeatureConfigModal'));

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

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string;
  workflow: string;
  schedule: string;
  lastRun?: string;
  status: 'idle' | 'scheduled' | 'active';
}

const Dashboard: React.FC = () => {  
  const navigate = useNavigate();
  const repoOwner = 'Elghazawy5367';
  const repoName = 'Council-Git-V7-RRR';

  const [stats, setStats] = useState<DashboardStats>({  
    totalOpportunities: 0,  
    activeProjects: 0,  
    revenueProjection: 0,  
    completionRate: 0,  
    trends: { opportunities: 0, projects: 0, revenue: 0 }  
  });  
    
  const [loading, setLoading] = useState(true);  
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);

  const { scout, mirror, quality, selfImprove } = useFeatureConfigStore();

  useEffect(() => {  
    fetchDashboardData();
    const loadData = async (): Promise<void> => {
      setLoadingOpportunities(true);
      try {
        const keys = getSessionKeys();
        const opps = await loadAllOpportunities(keys?.githubApiKey);
        setOpportunities(opps);
      } catch (error) {
        console.error('Failed to load opportunities:', error);
      } finally {
        setLoadingOpportunities(false);
      }
    };
    
    void loadData();
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

  const [features] = useState<Feature[]>([
    {
      id: 'mirror',
      name: 'Code Mirror System',
      description: 'Analyze codebase against elite repository standards',
      icon: '🔄',
      workflow: 'code-mirror.yml',
      schedule: mirror.schedule,
      status: mirror.enabled ? 'active' : 'idle',
    },
    {
      id: 'quality',
      name: 'QUALITY Amplification Pipeline',
      description: 'Run full quality analysis and improvement pipeline',
      icon: '⚡',
      workflow: 'quality-pipeline.yml',
      schedule: quality.schedule,
      status: quality.enabled ? 'active' : 'idle',
    },
    {
      id: 'learn',
      name: 'Self-Improving Loop',
      description: 'Learn patterns from successful repositories',
      icon: '🧠',
      workflow: 'self-improve.yml',
      schedule: selfImprove.schedule,
      status: selfImprove.enabled ? 'active' : 'idle',
    },
    {
      id: 'scout',
      name: 'Phantom Scout',
      description: '24/7 automated GitHub intelligence gathering',
      icon: '👻',
      workflow: 'daily-scout.yml',
      schedule: scout.schedule,
      status: scout.enabled ? 'active' : 'idle',
    },
    {
      id: 'sonar',
      name: 'Sonar (Blue Ocean Scanner)',
      description: 'Detect abandoned high-value repositories',
      icon: '📡',
      workflow: 'daily-scout.yml',
      schedule: scout.schedule,
      status: scout.enabled ? 'active' : 'idle',
    },
  ]);

  const getWorkflowUrl = (workflow: string): string => {
    return `https://github.com/${repoOwner}/${repoName}/actions/workflows/${workflow}`;
  };

  const getTriggerUrl = (workflow: string): string => {
    return `https://github.com/${repoOwner}/${repoName}/actions/workflows/${workflow}`;
  };

  const getStatusBadge = (status: Feature['status']): JSX.Element => {
    const variants: Record<Feature['status'], { className: string; label: string; icon: JSX.Element }> = {
      idle: { 
        className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400', 
        label: 'Disabled',
        icon: <Clock className="h-3 w-3" />
      },
      scheduled: { 
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', 
        label: 'Scheduled',
        icon: <Clock className="h-3 w-3" />
      },
      active: { 
        className: 'bg-green-500/10 text-green-600 dark:text-green-400', 
        label: 'Active',
        icon: <Activity className="h-3 w-3" />
      },
    };

    const { className, label, icon } = variants[status];
    return (
      <Badge className={`${className} flex items-center gap-1`}>
        {icon}
        {label}
      </Badge>
    );
  };

  const getFeatureConfig = (featureId: string): string => {
    switch (featureId) {
      case 'scout':
      case 'sonar':
        return `Niche: ${scout.targetNiche} | Min Stars: ${scout.minStars} | Depth: ${scout.depth}`;
      case 'mirror':
        return `Report: ${mirror.generateReport ? 'Yes' : 'No'} | Standards: ${mirror.standards.length}`;
      case 'quality':
        return `Auto-fix: ${quality.autoFix ? 'Yes' : 'No'} | Lint: ${quality.runLinter ? 'Yes' : 'No'}`;
      case 'learn':
        return `Niche: ${selfImprove.niche} | Min Stars: ${selfImprove.minStars}`;
      default:
        return '';
    }
  };

  const handleOpenConfig = (id?: string) => {
    setSelectedFeatureId(id || null);
    setShowConfigModal(true);
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

  if (loading && !stats.totalOpportunities) {  
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Council Command Center</h1>  
            <p className="text-gray-600 dark:text-slate-400 mt-1">  
              Performance tracking and expert management.  
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

      <Suspense fallback={<div>Loading...</div>}>
        <FeatureConfigModal 
          isOpen={showConfigModal} 
          onClose={() => setShowConfigModal(false)} 
          initialTab={selectedFeatureId}
        />
      </Suspense>

      <Tabs defaultValue="experts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="experts">Expert Control</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="experts" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Core Experts
                </h2>
                <Badge variant="outline" className="gap-2 glass-panel">
                  <Github className="h-4 w-4" />
                  Powered by GitHub Actions
                </Badge>
              </div>
              
              {features.map((feature) => (
                <Card key={feature.id} className="hover:shadow-xl hover:scale-[1.02] transition-all glass-panel border-2 border-violet-500/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{feature.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{feature.name}</CardTitle>
                          <CardDescription className="mt-1">{feature.description}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(feature.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{parseCronSchedule(feature.schedule)}</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded">
                      {getFeatureConfig(feature.id)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleOpenConfig(feature.id)}
                        size="sm"
                        variant="default"
                        className="gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Configure
                      </Button>
                      <Button
                        onClick={() => window.open(getTriggerUrl(feature.workflow), '_blank')}
                        size="sm"
                        className="gap-2 flex-1"
                      >
                        <Play className="h-4 w-4" />
                        Trigger
                      </Button>
                      <Button
                        onClick={() => window.open(getWorkflowUrl(feature.workflow), '_blank')}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Runs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 border-2 border-violet-500/20 glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Github className="h-6 w-6 text-violet-500" />
                    System Integrity
                  </CardTitle>
                  <CardDescription className="text-base">Operational status and quick links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-sm">System Operational</span>
                  </div>
                  
                  <div className="p-3 bg-background/50 rounded-lg border border-violet-500/20">
                    <h4 className="font-semibold text-sm mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start hover:bg-violet-500/10"
                        onClick={() => window.open(`https://github.com/${repoOwner}/${repoName}/actions`, '_blank')}
                      >
                        <Github className="h-4 w-4 mr-2" />
                        View All Workflows
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start hover:bg-violet-500/10"
                        onClick={() => navigate('/quality')}
                      >
                        📊 Quality Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-2 border-violet-500/10">
                <CardHeader>
                  <CardTitle className="text-lg">Intelligence Feed</CardTitle>
                  <CardDescription>Access generated data and reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start glass-panel hover:bg-violet-500/10">
                    📄 Latest Scout Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start glass-panel hover:bg-violet-500/10">
                    🎯 Blue Ocean Ops
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <MiningDrillPanel />
          </div>

          <div className="mt-8">
            {loadingOpportunities ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent></Card>
            ) : (
              <GoldmineDetector opportunities={opportunities} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
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
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-slate-800">  
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">Weekly Activity</h3>  
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">  
                  <LineChart data={weeklyData}>  
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />  
                    <XAxis dataKey="name" stroke="#6b7280" />  
                    <YAxis stroke="#6b7280" />  
                    <Tooltip />  
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />  
                  </LineChart>  
                </ResponsiveContainer>  
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-slate-800">  
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">Opportunities by Category</h3>  
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">  
                  <PieChart>  
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value">  
                      {categoryData.map((_, index) => (  
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />  
                      ))}  
                    </Pie>  
                    <Tooltip />  
                  </PieChart>  
                </ResponsiveContainer>  
              </div>
            </div>  
          </div>

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
        </TabsContent>
      </Tabs>
    </div>  
  );  
};

export default Dashboard;