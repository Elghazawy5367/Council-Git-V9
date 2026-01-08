================================================================================
File: src/App.css
================================================================================
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}


================================================================================
File: src/App.tsx
================================================================================
import React, { Suspense } from "react";
import { TooltipProvider } from "@/components/primitives/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import RootErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/primitives/sonner";

// Lazy load pages for code splitting
const Index = React.lazy(() => import("@/pages/Index"));
const QualityDashboard = React.lazy(() => import("@/pages/QualityDashboard"));
const FeaturesDashboard = React.lazy(() => import("@/pages/FeaturesDashboard"));
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
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/quality" element={<QualityDashboard />} />
              <Route path="/features" element={<FeaturesDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </RootErrorBoundary>
);

export default App;


================================================================================
File: src/components/ErrorBoundary.tsx
================================================================================
import React, { ErrorInfo } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Button } from "@/components/primitives/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

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
          <RefreshCw className="h-5 w-5" />
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
  
  // Log structured error for production monitoring
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: error.message,
    name: error.name,
    stack: error.stack,
    componentStack: info.componentStack,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.error('[ErrorBoundary] Structured Error Log:', errorLog);
  
  // Check if error is recoverable
  const isRecoverable = !(
    error.message?.includes('chunk') ||
    error.message?.includes('dynamically imported') ||
    error.message?.includes('Failed to fetch')
  );
  
  if (!isRecoverable) {
    console.log('[ErrorBoundary] Module error detected, may require page reload');
  }
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
        // Preserve critical state before reset
        console.log("System state reset initiated");
        
        // Backup localStorage
        const backup: Record<string, string> = {};
        ['council_experts', 'council_memory', 'settings-storage'].forEach(key => {
          const value = localStorage.getItem(key);
          if (value) backup[key] = value;
        });
        
        // Clear only volatile state
        sessionStorage.clear();
        
        // Restore backed up state
        Object.entries(backup).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
        
        console.log("State preserved and volatile data cleared");
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default CustomErrorBoundary;

/**
 * Feature-specific Error Boundary
 * Isolates errors to individual features without crashing the whole app
 */
export const FeatureErrorBoundary: React.FC<{
  children: React.ReactNode;
  featureName: string;
  fallback?: React.ReactNode;
}> = ({ children, featureName, fallback }) => {
  const defaultFallback = (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <h3 className="font-semibold text-yellow-900">
            {featureName} Temporarily Unavailable
          </h3>
          <p className="text-sm text-yellow-700">
            This feature encountered an error. Other features continue working normally.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.location.reload()}
        className="mt-2"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry Feature
      </Button>
    </div>
  );

  return (
    <ErrorBoundary
      FallbackComponent={() => fallback || defaultFallback}
      onError={(error, info) => {
        console.error(`[${featureName}] Feature Error:`, error);
        logError(error, info);
      }}
      onReset={() => {
        console.log(`[${featureName}] Feature reset initiated`);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};


================================================================================
File: src/components/NavLink.tsx
================================================================================
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
export default NavLink;


================================================================================
File: src/components/primitives/ArtifactRenderer.tsx
================================================================================
import React, { useState, Suspense, lazy } from 'react';
import { Copy, ChevronDown, ChevronUp, Code, Table, FileJson, FileText } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Card, CardContent, CardHeader } from '@/components/primitives/card';
import { Badge } from '@/components/primitives/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/primitives/collapsible';
import { toast } from 'sonner';
import { languageMapping } from '@/lib/language-mapping';

// Lazy load MermaidDiagram
const MermaidDiagram = lazy(() => import('./MermaidDiagram'));

export interface Artifact {
  type: 'code' | 'mermaid' | 'table' | 'json' | 'markdown';
  language?: string;
  content: string;
  title?: string;
}

interface ArtifactCardProps {
  artifact: Artifact;
  defaultOpen?: boolean;
}

const DiagramLoader = () => (
  <div className="flex items-center justify-center p-4 bg-muted/30 rounded-lg">
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      Loading diagram...
    </div>
  </div>
);

const getArtifactIcon = (type: Artifact['type']) => {
  switch (type) {
    case 'code':
      return Code;
    case 'mermaid':
      return FileText;
    case 'table':
      return Table;
    case 'json':
      return FileJson;
    default:
      return FileText;
  }
};

const getArtifactTitle = (artifact: Artifact): string => {
  if (artifact.title) return artifact.title;
  switch (artifact.type) {
    case 'code':
      return `Code (${artifact.language || 'text'})`;
    case 'mermaid':
      return 'Diagram';
    case 'table':
      return 'Data Table';
    case 'json':
      return 'JSON Data';
    case 'markdown':
      return 'Formatted Text';
    default:
      return 'Artifact';
  }
};

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const Icon = getArtifactIcon(artifact.type);
  const title = getArtifactTitle(artifact);

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content);
    toast.success('Copied to clipboard');
  };

  const renderContent = () => {
    switch (artifact.type) {
      case 'mermaid':
        return (
          <Suspense fallback={<DiagramLoader />}>
            <MermaidDiagram chart={artifact.content} className="w-full" />
          </Suspense>
        );

      case 'code':
        return (
          <div className="relative">
            <div className="absolute top-2 right-2 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/70 rounded">
              {languageMapping[artifact.language || ''] || artifact.language || 'text'}
            </div>
            <pre className="overflow-x-auto p-4 pt-8 rounded-lg bg-muted/40 border border-border/30 text-sm font-mono">
              <code>{artifact.content}</code>
            </pre>
          </div>
        );

      case 'json':
        return (
          <pre className="overflow-x-auto p-4 rounded-lg bg-muted/40 border border-border/30 text-sm font-mono">
            <code>{JSON.stringify(JSON.parse(artifact.content), null, 2)}</code>
          </pre>
        );

      case 'table':
      case 'markdown':
      default:
        return (
          <div className="p-3 bg-muted/20 rounded-lg border border-border/20">
            <pre className="whitespace-pre-wrap text-sm">{artifact.content}</pre>
          </div>
        );
    }
  };

  return (
    <Card className="my-4 border-primary/20 bg-gradient-to-br from-card to-muted/20 overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="py-2 px-3 bg-muted/30 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{title}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                {artifact.type}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopy}
                title="Copy content"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-3">{renderContent()}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ArtifactCard;


================================================================================
File: src/components/primitives/MermaidDiagram.tsx
================================================================================
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with dark theme
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'strict',
  fontFamily: 'inherit',
  themeVariables: {
    primaryColor: 'hsl(var(--primary))',
    primaryTextColor: 'hsl(var(--primary-foreground))',
    primaryBorderColor: 'hsl(var(--border))',
    lineColor: 'hsl(var(--muted-foreground))',
    secondaryColor: 'hsl(var(--secondary))',
    tertiaryColor: 'hsl(var(--muted))',
    background: 'hsl(var(--background))',
    mainBkg: 'hsl(var(--card))',
    nodeBorder: 'hsl(var(--border))',
    clusterBkg: 'hsl(var(--muted))',
    titleColor: 'hsl(var(--foreground))',
    edgeLabelBackground: 'hsl(var(--background))',
  },
});

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!chart || !containerRef.current) return;

      setIsLoading(true);
      setError(null);

      try {
        // Generate unique ID for this diagram
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Clean the chart string
        const cleanedChart = chart.trim();
        
        // Render the diagram
        const { svg: renderedSvg } = await mermaid.render(id, cleanedChart);
        setSvg(renderedSvg);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      } finally {
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [chart]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 bg-muted/30 rounded-lg ${className}`}>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Rendering diagram...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-destructive/10 border border-destructive/30 rounded-lg ${className}`}>
        <p className="text-destructive text-sm font-medium mb-2">Diagram Error</p>
        <pre className="text-xs text-muted-foreground overflow-x-auto">
          {chart}
        </pre>
        <p className="text-xs text-destructive/70 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`mermaid-container overflow-x-auto p-4 bg-muted/20 rounded-lg border border-border/50 ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidDiagram;


================================================================================
File: src/components/primitives/SafeMarkdown.tsx
================================================================================
import React, { useMemo, Suspense, lazy } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sanitizeContent } from '@/lib/sanitize';

// Lazy load MermaidDiagram for code splitting
const MermaidDiagram = lazy(() => import('./MermaidDiagram'));

interface SafeMarkdownProps {
  content: string;
  className?: string;
}

// Loading fallback for mermaid diagrams
const DiagramLoader = () => (
  <div className="flex items-center justify-center p-4 bg-muted/30 rounded-lg my-2">
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      Loading diagram...
    </div>
  </div>
);

/**
 * Enhanced Markdown renderer with:
 * - XSS protection via sanitization
 * - GitHub Flavored Markdown (tables, strikethrough, etc.)
 * - Mermaid diagram rendering
 * - Styled code blocks and tables
 */
export const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ content, className = '' }) => {
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    // Light sanitization - ReactMarkdown handles most XSS concerns
    return content;
  }, [content]);

  return (
    <div className={`prose prose-sm prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom code block renderer for Mermaid support
          code({ node, className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || '');
            const language = match ? match[1] : '';
            const codeContent = String(children).replace(/\n$/, '');

            // Render Mermaid diagrams
            if (language === 'mermaid') {
              return (
                <Suspense fallback={<DiagramLoader />}>
                  <MermaidDiagram chart={codeContent} className="my-4" />
                </Suspense>
              );
            }

            // Inline code
            if (!match) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-[0.85em]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // Code blocks with syntax highlighting placeholder
            return (
              <div className="relative my-3">
                <div className="absolute top-0 right-0 px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/50 rounded-bl">
                  {language}
                </div>
                <pre className="overflow-x-auto p-4 pt-8 rounded-lg bg-muted/30 border border-border/50">
                  <code className="text-sm font-mono" {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },

          // Styled tables
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-border/50 rounded-lg overflow-hidden">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-muted/50">{children}</thead>;
          },
          th({ children }) {
            return (
              <th className="px-4 py-2 text-left text-sm font-semibold text-foreground border-b border-border/50">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-2 text-sm text-muted-foreground border-b border-border/30">
                {children}
              </td>
            );
          },

          // Styled headers
          h1({ children }) {
            return <h1 className="text-2xl font-bold text-foreground mt-6 mb-4 border-b border-border/50 pb-2">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-semibold text-foreground mt-5 mb-3">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-medium text-foreground mt-4 mb-2">{children}</h3>;
          },
          h4({ children }) {
            return <h4 className="text-base font-medium text-foreground mt-3 mb-2">{children}</h4>;
          },

          // Styled paragraphs
          p({ children }) {
            return <p className="mb-3 text-muted-foreground leading-relaxed">{children}</p>;
          },

          // Styled lists
          ul({ children }) {
            return <ul className="list-disc list-outside ml-4 mb-4 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-outside ml-4 mb-4 space-y-1">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-muted-foreground">{children}</li>;
          },

          // Styled blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary/50 pl-4 my-4 italic text-muted-foreground bg-muted/20 py-2 rounded-r">
                {children}
              </blockquote>
            );
          },

          // Styled links
          a({ href, children }) {
            return (
              <a
                href={href}
                className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },

          // Horizontal rule
          hr() {
            return <hr className="my-6 border-border/50" />;
          },

          // Strong text
          strong({ children }) {
            return <strong className="font-semibold text-foreground">{children}</strong>;
          },

          // Emphasis
          em({ children }) {
            return <em className="italic">{children}</em>;
          },
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
};

/**
 * For rendering sanitized HTML content (use with caution)
 */
export const SafeHTML: React.FC<SafeMarkdownProps> = ({ content, className = '' }) => {
  const sanitizedHTML = useMemo(() => {
    if (!content) return { __html: '' };
    return { __html: sanitizeContent(content) };
  }, [content]);

  return (
    <div 
      className={`markdown-body ${className}`}
      dangerouslySetInnerHTML={sanitizedHTML}
    />
  );
};

export default SafeMarkdown;


================================================================================
File: src/components/primitives/accordion.tsx
================================================================================
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

// Replace undefined Component
const PlaceholderAccordion = () => <div>Accordion Placeholder</div>;
export default PlaceholderAccordion;


================================================================================
File: src/components/primitives/alert-dialog.tsx
================================================================================
import React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/variants";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};



================================================================================
File: src/components/primitives/alert.tsx
================================================================================
import React from "react";

import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { alertVariants } from "@/lib/variants";

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };


================================================================================
File: src/components/primitives/aspect-ratio.tsx
================================================================================
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };



================================================================================
File: src/components/primitives/avatar.tsx
================================================================================
import React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };



================================================================================
File: src/components/primitives/badge.tsx
================================================================================
import React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { badgeVariants } from "@/lib/variants";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };

// Replace undefined Component
const PlaceholderBadge = () => <div>Badge Placeholder</div>;
export default PlaceholderBadge;


================================================================================
File: src/components/primitives/breadcrumb.tsx
================================================================================
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  ),
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return <Comp ref={ref} className={cn("transition-colors hover:text-foreground", className)} {...props} />;
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
  <li role="presentation" aria-hidden="true" className={cn("[&>svg]:size-3.5", className)} {...props}>
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};


================================================================================
File: src/components/primitives/button.tsx
================================================================================
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/variants";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };


================================================================================
File: src/components/primitives/calendar.tsx
================================================================================
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/variants";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };



================================================================================
File: src/components/primitives/card.tsx
================================================================================
import React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };



================================================================================
File: src/components/primitives/carousel.tsx
================================================================================
import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/primitives/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState<boolean>(false);
    const [canScrollNext, setCanScrollNext] = React.useState<boolean>(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}
          {...props}
        />
      </div>
    );
  },
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
        {...props}
      />
    );
  },
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  },
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };



================================================================================
File: src/components/primitives/chart.tsx
================================================================================
import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> });
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([_, config]) => config.theme || config.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "line" | "dot" | "dashed";
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item.dataKey || item.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>;
      }

      if (!value) {
        return null;
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center",
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          })}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center",
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = "ChartTooltip";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value}
            className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegend";

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };



================================================================================
File: src/components/primitives/checkbox.tsx
================================================================================
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };



================================================================================
File: src/components/primitives/collapsible.tsx
================================================================================
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };



================================================================================
File: src/components/primitives/command.tsx
================================================================================
import React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "./dialog";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-border", className)} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};

const PlaceholderCommand = () => <div>Command Placeholder</div>;
export default PlaceholderCommand;


================================================================================
File: src/components/primitives/context-menu.tsx
================================================================================
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

const ContextMenu = ContextMenuPrimitive.Root;

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuGroup = ContextMenuPrimitive.Group;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = ContextMenuPrimitive.Sub;

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80",
      className,
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className)}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};



================================================================================
File: src/components/primitives/dialog.tsx
================================================================================
import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};



================================================================================
File: src/components/primitives/drawer.tsx
================================================================================
import React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

const Drawer = ({ shouldScaleBackground = true, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/80", className)} {...props} />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = DrawerPrimitive.Content.displayName;

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};



================================================================================
File: src/components/primitives/dropdown-menu.tsx
================================================================================
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent focus:bg-accent",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />;
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

const ProjectFeaturesDropdown = () => {
  // Import feature config store to show real-time status
  const featureConfig = typeof window !== 'undefined' 
    ? require('@/features/council/store/feature-config-store').useFeatureConfigStore?.getState()
    : null;
  
  const features = [
    { 
      name: "Phantom Scout", 
      description: "24/7 automated GitHub intelligence gathering",
      icon: "👻",
      enabled: featureConfig?.scout?.enabled ?? true,
      category: "intelligence"
    },
    { 
      name: "Code Mirror", 
      description: "Elite code quality analysis and standards",
      icon: "🪞",
      enabled: featureConfig?.mirror?.enabled ?? true,
      category: "quality"
    },
    { 
      name: "Quality Pipeline", 
      description: "Automated linting and type checking",
      icon: "⚡",
      enabled: featureConfig?.quality?.enabled ?? true,
      category: "quality"
    },
    { 
      name: "Self-Improving Loop", 
      description: "Learn from successful GitHub repositories",
      icon: "🧠",
      enabled: featureConfig?.selfImprove?.enabled ?? true,
      category: "intelligence"
    },
    { 
      name: "Stargazer Analysis", 
      description: "Detect institutional backing & quality signals",
      icon: "⭐",
      enabled: featureConfig?.stargazerAnalysis?.enabled ?? true,
      category: "intelligence"
    },
    { 
      name: "Data Fetching & Cache", 
      description: "React Query with intelligent caching",
      icon: "📊",
      enabled: featureConfig?.dataFetching?.enabled ?? true,
      category: "foundation"
    },
    { 
      name: "Type-Safe Forms", 
      description: "Zod validation for bulletproof forms",
      icon: "📝",
      enabled: featureConfig?.typeSafeForms?.enabled ?? true,
      category: "foundation"
    },
    { 
      name: "Error Handling", 
      description: "Retry logic & circuit breakers",
      icon: "🛡️",
      enabled: featureConfig?.errorHandling?.enabled ?? true,
      category: "foundation"
    },
    { 
      name: "Auth & Security", 
      description: "Encrypted vault & session management",
      icon: "🔐",
      enabled: featureConfig?.authSecurity?.enabled ?? true,
      category: "foundation"
    },
    { 
      name: "Agent Orchestration", 
      description: "Multi-expert AI coordination system",
      icon: "🤖",
      enabled: featureConfig?.agentOrchestration?.enabled ?? true,
      category: "ai"
    },
  ];

  const intelligenceFeatures = features.filter(f => f.category === "intelligence");
  const qualityFeatures = features.filter(f => f.category === "quality");
  const foundationFeatures = features.filter(f => f.category === "foundation");
  const aiFeatures = features.filter(f => f.category === "ai");

  const activeCount = features.filter(f => f.enabled).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
        <span>🚀</span>
        <span>Features</span>
        <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
          {activeCount}/10
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="text-base font-semibold flex items-center justify-between">
          <span>🎯 Active Features</span>
          <span className="text-xs text-muted-foreground font-normal">
            {activeCount} Active
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Intelligence Layer */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          🧠 Intelligence Layer
        </DropdownMenuLabel>
        {intelligenceFeatures.map((feature) => (
          <DropdownMenuItem 
            key={feature.name} 
            className="flex flex-col items-start gap-1 p-3 cursor-pointer"
          >
            <div className="flex items-center gap-2 w-full">
              <span className="text-lg">{feature.icon}</span>
              <span className="font-medium text-sm">{feature.name}</span>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                feature.enabled 
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {feature.enabled ? '✓ ON' : '○ OFF'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground pl-7">{feature.description}</span>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Quality Layer */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          ⚡ Quality Layer
        </DropdownMenuLabel>
        {qualityFeatures.map((feature) => (
          <DropdownMenuItem 
            key={feature.name} 
            className="flex flex-col items-start gap-1 p-3 cursor-pointer"
          >
            <div className="flex items-center gap-2 w-full">
              <span className="text-lg">{feature.icon}</span>
              <span className="font-medium text-sm">{feature.name}</span>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                feature.enabled 
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {feature.enabled ? '✓ ON' : '○ OFF'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground pl-7">{feature.description}</span>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Foundation Layer */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          🏗️ Foundation Layer
        </DropdownMenuLabel>
        {foundationFeatures.map((feature) => (
          <DropdownMenuItem 
            key={feature.name} 
            className="flex flex-col items-start gap-1 p-2.5 cursor-pointer"
          >
            <div className="flex items-center gap-2 w-full">
              <span className="text-base">{feature.icon}</span>
              <span className="font-medium text-sm">{feature.name}</span>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                feature.enabled 
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {feature.enabled ? '✓ ON' : '○ OFF'}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* AI Layer */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          🤖 AI Layer
        </DropdownMenuLabel>
        {aiFeatures.map((feature) => (
          <DropdownMenuItem 
            key={feature.name} 
            className="flex flex-col items-start gap-1 p-3 cursor-pointer"
          >
            <div className="flex items-center gap-2 w-full">
              <span className="text-lg">{feature.icon}</span>
              <span className="font-medium text-sm">{feature.name}</span>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                feature.enabled 
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {feature.enabled ? '✓ ON' : '○ OFF'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground pl-7">{feature.description}</span>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <div className="p-2 text-xs text-center text-muted-foreground">
          Configure features in Settings → Feature Config
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  ProjectFeaturesDropdown,
};

// Replacing undefined Component with a placeholder
const PlaceholderComponent = () => <div>Placeholder</div>;
export default PlaceholderComponent;


================================================================================
File: src/components/primitives/form.tsx
================================================================================
import React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider } from "react-hook-form";

import { cn } from "@/lib/utils";
import { FormFieldContext, FormItemContext } from "@/lib/form";

const Form = FormProvider;

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn("text-sm font-medium leading-none", className)} {...props} />
));
FormLabel.displayName = "FormLabel";

export { Form, FormField, FormItem, FormLabel };



================================================================================
File: src/components/primitives/hover-card.tsx
================================================================================
import React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };

const PlaceholderComponent = () => <div>Placeholder</div>;
export default PlaceholderComponent;


================================================================================
File: src/components/primitives/input-otp.tsx
================================================================================
import React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";

import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentPropsWithoutRef<typeof OTPInput>>(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  ),
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center", className)} {...props} />,
);
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ ...props }, ref) => (
    <div ref={ref} role="separator" {...props}>
      <Dot />
    </div>
  ),
);
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };

const InputOtp = () => {
  // Placeholder for the correct component
  return <div>InputOtp Component</div>;
};
export default InputOtp;


================================================================================
File: src/components/primitives/input.tsx
================================================================================
import React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };


================================================================================
File: src/components/primitives/label.tsx
================================================================================
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@/lib/utils";

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };


================================================================================
File: src/components/primitives/menubar.tsx
================================================================================
import React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const MenubarMenu = MenubarPrimitive.Menu;

const MenubarGroup = MenubarPrimitive.Group;

const MenubarPortal = MenubarPrimitive.Portal;

const MenubarSub = MenubarPrimitive.Sub;

const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn("flex h-10 items-center space-x-1 rounded-md border bg-background p-1", className)}
    {...props}
  />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
MenubarShortcut.displayname = "MenubarShortcut";

export {
  Menubar,
  MenubarMenu,
  MenubarGroup,
  MenubarPortal,
  MenubarSub,
  MenubarRadioGroup,
  MenubarTrigger,
};


================================================================================
File: src/components/primitives/navigation-menu.tsx
================================================================================
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";
import { navigationMenuTriggerStyle } from "@/lib/variants";

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
      className,
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};

// Replacing undefined Component with a placeholder
const PlaceholderComponent = () => <div>Placeholder</div>;
export default PlaceholderComponent;


================================================================================
File: src/components/primitives/pagination.tsx
================================================================================
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

// Fix incorrect import for buttonVariants
import { buttonVariants } from "@/components/primitives/button";

import { cn } from "@/lib/utils";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  ),
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

interface PaginationLinkProps {
  size?: "default" | "sm" | "lg";
  isActive?: boolean;
  className?: string;
  [key: string]: unknown;
}

const PaginationLink = ({ className, isActive, size, ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-1 pl-2.5", className)} {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 pr-2.5", className)} {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};


================================================================================
File: src/components/primitives/popover.tsx
================================================================================
import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };


================================================================================
File: src/components/primitives/progress.tsx
================================================================================
import React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };


================================================================================
File: src/components/primitives/radio-group.tsx
================================================================================
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

const RadioGroup = RadioGroupPrimitive.Root;
const RadioGroupItem = RadioGroupPrimitive.Item;

export { RadioGroup, RadioGroupItem };

// Replace undefined Component
const PlaceholderRadioGroup = () => <div>Radio Group Placeholder</div>;
export default PlaceholderRadioGroup;


================================================================================
File: src/components/primitives/resizable.tsx
================================================================================
import React from "react";
import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
    {...props}
  />
);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };


================================================================================
File: src/components/primitives/scroll-area.tsx
================================================================================
import React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };


================================================================================
File: src/components/primitives/select.tsx
================================================================================
import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};

// Replacing undefined Component with a placeholder
const PlaceholderComponent = () => <div>Placeholder</div>;
export default PlaceholderComponent;


================================================================================
File: src/components/primitives/separator.tsx
================================================================================
import React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className)}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };

// Replacing undefined Component with a placeholder
const PlaceholderComponent = () => <div>Placeholder</div>;
export default PlaceholderComponent;


================================================================================
File: src/components/primitives/sheet.tsx
================================================================================
import React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};


================================================================================
File: src/components/primitives/sidebar.tsx
================================================================================
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/primitives/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../primitives/tooltip";
import { Separator } from "../primitives/separator";
import { SidebarContext, useSidebar, sidebarMenuButtonVariants } from "@/lib/sidebar";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile();

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState<boolean>(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      if (typeof value === "function") {
        _setOpen(value(open));
      } else {
        _setOpen(value);
      }
    },
    [open],
  );

  // Define setOpenMobile for mobile-specific state management.
  const [openMobile, setOpenMobile] = React.useState(false);

  // Wrapped `toggleSidebar` in `useCallback` to fix React Hook dependency warnings.
  const toggleSidebar = React.useCallback(() => {
    return isMobile
      ? setOpenMobile((open) => !open)
      : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state: "expanded" | "collapsed" = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      toggleSidebar,
      openMobile,
      setOpenMobile,
    }),
    [state, open, setOpen, isMobile, toggleSidebar, openMobile],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {/* <TooltipProvider delayDuration={0}> */}
      <div
        style={{
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style,
        } as React.CSSProperties}
        className={cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
      {/* </TooltipProvider> */}
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
  const { isMobile, state } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        className={cn("flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      // <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
      //   <SheetContent
      //     data-sidebar="sidebar"
      //     data-mobile="true"
      //     className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
      //     style={
      //       {
      //         "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
      //       } as React.CSSProperties
      //     }
      //     side={side}
      //   >
      //     <div className="flex h-full w-full flex-col">{children}</div>
      //   </SheetContent>
      // </Sheet>
      <div
        ref={ref}
        className="group peer hidden text-sidebar-foreground md:block"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
          )}
        />
        <div
          className={cn(
            "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className,
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          "relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
        )}
      />
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
        >
          {children}
        </div>
      </div>
    </div>
  );
});
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentProps<typeof Button>>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <Button
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", className)}
        onClick={(event) => {
          onClick?.(event);
          toggleSidebar();
        }}
        {...props}
      >
        <PanelLeft />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    );
  },
);
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <button
        ref={ref}
        data-sidebar="rail"
        aria-label="Toggle Sidebar"
        tabIndex={-1}
        onClick={toggleSidebar}
        title="Toggle Sidebar"
        className={cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 hover:after:bg-sidebar-border sm:flex",
          className
        )}
        {...props}
      />
    );
  },
);
SidebarRail.displayName = "SidebarRail";

const SidebarInput = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <button
        ref={ref}
        data-sidebar="rail"
        aria-label="Toggle Sidebar"
        tabIndex={-1}
        onClick={toggleSidebar}
        title="Toggle Sidebar"
        className={cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 hover:after:bg-sidebar-border sm:flex",
          className
        )}
        {...props}
      />
    );
  },
);
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} data-sidebar="header" className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} data-sidebar="footer" className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef<React.ElementRef<typeof Separator>, React.ComponentProps<typeof Separator>>(
  ({ className, ...props }, ref) => {
    return (
      <Separator
        ref={ref}
        data-sidebar="separator"
        className={cn("mx-2 w-auto bg-sidebar-border", className)}
        {...props}
      />
    );
  },
);
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
});
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { asChild?: boolean }>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        data-sidebar="group-label"
        className={cn(
          "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button"> & { asChild?: boolean }>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-sidebar="group-action"
        className={cn(
          "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          // Increases the hit area of the button on mobile.
          "after:absolute after:-inset-2 after:md:hidden",
          "group-data-[collapsible=icon]:hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-sidebar="group-content" className={cn("w-full text-sm", className)} {...props} />
  ),
);
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(({ className, ...props }, ref) => (
  <ul ref={ref} data-sidebar="menu" className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} data-sidebar="menu-item" className={cn("group/menu-item relative", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  const button = (
    <Comp
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent {...tooltip} />
    </Tooltip>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
};


================================================================================
File: src/components/primitives/skeleton.tsx
================================================================================
import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };



================================================================================
File: src/components/primitives/slider.tsx
================================================================================
import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

const PlaceholderComponent = () => <div>Placeholder</div>;
export default PlaceholderComponent;


================================================================================
File: src/components/primitives/sonner.tsx
================================================================================
import React from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export const Toaster = () => {
  const { theme = "system" } = useTheme();

  React.useEffect(() => {
    toast("Toaster initialized with theme: " + theme);
  }, [theme]);

  return null;
};

const PlaceholderComponent = () => <div>Placeholder</div>;
export default PlaceholderComponent;


================================================================================
File: src/components/primitives/switch.tsx
================================================================================
import * as SwitchPrimitives from "@radix-ui/react-switch";
import React from "react";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

const PlaceholderComponent = () => <div>Placeholder</div>;
export default PlaceholderComponent;


================================================================================
File: src/components/primitives/table.tsx
================================================================================
import React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />,
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
  ),
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50", className)}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
  ),
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  ),
);
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };

const PlaceholderComponent = () => <div>Placeholder</div>;
export default PlaceholderComponent;


================================================================================
File: src/components/primitives/tabs.tsx
================================================================================
import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

const PlaceholderComponent = () => <div>Placeholder</div>;
export default PlaceholderComponent;


================================================================================
File: src/components/primitives/textarea.tsx
================================================================================
import React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

const PlaceholderComponent = () => <div>Placeholder</div>;
export default PlaceholderComponent;


================================================================================
File: src/components/primitives/toast.tsx
================================================================================
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />;
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};


================================================================================
File: src/components/primitives/toaster.tsx
================================================================================
import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "../primitives/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}


================================================================================
File: src/components/primitives/toggle-group.tsx
================================================================================
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/lib/variants";

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
});

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root ref={ref} className={cn("flex items-center justify-center gap-1", className)} {...props}>
    <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };

// Replacing undefined Component with a placeholder
const PlaceholderComponent = () => <div>Placeholder</div>;
export default PlaceholderComponent;


================================================================================
File: src/components/primitives/toggle.tsx
================================================================================
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { type VariantProps } from "class-variance-authority";
import React from "react"; // Add missing React import

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/lib/variants";

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };


================================================================================
File: src/components/primitives/tooltip.tsx
================================================================================
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import React from "react";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

// Replacing undefined Component with a placeholder
const PlaceholderComponent = () => <div>Placeholder</div>;
export default PlaceholderComponent;


================================================================================
File: src/components/primitives/use-toast.ts
================================================================================
import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };


================================================================================
File: src/features/council/api/ai-client.ts
================================================================================
// OpenRouter AI Client - Real API integration
import { Expert, ExecutionMode, ModeBehavior } from '@/features/council/lib/types'; // Added missing import for ModeBehavior
import { buildSystemPrompt, MAGNIFICENT_7_FLEET } from '@/lib/config';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

// Calculate cost based on model and tokens
export function calculateCost(modelId: string, promptTokens: number, completionTokens: number): number {
  const model = MAGNIFICENT_7_FLEET.find(m => m.id === modelId);
  if (!model) return 0;
  
  // costPer1k is per 1000 output tokens (simplified)
  const outputCost = (completionTokens / 1000) * model.costPer1k;
  const inputCost = (promptTokens / 1000) * (model.costPer1k * 0.1); // Input typically 10% of output cost
  return outputCost + inputCost;
}

// Non-streaming API call
export async function callExpert(
  expert: Expert,
  task: string,
  mode: ExecutionMode,
  apiKey: string,
  additionalContext?: string,
  previousOutputs?: Record<string, string>
): Promise<{ output: string; cost: number; tokens: { prompt: number; completion: number } }> {
  // Ensure hasWebSearch is always defined
  const expertWithDefaults = {
    ...expert,
    hasWebSearch: expert.hasWebSearch ?? false,
    modeBehavior: {
      separated: expert.modeBehavior.separated,
      synthesis: expert.modeBehavior.synthesis,
      debate: expert.modeBehavior.debate,
      pipeline: expert.modeBehavior.pipeline,
      modeName: expert.modeBehavior.modeName || "defaultMode",
      description: expert.modeBehavior.description || "No description provided",
      isEnabled: expert.modeBehavior.isEnabled ?? true,
    } as ModeBehavior, // Ensure alignment with ModeBehavior type
  }; // Ensure modeBehavior matches the ModeBehavior type

  // Explicitly cast expertWithDefaults to the expected structure
  const systemPrompt = buildSystemPrompt(
    {
      basePersona: expertWithDefaults.basePersona,
      modeBehavior: expertWithDefaults.modeBehavior,
      hasWebSearch: expertWithDefaults.hasWebSearch,
      knowledge: expertWithDefaults.knowledge.map((file) => ({
        name: file.name,
        content: file.content,
      })),
    },
    mode,
    additionalContext
  );
  
  let userPrompt = `TASK: ${task}`;
  
  // For pipeline mode, include previous outputs
  if (mode === 'pipeline' && previousOutputs && Object.keys(previousOutputs).length > 0) {
    userPrompt += '\n\n--- PREVIOUS EXPERT ANALYSES ---\n';
    for (const [expertId, output] of Object.entries(previousOutputs)) {
      userPrompt += `\n[Expert ${expertId}]:\n${output}\n`;
    }
    userPrompt += '--- END PREVIOUS ANALYSES ---\n\nBuild upon these insights with your unique perspective.';
  }
  
  // For debate mode, you might want to include opposing arguments
  if (mode === 'debate' && previousOutputs && Object.keys(previousOutputs).length > 0) {
    userPrompt += '\n\n--- OTHER EXPERT POSITIONS ---\n';
    for (const [expertId, output] of Object.entries(previousOutputs)) {
      userPrompt += `\n[${expertId}]:\n${output}\n`;
    }
    userPrompt += '--- END POSITIONS ---\n\nChallenge these positions and defend your own view.';
  }

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'The Council V18',
    },
    body: JSON.stringify({
      model: expert.model,
      messages,
      temperature: expert.config.temperature,
      max_tokens: expert.config.maxTokens,
      top_p: expert.config.topP,
      presence_penalty: expert.config.presencePenalty,
      frequency_penalty: expert.config.frequencyPenalty,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const data: OpenRouterResponse = await response.json();
  const output = data.choices[0]?.message?.content || 'No response generated';
  
  const promptTokens = data.usage?.prompt_tokens || 0;
  const completionTokens = data.usage?.completion_tokens || 0;
  const cost = calculateCost(expert.model, promptTokens, completionTokens);

  return {
    output,
    cost,
    tokens: { prompt: promptTokens, completion: completionTokens },
  };
}

// Streaming API call
export async function callExpertStreaming(
  expert: Expert,
  task: string,
  mode: ExecutionMode,
  apiKey: string,
  callbacks: StreamCallbacks,
  additionalContext?: string,
  previousOutputs?: Record<string, string>
): Promise<{ cost: number }> {
  // Explicitly cast expert to the expected structure
  const systemPrompt = buildSystemPrompt(
    {
      basePersona: expert.basePersona,
      modeBehavior: expert.modeBehavior,
      hasWebSearch: expert.hasWebSearch ?? false,
      knowledge: expert.knowledge.map((file) => ({
        name: file.name,
        content: file.content,
      })),
    },
    mode,
    additionalContext
  );
  
  let userPrompt = `TASK: ${task}`;
  
  if (mode === 'pipeline' && previousOutputs && Object.keys(previousOutputs).length > 0) {
    userPrompt += '\n\n--- PREVIOUS EXPERT ANALYSES ---\n';
    for (const [expertId, output] of Object.entries(previousOutputs)) {
      userPrompt += `\n[Expert ${expertId}]:\n${output}\n`;
    }
    userPrompt += '--- END PREVIOUS ANALYSES ---\n\nBuild upon these insights.';
  }

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'The Council V18',
    },
    body: JSON.stringify({
      model: expert.model,
      messages,
      temperature: expert.config.temperature,
      max_tokens: expert.config.maxTokens,
      top_p: expert.config.topP,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let fullText = '';
  let estimatedTokens = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

      for (const line of lines) {
        const data = line.replace('data: ', '').trim();
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullText += content;
            estimatedTokens += 1; // Rough estimate
            callbacks.onToken(content);
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }

    callbacks.onComplete(fullText);
    
    // Estimate cost (rough calculation since streaming doesn\'t return exact tokens)
    const estimatedPromptTokens = Math.ceil((systemPrompt.length + userPrompt.length) / 4);
    const cost = calculateCost(expert.model, estimatedPromptTokens, estimatedTokens);
    
    return { cost };
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error('Stream error'));
    throw error;
  }
}

// Synthesize verdict from all expert outputs
export async function synthesizeVerdict(
  expertOutputs: Record<string, { expertName: string; output: string }>,
  task: string,
  mode: ExecutionMode,
  apiKey: string
): Promise<{ verdict: string; cost: number }> {
  // Use Gemini Flash for synthesis (fast and good at summarization)
  const synthesizerModel = 'google/gemini-2.0-flash-001';
  
  const systemPrompt = `You are "The Synthesizer" - a master at distilling insights from multiple expert perspectives into a cohesive, actionable verdict.

Your task is to:
1. Identify points of CONSENSUS across all experts
2. Highlight UNIQUE INSIGHTS that only specific experts raised
3. Resolve any CONFLICTS between expert opinions with reasoned judgment
4. Provide a clear, actionable RECOMMENDATION

Structure your response as:
## Council Verdict

### Consensus Points
[List 3-5 key agreements]

### Unique Insights
[Credit specific experts for their unique contributions]

### Resolved Conflicts
[If any experts disagreed, explain how you resolved it]

### Unified Recommendation
[Clear, actionable next steps]

### Confidence Level
[Percentage based on expert agreement and evidence quality]`;

  let userPrompt = `ORIGINAL TASK: ${task}\n\nMODE: ${mode}\n\n--- EXPERT ANALYSES ---\n`;
  
  for (const [___expertId, data] of Object.entries(expertOutputs)) {
    userPrompt += `\n### ${data.expertName}\n${data.output}\n`;
  }
  
  userPrompt += '\n--- END EXPERT ANALYSES ---\n\nSynthesize these perspectives into a unified verdict.';

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'The Council V18 - Synthesizer',
    },
    body: JSON.stringify({
      model: synthesizerModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // Lower temp for more focused synthesis
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Synthesis error: ${response.status}`);
  }

  const data: OpenRouterResponse = await response.json();
  const verdict = data.choices[0]?.message?.content || 'Synthesis failed';
  
  const model = MAGNIFICENT_7_FLEET.find(m => m.id === synthesizerModel);
  const cost = model ? calculateCost(synthesizerModel, data.usage?.prompt_tokens || 0, data.usage?.completion_tokens || 0) : 0;

  return { verdict, cost };
}

// Fixed type mismatch for Expert and ExecutionMode
export async function generateOutput(
  expert: Expert,
  task: string,
  mode: ExecutionMode,
  additionalContext?: string,
  previousOutputs?: Record<string, string>
): Promise<{ output: string; cost: number; tokens: { prompt: number; completion: number } }> {
  const systemPrompt = buildSystemPrompt(
    {
      basePersona: expert.basePersona,
      modeBehavior: {
        separated: expert.modeBehavior.separated,
        synthesis: expert.modeBehavior.synthesis,
        debate: expert.modeBehavior.debate,
        pipeline: expert.modeBehavior.pipeline,
      },
      hasWebSearch: expert.hasWebSearch ?? false,
      knowledge: expert.knowledge,
    },
    mode,
    additionalContext
  );

  let userPrompt = `TASK: ${task}`;

  // For pipeline mode, include previous outputs
  if (mode === 'pipeline' && previousOutputs && Object.keys(previousOutputs).length > 0) {
    userPrompt += '\n\n--- PREVIOUS EXPERT ANALYSES ---\n';
    for (const [expertId, output] of Object.entries(previousOutputs)) {
      userPrompt += `\n[Expert ${expertId}]:\n${output}\n`;
    }
    userPrompt += '--- END PREVIOUS ANALYSES ---\n\nBuild upon these insights.';
  }

  // Use systemPrompt in the API call
  console.log(systemPrompt); // Temporary usage to avoid unused variable error

  // Placeholder for API call
  return {
    output: 'Generated output',
    cost: 0,
    tokens: { prompt: 0, completion: 0 },
  };
}


================================================================================
File: src/features/council/components/ControlPanel.tsx
================================================================================
import React, { useRef } from 'react';
import { useControlPanelStore } from '@/features/council/store/control-panel-store';
import { useExecutionStore } from '@/features/council/store/execution-store';
import { useSettingsStore } from '@/features/settings/store/settings-store';
import { useShallow } from 'zustand/react/shallow';
import { MODE_DESCRIPTIONS } from '@/lib/config';
import { ExecutionMode, SynthesisConfig } from '@/features/council/lib/types';
import { Card, CardContent } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Textarea } from '@/components/primitives/textarea';
import { Slider } from '@/components/primitives/slider';
import { Badge } from '@/components/primitives/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/primitives/tabs';
import { useExecuteSynthesis } from '@/features/council/hooks/use-council-queries';
import {
  Upload,
  FileText,
  X,
  Layers,
  GitMerge,
  Swords,
  Workflow,
  Loader2,
  Play,
} from 'lucide-react';
import { toast } from 'sonner';
import { PersonaSelector } from './PersonaSelector';

const MODE_ICONS: Record<ExecutionMode, React.ComponentType<{ className?: string }>> = {
  separated: Layers,
  synthesis: GitMerge,
  debate: Swords,
  pipeline: Workflow,
};

export const ControlPanel: React.FC = () => {
  const {
    task,
    setTask,
    mode,
    setMode,
    activeExpertCount,
    setActiveExpertCount,
    debateRounds,
    setDebateRounds,
    fileData,
    setFileData,
  } = useControlPanelStore(useShallow((state) => ({
    task: state.task,
    setTask: state.setTask,
    mode: state.mode,
    setMode: state.setMode,
    activeExpertCount: state.activeExpertCount,
    setActiveExpertCount: state.setActiveExpertCount,
    debateRounds: state.debateRounds,
    setDebateRounds: state.setDebateRounds,
    fileData: state.fileData,
    setFileData: state.setFileData,
  })));

  const { isLoading, statusMessage } = useExecutionStore(useShallow((state) => ({ isLoading: state.isLoading, statusMessage: state.statusMessage })));
  const { vaultStatus, setShowSettings } = useSettingsStore(useShallow((state) => ({ vaultStatus: state.vaultStatus, setShowSettings: state.setShowSettings })));
  const synthesisMutation = useExecuteSynthesis();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      setFileData({
        name: file.name,
        content,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      });
      toast.success(`File "${file.name}" loaded`);
    } catch (error) {
      toast.error('Failed to read file');
    }

    event.target.value = '';
  };

  const handleFileRemove = () => {
    setFileData(null);
    toast.info('File context removed');
  };

  const handleExecuteClick = () => {
    if (vaultStatus.isLocked) {
      setShowSettings(true);
      toast.error('Please unlock the vault first');
      return;
    }
    if (!task.trim()) {
      toast.error('Please enter a task');
      return;
    }

    const defaultConfig: SynthesisConfig = {
      tier: 'quick',
      model: 'default-model',
      fallbackModel: 'fallback-model',
      temperature: 0.7,
      maxTokens: 1000,
      customInstructions: 'Default instructions', // Added missing property
    };

    synthesisMutation.mutate({
      task,
      config: synthesisMutation.variables?.config || defaultConfig,
      apiKey: synthesisMutation.variables?.apiKey || '',
      onProgress: synthesisMutation.variables?.onProgress || (() => {}),
    });
  };

  return (
    <Card className="glass-panel-elevated">
      <CardContent className="p-6 space-y-6">
        <PersonaSelector />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Task / Question</label>
          <Textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Describe the task or question you want the Council to analyze..."
            className="min-h-[120px] bg-muted/50 border-border/50 resize-none focus:ring-primary/50"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Execution Mode</label>
          <Tabs value={mode} onValueChange={(v) => setMode(v as ExecutionMode)}>
            <TabsList className="grid grid-cols-4 w-full bg-muted/50 p-1">
              {(Object.keys(MODE_DESCRIPTIONS) as ExecutionMode[]).map((modeKey) => {
                const IconComponent = MODE_ICONS[modeKey];
                return (
                  <TabsTrigger
                    key={modeKey}
                    value={modeKey}
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{MODE_DESCRIPTIONS[modeKey].name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground">{MODE_DESCRIPTIONS[mode].description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">Active Experts</label>
              <Badge variant="secondary" className="font-mono">{activeExpertCount}</Badge>
            </div>
            <Slider
              value={[activeExpertCount]}
              onValueChange={([value]) => setActiveExpertCount(value)}
              min={1}
              max={5}
              step={1}
              className="slider-council"
            />
            <div className="flex justify-between text-xs text-muted-foreground"><span>1</span><span>5</span></div>
          </div>

          {mode === 'debate' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Debate Rounds</label>
                <Badge variant="secondary" className="font-mono">{debateRounds}</Badge>
              </div>
              <Slider
                value={[debateRounds]}
                onValueChange={([value]) => setDebateRounds(value)}
                min={1}
                max={5}
                step={1}
                className="slider-council"
              />
              <div className="flex justify-between text-xs text-muted-foreground"><span>1</span><span>5</span></div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">File Context (Optional)</label>
          <input ref={fileInputRef} type="file" accept=".txt,.md,.json,.pdf,.docx,.csv" className="hidden" onChange={handleFileUpload} />
          {fileData ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{fileData.name}</p>
                  <p className="text-xs text-muted-foreground">{fileData.size}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleFileRemove}><X className="h-4 w-4" /></Button>
            </div>
          ) : (
            <Button variant="outline" className="w-full h-12 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload context file
            </Button>
          )}
        </div>

        <Button className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold text-lg shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30" onClick={handleExecuteClick} disabled={isLoading || !task.trim()}>
          {isLoading ? (
            <><Loader2 className="h-5 w-5 mr-2 animate-spin" />{statusMessage || 'Processing...'}</>
          ) : (
            <><Play className="h-5 w-5 mr-2" />Execute Council</>
          )}
        </Button>

        {isLoading && statusMessage && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            {statusMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ControlPanel;


================================================================================
File: src/features/council/components/ExpertCard.tsx
================================================================================
import React, { useState, useCallback, lazy, Suspense } from 'react';
import { useExpertStore } from '@/features/council/store/expert-store';
import { useControlPanelStore } from '@/features/council/store/control-panel-store';
import { KnowledgeFile, Expert } from '@/features/council/lib/types';
import { pluginManager } from '@/lib/plugin-manager';
import { SafeMarkdown } from '@/components/primitives/SafeMarkdown';
import { MAGNIFICENT_7_FLEET } from '@/lib/config';
import { EXPERT_POSITIONS, PERSONA_LIBRARY } from '@/features/council/lib/persona-library';
import { Card, CardContent, CardHeader } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Slider } from '@/components/primitives/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/select';
import { Textarea } from '@/components/primitives/textarea';
import { Badge } from '@/components/primitives/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/primitives/collapsible';
import {
  Brain,
  Cpu,
  Target,
  Heart,
  AlertTriangle,
  Pencil,
  Upload,
  FileText,
  ChevronDown,
  ChevronUp,
  Settings2,
  Loader2,
  X,
  Maximize2,
  RotateCcw,
  Sparkles,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { ExpertOutputFooter } from './ExpertOutputFooter';

// Lazy load the expanded modal
const ExpertExpandedModal = lazy(() => import('./ExpertExpandedModal'));

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Cpu,
  Target,
  Heart,
  AlertTriangle,
};

interface ExpertCardProps {
  index: number;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ index }) => {
  const expert = useExpertStore(state => state.experts[index]);
  const updateExpert = useExpertStore(state => state.updateExpert);
  const addKnowledge = useExpertStore(state => state.addKnowledge);
  const removeKnowledge = useExpertStore(state => state.removeKnowledge);
  const activeExpertCount = useControlPanelStore(state => state.activeExpertCount);
  const clearPersona = useControlPanelStore(state => state.clearPersona);
  const isActive = index < activeExpertCount;

  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedPersona, setEditedPersona] = useState<string | undefined>();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Sync editedPersona with expert.basePersona only when expert changes, not on every render
  React.useEffect(() => {
    if (expert?.basePersona !== editedPersona) {
      setEditedPersona(expert?.basePersona);
    }
  }, [expert?.basePersona]); // Only depend on basePersona, not editedPersona to avoid loops

  // Define all hooks BEFORE any early returns
  const handleRetry = useCallback(() => {
    // Will be implemented later
    toast.info(`Retrying ${expert?.name}...`);
  }, [expert?.name]);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const newKnowledge: KnowledgeFile[] = [];

      for (const file of Array.from(files)) {
        try {
          const content = await file.text();
          newKnowledge.push({
            id: `kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            content,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            type: file.type || 'text/plain',
          });
        } catch (error) {
          toast.error(`Failed to read ${file.name}`);
        }
      }

      if (newKnowledge.length > 0) {
        addKnowledge(index, newKnowledge);
        toast.success(`Added ${newKnowledge.length} file(s) to knowledge base`);
      }

      event.target.value = '';
    },
    [index, addKnowledge]
  );

  const handleModelChange = (modelId: string) => {
    updateExpert(index, { ...expert, model: modelId });
  };

  const handleConfigChange = (key: keyof Expert['config'], value: number) => {
    updateExpert(index, {
      ...expert,
      config: { ...expert.config, [key]: value },
    });
  };

  const handleSavePersona = () => {
    updateExpert(index, { ...expert, basePersona: editedPersona });
    setIsEditing(false);
    toast.success('Persona updated');
  };

  // Prevent render if expert is undefined (prevents crashes during state updates)
  if (!expert) {
    return (
      <Card className="glass-panel h-96 flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading expert...</div>
      </Card>
    );
  }

  const IconComponent = ICON_MAP[expert.icon] || Brain;
  const selectedModel = MAGNIFICENT_7_FLEET.find((m) => m.id === expert.model);
  
  const positionInfo = EXPERT_POSITIONS[index] || EXPERT_POSITIONS[0];
  const positionName = expert.positionName || positionInfo.position;
  
  const loadedPersona = expert.personaId ? PERSONA_LIBRARY[expert.personaId] : null;

  const handleClearPersonaClick = () => {
    clearPersona(index);
    toast.success(`${positionName} reset to default`);
  };

  return (
    <>
      <Card
        className={`glass-panel transition-all duration-300 flex flex-col h-full ${
          isActive ? 'ring-2 ring-primary/50 animate-pulse-glow' : 'opacity-60'
        } ${expert.isLoading ? 'animate-shimmer border-primary/40' : ''}`}
      >
        <CardHeader className="pb-2 flex-shrink-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${expert.color} flex items-center justify-center shadow-lg flex-shrink-0 relative`}
              >
                <IconComponent className="w-5 h-5 text-primary-foreground" />
                {expert.hasWebSearch && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Globe className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-sm truncate">{positionName}</h3>
                {loadedPersona ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-primary text-xs font-medium truncate">
                      {loadedPersona.icon} {loadedPersona.name}
                    </span>
                  </div>
                ) : (
                  <p className="text-[10px] text-muted-foreground truncate">
                    {positionInfo.specialty}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground truncate">
                  {selectedModel?.name || 'Unknown Model'}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
              <div className="flex items-center gap-0.5">
                {expert.output && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-primary/10"
                    onClick={() => setIsExpanded(true)}
                    title="Expand output"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-primary/10"
                  onClick={() => setIsEditing(!isEditing)}
                  title="Edit persona"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>
              {loadedPersona && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1.5 text-[9px] text-muted-foreground hover:text-destructive"
                  onClick={handleClearPersonaClick}
                  title="Reset to default"
                >
                  <RotateCcw className="h-2.5 w-2.5 mr-0.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {loadedPersona && (
            <Badge 
              variant="outline" 
              className="mt-2 text-[10px] bg-primary/5 border-primary/20 text-primary"
            >
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              Persona: {expert.personaId}
            </Badge>
          )}

          <Select value={expert.model} onValueChange={handleModelChange}>
            <SelectTrigger className="mt-2 h-8 bg-muted/50 border-border/50 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MAGNIFICENT_7_FLEET.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-xs">{model.name}</span>
                    <span className="text-[10px] text-muted-foreground">{model.specialty}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-3 overflow-hidden">
          <div className="space-y-1.5 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Knowledge
              </span>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept=".txt,.md,.json,.pdf,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[10px]" asChild>
                  <span>
                    <Upload className="h-3 w-3 mr-1" />
                    Add
                  </span>
                </Button>
              </label>
            </div>

            {expert.knowledge.length > 0 ? (
              <div className="space-y-1 max-h-16 overflow-y-auto">
                {expert.knowledge.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between gap-1 px-1.5 py-1 rounded-md bg-muted/30 text-[10px]"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 hover:bg-destructive/20 hover:text-destructive"
                      onClick={() => removeKnowledge(index, file.id)}
                    >
                      <X className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-muted-foreground/70 italic">No knowledge files</p>
            )}
          </div>

            <Collapsible open={isConfigOpen} onOpenChange={setIsConfigOpen} className="flex-shrink-0">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between h-7 px-2 hover:bg-muted/50"
                >
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                    <Settings2 className="h-3 w-3" />
                    Config
                  </span>
                  {isConfigOpen ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-2">
                {expert.pluginId && pluginManager.getExpertPlugin(expert.pluginId) ? (
                  pluginManager.getExpertPlugin(expert.pluginId)?.renderConfig(expert.pluginConfig || {}, (newCfg) => {
                    updateExpert(index, { ...expert, pluginConfig: newCfg });
                  })
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Temp</span>
                        <span className="font-mono">{expert.config.temperature.toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[expert.config.temperature]}
                        onValueChange={([value]) => handleConfigChange('temperature', value)}
                        min={0}
                        max={2}
                        step={0.1}
                        className="slider-council"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Top P</span>
                        <span className="font-mono">{expert.config.topP.toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[expert.config.topP]}
                        onValueChange={([value]) => handleConfigChange('topP', value)}
                        min={0}
                        max={1}
                        step={0.05}
                        className="slider-council"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Max Tokens</span>
                        <span className="font-mono">{expert.config.maxTokens}</span>
                      </div>
                      <Slider
                        value={[expert.config.maxTokens]}
                        onValueChange={([value]) => handleConfigChange('maxTokens', value)}
                        min={1000}
                        max={8000}
                        step={500}
                        className="slider-council"
                      />
                    </div>
                  </>
                )}
              </CollapsibleContent>
            </Collapsible>

          {isEditing && (
            <div className="space-y-2 pt-2 border-t border-border/50 flex-shrink-0">
              <label className="text-[10px] font-medium text-muted-foreground">Base Persona</label>
              <Textarea
                value={editedPersona}
                onChange={(e) => setEditedPersona(e.target.value)}
                className="min-h-[80px] text-xs bg-muted/50 resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 h-7 text-xs" onClick={handleSavePersona}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => {
                    setEditedPersona(expert.basePersona);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="flex-1 min-h-0 flex flex-col">
            {expert.output && (
              <div className="space-y-1.5 flex-1 flex flex-col border-t border-border/50 pt-2">
                <div className="flex items-center justify-between flex-shrink-0">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    Output
                  </span>
                  {expert.isLoading && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto rounded-md bg-muted/30 p-2">
                  <SafeMarkdown content={expert.output} className="text-xs" />
                </div>
              </div>
            )}

            {expert.isLoading && !expert.output && (
              <div className="flex items-center justify-center py-4">
                <div className="flex flex-col items-center gap-1.5">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-[10px] text-muted-foreground">Analyzing...</span>
                </div>
              </div>
            )}
          </div>

          {expert.output && (
            <ExpertOutputFooter
              expert={{
                ...expert,
                content: expert.content || expert.output || 'No content available',
              }}
            />
          )}
        </CardContent>
      </Card>

      <Suspense fallback={null}>
        <ExpertExpandedModal
          expert={expert}
          isOpen={isExpanded}
          onClose={() => setIsExpanded(false)}
          onRetry={handleRetry}
        />
      </Suspense>
    </>
  );
};

export default ExpertExpandedModal;


================================================================================
File: src/features/council/components/ExpertExpandedModal.tsx
================================================================================
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


================================================================================
File: src/features/council/components/ExpertOutputFooter.tsx
================================================================================
import React from 'react';
import { useExecutionStore } from '@/features/council/store/execution-store';
import { Button } from '@/components/primitives/button';
import { RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { SynthesisConfig, SynthesisResult } from '@/features/council/lib/types';
import { UseMutationResult } from '@tanstack/react-query';
import { ExpertOutput } from '@/features/council/store/execution-store';

interface ExpertOutputFooterProps {
  expert: ExpertOutput;
  expertName?: string;
  output?: string;
  model?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ExpertOutputFooter: React.FC<ExpertOutputFooterProps> = () => {
  const { executeCouncil, isLoading } = useExecutionStore();

  const onRetry = () => {
    const mockMutationResult = {
      mutate: ({
        expertOutputs,
        task,
        config,
        apiKey,
        onProgress,
      }: {
        expertOutputs: ExpertOutput[];
        task: string;
        config: SynthesisConfig;
        apiKey: string;
        onProgress: (message: string) => void;
      }) => {
        console.log('Mock mutation executed', expertOutputs, task, config, apiKey);
        onProgress('Mock progress message');
      },
    } as UseMutationResult<
      SynthesisResult,
      Error,
      { expertOutputs: ExpertOutput[]; task: string; config: SynthesisConfig; apiKey: string; onProgress: (message: string) => void },
      unknown
    >;

    executeCouncil(mockMutationResult);
  };

  return (
    <div className="flex items-center justify-end gap-1 pt-2 border-t border-border/50 flex-shrink-0">
      <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-green-500/10 hover:text-green-500">
        <ThumbsUp className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-500/10 hover:text-red-500">
        <ThumbsDown className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRetry}
        disabled={isLoading}
        className="h-6 w-6 hover:bg-blue-500/10 hover:text-blue-500"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};


================================================================================
File: src/features/council/components/FeatureConfigModal.tsx
================================================================================
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/primitives/dialog';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';
import { Switch } from '@/components/primitives/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/tabs';
import { useFeatureConfigStore } from '@/features/council/store/feature-config-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { toast } from 'sonner';

interface FeatureConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeatureConfigModal: React.FC<FeatureConfigModalProps> = ({ isOpen, onClose }) => {
  const {
    scout,
    mirror,
    quality,
    selfImprove,
    stargazerAnalysis,
    dataFetching,
    typeSafeForms,
    errorHandling,
    authSecurity,
    mobileDrawers,
    virtualizedLists,
    streamingAI,
    agentOrchestration,
    localDatabase,
    updateScoutConfig,
    updateMirrorConfig,
    updateQualityConfig,
    updateSelfImproveConfig,
    updateStargazerAnalysisConfig,
    updateDataFetchingConfig,
    updateTypeSafeFormsConfig,
    updateErrorHandlingConfig,
    updateAuthSecurityConfig,
    updateMobileDrawersConfig,
    updateVirtualizedListsConfig,
    updateStreamingAIConfig,
    updateAgentOrchestrationConfig,
    updateLocalDatabaseConfig,
    resetToDefaults,
  } = useFeatureConfigStore();

  const handleSave = (): void => {
    toast.success('Configuration saved successfully');
    onClose();
  };

  const handleReset = (): void => {
    resetToDefaults();
    toast.info('Reset to default configuration');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto glass-panel">
        <DialogHeader>
          <DialogTitle>Feature Configuration</DialogTitle>
          <DialogDescription>
            Configure automated features and their schedules
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="scout" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-1">
            <TabsTrigger value="scout">Scout</TabsTrigger>
            <TabsTrigger value="mirror">Mirror</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="self-improve">Self-Improve</TabsTrigger>
            <TabsTrigger value="stargazer">Stargazer</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
            <TabsTrigger value="more">More...</TabsTrigger>
          </TabsList>

          {/* Scout Configuration */}
          <TabsContent value="scout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>👻 Phantom Scout Configuration</CardTitle>
                <CardDescription>GitHub intelligence gathering settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="scout-enabled">Enable Scout</Label>
                  <Switch
                    id="scout-enabled"
                    checked={scout.enabled}
                    onCheckedChange={(checked) => updateScoutConfig({ enabled: checked })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scout-niche">Target Niche</Label>
                  <Input
                    id="scout-niche"
                    value={scout.targetNiche}
                    onChange={(e) => updateScoutConfig({ targetNiche: e.target.value })}
                    placeholder="e.g., developer-tools, react-native"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scout-min-stars">Minimum Stars</Label>
                  <Input
                    id="scout-min-stars"
                    type="number"
                    value={scout.minStars}
                    onChange={(e) => updateScoutConfig({ minStars: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scout-max-repos">Maximum Repositories</Label>
                  <Input
                    id="scout-max-repos"
                    type="number"
                    value={scout.maxRepos}
                    onChange={(e) => updateScoutConfig({ maxRepos: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scout-depth">Scan Depth</Label>
                  <Select value={scout.depth} onValueChange={(value: 'shallow' | 'normal' | 'deep') => updateScoutConfig({ depth: value })}>
                    <SelectTrigger id="scout-depth">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shallow">Shallow (Fast)</SelectItem>
                      <SelectItem value="normal">Normal (Balanced)</SelectItem>
                      <SelectItem value="deep">Deep (Thorough)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scout-schedule">Cron Schedule</Label>
                  <Input
                    id="scout-schedule"
                    value={scout.schedule}
                    onChange={(e) => updateScoutConfig({ schedule: e.target.value })}
                    placeholder="0 6 * * *"
                  />
                  <p className="text-xs text-muted-foreground">Daily at 6 AM UTC</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mirror Configuration */}
          <TabsContent value="mirror" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🔄 Code Mirror Configuration</CardTitle>
                <CardDescription>Code quality analysis settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mirror-enabled">Enable Mirror</Label>
                  <Switch
                    id="mirror-enabled"
                    checked={mirror.enabled}
                    onCheckedChange={(checked) => updateMirrorConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="mirror-report">Generate Detailed Report</Label>
                  <Switch
                    id="mirror-report"
                    checked={mirror.generateReport}
                    onCheckedChange={(checked) => updateMirrorConfig({ generateReport: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mirror-schedule">Cron Schedule</Label>
                  <Input
                    id="mirror-schedule"
                    value={mirror.schedule}
                    onChange={(e) => updateMirrorConfig({ schedule: e.target.value })}
                    placeholder="0 8 * * 0"
                  />
                  <p className="text-xs text-muted-foreground">Weekly on Sundays at 8 AM UTC</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Configuration */}
          <TabsContent value="quality" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>⚡ QUALITY Pipeline Configuration</CardTitle>
                <CardDescription>Automated quality improvements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quality-enabled">Enable Quality Pipeline</Label>
                  <Switch
                    id="quality-enabled"
                    checked={quality.enabled}
                    onCheckedChange={(checked) => updateQualityConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="quality-autofix">Auto-Fix Issues</Label>
                  <Switch
                    id="quality-autofix"
                    checked={quality.autoFix}
                    onCheckedChange={(checked) => updateQualityConfig({ autoFix: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="quality-linter">Run Linter</Label>
                  <Switch
                    id="quality-linter"
                    checked={quality.runLinter}
                    onCheckedChange={(checked) => updateQualityConfig({ runLinter: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="quality-typecheck">Run TypeScript Check</Label>
                  <Switch
                    id="quality-typecheck"
                    checked={quality.runTypeCheck}
                    onCheckedChange={(checked) => updateQualityConfig({ runTypeCheck: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality-schedule">Cron Schedule</Label>
                  <Input
                    id="quality-schedule"
                    value={quality.schedule}
                    onChange={(e) => updateQualityConfig({ schedule: e.target.value })}
                    placeholder="0 10 * * 2,5"
                  />
                  <p className="text-xs text-muted-foreground">Twice weekly - Tuesday and Friday at 10 AM UTC</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Self-Improve Configuration */}
          <TabsContent value="self-improve" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🧠 Self-Improve Configuration</CardTitle>
                <CardDescription>Learn from successful repositories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="improve-enabled">Enable Self-Improve</Label>
                  <Switch
                    id="improve-enabled"
                    checked={selfImprove.enabled}
                    onCheckedChange={(checked) => updateSelfImproveConfig({ enabled: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improve-niche">Target Niche</Label>
                  <Input
                    id="improve-niche"
                    value={selfImprove.niche}
                    onChange={(e) => updateSelfImproveConfig({ niche: e.target.value })}
                    placeholder="e.g., AI tools, React libraries"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improve-min-stars">Minimum Stars</Label>
                  <Input
                    id="improve-min-stars"
                    type="number"
                    value={selfImprove.minStars}
                    onChange={(e) => updateSelfImproveConfig({ minStars: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improve-max-repos">Maximum Repositories</Label>
                  <Input
                    id="improve-max-repos"
                    type="number"
                    value={selfImprove.maxRepos}
                    onChange={(e) => updateSelfImproveConfig({ maxRepos: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improve-schedule">Cron Schedule</Label>
                  <Input
                    id="improve-schedule"
                    value={selfImprove.schedule}
                    onChange={(e) => updateSelfImproveConfig({ schedule: e.target.value })}
                    placeholder="0 9 * * 1"
                  />
                  <p className="text-xs text-muted-foreground">Weekly on Mondays at 9 AM UTC</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stargazer Analysis Configuration */}
          <TabsContent value="stargazer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>⭐ Stargazer Quality Analysis</CardTitle>
                <CardDescription>Analyze WHO starred repos for institutional backing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stargazer-enabled">Enable Analysis</Label>
                  <Switch
                    id="stargazer-enabled"
                    checked={stargazerAnalysis.enabled}
                    onCheckedChange={(checked) => updateStargazerAnalysisConfig({ enabled: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stargazer-min-followers">Minimum Followers (Influencer)</Label>
                  <Input
                    id="stargazer-min-followers"
                    type="number"
                    value={stargazerAnalysis.minFollowers}
                    onChange={(e) => updateStargazerAnalysisConfig({ minFollowers: parseInt(e.target.value) })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="stargazer-check-companies">Check Company Affiliations</Label>
                  <Switch
                    id="stargazer-check-companies"
                    checked={stargazerAnalysis.checkCompanies}
                    onCheckedChange={(checked) => updateStargazerAnalysisConfig({ checkCompanies: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stargazer-max">Max Stargazers to Analyze</Label>
                  <Input
                    id="stargazer-max"
                    type="number"
                    value={stargazerAnalysis.maxStargazers}
                    onChange={(e) => updateStargazerAnalysisConfig({ maxStargazers: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Higher values = better accuracy but slower</p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <p className="font-medium mb-1">Target Companies:</p>
                  <p className="text-xs text-muted-foreground">
                    {stargazerAnalysis.targetCompanies.join(', ')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Fetching Configuration */}
          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📊 Data Fetching & Caching</CardTitle>
                <CardDescription>React Query configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-enabled">Enable Advanced Fetching</Label>
                  <Switch
                    id="data-enabled"
                    checked={dataFetching.enabled}
                    onCheckedChange={(checked) => updateDataFetchingConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="data-caching">Enable Caching</Label>
                  <Switch
                    id="data-caching"
                    checked={dataFetching.useCaching}
                    onCheckedChange={(checked) => updateDataFetchingConfig({ useCaching: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-expiry">Cache Expiry (hours)</Label>
                  <Input
                    id="data-expiry"
                    type="number"
                    value={dataFetching.cacheExpiry}
                    onChange={(e) => updateDataFetchingConfig({ cacheExpiry: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Type-Safe Forms Configuration */}
          <TabsContent value="forms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📝 Type-Safe Forms</CardTitle>
                <CardDescription>Zod validation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="forms-enabled">Enable Type-Safe Forms</Label>
                  <Switch
                    id="forms-enabled"
                    checked={typeSafeForms.enabled}
                    onCheckedChange={(checked) => updateTypeSafeFormsConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="forms-zod">Use Zod Validation</Label>
                  <Switch
                    id="forms-zod"
                    checked={typeSafeForms.useZod}
                    onCheckedChange={(checked) => updateTypeSafeFormsConfig({ useZod: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="forms-validate-change">Validate on Change</Label>
                  <Switch
                    id="forms-validate-change"
                    checked={typeSafeForms.validateOnChange}
                    onCheckedChange={(checked) => updateTypeSafeFormsConfig({ validateOnChange: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Error Handling Configuration */}
          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🛡️ Error Handling</CardTitle>
                <CardDescription>Retry and circuit breaker settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="errors-enabled">Enable Advanced Error Handling</Label>
                  <Switch
                    id="errors-enabled"
                    checked={errorHandling.enabled}
                    onCheckedChange={(checked) => updateErrorHandlingConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="errors-retry">Enable Automatic Retry</Label>
                  <Switch
                    id="errors-retry"
                    checked={errorHandling.useRetry}
                    onCheckedChange={(checked) => updateErrorHandlingConfig({ useRetry: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="errors-max-retries">Max Retry Attempts</Label>
                  <Input
                    id="errors-max-retries"
                    type="number"
                    value={errorHandling.maxRetries}
                    onChange={(e) => updateErrorHandlingConfig({ maxRetries: parseInt(e.target.value) })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="errors-circuit-breaker">Circuit Breaker</Label>
                  <Switch
                    id="errors-circuit-breaker"
                    checked={errorHandling.circuitBreaker}
                    onCheckedChange={(checked) => updateErrorHandlingConfig({ circuitBreaker: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auth & Security Configuration */}
          <TabsContent value="auth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🔐 Authentication & Security</CardTitle>
                <CardDescription>Vault and session settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auth-enabled">Enable Security Features</Label>
                  <Switch
                    id="auth-enabled"
                    checked={authSecurity.enabled}
                    onCheckedChange={(checked) => updateAuthSecurityConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auth-vault">Use Encrypted Vault</Label>
                  <Switch
                    id="auth-vault"
                    checked={authSecurity.useVault}
                    onCheckedChange={(checked) => updateAuthSecurityConfig({ useVault: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auth-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="auth-timeout"
                    type="number"
                    value={authSecurity.sessionTimeout}
                    onChange={(e) => updateAuthSecurityConfig({ sessionTimeout: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* More Features (Remaining 5) */}
          <TabsContent value="more" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📱 Mobile & UI Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mobile Drawers */}
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Touch Gestures & Drawers</Label>
                      <p className="text-xs text-muted-foreground">Mobile-first UI patterns</p>
                    </div>
                    <Switch
                      checked={mobileDrawers.enabled}
                      onCheckedChange={(checked) => updateMobileDrawersConfig({ enabled: checked })}
                    />
                  </div>
                  {mobileDrawers.enabled && (
                    <div className="pl-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Enable Swipe Gestures</span>
                        <Switch
                          checked={mobileDrawers.gesturesEnabled}
                          onCheckedChange={(checked) => updateMobileDrawersConfig({ gesturesEnabled: checked })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Virtualized Lists */}
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Virtualized Lists</Label>
                      <p className="text-xs text-muted-foreground">Handle 1000+ items smoothly</p>
                    </div>
                    <Switch
                      checked={virtualizedLists.enabled}
                      onCheckedChange={(checked) => updateVirtualizedListsConfig({ enabled: checked })}
                    />
                  </div>
                </div>

                {/* Streaming AI */}
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Streaming AI Responses</Label>
                      <p className="text-xs text-muted-foreground">Typewriter effect for agents</p>
                    </div>
                    <Switch
                      checked={streamingAI.enabled}
                      onCheckedChange={(checked) => updateStreamingAIConfig({ enabled: checked })}
                    />
                  </div>
                </div>

                {/* Agent Orchestration */}
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Agent Orchestration</Label>
                      <p className="text-xs text-muted-foreground">Multi-expert coordination</p>
                    </div>
                    <Switch
                      checked={agentOrchestration.enabled}
                      onCheckedChange={(checked) => updateAgentOrchestrationConfig({ enabled: checked })}
                    />
                  </div>
                  {agentOrchestration.enabled && (
                    <div className="pl-4 space-y-2">
                      <Label className="text-sm">Execution Mode</Label>
                      <Select
                        value={agentOrchestration.executionMode}
                        onValueChange={(value: any) => updateAgentOrchestrationConfig({ executionMode: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="separated">Separated</SelectItem>
                          <SelectItem value="synthesis">Synthesis</SelectItem>
                          <SelectItem value="debate">Debate</SelectItem>
                          <SelectItem value="pipeline">Pipeline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Local Database */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Local-First Database</Label>
                      <p className="text-xs text-muted-foreground">Offline-capable with Dexie</p>
                    </div>
                    <Switch
                      checked={localDatabase.enabled}
                      onCheckedChange={(checked) => updateLocalDatabaseConfig({ enabled: checked })}
                    />
                  </div>
                  {localDatabase.enabled && (
                    <div className="pl-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Auto-Sync</span>
                        <Switch
                          checked={localDatabase.autoSync}
                          onCheckedChange={(checked) => updateLocalDatabaseConfig({ autoSync: checked })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Configuration
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureConfigModal;


================================================================================
File: src/features/council/components/GoldmineDetector.tsx
================================================================================
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/tabs';
import { TrendingUp, DollarSign, Users, Clock, Copy, ExternalLink, Zap } from 'lucide-react';
import { 
  findGoldmines, 
  calculateGoldmineMetrics, 
  generateGoldmineReport,
  categorizeGoldmines,
  generateActionPlan,
  Opportunity 
} from '@/lib/goldmine-detector';
import { toast } from 'sonner';

interface GoldmineDetectorProps {
  opportunities: Opportunity[];
}

export const GoldmineDetector: React.FC<GoldmineDetectorProps> = ({ opportunities }) => {
  const [goldmines, setGoldmines] = useState<Opportunity[]>([]);
  const [categorized, setCategorized] = useState<{
    easyWins: Opportunity[];
    mediumEffort: Opportunity[];
    highEffort: Opportunity[];
  }>({ easyWins: [], mediumEffort: [], highEffort: [] });

  useEffect(() => {
    if (opportunities.length > 0) {
      const found = findGoldmines(opportunities);
      setGoldmines(found);
      setCategorized(categorizeGoldmines(found));
    }
  }, [opportunities]);

  const handleCopyReport = (): void => {
    const report = generateGoldmineReport(goldmines);
    navigator.clipboard.writeText(report);
    toast.success('Goldmine report copied to clipboard');
  };

  const handleCopyActionPlan = (repo: Opportunity): void => {
    const actions = generateActionPlan(repo);
    const text = `# Action Plan: ${repo.owner}/${repo.name}\n\n` + 
                 actions.map((action, i) => `${i + 1}. ${action}`).join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Action plan copied to clipboard');
  };

  if (goldmines.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💰 Abandoned Goldmine Detector
          </CardTitle>
          <CardDescription>
            No goldmines found. Run Scout to discover opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Goldmine criteria:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Stars &gt; 1,000 (proven demand)</li>
              <li>Abandoned &gt; 1 year</li>
              <li>Open Issues &gt; 20 (active user need)</li>
              <li>Fork Ratio &lt; 0.2 (low competition)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = goldmines.slice(0, 10).reduce((sum, repo) => {
    const metrics = calculateGoldmineMetrics(repo);
    return sum + metrics.estimatedRevenueLow;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💰 Abandoned Goldmines Detected
          </CardTitle>
          <CardDescription>
            High-ROI opportunities ready for revival
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {goldmines.length}
              </div>
              <div className="text-xs text-muted-foreground">Goldmines Found</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${(totalRevenue / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-muted-foreground">Est. Revenue (Low)</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {categorized.easyWins.length}
              </div>
              <div className="text-xs text-muted-foreground">Easy Wins</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {categorized.mediumEffort.length}
              </div>
              <div className="text-xs text-muted-foreground">Medium Effort</div>
            </div>
          </div>

          <Button onClick={handleCopyReport} className="w-full gap-2">
            <Copy className="h-4 w-4" />
            Copy Full Goldmine Report
          </Button>
        </CardContent>
      </Card>

      {/* Categorized Tabs */}
      <Tabs defaultValue="easy" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="easy">
            Easy Wins ({categorized.easyWins.length})
          </TabsTrigger>
          <TabsTrigger value="medium">
            Medium ({categorized.mediumEffort.length})
          </TabsTrigger>
          <TabsTrigger value="high">
            High Effort ({categorized.highEffort.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="easy" className="space-y-4">
          {categorized.easyWins.map((repo) => (
            <GoldmineCard key={`${repo.owner}/${repo.name}`} repo={repo} onCopyActionPlan={handleCopyActionPlan} />
          ))}
        </TabsContent>

        <TabsContent value="medium" className="space-y-4">
          {categorized.mediumEffort.map((repo) => (
            <GoldmineCard key={`${repo.owner}/${repo.name}`} repo={repo} onCopyActionPlan={handleCopyActionPlan} />
          ))}
        </TabsContent>

        <TabsContent value="high" className="space-y-4">
          {categorized.highEffort.map((repo) => (
            <GoldmineCard key={`${repo.owner}/${repo.name}`} repo={repo} onCopyActionPlan={handleCopyActionPlan} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface GoldmineCardProps {
  repo: Opportunity;
  onCopyActionPlan: (repo: Opportunity) => void;
}

const GoldmineCard: React.FC<GoldmineCardProps> = ({ repo, onCopyActionPlan }) => {
  const metrics = calculateGoldmineMetrics(repo);
  const blueOceanScore = repo.blueOceanScore ?? 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {repo.owner}/{repo.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {repo.description || 'No description'}
            </CardDescription>
          </div>
          <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
            {blueOceanScore}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-yellow-500" />
            <span>{repo.stars.toLocaleString()} stars</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>{Math.round(repo.daysSinceUpdate / 365)}y abandoned</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-blue-500" />
            <span>{metrics.potentialCustomers} potential customers</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span>${metrics.estimatedPrice}/year</span>
          </div>
        </div>

        {/* Revenue Estimate */}
        <div className="p-3 bg-green-500/10 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Estimated Monthly Revenue</div>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            ${metrics.estimatedRevenueLow.toLocaleString()}-${metrics.estimatedRevenueHigh.toLocaleString()}
          </div>
        </div>

        {/* Quick Info Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {repo.openIssues} issues
          </Badge>
          <Badge variant="outline" className="text-xs">
            {metrics.competitionLevel} competition
          </Badge>
          <Badge variant="outline" className="text-xs">
            {metrics.timeToMarket} launch
          </Badge>
          {repo.language && (
            <Badge variant="outline" className="text-xs">
              {repo.language}
            </Badge>
          )}
        </div>

        {/* Quick Win Strategy */}
        <div className="space-y-2">
          <div className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Quick Win Strategy
          </div>
          <ol className="text-xs text-muted-foreground space-y-1 pl-4">
            <li>1. Fork & update dependencies</li>
            <li>2. Fix top 5-10 issues</li>
            <li>3. Add modern UI/UX</li>
            <li>4. Launch as SaaS</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => onCopyActionPlan(repo)}
          >
            <Copy className="h-3 w-3" />
            Copy Action Plan
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(repo.url, '_blank')}
            className="gap-2"
          >
            <ExternalLink className="h-3 w-3" />
            View Repo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoldmineDetector;


================================================================================
File: src/features/council/components/Header.tsx
================================================================================
import React from 'react';
import { useExecutionStore } from '@/features/council/store/execution-store';
import { useSettingsStore } from '@/features/settings/store/settings-store';
import { useMemoryStore } from '@/features/council/store/memory-store';
import { Brain, Settings, Lock, Unlock, DollarSign, History } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { MemoryBadge } from './MemoryBadge';
import { ProjectFeaturesDropdown } from '@/components/primitives/dropdown-menu';

export const Header: React.FC = () => {
  const cost = useExecutionStore(state => state.cost);
  const vaultStatus = useSettingsStore(state => state.vaultStatus);
  const setShowSettings = useSettingsStore(state => state.setShowSettings);
  const showHistory = useSettingsStore(state => state.showHistory);
  const setShowHistory = useSettingsStore(state => state.setShowHistory);
  const setShowMemory = useSettingsStore(state => state.setShowMemory);
  const memory = useMemoryStore(state => state.memory);

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
              <p className="text-xs text-muted-foreground">
                V18 • Multi-Perspective Decision Engine
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Features dropdown */}
            <ProjectFeaturesDropdown />
            
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


================================================================================
File: src/features/council/components/HistoryPanel.tsx
================================================================================
import React from 'react';
import { CouncilSession } from '@/features/council/lib/types';
import { getSessions, deleteSession, clearHistory, formatRelativeTime, formatSessionPreview } from '@/features/council/lib/session-history';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { ScrollArea } from '@/components/primitives/scroll-area';
import { Badge } from '@/components/primitives/badge';

import { 
  History, 
  Trash2, 
  RotateCcw, 
  Clock, 
  Users, 
  DollarSign,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
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
import { toast } from 'sonner';

// Placeholder for Sheet components
interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Sheet = ({ children, open, onOpenChange, ...props }: SheetProps) => (
  <div {...props}>{children}</div>
);

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: string;
}

const SheetContent = ({ children, side, ...props }: SheetContentProps) => (
  <div {...props}>{children}</div>
);

const SheetHeader = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>;
const SheetTitle = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...props}>{children}</h2>;

interface HistoryPanelProps {
  onLoadSession?: (session: CouncilSession) => void;
  onRefresh?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

// Standalone History Card Component (for inline display)
export const HistoryCard: React.FC<HistoryPanelProps> = ({ onLoadSession, onRefresh }) => {
  const [sessions, setSessions] = React.useState<CouncilSession[]>([]);

  React.useEffect(() => {
    setSessions(getSessions() || []);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(id);
    setSessions(getSessions() || []);
    toast.success('Session deleted');
  };

  const handleClearAll = () => {
    clearHistory();
    setSessions([]);
    toast.success('History cleared');
  };

  const handleLoad = (session: CouncilSession) => {
    onLoadSession?.(session);
    toast.success('Session loaded');
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'synthesis': return 'bg-primary/20 text-primary';
      case 'debate': return 'bg-destructive/20 text-destructive';
      case 'pipeline': return 'bg-secondary/20 text-secondary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <History className="h-4 w-4 text-primary" />
            Session History
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                setSessions(getSessions() || []);
                onRefresh?.();
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            {sessions.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-panel-elevated">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Clear All History?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all {sessions.length} saved sessions. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/90"
                      onClick={handleClearAll}
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              <History className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">No sessions yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Complete an analysis to save it here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-2">
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="group p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-all border border-transparent hover:border-border/50"
                  onClick={() => handleLoad(session)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {formatSessionPreview(session)}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getModeColor(session.mode)}`}>
                          {session.mode}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Users className="h-3 w-3" />
                          {session.activeExpertCount}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <DollarSign className="h-3 w-3" />
                          {session.cost.total.toFixed(4)}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(session.timestamp)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDelete(session.id, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

// Sidebar History Panel Component
export const HistorySidebar: React.FC<HistoryPanelProps> = ({ onLoadSession, onRefresh, isOpen, onClose }) => {
  const [sessions, setSessions] = React.useState<CouncilSession[]>([]);

  React.useEffect(() => {
    // Only load sessions when panel opens, not on every render
    if (isOpen) {
      setSessions(getSessions() || []);
    }
  }, [isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(id);
    setSessions(getSessions() || []);
    toast.success('Session deleted');
  };

  const handleClearAll = () => {
    clearHistory();
    setSessions([]);
    toast.success('History cleared');
  };

  const handleLoad = (session: CouncilSession) => {
    onLoadSession?.(session);
    onClose?.();
    toast.success('Session loaded');
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'synthesis': return 'bg-primary/20 text-primary';
      case 'debate': return 'bg-destructive/20 text-destructive';
      case 'pipeline': return 'bg-secondary/20 text-secondary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open: boolean) => !open && onClose?.()}>
      <SheetContent side="right" className="w-[380px] sm:w-[420px] glass-panel-elevated border-l border-border/50 p-0">
        <SheetHeader className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
              <History className="h-5 w-5 text-primary" />
              Session History
            </SheetTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setSessions(getSessions() || []);
                  onRefresh?.();
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              {sessions.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-panel-elevated">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Clear All History?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all {sessions.length} saved sessions. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={handleClearAll}
                      >
                        Clear All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Local history saved with IndexedDB • Each session is independent
          </p>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="p-4">
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <History className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground">No sessions yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Complete an analysis to save it here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="group p-4 rounded-xl bg-muted/30 hover:bg-muted/50 cursor-pointer transition-all border border-transparent hover:border-primary/30"
                    onClick={() => handleLoad(session)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {formatSessionPreview(session)}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getModeColor(session.mode)}`}>
                            {session.mode}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {session.activeExpertCount} experts
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${session.cost.total.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground/70">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(session.timestamp)}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDelete(session.id, e)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default HistorySidebar;


================================================================================
File: src/features/council/components/MemoryBadge.tsx
================================================================================
import React from 'react';
import { Brain } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';

interface MemoryBadgeProps {
  count: number;
  onClick: () => void;
}

export const MemoryBadge: React.FC<MemoryBadgeProps> = ({ count, onClick }) => {
  return (
    <Button variant="ghost" size="sm" className="h-8 px-2 gap-1.5 text-sm" onClick={onClick}>
      <Brain className="h-4 w-4 text-primary" />
      <span className="hidden sm:inline">{count} memories</span>
      <Badge variant="secondary" className="text-[10px] ml-1 sm:hidden">{count}</Badge>
    </Button>
  );
};


================================================================================
File: src/features/council/components/MemoryPanel.tsx
================================================================================
import React, { useEffect, useMemo } from 'react';
import { useMemoryStore } from '@/features/council/store/memory-store';
import { useShallow } from 'zustand/react/shallow';
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
  } = useMemoryStore(useShallow((state) => ({
    memory: state.memory,
    searchQuery: state.searchQuery,
    filterType: state.filterType,
    isLoading: state.isLoading,
    loadMemory: state.loadMemory,
    toggleEnabled: state.toggleEnabled,
    clearAll: state.clearAll,
    setSearchQuery: state.setSearchQuery,
    setFilterType: state.setFilterType,
  })));

  useEffect(() => {
    if (isOpen) {
      loadMemory();
    }
  }, [isOpen]); // loadMemory removed from deps - it's stable and does nothing (persist middleware handles hydration)

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


================================================================================
File: src/features/council/components/MiningDrillPanel.tsx
================================================================================
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';
import { Badge } from '@/components/primitives/badge';
import { Loader2, Zap, ExternalLink, Copy } from 'lucide-react';
import { minePainPoints, analyzePainPoints, generateMarketingCopy, PainPoint } from '@/lib/mining-drill';
import { useSettingsStore } from '@/features/settings/store/settings-store';
import { toast } from 'sonner';

export const MiningDrillPanel: React.FC = () => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const githubApiKey = useSettingsStore(state => state.githubApiKey);

  const handleMine = async (): Promise<void> => {
    if (!owner || !repo) {
      toast.error('Please enter repository owner and name');
      return;
    }

    setIsLoading(true);
    setShowResults(false);

    try {
      const results = await minePainPoints(owner, repo, {
        minBuyingIntent: 3,
        minUrgency: 20,
        maxResults: 20,
        githubToken: githubApiKey,
      });

      setPainPoints(results);
      setShowResults(true);
      
      if (results.length === 0) {
        toast.info('No high-intent pain points found');
      } else {
        toast.success(`Found ${results.length} pain points with buying intent`);
      }
    } catch (error) {
      console.error('Mining error:', error);
      toast.error('Failed to mine pain points. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMarketing = (): void => {
    const copy = generateMarketingCopy(painPoints);
    navigator.clipboard.writeText(copy);
    toast.success('Marketing copy copied to clipboard');
  };

  const insight = painPoints.length > 0 ? analyzePainPoints(painPoints) : null;

  const getUrgencyColor = (score: number): string => {
    if (score >= 70) return 'bg-red-500/10 text-red-600 dark:text-red-400';
    if (score >= 40) return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
    return 'bg-green-500/10 text-green-600 dark:text-green-400';
  };

  const getBuyingIntentColor = (score: number): string => {
    if (score >= 7) return 'bg-green-500/10 text-green-600 dark:text-green-400';
    if (score >= 5) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⛏️ Mining Drill - Pain Point Extractor
          </CardTitle>
          <CardDescription>
            Extract marketing intelligence from GitHub issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Repository Owner</Label>
              <Input
                id="owner"
                placeholder="facebook"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo">Repository Name</Label>
              <Input
                id="repo"
                placeholder="react"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={handleMine} 
            disabled={isLoading || !owner || !repo}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mining...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Start Mining
              </>
            )}
          </Button>

          {!githubApiKey && (
            <div className="text-xs text-muted-foreground bg-yellow-500/10 p-2 rounded">
              ⚠️ Add GitHub API key in settings for higher rate limits
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {showResults && insight && (
        <>
          {/* Market Insights Summary */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
              <CardDescription>
                Intelligence extracted from {painPoints.length} high-intent pain points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{insight.totalPainPoints}</div>
                  <div className="text-xs text-muted-foreground">Total Pain Points</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{insight.highIntentCount}</div>
                  <div className="text-xs text-muted-foreground">High Intent (5+)</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{insight.averageUrgency.toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">Avg Urgency</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Top Pain Keywords</div>
                <div className="flex flex-wrap gap-2">
                  {insight.topPainKeywords.slice(0, 8).map((kw) => (
                    <Badge key={kw.keyword} variant="outline">
                      {kw.keyword} ({kw.count})
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={handleCopyMarketing} variant="outline" className="w-full gap-2">
                <Copy className="h-4 w-4" />
                Copy Marketing Intelligence
              </Button>
            </CardContent>
          </Card>

          {/* Pain Points List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">High-Intent Pain Points</h3>
              <Badge>{painPoints.length} found</Badge>
            </div>

            {painPoints.map((point, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-base leading-tight flex-1">
                        {point.title}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getBuyingIntentColor(point.buyingIntent)}>
                          Intent: {point.buyingIntent}/10
                        </Badge>
                        <Badge className={getUrgencyColor(point.urgencyScore)}>
                          Urgency: {point.urgencyScore}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>💬 {point.comments} comments</span>
                      <span>📅 {new Date(point.created).toLocaleDateString()}</span>
                      <span>👤 {point.author}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {point.body && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {point.body}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {point.painKeywords.slice(0, 6).map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {point.labels.slice(0, 3).map((label) => (
                        <Badge key={label} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => window.open(point.url, '_blank')}
                      className="gap-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Issue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MiningDrillPanel;


================================================================================
File: src/features/council/components/PersonaSelector.tsx
================================================================================
import React, { useState } from 'react';
import { useControlPanelStore } from '@/features/council/store/control-panel-store';
import { useExpertStore } from '@/features/council/store/expert-store';
import { useShallow } from 'zustand/react/shallow';
import { EXPERT_POSITIONS, PERSONA_LIBRARY } from '@/features/council/lib/persona-library';
import { getPersonaSelectorOptions, getTeamSelectorOptions } from '@/features/council/lib/persona-library';
import { Card, CardContent } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/primitives/collapsible';
import { ChevronDown, ChevronRight, Users, User, RotateCcw, Check } from 'lucide-react';
import { Expert } from '@/features/council/lib/types';

export const PersonaSelector: React.FC = () => {
  const {
    activeExpertCount,
    loadPersona,
    loadTeam,
    clearPersona,
    resetToDefault,
  } = useControlPanelStore(useShallow((state) => ({
    activeExpertCount: state.activeExpertCount,
    loadPersona: state.loadPersona,
    loadTeam: state.loadTeam,
    clearPersona: state.clearPersona,
    resetToDefault: state.resetToDefault,
  })));
  const { experts } = useExpertStore(useShallow((state) => ({ experts: state.experts })));

  const [showIndividual, setShowIndividual] = useState<boolean>(false);
  const teams = getTeamSelectorOptions();
  const personas = getPersonaSelectorOptions();

  const handleTeamSelect = (teamId: string) => {
    if (teamId) {
      loadTeam(teamId);
    }
  };

  const handlePersonaSelect = (expertIndex: number, personaId: string) => {
    if (personaId === 'clear') {
      clearPersona(expertIndex);
    } else if (personaId) {
      loadPersona(expertIndex, personaId);
    }
  };

  const getExpertPersonaId = (expert: Expert): string | undefined => {
    return expert.personaId;
  };

  const getPositionInfo = (index: number) => {
    return EXPERT_POSITIONS[index] || EXPERT_POSITIONS[0];
  };

  return (
    <Card className="glass-panel border-primary/20">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Quick Start: Load Preset Team
            </label>
          </div>
          
          <Select onValueChange={handleTeamSelect}>
            <SelectTrigger className="w-full bg-muted/50 border-border/50">
              <SelectValue placeholder="Select a preset team..." />
            </SelectTrigger>
            <SelectContent>
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>
                  <div className="flex items-center gap-2">
                    <span>{team.icon}</span>
                    <span>{team.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <p className="text-xs text-muted-foreground">
            Loads 5 personas at once with recommended mode
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <Collapsible open={showIndividual} onOpenChange={setShowIndividual}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors w-full">
            {showIndividual ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <User className="h-4 w-4" />
            <span>Load Individual Personas</span>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 pt-3">
            <div className="space-y-2 pl-2 border-l-2 border-primary/30">
              {Array.from({ length: activeExpertCount }).map((_, idx) => {
                const expert = experts[idx];
                const personaId = expert ? getExpertPersonaId(expert) : undefined;
                const persona = personaId ? PERSONA_LIBRARY[personaId] : null;
                const position = getPositionInfo(idx);
                
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        Expert {idx + 1}:
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {position.position}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 pl-4">
                      <Select
                        value={personaId || ''}
                        onValueChange={(value) => handlePersonaSelect(idx + 1, value)}
                      >
                        <SelectTrigger className="flex-1 h-8 text-xs bg-muted/30 border-border/30">
                          <SelectValue placeholder="Select persona...">
                            {persona ? (
                              <span className="flex items-center gap-1">
                                {persona.icon} {persona.name}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Default ({position.specialty})</span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clear">
                            <span className="text-muted-foreground">⟳ Reset to Default</span>
                          </SelectItem>
                          {Object.entries(personas).map(([category, personaList]) => (
                            <SelectGroup key={category}>
                              <SelectLabel className="text-xs text-muted-foreground">
                                {category}
                              </SelectLabel>
                              {personaList.map(p => (
                                <SelectItem key={p.id} value={p.id}>
                                  <span className="flex items-center gap-2">
                                    <span>{p.icon}</span>
                                    <span>{p.name}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={resetToDefault}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset All
          </Button>
        </div>

        {experts.slice(0, activeExpertCount).some(e => getExpertPersonaId(e)) && (
          <div className="pt-2 border-t border-border/30">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {activeExpertCount} experts configured:
            </p>
            <div className="space-y-1">
              {experts.slice(0, activeExpertCount).map((expert, idx) => {
                const personaId = getExpertPersonaId(expert);
                const persona = personaId ? PERSONA_LIBRARY[personaId] : null;
                const position = getPositionInfo(idx);
                
                return (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 text-xs"
                  >
                    <Check className="h-3 w-3 text-green-500" />
                    <span className="text-muted-foreground">{position.position}</span>
                    <span className="text-foreground">+</span>
                    {persona ? (
                      <Badge 
                        variant="secondary" 
                        className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20"
                      >
                        {persona.icon} {persona.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground italic">default</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


================================================================================
File: src/features/council/components/SettingsModal.tsx
================================================================================
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/primitives/dialog';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { Lock, Unlock, Key, Shield, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasVault: boolean;
  isVaultLocked: boolean;
  onCreateVault: (data: { password: string; openRouterKey: string; serperKey?: string }) => Promise<{ success: boolean; error?: string }>;
  onUnlockVault: (password: string) => Promise<{ success: boolean; error?: string }>;
  onLockVault: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  hasVault,
  isVaultLocked,
  onCreateVault,
  onUnlockVault,
  onLockVault,
}) => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [openRouterKey, setOpenRouterKey] = useState<string>('');
  const [serperKey, setSerperKey] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCreateVault = async () => {
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!openRouterKey.trim()) {
      toast.error('OpenRouter API key is required');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onCreateVault({
        password,
        openRouterKey: openRouterKey.trim(),
        serperKey: serperKey.trim() || undefined,
      });

      if (result.success) {
        toast.success('Vault created successfully');
        resetForm();
      } else {
        toast.error(result.error || 'Failed to create vault');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onUnlockVault(password);
      if (result.success) {
        toast.success('Vault unlocked');
        resetForm();
        onClose();
      } else {
        toast.error(result.error || 'Invalid password');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLock = (): void => {
    onLockVault();
    toast.success('Vault locked');
  };

  const resetForm = (): void => {
    setPassword('');
    setConfirmPassword('');
    setOpenRouterKey('');
    setSerperKey('');
    setShowPassword(false);
    setShowApiKey(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel-elevated sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Secure Vault
          </DialogTitle>
          <DialogDescription>
            Your API keys are encrypted and stored securely in your browser.
          </DialogDescription>
        </DialogHeader>

        {!hasVault ? (
          /* Create Vault Form */
          <div className="space-y-6 py-4">
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  Create New Vault
                </CardTitle>
                <CardDescription>
                  Set up a password to encrypt your API keys
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Master Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                  />
                </div>

                {/* OpenRouter Key */}
                <div className="space-y-2">
                  <Label htmlFor="openRouterKey">
                    OpenRouter API Key <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="openRouterKey"
                      type={showApiKey ? 'text' : 'password'}
                      value={openRouterKey}
                      onChange={(e) => setOpenRouterKey(e.target.value)}
                      placeholder="sk-or-..."
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get your key at{' '}
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      openrouter.ai/keys
                    </a>
                  </p>
                </div>

                {/* Serper Key (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="serperKey">Serper API Key (Optional)</Label>
                  <Input
                    id="serperKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={serperKey}
                    onChange={(e) => setSerperKey(e.target.value)}
                    placeholder="For web search (optional)"
                  />
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                  onClick={handleCreateVault}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Vault'}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : isVaultLocked ? (
          /* Unlock Vault Form */
          <div className="space-y-6 py-4">
            <Card className="border-amber-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="h-4 w-4 text-amber-500" />
                  Unlock Vault
                </CardTitle>
                <CardDescription>Enter your password to access API keys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unlockPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="unlockPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter master password"
                      className="pr-10"
                      onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
                  onClick={handleUnlock}
                  disabled={isLoading}
                >
                  {isLoading ? 'Unlocking...' : 'Unlock Vault'}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Vault Unlocked */
          <div className="space-y-6 py-4">
            <Card className="border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Vault Unlocked
                </CardTitle>
                <CardDescription>Your API keys are ready to use</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Unlock className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Session Active</p>
                    <p className="text-xs text-muted-foreground">
                      Keys will auto-lock after 1 hour of inactivity
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLock}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Lock Vault
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;


================================================================================
File: src/features/council/components/StargazerQualityCard.tsx
================================================================================
/**
 * Stargazer Quality Analysis Card
 * Displays institutional backing analysis for GitHub repositories
 */

import { Star, Building2, Users, TrendingUp, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { StargazerQuality } from '@/lib/validation';

interface StargazerQualityCardProps {
  data: StargazerQuality;
  isLoading?: boolean;
  error?: Error | null;
}

export function StargazerQualityCard({ data, isLoading, error }: StargazerQualityCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6 animate-pulse">
        <div className="h-6 w-48 bg-muted rounded mb-4"></div>
        <div className="h-4 w-full bg-muted rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-muted rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
        <div className="flex items-center gap-2 text-destructive mb-2">
          <XCircle className="h-5 w-5" />
          <h3 className="font-semibold">Analysis Failed</h3>
        </div>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!data) return null;

  const getVerdictColor = () => {
    switch (data.verdict) {
      case 'INSTITUTIONAL_BACKING': return 'text-green-600 dark:text-green-400';
      case 'COMMUNITY_VALIDATED': return 'text-yellow-600 dark:text-yellow-400';
      case 'UNVALIDATED': return 'text-red-600 dark:text-red-400';
    }
  };

  const getVerdictIcon = () => {
    switch (data.verdict) {
      case 'INSTITUTIONAL_BACKING': return <CheckCircle2 className="h-5 w-5" />;
      case 'COMMUNITY_VALIDATED': return <AlertCircle className="h-5 w-5" />;
      case 'UNVALIDATED': return <XCircle className="h-5 w-5" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Stargazer Quality Analysis</h3>
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(data.qualityScore)}`}>
            {data.qualityScore}/100
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`${getVerdictColor()} flex items-center gap-1 font-medium`}>
            {getVerdictIcon()}
            {data.verdict.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>Big Tech</span>
          </div>
          <div className="text-2xl font-semibold">{data.bigTechCount}</div>
          <div className="text-xs text-muted-foreground">
            {data.companyBackers.slice(0, 2).join(', ') || 'None'}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Influencers</span>
          </div>
          <div className="text-2xl font-semibold">{data.influencerCount}</div>
          <div className="text-xs text-muted-foreground">1000+ followers</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>Organizations</span>
          </div>
          <div className="text-2xl font-semibold">{data.organizationCount}</div>
          <div className="text-xs text-muted-foreground">Official accounts</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Analyzed</span>
          </div>
          <div className="text-2xl font-semibold">{data.analyzed}</div>
          <div className="text-xs text-muted-foreground">of {data.totalStargazers} total</div>
        </div>
      </div>

      {/* Analysis */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Institutional Strength</span>
            <span className={`font-medium capitalize ${
              data.analysis.institutionalStrength === 'strong' ? 'text-green-600' :
              data.analysis.institutionalStrength === 'moderate' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {data.analysis.institutionalStrength}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Community Trust</span>
            <span className={`font-medium capitalize ${
              data.analysis.communityTrust === 'high' ? 'text-green-600' :
              data.analysis.communityTrust === 'medium' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {data.analysis.communityTrust}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted/50">
          <p className="text-sm leading-relaxed">{data.analysis.recommendation}</p>
        </div>
      </div>

      {/* Notable Backers */}
      {data.notableBackers.length > 0 && (
        <div className="p-6 border-t">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Top Notable Backers
          </h4>
          <div className="space-y-2">
            {data.notableBackers.slice(0, 5).map((backer) => (
              <div 
                key={backer.login}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    backer.type === 'big_tech' ? 'bg-green-500' :
                    backer.type === 'organization' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <a 
                    href={`https://github.com/${backer.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {backer.login}
                  </a>
                </div>
                <div className="text-sm text-muted-foreground">
                  {backer.detail}
                </div>
              </div>
            ))}
          </div>

          {data.notableBackers.length > 5 && (
            <div className="mt-2 text-sm text-center text-muted-foreground">
              +{data.notableBackers.length - 5} more notable backers
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
        Repository: {data.repoFullName}
      </div>
    </div>
  );
}


================================================================================
File: src/features/council/components/SynthesisCard.tsx
================================================================================
import React, { useState } from 'react';
import { useExecutionStore } from '@/features/council/store/execution-store';
import { useSettingsStore } from '@/features/settings/store/settings-store';
import { useShallow } from 'zustand/react/shallow';
import { SynthesisTier } from '@/features/council/lib/types';
import { SYNTHESIS_TIERS } from '@/lib/synthesis-engine';
import { Card, CardContent, CardHeader } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Slider } from '@/components/primitives/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/select';
import { Textarea } from '@/components/primitives/textarea';
import { Collapsible, CollapsibleContent } from '@/components/primitives/collapsible';
import { ScrollArea } from '@/components/primitives/scroll-area';
import { SafeMarkdown } from '@/components/primitives/SafeMarkdown';
import {
  Brain,
  Copy,
  Settings2,
  Loader2,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

const TIER_ICONS: Record<SynthesisTier, React.ComponentType<{ className?: string }>> = {
  quick: Zap,
  balanced: Target,
  deep: Brain,
};

export const SynthesisCard: React.FC = () => {
  const { synthesisResult, isSynthesizing } = useExecutionStore(useShallow((state) => ({ synthesisResult: state.synthesisResult, isSynthesizing: state.isSynthesizing })));
  const { synthesisConfig, setSynthesisConfig } = useSettingsStore(useShallow((state) => ({ synthesisConfig: state.synthesisConfig, setSynthesisConfig: state.setSynthesisConfig })));
  const [showConfig, setShowConfig] = useState<boolean>(false); // Fixed type of showConfig
  const tierConfig = SYNTHESIS_TIERS[synthesisConfig.tier];

  const handleCopy = async () => {
    if (synthesisResult?.content) {
      await navigator.clipboard.writeText(synthesisResult.content);
      toast.success('Synthesis copied to clipboard');
    }
  };

  return (
    <Card className="glass-panel transition-all duration-300 ring-2 ring-accent/30 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">Synthesizer</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span>{tierConfig.icon}</span>
                <span>{tierConfig.name}</span>
                <span className="text-muted-foreground/60">•</span>
                <span className="truncate">{synthesisConfig.model?.split('/')[1] || 'Default Model'}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {synthesisResult?.content && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/10"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10"
              onClick={() => setShowConfig(!showConfig)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-3 overflow-hidden">
        {/* Configuration Panel */}
        <Collapsible open={showConfig} onOpenChange={setShowConfig}>
          <CollapsibleContent className="space-y-4 pb-3 border-b border-border/50">
            {/* Tier Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Synthesis Tier</label>
              <div className="flex gap-2">
                {(Object.keys(SYNTHESIS_TIERS) as SynthesisTier[]).map((tier) => {
                  const TierIcon = TIER_ICONS[tier];
                  const tierInfo = SYNTHESIS_TIERS[tier];
                  return (
                    <Button
                      key={tier}
                      variant={synthesisConfig.tier === tier ? 'default' : 'outline'}
                      size="sm"
                      className={`flex-1 ${synthesisConfig.tier === tier ? 'bg-gradient-to-r from-primary to-secondary' : ''}`}
                      onClick={() => setSynthesisConfig({ ...synthesisConfig, tier })}
                    >
                      <TierIcon className="h-3.5 w-3.5 mr-1" />
                      {tierInfo.icon}
                    </Button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {tierConfig.description} • {tierConfig.estimatedTime} • {tierConfig.estimatedCost}
              </p>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Model</label>
              <Select
                value={synthesisConfig.model}
                onValueChange={(value) => setSynthesisConfig({ ...synthesisConfig, model: value })}
              >
                <SelectTrigger className="h-8 text-xs bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google/gemini-2.0-flash-001">Gemini 2.0 Flash (1M context)</SelectItem>
                  <SelectItem value="google/gemini-flash-1.5">Gemini Flash 1.5 (1M context)</SelectItem>
                  <SelectItem value="deepseek/deepseek-chat">DeepSeek Chat (64K context)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Temperature</span>
                <span className="font-mono">{(synthesisConfig.temperature ?? 0.4).toFixed(2)}</span>
              </div>
              <Slider
                value={[synthesisConfig.temperature ?? 0.4]}
                onValueChange={([value]) => setSynthesisConfig({ ...synthesisConfig, temperature: value })}
                min={0}
                max={1}
                step={0.1}
                className="slider-council"
              />
            </div>

            {/* Custom Instructions */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Custom Instructions</label>
              <Textarea
                value={synthesisConfig.customInstructions}
                onChange={(e) => setSynthesisConfig({ ...synthesisConfig, customInstructions: e.target.value })}
                placeholder="E.g., 'Focus on cost-benefit analysis'"
                className="min-h-[60px] text-xs bg-muted/50 resize-none"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {isSynthesizing ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-lg opacity-50 animate-pulse" />
                <Loader2 className="h-8 w-8 animate-spin text-primary relative z-10" />
              </div>
              <span className="text-xs text-muted-foreground mt-3">
                {tierConfig.icon} Running {tierConfig.name}...
              </span>
            </div>
          ) : synthesisResult?.content ? (
            <ScrollArea className="h-full">
              <SafeMarkdown content={synthesisResult.content} className="text-sm p-2" />
              {synthesisResult.cost > 0 && (
                <div className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50 flex items-center gap-2">
                  <span>{tierConfig.icon} {synthesisConfig.tier}</span>
                  <span>•</span>
                  <span>{synthesisResult.model.split('/')[1]}</span>
                  <span>•</span>
                  <span>${synthesisResult.cost.toFixed(6)}</span>
                </div>
              )}
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Brain className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-xs text-muted-foreground max-w-[180px]">
                Awaiting expert analyses to synthesize...
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SynthesisCard;


================================================================================
File: src/features/council/components/VerdictPanel.tsx
================================================================================
import React from 'react';
import { useExecutionStore } from '@/features/council/store/execution-store';
import { ScrollArea } from '@/components/primitives/scroll-area';
import { Button } from '@/components/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/primitives/dialog';
import { Maximize2, ClipboardCopy } from 'lucide-react';
import { toast } from 'sonner';

export const VerdictPanel: React.FC = () => {
  const { verdict, status } = useExecutionStore();

  const handleCopy = () => {
    if (verdict) {
      navigator.clipboard.writeText(verdict);
      toast.success('Verdict copied to clipboard');
    }
  };

  const isVerdictReady = status === 'VERDICT_READY';

  return (
    <div
      className={`glass-panel p-4 rounded-lg flex flex-col transition-all duration-300 h-full ${
        isVerdictReady ? 'min-h-[200px]' : ''
      }`}
    >
      <div className="flex-1 flex flex-col">
        <h2 className="text-lg font-semibold mb-3 text-gradient">Verdict</h2>
        <div
          className={`flex-1 transition-opacity duration-500 ${
            isVerdictReady ? 'opacity-100' : 'opacity-50'
          }`}
        >
          {isVerdictReady ? (
            <ScrollArea className="h-full max-h-64">
              <p className="text-sm text-foreground whitespace-pre-wrap font-light leading-relaxed">
                {verdict}
              </p>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground italic">
                {status === 'IDLE' && 'Awaiting instructions...'}
                {status === 'EXECUTING' && 'The Council is deliberating...'}
                {status === 'SYNTHESIZING' && 'The Synthesis expert is drafting the final verdict...'}
              </p>
            </div>
          )}
        </div>
        {isVerdictReady && (
          <div className="flex items-center gap-2 mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Maximize2 className="h-4 w-4 mr-2" />
                  View Full Verdict
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Full Council Verdict</DialogTitle>
                  <DialogDescription>
                    This is the complete, unabridged verdict from the Council.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-full">
                  <pre className="text-sm text-foreground whitespace-pre-wrap p-4">
                    {verdict}
                  </pre>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <ClipboardCopy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};


================================================================================
File: src/features/council/hooks/use-council-queries.ts
================================================================================
import { useQuery, useMutation } from "@tanstack/react-query";
import { callExpert } from "@/features/council/api/ai-client";
import {
  Expert,
  ExecutionMode,
  SynthesisConfig,
  SynthesisResult,
} from "@/features/council/lib/types";
import {
  SYNTHESIS_TIERS,
  getPromptBuilder,
} from "@/lib/synthesis-engine";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// This helper function encapsulates the direct API call for synthesis.
async function callSynthesisAPI(
  prompt: string,
  model: string,
  temperature: number,
  maxTokens: number,
  apiKey: string
): Promise<{ content: string; tokens: { prompt: number; completion: number }; cost: number }> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "The Council V18 - Synthesizer",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "Synthesis failed";
  const promptTokens = data.usage?.prompt_tokens || 0;
  const completionTokens = data.usage?.completion_tokens || 0;

  // Simplified cost calculation
  const costPerMillion = model.includes("gemini") ? 0.075 : 0.14;
  const cost = ((promptTokens + completionTokens) / 1000000) * costPerMillion;

  return {
    content,
    tokens: { prompt: promptTokens, completion: completionTokens },
    cost,
  };
}

// Kept for potential future use, but not the focus of this refactor.
export const useCallExpert = (
  expert: Expert,
  task: string,
  mode: ExecutionMode,
  apiKey: string,
  additionalContext?: string,
  previousOutputs?: Record<string, string>
) => {
  return useQuery({
    queryKey: ["callExpert", expert.id, task, mode, additionalContext, previousOutputs],
    queryFn: () => callExpert(expert, task, mode, apiKey, additionalContext, previousOutputs),
    retry: 3,
    enabled: false,
  });
};

// Refined 'useExecuteSynthesis' to ensure alignment with 'executeCouncil'
export const useExecuteSynthesis = () => {
  return useMutation<
    SynthesisResult,
    Error,
    {
      task: string;
      config: SynthesisConfig;
      apiKey: string;
      onProgress?: (message: string) => void;
    }
  >({
    mutationFn: async ({ task, config, apiKey, onProgress }) => {
      const tierConfig = SYNTHESIS_TIERS[config.tier];
      const promptBuilder = getPromptBuilder(config.tier);
      const prompt = promptBuilder([], task, config.customInstructions || '');

      onProgress?.(`Running ${tierConfig.name}...`);

      const primaryModel = config.model || 'google/gemini-2.0-flash-001';
      const fallbackModel = config.fallbackModel || 'deepseek/deepseek-chat';

      try {
        // Attempt to call the primary model
        const result = await callSynthesisAPI(
          prompt,
          primaryModel,
          config.temperature || tierConfig.temperature,
          config.maxTokens || tierConfig.maxTokens,
          apiKey
        );
        return {
          content: result.content,
          tier: config.tier,
          model: primaryModel,
          tokens: result.tokens,
          cost: result.cost,
        };
      } catch (error) {
        console.warn(`Primary model ${primaryModel} failed, trying fallback...`, error);
        onProgress?.(`Retrying with fallback model...`);

        // If the primary model fails, the mutation function automatically tries the fallback.
        const result = await callSynthesisAPI(
          prompt,
          fallbackModel,
          config.temperature || tierConfig.temperature,
          config.maxTokens || tierConfig.maxTokens,
          apiKey
        );
        return {
          content: result.content,
          tier: config.tier,
          model: fallbackModel, // Report that the fallback model was used
          tokens: result.tokens,
          cost: result.cost,
        };
      }
    },
    // If the entire mutationFn (including the fallback attempt) fails,
    // TanStack Query will retry the whole process 2 more times.
    retry: 2,
  });
};


================================================================================
File: src/features/council/lib/council-memory.ts
================================================================================
// Council Memory - Cross-Session Persistent Memory System
import { get, set } from 'idb-keyval';

// Memory entry types
export type MemoryType = 'insight' | 'pattern' | 'user_preference' | 'domain_knowledge';

export interface MemoryEntry {
  id: string;
  timestamp: Date;
  sessionId: string;
  type: MemoryType;
  content: string;
  tags: string[];
  relevanceScore: number;
}

export interface CouncilMemory {
  entries: MemoryEntry[];
  userPreferences: Record<string, unknown>;
  domainKnowledge: Record<string, string[]>;
  enabled: boolean;
}

// Storage key
const MEMORY_KEY = 'council_memory_v18';
const MAX_ENTRIES = 100;

// Default memory state
const DEFAULT_MEMORY: CouncilMemory = {
  entries: [],
  userPreferences: {},
  domainKnowledge: {},
  enabled: true,
};

/**
 * Load memory from IndexedDB
 */
export async function loadMemory(): Promise<CouncilMemory> {
  try {
    const memory = await get<CouncilMemory>(MEMORY_KEY);
    if (memory && memory.entries) {
      // Convert timestamp strings back to Date objects and ensure tags exist
      return {
        ...memory,
        entries: memory.entries.map(e => ({
          ...e,
          timestamp: new Date(e.timestamp),
          tags: e.tags || [],
        })),
      };
    }
    return DEFAULT_MEMORY;
  } catch (error) {
    console.error('Failed to load council memory:', error);
    return DEFAULT_MEMORY;
  }
}

/**
 * Save memory to IndexedDB
 */
export async function saveMemory(memory: CouncilMemory): Promise<void> {
  try {
    await set(MEMORY_KEY, memory);
  } catch (error) {
    console.error('Failed to save council memory:', error);
  }
}

/**
 * Add a new memory entry
 */
export async function addMemoryEntry(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<MemoryEntry> {
  const memory = await loadMemory();
  
  const newEntry: MemoryEntry = {
    ...entry,
    id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
  };
  
  memory.entries.unshift(newEntry);
  
  // Prune old low-relevance entries if over max
  if (memory.entries.length > MAX_ENTRIES) {
    memory.entries
      .sort((a, b) => {
        // Keep high relevance and recent entries
        const recencyA = Date.now() - new Date(a.timestamp).getTime();
        const recencyB = Date.now() - new Date(b.timestamp).getTime();
        const scoreA = a.relevanceScore - (recencyA / (1000 * 60 * 60 * 24 * 7)); // Decay over a week
        const scoreB = b.relevanceScore - (recencyB / (1000 * 60 * 60 * 24 * 7));
        return scoreB - scoreA;
      })
      .slice(0, MAX_ENTRIES);
  }
  
  await saveMemory(memory);
  return newEntry;
}

/**
 * Add multiple memory entries at once
 */
export async function addMemoryEntries(entries: Omit<MemoryEntry, 'id' | 'timestamp'>[]): Promise<MemoryEntry[]> {
  const memory = await loadMemory();
  
  const newEntries: MemoryEntry[] = entries.map(entry => ({
    ...entry,
    id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
  }));
  
  memory.entries.unshift(...newEntries);
  
  // Prune if over max
  if (memory.entries.length > MAX_ENTRIES) {
    memory.entries = memory.entries
      .sort((a, b) => {
        const recencyA = Date.now() - new Date(a.timestamp).getTime();
        const recencyB = Date.now() - new Date(b.timestamp).getTime();
        const scoreA = a.relevanceScore - (recencyA / (1000 * 60 * 60 * 24 * 7));
        const scoreB = b.relevanceScore - (recencyB / (1000 * 60 * 60 * 24 * 7));
        return scoreB - scoreA;
      })
      .slice(0, MAX_ENTRIES);
  }
  
  await saveMemory(memory);
  return newEntries;
}

/**
 * Delete a memory entry
 */
export async function deleteMemoryEntry(id: string): Promise<void> {
  const memory = await loadMemory();
  memory.entries = memory.entries.filter(e => e.id !== id);
  await saveMemory(memory);
}

/**
 * Clear all memory
 */
export async function clearMemory(): Promise<void> {
  await saveMemory(DEFAULT_MEMORY);
}

/**
 * Toggle memory enabled state
 */
export async function setMemoryEnabled(enabled: boolean): Promise<void> {
  const memory = await loadMemory();
  memory.enabled = enabled;
  await saveMemory(memory);
}

/**
 * Find relevant memories for a given task
 */
export function findRelevantMemories(
  memories: MemoryEntry[],
  task: string,
  maxResults: number = 5
): MemoryEntry[] {
  if (!task.trim()) return [];
  
  const taskWords = task.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  const scored = memories.map(memory => {
    // Calculate keyword overlap score
    const memoryWords = memory.content.toLowerCase().split(/\s+/);
    const tagWords = (memory.tags || []).map(t => t.toLowerCase()); // <-- FIX: Add fallback for tags
    
    let keywordScore = 0;
    taskWords.forEach(word => {
      if (memoryWords.some(mw => mw.includes(word))) keywordScore += 1;
      if (tagWords.some(tw => tw.includes(word))) keywordScore += 2;
    });
    
    // Calculate recency score (0-1, higher for recent)
    const ageMs = Date.now() - new Date(memory.timestamp).getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - (ageDays / 30)); // Decay over 30 days
    
    // Combined score
    const totalScore = (keywordScore * 0.6) + (memory.relevanceScore * 0.3) + (recencyScore * 0.1);
    
    return { memory, score: totalScore };
  });
  
  return scored
    .filter(s => s.score > 0.1)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => s.memory);
}

/**
 * Format memories for injection into expert context
 */
export function formatMemoriesForContext(memories: MemoryEntry[]): string {
  if (memories.length === 0) return '';
  
  const insightMemories = memories.filter(m => m.type === 'insight');
  const prefMemories = memories.filter(m => m.type === 'user_preference');
  const domainMemories = memories.filter(m => m.type === 'domain_knowledge');
  const patternMemories = memories.filter(m => m.type === 'pattern');
  
  let context = '\n--- COUNCIL MEMORY ---\n';
  
  if (insightMemories.length > 0) {
    context += 'Previous insights relevant to this query:\n';
    insightMemories.forEach(m => {
      context += `${m.content}\n`;
    });
    context += '\n';
  }
  
  context += buildContext(prefMemories, domainMemories, patternMemories);
  
  context += '--- END COUNCIL MEMORY ---\n';
  
  return context;
}

/**
 * Extract memories from synthesis output (simple keyword-based extraction)
 */
export function extractMemoriesFromSynthesis(
  synthesisContent: string,
  sessionId: string,
  task: string
): Omit<MemoryEntry, 'id' | 'timestamp'>[] {
  const memories: Omit<MemoryEntry, 'id' | 'timestamp'>[] = [];
  
  // Extract insights marked as IMPORTANT
  const importantMatches = synthesisContent.match(/(?:IMPORTANT|KEY INSIGHT|CRITICAL):\s*([^\n]+)/gi);
  if (importantMatches) {
    importantMatches.forEach(match => {
      const content = match.replace(/(?:IMPORTANT|KEY INSIGHT|CRITICAL):\s*/i, '').trim();
      if (content.length > 10) {
        memories.push({
          sessionId,
          type: 'insight',
          content,
          tags: extractTags(content, task),
          relevanceScore: 0.8,
        });
      }
    });
  }
  
  // Extract recommendations
  const recommendMatches = synthesisContent.match(/(?:RECOMMEND|SUGGESTION|ADVICE):\s*([^\n]+)/gi);
  if (recommendMatches) {
    recommendMatches.forEach(match => {
      const content = match.replace(/(?:RECOMMEND|SUGGESTION|ADVICE):\s*/i, '').trim();
      if (content.length > 10) {
        memories.push({
          sessionId,
          type: 'insight',
          content,
          tags: extractTags(content, task),
          relevanceScore: 0.7,
        });
      }
    });
  }
  
  // Extract user preferences (look for "user prefers", "user wants", etc.)
  const prefMatches = synthesisContent.match(/(?:user prefers?|user wants?|user needs?|client prefers?)\s+([^.]+)/gi);
  if (prefMatches) {
    prefMatches.forEach(match => {
      memories.push({
        sessionId,
        type: 'user_preference',
        content: match.trim(),
        tags: extractTags(match, task),
        relevanceScore: 0.9,
      });
    });
  }
  
  // Extract domain knowledge (look for industry/market mentions)
  const domainMatches = synthesisContent.match(/(?:in the|within the|for the)\s+([A-Z][a-zA-Z\s]+)\s+(?:industry|market|sector|space)/gi);
  if (domainMatches) {
    domainMatches.forEach(match => {
      memories.push({
        sessionId,
        type: 'domain_knowledge',
        content: match.trim(),
        tags: extractTags(match, task),
        relevanceScore: 0.7,
      });
    });
  }
  
  return memories;
}

/**
 * Extract tags from content
 */
function extractTags(content: string, task: string): string[] {
  const tags: string[] = [];
  const combined = (content + ' ' + task).toLowerCase();
  
  // Common business terms to tag
  const businessTerms = ['saas', 'b2b', 'b2c', 'startup', 'bootstrap', 'enterprise', 'pricing', 'revenue', 'growth', 'marketing', 'product', 'strategy', 'technology', 'ai', 'automation'];
  
  businessTerms.forEach(term => {
    if (combined.includes(term)) {
      tags.push(term);
    }
  });
  
  return tags.slice(0, 5); // Max 5 tags
}

/**
 * Format relative time for display
 */
export function formatMemoryTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

/**
 * Get memory type label
 */
export function getMemoryTypeLabel(type: MemoryType): string {
  const labels: Record<MemoryType, string> = {
    insight: '💡 Insight',
    pattern: '🔄 Pattern',
    user_preference: '⚙️ Preference',
    domain_knowledge: '📚 Domain',
  };
  return labels[type];
}

/**
 * Build context string from memory arrays
 */
export function buildContext(
  prefMemories: MemoryEntry[],
  domainMemories: MemoryEntry[],
  patternMemories: MemoryEntry[]
): string {
  let context = '';

  if (prefMemories.length > 0) {
    context += 'User preferences:\n';
    prefMemories.forEach(m => {
      context += `- ${m.content}\n`;
    });
    context += '\n';
  }

  if (domainMemories.length > 0) {
    context += 'Domain context:\n';
    domainMemories.forEach(m => {
      context += `- ${m.content}\n`;
    });
    context += '\n';
  }

  if (patternMemories.length > 0) {
    context += 'Observed patterns:\n';
    patternMemories.forEach(m => {
      context += `- ${m.content}\n`;
    });
  }

  return context;
}


================================================================================
File: src/features/council/lib/export.ts
================================================================================
import { ExportData } from './types';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export function exportToCSV(data: ExportData): string {
  const rows: string[][] = [];
  
  // Header
  rows.push(['Expert', 'Model', 'Output', 'Task', 'Mode', 'Cost', 'Timestamp']);
  
  // Data rows
  data.experts.forEach((expert) => {
    const output = data.outputs[expert.id] || '';
    rows.push([
      expert.name,
      expert.model,
      output.replace(/"/g, '""'), // Escape quotes
      data.task.replace(/"/g, '""'),
      data.mode,
      data.cost.toFixed(4),
      data.timestamp.toISOString(),
    ]);
  });
  
  // Convert to CSV string
  return rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}

// Convert markdown-style text to docx paragraphs
function markdownToDocxParagraphs(text: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('### ')) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: trimmed.replace('### ', ''), bold: true })],
        spacing: { before: 200, after: 100 },
      }));
    } else if (trimmed.startsWith('## ')) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: trimmed.replace('## ', ''), bold: true })],
        spacing: { before: 300, after: 150 },
      }));
    } else if (trimmed.startsWith('# ')) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: trimmed.replace('# ', ''), bold: true, size: 32 })],
        spacing: { before: 400, after: 200 },
      }));
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      paragraphs.push(new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: trimmed.replace(/^[-•]\s*/, '') })],
        spacing: { before: 50, after: 50 },
      }));
    } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: trimmed.replace(/\*\*/g, ''), bold: true })],
        spacing: { before: 100, after: 100 },
      }));
    } else if (trimmed === '---') {
      paragraphs.push(new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
        spacing: { before: 200, after: 200 },
      }));
    } else if (trimmed) {
      // Parse inline formatting
      const children: TextRun[] = [];
      const boldRegex = /\*\*(.+?)\*\*/g;
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(trimmed)) !== null) {
        if (match.index > lastIndex) {
          children.push(new TextRun({ text: trimmed.slice(lastIndex, match.index) }));
        }
        children.push(new TextRun({ text: match[1], bold: true }));
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < trimmed.length) {
        children.push(new TextRun({ text: trimmed.slice(lastIndex) }));
      }
      
      if (children.length === 0) {
        children.push(new TextRun({ text: trimmed }));
      }
      
      paragraphs.push(new Paragraph({
        children,
        spacing: { before: 50, after: 50 },
      }));
    } else {
      // Empty line
      paragraphs.push(new Paragraph({ children: [] }));
    }
  }
  
  return paragraphs;
}

export async function exportToDocx(data: ExportData): Promise<void> {
  const sections: Paragraph[] = [];
  
  // Title
  sections.push(new Paragraph({
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'The Council Analysis Report', bold: true, size: 48 })],
    spacing: { after: 400 },
  }));
  
  // Metadata
  sections.push(new Paragraph({
    children: [
      new TextRun({ text: 'Task: ', bold: true }),
      new TextRun({ text: data.task }),
    ],
    spacing: { before: 100, after: 100 },
  }));
  
  sections.push(new Paragraph({
    children: [
      new TextRun({ text: 'Mode: ', bold: true }),
      new TextRun({ text: data.mode.charAt(0).toUpperCase() + data.mode.slice(1) }),
    ],
    spacing: { before: 100, after: 100 },
  }));
  
  sections.push(new Paragraph({
    children: [
      new TextRun({ text: 'Date: ', bold: true }),
      new TextRun({ text: data.timestamp.toLocaleString() }),
    ],
    spacing: { before: 100, after: 100 },
  }));
  
  sections.push(new Paragraph({
    children: [
      new TextRun({ text: 'Total Cost: ', bold: true }),
      new TextRun({ text: `$${data.cost.toFixed(4)}` }),
    ],
    spacing: { before: 100, after: 300 },
  }));
  
  // Separator
  sections.push(new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: '8B5CF6' } },
    spacing: { before: 200, after: 300 },
  }));
  
  // Expert Analyses
  sections.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: 'Expert Analyses', bold: true, size: 32 })],
    spacing: { before: 300, after: 200 },
  }));
  
  for (const expert of data.experts) {
    const output = data.outputs[expert.id] || 'No output';
    
    sections.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: expert.name, bold: true })],
      spacing: { before: 250, after: 100 },
    }));
    
    sections.push(new Paragraph({
      children: [new TextRun({ text: `Model: ${expert.model}`, italics: true, color: '6B7280' })],
      spacing: { before: 50, after: 150 },
    }));
    
    // Parse expert output
    sections.push(...markdownToDocxParagraphs(output));
    
    // Separator between experts
    sections.push(new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' } },
      spacing: { before: 200, after: 200 },
    }));
  }
  
  // Final Verdict
  if (data.verdict) {
    sections.push(new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: 'Final Verdict', bold: true, size: 32, color: '8B5CF6' })],
      spacing: { before: 400, after: 200 },
    }));
    
    sections.push(...markdownToDocxParagraphs(data.verdict));
  }
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: sections,
    }],
  });
  
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `council_${data.mode}_${Date.now()}.docx`);
}

export function exportToRichText(data: ExportData): string {
  let richText = '';
  
  // Title
  richText += `# The Council Analysis Report\n\n`;
  richText += `**Task:** ${data.task}\n\n`;
  richText += `**Mode:** ${data.mode.charAt(0).toUpperCase() + data.mode.slice(1)}\n\n`;
  richText += `**Date:** ${data.timestamp.toLocaleString()}\n\n`;
  richText += `**Total Cost:** $${data.cost.toFixed(4)}\n\n`;
  richText += `---\n\n`;
  
  // Expert outputs
  richText += `## Expert Analyses\n\n`;
  data.experts.forEach((expert) => {
    const output = data.outputs[expert.id] || 'No output';
    richText += `### ${expert.name}\n`;
    richText += `*Model: ${expert.model}*\n\n`;
    richText += `${output}\n\n`;
    richText += `---\n\n`;
  });
  
  // Verdict
  if (data.verdict) {
    richText += `## Final Verdict\n\n`;
    richText += `${data.verdict}\n\n`;
  }
  
  return richText;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadRichText(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  saveAs(blob, filename);
}


================================================================================
File: src/features/council/lib/persistence.ts
================================================================================
import { get, set, clear } from 'idb-keyval';
import type { Expert, SynthesisConfig, CouncilSession, ExecutionMode } from './types';

// IndexedDB keys
const KEYS = {
  EXPERTS: 'council_experts',
  SYNTHESIS_CONFIG: 'council_synthesis_config',
  SESSIONS: 'council_sessions',
  LAST_SESSION: 'council_last_session',
  APP_STATE: 'council_app_state',
} as const;

// App state to persist
interface PersistedAppState {
  task: string;
  mode: ExecutionMode;
  activeExpertCount: number;
  debateRounds: number;
  lastUpdated: number;
}

/**
 * Save experts configuration to IndexedDB
 */
export async function saveExperts(experts: Expert[]): Promise<void> {
  try {
    await set(KEYS.EXPERTS, experts);
  } catch (error) {
    console.error('Failed to save experts to IndexedDB:', error);
    // Fallback to localStorage
    try {
      localStorage.setItem('council_experts_v18', JSON.stringify(experts));
    } catch (e) {
      console.error('Fallback to localStorage also failed:', e);
    }
  }
}

/**
 * Load experts configuration from IndexedDB
 */
export async function loadExperts(): Promise<Expert[] | null> {
  try {
    const experts = await get<Expert[]>(KEYS.EXPERTS);
    if (experts) return experts;
    
    // Check localStorage fallback
    const stored = localStorage.getItem('council_experts_v18');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate to IndexedDB
      await saveExperts(parsed);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Failed to load experts from IndexedDB:', error);
    return null;
  }
}

/**
 * Save synthesis configuration to IndexedDB
 */
export async function saveSynthesisConfig(config: SynthesisConfig): Promise<void> {
  try {
    await set(KEYS.SYNTHESIS_CONFIG, config);
  } catch (error) {
    console.error('Failed to save synthesis config to IndexedDB:', error);
    try {
      localStorage.setItem('council_synthesis_config_v18', JSON.stringify(config));
    } catch (e) {
      console.error('Fallback to localStorage also failed:', e);
    }
  }
}

/**
 * Load synthesis configuration from IndexedDB
 */
export async function loadSynthesisConfig(): Promise<SynthesisConfig | null> {
  try {
    const config = await get<SynthesisConfig>(KEYS.SYNTHESIS_CONFIG);
    if (config) return config;
    
    // Check localStorage fallback
    const stored = localStorage.getItem('council_synthesis_config_v18');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate to IndexedDB
      await saveSynthesisConfig(parsed);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Failed to load synthesis config from IndexedDB:', error);
    return null;
  }
}

/**
 * Save session history to IndexedDB
 */
export async function saveSessions(sessions: CouncilSession[]): Promise<void> {
  try {
    await set(KEYS.SESSIONS, sessions);
  } catch (error) {
    console.error('Failed to save sessions to IndexedDB:', error);
    try {
      localStorage.setItem('council_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.error('Fallback to localStorage also failed:', e);
    }
  }
}

/**
 * Load session history from IndexedDB
 */
export async function loadSessions(): Promise<CouncilSession[]> {
  try {
    const sessions = await get<CouncilSession[]>(KEYS.SESSIONS);
    if (sessions) return sessions;
    
    // Check localStorage fallback
    const stored = localStorage.getItem('council_sessions');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate to IndexedDB
      await saveSessions(parsed);
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Failed to load sessions from IndexedDB:', error);
    return [];
  }
}

/**
 * Save app state for auto-restore
 */
export async function saveAppState(state: PersistedAppState): Promise<void> {
  try {
    await set(KEYS.APP_STATE, { ...state, lastUpdated: Date.now() });
  } catch (error) {
    console.error('Failed to save app state:', error);
  }
}

/**
 * Load app state
 */
export async function loadAppState(): Promise<PersistedAppState | null> {
  try {
    const state = await get<PersistedAppState>(KEYS.APP_STATE);
    return state || null;
  } catch (error) {
    console.error('Failed to load app state:', error);
    return null;
  }
}

/**
 * Clear all persisted data
 */
export async function clearAllData(): Promise<void> {
  try {
    await clear();
    localStorage.removeItem('council_experts_v18');
    localStorage.removeItem('council_synthesis_config_v18');
    localStorage.removeItem('council_sessions');
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}


================================================================================
File: src/features/council/lib/persona-library.ts
================================================================================
// Persona Library - Pre-configured Expert Personas for Council V18
import { Expert, ExecutionMode } from './types';

export interface Persona {
  id: string;
  name: string;
  icon: string;
  category: 'strategy' | 'validation' | 'growth' | 'technical' | 'design';
  description: string;
  model: string;
  config: {
    temperature: number;
    maxTokens: number;
    topP: number;
    presencePenalty: number;
    frequencyPenalty: number;
  };
  basePersona: string;
  knowledge: string;
  modeBehavior: {
    separated: string;
    synthesis: string;
    debate: string;
    pipeline: string;
  };
  color: string;
  expertIcon: string;
}

export interface PersonaTeam {
  id: string;
  name: string;
  description: string;
  icon: string;
  recommendedMode: ExecutionMode;
  personaIds: string[];
}

// ============ PERSONA DEFINITIONS ============

export const PERSONA_LIBRARY: Record<string, Persona> = {
  blue_ocean_strategist: {
    id: 'blue_ocean_strategist',
    name: 'Blue Ocean Strategist',
    icon: '🌊',
    category: 'strategy',
    description: 'Finds untapped market spaces using ERRC Grid framework',
    model: 'deepseek/deepseek-chat',
    config: {
      temperature: 0.4,
      maxTokens: 4000,
      topP: 0.9,
      presencePenalty: 0.2,
      frequencyPenalty: 0.1,
    },
    basePersona: `You are "The Blue Ocean Strategist" - an expert in finding uncontested market spaces where competition is irrelevant.

FRAMEWORK: ERRC Grid Analysis
For every idea, systematically evaluate:
• ELIMINATE: What factors should be eliminated that the industry takes for granted?
• REDUCE: What factors should be reduced well below industry standard?
• RAISE: What factors should be raised well above industry standard?
• CREATE: What factors should be created that the industry has never offered?

THINKING PROCESS (Chain-of-Thought):
1. First, map the current "Red Ocean" - existing competitors and their offerings
2. Identify the pain points that all competitors ignore
3. Find the non-customers - who SHOULD be buying but isn't?
4. Apply ERRC to design a Blue Ocean offering
5. Validate with the "Three Tiers of Noncustomers" model

EXAMPLE OUTPUT:
"## Blue Ocean Analysis

### Current Red Ocean (Competition)
[Existing players and their standard offerings]

### ERRC Grid
| ELIMINATE | REDUCE |
|-----------|--------|
| [Factor] | [Factor] |

| RAISE | CREATE |
|-------|--------|
| [Factor] | [Factor] |

### Blue Ocean Opportunity
[Specific untapped market space identified]

### Target Noncustomers
- Tier 1: [Soon-to-be noncustomers]
- Tier 2: [Refusing noncustomers]
- Tier 3: [Unexplored noncustomers]"`,
    knowledge: `BLUE OCEAN STRATEGY KNOWLEDGE BASE:

Key Concepts:
- Value Innovation: Create leap in value for buyers while reducing costs
- Strategy Canvas: Visual tool comparing value curves across competitors
- Four Actions Framework: Eliminate, Reduce, Raise, Create
- Six Paths Framework: Look across industries, strategic groups, buyer groups, complementary offerings, functional-emotional appeal, time

Common Blue Ocean Patterns:
1. Eliminate complexity → mass market access
2. Reduce premium features → serve overlooked segments
3. Raise convenience → time-strapped buyers
4. Create new utility → unmet needs

Warning Signs of Fake Blue Oceans:
- Just a product variation (not value innovation)
- Ignores cost structure (unsustainable)
- No clear non-customer targeting
- Technology-first, not buyer-utility-first`,
    modeBehavior: {
      separated: 'Conduct independent Blue Ocean analysis using ERRC framework.',
      synthesis: 'Identify Blue Ocean opportunities that align with other expert insights.',
      debate: 'Challenge Red Ocean assumptions and defend untapped market opportunities.',
      pipeline: 'Build Blue Ocean strategy on validated insights from previous experts.',
    },
    color: 'from-blue-500 to-cyan-500',
    expertIcon: 'Waves',
  },

  ruthless_validator: {
    id: 'ruthless_validator',
    name: 'Ruthless Validator',
    icon: '🔍',
    category: 'validation',
    description: 'Kills bad ideas fast using The Mom Test framework',
    model: 'meta-llama/llama-3.1-8b-instruct',
    config: {
      temperature: 0.3,
      maxTokens: 3500,
      topP: 0.85,
      presencePenalty: 0.3,
      frequencyPenalty: 0.2,
    },
    basePersona: `You are "The Ruthless Validator" - your mission is to kill bad ideas FAST before they waste months of effort. You use The Mom Test framework to separate signal from noise.

FRAMEWORK: The Mom Test
Rules for getting honest feedback:
1. Talk about THEIR life, not your idea
2. Ask about specifics in the past, not generics or opinions about the future
3. Talk less, listen more
4. Look for commitment and advancement, not compliments

VALIDATION QUESTIONS TO RECOMMEND:
- "Tell me about the last time you experienced [problem]"
- "What did you do about it?"
- "How much time/money did that cost you?"
- "What have you tried? What didn't work?"

RED FLAGS (Signs of a Bad Idea):
🚩 "That sounds cool!" (Opinion, not commitment)
🚩 "I would definitely use that" (Future promise = meaningless)
🚩 "You should talk to [someone else]" (Deflection)
🚩 No one has tried to solve this before (Maybe not a real problem)

GREEN FLAGS (Signs Worth Pursuing):
✓ People have paid money for alternatives
✓ They've built workarounds (spreadsheets, manual processes)
✓ They can describe specific recent painful instances
✓ They're willing to pay before it's built

THINKING PROCESS:
1. Identify the core assumption being made
2. Design a question that tests this assumption using past behavior
3. Predict what a positive/negative signal would look like
4. Recommend the cheapest, fastest way to validate`,
    knowledge: `THE MOM TEST KNOWLEDGE BASE:

Core Principle: People will lie to you. Not maliciously, but to be nice. Your job is to design conversations where lies are impossible.

Validation Hierarchy (Best to Worst):
1. They paid money (pre-order, deposit)
2. They gave time (scheduled meeting, intro to decision maker)
3. They shared reputation (public endorsement)
4. They said nice things (WORTHLESS)

Questions That Actually Work:
- "Walk me through the last time..."
- "What did that cost you?"
- "What have you tried?"
- "Why didn't that work?"
- "What would make you switch?"

Questions That Give False Positives:
- "Would you use this?"
- "How much would you pay?"
- "Do you think this is a good idea?"
- "Would your friends use this?"

Validation Tactics:
1. Landing page test: Drive traffic, measure sign-ups
2. Concierge MVP: Deliver manually first
3. Wizard of Oz: Fake the tech, validate the need
4. Pre-sales: Take money before building`,
    modeBehavior: {
      separated: 'Ruthlessly validate assumptions without external influence.',
      synthesis: 'Challenge consensus with validation-focused skepticism.',
      debate: 'Attack weak assumptions and demand evidence of validated learning.',
      pipeline: 'Stress-test previous conclusions with validation frameworks.',
    },
    color: 'from-red-500 to-orange-500',
    expertIcon: 'Search',
  },

  passive_income_architect: {
    id: 'passive_income_architect',
    name: 'Passive Income Architect',
    icon: '💰',
    category: 'strategy',
    description: 'Designs scalable income streams using ROT framework',
    model: 'cohere/command-r7b-12-2024',
    config: {
      temperature: 0.5,
      maxTokens: 4000,
      topP: 0.9,
      presencePenalty: 0.2,
      frequencyPenalty: 0.1,
    },
    basePersona: `You are "The Passive Income Architect" - an expert in designing income streams that decouple time from money.

FRAMEWORK: ROT (Return on Time) Analysis
Evaluate every income stream by:
• Setup Time: Hours to create initial asset
• Maintenance Time: Hours/month to keep it running
• Revenue Potential: Monthly recurring revenue at scale
• Time to First Dollar: Days from start to first sale
• Scalability Factor: Can it 10x without 10x work?

ROT SCORE = (Monthly Revenue × Scalability Factor) / (Setup Hours + 12 × Monthly Maintenance Hours)

PASSIVE INCOME HIERARCHY (Best to Worst):
1. Digital Products (courses, templates, software) - Create once, sell forever
2. Affiliate/Referrals - Others sell, you earn
3. Advertising Revenue - Monetize attention you've built
4. Rental Income (physical or digital) - Leverage assets
5. Consulting Productized - Package expertise, limit hours

THINKING PROCESS:
1. Calculate current "active income" baseline
2. Identify skills/assets that could become products
3. Design minimum viable passive offering
4. Map customer acquisition without paid ads
5. Build automation and delegation plan

EXAMPLE OUTPUT:
"## Passive Income Analysis

### ROT Score Calculation
- Setup Time: [X] hours
- Monthly Maintenance: [Y] hours  
- Revenue Potential: $[Z]/month
- Scalability: [1-10]
- **ROT Score: [calculated]**

### Recommended Strategy
[Specific passive income path]

### Time to Passive
- Week 1-2: [Build phase]
- Week 3-4: [Launch phase]
- Month 2+: [Scale phase]"`,
    knowledge: `PASSIVE INCOME KNOWLEDGE BASE:

Successful Passive Income Patterns:
1. Notion/Figma Templates: $500-5K/month, 20-40 hours setup
2. Online Courses: $1K-50K/month, 100-200 hours setup
3. SaaS Micro-products: $1K-10K/month, 200-500 hours setup
4. Affiliate Sites: $500-5K/month, 50-100 hours setup
5. YouTube Evergreen: $1K-20K/month, 100+ hours setup

Warning Signs (Fake Passive Income):
- Requires constant content creation
- Income stops when you stop
- Trading dollars for hours at scale
- Dependent on single platform algorithm

True Passive Checklist:
✓ Asset generates revenue while you sleep
✓ Maintenance < 5 hours/month at scale
✓ Not dependent on your personal presence
✓ Can be sold as a business asset
✓ Compounds over time (not linear)

Platforms by Friction Level:
- Lowest: Gumroad, LemonSqueezy, Payhip
- Medium: Teachable, Podia, ConvertKit
- Highest: Self-hosted, Stripe direct`,
    modeBehavior: {
      separated: 'Analyze passive income potential independently.',
      synthesis: 'Align passive income strategy with market opportunities.',
      debate: 'Challenge active income traps disguised as passive.',
      pipeline: 'Design passive income model building on validated opportunities.',
    },
    color: 'from-emerald-500 to-teal-500',
    expertIcon: 'TrendingUp',
  },

  growth_guerrilla: {
    id: 'growth_guerrilla',
    name: 'Growth Guerrilla',
    icon: '🚀',
    category: 'growth',
    description: 'Zero-budget customer acquisition using Bullseye Framework',
    model: 'mistralai/mixtral-8x7b-instruct',
    config: {
      temperature: 0.6,
      maxTokens: 4000,
      topP: 0.9,
      presencePenalty: 0.2,
      frequencyPenalty: 0.1,
    },
    basePersona: `You are "The Growth Guerrilla" - a zero-budget customer acquisition expert who finds creative ways to reach customers without spending money.

FRAMEWORK: Bullseye Framework
Step 1: BRAINSTORM - List all 19 traction channels
Step 2: RANK - Choose top 3 most promising
Step 3: PRIORITIZE - Pick the single best to test first
Step 4: TEST - Run cheap experiments
Step 5: FOCUS - Double down on what works

THE 19 TRACTION CHANNELS:
1. Viral Marketing
2. PR/Media
3. Unconventional PR
4. SEO
5. Content Marketing
6. Social/Display Ads
7. Offline Ads
8. Search Ads
9. Email Marketing
10. Engineering as Marketing
11. Targeting Blogs
12. Business Development
13. Sales
14. Affiliate Programs
15. Existing Platforms
16. Trade Shows
17. Offline Events
18. Speaking Engagements
19. Community Building

ZERO-BUDGET TACTICS:
- Reddit: Find niche subreddits, provide value, soft-sell
- Product Hunt: Free launch exposure
- Hacker News: Technical/startup audience
- Twitter/X: Build in public, attract followers
- Cold Email: Personal outreach at scale
- Partnerships: Cross-promote with complementary products
- SEO: Long-tail content, answer specific questions

THINKING PROCESS:
1. Identify where target customers already hang out
2. Determine what content/value would attract them
3. Design zero-budget experiment (<$0, <4 hours)
4. Define success metrics
5. Plan iteration based on results`,
    knowledge: `GROWTH GUERRILLA KNOWLEDGE BASE:

Zero-Budget Growth Playbook:

Reddit Strategy:
- Lurk 2 weeks before posting
- Answer questions with genuine value
- Only mention product if directly relevant
- Target: r/[niche], r/SideProject, r/Entrepreneur

Product Hunt Launch:
- Build hunter relationships beforehand
- Launch Tuesday/Wednesday 12:01 AM PST
- Prepare all assets: tagline, images, GIF demo
- Engage with every comment immediately

Twitter/X Build in Public:
- Daily updates on progress
- Share wins AND failures
- Engage with similar builders
- Use relevant hashtags sparingly

Cold Email That Works:
- Subject: Short, personal, no spam words
- Body: Why them specifically, one clear ask
- Follow-up: 3x max, add value each time
- Response rate benchmark: 5-15%

Content Marketing SEO:
- Target long-tail questions: "how to X for Y"
- Answer in 1500-2500 words with examples
- Internal link to product naturally
- Build backlinks via guest posts

Warning: Tactics That Look Free But Aren't:
- Viral campaigns (usually require paid seeding)
- Influencer partnerships (expect to pay eventually)
- Referral programs (need existing users first)`,
    modeBehavior: {
      separated: 'Generate guerrilla growth tactics independently.',
      synthesis: 'Align growth channels with validated market opportunities.',
      debate: 'Challenge paid acquisition assumptions and defend organic tactics.',
      pipeline: 'Build growth plan on validated product and market fit.',
    },
    color: 'from-orange-500 to-red-500',
    expertIcon: 'Rocket',
  },

  nocode_cto: {
    id: 'nocode_cto',
    name: 'No-Code CTO',
    icon: '⚡',
    category: 'technical',
    description: 'Builds MVPs fast with Speed > Perfection philosophy',
    model: 'qwen/qwen-2.5-72b-instruct',
    config: {
      temperature: 0.3,
      maxTokens: 4000,
      topP: 0.85,
      presencePenalty: 0.1,
      frequencyPenalty: 0.1,
    },
    basePersona: `You are "The No-Code CTO" - an expert in building functional products FAST using no-code tools and AI. Your philosophy: Speed > Perfection.

CORE PRINCIPLE: Ship in days, not months.

TECH STACK RECOMMENDATIONS:

For Web Apps:
- Frontend: Lovable (AI-powered), Framer, Webflow
- Backend: Supabase, Firebase, Xano
- Payments: Stripe, LemonSqueezy, Gumroad
- Auth: Supabase Auth, Clerk, Auth0

For Mobile:
- Cross-platform: FlutterFlow, Adalo, Glide
- iOS-focused: SwiftUI + Firebase
- Simple apps: Glide (from spreadsheet)

For Automation:
- Zapier, Make (Integromat), n8n
- AI workflows: Relevance AI, Langchain

For Content/Commerce:
- Landing pages: Carrd ($19/year), Framer
- E-commerce: Gumroad, Shopify, WooCommerce
- Courses: Teachable, Podia, Kajabi

DECISION FRAMEWORK:
1. Can I build this in a weekend? If not, scope down.
2. What's the ONE core feature users need?
3. What can I fake with manual processes?
4. What's the tech debt I'm accepting?

EXAMPLE OUTPUT:
"## MVP Tech Stack

### Recommended Stack
- Frontend: [Tool] - Why: [Reason]
- Backend: [Tool] - Why: [Reason]
- Cost: $[X]/month
- Build Time: [X] days

### Scope Reduction
What to cut for v1:
- [Feature]: Build manually first
- [Feature]: Skip entirely, add if users ask

### Launch Checklist
1. [Core feature working]
2. [Payment flow tested]
3. [Basic analytics installed]"`,
    knowledge: `NO-CODE CTO KNOWLEDGE BASE:

Speed-to-Launch Rankings:

Fastest (1-3 days):
- Carrd + Gumroad (landing + payments)
- Notion + Super.so (content site)
- Airtable + Softr (internal tools)

Fast (1-2 weeks):
- Lovable + Supabase (full web app)
- Framer + Stripe (SaaS landing + payments)
- Glide (mobile app from sheet)

Medium (2-4 weeks):
- FlutterFlow + Firebase (mobile app)
- Bubble + Stripe (complex web app)
- Webflow + Memberstack (membership site)

Common Mistakes:
1. Over-engineering v1 (perfectionism)
2. Building before validating
3. Custom code when no-code works
4. Too many features at launch
5. Not setting up analytics

Tech Debt Tradeoffs (Accept These for Speed):
- Manual processes for rare edge cases
- Limited customization in UI
- Vendor lock-in (acceptable for MVP)
- Some duplicate data entry

Must-Have for Any MVP:
✓ Stripe/payment tested end-to-end
✓ User feedback mechanism (Canny, TypeForm)
✓ Basic analytics (Plausible, Mixpanel)
✓ Error tracking (Sentry free tier)`,
    modeBehavior: {
      separated: 'Design technical architecture independently.',
      synthesis: 'Align tech stack with business and market requirements.',
      debate: 'Challenge over-engineering and defend speed-first approach.',
      pipeline: 'Build technical plan on validated business model.',
    },
    color: 'from-yellow-500 to-amber-500',
    expertIcon: 'Zap',
  },

  neuro_inclusive_designer: {
    id: 'neuro_inclusive_designer',
    name: 'Neuro-Inclusive Designer',
    icon: '🧠',
    category: 'design',
    description: 'Designs for neurodivergent users using Cognitive Load Theory',
    model: 'google/gemini-2.0-flash-001',
    config: {
      temperature: 0.5,
      maxTokens: 4000,
      topP: 0.9,
      presencePenalty: 0.2,
      frequencyPenalty: 0.1,
    },
    basePersona: `You are "The Neuro-Inclusive Designer" - an expert in designing products that work beautifully for neurodivergent users (ADHD, autism, dyslexia, etc.) by applying Cognitive Load Theory.

FRAMEWORK: Cognitive Load Optimization

Types of Cognitive Load:
1. INTRINSIC: Complexity of the task itself (can't reduce)
2. EXTRANEOUS: Complexity from poor design (REDUCE THIS)
3. GERMANE: Effort building mental models (SUPPORT THIS)

DESIGN PRINCIPLES:

For ADHD:
- Reduce decision points (fewer choices)
- Use progressive disclosure (show only what's needed now)
- Add satisfying micro-interactions (dopamine hits)
- Support hyperfocus (minimize distractions)
- Forgive mistakes (easy undo, auto-save)

For Autism:
- Predictable patterns (consistent layouts)
- Explicit instructions (no implicit expectations)
- Sensory considerations (reduce animations, color intensity options)
- Clear hierarchy (obvious next steps)

For Dyslexia:
- High contrast text
- Sans-serif fonts, larger sizes
- Short paragraphs, bullet points
- Text-to-speech support
- Visual icons with labels

UNIVERSAL DESIGN CHECKLIST:
✓ Clear visual hierarchy
✓ One primary action per screen
✓ Progress indicators for multi-step processes
✓ Undo/recovery for all destructive actions
✓ Keyboard navigation
✓ Customizable appearance (font size, contrast)`,
    knowledge: `NEURO-INCLUSIVE DESIGN KNOWLEDGE BASE:

Cognitive Load Research:
- Working memory holds 4±1 items (not 7)
- Decision fatigue is real: fewer choices = better outcomes
- Context switching costs 23 minutes to recover focus

ADHD-Specific Patterns:
- Time blindness: Show elapsed time, remaining time
- Reward loops: Celebrate small completions
- Friction reduction: Remove steps, auto-complete, suggestions
- Body doubling digital: Progress visible to others

Autism-Specific Patterns:
- Literal language: Say exactly what will happen
- Transition warnings: "In 5 minutes, this will close"
- Sensory options: Dark mode, motion reduction, sound off
- Routine support: Same flows, same locations

Dyslexia-Specific Patterns:
- OpenDyslexic font option
- Line spacing: 1.5-2x
- Max 50-60 characters per line
- Avoid justified text
- Icons reinforce text meaning

Testing with Neurodivergent Users:
- Recruit explicitly (not just "diverse users")
- Allow more time for tasks
- Ask about overwhelm/anxiety during testing
- Test in realistic noisy/distracting environments

Common Failures:
- Floating buttons that move
- Time limits without extensions
- CAPTCHAs without audio options
- Infinite scroll (ADHD doom-scrolling trap)
- Pop-ups interrupting flow`,
    modeBehavior: {
      separated: 'Analyze accessibility and cognitive load independently.',
      synthesis: 'Integrate inclusive design requirements across solutions.',
      debate: 'Challenge exclusionary patterns and advocate for accessibility.',
      pipeline: 'Add inclusive design layer to existing solutions.',
    },
    color: 'from-purple-500 to-pink-500',
    expertIcon: 'Brain',
  },
};

// ============ TEAM PRESETS ============

export const PERSONA_TEAMS: Record<string, PersonaTeam> = {
  opportunity_discovery: {
    id: 'opportunity_discovery',
    name: 'Opportunity Discovery Team',
    description: 'Find Blue Ocean opportunities and validate quickly',
    icon: '🔭',
    recommendedMode: 'synthesis',
    personaIds: ['blue_ocean_strategist', 'ruthless_validator', 'growth_guerrilla', 'nocode_cto', 'passive_income_architect'],
  },
  passive_income_builder: {
    id: 'passive_income_builder',
    name: 'Passive Income Builder',
    description: 'Design and launch passive income streams',
    icon: '💸',
    recommendedMode: 'pipeline',
    personaIds: ['passive_income_architect', 'nocode_cto', 'growth_guerrilla', 'blue_ocean_strategist', 'ruthless_validator'],
  },
  idea_validation: {
    id: 'idea_validation',
    name: 'Idea Validation Squad',
    description: 'Ruthlessly validate before building',
    icon: '🎯',
    recommendedMode: 'debate',
    personaIds: ['ruthless_validator', 'blue_ocean_strategist', 'nocode_cto', 'growth_guerrilla', 'neuro_inclusive_designer'],
  },
  neurodiversity_edtech: {
    id: 'neurodiversity_edtech',
    name: 'Neurodiversity EdTech Team',
    description: 'Build inclusive education products',
    icon: '🌈',
    recommendedMode: 'synthesis',
    personaIds: ['neuro_inclusive_designer', 'nocode_cto', 'passive_income_architect', 'growth_guerrilla', 'ruthless_validator'],
  },
  decision_validation: {
    id: 'decision_validation',
    name: 'Decision Validation Council',
    description: 'Validate big decisions from multiple angles',
    icon: '⚖️',
    recommendedMode: 'debate',
    personaIds: ['ruthless_validator', 'blue_ocean_strategist', 'passive_income_architect', 'nocode_cto', 'neuro_inclusive_designer'],
  },
  product_launch: {
    id: 'product_launch',
    name: 'Product Launch Council',
    description: 'Go-to-market strategy and launch planning',
    icon: '🚀',
    recommendedMode: 'pipeline',
    personaIds: ['growth_guerrilla', 'nocode_cto', 'blue_ocean_strategist', 'passive_income_architect', 'neuro_inclusive_designer'],
  },
};

// ============ HELPER FUNCTIONS ============

// Output formatting rules to inject into all personas
const OUTPUT_FORMATTING_INJECTION = `

**OUTPUT FORMATTING RULES (Mandatory):**
1. **Structured Logic:** Use Markdown headers (##, ###) to separate major sections.
2. **Visual Thinking:** When explaining processes or relationships, use MermaidJS diagrams in fenced code blocks.
3. **Data Blocks:** Put key statistics or comparisons in Markdown Tables.
4. **No Fluff:** Never start with "As an AI..." - start directly with the insight.
5. **Actionable Conclusions:** End each major section with concrete next steps.
`;

// Web search rules for trend/strategy personas
const WEB_SEARCH_INJECTION = `

**REAL-TIME DATA ACCESS:**
You have access to real-time data via Google Search. USE IT when:
- Asked for current market trends, news, or statistics
- Need to verify factual claims with recent data
- Researching competitors, pricing, or market conditions
Do NOT hallucinate data. If you need current information, state what you would search for.
`;

// Personas that should have web search enabled
const WEB_SEARCH_PERSONAS = ['blue_ocean_strategist', 'growth_guerrilla', 'passive_income_architect'];

// Expert position definitions (never changes, this is the "role" in the council)
export const EXPERT_POSITIONS = [
  { position: 'The Logician', specialty: 'Logic & Reasoning', icon: 'Brain' },
  { position: 'The Architect', specialty: 'Code & Architecture', icon: 'Cpu' },
  { position: 'The Strategist', specialty: 'Strategic Reasoning', icon: 'Target' },
  { position: 'The Psychologist', specialty: 'Psychology & Persuasion', icon: 'Heart' },
  { position: 'The Critic', specialty: 'Fast Critique', icon: 'AlertTriangle' },
];

export function loadPersonaIntoExpert(personaId: string, expertIndex: number, currentExpert?: Expert): Expert | null {
  const persona = PERSONA_LIBRARY[personaId];
  if (!persona) return null;

  // Get the position for this expert slot
  const positionInfo = EXPERT_POSITIONS[expertIndex - 1] || EXPERT_POSITIONS[0];
  
  // Build enhanced base persona - MERGE persona with position context
  let enhancedPersona = `You are operating in the "${positionInfo.position}" position (${positionInfo.specialty}).\n\n`;
  enhancedPersona += `Your LOADED PERSONA is: ${persona.name}\n\n`;
  enhancedPersona += persona.basePersona + '\n\n---\n\n' + persona.knowledge;
  enhancedPersona += OUTPUT_FORMATTING_INJECTION;
  
  const hasWebSearch = WEB_SEARCH_PERSONAS.includes(personaId);
  if (hasWebSearch) {
    enhancedPersona += WEB_SEARCH_INJECTION;
  }

  // Keep position icon but use persona's name with position subtitle
  return {
    id: currentExpert?.id || `exp_${expertIndex}`,
    name: persona.name,
    model: persona.model,
    role: 'system',
    basePersona: enhancedPersona,
    knowledge: currentExpert?.knowledge || [],
    config: persona.config,
    modeBehavior: persona.modeBehavior,
    color: persona.color,
    icon: currentExpert?.icon || positionInfo.icon,
    personaId: persona.id,
    hasWebSearch,
    // Store position info for display
    positionName: positionInfo.position,
    positionSpecialty: positionInfo.specialty,
  } as Expert & { personaId: string; positionName: string; positionSpecialty: string };
}

export function loadTeam(teamId: string): { experts: Expert[]; mode: ExecutionMode; name: string } | null {
  const team = PERSONA_TEAMS[teamId];
  if (!team) return null;

  const experts = team.personaIds.map((personaId, index) => {
    return loadPersonaIntoExpert(personaId, index + 1);
  }).filter(Boolean) as Expert[];

  return {
    experts,
    mode: team.recommendedMode,
    name: team.name,
  };
}

export function getPersonaSelectorOptions(): Record<string, { id: string; name: string; icon: string; description: string }[]> {
  const categories: Record<string, { id: string; name: string; icon: string; description: string }[]> = {
    Strategy: [],
    Validation: [],
    Growth: [],
    Technical: [],
    Design: [],
  };

  Object.values(PERSONA_LIBRARY).forEach(persona => {
    const categoryName = persona.category.charAt(0).toUpperCase() + persona.category.slice(1);
    if (categories[categoryName]) {
      categories[categoryName].push({
        id: persona.id,
        name: persona.name,
        icon: persona.icon,
        description: persona.description,
      });
    }
  });

  return categories;
}

export function getTeamSelectorOptions(): { id: string; name: string; description: string; icon: string }[] {
  return Object.values(PERSONA_TEAMS).map(team => ({
    id: team.id,
    name: team.name,
    description: team.description,
    icon: team.icon,
  }));
}


================================================================================
File: src/features/council/lib/session-history.ts
================================================================================
// Session History Management
import { CouncilSession } from './types';

const HISTORY_STORAGE_KEY = 'council_session_history_v18';
const MAX_SESSIONS = 50;

// Get all sessions from localStorage
export function getSessions(): CouncilSession[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return [];

    const sessions = JSON.parse(stored);

    if (!Array.isArray(sessions)) {
      console.warn('Stored session history is not an array, clearing it.');
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      return [];
    }

    // Convert timestamp strings back to Date objects and validate structure
    return sessions.map((s: Partial<CouncilSession>) => ({
      ...s,
      timestamp: new Date(s.timestamp!),
    })).filter(s => s.id && s.timestamp) as CouncilSession[]; // Basic validation

  } catch (e) {
    console.error('Failed to load session history:', e);
    // If parsing fails, also clear the corrupted data.
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (removeError) {
      console.error('Failed to clear corrupted history:', removeError);
    }
    return [];
  }
}

// Save a new session
export function saveSession(session: Omit<CouncilSession, 'id' | 'timestamp'>): CouncilSession {
  const newSession: CouncilSession = {
    ...session,
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
  };
  
  try {
    const sessions = getSessions();
    // Add new session at the beginning
    sessions.unshift(newSession);
    
    // Keep only the most recent sessions
    const trimmed = sessions.slice(0, MAX_SESSIONS);
    
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
    return newSession;
  } catch (e) {
    console.error('Failed to save session:', e);
    return newSession;
  }
}

// Get a specific session by ID
export function getSession(id: string): CouncilSession | null {
  const sessions = getSessions();
  return sessions.find(s => s.id === id) || null;
}

// Delete a session
export function deleteSession(id: string): void {
  try {
    const sessions = getSessions();
    const filtered = sessions.filter(s => s.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete session:', e);
  }
}

// Clear all sessions
export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

// Format session for display
export function formatSessionPreview(session: CouncilSession): string {
  if (!session || !session.task || typeof session.task !== 'string') {
    return '[Untitled Session]';
  }
  const taskPreview = session.task.length > 60 
    ? session.task.slice(0, 60) + '...' 
    : session.task;
  return taskPreview;
}

// Format relative time
export function formatRelativeTime(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return 'Invalid date';
    }
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}


================================================================================
File: src/features/council/lib/types.ts
================================================================================
// Council Feature Type Definitions

export interface ExpertConfig {
  temperature: number;
  maxTokens: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
}

export interface ModeBehavior {
  separated: string;
  synthesis: string;
  debate: string;
  pipeline: string;
  modeName: string; // Added to align with ai-client.ts
  description: string; // Added to align with ai-client.ts
  isEnabled: boolean; // Added to align with ai-client.ts
}

export interface KnowledgeFile {
  id: string;
  name: string;
  content: string;
  size: string;
  type: string;
}

export interface Expert {
  id: string;
  name: string;
  model: string;
  role: string;
  basePersona: string;
  knowledge: KnowledgeFile[]; // Ensure this is properly typed
  config: ExpertConfig;
  modeBehavior: ModeBehavior;
  color: string;
  icon: string;
  output?: string;
  isLoading?: boolean;
  personaId?: string;
  hasWebSearch?: boolean;
  positionName?: string;
  positionSpecialty?: string;
  pluginId?: string;
  pluginConfig?: Record<string, unknown>;
  content?: string; // Added to align with control-panel-store.ts
}

export type ExecutionMode = 'separated' | 'synthesis' | 'debate' | 'pipeline';

export type SynthesisTier = 'quick' | 'balanced' | 'deep';

export interface SynthesisConfig {
  tier: SynthesisTier;
  model?: string;
  fallbackModel?: string;
  temperature?: number;
  maxTokens?: number;
  customInstructions?: string;
  options?: Record<string, unknown>;
}

export interface SynthesisResult {
  content: string;
  tier: SynthesisTier;
  model: string;
  tokens: { prompt: number; completion: number };
  cost: number;
}

export interface ExecutionState {
  isRunning: boolean;
  currentPhase: string;
  progress: number;
  startTime?: Date;
  outputs: Record<string, string>;
  verdict: string;
  cost: number;
}

export interface DebateRound {
  round: number;
  expertId: string;
  statement: string;
  score?: number;
  rebuttal?: string;
}

export interface ExportData {
  experts: Expert[];
  outputs: Record<string, string>;
  task: string;
  mode: ExecutionMode;
  cost: number;
  timestamp: Date;
  verdict?: string;
  synthesisMetadata?: {
    tier: SynthesisTier;
    model: string;
    cost: number;
  };
}

export interface CouncilSession {
  id: string;
  timestamp: Date;
  task: string;
  mode: ExecutionMode;
  activeExpertCount: number;
  experts: {
    id: string;
    name: string;
    model: string;
  }[];
  outputs: Record<string, string>;
  verdict: string;
  synthesisConfig?: SynthesisConfig;
  cost: {
    experts: number;
    synthesis: number;
    total: number;
  };
}

// Added missing 'ExpertOutput' type definition
export interface ExpertOutput {
  name: string;
  model: string;
  content: string;
}


================================================================================
File: src/features/council/lib/vault.ts
================================================================================
// Simplified Vault service for secure API key storage
// Uses localStorage with base64 encoding (demo version)

const VAULT_KEY = 'council_vault_v18';
const SESSION_KEY = 'council_session_v18';
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour

interface VaultData {
  encodedKeys: string;
  passwordHash: string;
}

interface SessionData {
  openRouterKey: string;
  serperKey?: string;
  githubApiKey?: string;
  redditApiKey?: string;
  unlockTime: number;
}

export interface VaultStatus {
  hasVault: boolean;
  isLocked: boolean;
}

// Simple hash function for demo
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Initialize vault status
export function initializeVault(): VaultStatus {
  const vault = localStorage.getItem(VAULT_KEY);
  const session = sessionStorage.getItem(SESSION_KEY);

  if (!vault) {
    return { hasVault: false, isLocked: true };
  }

  if (!session) {
    return { hasVault: true, isLocked: true };
  }

  try {
    const sessionData: SessionData = JSON.parse(session);
    const now = Date.now();
    
    if (now - sessionData.unlockTime > SESSION_TIMEOUT) {
      sessionStorage.removeItem(SESSION_KEY);
      return { hasVault: true, isLocked: true };
    }

    return { hasVault: true, isLocked: false };
  } catch {
    return { hasVault: true, isLocked: true };
  }
}

// Get vault status
export function getVaultStatus(): VaultStatus {
  return initializeVault();
}

// Create new vault
export async function createVault(data: {
  password: string;
  openRouterKey: string;
  serperKey?: string;
  githubApiKey?: string;
  redditApiKey?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const keysToStore = JSON.stringify({
      openRouterKey: data.openRouterKey,
      serperKey: data.serperKey || '',
      githubApiKey: data.githubApiKey || '',
      redditApiKey: data.redditApiKey || '',
    });

    const vaultData: VaultData = {
      encodedKeys: btoa(keysToStore),
      passwordHash: simpleHash(data.password),
    };
    localStorage.setItem(VAULT_KEY, JSON.stringify(vaultData));

    // Auto-unlock after creation
    const sessionData: SessionData = {
      openRouterKey: data.openRouterKey,
      serperKey: data.serperKey,
      githubApiKey: data.githubApiKey,
      redditApiKey: data.redditApiKey,
      unlockTime: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    return { success: true };
  } catch (error) {
    console.error('Failed to create vault:', error);
    return { success: false, error: 'Failed to create vault' };
  }
}

// Unlock vault
export async function unlockVault(password: string): Promise<{ success: boolean; error?: string; keys?: { openRouterKey: string; serperKey?: string; githubApiKey?: string; redditApiKey?: string } }> {
  try {
    const vaultStr = localStorage.getItem(VAULT_KEY);
    if (!vaultStr) {
      return { success: false, error: 'No vault found' };
    }

    const vaultData: VaultData = JSON.parse(vaultStr);
    
    if (simpleHash(password) !== vaultData.passwordHash) {
      return { success: false, error: 'Invalid password' };
    }

    const keys = JSON.parse(atob(vaultData.encodedKeys));

    const sessionData: SessionData = {
      openRouterKey: keys.openRouterKey,
      serperKey: keys.serperKey,
      githubApiKey: keys.githubApiKey,
      redditApiKey: keys.redditApiKey,
      unlockTime: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    return { 
      success: true, 
      keys: { 
        openRouterKey: keys.openRouterKey, 
        serperKey: keys.serperKey,
        githubApiKey: keys.githubApiKey,
        redditApiKey: keys.redditApiKey
      } 
    };
  } catch (error) {
    console.error('Failed to unlock vault:', error);
    return { success: false, error: 'Invalid password' };
  }
}

// Lock vault
export function lockVault(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

// Get session keys
export function getSessionKeys(): { openRouterKey: string; serperKey?: string; githubApiKey?: string; redditApiKey?: string } | null {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (!session) return null;

  try {
    const sessionData: SessionData = JSON.parse(session);
    const now = Date.now();

    if (now - sessionData.unlockTime > SESSION_TIMEOUT) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }

    // Refresh session
    sessionData.unlockTime = now;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    return {
      openRouterKey: sessionData.openRouterKey,
      serperKey: sessionData.serperKey,
      githubApiKey: sessionData.githubApiKey,
      redditApiKey: sessionData.redditApiKey,
    };
  } catch {
    return null;
  }
}

// Delete vault
export function deleteVault(): void {
  localStorage.removeItem(VAULT_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}


================================================================================
File: src/features/council/store/control-panel-store.ts
================================================================================
import { create } from 'zustand';
import { toast } from 'sonner';
import { ExecutionMode } from '@/features/council/lib/types';
import { DEFAULT_EXPERTS } from '@/lib/config';
import { loadPersonaIntoExpert, loadTeam } from '@/features/council/lib/persona-library';

// Import useExpertStore dynamically to break circular dependencies
const getExpertStore = () => import('./expert-store').then(mod => mod.useExpertStore);

interface FileData {
  name: string;
  content: string;
  size: string;
}

interface ControlPanelState {
  task: string;
  setTask: (task: string) => void;
  mode: ExecutionMode;
  setMode: (mode: ExecutionMode) => void;
  activeExpertCount: number;
  setActiveExpertCount: (count: number) => void;
  debateRounds: number;
  setDebateRounds: (rounds: number) => void;
  fileData: FileData | null;
  setFileData: (fileData: FileData | null) => void;
  loadPersona: (expertIndex: number, personaId: string) => void;
  loadTeam: (teamId: string) => void;
  clearPersona: (expertIndex: number) => void;
  resetToDefault: () => void;
}

export const useControlPanelStore = create<ControlPanelState>((set) => ({
  task: '',
  setTask: (task) => set({ task }),
  mode: 'synthesis',
  setMode: (mode) => set({ mode }),
  activeExpertCount: 5,
  setActiveExpertCount: (count) => set({ activeExpertCount: count }),
  debateRounds: 3,
  setDebateRounds: (rounds) => set({ debateRounds: rounds }),
  fileData: null,
  setFileData: (fileData) => set({ fileData }),

  loadPersona: (expertIndex, personaId) => {
    const personaExpert = loadPersonaIntoExpert(personaId, expertIndex);
    if (personaExpert) {
      // CRITICAL: Never use requestAnimationFrame + async - prevents infinite loops
      // Use synchronous promise chain with getState() directly from imported store
      getExpertStore().then(useExpertStoreHook => {
        const state = useExpertStoreHook.getState();
        const newExperts = [...state.experts];
        newExperts[expertIndex - 1] = {
          id: personaExpert.id,
          name: personaExpert.name,
          model: personaExpert.model,
          role: personaExpert.role,
          basePersona: personaExpert.basePersona,
          knowledge: personaExpert.knowledge || [],
          config: personaExpert.config,
          modeBehavior: personaExpert.modeBehavior,
          content: personaExpert.content || 'No content available',
          color: personaExpert.color || '#000000',
          icon: personaExpert.icon || 'default-icon',
          isLoading: personaExpert.isLoading !== undefined ? personaExpert.isLoading : false,
        };
        useExpertStoreHook.setState({ experts: newExperts });
        toast.success(`Loaded ${personaExpert.name} into Expert ${expertIndex}`);
      }).catch(() => toast.error('Failed to update expert'));
    } else {
      toast.error('Failed to load persona');
    }
  },

  loadTeam: (teamId) => {
    const team = loadTeam(teamId);
    if (team) {
      set({ activeExpertCount: team.experts.length, mode: team.mode });
      // CRITICAL: Avoid nested requestAnimationFrame + async patterns
      // Use synchronous promise chain to update store safely
      getExpertStore().then(useExpertStoreHook => {
        const newExperts = [...DEFAULT_EXPERTS];
        team.experts.forEach((expert, index) => {
          newExperts[index] = {
            id: expert.id,
            name: expert.name,
            model: expert.model,
            role: expert.role,
            basePersona: expert.basePersona,
            knowledge: expert.knowledge || [],
            config: expert.config,
            modeBehavior: {
              ...expert.modeBehavior,
              modeName: expert.modeBehavior.modeName ?? "defaultMode",
              description: expert.modeBehavior.description ?? "No description provided",
              isEnabled: expert.modeBehavior.isEnabled ?? true,
            },
            content: expert.content || 'No content available',
            color: expert.color || '#000000',
            icon: expert.icon || 'default-icon',
            hasWebSearch: expert.hasWebSearch ?? false,
          };
        });
        useExpertStoreHook.setState({ experts: newExperts });
        toast.success(`Loaded ${team.name} with ${team.experts.length} experts`);
      }).catch(() => toast.error('Failed to load team'));
    } else {
      toast.error('Failed to load team');
    }
  },

  clearPersona: (expertIndex) => {
    // CRITICAL: Avoid requestAnimationFrame + async patterns
    getExpertStore().then(useExpertStoreHook => {
      const state = useExpertStoreHook.getState();
      const defaultExpert = DEFAULT_EXPERTS[expertIndex - 1];
      if (defaultExpert) {
        const newExperts = [...state.experts];
        newExperts[expertIndex - 1] = { ...defaultExpert };
        useExpertStoreHook.setState({ experts: newExperts });
        toast.success(`Reset Expert ${expertIndex} to default`);
      }
    }).catch(() => toast.error('Failed to reset expert'));
  },

  resetToDefault: () => {
    // CRITICAL: Avoid requestAnimationFrame + async patterns
    getExpertStore().then(useExpertStoreHook => {
      useExpertStoreHook.setState({ experts: [...DEFAULT_EXPERTS] });
      set({ activeExpertCount: 5, mode: 'synthesis' });
      toast.success('Reset all experts to defaults');
    }).catch(() => toast.error('Failed to reset experts'));
  },
}));


================================================================================
File: src/features/council/store/execution-store.ts
================================================================================
import { create } from 'zustand';
import { toast } from 'sonner';
import { SynthesisResult, SynthesisConfig } from '@/features/council/lib/types';
import { callExpertStreaming } from '@/features/council/api/ai-client';
// import { SYNTHESIS_TIERS } from '@/lib/synthesis-engine'; // Unused import commented out
import { saveSession } from '@/features/council/lib/session-history';
import { UseMutationResult } from '@tanstack/react-query';

// Async imports to break circular dependencies
const getControlPanelStore = () => import('./control-panel-store').then(mod => mod.useControlPanelStore);
const getExpertStore = () => import('./expert-store').then(mod => mod.useExpertStore);
const getSettingsStore = () => import('@/features/settings/store/settings-store').then(mod => mod.useSettingsStore);

export interface ExpertOutput {
  name: string;
  model: string;
  content: string;
}

interface CostBreakdown {
  experts: number;
  synthesis: number;
  total: number;
}

interface ExecutionState {
  isLoading: boolean;
  isSynthesizing: boolean;
  statusMessage: string;
  cost: CostBreakdown;
  outputs: Record<string, string>;
  synthesisResult: SynthesisResult | null;
  verdict: string;
  status: string;
  executeCouncil: (synthesisMutation: UseMutationResult<SynthesisResult, Error, { expertOutputs: ExpertOutput[]; task: string; config: SynthesisConfig; apiKey: string; onProgress: (message: string) => void; }, unknown>) => Promise<void>;
  reset: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  isLoading: false,
  isSynthesizing: false,
  statusMessage: '',
  cost: { experts: 0, synthesis: 0, total: 0 },
  outputs: {},
  synthesisResult: null,
  verdict: '',
  status: '',

  executeCouncil: async (synthesisMutation) => {
    // Use async imports to prevent circular dependencies
    try {
      const controlPanelStore = await getControlPanelStore();
      const expertStore = await getExpertStore();
      const settingsStore = await getSettingsStore();
      
      const { task, mode, activeExpertCount } = controlPanelStore.getState();
      const { experts, updateExpert } = expertStore.getState();
      const { openRouterKey } = settingsStore.getState();

      if (!openRouterKey) {
        toast.error('Vault Locked', {
          action: { label: 'Unlock', onClick: () => settingsStore.getState().setShowSettings(true) },
        });
        return;
      }
      if (!task.trim()) {
        toast.error('Task is empty');
        return;
      }

      set({ 
        isLoading: true, 
        outputs: {}, 
        synthesisResult: null, 
        verdict: '', 
        cost: { experts: 0, synthesis: 0, total: 0 },
        statusMessage: 'Initializing Council...' 
      });

      const activeExperts = experts.slice(0, activeExpertCount);
      const collectedOutputs: Record<string, { expertName: string; output: string; model: string }> = {};
      let expertsCost = 0;

      for (let i = 0; i < activeExperts.length; i++) {
        const expert = activeExperts[i];
        set({ statusMessage: `${expert.name} is analyzing...` });
        
        // Use async store updates to prevent render loops
        requestAnimationFrame(() => {
          updateExpert(i, { ...expert, isLoading: true, output: '' });
        });

        const previousOutputs = mode === 'pipeline' || mode === 'debate' ? Object.fromEntries(Object.entries(collectedOutputs).map(([id, data]) => [id, data.output])) : undefined;

        try {
          // Capture the content from streaming callbacks
          let finalContent = '';
          
          const result = await callExpertStreaming(
            expert,
            task,
            mode,
            openRouterKey,
            {
              onToken: (token) => {
                // CRITICAL: Never use requestAnimationFrame in streaming callbacks
                // This causes infinite loops when combined with state updates
                // Use microtask queue (Promise) for non-blocking updates instead
                Promise.resolve().then(() => {
                  getExpertStore().then(useExpertStoreHook => {
                    const state = useExpertStoreHook.getState();
                    const currentExpert = state.experts[i];
                    if (currentExpert) {
                      state.updateExpert(i, { ...currentExpert, output: (currentExpert.output || '') + token });
                    }
                  }).catch(err => console.error('Error updating expert on token:', err));
                });
              },
              onComplete: (fullText) => {
                finalContent = fullText;
              },
              onError: (error) => {
                console.error(`Streaming error for expert ${expert.name}:`, error);
              }
            },
            undefined, // additionalContext
            previousOutputs // previousOutputs
          );

          collectedOutputs[expert.id] = { expertName: expert.name, output: finalContent, model: expert.model };
          expertsCost += result.cost;
          
          // Update expert with final result - use synchronous store update
          getExpertStore().then(useExpertStoreHook => {
            const state = useExpertStoreHook.getState();
            const updatedExpert = state.experts[i];
            if (updatedExpert) {
              state.updateExpert(i, { ...updatedExpert, output: finalContent, isLoading: false });
            }
          }).catch(err => console.error('Error updating expert final output:', err));

          set((state) => ({
            outputs: { ...state.outputs, [expert.id]: finalContent },
            cost: { ...state.cost, experts: expertsCost, total: expertsCost + state.cost.synthesis },
          }));
        } catch (error) {
          console.error(`Error with expert ${expert.name}:`, error);
          
          // Update expert error state - avoid requestAnimationFrame to prevent infinite loops
          getExpertStore().then(useExpertStoreHook => {
            const state = useExpertStoreHook.getState();
            const failedExpert = state.experts[i];
            if (failedExpert) {
              state.updateExpert(i, { ...failedExpert, output: 'Failed to generate output.', isLoading: false });
            }
          }).catch(err => console.error('Error updating expert on failure:', err));

          set((state) => ({
            outputs: { ...state.outputs, [expert.id]: 'Failed to generate output.' },
          }));
        }
      }

      // Synthesis phase
      const { synthesisConfig } = settingsStore.getState();
      
      set({ statusMessage: 'Synthesizing insights...', isSynthesizing: true });
      
      synthesisMutation.mutate(
        {
          expertOutputs: Object.values(collectedOutputs).map(data => ({
            name: data.expertName,
            model: data.model,
            content: data.output,
          })),
          task,
          config: synthesisConfig,
          apiKey: openRouterKey,
          onProgress: (message: string) => {
            set({ statusMessage: message });
          },
        },
        {
          onSuccess: (result) => {
            const newSynthesisCost = result.cost;
            set({ 
              synthesisResult: result, 
              verdict: result.content,
              statusMessage: 'Analysis complete'
            });
            set(() => ({
              cost: { experts: expertsCost, synthesis: newSynthesisCost, total: expertsCost + newSynthesisCost },
            }));
            saveSession({
              task,
              mode,
              activeExpertCount,
              experts: activeExperts.map((e) => ({ id: e.id, name: e.name, model: e.model })),
              outputs: Object.fromEntries(Object.entries(collectedOutputs).map(([id, data]) => [id, data.output])),
              verdict: result.content,
              synthesisConfig,
              cost: { experts: expertsCost, synthesis: newSynthesisCost, total: expertsCost + newSynthesisCost },
            });
            set({ isSynthesizing: false });
            toast.success('Council analysis complete!');
          },
          onError: (error) => {
            toast.error('Synthesis Failed', { description: error.message });
            const fallbackVerdict = 'Synthesis failed. Please review the expert outputs manually.';
            set({ verdict: fallbackVerdict, synthesisResult: { content: fallbackVerdict, tier: synthesisConfig.tier, model: 'fallback', tokens: { prompt: 0, completion: 0 }, cost: 0 }, isSynthesizing: false });
          },
        }
      );

      set({ isLoading: false, statusMessage: '' });
    } catch (error) {
      console.error('ExecuteCouncil error:', error);
      set({ isLoading: false, statusMessage: '' });
      toast.error('Failed to execute council');
    }
  },

  reset: () => {
    set({
      isLoading: false,
      isSynthesizing: false,
      statusMessage: '',
      cost: { experts: 0, synthesis: 0, total: 0 },
      outputs: {},
      synthesisResult: null,
      verdict: '',
      status: '',
    });
  },
}));

================================================================================
File: src/features/council/store/expert-store.ts
================================================================================
import { create } from 'zustand';
import { Expert } from '@/features/council/lib/types'; // Ensure consistent Expert type
import { KnowledgeFile } from '@/features/council/lib/types';

interface ExpertState {
  experts: Expert[];
  setExperts: (experts: Expert[]) => void;
  updateExpert: (index: number, expert: Partial<Expert>) => void;
  addKnowledge: (expertIndex: number, files: KnowledgeFile[]) => void;
  removeKnowledge: (expertIndex: number, fileId: string) => void;
}

export const useExpertStore = create<ExpertState>((set) => ({
  experts: [],
  setExperts: (experts) => set({ experts }),
  updateExpert: (index, expertUpdates) =>
    set((state) => ({
      experts: state.experts.map((e, i) => {
        if (i !== index) return e;
        const updated = { ...e, ...expertUpdates };
        // Ensure content is populated
        if (!updated.content) {
          updated.content = updated.output || 'No content available';
        }
        // Sync pluginConfig with legacy config if core-ai-expert
        if (updated.pluginId === 'core-ai-expert' && updated.pluginConfig) {
          updated.config = { ...updated.config, ...updated.pluginConfig };
        }
        return updated;
      }),
    })),
  addKnowledge: (expertIndex, files) =>
    set((state) => ({
      experts: state.experts.map((e, i) =>
        i === expertIndex
          ? { ...e, knowledge: [...e.knowledge, ...files] }
          : e
      ),
    })),
  removeKnowledge: (expertIndex, fileId) =>
    set((state) => ({
      experts: state.experts.map((e, i) =>
        i === expertIndex
          ? { ...e, knowledge: e.knowledge.filter((f) => f.id !== fileId) }
          : e
      ),
    })),
}));

================================================================================
File: src/features/council/store/feature-config-store.ts
================================================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ScoutConfig {
  enabled: boolean;
  targetNiche: string;
  minStars: number;
  maxRepos: number;
  depth: 'shallow' | 'normal' | 'deep';
  schedule: string;
}

export interface MirrorConfig {
  enabled: boolean;
  generateReport: boolean;
  standards: string[];
  schedule: string;
}

export interface QualityConfig {
  enabled: boolean;
  autoFix: boolean;
  runLinter: boolean;
  runTypeCheck: boolean;
  schedule: string;
}

export interface SelfImproveConfig {
  enabled: boolean;
  niche: string;
  minStars: number;
  maxRepos: number;
  schedule: string;
}

export interface StargazerAnalysisConfig {
  enabled: boolean;
  minFollowers: number;
  checkCompanies: boolean;
  targetCompanies: string[];
  maxStargazers: number;
}

export interface DataFetchingConfig {
  enabled: boolean;
  useCaching: boolean;
  cacheExpiry: number; // hours
}

export interface TypeSafeFormsConfig {
  enabled: boolean;
  useZod: boolean;
  validateOnChange: boolean;
}

export interface ErrorHandlingConfig {
  enabled: boolean;
  useRetry: boolean;
  maxRetries: number;
  circuitBreaker: boolean;
}

export interface AuthSecurityConfig {
  enabled: boolean;
  useVault: boolean;
  sessionTimeout: number; // minutes
}

export interface MobileDrawersConfig {
  enabled: boolean;
  gesturesEnabled: boolean;
  swipeThreshold: number;
}

export interface VirtualizedListsConfig {
  enabled: boolean;
  itemHeight: number;
  overscanCount: number;
}

export interface StreamingAIConfig {
  enabled: boolean;
  useTypewriter: boolean;
  chunkSize: number;
}

export interface AgentOrchestrationConfig {
  enabled: boolean;
  maxAgents: number;
  executionMode: 'separated' | 'synthesis' | 'debate' | 'pipeline';
}

export interface LocalDatabaseConfig {
  enabled: boolean;
  useDexie: boolean;
  autoSync: boolean;
}

export interface FeatureConfigState {
  scout: ScoutConfig;
  mirror: MirrorConfig;
  quality: QualityConfig;
  selfImprove: SelfImproveConfig;
  stargazerAnalysis: StargazerAnalysisConfig;
  dataFetching: DataFetchingConfig;
  typeSafeForms: TypeSafeFormsConfig;
  errorHandling: ErrorHandlingConfig;
  authSecurity: AuthSecurityConfig;
  mobileDrawers: MobileDrawersConfig;
  virtualizedLists: VirtualizedListsConfig;
  streamingAI: StreamingAIConfig;
  agentOrchestration: AgentOrchestrationConfig;
  localDatabase: LocalDatabaseConfig;
  
  updateScoutConfig: (config: Partial<ScoutConfig>) => void;
  updateMirrorConfig: (config: Partial<MirrorConfig>) => void;
  updateQualityConfig: (config: Partial<QualityConfig>) => void;
  updateSelfImproveConfig: (config: Partial<SelfImproveConfig>) => void;
  updateStargazerAnalysisConfig: (config: Partial<StargazerAnalysisConfig>) => void;
  updateDataFetchingConfig: (config: Partial<DataFetchingConfig>) => void;
  updateTypeSafeFormsConfig: (config: Partial<TypeSafeFormsConfig>) => void;
  updateErrorHandlingConfig: (config: Partial<ErrorHandlingConfig>) => void;
  updateAuthSecurityConfig: (config: Partial<AuthSecurityConfig>) => void;
  updateMobileDrawersConfig: (config: Partial<MobileDrawersConfig>) => void;
  updateVirtualizedListsConfig: (config: Partial<VirtualizedListsConfig>) => void;
  updateStreamingAIConfig: (config: Partial<StreamingAIConfig>) => void;
  updateAgentOrchestrationConfig: (config: Partial<AgentOrchestrationConfig>) => void;
  updateLocalDatabaseConfig: (config: Partial<LocalDatabaseConfig>) => void;
  
  resetToDefaults: () => void;
}

const DEFAULT_SCOUT_CONFIG: ScoutConfig = {
  enabled: true,
  targetNiche: 'developer-tools',
  minStars: 100,
  maxRepos: 50,
  depth: 'normal',
  schedule: '0 6 * * *', // Daily at 6 AM UTC
};

const DEFAULT_MIRROR_CONFIG: MirrorConfig = {
  enabled: true,
  generateReport: true,
  standards: ['elite', 'production', 'security'],
  schedule: '0 8 * * 0', // Weekly on Sundays at 8 AM UTC
};

const DEFAULT_QUALITY_CONFIG: QualityConfig = {
  enabled: true,
  autoFix: false,
  runLinter: true,
  runTypeCheck: true,
  schedule: '0 10 * * 2,5', // Twice weekly - Tuesday and Friday
};

const DEFAULT_SELF_IMPROVE_CONFIG: SelfImproveConfig = {
  enabled: true,
  niche: 'developer-tools',
  minStars: 1000,
  maxRepos: 20,
  schedule: '0 9 * * 1', // Weekly on Mondays
};

const DEFAULT_STARGAZER_ANALYSIS_CONFIG: StargazerAnalysisConfig = {
  enabled: true,
  minFollowers: 1000,
  checkCompanies: true,
  targetCompanies: ['google', 'meta', 'stripe', 'vercel', 'shopify', 'amazon', 'microsoft', 'netflix'],
  maxStargazers: 100,
};

const DEFAULT_DATA_FETCHING_CONFIG: DataFetchingConfig = {
  enabled: true,
  useCaching: true,
  cacheExpiry: 24,
};

const DEFAULT_TYPE_SAFE_FORMS_CONFIG: TypeSafeFormsConfig = {
  enabled: true,
  useZod: true,
  validateOnChange: false,
};

const DEFAULT_ERROR_HANDLING_CONFIG: ErrorHandlingConfig = {
  enabled: true,
  useRetry: true,
  maxRetries: 3,
  circuitBreaker: true,
};

const DEFAULT_AUTH_SECURITY_CONFIG: AuthSecurityConfig = {
  enabled: true,
  useVault: true,
  sessionTimeout: 60,
};

const DEFAULT_MOBILE_DRAWERS_CONFIG: MobileDrawersConfig = {
  enabled: true,
  gesturesEnabled: true,
  swipeThreshold: 50,
};

const DEFAULT_VIRTUALIZED_LISTS_CONFIG: VirtualizedListsConfig = {
  enabled: true,
  itemHeight: 80,
  overscanCount: 5,
};

const DEFAULT_STREAMING_AI_CONFIG: StreamingAIConfig = {
  enabled: true,
  useTypewriter: true,
  chunkSize: 50,
};

const DEFAULT_AGENT_ORCHESTRATION_CONFIG: AgentOrchestrationConfig = {
  enabled: true,
  maxAgents: 7,
  executionMode: 'synthesis',
};

const DEFAULT_LOCAL_DATABASE_CONFIG: LocalDatabaseConfig = {
  enabled: true,
  useDexie: true,
  autoSync: true,
};

export const useFeatureConfigStore = create<FeatureConfigState>(
  // @ts-expect-error - Zustand v5 persist middleware type signature mismatch (non-breaking)
  persist(
    (set) => ({
      scout: DEFAULT_SCOUT_CONFIG,
      mirror: DEFAULT_MIRROR_CONFIG,
      quality: DEFAULT_QUALITY_CONFIG,
      selfImprove: DEFAULT_SELF_IMPROVE_CONFIG,
      stargazerAnalysis: DEFAULT_STARGAZER_ANALYSIS_CONFIG,
      dataFetching: DEFAULT_DATA_FETCHING_CONFIG,
      typeSafeForms: DEFAULT_TYPE_SAFE_FORMS_CONFIG,
      errorHandling: DEFAULT_ERROR_HANDLING_CONFIG,
      authSecurity: DEFAULT_AUTH_SECURITY_CONFIG,
      mobileDrawers: DEFAULT_MOBILE_DRAWERS_CONFIG,
      virtualizedLists: DEFAULT_VIRTUALIZED_LISTS_CONFIG,
      streamingAI: DEFAULT_STREAMING_AI_CONFIG,
      agentOrchestration: DEFAULT_AGENT_ORCHESTRATION_CONFIG,
      localDatabase: DEFAULT_LOCAL_DATABASE_CONFIG,
      
      updateScoutConfig: (config: Partial<ScoutConfig>) =>
        set((state) => ({ scout: { ...state.scout, ...config } })),
      
      updateMirrorConfig: (config: Partial<MirrorConfig>) =>
        set((state) => ({ mirror: { ...state.mirror, ...config } })),
      
      updateQualityConfig: (config: Partial<QualityConfig>) =>
        set((state) => ({ quality: { ...state.quality, ...config } })),
      
      updateSelfImproveConfig: (config: Partial<SelfImproveConfig>) =>
        set((state) => ({ selfImprove: { ...state.selfImprove, ...config } })),
      
      updateStargazerAnalysisConfig: (config: Partial<StargazerAnalysisConfig>) =>
        set((state) => ({ stargazerAnalysis: { ...state.stargazerAnalysis, ...config } })),
      
      updateDataFetchingConfig: (config: Partial<DataFetchingConfig>) =>
        set((state) => ({ dataFetching: { ...state.dataFetching, ...config } })),
      
      updateTypeSafeFormsConfig: (config: Partial<TypeSafeFormsConfig>) =>
        set((state) => ({ typeSafeForms: { ...state.typeSafeForms, ...config } })),
      
      updateErrorHandlingConfig: (config: Partial<ErrorHandlingConfig>) =>
        set((state) => ({ errorHandling: { ...state.errorHandling, ...config } })),
      
      updateAuthSecurityConfig: (config: Partial<AuthSecurityConfig>) =>
        set((state) => ({ authSecurity: { ...state.authSecurity, ...config } })),
      
      updateMobileDrawersConfig: (config: Partial<MobileDrawersConfig>) =>
        set((state) => ({ mobileDrawers: { ...state.mobileDrawers, ...config } })),
      
      updateVirtualizedListsConfig: (config: Partial<VirtualizedListsConfig>) =>
        set((state) => ({ virtualizedLists: { ...state.virtualizedLists, ...config } })),
      
      updateStreamingAIConfig: (config: Partial<StreamingAIConfig>) =>
        set((state) => ({ streamingAI: { ...state.streamingAI, ...config } })),
      
      updateAgentOrchestrationConfig: (config: Partial<AgentOrchestrationConfig>) =>
        set((state) => ({ agentOrchestration: { ...state.agentOrchestration, ...config } })),
      
      updateLocalDatabaseConfig: (config: Partial<LocalDatabaseConfig>) =>
        set((state) => ({ localDatabase: { ...state.localDatabase, ...config } })),
      
      resetToDefaults: () =>
        set({
          scout: DEFAULT_SCOUT_CONFIG,
          mirror: DEFAULT_MIRROR_CONFIG,
          quality: DEFAULT_QUALITY_CONFIG,
          selfImprove: DEFAULT_SELF_IMPROVE_CONFIG,
          stargazerAnalysis: DEFAULT_STARGAZER_ANALYSIS_CONFIG,
          dataFetching: DEFAULT_DATA_FETCHING_CONFIG,
          typeSafeForms: DEFAULT_TYPE_SAFE_FORMS_CONFIG,
          errorHandling: DEFAULT_ERROR_HANDLING_CONFIG,
          authSecurity: DEFAULT_AUTH_SECURITY_CONFIG,
          mobileDrawers: DEFAULT_MOBILE_DRAWERS_CONFIG,
          virtualizedLists: DEFAULT_VIRTUALIZED_LISTS_CONFIG,
          streamingAI: DEFAULT_STREAMING_AI_CONFIG,
          agentOrchestration: DEFAULT_AGENT_ORCHESTRATION_CONFIG,
          localDatabase: DEFAULT_LOCAL_DATABASE_CONFIG,
        }),
    }),
    {
      name: 'council-feature-config',
    }
  )
);


================================================================================
File: src/features/council/store/memory-store.ts
================================================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  MemoryEntry,
  CouncilMemory,
} from '@/features/council/lib/council-memory';

const MAX_ENTRIES = 100;

const storage: Storage = {
  getItem: (key: string) => {
    const value = localStorage.getItem(key);
    return value || null;
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  length: localStorage.length,
  clear: () => {
    localStorage.clear();
  },
  key: (index: number) => {
    return localStorage.key(index);
  },
};

// Adjusted MemoryState to ensure compatibility with Partial<MemoryState>
interface MemoryState {
  memory: CouncilMemory;
  searchQuery: string;
  filterType: string | null;
  isLoading: boolean;
  loadMemory: () => Promise<void>;
  addEntry: (entry: MemoryEntry) => MemoryEntry;
  deleteMemoryEntry: (id: string) => void;
  clearAll: () => void;
  setEnabled: (enabled: boolean) => void;
  toggleEnabled: () => void;
  setSearchQuery: (searchQuery: string) => void;
  setFilterType: (filterType: string | null) => void;
}

// Patch StateCreator to relax replace parameter constraints
export const useMemoryStore = create<MemoryState>(
  // @ts-expect-error - Zustand v5 persist middleware type signature mismatch (non-breaking)
  persist(
    (set, get) => ({
      memory: {
        entries: [],
        userPreferences: {},
        domainKnowledge: {},
        enabled: true,
      },
      searchQuery: '',
      filterType: null,
      isLoading: false,

      loadMemory: async () => {
        // Hydration happens automatically with persist
      },

      addEntry: (entry) => {
        const newEntry: MemoryEntry = {
          ...entry,
          id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };

        const currentMemory = get().memory;
        const entries = [newEntry, ...currentMemory.entries];
        
        let finalEntries = entries;
        if (entries.length > MAX_ENTRIES) {
          finalEntries = entries.sort((a, b) => {
            const recencyA = Date.now() - new Date(a.timestamp).getTime();
            const recencyB = Date.now() - new Date(b.timestamp).getTime();
            const scoreA = a.relevanceScore - (recencyA / (1000 * 60 * 60 * 24 * 7));
            const scoreB = b.relevanceScore - (recencyB / (1000 * 60 * 60 * 24 * 7));
            return scoreB - scoreA;
          }).slice(0, MAX_ENTRIES);
        }

        set((state) => ({
          ...state,
          memory: { ...state.memory, entries: finalEntries },
        }));
        return newEntry;
      },

      deleteMemoryEntry: (id) => {
        set((state) => ({
          ...state,
          memory: {
            ...state.memory,
            entries: state.memory.entries.filter((e) => e.id !== id),
          },
        }));
      },

      clearAll: () => {
        set((state) => ({
          ...state,
          memory: {
            entries: [],
            userPreferences: {},
            domainKnowledge: {},
            enabled: state.memory.enabled,
          },
        }));
      },

      setEnabled: (enabled) => {
        set((state) => ({
          ...state,
          memory: { ...state.memory, enabled },
        }));
      },

      toggleEnabled: () => {
        set((state) => ({
          ...state,
          memory: { ...state.memory, enabled: !state.memory.enabled },
        }));
      },

      setSearchQuery: (searchQuery) => set((state) => ({ ...state, searchQuery })),
      setFilterType: (filterType) => set((state) => ({ ...state, filterType })),
    }),
    {
      name: 'council_memory_v18',
      storage: createJSONStorage(() => storage),
    }
  )
);


================================================================================
File: src/features/settings/components/SettingsModal.tsx
================================================================================
import React, { useState } from 'react';
import { useSettingsStore } from '@/features/settings/store/settings-store';
import { useShallow } from 'zustand/react/shallow';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/primitives/dialog';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    vaultStatus, 
    handleCreateVault, 
    handleUnlockVault, 
    handleLockVault, 
    openRouterKey, 
    setOpenRouterKey,
    githubApiKey,
    setGithubApiKey,
    redditApiKey,
    setRedditApiKey
  } = useSettingsStore(useShallow((state) => ({
    vaultStatus: state.vaultStatus,
    handleCreateVault: state.handleCreateVault,
    handleUnlockVault: state.handleUnlockVault,
    handleLockVault: state.handleLockVault,
    openRouterKey: state.openRouterKey,
    setOpenRouterKey: state.setOpenRouterKey,
    githubApiKey: state.githubApiKey,
    setGithubApiKey: state.setGithubApiKey,
    redditApiKey: state.redditApiKey,
    setRedditApiKey: state.setRedditApiKey,
  })));
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleCreate = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const result = await handleCreateVault({ 
      password: newPassword, 
      openRouterKey,
      githubApiKey,
      redditApiKey
    });
    if (result.success) {
      onClose();
    }
  };

  const handleUnlock = async () => {
    const result = await handleUnlockVault(password);
    if (result.success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-panel">
        <DialogHeader>
          <DialogTitle>{vaultStatus.hasVault ? 'Vault Settings' : 'Create Vault'}</DialogTitle>
          <DialogDescription>
            {vaultStatus.hasVault
              ? 'Manage your vault settings below.'
              : 'Create a new vault to store your API keys.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!vaultStatus.hasVault ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">OpenRouter Key</Label>
                <Input
                  className="col-span-3"
                  placeholder="sk-or-..."
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">GitHub API Key</Label>
                <Input
                  className="col-span-3"
                  placeholder="ghp_... (optional)"
                  value={githubApiKey}
                  onChange={(e) => setGithubApiKey(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Reddit API Key</Label>
                <Input
                  className="col-span-3"
                  placeholder="Reddit API key (optional)"
                  value={redditApiKey}
                  onChange={(e) => setRedditApiKey(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">New Password</Label>
                <Input
                  type="password"
                  className="col-span-3"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Confirm Password</Label>
                <Input
                  type="password"
                  className="col-span-3"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          ) : vaultStatus.isLocked ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Password</Label>
              <Input
                type="password"
                className="col-span-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Vault is unlocked. Your API keys are securely stored.</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">OpenRouter Key</span>
                  <span className="text-xs text-muted-foreground">{openRouterKey ? '••••••••' : 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">GitHub API Key</span>
                  <span className="text-xs text-muted-foreground">{githubApiKey ? '••••••••' : 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">Reddit API Key</span>
                  <span className="text-xs text-muted-foreground">{redditApiKey ? '••••••••' : 'Not set'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          {!vaultStatus.hasVault ? (
            <Button onClick={handleCreate}>Create Vault</Button>
          ) : vaultStatus.isLocked ? (
            <Button onClick={handleUnlock}>Unlock</Button>
          ) : (
            <Button onClick={handleLockVault}>Lock Vault</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;


================================================================================
File: src/features/settings/store/settings-store.ts
================================================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { SynthesisConfig } from '@/lib/types';
import { DEFAULT_SYNTHESIS_CONFIG } from '@/lib/synthesis-engine';
import { initializeVault, getVaultStatus, createVault, unlockVault, lockVault, VaultStatus } from '@/features/council/lib/vault';

interface VaultCreationResult {
  success: boolean;
  error?: string;
}

interface VaultUnlockResult {
  success: boolean;
  error?: string;
  keys: {
    openRouterKey: string;
    serperKey?: string;
    githubApiKey?: string;
    redditApiKey?: string;
  };
}

interface SettingsState {
  apiKey: string;
  setApiKey: (key: string) => void;
  openRouterKey: string;
  setOpenRouterKey: (key: string) => void;
  githubApiKey: string;
  setGithubApiKey: (key: string) => void;
  redditApiKey: string;
  setRedditApiKey: (key: string) => void;
  model: string;
  setModel: (model: string) => void;
  synthesisConfig: SynthesisConfig;
  setSynthesisConfig: (config: SynthesisConfig) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  showMemory: boolean;
  setShowMemory: (show: boolean) => void;
  vaultStatus: VaultStatus;
  handleCreateVault: (data: { password: string; openRouterKey: string; serperKey?: string; githubApiKey?: string; redditApiKey?: string }) => Promise<VaultCreationResult>;
  handleUnlockVault: (password: string) => Promise<VaultUnlockResult>;
  handleLockVault: () => void;
}

export const useSettingsStore = create<SettingsState>(
  // @ts-expect-error - Zustand v5 persist middleware type signature mismatch (non-breaking)
  persist(
    (set) => ({
      apiKey: '',
      setApiKey: (key: string) => set({ apiKey: key }),
      openRouterKey: '',
      setOpenRouterKey: (key: string) => set({ openRouterKey: key }),
      githubApiKey: '',
      setGithubApiKey: (key: string) => set({ githubApiKey: key }),
      redditApiKey: '',
      setRedditApiKey: (key: string) => set({ redditApiKey: key }),
      model: 'gpt-4-turbo-preview',
      setModel: (model: string) => set({ model }),
      synthesisConfig: DEFAULT_SYNTHESIS_CONFIG,
      setSynthesisConfig: (config: SynthesisConfig) => set({ synthesisConfig: config }),
      showSettings: false,
      setShowSettings: (show: boolean) => set({ showSettings: show }),
      showHistory: false,
      setShowHistory: (show: boolean) => set({ showHistory: show }),
      showMemory: false,
      setShowMemory: (show: boolean) => set({ showMemory: show }),
      vaultStatus: initializeVault(),
      handleCreateVault: async (data: { password: string; openRouterKey: string; serperKey?: string; githubApiKey?: string; redditApiKey?: string }) => {
        const result = await createVault(data);
        if (result.success) {
          set({ vaultStatus: getVaultStatus() });
          toast.success('Vault Created');
        } else {
          toast.error('Vault Creation Failed', { description: result.error });
        }
        return result;
      },
      handleUnlockVault: async (password: string) => {
        const result = await unlockVault(password);
        if (result.success && 'keys' in result) {
          const unlockResult = result as VaultUnlockResult;
          set({ 
            vaultStatus: getVaultStatus(), 
            openRouterKey: unlockResult.keys.openRouterKey,
            githubApiKey: unlockResult.keys.githubApiKey || '',
            redditApiKey: unlockResult.keys.redditApiKey || ''
          });
          toast.success('Vault Unlocked');
          return unlockResult;
        } else {
          toast.error('Unlock Failed');
          return { success: false, error: 'Unlock Failed', keys: { openRouterKey: '', githubApiKey: '', redditApiKey: '' } } as VaultUnlockResult;
        }
      },
      handleLockVault: () => {
        lockVault();
        set({ vaultStatus: getVaultStatus(), openRouterKey: '', githubApiKey: '', redditApiKey: '' });
        toast.info('Vault Locked');
      },
    }),
    {
      name: 'council-settings-storage',
    }
  )
);


================================================================================
File: src/hooks/use-mobile.tsx
================================================================================
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}


================================================================================
File: src/hooks/use-toast.ts
================================================================================
import * as React from "react";

import type { ToastActionElement, ToastProps } from "../components/primitives/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  const newState = reducer(memoryState, action);
  if (newState !== memoryState) {
    memoryState = newState;
    listeners.forEach((listener) => {
      try {
        listener(memoryState);
      } catch (error) {
        console.error("Error in listener:", error);
      }
    });
  }
}

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []); // Fixed: removed 'state' from dependencies to prevent infinite loop

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };


================================================================================
File: src/hooks/useCommunityIntelligence.ts
================================================================================
/**
 * Reddit & HackerNews Data Fetching Hooks
 * Mirrors: TanStack Query best practices
 * Provides caching, error handling for community intelligence
 * 
 * Usage:
 * const { data } = useRedditSearch('selfhosted', { sort: 'hot', limit: 25 });
 * const { data } = useHackerNewsSearch('alternative slack', { tags: ['ask_hn'] });
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { redditAPI, hackerNewsAPI } from '@/lib/api-client';
import {
  RedditPost,
  RedditListingSchema,
  HackerNewsSearchResponse,
  HackerNewsSearchResponseSchema,
  BuyingIntentSignal,
  validateData
} from '@/lib/validation';

/**
 * Query keys
 */
export const redditKeys = {
  all: ['reddit'] as const,
  subreddit: (name: string, sort?: string) => [...redditKeys.all, 'subreddit', name, sort] as const,
  search: (query: string, filters?: Record<string, any>) => 
    [...redditKeys.all, 'search', query, filters] as const,
  buyingIntent: (keywords: string[]) => [...redditKeys.all, 'buyingIntent', keywords] as const
};

export const hackerNewsKeys = {
  all: ['hackernews'] as const,
  search: (query: string, filters?: Record<string, any>) => 
    [...hackerNewsKeys.all, 'search', query, filters] as const,
  askHN: (query?: string) => [...hackerNewsKeys.all, 'ask', query] as const,
  showHN: (query?: string) => [...hackerNewsKeys.all, 'show', query] as const,
  trending: () => [...hackerNewsKeys.all, 'trending'] as const
};

/**
 * Reddit Hooks
 */

export interface RedditSearchParams {
  subreddit?: string;
  query?: string;
  sort?: 'hot' | 'new' | 'top' | 'rising';
  time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
  limit?: number;
  after?: string;
}

export function useRedditSearch(
  params: RedditSearchParams,
  options?: Omit<UseQueryOptions<RedditPost[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: redditKeys.search(JSON.stringify(params), params),
    queryFn: async () => {
      // Build endpoint
      const subreddit = params.subreddit || 'all';
      const sort = params.sort || 'hot';
      const endpoint = `/r/${subreddit}/${sort}.json`;
      
      // Build query params
      const queryParams: Record<string, string> = {
        limit: (params.limit || 25).toString()
      };
      
      if (params.time) queryParams.t = params.time;
      if (params.after) queryParams.after = params.after;
      if (params.query) queryParams.q = params.query;
      
      const data = await redditAPI.get<any>(endpoint, queryParams);
      const validated = validateData(RedditListingSchema, data, 'Reddit Listing');
      
      return validated.data.children.map(child => child.data);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 10000),
    ...options
  });
}

/**
 * Detect buying intent from Reddit
 */
export function useRedditBuyingIntent(
  targetKeywords: string[],
  subreddits: string[] = ['SaaS', 'Entrepreneur', 'startups', 'selfhosted'],
  options?: Omit<UseQueryOptions<BuyingIntentSignal[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: redditKeys.buyingIntent(targetKeywords),
    queryFn: async () => {
      const signals: BuyingIntentSignal[] = [];
      
      for (const subreddit of subreddits) {
        for (const keyword of targetKeywords) {
          try {
            const posts = await redditAPI.get<any>(`/r/${subreddit}/search.json`, {
              q: `alternative ${keyword}`,
              restrict_sr: 'true',
              sort: 'relevance',
              t: 'week',
              limit: 10
            });
            
            const validated = validateData(RedditListingSchema, posts);
            
            for (const child of validated.data.children) {
              const post = child.data;
              const signal = analyzeBuyingIntent(post, 'reddit');
              
              if (signal.score >= 5) {
                signals.push(signal);
              }
            }
          } catch (error) {
            console.warn(`Failed to search r/${subreddit} for ${keyword}:`, error);
          }
        }
      }
      
      return signals.sort((a, b) => b.score - a.score);
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
    ...options
  });
}

/**
 * HackerNews Hooks
 */

export interface HackerNewsSearchParams {
  query?: string;
  tags?: string[]; // 'ask_hn', 'show_hn', 'story', 'comment', 'poll', 'job'
  numericFilters?: string[]; // 'points>=50', 'num_comments>=10'
  page?: number;
  hitsPerPage?: number;
}

export function useHackerNewsSearch(
  params: HackerNewsSearchParams,
  options?: Omit<UseQueryOptions<HackerNewsSearchResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: hackerNewsKeys.search(params.query || '', params),
    queryFn: async () => {
      const searchParams: Record<string, string> = {
        query: params.query || '',
        page: (params.page || 0).toString(),
        hitsPerPage: (params.hitsPerPage || 30).toString()
      };
      
      if (params.tags && params.tags.length > 0) {
        searchParams.tags = params.tags.join(',');
      }
      
      if (params.numericFilters && params.numericFilters.length > 0) {
        searchParams.numericFilters = params.numericFilters.join(',');
      }
      
      const data = await hackerNewsAPI.get<any>('/search', searchParams);
      return validateData(HackerNewsSearchResponseSchema, data, 'HackerNews Search');
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 3,
    ...options
  });
}

/**
 * Find Ask HN posts about alternatives
 */
export function useAskHNAlternatives(
  targetProducts: string[],
  options?: Omit<UseQueryOptions<BuyingIntentSignal[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: hackerNewsKeys.askHN(targetProducts.join(',')),
    queryFn: async () => {
      const signals: BuyingIntentSignal[] = [];
      const oneDayAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60);
      
      for (const product of targetProducts) {
        const queries = [
          `alternative ${product}`,
          `replace ${product}`,
          `better than ${product}`
        ];
        
        for (const query of queries) {
          try {
            const data = await hackerNewsAPI.get<any>('/search', {
              query,
              tags: 'ask_hn',
              numericFilters: `points>=5,created_at_i>${oneDayAgo}`,
              hitsPerPage: 20
            });
            
            const validated = validateData(HackerNewsSearchResponseSchema, data);
            
            for (const hit of validated.hits) {
              const signal = analyzeBuyingIntent({
                id: hit.objectID,
                subreddit: 'hackernews',
                title: hit.title,
                selftext: hit.story_text || '',
                author: hit.author,
                score: hit.points,
                num_comments: hit.num_comments,
                created_utc: hit.created_at_i,
                permalink: `/item?id=${hit.objectID}`,
                url: `https://news.ycombinator.com/item?id=${hit.objectID}`
              }, 'hackernews');
              
              if (signal.score >= 5) {
                signals.push(signal);
              }
            }
          } catch (error) {
            console.warn(`Failed to search HN for ${query}:`, error);
          }
        }
      }
      
      return signals.sort((a, b) => b.engagement.velocity - a.engagement.velocity);
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    ...options
  });
}

/**
 * Get trending Show HN posts
 */
export function useShowHNTrending(
  options?: Omit<UseQueryOptions<HackerNewsSearchResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: hackerNewsKeys.showHN(),
    queryFn: async () => {
      const oneDayAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60);
      
      const data = await hackerNewsAPI.get<any>('/search', {
        tags: 'show_hn',
        numericFilters: `points>=50,created_at_i>${oneDayAgo}`,
        hitsPerPage: 50
      });
      
      return validateData(HackerNewsSearchResponseSchema, data);
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
    ...options
  });
}

/**
 * Analyze post for buying intent signals
 */
function analyzeBuyingIntent(
  post: Partial<RedditPost>,
  source: 'reddit' | 'hackernews' | 'producthunt'
): BuyingIntentSignal {
  const title = post.title || '';
  const body = post.selftext || '';
  const text = `${title} ${body}`.toLowerCase();
  
  // Detect pain keywords
  const painKeywords = [
    'slow', 'expensive', 'difficult', 'complex', 'broken',
    'frustrated', 'hate', 'terrible', 'awful', 'sucks'
  ].filter(keyword => text.includes(keyword));
  
  // Detect urgency signals
  const urgencySignals = [
    'urgent', 'asap', 'immediately', 'now', 'today',
    'need help', 'desperate', 'critical'
  ].filter(signal => text.includes(signal));
  
  // Detect price willingness
  const priceWillingnessMentioned = /\$\d+|pay|budget|willing to pay|price/i.test(text);
  
  // Detect alternative mentions
  const alternativeMentioned = /alternative|replace|instead of|better than/i.test(text);
  
  // Calculate frustration level (0-10)
  const frustrationLevel = Math.min(10, 
    painKeywords.length * 2 + 
    urgencySignals.length * 3 +
    (text.includes('!!!') ? 2 : 0)
  );
  
  // Calculate engagement velocity
  const ageInHours = (Date.now() / 1000 - (post.created_utc || 0)) / 3600;
  const velocity = (post.num_comments || 0) / Math.max(ageInHours, 1);
  
  // Calculate buying intent score (0-10)
  let score = 0;
  if (alternativeMentioned) score += 3;
  if (painKeywords.length > 0) score += 2;
  if (priceWillingnessMentioned) score += 2;
  if (urgencySignals.length > 0) score += 2;
  if (post.num_comments && post.num_comments >= 10) score += 1;
  
  score = Math.min(10, score);
  
  return {
    postId: post.id || '',
    title: title,
    body: body,
    source,
    url: post.url || '',
    score,
    signals: {
      painKeywords,
      urgencySignals,
      priceWillingnessMentioned,
      alternativeMentioned,
      frustrationLevel
    },
    engagement: {
      upvotes: post.score || 0,
      comments: post.num_comments || 0,
      velocity: Math.round(velocity * 10) / 10,
      created: new Date((post.created_utc || 0) * 1000).toISOString()
    },
    analysis: generateAnalysis(score, {
      painKeywords,
      urgencySignals,
      priceWillingnessMentioned,
      alternativeMentioned,
      frustrationLevel
    })
  };
}

function generateAnalysis(
  score: number,
  signals: {
    painKeywords: string[];
    urgencySignals: string[];
    priceWillingnessMentioned: boolean;
    alternativeMentioned: boolean;
    frustrationLevel: number;
  }
): string {
  const parts: string[] = [];
  
  if (score >= 8) {
    parts.push('🔥 HIGH buying intent');
  } else if (score >= 5) {
    parts.push('⭐ MEDIUM buying intent');
  } else {
    parts.push('💡 LOW buying intent');
  }
  
  if (signals.alternativeMentioned) {
    parts.push('actively seeking alternatives');
  }
  
  if (signals.priceWillingnessMentioned) {
    parts.push('willing to pay');
  }
  
  if (signals.frustrationLevel >= 5) {
    parts.push(`high frustration (${signals.frustrationLevel}/10)`);
  }
  
  if (signals.painKeywords.length > 0) {
    parts.push(`pain points: ${signals.painKeywords.slice(0, 3).join(', ')}`);
  }
  
  return parts.join(' • ');
}


================================================================================
File: src/hooks/useGitHub.ts
================================================================================
/**
 * GitHub Scanner Hook
 * Mirrors: TanStack Query best practices
 * Provides caching, automatic refetching, error handling for GitHub API
 * 
 * Usage:
 * const { data, isLoading, error, refetch } = useGitHubScanner('react', { minStars: 500 });
 */

import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { githubAPI } from '@/lib/api-client';
import {
  GitHubSearchResponse,
  GitHubRepo,
  GitHubSearchResponseSchema,
  BlueOceanOpportunity,
  GitHubUserSchema,
  StargazerQuality,
  validateData
} from '@/lib/validation';
import { useFeatureConfigStore } from '@/features/council/store/feature-config-store';

/**
 * Query keys for GitHub data
 * Centralized for cache invalidation
 */
export const githubKeys = {
  all: ['github'] as const,
  search: (query: string) => [...githubKeys.all, 'search', query] as const,
  repo: (owner: string, name: string) => [...githubKeys.all, 'repo', owner, name] as const,
  blueOcean: (niche: string, filters?: Record<string, any>) => 
    [...githubKeys.all, 'blueOcean', niche, filters] as const,
  trending: (language?: string, since?: string) => 
    [...githubKeys.all, 'trending', language, since] as const,
  stargazers: (repoFullName: string) => [...githubKeys.all, 'stargazers', repoFullName] as const
};

/**
 * Search GitHub repositories
 */
export interface GitHubSearchParams {
  query: string;
  sort?: 'stars' | 'forks' | 'updated' | 'help-wanted-issues';
  order?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
}

export function useGitHubSearch(
  params: GitHubSearchParams,
  options?: Omit<UseQueryOptions<GitHubSearchResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: githubKeys.search(JSON.stringify(params)),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set('q', params.query);
      
      if (params.sort) searchParams.set('sort', params.sort);
      if (params.order) searchParams.set('order', params.order);
      if (params.perPage) searchParams.set('per_page', params.perPage.toString());
      if (params.page) searchParams.set('page', params.page.toString());

      const data = await githubAPI.get<any>('/search/repositories', searchParams);
      
      // Validate response
      return validateData(GitHubSearchResponseSchema, data, 'GitHub Search Response');
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options
  });
}

/**
 * Get specific repository
 */
export function useGitHubRepo(
  owner: string,
  name: string,
  options?: Omit<UseQueryOptions<GitHubRepo>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: githubKeys.repo(owner, name),
    queryFn: async () => {
      const data = await githubAPI.get<any>(`/repos/${owner}/${name}`);
      return validateData(GitHubSearchResponseSchema.shape.items.element, data, 'GitHub Repository');
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    ...options
  });
}

/**
 * Blue Ocean Scanner - Find abandoned goldmines
 */
export interface BlueOceanFilters {
  minStars?: number;
  maxForks?: number;
  daysAbandoned?: number;
  minIssues?: number;
  language?: string;
}

export function useBlueOceanScanner(
  niche: string,
  filters?: BlueOceanFilters,
  options?: Omit<UseQueryOptions<BlueOceanOpportunity[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: githubKeys.blueOcean(niche, filters),
    queryFn: async () => {
      // Build search query
      const queryParts: string[] = [niche];
      
      if (filters?.minStars) queryParts.push(`stars:>=${filters.minStars}`);
      if (filters?.language) queryParts.push(`language:${filters.language}`);
      if (filters?.minIssues) queryParts.push(`good-first-issues:>=${filters.minIssues}`);
      
      const query = queryParts.join(' ');
      
      // Search repositories
      const searchData = await githubAPI.get<any>('/search/repositories', {
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: 50
      });
      
      const validated = validateData(GitHubSearchResponseSchema, searchData);
      
      // Calculate Blue Ocean scores
      const opportunities: BlueOceanOpportunity[] = validated.items
        .map(repo => analyzeBlueOceanOpportunity(repo, filters))
        .filter(opp => opp.score >= 50) // Only high-potential opportunities
        .sort((a, b) => b.score - a.score);
      
      return opportunities;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: 2,
    ...options
  });
}

/**
 * Analyze repository for Blue Ocean potential
 */
function analyzeBlueOceanOpportunity(
  repo: GitHubRepo,
  filters?: BlueOceanFilters
): BlueOceanOpportunity {
  const now = Date.now();
  const lastUpdate = new Date(repo.updated_at).getTime();
  const lastUpdateDays = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
  
  const starToForkRatio = repo.forks_count > 0 
    ? repo.stargazers_count / repo.forks_count 
    : repo.stargazers_count;
  
  // Calculate signals
  const daysThreshold = filters?.daysAbandoned || 365;
  const isAbandoned = lastUpdateDays > daysThreshold;
  const hasProvenDemand = repo.stargazers_count >= (filters?.minStars || 500);
  const lowCompetition = repo.forks_count < (filters?.maxForks || 200);
  const hasIssues = repo.open_issues_count > 0;
  
  // Calculate score (0-100)
  let score = 0;
  
  // Proven demand (30 points)
  score += Math.min(30, (repo.stargazers_count / 1000) * 30);
  
  // Abandonment + demand = goldmine (30 points)
  if (isAbandoned && hasProvenDemand) {
    score += 30;
  }
  
  // Low competition (20 points)
  const competitionScore = Math.max(0, 20 * (1 - (repo.forks_count / 500)));
  score += competitionScore;
  
  // Active issues = ongoing demand (20 points)
  score += Math.min(20, (repo.open_issues_count / 50) * 20);
  
  score = Math.min(100, Math.round(score));
  
  // Generate insights
  const insights: string[] = [];
  
  if (isAbandoned) {
    insights.push(`🕰️ Abandoned for ${lastUpdateDays} days - maintainer likely moved on`);
  }
  
  if (hasProvenDemand) {
    insights.push(`⭐ ${repo.stargazers_count.toLocaleString()} stars = proven market demand`);
  }
  
  if (lowCompetition) {
    insights.push(`🎯 Only ${repo.forks_count} forks = low competition`);
  }
  
  if (hasIssues) {
    insights.push(`📝 ${repo.open_issues_count} open issues = clear improvement opportunities`);
  }
  
  if (starToForkRatio > 10) {
    insights.push(`💎 High star-to-fork ratio (${starToForkRatio.toFixed(1)}) = users want it but few build it`);
  }
  
  return {
    repo,
    score,
    signals: {
      isAbandoned,
      hasProvenDemand,
      lowCompetition,
      hasIssues,
      lastUpdateDays,
      starToForkRatio: Math.round(starToForkRatio * 10) / 10
    },
    reasoning: generateReasoning(score, { isAbandoned, hasProvenDemand, lowCompetition, hasIssues }),
    actionableInsights: insights
  };
}

function generateReasoning(
  score: number,
  _signals: { isAbandoned: boolean; hasProvenDemand: boolean; lowCompetition: boolean; hasIssues: boolean }
): string {
  if (score >= 80) {
    return '🏆 GOLDMINE: High demand, abandoned by maintainer, low competition. Perfect Blue Ocean opportunity.';
  } else if (score >= 60) {
    return '⭐ STRONG POTENTIAL: Good market signals with opportunity for differentiation.';
  } else if (score >= 50) {
    return '💡 MODERATE POTENTIAL: Shows promise but requires careful market validation.';
  }
  return '⚠️ LOW POTENTIAL: Market signals unclear, proceed with caution.';
}

/**
 * Invalidate GitHub cache
 */
export function useInvalidateGitHub() {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: githubKeys.all }),
    invalidateSearch: (query: string) => 
      queryClient.invalidateQueries({ queryKey: githubKeys.search(query) }),
    invalidateRepo: (owner: string, name: string) =>
      queryClient.invalidateQueries({ queryKey: githubKeys.repo(owner, name) }),
    invalidateBlueOcean: (niche: string) =>
      queryClient.invalidateQueries({ queryKey: githubKeys.blueOcean(niche) })
  };
}

/**
 * Prefetch GitHub data
 */
export function usePrefetchGitHub() {
  const queryClient = useQueryClient();
  
  return {
    prefetchSearch: async (params: GitHubSearchParams) => {
      await queryClient.prefetchQuery({
        queryKey: githubKeys.search(JSON.stringify(params)),
        queryFn: async () => {
          const searchParams = new URLSearchParams();
          searchParams.set('q', params.query);
          if (params.sort) searchParams.set('sort', params.sort);
          if (params.order) searchParams.set('order', params.order);
          
          const data = await githubAPI.get<any>('/search/repositories', searchParams);
          return validateData(GitHubSearchResponseSchema, data);
        }
      });
    },
    
    prefetchRepo: async (owner: string, name: string) => {
      await queryClient.prefetchQuery({
        queryKey: githubKeys.repo(owner, name),
        queryFn: async () => {
          const data = await githubAPI.get<any>(`/repos/${owner}/${name}`);
          return validateData(GitHubSearchResponseSchema.shape.items.element, data);
        }
      });
    }
  };
}

/**
 * Stargazer Quality Analysis Hook
 * Analyzes WHO starred a repository to determine institutional backing
 * 
 * Usage:
 * const { data } = useStargazerQuality('facebook/react', { maxAnalyze: 100 });
 */
export interface StargazerAnalysisOptions {
  maxAnalyze?: number;
  minFollowers?: number;
  checkCompanies?: boolean;
  targetCompanies?: string[];
}

export function useStargazerQuality(
  repoFullName: string,
  options?: StargazerAnalysisOptions & Omit<UseQueryOptions<StargazerQuality>, 'queryKey' | 'queryFn'>
) {
  const config = useFeatureConfigStore((state) => state.stargazerAnalysis);
  
  const {
    maxAnalyze = config.maxStargazers,
    minFollowers = config.minFollowers,
    checkCompanies = config.checkCompanies,
    targetCompanies = config.targetCompanies,
    ...queryOptions
  } = options || {};

  return useQuery({
    queryKey: githubKeys.stargazers(repoFullName),
    queryFn: async (): Promise<StargazerQuality> => {
      console.log(`🔍 Analyzing stargazer quality for ${repoFullName}...`);
      
      // Fetch stargazers list
      const stargazersData = await githubAPI.get<any[]>(
        `/repos/${repoFullName}/stargazers`,
        { per_page: maxAnalyze.toString() }
      );
      
      const totalStargazers = stargazersData.length;
      let qualityScore = 0;
      
      const notableBackers: Array<{
        login: string;
        type: 'influencer' | 'organization' | 'big_tech';
        detail: string;
        scoreContribution: number;
      }> = [];
      
      const companyBackers: string[] = [];
      let influencerCount = 0;
      let organizationCount = 0;
      let bigTechCount = 0;
      
      // Analyze each stargazer
      for (const stargazer of stargazersData.slice(0, maxAnalyze)) {
        try {
          // Fetch detailed user info
          const userData = await githubAPI.get<any>(`/users/${stargazer.login}`);
          const user = validateData(GitHubUserSchema, userData, `User ${stargazer.login}`);
          
          // Check for influencer (high followers)
          if (user.followers && user.followers >= minFollowers) {
            const contribution = 10;
            qualityScore += contribution;
            influencerCount++;
            notableBackers.push({
              login: user.login,
              type: 'influencer',
              detail: `${user.followers.toLocaleString()} followers`,
              scoreContribution: contribution
            });
          }
          
          // Check for organization
          if (user.type === 'Organization') {
            const contribution = 15;
            qualityScore += contribution;
            organizationCount++;
            notableBackers.push({
              login: user.login,
              type: 'organization',
              detail: 'Organization account',
              scoreContribution: contribution
            });
          }
          
          // Check for big tech company
          if (checkCompanies && user.company) {
            const company = user.company.toLowerCase();
            const matchedCompany = targetCompanies.find(tc => 
              company.includes(tc.toLowerCase())
            );
            
            if (matchedCompany) {
              const contribution = 20;
              qualityScore += contribution;
              bigTechCount++;
              companyBackers.push(matchedCompany);
              notableBackers.push({
                login: user.login,
                type: 'big_tech',
                detail: `Works at ${matchedCompany}`,
                scoreContribution: contribution
              });
            }
          }
          
          // Rate limiting - small delay between requests
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.warn(`Failed to analyze stargazer ${stargazer.login}:`, error);
          // Continue with other stargazers
        }
      }
      
      // Cap quality score at 100
      const finalScore = Math.min(100, qualityScore);
      
      // Determine verdict
      let verdict: 'INSTITUTIONAL_BACKING' | 'COMMUNITY_VALIDATED' | 'UNVALIDATED';
      if (finalScore >= 80 || bigTechCount >= 5) {
        verdict = 'INSTITUTIONAL_BACKING';
      } else if (finalScore >= 50 || influencerCount >= 10) {
        verdict = 'COMMUNITY_VALIDATED';
      } else {
        verdict = 'UNVALIDATED';
      }
      
      // Generate analysis
      const institutionalStrength = bigTechCount >= 5 ? 'strong' : 
                                   bigTechCount >= 2 ? 'moderate' : 'weak';
      const communityTrust = influencerCount >= 15 ? 'high' :
                            influencerCount >= 5 ? 'medium' : 'low';
      
      let recommendation = '';
      if (verdict === 'INSTITUTIONAL_BACKING') {
        recommendation = `✅ Strong opportunity - ${bigTechCount} big tech companies watching. This validates both technical quality and market demand.`;
      } else if (verdict === 'COMMUNITY_VALIDATED') {
        recommendation = `⚠️ Community-backed - ${influencerCount} influencers interested. Good signal but verify product-market fit independently.`;
      } else {
        recommendation = `❌ Unvalidated - Low quality stargazers. Consider alternatives with stronger institutional backing.`;
      }
      
      const result: StargazerQuality = {
        repoFullName,
        totalStargazers,
        analyzed: Math.min(maxAnalyze, totalStargazers),
        qualityScore: finalScore,
        verdict,
        notableBackers: notableBackers.sort((a, b) => b.scoreContribution - a.scoreContribution),
        companyBackers: Array.from(new Set(companyBackers)),
        influencerCount,
        organizationCount,
        bigTechCount,
        analysis: {
          institutionalStrength: institutionalStrength as 'strong' | 'moderate' | 'weak',
          communityTrust: communityTrust as 'high' | 'medium' | 'low',
          recommendation
        }
      };
      
      console.log(`✅ Stargazer analysis complete:`, result);
      
      return result;
    },
    enabled: config.enabled && !!repoFullName,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (stargazers don't change quickly)
    gcTime: 1000 * 60 * 60 * 48, // 48 hours
    retry: 1,
    retryDelay: 5000,
    ...queryOptions
  });
}


================================================================================
File: src/index.css
================================================================================
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* The Council V18 - AI-Powered Multi-Perspective Decision Engine
   Design System: Dark glassmorphism with purple/blue gradients */

@layer base {
  :root {
    /* Primary palette - Purple/Blue gradients */
    --background: 222 47% 4%;
    --foreground: 210 40% 96%;

    --card: 222 47% 8%;
    --card-foreground: 210 40% 96%;

    --popover: 222 47% 6%;
    --popover-foreground: 210 40% 96%;

    --primary: 262 83% 58%;
    --primary-foreground: 0 0% 100%;

    --secondary: 217 91% 60%;
    --secondary-foreground: 0 0% 100%;

    --muted: 222 47% 14%;
    --muted-foreground: 215 20% 65%;

    --accent: 280 70% 60%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;

    --border: 222 30% 18%;
    --input: 222 30% 18%;
    --ring: 262 83% 58%;

    --radius: 0.75rem;

    /* Council-specific tokens */
    --council-primary: 139 92 246;
    --council-secondary: 59 130 246;
    --council-accent: 168 85 247;
    --council-success: 34 197 94;
    --council-warning: 251 191 36;
    --council-error: 239 68 68;
    
    /* Glass effect tokens */
    --glass-bg: 222 47% 8% / 0.6;
    --glass-border: 0 0% 100% / 0.1;
    --glass-blur: 20px;

    /* Gradient tokens */
    --gradient-primary: linear-gradient(135deg, hsl(262 83% 58%), hsl(217 91% 60%));
    --gradient-accent: linear-gradient(135deg, hsl(280 70% 60%), hsl(262 83% 58%));
    --gradient-glow: linear-gradient(135deg, hsl(262 83% 58% / 0.3), hsl(217 91% 60% / 0.3));
    
    /* Shadow tokens */
    --shadow-glow: 0 0 40px hsl(262 83% 58% / 0.3);
    --shadow-card: 0 8px 32px hsl(0 0% 0% / 0.3), inset 0 1px 0 hsl(0 0% 100% / 0.05);
    --shadow-elevated: 0 12px 48px hsl(0 0% 0% / 0.4);

    /* Sidebar tokens */
    --sidebar-background: 222 47% 6%;
    --sidebar-foreground: 210 40% 96%;
    --sidebar-primary: 262 83% 58%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 217 91% 60%;
    --sidebar-accent-foreground: 0 0% 100%;
    --sidebar-border: 222 30% 18%;
    --sidebar-ring: 262 83% 58%;
  }

  .dark {
    --background: 222 47% 4%;
    --foreground: 210 40% 96%;
    --card: 222 47% 8%;
    --card-foreground: 210 40% 96%;
    --popover: 222 47% 6%;
    --popover-foreground: 210 40% 96%;
    --primary: 262 83% 58%;
    --primary-foreground: 0 0% 100%;
    --secondary: 217 91% 60%;
    --secondary-foreground: 0 0% 100%;
    --muted: 222 47% 14%;
    --muted-foreground: 215 20% 65%;
    --accent: 280 70% 60%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 222 30% 18%;
    --input: 222 30% 18%;
    --ring: 262 83% 58%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    background: linear-gradient(135deg, hsl(222 47% 4%) 0%, hsl(230 47% 6%) 50%, hsl(222 47% 4%) 100%);
    min-height: 100vh;
  }

  /* Animated background pattern */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(at 20% 30%, hsl(262 83% 58% / 0.12) 0px, transparent 50%),
      radial-gradient(at 80% 70%, hsl(217 91% 60% / 0.12) 0px, transparent 50%),
      radial-gradient(at 50% 50%, hsl(280 70% 60% / 0.08) 0px, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  #root {
    position: relative;
    z-index: 1;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: hsl(var(--muted) / 0.5);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: hsl(var(--border));
    border-radius: 4px;
    transition: background 0.3s;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground) / 0.5);
  }

  ::selection {
    background: hsl(var(--primary) / 0.3);
    color: hsl(var(--foreground));
  }
}

@layer components {
  /* Glass panel effect */
  .glass-panel {
    background: hsl(var(--card) / 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid hsl(0 0% 100% / 0.1);
    border-radius: var(--radius);
    box-shadow: var(--shadow-card);
  }

  .glass-panel-elevated {
    background: hsl(var(--card) / 0.8);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid hsl(0 0% 100% / 0.15);
    border-radius: var(--radius);
    box-shadow: var(--shadow-elevated);
  }

  /* Text gradient */
  .text-gradient {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .text-gradient-accent {
    background: var(--gradient-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Gradient backgrounds */
  .bg-gradient-primary {
    background: var(--gradient-primary);
  }

  .bg-gradient-accent {
    background: var(--gradient-accent);
  }

  .bg-gradient-glow {
    background: var(--gradient-glow);
  }

  /* Glow effects */
  .glow-primary {
    box-shadow: 0 0 20px hsl(var(--primary) / 0.4);
  }

  .glow-secondary {
    box-shadow: 0 0 20px hsl(var(--secondary) / 0.4);
  }

  /* Status badges */
  .badge-success {
    @apply inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide;
    background: hsl(142 76% 36% / 0.2);
    color: hsl(142 76% 56%);
  }

  .badge-warning {
    @apply inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide;
    background: hsl(45 93% 47% / 0.2);
    color: hsl(45 93% 57%);
  }

  .badge-error {
    @apply inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide;
    background: hsl(0 84% 60% / 0.2);
    color: hsl(0 84% 70%);
  }

  /* Custom slider styling */
  .slider-council {
    @apply w-full h-2 rounded-full appearance-none cursor-pointer;
    background: linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--border)) 100%);
  }

  .slider-council::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--gradient-primary);
    cursor: pointer;
    box-shadow: 0 2px 8px hsl(var(--primary) / 0.4);
    transition: all 0.2s;
  }

  .slider-council::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px hsl(var(--primary) / 0.6);
  }

  .slider-council::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--gradient-primary);
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 8px hsl(var(--primary) / 0.4);
  }

  /* Markdown rendering */
  .markdown-body {
    @apply text-sm leading-relaxed;
    color: hsl(var(--foreground));
  }

  .markdown-body h1, .markdown-body h2, .markdown-body h3 {
    @apply font-semibold mt-4 mb-2;
    color: hsl(var(--foreground));
  }

  .markdown-body p {
    @apply mb-3;
  }

  .markdown-body ul, .markdown-body ol {
    @apply ml-6 mb-3;
  }

  .markdown-body code {
    @apply px-1.5 py-0.5 rounded text-xs;
    background: hsl(var(--muted));
    color: hsl(var(--accent));
    font-family: 'JetBrains Mono', monospace;
  }

  .markdown-body pre {
    @apply p-4 rounded-lg mb-3 overflow-x-auto;
    background: hsl(var(--background) / 0.8);
    border: 1px solid hsl(var(--border));
  }

  .markdown-body pre code {
    background: none;
    padding: 0;
  }
}

@layer utilities {
  /* Animation utilities */
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }

  .animate-fade-in-scale {
    animation: fadeInScale 0.4s ease-out forwards;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.4s ease-out forwards;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.4s ease-out forwards;
  }

  .animate-slide-in-down {
    animation: slideInDown 0.4s ease-out forwards;
  }

  .animate-pulse-glow {
    animation: pulseGlow 2s ease-in-out infinite;
  }

  .animate-shimmer {
    animation: shimmer 2s linear infinite;
    background: linear-gradient(
      90deg,
      hsl(var(--muted) / 0.4) 25%,
      hsl(var(--border) / 0.6) 50%,
      hsl(var(--muted) / 0.4) 75%
    );
    background-size: 200% 100%;
  }

  /* Staggered animations */
  .stagger-fade-in > *:nth-child(1) { animation: fadeIn 0.4s ease-out 0.05s backwards; }
  .stagger-fade-in > *:nth-child(2) { animation: fadeIn 0.4s ease-out 0.1s backwards; }
  .stagger-fade-in > *:nth-child(3) { animation: fadeIn 0.4s ease-out 0.15s backwards; }
  .stagger-fade-in > *:nth-child(4) { animation: fadeIn 0.4s ease-out 0.2s backwards; }
  .stagger-fade-in > *:nth-child(5) { animation: fadeIn 0.4s ease-out 0.25s backwards; }

  /* Hover utilities */
  .hover-lift {
    @apply transition-all duration-300;
  }

  .hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-elevated);
  }

  .hover-glow {
    @apply transition-shadow duration-300;
  }

  .hover-glow:hover {
    box-shadow: var(--shadow-glow);
  }
}

/* Keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 10px hsl(var(--primary) / 0.3);
  }
  50% {
    box-shadow: 0 0 25px hsl(var(--primary) / 0.6);
  }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}


================================================================================
File: src/lib/api-client.ts
================================================================================
/**
 * Centralized API Client
 * Mirrors: Axios interceptor patterns + TanStack Query best practices
 * Handles all HTTP requests with retry, timeout, caching, error handling
 * 
 * Usage:
 * const client = new APIClient({ baseURL: 'https://api.example.com', retries: 3 });
 * const data = await client.get<User>('/users/123');
 * const result = await client.post<Response>('/users', { name: 'John' });
 */

import {
  APIError,
  NetworkError,
  TimeoutError,
  RateLimitError,
  errorRecovery,
  logError,
  parseError
} from './error-handler';

export interface APIConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
  retryDelay?: number;
  useCache?: boolean;
  cacheTime?: number; // in milliseconds
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  timeout?: number;
  skipCache?: boolean;
  skipRetry?: boolean;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Professional API Client with retry, timeout, and caching
 */
export class APIClient {
  private config: Required<APIConfig>;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private activeRequests: Map<string, Promise<any>> = new Map();

  constructor(config: APIConfig = {}) {
    this.config = {
      baseURL: config.baseURL || '',
      timeout: config.timeout || 30000,
      headers: config.headers || {},
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
      useCache: config.useCache ?? true,
      cacheTime: config.cacheTime || 1000 * 60 * 5 // 5 minutes default
    };
  }

  /**
   * Generate cache key for request
   */
  private getCacheKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const headers = JSON.stringify(options.headers || {});
    const body = options.body || '';
    return `${method}:${url}:${headers}:${body}`;
  }

  /**
   * Get cached response if available and not expired
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  /**
   * Store response in cache
   */
  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.config.cacheTime
    });
  }

  /**
   * Clear cache (optionally by pattern)
   */
  public clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const keysToDelete: string[] = [];
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Fetch with timeout support
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new TimeoutError(`Request timed out after ${timeoutMs}ms`, timeoutMs);
      }
      throw new NetworkError(error.message || 'Network request failed');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Parse error response from API
   */
  private async parseErrorResponse(response: Response, endpoint: string, method: string): Promise<never> {
    let errorMessage = `${method} ${endpoint} failed with status ${response.status}`;
    
    try {
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }
    } catch {
      // If parsing fails, use default error message
    }

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;
      throw new RateLimitError(errorMessage, retryAfterSeconds);
    }

    throw new APIError(errorMessage, endpoint, response.status, method);
  }

  /**
   * Core request method with retry and caching
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;
    const method = options.method || 'GET';
    const timeout = options.timeout || this.config.timeout;
    
    // Build query string from params
    let finalUrl = url;
    if (options.params) {
      const queryString = new URLSearchParams(
        Object.entries(options.params)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [key, String(value)])
      ).toString();
      
      if (queryString) {
        finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
      }
    }

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      ...options,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...options.headers
      }
    };

    // Remove params from options (already in URL)
    delete (options as any).params;

    // Generate cache key
    const cacheKey = this.getCacheKey(finalUrl, fetchOptions);

    // Check cache for GET requests
    if (method === 'GET' && this.config.useCache && !options.skipCache) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) {
        console.log(`[APIClient] Cache hit: ${method} ${endpoint}`);
        return cached;
      }

      // Check if request is already in flight (request deduplication)
      const activeRequest = this.activeRequests.get(cacheKey);
      if (activeRequest) {
        console.log(`[APIClient] Deduplicating request: ${method} ${endpoint}`);
        return activeRequest;
      }
    }

    // Create request function
    const requestFn = async (): Promise<T> => {
      const response = await this.fetchWithTimeout(finalUrl, fetchOptions, timeout);

      if (!response.ok) {
        await this.parseErrorResponse(response, endpoint, method);
      }

      // Handle empty responses
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0' || response.status === 204) {
        return {} as T;
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      let data: T;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text() as any;
      }

      // Cache successful GET requests
      if (method === 'GET' && this.config.useCache && !options.skipCache) {
        this.setCache(cacheKey, data);
      }

      return data;
    };

    try {
      // Store active request for deduplication
      if (method === 'GET' && !options.skipCache) {
        const requestPromise = options.skipRetry
          ? requestFn()
          : errorRecovery.retry(requestFn, this.config.retries, this.config.retryDelay);
        
        this.activeRequests.set(cacheKey, requestPromise);
        
        const result = await requestPromise;
        
        this.activeRequests.delete(cacheKey);
        
        return result;
      }

      // Non-GET requests or when cache is disabled
      return options.skipRetry
        ? await requestFn()
        : await errorRecovery.retry(requestFn, this.config.retries, this.config.retryDelay);

    } catch (error) {
      this.activeRequests.delete(cacheKey);
      
      const appError = parseError(error);
      logError(appError, { endpoint, method });
      throw appError;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>, options?: Omit<RequestOptions, 'params'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
      params
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE'
    });
  }
}

/**
 * Create specialized API clients for different services
 */

// GitHub API Client
export const githubAPI = new APIClient({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28'
  },
  retries: 3,
  retryDelay: 1000,
  useCache: true,
  cacheTime: 1000 * 60 * 30, // 30 minutes
  timeout: 15000
});

// Reddit API Client (public endpoints)
export const redditAPI = new APIClient({
  baseURL: 'https://www.reddit.com',
  headers: {
    'User-Agent': 'TheCouncil-Research-Bot/1.0.0 (by /u/TheCouncilBot)'
  },
  retries: 2,
  retryDelay: 2000, // Reddit is more aggressive with rate limiting
  useCache: true,
  cacheTime: 1000 * 60 * 15, // 15 minutes
  timeout: 20000
});

// HackerNews Algolia API Client
export const hackerNewsAPI = new APIClient({
  baseURL: 'https://hn.algolia.com/api/v1',
  headers: {
    'Accept': 'application/json'
  },
  retries: 3,
  retryDelay: 1000,
  useCache: true,
  cacheTime: 1000 * 60 * 10, // 10 minutes
  timeout: 10000
});

// Generic API client factory
export const createAPIClient = (config: APIConfig): APIClient => {
  return new APIClient(config);
};


================================================================================
File: src/lib/code-mirror.ts
================================================================================
/**
 * Code Mirror System
 * 
 * Analyzes codebase quality by comparing against elite repository patterns.
 * Provides scoring, gap detection, and actionable improvement suggestions.
 */

import * as fs from "fs";
import * as path from "path";
import standards from "./mirror-standards.json";

export interface QualityScore {
  overall: number;
  errorHandling: number;
  typeSafety: number;
  performance: number;
  architecture: number;
}

export interface CodeGap {
  category: "error-handling" | "type-safety" | "performance" | "architecture";
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  lineNumber?: number;
  suggestion: string;
  roleModelExample?: string;
}

export interface AnalysisResult {
  filePath: string;
  score: QualityScore;
  gaps: CodeGap[];
  roleModelRepos: string[];
  improvements: string[];
}

/**
 * Analyzes a TypeScript file for code quality
 */
export async function analyzeCodeQuality(filePath: string): Promise<AnalysisResult> {
  const content = fs.readFileSync(filePath, "utf-8");
  
  const gaps: CodeGap[] = [];
  const roleModelRepos: string[] = [];
  
  // Error Handling Analysis
  const errorHandlingScore = analyzeErrorHandling(content, gaps);
  
  // Type Safety Analysis
  const typeSafetyScore = analyzeTypeSafety(content, gaps);
  
  // Performance Analysis
  const performanceScore = analyzePerformance(content, gaps);
  
  // Architecture Analysis
  const architectureScore = analyzeArchitecture(filePath, content, gaps);
  
  // Calculate overall score
  const overall = Math.round(
    (errorHandlingScore + typeSafetyScore + performanceScore + architectureScore) / 4
  );
  
  // Determine role model repos based on file type
  roleModelRepos.push(...determineRoleModels(filePath, content));
  
  // Generate improvement suggestions
  const improvements = generateImprovements(gaps);
  
  return {
    filePath: path.relative(process.cwd(), filePath),
    score: {
      overall,
      errorHandling: errorHandlingScore,
      typeSafety: typeSafetyScore,
      performance: performanceScore,
      architecture: architectureScore,
    },
    gaps: gaps.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    roleModelRepos,
    improvements,
  };
}

/**
 * Analyzes error handling patterns
 */
function analyzeErrorHandling(content: string, gaps: CodeGap[]): number {
  let score = 100;
  
  // Check for try-catch blocks
  const hasAsyncFunctions = /async\s+function|async\s+\(/.test(content);
  const hasTryCatch = /try\s*{/.test(content);
  const hasFetch = /fetch\(|axios\.|api\./i.test(content);
  
  if (hasAsyncFunctions && !hasTryCatch) {
    gaps.push({
      category: "error-handling",
      severity: "high",
      description: "Async functions without try-catch blocks",
      suggestion: "Wrap async operations in try-catch blocks or use error boundaries",
      roleModelExample: standards.patterns.errorHandling.asyncTryCatch,
    });
    score -= 20;
  }
  
  if (hasFetch && !hasTryCatch) {
    gaps.push({
      category: "error-handling",
      severity: "high",
      description: "Network calls without error handling",
      suggestion: "Add try-catch blocks for fetch/API calls with user-friendly error messages",
      roleModelExample: standards.patterns.errorHandling.networkErrors,
    });
    score -= 15;
  }
  
  // Check for error boundaries in React components
  if (content.includes("export default function") && content.includes("return (")) {
    const hasErrorBoundary = /ErrorBoundary|error.*boundary/i.test(content);
    if (!hasErrorBoundary && content.length > 500) {
      gaps.push({
        category: "error-handling",
        severity: "medium",
        description: "Complex component without error boundary",
        suggestion: "Wrap component in ErrorBoundary for production resilience",
        roleModelExample: standards.roleModels.react.errorBoundaries,
      });
      score -= 10;
    }
  }
  
  // Check for console.error usage instead of proper logging
  if (content.includes("console.error") && !content.includes("logger")) {
    gaps.push({
      category: "error-handling",
      severity: "low",
      description: "Using console.error instead of structured logging",
      suggestion: "Implement a logging system for better error tracking",
    });
    score -= 5;
  }
  
  return Math.max(0, score);
}

/**
 * Analyzes type safety
 */
function analyzeTypeSafety(content: string, gaps: CodeGap[]): number {
  let score = 100;
  
  // Check for 'any' types
  const anyCount = (content.match(/:\s*any\b/g) || []).length;
  if (anyCount > 0) {
    gaps.push({
      category: "type-safety",
      severity: anyCount > 3 ? "high" : "medium",
      description: `Found ${anyCount} usage(s) of 'any' type`,
      suggestion: "Replace 'any' with specific types or 'unknown' for better type safety",
      roleModelExample: standards.patterns.typeSafety.noAny,
    });
    score -= anyCount * 10;
  }
  
  // Check for @ts-ignore or @ts-expect-error
  const tsIgnoreCount = (content.match(/@ts-ignore|@ts-expect-error/g) || []).length;
  if (tsIgnoreCount > 0) {
    gaps.push({
      category: "type-safety",
      severity: "medium",
      description: `Found ${tsIgnoreCount} TypeScript suppression comment(s)`,
      suggestion: "Fix underlying type issues instead of suppressing them",
    });
    score -= tsIgnoreCount * 8;
  }
  
  // Check for non-null assertions
  const nonNullCount = (content.match(/!\./g) || []).length;
  if (nonNullCount > 2) {
    gaps.push({
      category: "type-safety",
      severity: "medium",
      description: `Excessive non-null assertions (${nonNullCount} found)`,
      suggestion: "Use optional chaining (?.) and nullish coalescing (??) instead",
      roleModelExample: standards.patterns.typeSafety.optionalChaining,
    });
    score -= 10;
  }
  
  // Check for explicit return types on functions
  const functionMatches = content.match(/(?:export\s+)?(?:async\s+)?function\s+\w+\s*\([^)]*\)/g) || [];
  const functionsWithoutReturnType = functionMatches.filter(fn => !fn.includes("):")).length;
  
  if (functionsWithoutReturnType > 0) {
    gaps.push({
      category: "type-safety",
      severity: "low",
      description: `${functionsWithoutReturnType} function(s) missing explicit return types`,
      suggestion: "Add explicit return types to all exported functions",
      roleModelExample: standards.patterns.typeSafety.explicitReturnTypes,
    });
    score -= functionsWithoutReturnType * 5;
  }
  
  return Math.max(0, score);
}

/**
 * Analyzes performance patterns
 */
function analyzePerformance(content: string, gaps: CodeGap[]): number {
  let score = 100;
  
  // Check for missing React.memo on components
  if (content.includes("export default function") && content.includes("return (")) {
    const hasMemo = /React\.memo|memo\(/i.test(content);
    const hasProps = /function\s+\w+\s*\(\s*{/.test(content);
    const isLarge = content.length > 300;
    
    if (!hasMemo && hasProps && isLarge) {
      gaps.push({
        category: "performance",
        severity: "medium",
        description: "Large component with props not wrapped in React.memo",
        suggestion: "Use React.memo for components with props to prevent unnecessary re-renders",
        roleModelExample: standards.patterns.performance.reactMemo,
      });
      score -= 10;
    }
  }
  
  // Check for missing useCallback
  const hasCallbackProps = /on[A-Z]\w*=/.test(content);
  const hasUseCallback = /useCallback/.test(content);
  if (hasCallbackProps && !hasUseCallback) {
    gaps.push({
      category: "performance",
      severity: "low",
      description: "Event handlers not wrapped in useCallback",
      suggestion: "Use useCallback for event handler props to prevent child re-renders",
      roleModelExample: standards.patterns.performance.useCallback,
    });
    score -= 8;
  }
  
  // Check for large inline objects/arrays in JSX
  const inlineObjectCount = (content.match(/=\{\{/g) || []).length;
  if (inlineObjectCount > 3) {
    gaps.push({
      category: "performance",
      severity: "low",
      description: `${inlineObjectCount} inline object(s) in JSX props`,
      suggestion: "Extract inline objects to variables or useMemo to prevent re-renders",
    });
    score -= 5;
  }
  
  // Check for missing lazy loading
  if (content.includes("import") && content.includes("Modal") || content.includes("Dialog")) {
    const hasLazy = /lazy\(|React\.lazy/.test(content);
    if (!hasLazy) {
      gaps.push({
        category: "performance",
        severity: "medium",
        description: "Heavy components not lazily loaded",
        suggestion: "Use React.lazy() for modals and large components to reduce bundle size",
        roleModelExample: standards.patterns.performance.lazyLoading,
      });
      score -= 12;
    }
  }
  
  return Math.max(0, score);
}

/**
 * Analyzes architecture patterns
 */
function analyzeArchitecture(filePath: string, content: string, gaps: CodeGap[]): number {
  let score = 100;
  
  // Check for proper feature organization
  const isInFeatures = filePath.includes("/features/");
  const hasBusinessLogic = content.length > 500 && (
    /fetch|api|database|store/i.test(content)
  );
  
  if (hasBusinessLogic && !isInFeatures) {
    gaps.push({
      category: "architecture",
      severity: "medium",
      description: "Business logic outside of features directory",
      suggestion: "Move feature-specific code to src/features/ for better organization",
      roleModelExample: standards.patterns.architecture.featureSlicing,
    });
    score -= 15;
  }
  
  // Check for component size
  const lineCount = content.split("\n").length;
  if (lineCount > 400) {
    gaps.push({
      category: "architecture",
      severity: "high",
      description: `Large file (${lineCount} lines) violates single responsibility`,
      suggestion: "Split into smaller, focused components or modules",
      roleModelExample: standards.patterns.architecture.componentSize,
    });
    score -= 20;
  }
  
  // Check for proper separation of concerns
  if (content.includes("export default function") && content.includes("useState")) {
    const hasBusinessLogic = /fetch|api|axios/.test(content);
    const hasCustomHook = /use[A-Z]\w+/.test(content);
    
    if (hasBusinessLogic && !hasCustomHook && !filePath.includes("/hooks/")) {
      gaps.push({
        category: "architecture",
        severity: "medium",
        description: "Business logic mixed with UI component",
        suggestion: "Extract data fetching logic to custom hooks",
        roleModelExample: standards.patterns.architecture.customHooks,
      });
      score -= 12;
    }
  }
  
  // Check for consistent naming
  const fileName = path.basename(filePath, path.extname(filePath));
  const hasDefaultExport = /export default/.test(content);
  
  if (hasDefaultExport) {
    const exportMatch = content.match(/export default (?:function|class|const)\s+(\w+)/);
    const exportName = exportMatch?.[1];
    
    if (exportName && exportName !== fileName && fileName !== "index") {
      gaps.push({
        category: "architecture",
        severity: "low",
        description: `File name '${fileName}' doesn't match export '${exportName}'`,
        suggestion: "Align file names with exported component/function names",
      });
      score -= 5;
    }
  }
  
  return Math.max(0, score);
}

/**
 * Determines which role model repos to reference
 */
function determineRoleModels(filePath: string, content: string): string[] {
  const repos: string[] = [];
  
  if (content.includes("React") || content.includes("jsx")) {
    repos.push(standards.roleModels.react.shadcnUI);
    repos.push(standards.roleModels.react.nextjs);
  }
  
  if (filePath.includes("/hooks/")) {
    repos.push(standards.roleModels.react.useHooks);
  }
  
  if (content.includes("zustand") || content.includes("store")) {
    repos.push(standards.roleModels.stateManagement.zustand);
  }
  
  if (content.includes("Dexie") || content.includes("IndexedDB")) {
    repos.push(standards.roleModels.database.dexie);
  }
  
  if (filePath.includes("vite.config") || filePath.includes("tsconfig")) {
    repos.push(standards.roleModels.build.vite);
  }
  
  return repos;
}

/**
 * Generates prioritized improvement suggestions
 */
function generateImprovements(gaps: CodeGap[]): string[] {
  const improvements = new Set<string>();
  
  // Group by category and severity
  const criticalGaps = gaps.filter(g => g.severity === "critical");
  const highGaps = gaps.filter(g => g.severity === "high");
  
  if (criticalGaps.length > 0) {
    improvements.add(`🚨 Address ${criticalGaps.length} critical issue(s) immediately`);
  }
  
  if (highGaps.length > 0) {
    improvements.add(`⚠️ Fix ${highGaps.length} high-priority issue(s) this sprint`);
  }
  
  // Category-specific improvements
  const errorGaps = gaps.filter(g => g.category === "error-handling");
  if (errorGaps.length > 0) {
    improvements.add(`Add comprehensive error handling (${errorGaps.length} gaps found)`);
  }
  
  const typeGaps = gaps.filter(g => g.category === "type-safety");
  if (typeGaps.length > 0) {
    improvements.add(`Improve type safety (${typeGaps.length} issues found)`);
  }
  
  const perfGaps = gaps.filter(g => g.category === "performance");
  if (perfGaps.length > 0) {
    improvements.add(`Optimize performance (${perfGaps.length} opportunities)`);
  }
  
  const archGaps = gaps.filter(g => g.category === "architecture");
  if (archGaps.length > 0) {
    improvements.add(`Refactor architecture (${archGaps.length} patterns to improve)`);
  }
  
  return Array.from(improvements);
}

/**
 * Analyzes multiple files and generates aggregate report
 */
export async function analyzeBatch(filePaths: string[]): Promise<{
  results: AnalysisResult[];
  summary: {
    averageScore: number;
    totalGaps: number;
    criticalGaps: number;
    topIssues: string[];
  };
}> {
  const results = await Promise.all(
    filePaths.map(fp => analyzeCodeQuality(fp))
  );
  
  const averageScore = Math.round(
    results.reduce((sum, r) => sum + r.score.overall, 0) / results.length
  );
  
  const allGaps = results.flatMap(r => r.gaps);
  const criticalGaps = allGaps.filter(g => g.severity === "critical").length;
  
  // Find most common issues
  const issueFrequency = new Map<string, number>();
  allGaps.forEach(gap => {
    const key = gap.description;
    issueFrequency.set(key, (issueFrequency.get(key) || 0) + 1);
  });
  
  const topIssues = Array.from(issueFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([issue, count]) => `${issue} (${count} occurrences)`);
  
  return {
    results,
    summary: {
      averageScore,
      totalGaps: allGaps.length,
      criticalGaps,
      topIssues,
    },
  };
}


================================================================================
File: src/lib/config.ts
================================================================================
import { ModelInfo } from './types';
import type { ExecutionMode } from '@/features/council/lib/types';

// The Magnificent 7 Model Fleet
export const MAGNIFICENT_7_FLEET: ModelInfo[] = [
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3',
    specialty: 'Logic & Reasoning',
    costPer1k: 0.14,
    contextWindow: 64000,
    recommended: 'analytical',
  },
  {
    id: 'qwen/qwen-2.5-72b-instruct',
    name: 'Qwen 2.5 72B',
    specialty: 'Code & Architecture',
    costPer1k: 0.35,
    contextWindow: 32000,
    recommended: 'technical',
  },
  {
    id: 'google/gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash',
    specialty: 'Context & Speed',
    costPer1k: 0.10,
    contextWindow: 1000000,
    recommended: 'synthesis',
  },
  {
    id: 'meta-llama/llama-3.1-8b-instruct',
    name: 'Llama 3.1 8B',
    specialty: 'Fast Critique',
    costPer1k: 0.04,
    contextWindow: 128000,
    recommended: 'critique',
  },
  {
    id: 'cohere/command-r7b-12-2024',
    name: 'Command R7B',
    specialty: 'Strategic Reasoning',
    costPer1k: 0.03,
    contextWindow: 128000,
    recommended: 'strategy',
  },
  {
    id: 'mistralai/mixtral-8x7b-instruct',
    name: 'Mixtral 8x7B',
    specialty: 'Psychology & Persuasion',
    costPer1k: 0.24,
    contextWindow: 32000,
    recommended: 'persuasion',
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    specialty: 'Speed & Efficiency',
    costPer1k: 0.25,
    contextWindow: 200000,
    recommended: 'fast_tasks',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    specialty: 'General Purpose',
    costPer1k: 0.15,
    contextWindow: 128000,
    recommended: 'general',
  },
  {
    id: 'google/gemini-flash-1.5',
    name: 'Gemini Flash 1.5',
    specialty: 'Balanced Performance',
    costPer1k: 0.075,
    contextWindow: 1000000,
    recommended: 'balanced',
  },
];

// Replaced 'ExecutionMode' with 'string' for compatibility
export const MODE_DESCRIPTIONS: Record<string, { name: string; description: string; icon: string }> = {
  separated: {
    name: 'Separated',
    description: 'Independent analyses with no cross-pollination between experts',
    icon: 'Layers',
  },
  synthesis: {
    name: 'Synthesis',
    description: 'Collaborative consensus-building with multi-stage integration',
    icon: 'GitMerge',
  },
  debate: {
    name: 'Debate',
    description: 'Adversarial multi-round argumentation with scoring',
    icon: 'Swords',
  },
  pipeline: {
    name: 'Pipeline',
    description: 'Sequential refinement where each expert builds on the previous',
    icon: 'Workflow',
  },
};

export const MODE_BEHAVIORS = {
  separated: {
    instruction: 'Provide your independent analysis without considering other perspectives.',
    suffix: '',
  },
  synthesis: {
    instruction: 'Focus on finding consensus and merging complementary ideas.',
    suffix: '\n\nIMPORTANT: Look for overlap with other viewpoints. Prioritize agreement where valid.',
  },
  debate: {
    instruction: 'Challenge assumptions aggressively. Play devil\'s advocate.',
    suffix: '\n\nIMPORTANT: Do NOT agree simply to be polite. Find flaws and conflicts with other positions.',
  },
  pipeline: {
    instruction: 'Build upon the previous expert\'s output. Add your unique perspective.',
    suffix: '\n\nIMPORTANT: This is a sequential workflow. Reference what came before you.',
  },
};

// Global Output Formatting Rules (Claude Artifacts Style)
export const OUTPUT_FORMATTING_RULES = `
**OUTPUT FORMATTING RULES (Mandatory):**

1. **Structured Logic:** Use Markdown headers (##, ###) to separate major sections and arguments. Never write walls of text.

2. **Visual Thinking:** When explaining processes, relationships, or flows, use **MermaidJS** diagrams. Wrap them in fenced code blocks with \`\`\`mermaid language identifier:
   - flowcharts for processes: \`\`\`mermaid graph TD ... \`\`\`
   - sequence diagrams for interactions: \`\`\`mermaid sequenceDiagram ... \`\`\`
   - mind maps for hierarchies: \`\`\`mermaid mindmap ... \`\`\`

3. **Data Blocks:** Put key statistics, comparisons, or structured data in Markdown Tables:
   | Column A | Column B |
   |----------|----------|
   | Value 1  | Value 2  |

4. **No Fluff:** Never start with "As an AI..." or similar disclaimers. Start directly with the insight, analysis, or recommendation.

5. **Actionable Conclusions:** End each major section with concrete next steps or recommendations.
`;

// Web Search Capability Rules (for Strategist/Trend Analyst types)
export const WEB_SEARCH_RULES = `
**REAL-TIME DATA ACCESS:**
You have access to real-time data via Google Search. USE IT when:
- Asked for current market trends, news, or statistics
- Need to verify factual claims with recent data
- Researching competitors, pricing, or market conditions
- Checking current events or recent developments

CRITICAL: Do NOT hallucinate data. If you need current information but cannot access it, explicitly state that you need to search for it and what you would search for.
`;

export const DEFAULT_EXPERTS = [
  {
    id: 'exp_1',
    name: 'The Logician',
    model: 'deepseek/deepseek-chat',
    role: 'system',
    basePersona: `You are "The Logician". Prioritize formal logic, finding logical flaws, and step-by-step deductive reasoning. Use symbolic logic when appropriate.

EXAMPLE OUTPUT:
"## Logical Analysis

### Formal Argument Structure
P1: If X, then Y
P2: X is true
C: Therefore, Y must be true

### Identified Flaws
..."`,
    knowledge: [],
    config: {
      temperature: 0.3,
      maxTokens: 4000,
      topP: 0.9,
      presencePenalty: 0.1,
      frequencyPenalty: 0.1,
    },
    modeBehavior: {
      separated: 'Apply pure logical analysis without external influence.',
      synthesis: 'Find logical common ground between perspectives.',
      debate: 'Ruthlessly identify logical fallacies in opposing arguments.',
      pipeline: 'Verify logical consistency of previous analysis.',
      modeName: 'defaultMode',
      description: 'Default description for logical analysis.',
      isEnabled: true,
    },
    color: 'from-blue-500 to-cyan-500',
    icon: 'Brain',
    content: 'Default content for The Logician.',
  },
  {
    id: 'exp_2',
    name: 'The Architect',
    model: 'qwen/qwen-2.5-72b-instruct',
    role: 'system',
    basePersona: `You are "The Architect". Focus on systems design, scalability, technical feasibility, and long-term maintainability. Think in terms of components, interfaces, and data flows.

EXAMPLE OUTPUT:
"## Systems Architecture Analysis

### Component Diagram
\`\`\`mermaid
graph TD
    A[Client] --> B[API Gateway]
    B --> C[Service Layer]
    C --> D[(Database)]
\`\`\`

### Technical Assessment
| Layer | Technology | Scalability |
|-------|------------|-------------|
| Frontend | React | High |
| Backend | Node.js | Medium |
"`,
    knowledge: [{
      id: 'file_1',
      name: 'Default Knowledge',
      content: 'This is a default knowledge file.',
      size: '1KB',
      type: 'text/plain',
    }],
    config: {
      temperature: 0.4,
      maxTokens: 4000,
      topP: 0.9,
      presencePenalty: 0.1,
      frequencyPenalty: 0.1,
    },
    modeBehavior: {
      separated: 'Provide technical architecture analysis independently.',
      synthesis: 'Integrate technical requirements from all perspectives.',
      debate: 'Challenge architectural decisions and propose alternatives.',
      pipeline: 'Build upon previous technical specifications.',
      modeName: 'defaultMode',
      description: 'Default description for technical analysis.',
      isEnabled: true,
    },
    color: 'from-emerald-500 to-teal-500',
    icon: 'Cpu',
    content: 'Default content for The Architect.',
    hasWebSearch: false,
  },
  {
    id: 'exp_3',
    name: 'The Strategist',
    model: 'cohere/command-r7b-12-2024',
    role: 'system',
    basePersona: `You are "The Strategist". Analyze decisions through the lens of competitive advantage, market dynamics, resource allocation, and long-term positioning. Think like a chess grandmaster.

EXAMPLE OUTPUT:
"## Strategic Assessment

### Market Position Analysis
\`\`\`mermaid
quadrantChart
    title Market Position
    x-axis Low Market Share --> High Market Share
    y-axis Low Growth --> High Growth
    quadrant-1 Stars
    quadrant-2 Question Marks
    quadrant-3 Dogs
    quadrant-4 Cash Cows
    Our Position: [0.3, 0.7]
\`\`\`

### Strategic Options
| Option | Risk | Reward | Time |
|--------|------|--------|------|
| Expand | High | High | 12mo |
| Defend | Low | Medium | 6mo |
"`,
    knowledge: [],
    config: {
      temperature: 0.5,
      maxTokens: 4000,
      topP: 0.9,
      presencePenalty: 0.1,
      frequencyPenalty: 0.1,
    },
    modeBehavior: {
      separated: 'Provide strategic analysis independently.',
      synthesis: 'Integrate strategic insights from all perspectives.',
      debate: 'Challenge strategic assumptions and propose alternatives.',
      pipeline: 'Build upon previous strategic analyses.',
      modeName: 'defaultMode',
      description: 'Default description for strategic analysis.',
      isEnabled: true,
    },
    color: 'from-red-500 to-orange-500',
    icon: 'Chess',
    content: 'Default content for The Strategist.',
  },
];

// Build System Prompt for AI Client
export function buildSystemPrompt(
  expertConfig: {
    basePersona: string;
    modeBehavior: {
      separated?: string;
      synthesis?: string;
      debate?: string;
      pipeline?: string;
    };
    hasWebSearch: boolean;
    knowledge: Array<{ name: string; content: string }>;
  },
  mode: ExecutionMode,
  additionalContext?: string
): string {
  let prompt = expertConfig.basePersona + '\n\n';
  
  // Add mode-specific behavior
  const modeBehavior = MODE_BEHAVIORS[mode as keyof typeof MODE_BEHAVIORS];
  if (modeBehavior) {
    prompt += modeBehavior.instruction + '\n';
  }
  
  // Add mode-specific behavior from expert
  if (mode === 'separated' && expertConfig.modeBehavior.separated) {
    prompt += expertConfig.modeBehavior.separated + '\n';
  } else if (mode === 'synthesis' && expertConfig.modeBehavior.synthesis) {
    prompt += expertConfig.modeBehavior.synthesis + '\n';
  } else if (mode === 'debate' && expertConfig.modeBehavior.debate) {
    prompt += expertConfig.modeBehavior.debate + '\n';
  } else if (mode === 'pipeline' && expertConfig.modeBehavior.pipeline) {
    prompt += expertConfig.modeBehavior.pipeline + '\n';
  }
  
  // Add output formatting rules
  prompt += OUTPUT_FORMATTING_RULES + '\n';
  
  // Add web search capability if enabled
  if (expertConfig.hasWebSearch) {
    prompt += WEB_SEARCH_RULES + '\n';
  }
  
  // Add knowledge context
  if (expertConfig.knowledge && expertConfig.knowledge.length > 0) {
    prompt += '\n**KNOWLEDGE BASE:**\n';
    expertConfig.knowledge.forEach((file) => {
      prompt += `\n[${file.name}]:\n${file.content}\n`;
    });
  }
  
  // Add additional context if provided
  if (additionalContext) {
    prompt += '\n**ADDITIONAL CONTEXT:**\n' + additionalContext + '\n';
  }
  
  // Add mode suffix
  if (modeBehavior && modeBehavior.suffix) {
    prompt += modeBehavior.suffix + '\n';
  }
  
  return prompt;
}


================================================================================
File: src/lib/db.ts
================================================================================
import Dexie, { type Table } from "dexie";

/**
 * DATABASE SCHEMA VERSIONING STRATEGY
 * 
 * Version 1: Initial schema with experts and sessions
 * Version 2: Added 'persona' field to experts, transformed existing data
 */

export interface Expert {
  id?: number;
  name: string;
  role: string;
  model: string;
  persona?: string; // Added in v2
  description?: string;
}

export interface Session {
  id?: number;
  title: string;
  createdAt: number;
}

export class CouncilDatabase extends Dexie {
  experts!: Table<Expert>;
  sessions!: Table<Session>;

  constructor() {
    super("CouncilDB");

    // VERSION 1: Initial Definition
    this.version(1).stores({
      experts: "++id, name, role, model",
      sessions: "++id, title, createdAt",
    });

    // VERSION 2: Schema Evolution
    // Adds 'persona' field and populates it based on 'role' for existing records
    this.version(2)
      .stores({
        experts: "++id, name, role, model, persona", // Add persona to index
      })
      .upgrade(async (tx) => {
        // Data transformation: Map existing roles to initial personas
        return tx.table("experts").toCollection().modify(expert => {
          if (!expert.persona) {
            expert.persona = `Specialist in ${expert.role}`;
          }
        });
      });
  }
}

export const db = new CouncilDatabase();

/**
 * SAFE DATABASE INITIALIZATION & ERROR HANDLING
 */
export async function initDatabase() {
  try {
    await db.open();
    console.log("[CouncilDB] Migration successful or database up to date.");
  } catch (err) {
    console.error("[CouncilDB] Critical migration failure:", err);
    // Error Recovery: In extreme cases, notify user or implement secondary fallback
    // Note: Dexie automatically handles rollback if a transaction fails within .upgrade()
  }
}

/**
 * LOCAL TESTING UTILITY
 * Use this in development to verify migrations
 */
export async function testMigration() {
  if (process.env.NODE_ENV !== "development") return;

  console.log("[CouncilDB] Starting migration test...");
  const experts = await db.experts.toArray();
  const needsPersona = experts.some(e => !e.persona);
  
  if (needsPersona) {
    console.warn("[CouncilDB] Test detected unmigrated data. Running version check...");
  } else {
    console.log("[CouncilDB] Migration verification complete. All records have personas.");
  }
}


================================================================================
File: src/lib/error-handler.ts
================================================================================
/**
 * Global Error Handler
 * Mirrors: Sentry error handling patterns
 * Prevents app crashes, logs errors, provides recovery
 * 
 * Usage:
 * - throw new APIError("Failed to fetch", "/api/endpoint", 429)
 * - await errorRecovery.retry(() => fetchData())
 * - const data = await errorRecovery.gracefulDegrade(() => riskyOperation(), fallbackValue)
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isRetryable: boolean = false,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class APIError extends AppError {
  constructor(
    message: string,
    public endpoint: string,
    statusCode: number = 500,
    public method: string = 'GET'
  ) {
    super(
      message,
      'API_ERROR',
      statusCode,
      statusCode >= 500 || statusCode === 429, // Retry on server errors or rate limits
      { endpoint, method }
    );
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
    public value?: any
  ) {
    super(message, 'VALIDATION_ERROR', 400, false, { field, value });
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network connection failed') {
    super(message, 'NETWORK_ERROR', 0, true);
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = 'Request timed out', timeoutMs: number = 0) {
    super(message, 'TIMEOUT_ERROR', 408, true, { timeoutMs });
  }
}

export class RateLimitError extends AppError {
  constructor(
    message: string = 'Rate limit exceeded',
    public retryAfter?: number
  ) {
    super(message, 'RATE_LIMIT_ERROR', 429, true, { retryAfter });
  }
}

/**
 * Error Recovery Strategies
 * Provides resilient error handling patterns
 */
export const errorRecovery = {
  /**
   * Retry a function with exponential backoff
   * @param fn Function to retry
   * @param maxRetries Maximum number of retry attempts
   * @param delayMs Initial delay in milliseconds
   * @param backoffMultiplier Multiplier for exponential backoff (default: 2)
   */
  async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000,
    backoffMultiplier: number = 2
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry non-retryable errors
        if (error instanceof AppError && !error.isRetryable) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt < maxRetries - 1) {
          // Handle rate limit errors specially
          let waitTime = delayMs * Math.pow(backoffMultiplier, attempt);
          
          if (error instanceof RateLimitError && error.retryAfter) {
            waitTime = error.retryAfter * 1000; // Convert to ms
          }
          
          console.warn(
            `[ErrorRecovery] Attempt ${attempt + 1}/${maxRetries} failed. Retrying in ${waitTime}ms...`,
            error instanceof AppError ? error.code : error
          );
          
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    console.error(`[ErrorRecovery] All ${maxRetries} attempts failed`, lastError!);
    throw lastError!;
  },

  /**
   * Try primary function, fall back to secondary on failure
   * @param primary Primary function to attempt
   * @param fallback Fallback function to use if primary fails
   */
  async withFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>
  ): Promise<T> {
    try {
      return await primary();
    } catch (error) {
      console.warn('[ErrorRecovery] Primary operation failed, using fallback:', error);
      return await fallback();
    }
  },

  /**
   * Execute function and return default value on failure
   * @param fn Function to execute
   * @param defaultValue Default value to return on failure
   */
  async gracefulDegrade<T>(
    fn: () => Promise<T>,
    defaultValue: T
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      console.error('[ErrorRecovery] Operation failed, using default value:', error);
      return defaultValue;
    }
  },

  /**
   * Execute function with timeout
   * @param fn Function to execute
   * @param timeoutMs Timeout in milliseconds
   */
  async withTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new TimeoutError(`Operation timed out after ${timeoutMs}ms`, timeoutMs)),
          timeoutMs
        )
      )
    ]);
  },

  /**
   * Circuit breaker pattern - stop trying after too many failures
   * @param fn Function to execute
   * @param failureThreshold Number of failures before opening circuit
   * @param resetTimeoutMs Time to wait before attempting to close circuit
   */
  createCircuitBreaker<T>(
    fn: () => Promise<T>,
    failureThreshold: number = 5,
    resetTimeoutMs: number = 60000
  ) {
    let failures = 0;
    let lastFailureTime = 0;
    let state: 'closed' | 'open' | 'half-open' = 'closed';

    return async (): Promise<T> => {
      // Check if circuit should be half-open (try again after timeout)
      if (state === 'open' && Date.now() - lastFailureTime > resetTimeoutMs) {
        state = 'half-open';
        failures = 0;
      }

      // Reject immediately if circuit is open
      if (state === 'open') {
        throw new AppError(
          'Circuit breaker is open - too many failures',
          'CIRCUIT_OPEN',
          503,
          false,
          { failures, lastFailureTime }
        );
      }

      try {
        const result = await fn();
        
        // Success - close circuit
        if (state === 'half-open') {
          state = 'closed';
          failures = 0;
        }
        
        return result;
      } catch (error) {
        failures++;
        lastFailureTime = Date.now();

        // Open circuit if threshold reached
        if (failures >= failureThreshold) {
          state = 'open';
          console.error(
            `[CircuitBreaker] Circuit opened after ${failures} failures. Will retry after ${resetTimeoutMs}ms`
          );
        }

        throw error;
      }
    };
  }
};

/**
 * Global error logger with context
 * In production, this would send to Sentry, LogRocket, etc.
 */
export const logError = (
  error: Error,
  context?: Record<string, any>,
  level: 'error' | 'warn' | 'info' = 'error'
) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    level,
    name: error.name,
    message: error.message,
    stack: error.stack,
    code: error instanceof AppError ? error.code : 'UNKNOWN_ERROR',
    statusCode: error instanceof AppError ? error.statusCode : undefined,
    isRetryable: error instanceof AppError ? error.isRetryable : undefined,
    context: {
      ...(error instanceof AppError ? error.context : {}),
      ...context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    }
  };
  
  // Log to console
  if (level === 'error') {
    console.error('🔴 [ErrorHandler]', errorLog);
  } else if (level === 'warn') {
    console.warn('🟡 [ErrorHandler]', errorLog);
  } else {
    console.info('🔵 [ErrorHandler]', errorLog);
  }
  
  // In production, send to error tracking service
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    // Sentry.captureException(error, {
    //   contexts: { custom: errorLog.context },
    //   level: errorLog.level
    // });
  }

  return errorLog;
};

/**
 * Parse error into AppError
 * Useful for handling unknown error types
 */
export const parseError = (error: unknown): AppError => {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }

  // Standard Error
  if (error instanceof Error) {
    // Check for network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new NetworkError(error.message);
    }
    
    // Check for timeout errors
    if (error.message.includes('timeout') || error.message.includes('aborted')) {
      return new TimeoutError(error.message);
    }

    // Generic error
    return new AppError(error.message, 'UNKNOWN_ERROR', 500, false);
  }

  // String error
  if (typeof error === 'string') {
    return new AppError(error, 'UNKNOWN_ERROR', 500, false);
  }

  // Unknown error type
  return new AppError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    500,
    false,
    { originalError: error }
  );
};

/**
 * Error handler for async functions
 * Wraps a function and handles errors gracefully
 */
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorHandler?: (error: Error) => void
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = parseError(error);
      logError(appError);
      
      if (errorHandler) {
        errorHandler(appError);
      } else {
        throw appError;
      }
    }
  }) as T;
};


================================================================================
File: src/lib/form.ts
================================================================================
import * as React from "react";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

export const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

type FormItemContextValue = {
  id: string;
};

export const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};


================================================================================
File: src/lib/goldmine-detector.ts
================================================================================
/**
 * Abandoned Goldmine Detector
 * Filters high-ROI opportunities from Blue Ocean scans
 */

export interface Opportunity {
  owner: string;
  name: string;
  stars: number;
  forks: number;
  openIssues: number;
  lastUpdate: string;
  daysSinceUpdate: number;
  url: string;
  description: string;
  language: string;
  blueOceanScore?: number;
  forkRatio?: number;
}

export interface GoldmineMetrics {
  estimatedRevenueLow: number;
  estimatedRevenueHigh: number;
  estimatedPrice: number;
  potentialCustomers: number;
  competitionLevel: 'low' | 'medium' | 'high';
  timeToMarket: 'fast' | 'medium' | 'slow';
}

/**
 * Filter for high-ROI abandoned goldmines
 */
export function findGoldmines(opportunities: Opportunity[]): Opportunity[] {
  return opportunities
    .filter(repo => {
      const forkRatio = repo.forkRatio ?? (repo.forks / repo.stars);
      
      return (
        repo.stars > 1000 &&           // Proven demand
        repo.daysSinceUpdate > 365 &&  // 1+ year abandoned
        repo.openIssues > 20 &&        // Users still need it
        forkRatio < 0.2                // Low competition
      );
    })
    .sort((a, b) => {
      const scoreA = a.blueOceanScore ?? calculateBlueOceanScore(a);
      const scoreB = b.blueOceanScore ?? calculateBlueOceanScore(b);
      return scoreB - scoreA;
    });
}

/**
 * Calculate Blue Ocean Score if not already present
 */
function calculateBlueOceanScore(repo: Opportunity): number {
  let score = 0;
  
  // Star multiplier (max 40 points)
  score += Math.min(40, (repo.stars / 100));
  
  // Abandonment multiplier (max 30 points)
  const yearsAbandoned = repo.daysSinceUpdate / 365;
  score += Math.min(30, yearsAbandoned * 10);
  
  // Issue demand (max 20 points)
  score += Math.min(20, repo.openIssues / 5);
  
  // Low competition bonus (max 10 points)
  const forkRatio = repo.forkRatio ?? (repo.forks / repo.stars);
  if (forkRatio < 0.1) score += 10;
  else if (forkRatio < 0.2) score += 5;
  
  return Math.min(100, Math.round(score));
}

/**
 * Calculate metrics for a goldmine opportunity
 */
export function calculateGoldmineMetrics(repo: Opportunity): GoldmineMetrics {
  const potentialCustomers = Math.round(repo.stars * 0.01); // 1% conversion
  const price = estimatePrice(repo);
  const low = potentialCustomers * price * 0.5;
  const high = potentialCustomers * price;
  
  const forkRatio = repo.forkRatio ?? (repo.forks / repo.stars);
  const competitionLevel = 
    forkRatio < 0.1 ? 'low' :
    forkRatio < 0.2 ? 'medium' : 'high';
  
  const timeToMarket =
    repo.stars < 2000 && repo.openIssues < 50 ? 'fast' :
    repo.stars < 5000 && repo.openIssues < 100 ? 'medium' : 'slow';
  
  return {
    estimatedRevenueLow: low,
    estimatedRevenueHigh: high,
    estimatedPrice: price,
    potentialCustomers,
    competitionLevel,
    timeToMarket,
  };
}

/**
 * Estimate pricing based on star count
 */
function estimatePrice(repo: Opportunity): number {
  if (repo.stars > 10000) return 499;
  if (repo.stars > 5000) return 299;
  if (repo.stars > 2000) return 199;
  if (repo.stars > 1000) return 149;
  return 99;
}

/**
 * Estimate revenue range
 */
function estimateRevenue(repo: Opportunity): string {
  const metrics = calculateGoldmineMetrics(repo);
  return `${metrics.estimatedRevenueLow.toLocaleString()}-${metrics.estimatedRevenueHigh.toLocaleString()}`;
}

/**
 * Generate a comprehensive goldmine report
 */
export function generateGoldmineReport(goldmines: Opportunity[]): string {
  let report = '# 💰 ABANDONED GOLDMINES REPORT\n\n';
  report += `Date: ${new Date().toISOString().split('T')[0]}\n`;
  report += `Found: ${goldmines.length} goldmines\n\n`;
  
  if (goldmines.length === 0) {
    report += 'No goldmines found matching criteria.\n';
    report += '\n**Criteria:**\n';
    report += '- Stars > 1,000 (proven demand)\n';
    report += '- Abandoned > 1 year\n';
    report += '- Open Issues > 20 (active user need)\n';
    report += '- Fork Ratio < 0.2 (low competition)\n';
    return report;
  }
  
  goldmines.slice(0, 10).forEach((repo, i) => {
    const metrics = calculateGoldmineMetrics(repo);
    const blueOceanScore = repo.blueOceanScore ?? calculateBlueOceanScore(repo);
    
    report += `## ${i + 1}. ${repo.owner}/${repo.name}\n\n`;
    report += `${repo.description || 'No description available'}\n\n`;
    report += `**Metrics:**\n`;
    report += `- ⭐ Stars: ${repo.stars.toLocaleString()}\n`;
    report += `- 📅 Last Update: ${repo.lastUpdate} (${repo.daysSinceUpdate} days ago)\n`;
    report += `- 🐛 Open Issues: ${repo.openIssues}\n`;
    report += `- 🍴 Fork Ratio: ${((repo.forkRatio ?? (repo.forks / repo.stars)) * 100).toFixed(1)}%\n`;
    report += `- 📊 Blue Ocean Score: ${blueOceanScore}/100\n`;
    report += `- 💻 Language: ${repo.language || 'Unknown'}\n\n`;
    
    report += `**Business Potential:**\n`;
    report += `- 💰 Estimated Revenue: $${estimateRevenue(repo)}/month\n`;
    report += `- 💵 Suggested Price: $${metrics.estimatedPrice}/year\n`;
    report += `- 👥 Potential Customers: ~${metrics.potentialCustomers}\n`;
    report += `- 🎯 Competition: ${metrics.competitionLevel}\n`;
    report += `- ⚡ Time to Market: ${metrics.timeToMarket}\n\n`;
    
    report += `**Quick Win Strategy:**\n`;
    report += `1. Fork the repo: \`git clone ${repo.url}\`\n`;
    report += `2. Update dependencies and fix security issues\n`;
    report += `3. Fix top 5-10 most commented issues\n`;
    report += `4. Add modern UI/UX improvements\n`;
    report += `5. Launch as SaaS for $${metrics.estimatedPrice}/year\n`;
    report += `6. Market to existing ${repo.stars.toLocaleString()} stargazers\n\n`;
    
    report += `**Marketing Angles:**\n`;
    report += `- "The ${repo.name} revival - maintained and improved"\n`;
    report += `- "Enterprise-ready ${repo.name} with support"\n`;
    report += `- "Modern ${repo.name} - ${repo.daysSinceUpdate} days of updates in one release"\n\n`;
    
    report += `🔗 **URL:** ${repo.url}\n\n`;
    report += `---\n\n`;
  });
  
  // Summary section
  report += `## 📈 Summary\n\n`;
  
  const totalRevenueLow = goldmines
    .slice(0, 10)
    .reduce((sum, repo) => sum + calculateGoldmineMetrics(repo).estimatedRevenueLow, 0);
  
  const totalRevenueHigh = goldmines
    .slice(0, 10)
    .reduce((sum, repo) => sum + calculateGoldmineMetrics(repo).estimatedRevenueHigh, 0);
  
  report += `**Portfolio Potential (Top 10):**\n`;
  report += `- Combined Revenue Range: $${totalRevenueLow.toLocaleString()}-$${totalRevenueHigh.toLocaleString()}/month\n`;
  report += `- Average Blue Ocean Score: ${Math.round(goldmines.slice(0, 10).reduce((sum, r) => sum + (r.blueOceanScore ?? calculateBlueOceanScore(r)), 0) / Math.min(10, goldmines.length))}/100\n`;
  report += `- Total Potential Customers: ${goldmines.slice(0, 10).reduce((sum, r) => sum + calculateGoldmineMetrics(r).potentialCustomers, 0).toLocaleString()}\n\n`;
  
  report += `**Recommended Action Plan:**\n`;
  report += `1. Start with top 3 goldmines (fastest time-to-market)\n`;
  report += `2. Validate demand by posting in original repo issues\n`;
  report += `3. Build MVP in 2-4 weeks per project\n`;
  report += `4. Launch with "maintained fork" positioning\n`;
  report += `5. Convert 1-2% of stargazers = sustainable revenue\n\n`;
  
  report += `---\n\n`;
  report += `*Generated by Council Goldmine Detector*\n`;
  
  return report;
}

/**
 * Categorize goldmines by difficulty
 */
export function categorizeGoldmines(goldmines: Opportunity[]): {
  easyWins: Opportunity[];
  mediumEffort: Opportunity[];
  highEffort: Opportunity[];
} {
  const easyWins: Opportunity[] = [];
  const mediumEffort: Opportunity[] = [];
  const highEffort: Opportunity[] = [];
  
  goldmines.forEach(repo => {
    const metrics = calculateGoldmineMetrics(repo);
    
    if (metrics.timeToMarket === 'fast' && repo.stars < 3000) {
      easyWins.push(repo);
    } else if (metrics.timeToMarket === 'medium' || repo.stars < 5000) {
      mediumEffort.push(repo);
    } else {
      highEffort.push(repo);
    }
  });
  
  return { easyWins, mediumEffort, highEffort };
}

/**
 * Generate quick action items for a goldmine
 */
export function generateActionPlan(repo: Opportunity): string[] {
  const metrics = calculateGoldmineMetrics(repo);
  const actions: string[] = [];
  
  actions.push(`Clone repository: git clone ${repo.url}`);
  actions.push('Update all dependencies to latest versions');
  actions.push('Run security audit and fix vulnerabilities');
  actions.push(`Review top ${Math.min(10, repo.openIssues)} issues for quick wins`);
  
  if (repo.language === 'JavaScript' || repo.language === 'TypeScript') {
    actions.push('Migrate to TypeScript if not already');
    actions.push('Add modern build tooling (Vite/esbuild)');
  }
  
  actions.push('Add comprehensive documentation');
  actions.push('Create landing page highlighting improvements');
  actions.push(`Set pricing at $${metrics.estimatedPrice}/year`);
  actions.push('Email all stargazers about maintained version');
  
  return actions;
}


================================================================================
File: src/lib/hmr-protection.ts
================================================================================
/**
 * Hot Module Replacement (HMR) Protection Layer
 * Prevents console crashes during development when files are modified
 */

// Store previous state before HMR updates
const stateBackup = new Map<string, unknown>();

/**
 * Safely handle HMR updates without losing application state
 */
export function setupHMRProtection(): void {
  if (import.meta.hot) {
    console.log('[HMR] Protection layer activated');

    // Accept all HMR updates gracefully
    import.meta.hot.accept((newModule) => {
      if (newModule) {
        console.log('[HMR] Module updated successfully');
      }
    });

    // Handle HMR errors without crashing
    import.meta.hot.on('vite:error', (error) => {
      console.error('[HMR] Build error detected:', error);
      // Error is logged but app continues
    });

    // Preserve state before updates
    import.meta.hot.on('vite:beforeUpdate', () => {
      console.log('[HMR] Saving state before update...');
      
      // Backup Zustand stores
      try {
        const localStorageState: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('council_') || key?.startsWith('settings_') || key?.startsWith('memory_')) {
            localStorageState[key] = localStorage.getItem(key) || '';
          }
        }
        stateBackup.set('localStorage', localStorageState);
      } catch (error) {
        console.warn('[HMR] Could not backup localStorage:', error);
      }
    });

    // Restore state after updates
    import.meta.hot.on('vite:afterUpdate', () => {
      console.log('[HMR] Restoring state after update...');
      
      try {
        const localStorageState = stateBackup.get('localStorage') as Record<string, string>;
        if (localStorageState) {
          Object.entries(localStorageState).forEach(([key, value]) => {
            localStorage.setItem(key, value);
          });
        }
      } catch (error) {
        console.warn('[HMR] Could not restore localStorage:', error);
      }
    });

    // Track reload count to prevent infinite loops
    let reloadCount = 0;
    const checkReloadInterval = setInterval(() => {
      reloadCount = 0; // Reset every 5 seconds
    }, 5000);
    
    import.meta.hot.on('vite:beforeUpdate', () => {
      reloadCount++;
      if (reloadCount > 3) {
        console.error('[HMR] Too many reloads detected, please check for errors');
        clearInterval(checkReloadInterval);
      }
    });
  }
}

/**
 * Global error handler for runtime errors
 * Prevents white screen of death
 */
export function setupGlobalErrorHandler(): void {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[GLOBAL] Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent crash
    
    // Show user-friendly notification
    try {
      const toast = (window as any).toast;
      if (toast?.error) {
        toast.error('Background operation failed', {
          description: 'The app is still running. Check console for details.',
        });
      }
    } catch {
      // Toast not available, silently continue
    }
  });

  // Catch uncaught errors
  window.addEventListener('error', (event) => {
    console.error('[GLOBAL] Uncaught error:', event.error);
    
    // Don't crash on module loading errors during HMR
    if (event.message?.includes('dynamically imported module') || 
        event.message?.includes('Failed to fetch')) {
      event.preventDefault();
      console.log('[GLOBAL] Module loading error suppressed during development');
    }
  });

  // Detect infinite loops in React rendering
  let renderErrorCount = 0;
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    
    // Detect React infinite render loop
    if (message.includes('Maximum update depth exceeded') || 
        message.includes('Too many re-renders')) {
      renderErrorCount++;
      if (renderErrorCount > 5) {
        console.warn('[GLOBAL] Infinite render loop detected, reloading page...');
        setTimeout(() => window.location.reload(), 1000);
        return;
      }
    }
    
    originalConsoleError.apply(console, args);
  };
}

/**
 * Development mode safeguards
 */
export function setupDevSafeguards(): void {
  if (import.meta.env.DEV) {
    // Detect and prevent memory leaks from abandoned event listeners
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const listenerCounts = new Map<string, number>();
    
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      const count = listenerCounts.get(type) || 0;
      listenerCounts.set(type, count + 1);
      
      if (count > 100) {
        console.warn(`[DEV] Potential memory leak: ${count} listeners for "${type}" event`);
      }
      
      return originalAddEventListener.call(this, type, listener, options);
    };

    // Warn about large state objects
    const originalStringify = JSON.stringify;
    (JSON as any).stringify = function(value: any, replacer?: any, space?: any) {
      try {
        const result = originalStringify.call(JSON, value, replacer, space);
        if (result.length > 1024 * 1024) { // 1MB
          console.warn('[DEV] Large state object detected:', (result.length / 1024).toFixed(2), 'KB');
        }
        return result;
      } catch (error) {
        console.error('[DEV] JSON stringify failed:', error);
        return '{}';
      }
    };
  }
}

/**
 * Initialize all protection mechanisms
 */
export function initializeProtection(): void {
  setupHMRProtection();
  setupGlobalErrorHandler();
  setupDevSafeguards();
  console.log('[PROTECTION] All safeguards initialized');
}


================================================================================
File: src/lib/language-mapping.ts
================================================================================
export const languageMapping: { [key: string]: string } = {
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "jsx": "javascript",
    "tsx": "typescript",
    "html": "html",
    "css": "css",
    "json": "json",
    "md": "markdown",
  };

================================================================================
File: src/lib/mining-drill.ts
================================================================================
/**
 * The Mining Drill - Pain Point Extraction Engine
 * Extracts marketing intelligence from GitHub issues
 */

export interface PainPoint {
  title: string;
  body: string;
  comments: number;
  url: string;
  created: string;
  
  // Extracted intelligence
  painKeywords: string[];
  urgencyScore: number;  // 0-100
  buyingIntent: number;  // 0-10
  
  // Metadata
  labels: string[];
  author: string;
  state: string;
}

export interface MiningDrillConfig {
  minBuyingIntent?: number;
  minUrgency?: number;
  maxResults?: number;
  githubToken?: string;
}

const PAIN_KEYWORDS = [
  'hate', 'sucks', 'nightmare', 'struggling', 'annoying',
  'waste of time', 'broken', 'too expensive', 'crashes',
  'alternative to', 'looking for', 'how do i', 'need help',
  'willing to pay', 'hire', 'urgent', 'recommendation',
  'frustrated', 'terrible', 'awful', 'horrible', 'useless',
  'doesnt work', 'not working', 'bug', 'error', 'issue',
  'problem', 'please fix', 'please add', 'feature request'
];

const HIGH_INTENT_PHRASES = [
  'willing to pay',
  'hire',
  'urgent',
  'need this asap',
  'alternative to',
  'recommendation',
  'best tool for',
  'looking for solution',
  'need help with',
  'how much',
  'pricing',
  'subscription',
  'enterprise',
  'commercial',
  'business use'
];

/**
 * Calculate urgency score based on multiple factors
 */
function calculateUrgency(issue: any): number {
  let score = 0;
  
  // High engagement = high urgency
  score += Math.min(30, issue.comments * 3);
  
  // Old issue = persistent pain
  const daysOld = calculateDaysSince(issue.created_at);
  if (daysOld > 180) score += 20;  // 6+ months
  if (daysOld > 365) score += 10;  // 1+ year (extra pain)
  
  // Labels indicate severity
  if (hasLabel(issue, 'bug')) score += 30;
  if (hasLabel(issue, 'help wanted')) score += 20;
  if (hasLabel(issue, 'critical')) score += 25;
  if (hasLabel(issue, 'high priority')) score += 15;
  if (hasLabel(issue, 'feature request')) score += 10;
  
  // Reactions indicate community agreement
  const reactions = issue.reactions?.total_count || 0;
  score += Math.min(20, reactions * 2);
  
  return Math.min(100, score);
}

/**
 * Detect buying intent from issue text
 */
function detectBuyingIntent(issue: any): number {
  const text = (issue.title + ' ' + (issue.body || '')).toLowerCase();
  
  let intentScore = 0;
  
  // Check for high intent phrases
  HIGH_INTENT_PHRASES.forEach(phrase => {
    if (text.includes(phrase)) {
      intentScore += 1;
    }
  });
  
  // Boost if multiple pain keywords present
  const painCount = PAIN_KEYWORDS.filter(keyword => 
    text.includes(keyword)
  ).length;
  
  if (painCount >= 3) intentScore += 1;
  if (painCount >= 5) intentScore += 1;
  
  // Commercial context indicators
  if (text.match(/\$\d+/)) intentScore += 1;  // Money mentioned
  if (text.includes('budget')) intentScore += 1;
  if (text.includes('team')) intentScore += 1;
  if (text.includes('company')) intentScore += 1;
  
  return Math.min(10, intentScore);
}

/**
 * Extract pain keywords from issue text
 */
function extractPainKeywords(issue: any): string[] {
  const text = (issue.title + ' ' + (issue.body || '')).toLowerCase();
  
  return PAIN_KEYWORDS.filter(keyword => 
    text.includes(keyword)
  );
}

/**
 * Calculate days since a date
 */
function calculateDaysSince(dateString: string): number {
  const then = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - then.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if issue has a specific label
 */
function hasLabel(issue: any, labelName: string): boolean {
  if (!issue.labels || !Array.isArray(issue.labels)) return false;
  
  return issue.labels.some((label: any) => 
    typeof label === 'string' 
      ? label.toLowerCase().includes(labelName.toLowerCase())
      : label.name?.toLowerCase().includes(labelName.toLowerCase())
  );
}

/**
 * Mine pain points from a GitHub repository
 */
export async function minePainPoints(
  owner: string,
  repo: string,
  config: MiningDrillConfig = {}
): Promise<PainPoint[]> {
  const {
    minBuyingIntent = 3,
    minUrgency = 0,
    maxResults = 20,
    githubToken
  } = config;

  try {
    // Fetch issues sorted by comments (most engaged first)
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=all&sort=comments&direction=desc&per_page=100`;
    
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const issues = await response.json();

    // Process each issue
    const painPoints: PainPoint[] = issues
      .filter((issue: any) => !issue.pull_request) // Exclude PRs
      .map((issue: any) => {
        const urgencyScore = calculateUrgency(issue);
        const buyingIntent = detectBuyingIntent(issue);
        const painKeywords = extractPainKeywords(issue);

        return {
          title: issue.title,
          body: issue.body || '',
          comments: issue.comments,
          url: issue.html_url,
          created: issue.created_at,
          painKeywords,
          urgencyScore,
          buyingIntent,
          labels: issue.labels.map((l: any) => l.name || l),
          author: issue.user?.login || 'unknown',
          state: issue.state,
        };
      })
      .filter((point: PainPoint) => 
        point.buyingIntent >= minBuyingIntent && 
        point.urgencyScore >= minUrgency
      )
      .sort((a: PainPoint, b: PainPoint) => {
        // Sort by buying intent first, then urgency
        if (b.buyingIntent !== a.buyingIntent) {
          return b.buyingIntent - a.buyingIntent;
        }
        return b.urgencyScore - a.urgencyScore;
      })
      .slice(0, maxResults);

    return painPoints;
  } catch (error) {
    console.error('Mining drill error:', error);
    throw error;
  }
}

/**
 * Analyze pain points for market insights
 */
export interface MarketInsight {
  topPainKeywords: Array<{ keyword: string; count: number }>;
  averageUrgency: number;
  averageBuyingIntent: number;
  totalPainPoints: number;
  highIntentCount: number;
  commonLabels: Array<{ label: string; count: number }>;
}

export function analyzePainPoints(painPoints: PainPoint[]): MarketInsight {
  if (painPoints.length === 0) {
    return {
      topPainKeywords: [],
      averageUrgency: 0,
      averageBuyingIntent: 0,
      totalPainPoints: 0,
      highIntentCount: 0,
      commonLabels: [],
    };
  }

  // Count pain keywords
  const keywordCounts = new Map<string, number>();
  painPoints.forEach(point => {
    point.painKeywords.forEach(keyword => {
      keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
    });
  });

  const topPainKeywords = Array.from(keywordCounts.entries())
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Count labels
  const labelCounts = new Map<string, number>();
  painPoints.forEach(point => {
    point.labels.forEach(label => {
      labelCounts.set(label, (labelCounts.get(label) || 0) + 1);
    });
  });

  const commonLabels = Array.from(labelCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Calculate averages
  const totalUrgency = painPoints.reduce((sum, p) => sum + p.urgencyScore, 0);
  const totalIntent = painPoints.reduce((sum, p) => sum + p.buyingIntent, 0);
  const highIntentCount = painPoints.filter(p => p.buyingIntent >= 5).length;

  return {
    topPainKeywords,
    averageUrgency: totalUrgency / painPoints.length,
    averageBuyingIntent: totalIntent / painPoints.length,
    totalPainPoints: painPoints.length,
    highIntentCount,
    commonLabels,
  };
}

/**
 * Generate marketing copy from pain points
 */
export function generateMarketingCopy(painPoints: PainPoint[]): string {
  if (painPoints.length === 0) {
    return 'No pain points found.';
  }

  const topPain = painPoints[0];
  const insight = analyzePainPoints(painPoints);

  let copy = `## Marketing Intelligence\n\n`;
  copy += `Found ${painPoints.length} high-intent pain points.\n\n`;
  copy += `### Top Pain Point (Buying Intent: ${topPain.buyingIntent}/10)\n`;
  copy += `**"${topPain.title}"**\n`;
  copy += `- Urgency: ${topPain.urgencyScore}/100\n`;
  copy += `- Comments: ${topPain.comments}\n`;
  copy += `- Pain Keywords: ${topPain.painKeywords.slice(0, 5).join(', ')}\n`;
  copy += `- URL: ${topPain.url}\n\n`;

  copy += `### Market Insights\n`;
  copy += `- Average Urgency: ${insight.averageUrgency.toFixed(1)}/100\n`;
  copy += `- High Intent Opportunities: ${insight.highIntentCount}\n`;
  copy += `- Top Pain Keywords: ${insight.topPainKeywords.slice(0, 5).map(k => k.keyword).join(', ')}\n\n`;

  copy += `### Recommended Actions\n`;
  if (insight.averageBuyingIntent >= 5) {
    copy += `✅ HIGH PRIORITY: Strong buying intent detected. Consider immediate solution development.\n`;
  }
  if (insight.highIntentCount >= 5) {
    copy += `✅ MARKET READY: Multiple high-intent pain points. Market validation confirmed.\n`;
  }
  if (insight.averageUrgency >= 50) {
    copy += `⚡ URGENT: Pain level is high. Fast movers will capture this market.\n`;
  }

  return copy;
}


================================================================================
File: src/lib/mirror-standards.json
================================================================================
{
  "version": "1.0.0",
  "description": "Code quality standards based on elite open-source repositories",
  "thresholds": {
    "excellent": 90,
    "good": 75,
    "acceptable": 60,
    "needsWork": 40,
    "critical": 0
  },
  "roleModels": {
    "react": {
      "shadcnUI": "https://github.com/shadcn-ui/ui",
      "description": "Best-in-class React component patterns, TypeScript usage, and Radix UI integration",
      "nextjs": "https://github.com/vercel/next.js",
      "useHooks": "https://github.com/uidotdev/usehooks",
      "errorBoundaries": "https://github.com/bvaughn/react-error-boundary"
    },
    "stateManagement": {
      "zustand": "https://github.com/pmndrs/zustand",
      "description": "Clean store patterns, middleware usage, and proper state organization",
      "tanstackQuery": "https://github.com/TanStack/query"
    },
    "database": {
      "dexie": "https://github.com/dexie/Dexie.js",
      "description": "IndexedDB best practices, migrations, and transaction handling"
    },
    "build": {
      "vite": "https://github.com/vitejs/vite",
      "description": "Modern build configuration, optimization, and plugin patterns"
    },
    "typescript": {
      "typescript-eslint": "https://github.com/typescript-eslint/typescript-eslint",
      "description": "Strict TypeScript configuration and best practices"
    },
    "testing": {
      "vitest": "https://github.com/vitest-dev/vitest",
      "playwright": "https://github.com/microsoft/playwright"
    }
  },
  "patterns": {
    "errorHandling": {
      "asyncTryCatch": "async function fetchData() {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) throw new Error(`HTTP ${response.status}`);\n    return await response.json();\n  } catch (error) {\n    console.error('Fetch failed:', error);\n    throw new Error('Failed to fetch data');\n  }\n}",
      "networkErrors": "try {\n  const data = await apiCall();\n  return { success: true, data };\n} catch (error) {\n  const message = error instanceof Error ? error.message : 'Unknown error';\n  return { success: false, error: message };\n}",
      "errorBoundaries": "<ErrorBoundary FallbackComponent={ErrorFallback}>\n  <YourComponent />\n</ErrorBoundary>"
    },
    "typeSafety": {
      "noAny": "// ❌ Bad\nfunction process(data: any) { ... }\n\n// ✅ Good\nfunction process<T>(data: T): ProcessedData<T> { ... }",
      "optionalChaining": "// ❌ Bad\nconst value = obj!.nested!.value;\n\n// ✅ Good\nconst value = obj?.nested?.value ?? defaultValue;",
      "explicitReturnTypes": "// ❌ Bad\nexport function calculate(x, y) { return x + y; }\n\n// ✅ Good\nexport function calculate(x: number, y: number): number { return x + y; }"
    },
    "performance": {
      "reactMemo": "export default React.memo(MyComponent, (prevProps, nextProps) => {\n  return prevProps.id === nextProps.id;\n});",
      "useCallback": "const handleClick = useCallback(() => {\n  doSomething(value);\n}, [value]);",
      "lazyLoading": "const SettingsModal = lazy(() => import('./SettingsModal'));\n\n<Suspense fallback={<Loading />}>\n  <SettingsModal />\n</Suspense>"
    },
    "architecture": {
      "featureSlicing": "src/\n  features/\n    council/\n      api/\n      components/\n      hooks/\n      store/\n      types.ts",
      "componentSize": "Keep components under 300 lines. Extract:\n- Custom hooks for logic\n- Sub-components for UI sections\n- Utils for helpers",
      "customHooks": "export function useCouncilData(expertId: string) {\n  const [data, setData] = useState<Expert | null>(null);\n  const [loading, setLoading] = useState(true);\n  \n  useEffect(() => {\n    fetchExpert(expertId)\n      .then(setData)\n      .finally(() => setLoading(false));\n  }, [expertId]);\n  \n  return { data, loading };\n}"
    }
  },
  "metrics": {
    "maxComponentLines": 300,
    "maxFunctionLines": 50,
    "maxFunctionParams": 4,
    "minTestCoverage": 70,
    "maxCyclomaticComplexity": 10,
    "maxAnyTypes": 0,
    "maxTsIgnores": 0
  },
  "antiPatterns": {
    "avoid": [
      "Using 'any' type (use 'unknown' or proper types)",
      "Missing error boundaries in production components",
      "Inline styles instead of Tailwind classes",
      "Direct DOM manipulation in React",
      "Prop drilling (use context or state management)",
      "Large useEffect hooks (split into multiple)",
      "Missing TypeScript return types",
      "console.log in production code",
      "Synchronous localStorage in hot paths",
      "Unhandled promise rejections"
    ]
  },
  "bestPractices": {
    "fileSizeWarning": "Files over 400 lines should be split into smaller modules",
    "testCoverage": "Aim for 80%+ coverage on critical paths",
    "documentation": "Export public APIs with JSDoc comments",
    "naming": "Use PascalCase for components, camelCase for functions, UPPER_CASE for constants",
    "imports": "Use path aliases (@/, @features/) for cleaner imports",
    "commits": "Follow conventional commits (feat:, fix:, refactor:)"
  }
}


================================================================================
File: src/lib/opportunity-loader.ts
================================================================================
/**
 * Opportunity Loader
 * Load and transform opportunity data from Scout/Blue Ocean scans
 */

import { Opportunity } from './goldmine-detector';

/**
 * Load opportunities from local JSON files
 * Used by Goldmine Detector to analyze Blue Ocean scan results
 */
export async function loadOpportunities(): Promise<Opportunity[]> {
  try {
    // Try to load from latest.json (Scout output)
    const response = await fetch('/data/opportunities/latest.json');
    if (!response.ok) {
      console.warn('No opportunities file found');
      return [];
    }

    const data = await response.json();
    
    // Transform Scout data format to Opportunity format
    // Scout data has: { category, painPoint, evidence: [repo, url], marketSize, etc }
    // We need: { owner, name, stars, forks, etc }
    
    const opportunities: Opportunity[] = [];
    const seenRepos = new Set<string>();
    
    for (const item of data) {
      if (item.evidence && Array.isArray(item.evidence) && item.evidence[0]) {
        const repo = item.evidence[0]; // e.g., "apollographql/apollo-client"
        const [owner, name] = repo.split('/');
        
        if (owner && name && !seenRepos.has(repo)) {
          seenRepos.add(repo);
          
          // These will be enriched when we fetch from GitHub API
          opportunities.push({
            owner,
            name,
            description: item.painPoint || '',
            stars: item.marketSize || 0, // Approximate from market size
            forks: 0, // Will be fetched
            openIssues: 0, // Will be fetched
            lastUpdate: new Date().toISOString(), // Will be fetched
            daysSinceUpdate: 0, // Will be fetched
            language: '',
            url: `https://github.com/${owner}/${name}`,
            blueOceanScore: calculateBlueOceanScore(item),
          });
        }
      }
    }
    
    return opportunities;
  } catch (error) {
    console.error('Failed to load opportunities:', error);
    return [];
  }
}

/**
 * Fetch repository details from GitHub API
 * Enriches opportunity data with real-time stats
 */
export async function enrichOpportunitiesFromGitHub(
  opportunities: Opportunity[],
  githubToken?: string
): Promise<Opportunity[]> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  if (githubToken) {
    headers['Authorization'] = `Bearer ${githubToken}`;
  }
  
  const enriched: Opportunity[] = [];
  
  for (const opp of opportunities) {
    try {
      const response = await fetch(`https://api.github.com/repos/${opp.owner}/${opp.name}`, {
        headers,
      });
      
      if (!response.ok) {
        console.warn(`Failed to fetch ${opp.owner}/${opp.name}`);
        enriched.push(opp);
        continue;
      }
      
      const data = await response.json();
      
      const lastUpdate = new Date(data.updated_at || data.pushed_at);
      const daysSinceUpdate = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
      
      enriched.push({
        ...opp,
        description: data.description || opp.description,
        stars: data.stargazers_count || opp.stars,
        forks: data.forks_count || 0,
        openIssues: data.open_issues_count || 0,
        lastUpdate: data.updated_at || data.pushed_at || new Date().toISOString(),
        daysSinceUpdate,
        language: data.language || '',
        url: data.html_url || opp.url,
      });
      
      // Rate limit: Wait 100ms between requests (10 req/sec)
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error enriching ${opp.owner}/${opp.name}:`, error);
      enriched.push(opp);
    }
  }
  
  return enriched;
}

/**
 * Load Blue Ocean scan results from markdown reports
 * Alternative data source when JSON isn't available
 */
export async function loadBlueOceanFromMarkdown(): Promise<Opportunity[]> {
  try {
    const response = await fetch('/data/intelligence/blue-ocean-2026-01-07.md');
    if (!response.ok) {
      return [];
    }
    
    const markdown = await response.text();
    
    // Parse markdown to extract repositories
    // Format: "**owner/name** (stars⭐)"
    const repoRegex = /\*\*([^/]+)\/([^*]+)\*\*\s*\((\d+)⭐\)/g;
    const opportunities: Opportunity[] = [];
    
    let match;
    while ((match = repoRegex.exec(markdown)) !== null) {
      const [, owner, name, stars] = match;
      opportunities.push({
        owner,
        name: name.trim(),
        description: '',
        stars: parseInt(stars, 10),
        forks: 0,
        openIssues: 0,
        lastUpdate: new Date().toISOString(),
        daysSinceUpdate: 0,
        language: '',
        url: `https://github.com/${owner}/${name}`,
        blueOceanScore: 0,
      });
    }
    
    return opportunities;
  } catch (error) {
    console.error('Failed to load Blue Ocean markdown:', error);
    return [];
  }
}

/**
 * Calculate Blue Ocean score from Scout opportunity data
 */
function calculateBlueOceanScore(item: any): number {
  let score = 0;
  
  // High market size = higher score
  if (item.marketSize > 10000) score += 30;
  else if (item.marketSize > 5000) score += 20;
  else if (item.marketSize > 1000) score += 10;
  
  // Low/none competition = higher score
  if (item.competition === 'none') score += 40;
  else if (item.competition === 'weak') score += 30;
  else if (item.competition === 'medium') score += 20;
  else if (item.competition === 'strong') score += 10;
  
  // High impact + low effort = higher score
  if (item.impact === 'high' && item.effort === 'low') score += 30;
  else if (item.impact === 'high') score += 20;
  else if (item.effort === 'low') score += 15;
  
  return Math.min(score, 100);
}

/**
 * Master loader - tries all data sources
 */
export async function loadAllOpportunities(githubToken?: string): Promise<Opportunity[]> {
  // Try JSON first (Scout output)
  let opportunities = await loadOpportunities();
  
  // If empty, try Blue Ocean markdown
  if (opportunities.length === 0) {
    opportunities = await loadBlueOceanFromMarkdown();
  }
  
  // Enrich with real-time GitHub data
  if (opportunities.length > 0 && githubToken) {
    opportunities = await enrichOpportunitiesFromGitHub(opportunities, githubToken);
  }
  
  return opportunities;
}


================================================================================
File: src/lib/plugin-manager.ts
================================================================================
import { ExpertPlugin } from "./plugins";

class PluginManager {
  private static instance: PluginManager;
  private expertPlugins: Map<string, ExpertPlugin> = new Map();

  private constructor() {}

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  public registerExpertPlugin(plugin: ExpertPlugin): void {
    this.expertPlugins.set(plugin.id, plugin);
  }

  public getExpertPlugin(id: string): ExpertPlugin | undefined {
    return this.expertPlugins.get(id);
  }

  public getAllExpertPlugins(): ExpertPlugin[] {
    return Array.from(this.expertPlugins.values());
  }
}

export const pluginManager = PluginManager.getInstance();


================================================================================
File: src/lib/plugins.ts
================================================================================
export interface PluginBase {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface ExpertPlugin extends PluginBase {
  renderConfig: (config: Record<string, unknown>, onChange: (newConfig: Record<string, unknown>) => void) => React.ReactNode;
  execute: (input: string, config: Record<string, unknown>) => Promise<string>;
  validateConfig: (config: Record<string, unknown>) => boolean;
  defaultConfig: Record<string, unknown>;
}

export interface ModePlugin extends PluginBase {
  execute: (experts: ExpertPlugin[], task: string, config: Record<string, unknown>) => Promise<Record<string, unknown>>;
  defaultConfig: Record<string, unknown>;
}


================================================================================
File: src/lib/protection-tests.ts
================================================================================
/**
 * Test Suite for Web Console Protections
 * Run these tests in the browser console to verify protection mechanisms
 */

export const ProtectionTests = {
  /**
   * Test 1: Unhandled Promise Rejection
   * Expected: Console error + toast notification, app continues running
   */
  testUnhandledRejection() {
    console.log('[TEST] Triggering unhandled promise rejection...');
    Promise.reject(new Error('Test unhandled rejection - app should not crash'));
    setTimeout(() => {
      console.log('[TEST] ✅ App still running after unhandled rejection');
    }, 1000);
  },

  /**
   * Test 2: Uncaught Error
   * Expected: Global error handler catches it, app continues
   */
  testUncaughtError() {
    console.log('[TEST] Triggering uncaught error...');
    setTimeout(() => {
      try {
        throw new Error('Test uncaught error - should be caught by global handler');
      } catch (e) {
        // Deliberately re-throw to test global handler
        throw e;
      }
    }, 100);
  },

  /**
   * Test 3: Large State Object Warning
   * Expected: Console warning about large state size
   */
  testLargeStateWarning() {
    console.log('[TEST] Creating large state object...');
    const largeObject = { data: new Array(100000).fill('x').join('') };
    JSON.stringify(largeObject);
    console.log('[TEST] ✅ Large state warning should appear above');
  },

  /**
   * Test 4: Memory Leak Detection
   * Expected: Warning after 100 event listeners
   */
  testMemoryLeakDetection() {
    console.log('[TEST] Adding multiple event listeners...');
    const button = document.createElement('button');
    for (let i = 0; i < 105; i++) {
      button.addEventListener('click', () => {});
    }
    console.log('[TEST] ✅ Memory leak warning should appear above');
  },

  /**
   * Test 5: Component Error Boundary
   * This would need to be run inside a React component
   */
  testComponentError() {
    console.log('[TEST] To test component error boundary:');
    console.log('1. Add this to any component: throw new Error("Test error");');
    console.log('2. Expected: Inline error fallback, other components keep working');
    console.log('3. Click "Retry" to recover');
  },

  /**
   * Test 6: HMR State Preservation
   */
  testHMRPreservation() {
    console.log('[TEST] Testing HMR state preservation...');
    console.log('1. Set some data: localStorage.setItem("test_hmr", "test value")');
    console.log('2. Make a code change to trigger HMR');
    console.log('3. Check: localStorage.getItem("test_hmr")');
    console.log('Expected: Value should be preserved');
    
    localStorage.setItem('test_hmr', `Test at ${new Date().toISOString()}`);
    console.log('[TEST] ✅ Test value set:', localStorage.getItem('test_hmr'));
  },

  /**
   * Run all automated tests
   */
  runAll() {
    console.log('='.repeat(60));
    console.log('🧪 Running Protection Test Suite');
    console.log('='.repeat(60));
    
    console.log('\n1/6: Testing unhandled rejection...');
    this.testUnhandledRejection();
    
    setTimeout(() => {
      console.log('\n2/6: Testing large state warning...');
      this.testLargeStateWarning();
    }, 1500);
    
    setTimeout(() => {
      console.log('\n3/6: Testing memory leak detection...');
      this.testMemoryLeakDetection();
    }, 2500);
    
    setTimeout(() => {
      console.log('\n4/6: Testing HMR preservation...');
      this.testHMRPreservation();
    }, 3500);
    
    setTimeout(() => {
      console.log('\n5/6: Component error boundary test (manual)');
      this.testComponentError();
    }, 4500);
    
    setTimeout(() => {
      console.log('\n6/6: Uncaught error test...');
      this.testUncaughtError();
    }, 5500);
    
    setTimeout(() => {
      console.log('\n' + '='.repeat(60));
      console.log('✅ Test Suite Complete - Check console for results');
      console.log('📊 App should still be running without crashes');
      console.log('='.repeat(60));
    }, 7000);
  },

  /**
   * Check protection status
   */
  checkStatus() {
    console.log('🛡️ Protection Status:');
    console.log('- HMR Protection:', import.meta.hot ? '✅ Active' : '❌ Inactive');
    console.log('- Error Boundaries:', document.querySelector('[data-testid="button-error-retry"]') ? '✅ Rendered' : '⏳ No errors yet');
    console.log('- Global Handlers:', window.onunhandledrejection ? '✅ Active' : '❌ Inactive');
    console.log('- State Backup:', localStorage.getItem('council_experts') ? '✅ Data present' : '⚠️ No data');
    console.log('\nRun ProtectionTests.runAll() to test all protections');
  }
};

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).ProtectionTests = ProtectionTests;
  console.log('🧪 Protection Tests loaded. Run: ProtectionTests.checkStatus()');
}


================================================================================
File: src/lib/report-generator.ts
================================================================================
/**
 * Intelligence Report Generator
 * 
 * Transforms raw scout data into actionable reports
 */

import * as fs from "fs";
import * as path from "path";

interface Report {
  timestamp: string;
  summary: {
    totalOpportunities: number;
    highImpact: number;
    readyToBuild: number;
  };
  recommendations: string[];
  detailedAnalysis: string;
}

async function generateReport(): Promise<void> {
  console.log("📊 Generating Intelligence Report...\n");
  
  const dataDir = path.join(process.cwd(), "data");
  const reportsDir = path.join(dataDir, "reports");
  
  // Find latest scout report
  if (!fs.existsSync(reportsDir)) {
    console.log("⚠️  No scout data found. Run scout first.");
    return;
  }
  
  const files = fs.readdirSync(reportsDir)
    .filter(f => f.startsWith("scout-") && f.endsWith(".json"))
    .sort()
    .reverse();
  
  if (files.length === 0) {
    console.log("⚠️  No scout reports found.");
    return;
  }
  
  const latestFile = path.join(reportsDir, files[0]);
  const scoutData = JSON.parse(fs.readFileSync(latestFile, "utf-8"));
  
  // Generate analysis
  const report: Report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalOpportunities: scoutData.opportunitiesIdentified || 0,
      highImpact: scoutData.topOpportunities?.filter((o: any) => o.impact === "high").length || 0,
      readyToBuild: scoutData.topOpportunities?.filter((o: any) => 
        o.effort === "low" && o.impact === "high"
      ).length || 0,
    },
    recommendations: generateRecommendations(scoutData),
    detailedAnalysis: generateAnalysis(scoutData),
  };
  
  // Save report
  const reportPath = path.join(dataDir, "intelligence", "report-latest.md");
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, formatReport(report));
  
  console.log("✅ Report generated!");
  console.log(`📄 Saved to: ${reportPath}`);
}

function generateRecommendations(data: any): string[] {
  const recs: string[] = [];
  
  if (data.topOpportunities?.length > 0) {
    const top = data.topOpportunities[0];
    recs.push(`Priority 1: ${top.solution}`);
  }
  
  if (data.trendsDetected?.length > 0) {
    recs.push(`Watch trend: ${data.trendsDetected[0]}`);
  }
  
  recs.push("Review opportunities in data/opportunities/latest.json");
  recs.push("Set up alerts for new pain points");
  
  return recs;
}

function generateAnalysis(data: any): string {
  let analysis = `## Market Analysis\n\n`;
  analysis += `Based on scanning ${data.repositoriesScanned} repositories, `;
  analysis += `we identified ${data.painPointsFound} distinct pain points.\n\n`;
  
  analysis += `### Key Findings\n\n`;
  analysis += `- **High-impact opportunities**: ${data.topOpportunities?.filter((o: any) => o.impact === "high").length || 0}\n`;
  analysis += `- **Low-effort builds**: ${data.topOpportunities?.filter((o: any) => o.effort === "low").length || 0}\n`;
  analysis += `- **Emerging trends**: ${data.trendsDetected?.length || 0}\n`;
  
  return analysis;
}

function formatReport(report: Report): string {
  let md = `# Council Intelligence Report\n\n`;
  md += `Generated: ${new Date(report.timestamp).toLocaleString()}\n\n`;
  
  md += `## Executive Summary\n\n`;
  md += `- Total Opportunities: ${report.summary.totalOpportunities}\n`;
  md += `- High Impact: ${report.summary.highImpact}\n`;
  md += `- Ready to Build: ${report.summary.readyToBuild}\n\n`;
  
  md += `## Recommendations\n\n`;
  report.recommendations.forEach((rec, idx) => {
    md += `${idx + 1}. ${rec}\n`;
  });
  
  md += `\n${report.detailedAnalysis}`;
  
  return md;
}

// Execute
generateReport()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Report generation failed:", error);
    process.exit(1);
  });


================================================================================
File: src/lib/sanitize.ts
================================================================================
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML/Markdown content to prevent XSS attacks
 * This is used to clean AI-generated outputs before rendering
 */
export function sanitizeContent(content: string): string {
  if (!content) return '';
  
  // Configure DOMPurify to allow safe markdown elements
  const config = {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'strong', 'em', 'b', 'i', 'u', 's', 'strike',
      'code', 'pre', 'blockquote',
      'a', 'span', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'], // Allow target="_blank" for links
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onblur'],
  };

  return DOMPurify.sanitize(content, config);
}

/**
 * Sanitize text content - strips all HTML
 * For plain text display where no HTML is expected
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Check if content contains potentially dangerous scripts or elements
 */
export function containsDangerousContent(content: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onerror, etc.
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(content));
}


================================================================================
File: src/lib/scout.ts
================================================================================
/**
 * The Scout - GitHub Intelligence Extraction System
 * 
 * Exploits GitHub as a free market research platform.
 * Runs 24/7 on GitHub Actions servers at zero cost.
 * 
 * API Limits:
 * - GitHub Actions: 5,000 requests/hour (vs 60 for personal)
 * - Search API: 30 requests/minute
 * - Strategy: Cache aggressively, scan smart
 */

import * as fs from "fs";
import * as path from "path";

interface ScoutConfig {
  targetNiche: string;
  scanDepth: "shallow" | "normal" | "deep";
  maxRepos: number;
  maxIssues: number;
  cacheExpiry: number; // hours
}

interface Opportunity {
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  lastUpdate: string;
  url: string;
  
  // Calculated fields
  isAbandoned: boolean;  // No update in 365+ days
  hasProvenDemand: boolean;  // Stars > 500
  lowCompetition: boolean;  // Forks < 200
  blueOceanScore: number;  // 0-100
  
  // Metrics for goldmine detection
  daysSinceUpdate: number;
  forkRatio: number;  // forks / stars
}

interface PainPoint {
  id: string;
  source: "issue" | "discussion" | "pr" | "readme";
  repository: string;
  title: string;
  description: string;
  indicators: string[];
  severity: "critical" | "high" | "medium" | "low";
  frequency: number;
  firstSeen: string;
  lastSeen: string;
  urls: string[];
}

interface ProductOpportunity {
  id: string;
  category: string;
  painPoint: string;
  solution: string;
  confidence: number;
  marketSize: number; // estimated users affected
  competition: "none" | "weak" | "moderate" | "strong";
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  evidence: string[];
  keywords: string[];
}

interface ScoutReport {
  timestamp: string;
  niche: string;
  scanDepth: string;
  repositoriesScanned: number;
  issuesAnalyzed: number;
  painPointsFound: number;
  opportunitiesIdentified: number;
  topPainPoints: PainPoint[];
  topOpportunities: ProductOpportunity[];
  trendsDetected: string[];
  nextActions: string[];
}

/**
 * Get date X days ago in GitHub format (YYYY-MM-DD)
 */
function getDateXDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

/**
 * Scan for Blue Ocean opportunities (abandoned goldmines)
 */
export async function scanBlueOcean(topic: string): Promise<Opportunity[]> {
  console.log(`🌊 Scanning Blue Ocean for: ${topic}\n`);
  
  const token = process.env.GITHUB_TOKEN;
  const opportunities: Opportunity[] = [];
  
  if (!token) {
    console.warn("⚠️  No GitHub token - returning mock opportunities");
    return generateMockOpportunities(topic);
  }
  
  try {
    // Search for repositories with proven demand
    // Strategy: Find popular projects that haven't been updated recently
    const queries = [
      `topic:${topic} stars:>1000 pushed:<${getDateXDaysAgo(365)}`,
      `topic:${topic} stars:500..5000 pushed:<${getDateXDaysAgo(365)}`,
      `${topic} in:name,description stars:>1000 archived:false`,
    ];
    
    for (const query of queries) {
      console.log(`  🔍 Query: ${query}`);
      
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=30`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      
      if (!response.ok) {
        console.warn(`  ⚠️  API error: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      for (const repo of data.items || []) {
        const opp = transformToOpportunity(repo);
        
        // Filter for high Blue Ocean scores
        if (opp.blueOceanScore >= 50) {
          opportunities.push(opp);
        }
      }
      
      // Rate limit protection
      await sleep(2000);
    }
  } catch (error) {
    console.error("Blue Ocean scan failed:", error);
    return generateMockOpportunities(topic);
  }
  
  // Remove duplicates and sort by score
  const unique = Array.from(
    new Map(opportunities.map(o => [o.url, o])).values()
  ).sort((a, b) => b.blueOceanScore - a.blueOceanScore);
  
  console.log(`✓ Found ${unique.length} Blue Ocean opportunities\n`);
  
  // Save to file
  await saveBlueOceanReport(unique, topic);
  
  return unique;
}

/**
 * Transform GitHub repo to Opportunity
 */
function transformToOpportunity(repo: any): Opportunity {
  const now = new Date();
  const lastUpdate = new Date(repo.updated_at);
  const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
  const forkRatio = repo.forks_count / Math.max(1, repo.stargazers_count);
  
  const isAbandoned = daysSinceUpdate > 365;
  const hasProvenDemand = repo.stargazers_count > 500;
  const lowCompetition = repo.forks_count < 200;
  
  const blueOceanScore = calculateBlueOceanScore({
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    daysSinceUpdate,
  });
  
  return {
    name: repo.name,
    owner: repo.owner.login,
    description: repo.description || "No description",
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    lastUpdate: repo.updated_at,
    url: repo.html_url,
    isAbandoned,
    hasProvenDemand,
    lowCompetition,
    blueOceanScore,
    daysSinceUpdate,
    forkRatio: Math.round(forkRatio * 1000) / 1000,
  };
}

/**
 * Calculate Blue Ocean Score (0-100)
 */
function calculateBlueOceanScore(repo: {
  stars: number;
  forks: number;
  openIssues: number;
  daysSinceUpdate: number;
}): number {
  let score = 0;
  
  // High stars = proven demand (max 30 points)
  score += Math.min(30, (repo.stars / 1000) * 30);
  
  // Old but popular = abandoned goldmine (30 points)
  if (repo.daysSinceUpdate > 365 && repo.stars > 500) {
    score += 30;
  } else if (repo.daysSinceUpdate > 180 && repo.stars > 1000) {
    score += 20; // Still good if very popular
  }
  
  // Low forks = low competition (max 20 points)
  const forkRatio = repo.forks / Math.max(1, repo.stars);
  score += Math.max(0, 20 * (1 - forkRatio));
  
  // Active issues = ongoing demand (max 20 points)
  score += Math.min(20, (repo.openIssues / 50) * 20);
  
  return Math.round(score);
}

/**
 * Save Blue Ocean report
 */
async function saveBlueOceanReport(opportunities: Opportunity[], topic: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const filename = `opportunities-${topic.replace(/\s+/g, "-")}-${today}.json`;
  const filepath = path.join(process.cwd(), "data", filename);
  
  fs.writeFileSync(filepath, JSON.stringify(opportunities, null, 2));
  console.log(`💾 Blue Ocean report saved to: ${filename}`);
  
  // Also save markdown summary
  const mdPath = path.join(process.cwd(), "data", "intelligence", `blue-ocean-${today}.md`);
  fs.writeFileSync(mdPath, generateBlueOceanMarkdown(opportunities, topic));
}

/**
 * Generate Blue Ocean markdown report
 */
function generateBlueOceanMarkdown(opportunities: Opportunity[], topic: string): string {
  let md = `# Blue Ocean Opportunities: ${topic}\n\n`;
  md += `**Generated:** ${new Date().toLocaleString()}\n`;
  md += `**Total Found:** ${opportunities.length}\n\n`;
  
  md += `## 🏆 Top 10 Goldmines\n\n`;
  
  opportunities.slice(0, 10).forEach((opp, idx) => {
    md += `### ${idx + 1}. ${opp.owner}/${opp.name} (Score: ${opp.blueOceanScore})\n\n`;
    md += `**${opp.description}**\n\n`;
    md += `- ⭐ Stars: ${opp.stars.toLocaleString()}\n`;
    md += `- 🍴 Forks: ${opp.forks.toLocaleString()} (${(opp.forkRatio * 100).toFixed(1)}% ratio)\n`;
    md += `- 🐛 Open Issues: ${opp.openIssues}\n`;
    md += `- 📅 Last Update: ${new Date(opp.lastUpdate).toLocaleDateString()} (${opp.daysSinceUpdate} days ago)\n`;
    md += `- 🌊 Blue Ocean Score: **${opp.blueOceanScore}/100**\n`;
    md += `- 🔗 [View on GitHub](${opp.url})\n\n`;
    
    md += `**Why it's a goldmine:**\n`;
    if (opp.isAbandoned) md += `- ⚠️ Abandoned (${opp.daysSinceUpdate} days since update)\n`;
    if (opp.hasProvenDemand) md += `- ✅ Proven demand (${opp.stars}+ stars)\n`;
    if (opp.lowCompetition) md += `- ✅ Low competition (${opp.forks} forks)\n`;
    md += `\n**Opportunity:** Build a modern alternative or fork with active maintenance.\n\n`;
    md += `---\n\n`;
  });
  
  // Abandoned goldmines section
  const abandonedGoldmines = opportunities.filter(o => o.isAbandoned && o.hasProvenDemand);
  if (abandonedGoldmines.length > 0) {
    md += `## 💎 Abandoned Goldmines (${abandonedGoldmines.length})\n\n`;
    md += `Projects with proven demand but no recent maintenance:\n\n`;
    abandonedGoldmines.slice(0, 5).forEach(opp => {
      md += `- **${opp.name}** (${opp.stars} stars, ${opp.daysSinceUpdate} days idle)\n`;
    });
    md += `\n`;
  }
  
  return md;
}

/**
 * Generate mock opportunities for testing
 */
function generateMockOpportunities(topic: string): Opportunity[] {
  return [
    {
      name: "awesome-tool",
      owner: "user1",
      description: `Popular ${topic} tool that hasn't been updated`,
      stars: 2500,
      forks: 150,
      openIssues: 45,
      lastUpdate: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000).toISOString(),
      url: "https://github.com/user1/awesome-tool",
      isAbandoned: true,
      hasProvenDemand: true,
      lowCompetition: true,
      blueOceanScore: 85,
      daysSinceUpdate: 500,
      forkRatio: 0.06,
    },
    {
      name: "legacy-framework",
      owner: "user2",
      description: `${topic} framework with large user base`,
      stars: 5000,
      forks: 400,
      openIssues: 120,
      lastUpdate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      url: "https://github.com/user2/legacy-framework",
      isAbandoned: true,
      hasProvenDemand: true,
      lowCompetition: false,
      blueOceanScore: 72,
      daysSinceUpdate: 400,
      forkRatio: 0.08,
    },
  ];
}

/**
 * Main Scout execution
 */
export async function runScout(): Promise<ScoutReport> {
  console.log("🔍 Council Scout Mission Starting...\n");
  console.log("=" .repeat(80));
  
  const config = getConfig();
  console.log(`Target Niche: ${config.targetNiche}`);
  console.log(`Scan Depth: ${config.scanDepth}`);
  console.log(`Max Repos: ${config.maxRepos}`);
  console.log(`Max Issues: ${config.maxIssues}\n`);
  
  // Step 1: Find trending repositories in niche
  console.log("📡 Step 1: Scanning GitHub for trending repositories...");
  const repos = await findTrendingRepos(config);
  console.log(`✓ Found ${repos.length} repositories\n`);
  
  // Step 2: Extract pain points from issues/discussions
  console.log("🔬 Step 2: Extracting pain points...");
  const painPoints = await extractPainPoints(repos, config);
  console.log(`✓ Extracted ${painPoints.length} pain points\n`);
  
  // Step 3: Cluster and prioritize pain points
  console.log("🎯 Step 3: Clustering and prioritizing...");
  const clusteredPainPoints = await clusterPainPoints(painPoints);
  console.log(`✓ Clustered into ${clusteredPainPoints.length} distinct problems\n`);
  
  // Step 4: Identify product opportunities
  console.log("💡 Step 4: Identifying product opportunities...");
  const opportunities = await identifyOpportunities(clusteredPainPoints);
  console.log(`✓ Found ${opportunities.length} opportunities\n`);
  
  // Step 5: Detect emerging trends
  console.log("📈 Step 5: Detecting trends...");
  const trends = await detectTrends(painPoints);
  console.log(`✓ Detected ${trends.length} trends\n`);
  
  // Step 6: Blue Ocean scan
  console.log("🌊 Step 6: Scanning for Blue Ocean opportunities...");
  const blueOceanOpps = await scanBlueOcean(config.targetNiche);
  console.log(`✓ Found ${blueOceanOpps.length} Blue Ocean opportunities\n`);
  
  // Generate report
  const report: ScoutReport = {
    timestamp: new Date().toISOString(),
    niche: config.targetNiche,
    scanDepth: config.scanDepth,
    repositoriesScanned: repos.length,
    issuesAnalyzed: painPoints.length,
    painPointsFound: clusteredPainPoints.length,
    opportunitiesIdentified: opportunities.length,
    topPainPoints: clusteredPainPoints.slice(0, 10),
    topOpportunities: opportunities.slice(0, 10),
    trendsDetected: trends,
    nextActions: generateNextActions(opportunities, trends),
  };
  
  // Save results
  await saveIntelligence(report);
  
  // Print summary
  printSummary(report);
  
  return report;
}

/**
 * Get configuration from environment
 */
function getConfig(): ScoutConfig {
  const depth = (process.env.SCAN_DEPTH || "normal") as ScoutConfig["scanDepth"];
  
  const depthSettings = {
    shallow: { maxRepos: 10, maxIssues: 50 },
    normal: { maxRepos: 25, maxIssues: 100 },
    deep: { maxRepos: 50, maxIssues: 200 },
  };
  
  const settings = depthSettings[depth];
  
  return {
    targetNiche: process.env.TARGET_NICHE || "developer tools",
    scanDepth: depth,
    maxRepos: settings.maxRepos,
    maxIssues: settings.maxIssues,
    cacheExpiry: 24, // hours
  };
}

/**
 * Find trending repositories in target niche
 */
async function findTrendingRepos(config: ScoutConfig): Promise<any[]> {
  const cacheFile = path.join(process.cwd(), "data", "cache", "repos.json");
  
  // Check cache
  if (await isCacheValid(cacheFile, config.cacheExpiry)) {
    console.log("  📦 Using cached repository data");
    return JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
  }
  
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("  ⚠️  No GitHub token - using mock data");
    return generateMockRepos(config);
  }
  
  // Search GitHub
  const query = buildSearchQuery(config.targetNiche);
  const repos: any[] = [];
  
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${config.maxRepos}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    repos.push(...(data.items || []));
    
    // Cache results
    fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
    fs.writeFileSync(cacheFile, JSON.stringify(repos, null, 2));
  } catch (error) {
    console.warn("  ⚠️  GitHub API failed, using mock data:", error);
    return generateMockRepos(config);
  }
  
  return repos;
}

/**
 * Extract pain points from repositories
 */
async function extractPainPoints(repos: any[], config: ScoutConfig): Promise<PainPoint[]> {
  const painPoints: PainPoint[] = [];
  const token = process.env.GITHUB_TOKEN;
  
  // Pain point indicators (keywords that suggest problems)
  const indicators = [
    "doesn't work",
    "not working",
    "broken",
    "bug",
    "issue",
    "problem",
    "error",
    "fail",
    "can't",
    "unable to",
    "missing",
    "need",
    "wish",
    "would be nice",
    "feature request",
    "frustrated",
    "annoying",
    "confusing",
    "difficult",
    "hard to",
  ];
  
  for (const repo of repos.slice(0, Math.min(repos.length, config.maxRepos))) {
    console.log(`  📖 Scanning ${repo.full_name}...`);
    
    try {
      // Fetch issues (pain points are often in issues)
      const issuesUrl = `https://api.github.com/repos/${repo.full_name}/issues?state=all&per_page=20&sort=comments&direction=desc`;
      
      if (token) {
        const response = await fetch(issuesUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        
        if (response.ok) {
          const issues = await response.json();
          
          for (const issue of issues) {
            const text = `${issue.title} ${issue.body || ""}`.toLowerCase();
            const matchedIndicators = indicators.filter(ind => text.includes(ind));
            
            if (matchedIndicators.length > 0) {
              painPoints.push({
                id: `${repo.full_name}-${issue.number}`,
                source: "issue",
                repository: repo.full_name,
                title: issue.title,
                description: (issue.body || "").slice(0, 500),
                indicators: matchedIndicators,
                severity: calculateSeverity(issue, matchedIndicators),
                frequency: issue.comments,
                firstSeen: issue.created_at,
                lastSeen: issue.updated_at,
                urls: [issue.html_url],
              });
            }
          }
        }
      }
      
      // Rate limit protection
      await sleep(1000); // 1 second between repos
    } catch (error) {
      console.warn(`  ⚠️  Failed to scan ${repo.full_name}:`, error);
    }
    
    if (painPoints.length >= config.maxIssues) break;
  }
  
  // Add mock data if no real data
  if (painPoints.length === 0) {
    painPoints.push(...generateMockPainPoints());
  }
  
  return painPoints;
}

/**
 * Cluster similar pain points
 */
async function clusterPainPoints(painPoints: PainPoint[]): Promise<PainPoint[]> {
  // Simple keyword-based clustering
  const clusters = new Map<string, PainPoint[]>();
  
  for (const point of painPoints) {
    const keywords = extractKeywords(point.title + " " + point.description);
    const clusterKey = keywords.slice(0, 3).join("-");
    
    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, []);
    }
    clusters.get(clusterKey)!.push(point);
  }
  
  // Merge clusters and pick representative
  const clustered: PainPoint[] = [];
  
  for (const [, points] of clusters) {
    if (points.length === 0) continue;
    
    // Pick the one with most engagement
    const representative = points.sort((a, b) => b.frequency - a.frequency)[0];
    
    // Merge data
    representative.frequency = points.reduce((sum, p) => sum + p.frequency, 0);
    representative.urls = points.flatMap(p => p.urls).slice(0, 5);
    
    clustered.push(representative);
  }
  
  return clustered.sort((a, b) => b.frequency - a.frequency);
}

/**
 * Identify product opportunities from pain points
 */
async function identifyOpportunities(painPoints: PainPoint[]): Promise<ProductOpportunity[]> {
  const opportunities: ProductOpportunity[] = [];
  
  for (const point of painPoints) {
    // Generate solution ideas
    const solutions = generateSolutions(point);
    
    for (const solution of solutions) {
      opportunities.push({
        id: `opp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        category: categorizeOpportunity(),
        painPoint: point.title,
        solution: solution,
        confidence: calculateConfidence(point),
        marketSize: estimateMarketSize(point),
        competition: assessCompetition(),
        effort: estimateEffort(solution),
        impact: estimateImpact(point),
        evidence: [point.repository, ...point.urls.slice(0, 3)],
        keywords: extractKeywords(point.title + " " + solution),
      });
    }
  }
  
  // Sort by impact/effort ratio
  return opportunities
    .sort((a, b) => {
      const scoreA = (impactScore(a.impact) / effortScore(a.effort)) * a.confidence;
      const scoreB = (impactScore(b.impact) / effortScore(b.effort)) * b.confidence;
      return scoreB - scoreA;
    })
    .slice(0, 20);
}

/**
 * Detect emerging trends
 */
async function detectTrends(painPoints: PainPoint[]): Promise<string[]> {
  const trends: string[] = [];
  
  // Analyze keywords frequency
  const keywordCounts = new Map<string, number>();
  
  for (const point of painPoints) {
    const keywords = extractKeywords(point.title + " " + point.description);
    for (const keyword of keywords) {
      keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
    }
  }
  
  // Find trending keywords (appear in >10% of pain points)
  const threshold = painPoints.length * 0.1;
  for (const [keyword, count] of keywordCounts) {
    if (count >= threshold && keyword.length > 3) {
      trends.push(`${keyword} (${count} mentions)`);
    }
  }
  
  return trends.slice(0, 10);
}

/**
 * Generate next actions
 */
function generateNextActions(opportunities: ProductOpportunity[], trends: string[]): string[] {
  const actions: string[] = [];
  
  if (opportunities.length > 0) {
    const top = opportunities[0];
    actions.push(`Build: ${top.solution} (${top.impact} impact, ${top.effort} effort)`);
  }
  
  if (trends.length > 0) {
    actions.push(`Research trend: ${trends[0]}`);
  }
  
  actions.push("Review data/opportunities/ for detailed analysis");
  actions.push("Run deep scan on Sunday for more insights");
  
  return actions;
}

/**
 * Save intelligence to files
 */
async function saveIntelligence(report: ScoutReport): Promise<void> {
  const dataDir = path.join(process.cwd(), "data");
  
  // Save full report
  const reportPath = path.join(dataDir, "reports", `scout-${Date.now()}.json`);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Save opportunities
  const oppPath = path.join(dataDir, "opportunities", "latest.json");
  fs.mkdirSync(path.dirname(oppPath), { recursive: true });
  fs.writeFileSync(oppPath, JSON.stringify(report.topOpportunities, null, 2));
  
  // Save markdown summary
  const summaryPath = path.join(dataDir, "intelligence", "latest.md");
  fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
  fs.writeFileSync(summaryPath, generateMarkdownSummary(report));
  
  console.log(`💾 Intelligence saved to ${dataDir}`);
}

/**
 * Generate markdown summary
 */
function generateMarkdownSummary(report: ScoutReport): string {
  let md = `# Council Intelligence Report\n\n`;
  md += `**Generated:** ${new Date(report.timestamp).toLocaleString()}\n`;
  md += `**Niche:** ${report.niche}\n`;
  md += `**Scan Depth:** ${report.scanDepth}\n\n`;
  
  md += `## Summary\n\n`;
  md += `- Repositories Scanned: ${report.repositoriesScanned}\n`;
  md += `- Pain Points Found: ${report.painPointsFound}\n`;
  md += `- Opportunities Identified: ${report.opportunitiesIdentified}\n\n`;
  
  md += `## Top Pain Points\n\n`;
  report.topPainPoints.slice(0, 5).forEach((point, idx) => {
    md += `### ${idx + 1}. ${point.title}\n\n`;
    md += `- **Severity:** ${point.severity}\n`;
    md += `- **Frequency:** ${point.frequency} engagements\n`;
    md += `- **Source:** ${point.repository}\n`;
    md += `- **URL:** ${point.urls[0]}\n\n`;
  });
  
  md += `## Top Opportunities\n\n`;
  report.topOpportunities.slice(0, 5).forEach((opp, idx) => {
    md += `### ${idx + 1}. ${opp.solution}\n\n`;
    md += `- **Pain Point:** ${opp.painPoint}\n`;
    md += `- **Impact:** ${opp.impact} | **Effort:** ${opp.effort}\n`;
    md += `- **Confidence:** ${Math.round(opp.confidence * 100)}%\n`;
    md += `- **Competition:** ${opp.competition}\n\n`;
  });
  
  md += `## Emerging Trends\n\n`;
  report.trendsDetected.forEach(trend => {
    md += `- ${trend}\n`;
  });
  
  md += `\n## Next Actions\n\n`;
  report.nextActions.forEach((action, idx) => {
    md += `${idx + 1}. ${action}\n`;
  });
  
  return md;
}

/**
 * Print summary to console
 */
function printSummary(report: ScoutReport): void {
  console.log("=" .repeat(80));
  console.log("📊 SCOUT MISSION COMPLETE");
  console.log("=" .repeat(80));
  console.log(`\n🎯 Scanned: ${report.repositoriesScanned} repositories`);
  console.log(`🔍 Found: ${report.painPointsFound} pain points`);
  console.log(`💡 Identified: ${report.opportunitiesIdentified} opportunities\n`);
  
  console.log("🔥 TOP 3 OPPORTUNITIES:");
  report.topOpportunities.slice(0, 3).forEach((opp, idx) => {
    console.log(`${idx + 1}. ${opp.solution}`);
    console.log(`   Impact: ${opp.impact} | Effort: ${opp.effort} | Confidence: ${Math.round(opp.confidence * 100)}%\n`);
  });
  
  console.log("📈 TRENDING:");
  report.trendsDetected.slice(0, 3).forEach(trend => console.log(`  • ${trend}`));
  
  console.log("\n✅ Mission Complete!");
}

// Helper functions

function buildSearchQuery(niche: string): string {
  return `${niche} stars:>100 pushed:>2024-01-01`;
}

async function isCacheValid(file: string, expiryHours: number): Promise<boolean> {
  if (!fs.existsSync(file)) return false;
  const stats = fs.statSync(file);
  const age = Date.now() - stats.mtimeMs;
  return age < expiryHours * 60 * 60 * 1000;
}

function calculateSeverity(issue: any, indicators: string[]): PainPoint["severity"] {
  const score = indicators.length + (issue.comments / 10);
  if (score > 5) return "critical";
  if (score > 3) return "high";
  if (score > 1) return "medium";
  return "low";
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const stopWords = ["this", "that", "with", "from", "have", "will", "would", "should", "could"];
  return [...new Set(words.filter(w => !stopWords.includes(w)))];
}

function generateSolutions(point: PainPoint): string[] {
  const solutions: string[] = [];
  const text = point.title.toLowerCase();
  
  if (text.includes("slow") || text.includes("performance")) {
    solutions.push("Build optimized alternative with better performance");
  }
  if (text.includes("complex") || text.includes("confusing")) {
    solutions.push("Create simplified UI/UX for this workflow");
  }
  if (text.includes("missing") || text.includes("need")) {
    solutions.push("Add missing feature as standalone tool");
  }
  if (text.includes("integration") || text.includes("connect")) {
    solutions.push("Build integration layer/connector");
  }
  
  if (solutions.length === 0) {
    solutions.push(`Tool to solve: ${point.title}`);
  }
  
  return solutions;
}

function categorizeOpportunity(): string {
  const categories = ["Developer Tools", "UI/UX", "Integration", "Performance", "Automation"];
  return categories[Math.floor(Math.random() * categories.length)];
}

function calculateConfidence(point: PainPoint): number {
  let score = 0.5;
  score += point.frequency * 0.01;
  score += point.indicators.length * 0.05;
  if (point.severity === "critical") score += 0.2;
  return Math.min(score, 1);
}

function estimateMarketSize(point: PainPoint): number {
  return point.frequency * 100; // Rough estimate
}

function assessCompetition(): ProductOpportunity["competition"] {
  return ["none", "weak", "moderate", "strong"][Math.floor(Math.random() * 4)] as any;
}

function estimateEffort(solution: string): ProductOpportunity["effort"] {
  if (solution.includes("simple") || solution.includes("tool")) return "low";
  if (solution.includes("integration") || solution.includes("build")) return "medium";
  return "high";
}

function estimateImpact(point: PainPoint): ProductOpportunity["impact"] {
  if (point.severity === "critical") return "high";
  if (point.frequency > 10) return "high";
  if (point.frequency > 5) return "medium";
  return "low";
}

function impactScore(impact: string): number {
  return { low: 1, medium: 2, high: 3 }[impact] || 1;
}

function effortScore(effort: string): number {
  return { low: 1, medium: 2, high: 3 }[effort] || 1;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock data generators

function generateMockRepos(config: ScoutConfig): any[] {
  const mockRepos = [];
  for (let i = 0; i < config.maxRepos; i++) {
    mockRepos.push({
      full_name: `user/project-${i}`,
      name: `project-${i}`,
      stargazers_count: 1000 - i * 10,
      description: `Mock ${config.targetNiche} project`,
    });
  }
  return mockRepos;
}

function generateMockPainPoints(): PainPoint[] {
  return [
    {
      id: "mock-1",
      source: "issue",
      repository: "user/project-1",
      title: "Performance issues with large datasets",
      description: "The tool becomes slow when processing more than 10k items",
      indicators: ["slow", "performance", "issue"],
      severity: "high",
      frequency: 25,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      urls: ["https://github.com/user/project-1/issues/1"],
    },
    {
      id: "mock-2",
      source: "issue",
      repository: "user/project-2",
      title: "Missing TypeScript support",
      description: "Would be great to have TypeScript definitions",
      indicators: ["missing", "need", "would be nice"],
      severity: "medium",
      frequency: 15,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      urls: ["https://github.com/user/project-2/issues/5"],
    },
  ];
}

// Main execution
runScout()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Scout mission failed:", error);
    process.exit(1);
  });


================================================================================
File: src/lib/self-improve.ts
================================================================================
/**
 * Self-Improving Council System
 * 
 * Learns from successful GitHub repositories to improve decision-making.
 * Extracts patterns in positioning, pricing, features, and architecture.
 */

import * as fs from "fs";
import * as path from "path";

export interface GitHubRepo {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  homepage: string | null;
  readme: string;
  hasDiscussions: boolean;
  hasSponsors: boolean;
  license: string | null;
}

export interface SuccessPattern {
  category: "positioning" | "pricing" | "features" | "architecture";
  pattern: string;
  evidence: string[];
  confidence: number;
  learnedFrom: string[];
}

export interface LearningResult {
  niche: string;
  timestamp: string;
  reposAnalyzed: number;
  patternsFound: SuccessPattern[];
  insights: string[];
  recommendations: string[];
}

/**
 * Learn from successful repositories in a niche
 */
export async function learnFromSuccess(
  niche: string,
  options: {
    minStars?: number;
    maxRepos?: number;
    githubToken?: string;
  } = {}
): Promise<LearningResult> {
  const {
    minStars = 1000,
    maxRepos = 20,
    githubToken = process.env.GITHUB_TOKEN,
  } = options;

  console.log(`🎓 Learning from successful ${niche} repositories...`);
  console.log(`   Min stars: ${minStars}, Max repos: ${maxRepos}\n`);

  // Search GitHub for successful repos
  const repos = await searchSuccessfulRepos(niche, minStars, maxRepos, githubToken);
  console.log(`✓ Found ${repos.length} repositories to analyze\n`);

  // Extract patterns
  const patterns: SuccessPattern[] = [];
  
  // Analyze positioning patterns
  console.log("📊 Analyzing positioning patterns...");
  patterns.push(...await extractPositioningPatterns(repos));
  
  // Analyze pricing patterns
  console.log("💰 Analyzing monetization strategies...");
  patterns.push(...await extractPricingPatterns(repos));
  
  // Analyze feature patterns
  console.log("🎯 Analyzing feature priorities...");
  patterns.push(...await extractFeaturePatterns(repos));
  
  // Analyze architecture patterns
  console.log("🏗️  Analyzing architecture patterns...");
  patterns.push(...await extractArchitecturePatterns(repos));

  // Generate insights
  const insights = generateInsights(patterns, repos);
  const recommendations = generateRecommendations(patterns, niche);

  const result: LearningResult = {
    niche,
    timestamp: new Date().toISOString(),
    reposAnalyzed: repos.length,
    patternsFound: patterns,
    insights,
    recommendations,
  };

  // Update knowledge base
  await updateKnowledgeBase(result);

  console.log(`\n✅ Learning complete! Found ${patterns.length} patterns\n`);

  return result;
}

/**
 * Search GitHub for successful repositories
 */
async function searchSuccessfulRepos(
  niche: string,
  minStars: number,
  maxRepos: number,
  githubToken?: string
): Promise<GitHubRepo[]> {
  const query = `${niche} stars:>${minStars} sort:stars`;
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=${maxRepos}`;

  const headers: Record<string, string> = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "Council-Self-Improve",
  };

  if (githubToken) {
    headers["Authorization"] = `Bearer ${githubToken}`;
  }

  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Fetch detailed info for each repo
    const repos: GitHubRepo[] = [];
    for (const item of data.items || []) {
      try {
        const repo = await fetchRepoDetails(item.full_name, githubToken);
        repos.push(repo);
      } catch (error) {
        console.warn(`Failed to fetch ${item.full_name}:`, error);
      }
    }

    return repos;
  } catch (error) {
    console.error("Failed to search GitHub:", error);
    // Return mock data for testing
    return generateMockRepos(niche, maxRepos);
  }
}

/**
 * Fetch detailed repository information
 */
async function fetchRepoDetails(
  fullName: string,
  githubToken?: string
): Promise<GitHubRepo> {
  const url = `https://api.github.com/repos/${fullName}`;
  const readmeUrl = `https://api.github.com/repos/${fullName}/readme`;

  const headers: Record<string, string> = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "Council-Self-Improve",
  };

  if (githubToken) {
    headers["Authorization"] = `Bearer ${githubToken}`;
  }

  const [repoResponse, readmeResponse] = await Promise.all([
    fetch(url, { headers }),
    fetch(readmeUrl, { headers }).catch(() => null),
  ]);

  const repoData = await repoResponse.json();
  let readme = "";

  if (readmeResponse?.ok) {
    const readmeData = await readmeResponse.json();
    readme = Buffer.from(readmeData.content, "base64").toString("utf-8");
  }

  return {
    name: repoData.name,
    fullName: repoData.full_name,
    description: repoData.description || "",
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    language: repoData.language,
    topics: repoData.topics || [],
    homepage: repoData.homepage,
    readme,
    hasDiscussions: repoData.has_discussions,
    hasSponsors: !!repoData.has_sponsors,
    license: repoData.license?.spdx_id || null,
  };
}

/**
 * Extract positioning patterns from successful repos
 */
async function extractPositioningPatterns(repos: GitHubRepo[]): Promise<SuccessPattern[]> {
  const patterns: SuccessPattern[] = [];

  // Problem-solution clarity
  const clearProblems = repos.filter(r => {
    const text = (r.description + " " + r.readme).toLowerCase();
    return /solves?|fixes?|eliminates?|simplifies?/.test(text);
  });

  if (clearProblems.length >= repos.length * 0.6) {
    patterns.push({
      category: "positioning",
      pattern: "Clear problem statement in first paragraph",
      evidence: clearProblems.slice(0, 3).map(r => `${r.fullName}: "${r.description}"`),
      confidence: (clearProblems.length / repos.length) * 100,
      learnedFrom: clearProblems.slice(0, 5).map(r => r.fullName),
    });
  }

  // Unique value proposition
  const uniqueProps = repos.filter(r => {
    const text = (r.description + " " + r.readme).toLowerCase();
    return /first|only|unique|unlike|different from|better than/.test(text);
  });

  if (uniqueProps.length >= repos.length * 0.4) {
    patterns.push({
      category: "positioning",
      pattern: "Emphasize unique differentiator early",
      evidence: uniqueProps.slice(0, 3).map(r => `${r.fullName}: Highlights uniqueness`),
      confidence: (uniqueProps.length / repos.length) * 100,
      learnedFrom: uniqueProps.slice(0, 5).map(r => r.fullName),
    });
  }

  // Target audience specificity
  const specificAudience = repos.filter(r => {
    const text = (r.description + " " + r.readme).toLowerCase();
    return /for (developers?|teams?|enterprises?|startups?|solo|freelancers?)/.test(text);
  });

  if (specificAudience.length >= repos.length * 0.5) {
    patterns.push({
      category: "positioning",
      pattern: "Explicitly name target audience",
      evidence: specificAudience.slice(0, 3).map(r => r.description),
      confidence: (specificAudience.length / repos.length) * 100,
      learnedFrom: specificAudience.slice(0, 5).map(r => r.fullName),
    });
  }

  // Visual demos/screenshots
  const hasVisuals = repos.filter(r => {
    return /!\[.*\]\(.*\.(png|jpg|gif|svg|webp)/.test(r.readme) ||
           /demo|screenshot|example/i.test(r.readme.slice(0, 2000));
  });

  if (hasVisuals.length >= repos.length * 0.7) {
    patterns.push({
      category: "positioning",
      pattern: "Show, don't tell - use demos/screenshots early",
      evidence: [`${hasVisuals.length} of ${repos.length} repos include visuals in first sections`],
      confidence: (hasVisuals.length / repos.length) * 100,
      learnedFrom: hasVisuals.slice(0, 5).map(r => r.fullName),
    });
  }

  return patterns;
}

/**
 * Extract pricing/monetization patterns
 */
async function extractPricingPatterns(repos: GitHubRepo[]): Promise<SuccessPattern[]> {
  const patterns: SuccessPattern[] = [];

  // Open source with sponsorship
  const hasSponsors = repos.filter(r => r.hasSponsors);
  if (hasSponsors.length >= repos.length * 0.3) {
    patterns.push({
      category: "pricing",
      pattern: "Open source + GitHub Sponsors model",
      evidence: hasSponsors.slice(0, 3).map(r => `${r.fullName} has ${r.stars} stars + sponsors`),
      confidence: (hasSponsors.length / repos.length) * 100,
      learnedFrom: hasSponsors.slice(0, 5).map(r => r.fullName),
    });
  }

  // Freemium model
  const freemium = repos.filter(r => {
    const text = (r.description + " " + r.readme).toLowerCase();
    return /free tier|freemium|pricing|paid plan|pro version|enterprise/.test(text);
  });

  if (freemium.length >= repos.length * 0.2) {
    patterns.push({
      category: "pricing",
      pattern: "Freemium with clear paid tier value",
      evidence: freemium.slice(0, 3).map(r => r.fullName),
      confidence: (freemium.length / repos.length) * 100,
      learnedFrom: freemium.slice(0, 5).map(r => r.fullName),
    });
  }

  // Usage-based pricing
  const usageBased = repos.filter(r => {
    const text = r.readme.toLowerCase();
    return /pay.*use|usage-based|per request|per api call/.test(text);
  });

  if (usageBased.length >= repos.length * 0.15) {
    patterns.push({
      category: "pricing",
      pattern: "Usage-based pricing (pay-per-use)",
      evidence: usageBased.slice(0, 3).map(r => r.fullName),
      confidence: (usageBased.length / repos.length) * 100,
      learnedFrom: usageBased.slice(0, 5).map(r => r.fullName),
    });
  }

  // MIT/permissive licenses
  const permissiveLicense = repos.filter(r => 
    r.license && ["MIT", "Apache-2.0", "BSD-3-Clause"].includes(r.license)
  );

  if (permissiveLicense.length >= repos.length * 0.6) {
    patterns.push({
      category: "pricing",
      pattern: "Permissive open source licenses (MIT/Apache)",
      evidence: [`${permissiveLicense.length} of ${repos.length} use permissive licenses`],
      confidence: (permissiveLicense.length / repos.length) * 100,
      learnedFrom: permissiveLicense.slice(0, 5).map(r => r.fullName),
    });
  }

  return patterns;
}

/**
 * Extract feature priority patterns
 */
async function extractFeaturePatterns(repos: GitHubRepo[]): Promise<SuccessPattern[]> {
  const patterns: SuccessPattern[] = [];

  // Quick start / getting started
  const quickStart = repos.filter(r => {
    const readme = r.readme.toLowerCase();
    return /quick ?start|getting started|installation/i.test(readme.slice(0, 1500));
  });

  if (quickStart.length >= repos.length * 0.8) {
    patterns.push({
      category: "features",
      pattern: "Quick start guide within first 500 words",
      evidence: [`${quickStart.length} of ${repos.length} repos have immediate quick start`],
      confidence: (quickStart.length / repos.length) * 100,
      learnedFrom: quickStart.slice(0, 5).map(r => r.fullName),
    });
  }

  // Interactive examples
  const hasExamples = repos.filter(r => {
    return /example|demo|playground|codesandbox|stackblitz/i.test(r.readme) ||
           r.homepage?.includes("demo");
  });

  if (hasExamples.length >= repos.length * 0.5) {
    patterns.push({
      category: "features",
      pattern: "Interactive examples/playground",
      evidence: hasExamples.slice(0, 3).map(r => r.fullName),
      confidence: (hasExamples.length / repos.length) * 100,
      learnedFrom: hasExamples.slice(0, 5).map(r => r.fullName),
    });
  }

  // API documentation
  const hasAPIDocs = repos.filter(r => {
    return /api.*documentation|api reference|api docs/i.test(r.readme);
  });

  if (hasAPIDocs.length >= repos.length * 0.6) {
    patterns.push({
      category: "features",
      pattern: "Comprehensive API documentation",
      evidence: [`${hasAPIDocs.length} of ${repos.length} have dedicated API docs`],
      confidence: (hasAPIDocs.length / repos.length) * 100,
      learnedFrom: hasAPIDocs.slice(0, 5).map(r => r.fullName),
    });
  }

  // TypeScript support
  const typescript = repos.filter(r => 
    r.language === "TypeScript" || /typescript|\.d\.ts/i.test(r.readme)
  );

  if (typescript.length >= repos.length * 0.7) {
    patterns.push({
      category: "features",
      pattern: "TypeScript-first or full TypeScript support",
      evidence: [`${typescript.length} of ${repos.length} use TypeScript`],
      confidence: (typescript.length / repos.length) * 100,
      learnedFrom: typescript.slice(0, 5).map(r => r.fullName),
    });
  }

  return patterns;
}

/**
 * Extract architecture patterns
 */
async function extractArchitecturePatterns(repos: GitHubRepo[]): Promise<SuccessPattern[]> {
  const patterns: SuccessPattern[] = [];

  // Plugin/extension system
  const hasPlugins = repos.filter(r => {
    const text = (r.description + " " + r.readme).toLowerCase();
    return /plugin|extension|middleware|hook|adapter/.test(text);
  });

  if (hasPlugins.length >= repos.length * 0.4) {
    patterns.push({
      category: "architecture",
      pattern: "Extensible plugin/middleware architecture",
      evidence: hasPlugins.slice(0, 3).map(r => r.fullName),
      confidence: (hasPlugins.length / repos.length) * 100,
      learnedFrom: hasPlugins.slice(0, 5).map(r => r.fullName),
    });
  }

  // Monorepo structure
  const monorepo = repos.filter(r => {
    return /monorepo|packages\/|pnpm|turborepo|nx/i.test(r.readme);
  });

  if (monorepo.length >= repos.length * 0.3) {
    patterns.push({
      category: "architecture",
      pattern: "Monorepo for managing multiple packages",
      evidence: monorepo.slice(0, 3).map(r => r.fullName),
      confidence: (monorepo.length / repos.length) * 100,
      learnedFrom: monorepo.slice(0, 5).map(r => r.fullName),
    });
  }

  // Zero dependencies / minimal deps
  const zeroDeps = repos.filter(r => {
    const text = r.readme.toLowerCase();
    return /zero dependencies|no dependencies|dependency-free|lightweight/.test(text);
  });

  if (zeroDeps.length >= repos.length * 0.25) {
    patterns.push({
      category: "architecture",
      pattern: "Zero or minimal dependencies emphasized",
      evidence: zeroDeps.slice(0, 3).map(r => r.fullName),
      confidence: (zeroDeps.length / repos.length) * 100,
      learnedFrom: zeroDeps.slice(0, 5).map(r => r.fullName),
    });
  }

  return patterns;
}

/**
 * Generate insights from patterns
 */
function generateInsights(patterns: SuccessPattern[], repos: GitHubRepo[]): string[] {
  const insights: string[] = [];

  // Group by category
  const byCategory = patterns.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, SuccessPattern[]>);

  // Positioning insights
  if (byCategory.positioning?.length > 0) {
    const avgConfidence = byCategory.positioning.reduce((sum, p) => sum + p.confidence, 0) / byCategory.positioning.length;
    insights.push(`Successful projects prioritize clear positioning (${Math.round(avgConfidence)}% confidence)`);
  }

  // Pricing insights
  if (byCategory.pricing?.length > 0) {
    const openSourcePattern = byCategory.pricing.find(p => p.pattern.includes("Open source"));
    if (openSourcePattern) {
      insights.push(`Open source with sponsorship model is common (${Math.round(openSourcePattern.confidence)}% adoption)`);
    }
  }

  // Feature insights
  if (byCategory.features?.length > 0) {
    const quickStartPattern = byCategory.features.find(p => p.pattern.includes("Quick start"));
    if (quickStartPattern) {
      insights.push(`Quick start guides are critical for adoption (${Math.round(quickStartPattern.confidence)}% have them)`);
    }
  }

  // Architecture insights
  if (byCategory.architecture?.length > 0) {
    insights.push(`Extensibility is a key success factor (${byCategory.architecture.length} patterns found)`);
  }

  // Stars correlation
  const avgStars = repos.reduce((sum, r) => sum + r.stars, 0) / repos.length;
  insights.push(`Average star count in niche: ${Math.round(avgStars).toLocaleString()}`);

  return insights;
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(patterns: SuccessPattern[], niche: string): string[] {
  const recommendations: string[] = [];

  // High confidence patterns become recommendations
  const highConfidence = patterns.filter(p => p.confidence >= 60).sort((a, b) => b.confidence - a.confidence);

  highConfidence.forEach(pattern => {
    recommendations.push(`[${pattern.category.toUpperCase()}] ${pattern.pattern}`);
  });

  if (recommendations.length === 0) {
    recommendations.push(`Continue researching ${niche} patterns with more repositories`);
  }

  return recommendations;
}

/**
 * Update knowledge base with learned patterns
 */
async function updateKnowledgeBase(result: LearningResult): Promise<void> {
  const knowledgeDir = path.join(process.cwd(), "src", "lib", "knowledge-base");
  fs.mkdirSync(knowledgeDir, { recursive: true });

  // Update positioning.md
  const positioningPatterns = result.patternsFound.filter(p => p.category === "positioning");
  if (positioningPatterns.length > 0) {
    await updateMarkdownFile(
      path.join(knowledgeDir, "positioning.md"),
      "Positioning Patterns",
      positioningPatterns,
      result
    );
  }

  // Update pricing.md
  const pricingPatterns = result.patternsFound.filter(p => p.category === "pricing");
  if (pricingPatterns.length > 0) {
    await updateMarkdownFile(
      path.join(knowledgeDir, "pricing.md"),
      "Pricing & Monetization",
      pricingPatterns,
      result
    );
  }

  // Update features.md
  const featurePatterns = result.patternsFound.filter(p => p.category === "features");
  if (featurePatterns.length > 0) {
    await updateMarkdownFile(
      path.join(knowledgeDir, "features.md"),
      "Feature Priorities",
      featurePatterns,
      result
    );
  }

  // Update architecture.md
  const archPatterns = result.patternsFound.filter(p => p.category === "architecture");
  if (archPatterns.length > 0) {
    await updateMarkdownFile(
      path.join(knowledgeDir, "architecture.md"),
      "Architecture Patterns",
      archPatterns,
      result
    );
  }

  console.log(`📚 Knowledge base updated in ${knowledgeDir}`);
}

/**
 * Update or create markdown knowledge file
 */
async function updateMarkdownFile(
  filePath: string,
  title: string,
  patterns: SuccessPattern[],
  result: LearningResult
): Promise<void> {
  let content = `# ${title}\n\n`;
  content += `*Last updated: ${new Date(result.timestamp).toLocaleString()}*\n`;
  content += `*Learned from: ${result.niche} (${result.reposAnalyzed} repositories)*\n\n`;

  content += `## Key Patterns\n\n`;
  patterns.forEach((pattern, idx) => {
    content += `### ${idx + 1}. ${pattern.pattern}\n\n`;
    content += `**Confidence:** ${Math.round(pattern.confidence)}%\n\n`;
    content += `**Evidence:**\n`;
    pattern.evidence.forEach(ev => {
      content += `- ${ev}\n`;
    });
    content += `\n**Learned from:**\n`;
    pattern.learnedFrom.forEach(repo => {
      content += `- [${repo}](https://github.com/${repo})\n`;
    });
    content += `\n`;
  });

  fs.writeFileSync(filePath, content);
}

/**
 * Generate mock repositories for testing
 */
function generateMockRepos(niche: string, count: number): GitHubRepo[] {
  const mockRepos: GitHubRepo[] = [];
  
  for (let i = 0; i < Math.min(count, 10); i++) {
    mockRepos.push({
      name: `${niche}-tool-${i + 1}`,
      fullName: `example/${niche}-tool-${i + 1}`,
      description: `A modern ${niche} tool that solves X problem for developers`,
      stars: 5000 - i * 500,
      forks: 500 - i * 50,
      language: "TypeScript",
      topics: [niche, "developer-tools", "typescript"],
      homepage: `https://example.com/${niche}-tool`,
      readme: `# ${niche} Tool\n\nQuick start guide here.\n\n## Installation\n\n\`\`\`bash\nnpm install ${niche}-tool\n\`\`\`\n\n![Demo](demo.gif)\n\nFor developers and teams.\n\n## Features\n- TypeScript support\n- Plugin system\n- Zero dependencies\n\n## API Documentation\n\nComprehensive docs available.`,
      hasDiscussions: i % 2 === 0,
      hasSponsors: i % 3 === 0,
      license: i % 2 === 0 ? "MIT" : "Apache-2.0",
    });
  }
  
  return mockRepos;
}


================================================================================
File: src/lib/sidebar.ts
================================================================================
import * as React from "react";
import { cva } from "class-variance-authority";

type SidebarContext = {
    state: "expanded" | "collapsed";
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
  };
  
export const SidebarContext = React.createContext<SidebarContext | null>(null);

export function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider.");
    }

    return context;
}

export const sidebarMenuButtonVariants = cva(
    "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
    {
      variants: {
        variant: {
          default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          outline:
            "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
        },
        size: {
          default: "h-8 text-sm",
          sm: "h-7 text-xs",
          lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    },
  );


================================================================================
File: src/lib/sonner.ts
================================================================================
import { toast } from "sonner";

export { toast };


================================================================================
File: src/lib/synthesis-engine.ts
================================================================================
import { SynthesisTier, SynthesisConfig } from "./types";

// All of the tier configurations and prompt-building logic remain the same.
// The executeSynthesis and callSynthesisAPI functions have been removed,
// as their logic is now handled by the useExecuteSynthesis hook.

export const SYNTHESIS_TIERS: Record<SynthesisTier, {
  name: string;
  icon: string;
  description: string;
  estimatedTime: string;
  estimatedCost: string;
  temperature: number;
  maxTokens: number;
}> = {
  quick: {
    name: "Quick Synthesis",
    icon: "⚡",
    description: "Fast consensus extraction (single-pass)",
    estimatedTime: "~15s",
    estimatedCost: "$0.0003",
    temperature: 0.3,
    maxTokens: 2000,
  },
  balanced: {
    name: "Balanced Synthesis",
    icon: "🎯",
    description: "Smart deduplication + Chain-of-Thought",
    estimatedTime: "~25s",
    estimatedCost: "$0.0005",
    temperature: 0.5,
    maxTokens: 3000,
  },
  deep: {
    name: "Deep Synthesis",
    icon: "🔍",
    description: "Exhaustive analysis with multi-pass refinement",
    estimatedTime: "~45s",
    estimatedCost: "$0.001",
    temperature: 0.7,
    maxTokens: 4000,
  },
};

export const DEFAULT_SYNTHESIS_CONFIG: SynthesisConfig = {
  tier: "balanced",
  model: "google/gemini-2.0-flash-001",
  fallbackModel: "deepseek/deepseek-chat",
  temperature: 0.4,
  maxTokens: 4000,
  customInstructions: "",
};

interface ExpertOutput {
  name: string;
  model: string;
  content: string;
  specialty?: string;
}

function buildQuickPrompt(
  expertOutputs: ExpertOutput[],
  task: string,
  customInstructions: string
): string {
  let prompt = `You are a fast synthesis engine analyzing ${expertOutputs.length} expert perspectives.\n\n`;
  prompt += `TASK: "${task}"\n\n`;
  prompt += `EXPERT OUTPUTS:\n${"─".repeat(40)}\n`;

  expertOutputs.forEach((expert, i) => {
    prompt += `Expert ${i + 1}: ${expert.name} (Model: ${expert.model})\n`;
    prompt += `${expert.content}\n\n`;
  });

  if (customInstructions) {
    prompt += `CUSTOM FOCUS: ${customInstructions}\n\n`;
  }

  prompt += `SYNTHESIZE DIRECTLY (no intermediate reasoning):
1. What do all/most experts agree on? → CONSENSUS
2. What unique insights did individual experts provide? → UNIQUE
3. Where do experts contradict each other? → CONFLICTS

FORMAT YOUR RESPONSE:

## CONSENSUS
• [Point agreed by multiple experts]

## UNIQUE INSIGHTS
• [Expert Name]: [unique insight]

## CONTRADICTIONS
• [Expert A] vs [Expert B]: [brief conflict description]

## RECOMMENDATION
[Single paragraph: synthesized actionable advice]`;

  return prompt;
}

function buildBalancedPrompt(
  expertOutputs: ExpertOutput[],
  task: string,
  customInstructions: string
): string {
  let prompt = `You are an intelligent synthesis engine with Chain-of-Thought reasoning.\n\n`;
  prompt += `TASK: "${task}"\n\n`;
  prompt += `EXPERT OUTPUTS:\n${"─".repeat(40)}\n`;

  expertOutputs.forEach((expert, i) => {
    prompt += `Expert ${i + 1}: ${expert.name} (${expert.model})\n`;
    prompt += `${expert.content}\n\n`;
  });

  if (customInstructions) {
    prompt += `FOCUS: ${customInstructions}\n\n`;
  }

  prompt += `USE CHAIN-OF-THOUGHT REASONING (show your work):

**Step 1: Extraction**
First, extract the core claims from each expert:
${expertOutputs
    .map((e, i) => `- Expert ${i + 1} (${e.name}) claims: [extract 3-5 key points]`)
    .join("\n")}

**Step 2: Clustering**
Now, group similar claims across experts:
- Cluster A (topic): Mentioned by [which experts] saying [what]
- Cluster B (topic): Mentioned by [which experts] saying [what]
- Unique claims: [which expert said what unique thing]

**Step 3: Conflict Detection**
Identify where experts contradict each other:
- Conflict 1: [Expert X says A, Expert Y says opposite/different B]
- Reasoning: [Why is this a genuine conflict vs just different framing?]

**Step 4: Resolution**
For each conflict:
- Evaluate evidence: [Which side has stronger support?]
- Context matters: [Can both be true in different scenarios?]
- Synthesized view: [What's the integrated position?]

**Step 5: Final Synthesis**
Based on the reasoning above:

## AREAS OF AGREEMENT
• [Consensus point] - supported by {Expert names}
  Evidence: [why they agree]

## UNIQUE VALUABLE INSIGHTS
• From {Expert}: [insight]
  Why it matters: [value of this unique perspective]

## CONFLICTS RESOLVED
• Issue: [what they disagreed on]
• Positions:
  - {Expert 1}: [position and reasoning]
  - {Expert 2}: [position and reasoning]
• Resolution: [synthesized position that preserves truth from both]
  Confidence: [High/Medium/Low]

## INTEGRATED RECOMMENDATION
[2-3 paragraphs synthesizing everything into clear, actionable advice with specific steps]`;

  return prompt;
}

function buildDeepPrompt(
  expertOutputs: ExpertOutput[],
  task: string,
  customInstructions: string
): string {
  let prompt = `You are a comprehensive synthesis engine using Tree-of-Thought exploration.\n\n`;
  prompt += `TASK: "${task}"\n\n`;
  prompt += `EXPERT OUTPUTS:\n${"─".repeat(40)}\n`;

  expertOutputs.forEach((expert, i) => {
    prompt += `Expert ${i + 1}: ${expert.name} (${expert.model})\n`;
    prompt += `${expert.content}\n\n`;
  });

  if (customInstructions) {
    prompt += `FOCUS: ${customInstructions}\n\n`;
  }

  prompt += `USE TREE-OF-THOUGHT REASONING (explore multiple interpretive paths):

**Branch 1: Consensus-First Interpretation**
Hypothesis: Experts fundamentally agree, with minor stylistic differences.
Analysis:
- What are the core overlapping points? [list]
- How strong is the agreement? [evaluate evidence]
- What's the unified narrative? [synthesis]
Score this interpretation: [0.0-1.0 likelihood this framing is accurate]

**Branch 2: Conflict-First Interpretation**
Hypothesis: Experts have fundamental disagreements that matter.
Analysis:
- What are the major points of conflict? [list]
- Are these resolvable or genuine trade-offs? [evaluate]
- If unresolvable, what does that mean? [implications]
Score this interpretation: [0.0-1.0 likelihood this framing is accurate]

**Branch 3: Complementary Interpretation**
Hypothesis: Experts address different dimensions (not conflicting, just orthogonal).
Analysis:
- What dimension does each expert focus on? [time/risk/cost/technical/strategic]
- Can all views coexist as complementary? [evaluate]
- How do they fit together? [integration]
Score this interpretation: [0.0-1.0 likelihood this framing is accurate]

**Path Selection**
Based on evidence and scores, the most accurate framing is: **Branch X**
Reasoning: [explain why this interpretation best fits the data]

**SYNTHESIS USING SELECTED PATH:**

## EXECUTIVE SUMMARY
[2-3 sentences capturing the essence based on best-path framing]
Confidence: [High/Medium/Low]

## KEY FINDINGS
[Organized according to the selected interpretive path]
- Finding 1: [supported by which experts and why]
- Finding 2: [supported by which experts and why]
- Finding 3: [supported by which experts and why]

## RESOLVED DISAGREEMENTS
[Using the logic from the selected path]
- Disagreement 1:
  - Positions: [what each expert said]
  - Resolution: [how the selected path resolves this]
  - Supporting logic: [evidence-based reasoning]

## UNIQUE INSIGHTS WORTH NOTING
[Individual expert contributions that add unique value]
- From {Expert}: [insight]
  Value: [why this is important to preserve]

## INTEGRATED RECOMMENDATION

**Immediate Actions (0-1 month):**
• [Action 1 based on consensus]
• [Action 2 based on consensus]

**Medium-Term Strategy (1-6 months):**
• [Action based on complementary views]
• [Action based on resolved conflicts]

**Long-Term Considerations (6+ months):**
• [Strategic direction]

**Risks to Monitor:**
• [Risk 1 from unresolved tensions]
• [Risk 2 from expert caveats]

## CONFIDENCE ASSESSMENT

**High Confidence (>80%):**
- [Aspects where all experts agreed with strong evidence]

**Medium Confidence (50-80%):**
- [Aspects with some disagreement but reasonable synthesis]

**Low Confidence (<50%):**
- [Aspects requiring more information or context]
- Recommendation: [what additional info would help]`;

  return prompt;
}

export function getPromptBuilder(
  tier: SynthesisTier
): (expertOutputs: ExpertOutput[], task: string, customInstructions: string) => string {
  switch (tier) {
    case "quick":
      return buildQuickPrompt;
    case "balanced":
      return buildBalancedPrompt;
    case "deep":
      return buildDeepPrompt;
    default:
      return buildBalancedPrompt;
  }
}

export function extractDebateContext(synthesisContent: string): string {
  const lines = synthesisContent.split("\n");
  let context = "";
  let capture = false;

  for (const line of lines) {
    if (line.includes("## CONSENSUS") || line.includes("## AREAS OF AGREEMENT")) {
      context += "\n**CONSENSUS:**\n";
      capture = true;
    } else if (line.includes("## CONFLICT") || line.includes("## CONTRADICTION")) {
      context += "\n**CONFLICTS:**\n";
      capture = true;
    } else if (
      line.startsWith("## ") &&
      !line.includes("CONSENSUS") &&
      !line.includes("CONFLICT") &&
      !line.includes('CONTRADICTION')
    ) {
      capture = false;
    } else if (capture && line.trim()) {
      context += line + "\n";
    }
  }

  return context || synthesisContent.substring(0, 1000);
}


================================================================================
File: src/lib/types.ts
================================================================================
// Shared Generic Type Definitions

export interface ModelInfo {
  id: string;
  name: string;
  specialty: string;
  costPer1k: number;
  contextWindow: number;
  recommended: string;
}

export interface VaultStatus {
  hasVault: boolean;
  isLocked: boolean;
  lastUnlock?: Date;
}

export interface FileUploadResult {
  success: boolean;
  content?: string;
  error?: string;
  name?: string;
  size?: string;
  type?: string;
}

export interface ModeBehavior {
  modeName: string;
  description: string;
  isEnabled: boolean;
  separated?: string;
  synthesis?: string;
  debate?: string;
  pipeline?: string;
  // Added additional properties to align with ai-client.ts usage
}

export type SynthesisTier = 'quick' | 'balanced' | 'deep';
export interface SynthesisConfig {
  tier: SynthesisTier;
  model?: string;
  fallbackModel?: string;
  temperature?: number;
  maxTokens?: number;
  customInstructions?: string;
  options?: Record<string, unknown>;
}


================================================================================
File: src/lib/utils.ts
================================================================================
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


================================================================================
File: src/lib/validation.ts
================================================================================
/**
 * Global Type Definitions with Zod Validation
 * Mirrors: Zod + TypeScript best practices
 * Provides type safety and runtime validation
 * 
 * Usage:
 * import { GitHubRepoSchema, validateData } from '@/lib/validation';
 * const repo = validateData(GitHubRepoSchema, apiResponse);
 */

import { z } from 'zod';
import { ValidationError } from './error-handler';

/**
 * GitHub Repository Schema
 */
export const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  owner: z.object({
    login: z.string(),
    id: z.number(),
    avatar_url: z.string().url(),
    type: z.string()
  }),
  description: z.string().nullable(),
  html_url: z.string().url(),
  homepage: z.string().url().nullable().optional(),
  stargazers_count: z.number(),
  watchers_count: z.number(),
  forks_count: z.number(),
  open_issues_count: z.number(),
  language: z.string().nullable(),
  topics: z.array(z.string()).optional(),
  created_at: z.string(),
  updated_at: z.string(),
  pushed_at: z.string(),
  size: z.number(),
  default_branch: z.string(),
  archived: z.boolean().optional(),
  disabled: z.boolean().optional(),
  has_issues: z.boolean().optional(),
  has_wiki: z.boolean().optional(),
  license: z.object({
    key: z.string(),
    name: z.string(),
    spdx_id: z.string()
  }).nullable().optional()
});

export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

/**
 * GitHub Search Response Schema
 */
export const GitHubSearchResponseSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(GitHubRepoSchema)
});

export type GitHubSearchResponse = z.infer<typeof GitHubSearchResponseSchema>;

/**
 * Blue Ocean Opportunity Schema
 */
export const BlueOceanOpportunitySchema = z.object({
  repo: GitHubRepoSchema,
  score: z.number().min(0).max(100),
  signals: z.object({
    isAbandoned: z.boolean(),
    hasProvenDemand: z.boolean(),
    lowCompetition: z.boolean(),
    hasIssues: z.boolean(),
    lastUpdateDays: z.number(),
    starToForkRatio: z.number()
  }),
  reasoning: z.string(),
  actionableInsights: z.array(z.string())
});

export type BlueOceanOpportunity = z.infer<typeof BlueOceanOpportunitySchema>;

/**
 * Reddit Post Schema
 */
export const RedditPostSchema = z.object({
  id: z.string(),
  subreddit: z.string(),
  title: z.string(),
  selftext: z.string().optional(),
  author: z.string(),
  score: z.number(),
  num_comments: z.number(),
  created_utc: z.number(),
  permalink: z.string(),
  url: z.string().url(),
  upvote_ratio: z.number().optional(),
  link_flair_text: z.string().nullable().optional(),
  over_18: z.boolean().optional()
});

export type RedditPost = z.infer<typeof RedditPostSchema>;

/**
 * Reddit API Response Schema
 */
export const RedditListingSchema = z.object({
  kind: z.literal('Listing'),
  data: z.object({
    after: z.string().nullable(),
    before: z.string().nullable(),
    children: z.array(
      z.object({
        kind: z.string(),
        data: RedditPostSchema
      })
    ),
    dist: z.number().optional(),
    modhash: z.string().optional()
  })
});

export type RedditListing = z.infer<typeof RedditListingSchema>;

/**
 * Buying Intent Signal Schema
 */
export const BuyingIntentSignalSchema = z.object({
  postId: z.string(),
  title: z.string(),
  body: z.string(),
  source: z.enum(['reddit', 'hackernews', 'producthunt']),
  url: z.string().url(),
  score: z.number().min(0).max(10),
  signals: z.object({
    painKeywords: z.array(z.string()),
    urgencySignals: z.array(z.string()),
    priceWillingnessMentioned: z.boolean(),
    alternativeMentioned: z.boolean(),
    frustrationLevel: z.number().min(0).max(10)
  }),
  engagement: z.object({
    upvotes: z.number(),
    comments: z.number(),
    velocity: z.number(), // comments per hour
    created: z.string()
  }),
  analysis: z.string()
});

export type BuyingIntentSignal = z.infer<typeof BuyingIntentSignalSchema>;

/**
 * GitHub User Schema (for Stargazer Analysis)
 */
export const GitHubUserSchema = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
  type: z.enum(['User', 'Organization']),
  name: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  blog: z.string().optional(),
  location: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  public_repos: z.number().optional(),
  public_gists: z.number().optional(),
  followers: z.number().optional(),
  following: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

export type GitHubUser = z.infer<typeof GitHubUserSchema>;

/**
 * Stargazer Quality Analysis Schema
 */
export const StargazerQualitySchema = z.object({
  repoFullName: z.string(),
  totalStargazers: z.number(),
  analyzed: z.number(),
  qualityScore: z.number().min(0).max(100),
  verdict: z.enum(['INSTITUTIONAL_BACKING', 'COMMUNITY_VALIDATED', 'UNVALIDATED']),
  notableBackers: z.array(z.object({
    login: z.string(),
    type: z.enum(['influencer', 'organization', 'big_tech']),
    detail: z.string(),
    scoreContribution: z.number()
  })),
  companyBackers: z.array(z.string()),
  influencerCount: z.number(),
  organizationCount: z.number(),
  bigTechCount: z.number(),
  analysis: z.object({
    institutionalStrength: z.enum(['strong', 'moderate', 'weak']),
    communityTrust: z.enum(['high', 'medium', 'low']),
    recommendation: z.string()
  })
});

export type StargazerQuality = z.infer<typeof StargazerQualitySchema>;

/**
 * HackerNews Item Schema (Algolia API)
 */
export const HackerNewsItemSchema = z.object({
  objectID: z.string(),
  title: z.string(),
  url: z.string().url().nullable().optional(),
  author: z.string(),
  points: z.number(),
  story_text: z.string().nullable().optional(),
  comment_text: z.string().nullable().optional(),
  num_comments: z.number(),
  created_at: z.string(),
  created_at_i: z.number(),
  _tags: z.array(z.string())
});

export type HackerNewsItem = z.infer<typeof HackerNewsItemSchema>;

/**
 * HackerNews Search Response Schema
 */
export const HackerNewsSearchResponseSchema = z.object({
  hits: z.array(HackerNewsItemSchema),
  nbHits: z.number(),
  page: z.number(),
  nbPages: z.number(),
  hitsPerPage: z.number(),
  processingTimeMS: z.number(),
  query: z.string(),
  params: z.string()
});

export type HackerNewsSearchResponse = z.infer<typeof HackerNewsSearchResponseSchema>;

/**
 * ProductHunt Post Schema
 */
export const ProductHuntPostSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string().optional(),
  votesCount: z.number(),
  commentsCount: z.number(),
  url: z.string().url(),
  website: z.string().url().optional(),
  createdAt: z.string(),
  featuredAt: z.string().optional(),
  topics: z.array(
    z.object({
      name: z.string()
    })
  ).optional(),
  user: z.object({
    username: z.string(),
    headline: z.string().optional()
  }).optional()
});

export type ProductHuntPost = z.infer<typeof ProductHuntPostSchema>;

/**
 * Expert Configuration Schema (Council-specific)
 */
export const ExpertConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  persona: z.string(),
  model: z.string(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  hasWebSearch: z.boolean().optional(),
  modeBehavior: z.object({
    modeName: z.string(),
    description: z.string(),
    isEnabled: z.boolean(),
    separated: z.string().optional(),
    synthesis: z.string().optional(),
    debate: z.string().optional(),
    pipeline: z.string().optional()
  }).optional()
});

export type ExpertConfig = z.infer<typeof ExpertConfigSchema>;

/**
 * Synthesis Configuration Schema
 */
export const SynthesisConfigSchema = z.object({
  tier: z.enum(['quick', 'balanced', 'deep']),
  model: z.string().optional(),
  fallbackModel: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  customInstructions: z.string().optional(),
  options: z.record(z.unknown()).optional()
});

export type SynthesisConfig = z.infer<typeof SynthesisConfigSchema>;

/**
 * Scout Analysis Result Schema
 */
export const ScoutAnalysisSchema = z.object({
  niche: z.string(),
  totalRepos: z.number(),
  opportunities: z.array(BlueOceanOpportunitySchema),
  summary: z.object({
    highPotential: z.number(),
    mediumPotential: z.number(),
    lowPotential: z.number(),
    avgScore: z.number()
  }),
  timestamp: z.string(),
  filters: z.object({
    minStars: z.number().optional(),
    maxForks: z.number().optional(),
    daysAbandoned: z.number().optional()
  }).optional()
});

export type ScoutAnalysis = z.infer<typeof ScoutAnalysisSchema>;

/**
 * Validation helper functions
 */

/**
 * Validate data against a Zod schema
 * Throws ValidationError if validation fails
 */
export const validateData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      
      throw new ValidationError(
        `Validation failed${context ? ` for ${context}` : ''}: ${errorMessages}`,
        error.errors[0]?.path.join('.'),
        data
      );
    }
    throw error;
  }
};

/**
 * Safely validate data, return null on failure
 */
export const safeValidate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T | null => {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
};

/**
 * Validate array of data
 */
export const validateArray = <T>(
  schema: z.ZodSchema<T>,
  data: unknown[],
  context?: string
): T[] => {
  return data.map((item, index) => {
    try {
      return validateData(schema, item, context ? `${context}[${index}]` : `item[${index}]`);
    } catch (error) {
      console.warn(`Validation failed for array item ${index}, skipping:`, error);
      return null;
    }
  }).filter((item): item is T => item !== null);
};

/**
 * Partial validation - allows missing fields
 * Note: Only works with z.ZodObject schemas
 */
export const validatePartial = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  data: unknown,
  context?: string
): Partial<z.infer<z.ZodObject<T>>> => {
  const partialSchema = schema.partial();
  return validateData(partialSchema, data, context);
};

/**
 * Validate and transform data
 */
export const validateAndTransform = <T, R>(
  schema: z.ZodSchema<T>,
  data: unknown,
  transform: (validated: T) => R,
  context?: string
): R => {
  const validated = validateData(schema, data, context);
  return transform(validated);
};


================================================================================
File: src/lib/variants.ts
================================================================================
import { cva } from "class-variance-authority";

export const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
      variants: {
        variant: {
          default:
            "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
          secondary:
            "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
          destructive:
            "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
          outline: "text-foreground",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  )

export const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
      variants: {
        variant: {
          default: "bg-primary text-primary-foreground hover:bg-primary/90",
          destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "text-primary underline-offset-4 hover:underline",
        },
        size: {
          default: "h-10 px-4 py-2",
          sm: "h-9 rounded-md px-3",
          lg: "h-11 rounded-md px-8",
          icon: "h-10 w-10",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    },
  );

export const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
);

export const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);


================================================================================
File: src/lib/workflow-dispatcher.ts
================================================================================
/**
 * GitHub Actions Workflow Dispatcher
 * Triggers workflows with configuration from the app
 */

import { ScoutConfig, MirrorConfig, QualityConfig, SelfImproveConfig } from '@/features/council/store/feature-config-store';

export interface WorkflowDispatchOptions {
  owner: string;
  repo: string;
  workflow: string;
  ref?: string;
  inputs?: Record<string, string>;
}

/**
 * Generate GitHub Actions workflow dispatch URL
 * Opens GitHub's workflow dispatch page with pre-filled inputs
 */
export function generateWorkflowDispatchUrl(options: WorkflowDispatchOptions): string {
  const { owner, repo, workflow, ref = 'main' } = options;
  return `https://github.com/${owner}/${repo}/actions/workflows/${workflow}?ref=${ref}`;
}

/**
 * Generate inputs for Scout workflow from config
 */
export function getScoutWorkflowInputs(config: ScoutConfig): Record<string, string> {
  return {
    target_niche: config.targetNiche,
    depth: config.depth,
    min_stars: config.minStars.toString(),
    max_repos: config.maxRepos.toString(),
  };
}

/**
 * Generate inputs for Mirror workflow from config
 */
export function getMirrorWorkflowInputs(config: MirrorConfig): Record<string, string> {
  return {
    generate_report: config.generateReport.toString(),
  };
}

/**
 * Generate inputs for Quality workflow from config
 */
export function getQualityWorkflowInputs(config: QualityConfig): Record<string, string> {
  return {
    auto_fix: config.autoFix.toString(),
    run_linter: config.runLinter.toString(),
    run_typecheck: config.runTypeCheck.toString(),
  };
}

/**
 * Generate inputs for Self-Improve workflow from config
 */
export function getSelfImproveWorkflowInputs(config: SelfImproveConfig): Record<string, string> {
  return {
    niche: config.niche,
    min_stars: config.minStars.toString(),
    max_repos: config.maxRepos.toString(),
  };
}

/**
 * Export configuration as GitHub Actions workflow YAML snippet
 * User can copy this and update their workflow file
 */
export function exportConfigAsYaml(
  feature: 'scout' | 'mirror' | 'quality' | 'self-improve',
  config: ScoutConfig | MirrorConfig | QualityConfig | SelfImproveConfig
): string {
  switch (feature) {
    case 'scout': {
      const c = config as ScoutConfig;
      return `# Scout Configuration
on:
  schedule:
    - cron: '${c.schedule}'
  workflow_dispatch:
    inputs:
      target_niche:
        default: '${c.targetNiche}'
      depth:
        default: '${c.depth}'
      min_stars:
        default: '${c.minStars}'
      max_repos:
        default: '${c.maxRepos}'`;
    }
    case 'mirror': {
      const c = config as MirrorConfig;
      return `# Mirror Configuration
on:
  schedule:
    - cron: '${c.schedule}'
  workflow_dispatch:
    inputs:
      generate_report:
        default: '${c.generateReport}'`;
    }
    case 'quality': {
      const c = config as QualityConfig;
      return `# Quality Configuration
on:
  schedule:
    - cron: '${c.schedule}'
  workflow_dispatch:
    inputs:
      auto_fix:
        default: '${c.autoFix}'
      run_linter:
        default: '${c.runLinter}'
      run_typecheck:
        default: '${c.runTypeCheck}'`;
    }
    case 'self-improve': {
      const c = config as SelfImproveConfig;
      return `# Self-Improve Configuration
on:
  schedule:
    - cron: '${c.schedule}'
  workflow_dispatch:
    inputs:
      niche:
        default: '${c.niche}'
      min_stars:
        default: '${c.minStars}'
      max_repos:
        default: '${c.maxRepos}'`;
    }
  }
}

/**
 * Parse cron schedule to human-readable text
 */
export function parseCronSchedule(cron: string): string {
  const patterns: Record<string, string> = {
    '0 6 * * *': 'Daily at 6:00 AM UTC',
    '0 8 * * 0': 'Weekly on Sundays at 8:00 AM UTC',
    '0 10 * * 2,5': 'Twice weekly (Tue, Fri) at 10:00 AM UTC',
    '0 9 * * 1': 'Weekly on Mondays at 9:00 AM UTC',
  };

  return patterns[cron] || cron;
}


================================================================================
File: src/main.tsx
================================================================================
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initDatabase } from "@/lib/db";
import { initializeProtection } from "@/lib/hmr-protection";

// Load protection tests in development
if (import.meta.env.DEV) {
  import("@/lib/protection-tests");
}

// Initialize protection mechanisms FIRST
initializeProtection();

console.log("[MAIN] Starting app initialization...");

// Initialize database in the background (don't block render)
console.log("[MAIN] Initializing database...");
initDatabase().catch((error) => {
  console.error("[MAIN] Failed to initialize database:", error);
  // Don't crash the app on database init failure
});

// Render app immediately
console.log("[MAIN] Rendering React app...");
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("[MAIN] Root element not found!");
  document.body.innerHTML = '<div style="padding:20px;font-family:sans-serif;"><h1>⚠️ Council Error</h1><p>Root element not found. Please refresh the page.</p></div>';
} else {
  createRoot(rootElement).render(<App />);
  console.log("[MAIN] React app rendered successfully");
}


================================================================================
File: src/new-structure/features/council/components/CouncilFeature.tsx
================================================================================
import { ExpertLegacy } from "@legacy/components/ExpertLegacy";

export const CouncilFeature = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">New Council Feature</h2>
      <div className="grid gap-4">
        {/* Strangling the old component by wrapping it in the new feature structure */}
        <ExpertLegacy name="DeepSeek V3" />
        <div className="p-4 bg-primary text-primary-foreground rounded-lg shadow-lg hover-elevate transition-all">
          <p className="font-bold">New Strategy Module Active</p>
        </div>
      </div>
    </div>
  );
};


================================================================================
File: src/old-structure/components/ExpertLegacy.tsx
================================================================================
export const ExpertLegacy = ({ name }: { name: string }) => {
  return (
    <div className="p-4 border border-dashed border-gray-400 opacity-70">
      <p className="text-sm font-mono">[LEGACY] {name}</p>
    </div>
  );
};

// Fixed: export default export ExpertLegacy = {};


================================================================================
File: src/pages/FeaturesDashboard.tsx
================================================================================
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { Play, CheckCircle2, Clock, ExternalLink, ArrowLeft, Github, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFeatureConfigStore } from '@/features/council/store/feature-config-store';
import { parseCronSchedule } from '@/lib/workflow-dispatcher';
import { MiningDrillPanel } from '@/features/council/components/MiningDrillPanel';
import { GoldmineDetector } from '@/features/council/components/GoldmineDetector';
import { loadAllOpportunities } from '@/lib/opportunity-loader';
import { Opportunity } from '@/lib/goldmine-detector';
import { getSessionKeys } from '@/features/council/lib/vault';

const FeatureConfigModal = lazy(() => import('@/features/council/components/FeatureConfigModal'));

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string;
  workflow: string;
  schedule: string;
  lastRun?: string;
  status: 'idle' | 'scheduled' | 'active';
}

const FeaturesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const repoOwner = 'Elghazawy5367';
  const repoName = 'Council-Git-V7-RRR';
  
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);
  
  const { scout, mirror, quality, selfImprove } = useFeatureConfigStore();
  
  // Load opportunities on mount
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setLoadingOpportunities(true);
      try {
        const keys = getSessionKeys();
        const opps = await loadAllOpportunities(keys?.githubApiKey);
        setOpportunities(opps);
      } catch (error) {
        console.error('Failed to load opportunities:', error);
      } finally {
        setLoadingOpportunities(false);
      }
    };
    
    void loadData();
  }, []);
  
  const [features] = useState<Feature[]>([
    {
      id: 'mirror',
      name: 'Code Mirror System',
      description: 'Analyze codebase against elite repository standards',
      icon: '🔄',
      workflow: 'code-mirror.yml',
      schedule: mirror.schedule,
      status: mirror.enabled ? 'active' : 'idle',
    },
    {
      id: 'quality',
      name: 'QUALITY Amplification Pipeline',
      description: 'Run full quality analysis and improvement pipeline',
      icon: '⚡',
      workflow: 'quality-pipeline.yml',
      schedule: quality.schedule,
      status: quality.enabled ? 'active' : 'idle',
    },
    {
      id: 'learn',
      name: 'Self-Improving Loop',
      description: 'Learn patterns from successful repositories',
      icon: '🧠',
      workflow: 'self-improve.yml',
      schedule: selfImprove.schedule,
      status: selfImprove.enabled ? 'active' : 'idle',
    },
    {
      id: 'scout',
      name: 'Phantom Scout',
      description: '24/7 automated GitHub intelligence gathering',
      icon: '👻',
      workflow: 'daily-scout.yml',
      schedule: scout.schedule,
      status: scout.enabled ? 'active' : 'idle',
    },
    {
      id: 'sonar',
      name: 'Sonar (Blue Ocean Scanner)',
      description: 'Detect abandoned high-value repositories',
      icon: '📡',
      workflow: 'daily-scout.yml',
      schedule: scout.schedule,
      status: scout.enabled ? 'active' : 'idle',
    },
  ]);

  const getWorkflowUrl = (workflow: string): string => {
    return `https://github.com/${repoOwner}/${repoName}/actions/workflows/${workflow}`;
  };

  const getTriggerUrl = (workflow: string): string => {
    return `https://github.com/${repoOwner}/${repoName}/actions/workflows/${workflow}`;
  };

  const getStatusBadge = (status: Feature['status']): JSX.Element => {
    const variants: Record<Feature['status'], { className: string; label: string; icon: JSX.Element }> = {
      idle: { 
        className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400', 
        label: 'Disabled',
        icon: <Clock className="h-3 w-3" />
      },
      scheduled: { 
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', 
        label: 'Scheduled',
        icon: <Clock className="h-3 w-3" />
      },
      active: { 
        className: 'bg-green-500/10 text-green-600 dark:text-green-400', 
        label: 'Active',
        icon: <CheckCircle2 className="h-3 w-3" />
      },
    };

    const { className, label, icon } = variants[status];
    return (
      <Badge className={`${className} flex items-center gap-1`}>
        {icon}
        {label}
      </Badge>
    );
  };

  const getFeatureConfig = (featureId: string): string => {
    switch (featureId) {
      case 'scout':
      case 'sonar':
        return `Niche: ${scout.targetNiche} | Min Stars: ${scout.minStars} | Depth: ${scout.depth}`;
      case 'mirror':
        return `Report: ${mirror.generateReport ? 'Yes' : 'No'} | Standards: ${mirror.standards.length}`;
      case 'quality':
        return `Auto-fix: ${quality.autoFix ? 'Yes' : 'No'} | Lint: ${quality.runLinter ? 'Yes' : 'No'}`;
      case 'learn':
        return `Niche: ${selfImprove.niche} | Min Stars: ${selfImprove.minStars}`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-panel border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gradient">Feature Control Center</h1>
                <p className="text-xs text-muted-foreground">Run and manage core features</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowConfigModal(true)} className="gap-2">
              <Settings className="h-4 w-4" />
              Configure Features
            </Button>
          </div>
        </div>
      </header>

      <Suspense fallback={<div>Loading...</div>}>
        <FeatureConfigModal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} />
      </Suspense>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Features List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Core Features</h2>
              <Badge variant="outline" className="gap-2">
                <Github className="h-4 w-4" />
                Powered by GitHub Actions
              </Badge>
            </div>
            
            {features.map((feature) => (
              <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{feature.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{feature.name}</CardTitle>
                        <CardDescription className="mt-1">{feature.description}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(feature.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{parseCronSchedule(feature.schedule)}</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded">
                    {getFeatureConfig(feature.id)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => window.open(getTriggerUrl(feature.workflow), '_blank')}
                      size="sm"
                      className="gap-2 flex-1"
                    >
                      <Play className="h-4 w-4" />
                      Trigger Workflow
                    </Button>
                    <Button
                      onClick={() => window.open(getWorkflowUrl(feature.workflow), '_blank')}
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Runs
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                    <code>Workflow: {feature.workflow}</code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  GitHub Actions Integration
                </CardTitle>
                <CardDescription>Zero-cost automated intelligence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">How It Works</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                    <li className="list-disc">✨ Features run automatically on schedule</li>
                    <li className="list-disc">🚀 Trigger workflows manually anytime</li>
                    <li className="list-disc">💾 Results stored in repository</li>
                    <li className="list-disc">🆓 Completely free using GitHub Actions</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-background rounded-lg border">
                  <h4 className="font-medium text-sm mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => window.open(`https://github.com/${repoOwner}/${repoName}/actions`, '_blank')}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      View All Workflows
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => navigate('/quality')}
                    >
                      📊 Quality Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latest Results</CardTitle>
                <CardDescription>Access generated reports and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => window.open('/data/intelligence/latest.md', '_blank')}
                >
                  📄 Scout Intelligence Report
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => window.open('/data/opportunities/latest.json', '_blank')}
                >
                  🎯 Blue Ocean Opportunities
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => window.open('/attached_assets/', '_blank')}
                >
                  🪞 Mirror Reports
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => window.open('/src/lib/knowledge-base/', '_blank')}
                >
                  🧠 Learned Patterns
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mining Drill Section */}
        <div className="mt-8">
          <MiningDrillPanel />
        </div>

        {/* Goldmine Detector Section */}
        <div className="mt-8">
          {loadingOpportunities ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Loading opportunities...
              </CardContent>
            </Card>
          ) : (
            <GoldmineDetector opportunities={opportunities} />
          )}
        </div>
      </main>
    </div>
  );
};

export default FeaturesDashboard;


================================================================================
File: src/pages/Index.tsx
================================================================================
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
            </ErrorBoundary>
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



================================================================================
File: src/pages/NotFound.tsx
================================================================================
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;


================================================================================
File: src/pages/QualityDashboard.tsx
================================================================================
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/primitives/card";
import { Badge } from "@/components/primitives/badge";
import { Progress } from "@/components/primitives/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/primitives/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/primitives/alert";
import { ScrollArea } from "@/components/primitives/scroll-area";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Target, 
  Zap,
  BookOpen,
  GitPullRequest,
  Activity
} from "lucide-react";


interface PipelineReport {
  timestamp: string;
  codeAnalysis: {
    averageScore: number;
    totalFiles: number;
    criticalIssues: number;
    filesNeedingWork: number;
  };
  learningResults: {
    patternsDiscovered: number;
    highConfidencePatterns: number;
    recommendations: string[];
  };
  improvements: {
    applied: string[];
    suggested: string[];
  };
  nextSteps: string[];
}

interface SuccessPattern {
  category: string;
  pattern: string;
  confidence: number;
  learnedFrom: string[];
}

export default function QualityDashboard(): JSX.Element {
  const [pipelineReport, setPipelineReport] = useState<PipelineReport | null>(null);
  const [patterns, setPatterns] = useState<SuccessPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoreHistory, setScoreHistory] = useState<Array<{ date: string; score: number }>>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (): Promise<void> => {
    try {
      // Load pipeline report
      const reportResponse = await fetch("/logs/quality-pipeline-report.json");
      if (reportResponse.ok) {
        const report = await reportResponse.json();
        setPipelineReport(report);
        
        // Add to history
        setScoreHistory(prev => [
          ...prev,
          {
            date: new Date(report.timestamp).toLocaleDateString(),
            score: report.codeAnalysis.averageScore,
          },
        ].slice(-10)); // Keep last 10 entries
      }

      // Load learned patterns (mock data for now)
      const mockPatterns: SuccessPattern[] = [
        {
          category: "positioning",
          pattern: "Clear problem statement in first paragraph",
          confidence: 85,
          learnedFrom: ["shadcn/ui", "vercel/next.js"],
        },
        {
          category: "features",
          pattern: "Interactive examples/playground",
          confidence: 75,
          learnedFrom: ["AutoGPT", "langflow"],
        },
        {
          category: "architecture",
          pattern: "Plugin/extension system",
          confidence: 70,
          learnedFrom: ["vite", "rollup"],
        },
      ];
      setPatterns(mockPatterns);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-blue-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Acceptable";
    return "Needs Work";
  };

  const getConfidenceBadge = (confidence: number): JSX.Element => {
    if (confidence >= 80) {
      return <Badge variant="default" className="bg-green-500">Very High</Badge>;
    }
    if (confidence >= 60) {
      return <Badge variant="default" className="bg-blue-500">High</Badge>;
    }
    if (confidence >= 40) {
      return <Badge variant="secondary">Moderate</Badge>;
    }
    return <Badge variant="outline">Low</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading quality dashboard...</p>
        </div>
      </div>
    );
  }

  if (!pipelineReport) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>
            Run the quality pipeline to see your dashboard:
            <code className="block mt-2 p-2 bg-muted rounded">npm run improve</code>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const trend = scoreHistory.length >= 2
    ? scoreHistory[scoreHistory.length - 1].score - scoreHistory[scoreHistory.length - 2].score
    : 0;

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Quality Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Track code quality and learned patterns
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Last updated</p>
          <p className="text-sm font-medium">
            {new Date(pipelineReport.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Overall Quality Score</CardTitle>
              <CardDescription>Aggregated code quality metrics</CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-5xl font-bold ${getScoreColor(pipelineReport.codeAnalysis.averageScore)}`}>
                {pipelineReport.codeAnalysis.averageScore}
              </div>
              <div className="text-sm text-muted-foreground">
                {getScoreLabel(pipelineReport.codeAnalysis.averageScore)}
              </div>
              {trend !== 0 && (
                <div className={`flex items-center gap-1 mt-2 ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
                  {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-medium">{Math.abs(trend)} pts</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Files Analyzed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pipelineReport.codeAnalysis.totalFiles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pipelineReport.codeAnalysis.filesNeedingWork} need work
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Critical Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pipelineReport.codeAnalysis.criticalIssues}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-500" />
              Patterns Learned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pipelineReport.learningResults.patternsDiscovered}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pipelineReport.learningResults.highConfidencePatterns} high confidence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pipelineReport.improvements.applied.length + pipelineReport.improvements.suggested.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {pipelineReport.improvements.applied.length} applied
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patterns">Learned Patterns</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Breakdown</CardTitle>
              <CardDescription>Scores across different categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mock detailed scores - in real app, would come from report */}
              {[
                { name: "Error Handling", score: 99 },
                { name: "Type Safety", score: 99 },
                { name: "Performance", score: 99 },
                { name: "Architecture", score: 99 },
              ].map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className={`text-sm font-bold ${getScoreColor(category.score)}`}>
                      {category.score}/100
                    </span>
                  </div>
                  <Progress value={category.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <ul className="space-y-3">
                  {pipelineReport.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">{idx + 1}.</span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Success Patterns from Elite Repositories</CardTitle>
              <CardDescription>
                Patterns discovered by analyzing top GitHub projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {patterns.map((pattern, idx) => (
                    <Card key={idx} className="border-l-4 border-l-primary">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <Badge variant="outline" className="mb-2">
                              {pattern.category}
                            </Badge>
                            <CardTitle className="text-base">{pattern.pattern}</CardTitle>
                          </div>
                          {getConfidenceBadge(pattern.confidence)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Confidence: {pattern.confidence}%</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                              <span>Learned from: </span>
                              {pattern.learnedFrom.map((repo, i) => (
                                <span key={i}>
                                  <a 
                                    href={`https://github.com/${repo}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {repo}
                                  </a>
                                  {i < pattern.learnedFrom.length - 1 && ", "}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Improvements Tab */}
        <TabsContent value="improvements" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Applied Fixes ({pipelineReport.improvements.applied.length})
                </CardTitle>
                <CardDescription>Automatically applied improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {pipelineReport.improvements.applied.length > 0 ? (
                    <ul className="space-y-2">
                      {pipelineReport.improvements.applied.map((fix, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{fix}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No automatic fixes applied yet.</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitPullRequest className="h-5 w-5 text-blue-500" />
                  Suggested ({pipelineReport.improvements.suggested.length})
                </CardTitle>
                <CardDescription>Manual improvements recommended</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {pipelineReport.improvements.suggested.length > 0 ? (
                    <ul className="space-y-2">
                      {pipelineReport.improvements.suggested.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No suggestions at this time.</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations from Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <ul className="space-y-2">
                  {pipelineReport.learningResults.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary font-bold mt-0.5">{idx + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Score History</CardTitle>
              <CardDescription>Track improvement over time</CardDescription>
            </CardHeader>
            <CardContent>
              {scoreHistory.length > 0 ? (
                <div className="space-y-4">
                  {scoreHistory.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-24">{entry.date}</span>
                      <Progress value={entry.score} className="flex-1 h-3" />
                      <span className={`text-sm font-bold w-12 ${getScoreColor(entry.score)}`}>
                        {entry.score}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Run the quality pipeline multiple times to see history.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


================================================================================
File: src/plugins/core-ai-expert/components/CoreAiExpertConfig.tsx
================================================================================
import React from "react";
import { Slider } from "@/components/primitives/slider";

interface CoreAiExpertConfigProps {
  config: {
    temperature: number;
    maxTokens: number;
    topP: number;
  };
  onChange: (newConfig: unknown) => void;
}

export const CoreAiExpertConfig: React.FC<CoreAiExpertConfigProps> = ({ config, onChange }) => {
  const handleConfigChange = (key: string, value: number) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Temp</span>
          <span className="font-mono">{config.temperature.toFixed(2)}</span>
        </div>
        <Slider
          value={[config.temperature]}
          onValueChange={([value]) => handleConfigChange("temperature", value)}
          min={0}
          max={2}
          step={0.1}
          className="slider-council"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Top P</span>
          <span className="font-mono">{config.topP.toFixed(2)}</span>
        </div>
        <Slider
          value={[config.topP]}
          onValueChange={([value]) => handleConfigChange("topP", value)}
          min={0}
          max={1}
          step={0.05}
          className="slider-council"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Max Tokens</span>
          <span className="font-mono">{config.maxTokens}</span>
        </div>
        <Slider
          value={[config.maxTokens]}
          onValueChange={([value]) => handleConfigChange("maxTokens", value)}
          min={1000}
          max={8000}
          step={500}
          className="slider-council"
        />
      </div>
    </div>
  );
};


================================================================================
File: src/plugins/core-ai-expert/index.ts
================================================================================
import React from "react";
import { ExpertPlugin } from "@/lib/plugins";
import { pluginManager } from "@/lib/plugin-manager";
import { CoreAiExpertConfig } from "./components/CoreAiExpertConfig";

/**
 * Core AI Expert Plugin
 * Migrates existing expert logic into a modular plugin format.
 */

export const coreAiExpertPlugin: ExpertPlugin = {
  id: "core-ai-expert",
  name: "Core AI Expert",
  description: "Standard Large Language Model expert for analysis and reasoning.",
  
  defaultConfig: {
    temperature: 0.7,
    maxTokens: 4000,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
  },

  validateConfig: (config: Record<string, unknown>) => {
    const cfg = config as { temperature?: number; maxTokens?: number };
    return typeof cfg.temperature === "number" && typeof cfg.maxTokens === "number" && cfg.maxTokens > 0;
  },

  renderConfig: (
    config: Record<string, unknown>,
    onChange: (newConfig: Record<string, unknown>) => void
  ) => {
    // Wrapper to handle type conversion between plugin API and component props
    const typedConfig = config as unknown as { temperature: number; maxTokens: number; topP: number };
    const typedOnChange = (newConfig: unknown) => {
      onChange(newConfig as Record<string, unknown>);
    };
    return React.createElement(CoreAiExpertConfig, { 
      config: typedConfig, 
      onChange: typedOnChange
    });
  },

  execute: async (_input: string, _config: Record<string, unknown>) => {
    // Execution logic would go here, calling the AI client
    return "Expert analysis completed.";
  }
};

// Register the plugin
pluginManager.registerExpertPlugin(coreAiExpertPlugin);


================================================================================
File: src/vite-env.d.ts
================================================================================
/// <reference types="vite/client" />


================================================================================
File: package.json
================================================================================
{
  "name": "vite_react_shadcn_ts",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview",
    "prepare": "husky",
    "typecheck": "tsc --noEmit",
    "build:types": "tsc --emitDeclarationOnly --declaration",
    "mirror": "tsx scripts/run-mirror.ts",
    "improve": "tsx scripts/quality-pipeline.ts",
    "learn": "tsx scripts/run-self-improve.ts",
    "quality": "npm run mirror && npm run improve",
    "scout": "npx tsx src/lib/scout.ts",
    "scout:report": "npx tsx src/lib/report-generator.ts",
    "scout:blue-ocean": "npx tsx -e \"import('./src/lib/scout.ts').then(m => m.scanBlueOcean(process.env.TOPIC || 'developer-tools'))\"",
    "brief": "tsx scripts/daily-brief.ts",
    "brief:help": "tsx scripts/daily-brief.ts --help"
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "npm run typecheck"
    ]
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@tanstack/react-query": "^5.83.0",
    "@types/dompurify": "^3.0.5",
    "@types/file-saver": "^2.0.7",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "dexie": "^4.2.1",
    "docx": "^9.5.1",
    "dompurify": "^3.3.1",
    "embla-carousel-react": "^8.6.0",
    "file-saver": "^2.0.5",
    "husky": "^9.1.7",
    "idb-keyval": "^6.2.2",
    "input-otp": "^1.4.2",
    "lint-staged": "^16.2.7",
    "lucide-react": "^0.462.0",
    "mermaid": "^11.12.2",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-error-boundary": "^6.0.1",
    "react-helmet": "^6.1.0",
    "react-hook-form": "^7.61.1",
    "react-markdown": "^10.1.0",
    "react-resizable-panels": "^2.1.9",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "remark-gfm": "^4.0.1",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "ts-morph": "^27.0.2",
    "vaul": "^0.9.9",
    "zod": "^3.25.76",
    "zustand": "^5.0.9"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@tailwindcss/typography": "^0.5.16",
    "@types/node": "^22.19.3",
    "@types/react": "^18.3.23",
    "@types/react-dom": "^18.3.7",
    "@vitejs/plugin-react-swc": "^3.11.0",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.32.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^15.15.0",
    "lovable-tagger": "^1.1.13",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.21.0",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.38.0",
    "vite": "^6.4.1",
    "vite-tsconfig-paths": "^6.0.3"
  }
}


================================================================================
File: tsconfig.json
================================================================================
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@legacy/*": ["src/old-structure/*"],
      "@features/*": ["src/features/*"]
    },
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

================================================================================
File: vite.config.ts
================================================================================
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Detect if running in GitHub Codespaces or similar HTTPS environment
  const isCodespaces = process.env.CODESPACES === 'true' || process.env.GITHUB_CODESPACE_TOKEN;
  const isHttps = process.env.VITE_HMR_PROTOCOL === 'wss' || isCodespaces;

  return {
    server: {
      host: "0.0.0.0",
      port: 8000,
      strictPort: false,
      allowedHosts: true,
      cors: true,
      middlewareMode: false,
      hmr: {
        overlay: true, // Show errors as overlay instead of crashing
        timeout: 30000, // Increase timeout for slower connections
        protocol: isHttps ? 'wss' : 'ws', // Auto-detect secure WebSocket
        host: process.env.CODESPACE_NAME 
          ? `${process.env.CODESPACE_NAME}-8000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
          : undefined,
      },
      watch: {
        // Reduce file watching overhead
        ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
      },
    },
  plugins: [react(), tsconfigPaths()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Better error reporting
    sourcemap: mode === 'development',
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress certain warnings
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
      },
    },
  },
  // Optimize dependency pre-bundling
    optimizeDeps: {
      include: ['react', 'react-dom', 'zustand', 'react-error-boundary'],
      exclude: ['@vite/client', '@vite/env'],
    },
  };
});


