
import React from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Button } from "@/components/primitives/button";

// This is a placeholder for a real error monitoring service like Sentry or BugSnag.
// In a real application, this function would send the error and componentStack
// to your monitoring service.
const logErrorToService = (error: Error, info: { componentStack: string }) => {
  console.error("Caught an error:", error, info.componentStack);
  // Example: Sentry.captureException(error, { extra: { componentStack } });
};

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4"
      role="alert"
    >
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">
          Application Error
        </h1>
        <p className="text-muted-foreground mb-2">
          We apologize for the inconvenience. A critical error has occurred.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Our team has been automatically notified. Please try resetting the
          application.
        </p>
        <pre className="text-xs text-left bg-muted p-2 rounded-md overflow-auto mb-6">
          <code>{error.message}</code>
        </pre>
        <Button onClick={resetErrorBoundary} variant="destructive">
          Reset Application
        </Button>
      </div>
    </div>
  );
}

interface CustomErrorBoundaryProps {
  children: React.ReactNode;
}

const CustomErrorBoundary: React.FC<CustomErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error, info: { componentStack: string }) => {
    logErrorToService(error, info);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};

export default CustomErrorBoundary;
