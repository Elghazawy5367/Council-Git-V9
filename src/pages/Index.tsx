import React, { Suspense, lazy } from "react";
import { Header } from "@/features/council/components/Header";
import { ControlPanel } from "@/features/council/components/ControlPanel";
import { ExpertCard } from "@/features/council/components/ExpertCard";
import { VerdictPanel } from "@/features/council/components/VerdictPanel";
import { SynthesisCard } from "@/features/council/components/SynthesisCard";
import { useControlPanelStore } from "@/features/council/store/control-panel-store";
import { useExpertStore } from "@/features/council/store/expert-store";
import { useSettingsStore } from "@/features/settings/store/settings-store";
import { Loader2 } from "lucide-react";

const SettingsModal = lazy(() => import("@/features/settings/components/SettingsModal"));
const HistorySidebar = lazy(() => import("@/features/council/components/HistoryPanel"));
const MemoryPanel = lazy(() => import("@/features/council/components/MemoryPanel"));

const Index: React.FC = () => {
  const { activeExpertCount } = useControlPanelStore();
  const { experts } = useExpertStore();
  const { showSettings, setShowSettings, showHistory, setShowHistory, showMemory, setShowMemory } = useSettingsStore();

  const getGridCols = () => {
    const totalCols = activeExpertCount + 1;
    if (totalCols <= 2) return "grid-cols-1 md:grid-cols-2";
    if (totalCols <= 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    if (totalCols <= 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    if (totalCols <= 5) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <ControlPanel />
            <VerdictPanel />
          </div>
          <div className="lg:col-span-3">
            <div className={`grid ${getGridCols()} gap-4 auto-rows-fr stagger-fade-in`}>
              {experts.slice(0, activeExpertCount).map((expert, index) => <ExpertCard key={expert.id} index={index} />)}
              <SynthesisCard />
            </div>
          </div>
        </div>
      </main>
      <Suspense fallback={<div className="h-12 w-12 animate-spin text-primary" />}>
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        <HistorySidebar isOpen={showHistory} onClose={() => setShowHistory(false)} />
        <MemoryPanel isOpen={showMemory} onClose={() => setShowMemory(false)} />
      </Suspense>
    </div>
  );
};

export default Index;
