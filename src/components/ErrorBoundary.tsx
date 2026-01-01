import React, { ErrorInfo } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Button } from "@/components/primitives/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";

/**
 * Mobile-friendly, production-ready Error Fallback UI.
 * Designed for "The Council" with high-contrast, touch-friendly recovery actions.
 */
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div 
      className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center animate-in fade-in duration-500"
      role="alert"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-10 w-10" />
      </div>
      
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Systems Offline
      </h1>
      
      <p className="mb-8 max-w-md text-muted-foreground">
        A component in <span className="font-mono text-destructive tracking-tighter">The Council</span> encountered a critical failure. 
        We've logged the incident and isolated the crash.
      </p>

      {process.env.NODE_ENV === "development" && (
        <pre className="mb-8 max-h-40 w-full max-w-lg overflow-auto rounded-lg bg-muted p-4 text-left text-xs font-mono text-destructive border border-destructive/20">
          <code>{error.message}</code>
        </pre>
      )}

      <div className="flex w-full max-w-xs flex-col gap-3 sm:flex-row sm:max-w-md">
        <Button 
          variant="default" 
          size="lg" 
          onClick={resetErrorBoundary}
          className="flex-1 gap-2 min-h-[56px] text-lg sm:min-h-[44px] sm:text-base active:scale-95 transition-transform"
          data-testid="button-error-retry"
        >
          <RefreshCcw className="h-5 w-5" />
          Retry System
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => window.location.href = "/"}
          className="flex-1 gap-2 min-h-[56px] text-lg sm:min-h-[44px] sm:text-base active:scale-95 transition-transform"
          data-testid="button-error-home"
        >
          <Home className="h-5 w-5" />
          Full Reset
        </Button>
      </div>
    </div>
  );
}

const logError = (error: Error, info: ErrorInfo) => {
  // In production, send to Sentry/LogRocket here
  console.error("CRITICAL_UI_FAILURE:", error, info.componentStack);
};

interface CustomErrorBoundaryProps {
  children: React.ReactNode;
}

const CustomErrorBoundary: React.FC<CustomErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logError}
      onReset={() => {
        // Clear local storage or state if needed
        console.log("System state reset initiated");
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default CustomErrorBoundary;
