import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/primitives/dialog';
import { Button } from '@/components/primitives/button';
import { SafeMarkdown } from '@/components/primitives/SafeMarkdown';
import { Expert } from '@/features/council/lib/types';
import { MAGNIFICENT_7_FLEET } from '@/lib/config';
import { 
  Copy, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown, 
  ___X,
  Brain,
  Cpu,
  Target,
  Heart,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Cpu,
  Target,
  Heart,
  AlertTriangle,
};

interface ExpertExpandedModalProps {
  expert: Expert;
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
}

export const ExpertExpandedModal: React.FC<ExpertExpandedModalProps> = ({
  expert,
  isOpen,
  onClose,
  onRetry,
}) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const IconComponent = ICON_MAP[expert.icon] || Brain;
  const selectedModel = MAGNIFICENT_7_FLEET.find((m) => m.id === expert.model);

  const handleCopy = () => {
    if (expert.output) {
      navigator.clipboard.writeText(expert.output);
      toast.success('Output copied to clipboard');
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    toast.success(`Feedback recorded: ${type === 'up' ? '👍' : '👎'}`);
  };

  const handleRetry = () => {
    onRetry?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col glass-panel-elevated">
        <DialogHeader className="flex-shrink-0 border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${expert.color} flex items-center justify-center shadow-lg`}
              >
                <IconComponent className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {expert.name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedModel?.name || 'Unknown Model'} • {selectedModel?.specialty}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-6 px-1">
          {expert.output ? (
            <div className="prose prose-lg prose-invert max-w-none">
              <SafeMarkdown content={expert.output} className="text-base leading-relaxed" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No output available yet
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex-shrink-0 border-t border-border/50 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!expert.output}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={!onRetry}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Rate quality:</span>
            <div className="flex items-center gap-1">
              <Button
                variant={feedback === 'up' ? 'default' : 'ghost'}
                size="icon"
                className={`h-8 w-8 ${feedback === 'up' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                onClick={() => handleFeedback('up')}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                variant={feedback === 'down' ? 'default' : 'ghost'}
                size="icon"
                className={`h-8 w-8 ${feedback === 'down' ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                onClick={() => handleFeedback('down')}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertExpandedModal;
