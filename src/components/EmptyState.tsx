import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/primitives/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  children,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      {Icon && (
        <div className="mb-4 rounded-full bg-muted/50 p-6">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
      )}

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>

      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action.onClick} className="flex items-center gap-2">
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

// Pre-configured empty states
export const NoExpertsEmptyState: React.FC<{ onAddExpert?: () => void }> = ({ onAddExpert }) => (
  <EmptyState
    title="No Experts Configured"
    description="Add your first expert to start getting multi-perspective insights on your questions."
    action={onAddExpert ? { label: "Add Expert", onClick: onAddExpert } : undefined}
  />
);

export const NoHistoryEmptyState: React.FC = () => (
  <EmptyState
    title="No History Yet"
    description="Your previous conversations will appear here. Start by asking The Council a question."
  />
);

export const VaultLockedEmptyState: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => (
  <EmptyState
    title="Vault Locked"
    description="Unlock your vault to access API keys and start using The Council."
    action={{ label: "Unlock Vault", onClick: onUnlock }}
  />
);

export const NoMemoriesEmptyState: React.FC = () => (
  <EmptyState
    title="No Memories Stored"
    description="The Council will automatically remember important insights and patterns from your conversations."
  />
);

export const NoResultsEmptyState: React.FC<{ searchQuery?: string; onClear?: () => void }> = ({
  searchQuery,
  onClear,
}) => (
  <EmptyState
    title="No Results Found"
    description={
      searchQuery
        ? `No results found for "${searchQuery}". Try adjusting your search.`
        : 'No results match your current filters.'
    }
    action={onClear ? { label: "Clear Filters", onClick: onClear } : undefined}
  />
);
