import React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertCircle } from 'lucide-react';

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6">
    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
    <h2 className="text-xl font-semibold mb-2">Dashboard Error</h2>
    <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
    >
      Retry
    </button>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => console.log('[Dashboard] Error boundary reset')}
    >
      <DashboardLayout />
    </ErrorBoundary>
  );
};

export default Dashboard;
