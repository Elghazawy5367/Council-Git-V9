import React, { useEffect, useMemo } from 'react';
import { useMemoryStore } from '@/features/council/store/memory-store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/primitives/sheet';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { Input } from '@/components/primitives/input';
import { Switch } from '@/components/primitives/switch';
import { Label } from '@/components/primitives/label';
import { ScrollArea } from '@/components/primitives/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/primitives/alert-dialog';
import {
  Brain,
  Search,
  Trash2,
  Download,
  X,
  Lightbulb,
  RefreshCw,
  Tag,
} from 'lucide-react';
import { toast } from 'sonner';
import { MemoryEntry, formatMemoryTime, getMemoryTypeLabel, MemoryType } from '@/features/council/lib/council-memory';

interface MemoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({ isOpen, onClose }) => {
  const {
    memory,
    searchQuery,
    filterType,
    isLoading,
    loadMemory,
    toggleEnabled,
    clearAll,
    setSearchQuery,
    setFilterType,
  } = useMemoryStore((state) => ({
    memory: state.memory,
    searchQuery: state.searchQuery,
    filterType: state.filterType,
    isLoading: state.isLoading,
    loadMemory: state.loadMemory,
    toggleEnabled: state.toggleEnabled,
    clearAll: state.clearAll,
    setSearchQuery: state.setSearchQuery,
    setFilterType: state.setFilterType,
  }));

  useEffect(() => {
    if (isOpen) {
      loadMemory();
    }
  }, [isOpen, loadMemory]);

  const handleExport = () => {
    if (!memory) return;
    const data = JSON.stringify(memory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `council_memory_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Memory exported successfully');
  };

  const filteredEntries = useMemo(() => {
    return memory?.entries.filter(entry => {
      const matchesSearch = !searchQuery ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = !filterType || entry.type === filterType;
      return matchesSearch && matchesType;
    }) || [];
  }, [memory?.entries, searchQuery, filterType]);

  const typeCounts = useMemo(() => {
    return memory?.entries.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
  }, [memory?.entries]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg glass-panel-elevated">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Council Memory
          </SheetTitle>
          <SheetDescription>
            Persistent insights across sessions. {memory?.entries.length || 0} memories stored.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="memory-enabled"
                checked={memory?.enabled ?? true}
                onCheckedChange={toggleEnabled}
              />
              <Label htmlFor="memory-enabled" className="text-sm">
                {memory?.enabled ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExport} title="Export memory">
                <Download className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" title="Clear all memory">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all memories?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all {memory?.entries.length || 0} memory entries. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant={filterType === null ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setFilterType(null)}>
              All ({memory?.entries.length || 0})
            </Badge>
            {Object.entries(typeCounts).map(([type, count]) => (
              <Badge key={type} variant={filterType === type ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setFilterType(filterType === type ? null : type as MemoryType)}>
                {getMemoryTypeLabel(type as MemoryType)} ({count})
              </Badge>
            ))}
          </div>

          <ScrollArea className="h-[calc(100vh-320px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Lightbulb className="h-10 w-10 mb-3 opacity-50" />
                <p className="text-sm font-medium">No memories found</p>
                <p className="text-xs text-center">{searchQuery || filterType ? 'Try adjusting your search or filters.' : 'Insights will be captured from your Council sessions.'}</p>
              </div>
            ) : (
              <div className="space-y-3 pr-4">
                {filteredEntries.map((entry) => (
                  <MemoryEntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface MemoryEntryCardProps {
  entry: MemoryEntry;
}

const MemoryEntryCard: React.FC<MemoryEntryCardProps> = ({ entry }) => {
  return (
    <div className="group relative rounded-lg border border-border/50 bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <Badge variant="outline" className="text-[10px]">{getMemoryTypeLabel(entry.type)}</Badge>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">{formatMemoryTime(entry.timestamp)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              const { deleteMemoryEntry } = useMemoryStore.getState();
              deleteMemoryEntry(entry.id);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{entry.content}</p>
      {(entry.tags || []).length > 0 && (
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <Tag className="h-3 w-3 text-muted-foreground" />
          {entry.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0">{tag}</Badge>
          ))}
        </div>
      )}
      {entry.relevanceScore > 0 && (
        <div className="flex items-center justify-end mt-2">
          <span className="text-[9px] text-muted-foreground">Score: {(entry.relevanceScore * 100).toFixed(0)}</span>
        </div>
      )}
    </div>
  );
};

export default MemoryPanel;
