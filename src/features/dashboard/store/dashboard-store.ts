import { create } from 'zustand';
import type { ExecutionMode } from '@/features/council/lib/types';

export interface DecisionMetrics {
  totalDecisions: number;
  averageTime: number; // in seconds
  averageCost: number; // in USD
  successRate: number; // percentage
  expertConsensusRate: number; // percentage
  modeDistribution: Record<ExecutionMode, number>;
}

export interface DecisionRecord {
  id: string;
  timestamp: Date;
  mode: ExecutionMode;
  task: string;
  expertCount: number;
  duration: number; // seconds
  cost: number; // USD
  verdict: string;
  synthesisContent?: string;
  success: boolean;
}

interface DashboardState {
  metrics: DecisionMetrics;
  recentDecisions: DecisionRecord[];
  dateRange: {
    start: Date;
    end: Date;
  };
  setDateRange: (start: Date, end: Date) => void;
  addDecisionRecord: (record: DecisionRecord) => void;
  updateMetrics: () => void;
  exportData: () => string;
}

const calculateMetrics = (decisions: DecisionRecord[]): DecisionMetrics => {
  if (decisions.length === 0) {
    return {
      totalDecisions: 0,
      averageTime: 0,
      averageCost: 0,
      successRate: 0,
      expertConsensusRate: 0,
      modeDistribution: {
        parallel: 0,
        consensus: 0,
        adversarial: 0,
        sequential: 0,
      },
    };
  }

  const totalTime = decisions.reduce((sum, d) => sum + d.duration, 0);
  const totalCost = decisions.reduce((sum, d) => sum + d.cost, 0);
  const successCount = decisions.filter((d) => d.success).length;

  const modeDistribution = decisions.reduce((acc, d) => {
    acc[d.mode] = (acc[d.mode] || 0) + 1;
    return acc;
  }, {} as Record<ExecutionMode, number>);

  return {
    totalDecisions: decisions.length,
    averageTime: totalTime / decisions.length,
    averageCost: totalCost / decisions.length,
    successRate: (successCount / decisions.length) * 100,
    expertConsensusRate: 85, // TODO: Calculate from actual data
    modeDistribution,
  };
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  metrics: {
    totalDecisions: 0,
    averageTime: 0,
    averageCost: 0,
    successRate: 0,
    expertConsensusRate: 0,
    modeDistribution: {
      parallel: 0,
      consensus: 0,
      adversarial: 0,
      sequential: 0,
    },
  },
  recentDecisions: [],
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  },

  setDateRange: (start: Date, end: Date) => {
    set({ dateRange: { start, end } });
    get().updateMetrics();
  },

  addDecisionRecord: (record: DecisionRecord) => {
    set((state) => ({
      recentDecisions: [record, ...state.recentDecisions].slice(0, 50), // Keep last 50
    }));
    get().updateMetrics();
  },

  updateMetrics: () => {
    const { recentDecisions, dateRange } = get();
    const filteredDecisions = recentDecisions.filter(
      (d) => d.timestamp >= dateRange.start && d.timestamp <= dateRange.end
    );
    const metrics = calculateMetrics(filteredDecisions);
    set({ metrics });
  },

  exportData: () => {
    const { recentDecisions } = get();
    return JSON.stringify(recentDecisions, null, 2);
  },
}));
