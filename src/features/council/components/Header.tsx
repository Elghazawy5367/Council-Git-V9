import React from 'react';
import { useExecutionStore } from '@/features/council/store/execution-store';
import { useSettingsStore } from '@/features/settings/store/settings-store';
import { useMemoryStore } from '@/features/council/store/memory-store';
import { Brain, Settings, Lock, Unlock, DollarSign, History } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { MemoryBadge } from './MemoryBadge';

export const Header: React.FC = () => {
  const { cost } = useExecutionStore();
  const {
    vaultStatus,
    setShowSettings,
    showHistory,
    setShowHistory,
    __showMemory,
    setShowMemory,
  } = useSettingsStore();
  const { memory } = useMemoryStore();
  const memoryCount = memory?.entries.length || 0;

  return (
    <header className="glass-panel border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-secondary blur-md opacity-60" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">The Council</h1>
              <p className="text-xs text-muted-foreground">V18 • Multi-Perspective Decision Engine</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Memory badge */}
            <MemoryBadge count={memoryCount} onClick={() => setShowMemory(true)} />

            {/* Cost tracker */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
              <DollarSign className="h-4 w-4 text-council-success" />
              <span className="font-mono text-sm text-foreground">${cost.total.toFixed(4)}</span>
            </div>

            {/* History button */}
            <Button
              variant={showHistory ? 'default' : 'ghost'}
              size="icon"
              className="h-10 w-10"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="h-5 w-5" />
            </Button>

            {/* Vault status */}
            <Badge
              variant={vaultStatus.isLocked ? 'destructive' : 'default'}
              className={`flex items-center gap-1.5 ${
                vaultStatus.isLocked
                  ? 'bg-destructive/20 text-destructive border-destructive/30'
                  : 'bg-council-success/20 text-council-success border-council-success/30'
              }`}
            >
              {vaultStatus.isLocked ? (
                <>
                  <Lock className="h-3 w-3" />
                  Locked
                </>
              ) : (
                <>
                  <Unlock className="h-3 w-3" />
                  Unlocked
                </>
              )}
            </Badge>

            {/* Settings button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 hover:bg-primary/10"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
