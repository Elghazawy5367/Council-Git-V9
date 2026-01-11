import React, { Suspense, lazy, useMemo } from "react";
import { Header } from "@/features/council/components/Header";
import { ControlPanel } from "@/features/council/components/ControlPanel";
import { ExpertCard } from "@/features/council/components/ExpertCard";
import { VerdictPanel } from "@/features/council/components/VerdictPanel";
import { SynthesisCard } from "@/features/council/components/SynthesisCard";
import { useControlPanelStore } from "@/features/council/store/control-panel-store";
import { useExpertStore } from "@/features/council/store/expert-store";
import { useSettingsStore } from "@/features/settings/store/settings-store";
import { ErrorBoundary } from "react-error-boundary";
import { AlertCircle } from "lucide-react";
import { NoExpertsEmptyState } from "@/components/EmptyState";

const SettingsModal = lazy(() => import("@/features/settings/components/SettingsModal"));
const HistorySidebar = lazy(() => import("@/features/council/components/HistoryPanel"));
const MemoryPanel = lazy(() => import("@/features/council/components/MemoryPanel"));

// Component-level error fallback
const ComponentErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex flex-col items-center justify-center p-6 border border-destructive/20 rounded-lg bg-destructive/5">
    <AlertCircle className="h-8 w-8 text-destructive mb-2" />
    <p className="text-sm text-muted-foreground mb-2">Component Error</p>
    <p className="text-xs text-destructive mb-3">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
    >
      Retry
    </button>
  </div>
);

const Index: React.FC = () => {
  const activeExpertCount = useControlPanelStore(state => state.activeExpertCount);
  const experts = useExpertStore(state => state.experts);
  const showSettings = useSettingsStore(state => state.showSettings);
  const setShowSettings = useSettingsStore(state => state.setShowSettings);
  const showHistory = useSettingsStore(state => state.showHistory);
  const setShowHistory = useSettingsStore(state => state.setShowHistory);
  const showMemory = useSettingsStore(state => state.showMemory);
  const setShowMemory = useSettingsStore(state => state.setShowMemory);

  const getGridCols = useMemo(() => {
    return () => {
      const totalCols = activeExpertCount + 1;
      if (totalCols <= 2) return "grid-cols-1 md:grid-cols-2";
      if (totalCols <= 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      if (totalCols <= 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      if (totalCols <= 5) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6";
    };
  }, [activeExpertCount]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Protected */}
      <ErrorBoundary
        FallbackComponent={ComponentErrorFallback}
        onReset={() => console.log('[Header] Error boundary reset')}
      >
        <Header />
      </ErrorBoundary>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {/* Control Panel - Protected */}
            <ErrorBoundary
              FallbackComponent={ComponentErrorFallback}
              onReset={() => console.log('[ControlPanel] Error boundary reset')}
            >
              <ControlPanel />
            </ErrorBoundary>

            {/* Verdict Panel - Protected */}
            <ErrorBoundary
              FallbackComponent={ComponentErrorFallback}
              onReset={() => console.log('[VerdictPanel] Error boundary reset')}
            >
              <VerdictPanel />
            </ErrorBoundary>
          </div>

          <div className="lg:col-span-3">
            {/* Expert Grid - Protected */}
            <ErrorBoundary
              FallbackComponent={ComponentErrorFallback}
              onReset={() => console.log('[ExpertGrid] Error boundary reset')}
            >
              {experts.length === 0 ? (
                <NoExpertsEmptyState onAddExpert={() => setShowSettings(true)} />
              ) : (
                <div className={`grid ${getGridCols()} gap-4 auto-rows-fr stagger-fade-in`}>
                  {experts.slice(0, activeExpertCount).map((expert, index) => <ExpertCard key={expert.id} index={index} />)}
                  
                  {/* Synthesis Card - Protected */}
                  <ErrorBoundary
                    FallbackComponent={ComponentErrorFallback}
                    onReset={() => console.log('[SynthesisCard] Error boundary reset')}
                  >
                    <SynthesisCard />
                  </ErrorBoundary>
                </div>
              )}
            </ErrorBoundary>
          </div>
        </div>
      </main>

      <Suspense fallback={<div className="h-12 w-12 animate-spin text-primary" />}>
        {showSettings && <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />}
        {showHistory && <HistorySidebar isOpen={showHistory} onClose={() => setShowHistory(false)} />}
        {showMemory && <MemoryPanel isOpen={showMemory} onClose={() => setShowMemory(false)} />}
      </Suspense>
    </div>
  );
};

export default Index;

