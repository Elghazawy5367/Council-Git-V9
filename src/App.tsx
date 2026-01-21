import React, { Suspense } from "react";
import { TooltipProvider } from "@/components/primitives/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import RootErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/primitives/sonner";

// Lazy load pages for code splitting
const Index = React.lazy(() => import("@/pages/Index"));
const AutomationDashboard = React.lazy(() => import("@/pages/AutomationDashboard"));
const QualityDashboard = React.lazy(() => import("@/pages/QualityDashboard"));
const ScoutConfig = React.lazy(() => import("@/pages/features/ScoutConfig"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-lg opacity-50 animate-pulse" />
        <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Loading Council...</p>
    </div>
  </div>
);

const App = () => (
  <RootErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <HashRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<AutomationDashboard />} />
              <Route path="/quality" element={<QualityDashboard />} />
              <Route path="/features/scout" element={<ScoutConfig />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </RootErrorBoundary>
);

export default App;
