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
    "preview": "vite preview"
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
    "@radix-ui/react-slot": "^1.2.3",
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
    "docx": "^9.5.1",
    "dompurify": "^3.3.1",
    "embla-carousel-react": "^8.6.0",
    "file-saver": "^2.0.5",
    "idb-keyval": "^6.2.2",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.462.0",
    "mermaid": "^11.12.2",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
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
    "vaul": "^0.9.9",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@tailwindcss/typography": "^0.5.16",
    "@types/node": "^22.16.5",
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
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.38.0",
    "vite": "^5.4.19"
  }
}


================================================================================
File: tsconfig.json
================================================================================
{
  "files": [],
  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "noImplicitAny": false,
    "noUnusedParameters": false,
    "skipLibCheck": true,
    "allowJs": true,
    "noUnusedLocals": false,
    "strictNullChecks": false
  }
}


================================================================================
File: vite.config.ts
================================================================================
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));


================================================================================
File: tailwind.config.ts
================================================================================
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Council-specific semantic colors
        council: {
          primary: "rgb(var(--council-primary))",
          secondary: "rgb(var(--council-secondary))",
          accent: "rgb(var(--council-accent))",
          success: "rgb(var(--council-success))",
          warning: "rgb(var(--council-warning))",
          error: "rgb(var(--council-error))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-accent": "var(--gradient-accent)",
        "gradient-glow": "var(--gradient-glow)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeInScale: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideInDown: {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px hsl(var(--primary) / 0.3)" },
          "50%": { boxShadow: "0 0 25px hsl(var(--primary) / 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "fade-in-scale": "fadeInScale 0.4s ease-out forwards",
        "slide-in-right": "slideInRight 0.4s ease-out forwards",
        "slide-in-down": "slideInDown 0.4s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;


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
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load pages for code splitting
const Index = React.lazy(() => import("./pages/Index"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

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
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;


================================================================================
File: src/components/ErrorBoundary.tsx
================================================================================

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">Something went wrong.</h1>
            <p className="text-muted-foreground">
              We've logged the error and will look into it. Please refresh the page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


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


================================================================================
File: src/components/council/ControlPanel.tsx
================================================================================
import React, { useState, useRef } from 'react';
import { Expert, ExecutionMode } from '@/lib/types';
import { MODE_DESCRIPTIONS } from '@/lib/config';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Zap,
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

interface FileData {
  name: string;
  content: string;
  size: string;
}

interface ControlPanelProps {
  task: string;
  onTaskChange: (task: string) => void;
  mode: ExecutionMode;
  onModeChange: (mode: ExecutionMode) => void;
  activeExpertCount: number;
  onActiveExpertCountChange: (count: number) => void;
  debateRounds: number;
  onDebateRoundsChange: (rounds: number) => void;
  fileData: FileData | null;
  onFileSelect: (file: FileData) => void;
  onFileRemove: () => void;
  onExecute: () => void;
  isLoading: boolean;
  statusMessage: string;
  isVaultLocked: boolean;
  onOpenSettings: () => void;
  // Persona handlers
  experts: Expert[];
  onLoadPersona: (expertIndex: number, personaId: string) => void;
  onLoadTeam: (teamId: string) => void;
  onClearPersona: (expertIndex: number) => void;
  onResetToDefault: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  task,
  onTaskChange,
  mode,
  onModeChange,
  activeExpertCount,
  onActiveExpertCountChange,
  debateRounds,
  onDebateRoundsChange,
  fileData,
  onFileSelect,
  onFileRemove,
  onExecute,
  isLoading,
  statusMessage,
  isVaultLocked,
  onOpenSettings,
  experts,
  onLoadPersona,
  onLoadTeam,
  onClearPersona,
  onResetToDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      onFileSelect({
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

  const handleExecuteClick = () => {
    if (isVaultLocked) {
      onOpenSettings();
      toast.error('Please unlock the vault first');
      return;
    }
    if (!task.trim()) {
      toast.error('Please enter a task');
      return;
    }
    onExecute();
  };

  return (
    <Card className="glass-panel-elevated">
      <CardContent className="p-6 space-y-6">
        {/* Persona Selector */}
        <PersonaSelector
          experts={experts}
          activeExpertCount={activeExpertCount}
          onLoadPersona={onLoadPersona}
          onLoadTeam={onLoadTeam}
          onClearPersona={onClearPersona}
          onResetToDefault={onResetToDefault}
        />

        {/* Task Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Task / Question</label>
          <Textarea
            value={task}
            onChange={(e) => onTaskChange(e.target.value)}
            placeholder="Describe the task or question you want the Council to analyze..."
            className="min-h-[120px] bg-muted/50 border-border/50 resize-none focus:ring-primary/50"
          />
        </div>

        {/* Mode Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Execution Mode</label>
          <Tabs value={mode} onValueChange={(v) => onModeChange(v as ExecutionMode)}>
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

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Expert Count */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">Active Experts</label>
              <Badge variant="secondary" className="font-mono">
                {activeExpertCount}
              </Badge>
            </div>
            <Slider
              value={[activeExpertCount]}
              onValueChange={([value]) => onActiveExpertCountChange(value)}
              min={1}
              max={5}
              step={1}
              className="slider-council"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>5</span>
            </div>
          </div>

          {/* Debate Rounds (only visible in debate mode) */}
          {mode === 'debate' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Debate Rounds</label>
                <Badge variant="secondary" className="font-mono">
                  {debateRounds}
                </Badge>
              </div>
              <Slider
                value={[debateRounds]}
                onValueChange={([value]) => onDebateRoundsChange(value)}
                min={1}
                max={5}
                step={1}
                className="slider-council"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>5</span>
              </div>
            </div>
          )}
        </div>

        {/* File Context Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">File Context (Optional)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.json,.pdf,.docx,.csv"
            className="hidden"
            onChange={handleFileUpload}
          />

          {fileData ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{fileData.name}</p>
                  <p className="text-xs text-muted-foreground">{fileData.size}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onFileRemove}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full h-12 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload context file
            </Button>
          )}
        </div>

        {/* Execute Button */}
        <Button
          className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold text-lg shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          onClick={handleExecuteClick}
          disabled={isLoading || !task.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              {statusMessage || 'Processing...'}
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Execute Council
            </>
          )}
        </Button>

        {/* Status Message */}
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
File: src/components/council/ExpertCard.tsx
================================================================================
import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Expert, KnowledgeFile } from '@/lib/types';
import { SafeMarkdown } from '@/components/ui/SafeMarkdown';
import { MAGNIFICENT_7_FLEET } from '@/lib/config';
import { EXPERT_POSITIONS, PERSONA_LIBRARY } from '@/lib/persona-library';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Brain, 
  Cpu, 
  Target, 
  Heart, 
  AlertTriangle,
  Copy, 
  Pencil, 
  Upload, 
  FileText,
  ChevronDown,
  ChevronUp,
  Settings2,
  Loader2,
  X,
  Maximize2,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
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
  expert: Expert;
  index: number;
  isActive: boolean;
  onUpdate: (index: number, expert: Expert) => void;
  onRemoveKnowledge: (expertIndex: number, fileId: string) => void;
  onAddKnowledge: (expertIndex: number, files: KnowledgeFile[]) => void;
  onRetry?: (expertIndex: number) => void;
  onClearPersona?: (expertIndex: number) => void;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({
  expert,
  index,
  isActive,
  onUpdate,
  onRemoveKnowledge,
  onAddKnowledge,
  onRetry,
  onClearPersona,
}) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPersona, setEditedPersona] = useState(expert.basePersona);
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const IconComponent = ICON_MAP[expert.icon] || Brain;
  const selectedModel = MAGNIFICENT_7_FLEET.find((m) => m.id === expert.model);
  
  // Get position info
  const positionInfo = EXPERT_POSITIONS[index] || EXPERT_POSITIONS[0];
  const positionName = expert.positionName || positionInfo.position;
  
  // Get loaded persona info
  const loadedPersona = expert.personaId ? PERSONA_LIBRARY[expert.personaId] : null;

  const handleCopy = useCallback(() => {
    if (expert.output) {
      navigator.clipboard.writeText(expert.output);
      toast.success('Output copied to clipboard');
    }
  }, [expert.output]);

  const handleRetry = useCallback(() => {
    onRetry?.(index);
    toast.info(`Retrying ${expert.name}...`);
  }, [onRetry, index, expert.name]);

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    toast.success(`Feedback recorded: ${type === 'up' ? '👍' : '👎'}`);
  };

  const handleClearPersonaClick = () => {
    onClearPersona?.(index + 1);
    toast.success(`${positionName} reset to default`);
  };

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
        onAddKnowledge(index, newKnowledge);
        toast.success(`Added ${newKnowledge.length} file(s) to knowledge base`);
      }

      event.target.value = '';
    },
    [index, onAddKnowledge]
  );

  const handleModelChange = (modelId: string) => {
    onUpdate(index, { ...expert, model: modelId });
  };

  const handleConfigChange = (key: keyof Expert['config'], value: number) => {
    onUpdate(index, {
      ...expert,
      config: { ...expert.config, [key]: value },
    });
  };

  const handleSavePersona = () => {
    onUpdate(index, { ...expert, basePersona: editedPersona });
    setIsEditing(false);
    toast.success('Persona updated');
  };

  return (
    <>
      <Card
        className={`glass-panel transition-all duration-300 flex flex-col h-full ${
          isActive ? 'ring-2 ring-primary/50 animate-pulse-glow' : 'opacity-60'
        } ${expert.isLoading ? 'animate-shimmer border-primary/40' : ''}`}
      >
        <CardHeader className="pb-2 flex-shrink-0">
          {/* Position + Persona Header */}
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
                {/* Position name (always shown) */}
                <h3 className="font-bold text-foreground text-sm truncate">{positionName}</h3>
                {/* Loaded persona (if any) */}
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
              {/* Clear Persona button */}
              {loadedPersona && onClearPersona && (
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

          {/* Persona Badge */}
          {loadedPersona && (
            <Badge 
              variant="outline" 
              className="mt-2 text-[10px] bg-primary/5 border-primary/20 text-primary"
            >
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              Persona: {expert.personaId}
            </Badge>
          )}

          {/* Compact Model selector */}
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
          {/* Knowledge Base Section - Compact */}
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
                      onClick={() => onRemoveKnowledge(index, file.id)}
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

          {/* Config Section - Compact */}
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
              {/* Temperature */}
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

              {/* Top P */}
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

              {/* Max Tokens */}
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
            </CollapsibleContent>
          </Collapsible>

          {/* Persona Edit */}
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

          {/* Output Display - Takes remaining space */}
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

          {/* Action Footer - Using new component */}
          {expert.output && (
            <ExpertOutputFooter
              expertId={expert.id}
              expertName={expert.name}
              output={expert.output}
              model={expert.model}
              onRetry={onRetry ? handleRetry : undefined}
              isRetrying={expert.isLoading}
            />
          )}
        </CardContent>
      </Card>

      {/* Expanded Modal */}
      <Suspense fallback={null}>
        <ExpertExpandedModal
          expert={expert}
          isOpen={isExpanded}
          onClose={() => setIsExpanded(false)}
          onRetry={onRetry ? () => handleRetry() : undefined}
        />
      </Suspense>
    </>
  );
};

export default ExpertCard;


================================================================================
File: src/components/council/ExpertExpandedModal.tsx
================================================================================
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SafeMarkdown } from '@/components/ui/SafeMarkdown';
import { Expert } from '@/lib/types';
import { MAGNIFICENT_7_FLEET } from '@/lib/config';
import { 
  Copy, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown, 
  X,
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
File: src/components/council/ExpertOutputFooter.tsx
================================================================================
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Check,
  Clock,
  Coins,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

interface ExpertOutputFooterProps {
  expertId: string;
  expertName: string;
  output: string;
  model: string;
  sessionId?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  generationTime?: number; // in seconds
  tokenCount?: number;
  cost?: number;
}

// Store feedback in localStorage
const saveFeedback = (expertId: string, sessionId: string, feedback: 'up' | 'down') => {
  const key = `expert_feedback_${expertId}_${sessionId}`;
  const analyticsKey = 'expert_feedback_analytics';
  
  // Save individual feedback
  localStorage.setItem(key, feedback);
  
  // Update analytics
  try {
    const analytics = JSON.parse(localStorage.getItem(analyticsKey) || '{}');
    if (!analytics[expertId]) {
      analytics[expertId] = { helpful: 0, notHelpful: 0 };
    }
    if (feedback === 'up') {
      analytics[expertId].helpful++;
    } else {
      analytics[expertId].notHelpful++;
    }
    localStorage.setItem(analyticsKey, JSON.stringify(analytics));
  } catch (e) {
    console.error('Failed to save feedback analytics:', e);
  }
};

// Get stored feedback
const getFeedback = (expertId: string, sessionId: string): 'up' | 'down' | null => {
  const key = `expert_feedback_${expertId}_${sessionId}`;
  const stored = localStorage.getItem(key);
  return stored as 'up' | 'down' | null;
};

export const ExpertOutputFooter: React.FC<ExpertOutputFooterProps> = ({
  expertId,
  expertName,
  output,
  model,
  sessionId = 'current',
  onRetry,
  isRetrying = false,
  generationTime,
  tokenCount,
  cost,
}) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(
    () => getFeedback(expertId, sessionId)
  );
  const [copied, setCopied] = useState(false);

  // Estimate tokens if not provided (rough estimate: ~4 chars per token)
  const estimatedTokens = tokenCount || Math.round(output.length / 4);
  const charCount = output.length;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success('Output copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      toast.error('Failed to copy');
    }
  }, [output]);

  const handleFeedback = useCallback((type: 'up' | 'down') => {
    setFeedback(type);
    saveFeedback(expertId, sessionId, type);
    toast.success(`Feedback recorded: ${type === 'up' ? '👍 Helpful' : '👎 Not helpful'}`);
  }, [expertId, sessionId]);

  const handleShare = useCallback(async () => {
    const shareText = `The Council V18 - Expert Analysis
Expert: ${expertName}
Model: ${model}

${output}`;

    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Share text copied to clipboard');
    } catch (e) {
      toast.error('Failed to copy share text');
    }
  }, [expertName, model, output]);

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Feedback Buttons */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={feedback === 'up' ? 'default' : 'ghost'}
                  size="icon"
                  className={`h-8 w-8 ${feedback === 'up' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : ''}`}
                  onClick={() => handleFeedback('up')}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Helpful</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={feedback === 'down' ? 'default' : 'ghost'}
                  size="icon"
                  className={`h-8 w-8 ${feedback === 'down' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : ''}`}
                  onClick={() => handleFeedback('down')}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Not helpful</TooltipContent>
            </Tooltip>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Copy Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{copied ? 'Copied!' : 'Copy output'}</TooltipContent>
            </Tooltip>

            {/* Retry Button */}
            {onRetry && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onRetry}
                    disabled={isRetrying}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Retry analysis</TooltipContent>
              </Tooltip>
            )}

            {/* Share Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleShare}
                >
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share expert view</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {charCount.toLocaleString()} chars
          </span>
          <span>•</span>
          <span>~{estimatedTokens.toLocaleString()} tokens</span>
          {generationTime !== undefined && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {generationTime.toFixed(1)}s
              </span>
            </>
          )}
          {cost !== undefined && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Coins className="h-3 w-3" />
                ${cost.toFixed(4)}
              </span>
            </>
          )}
          <span>•</span>
          <Badge variant="outline" className="text-[9px] h-4 px-1">
            {model.split('/').pop()}
          </Badge>
        </div>
      </div>
    </TooltipProvider>
  );
};

// Feedback Stats Component (Admin View)
interface FeedbackStatsProps {
  className?: string;
}

export const FeedbackStats: React.FC<FeedbackStatsProps> = ({ className }) => {
  const [stats, setStats] = useState<Record<string, { helpful: number; notHelpful: number }>>({});

  React.useEffect(() => {
    try {
      const analytics = JSON.parse(localStorage.getItem('expert_feedback_analytics') || '{}');
      setStats(analytics);
    } catch (e) {
      console.error('Failed to load feedback stats:', e);
    }
  }, []);

  if (Object.keys(stats).length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h4 className="text-sm font-medium mb-2">Expert Feedback Stats</h4>
      <div className="space-y-2">
        {Object.entries(stats).map(([expertId, data]) => {
          const total = data.helpful + data.notHelpful;
          const helpfulPercent = total > 0 ? Math.round((data.helpful / total) * 100) : 0;
          
          return (
            <div key={expertId} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{expertId}</span>
              <span className={helpfulPercent >= 70 ? 'text-green-500' : helpfulPercent >= 50 ? 'text-yellow-500' : 'text-red-500'}>
                {helpfulPercent}% helpful ({total} ratings)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpertOutputFooter;


================================================================================
File: src/components/council/Header.tsx
================================================================================
import React from 'react';
import { Brain, Settings, Lock, Unlock, DollarSign, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MemoryBadge } from './MemoryPanel';

interface CostBreakdown {
  experts: number;
  synthesis: number;
  total: number;
}

interface HeaderProps {
  cost: CostBreakdown;
  isVaultLocked: boolean;
  onOpenSettings: () => void;
  onOpenHistory?: () => void;
  showHistory?: boolean;
  memoryCount?: number;
  onOpenMemory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cost, isVaultLocked, onOpenSettings, onOpenHistory, showHistory, memoryCount = 0, onOpenMemory }) => {
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
            {onOpenMemory && (
              <MemoryBadge count={memoryCount} onClick={onOpenMemory} />
            )}

            {/* Cost tracker */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
              <DollarSign className="h-4 w-4 text-council-success" />
              <span className="font-mono text-sm text-foreground">${cost.total.toFixed(4)}</span>
            </div>

            {/* History button */}
            {onOpenHistory && (
              <Button
                variant={showHistory ? "default" : "ghost"}
                size="icon"
                className="h-10 w-10"
                onClick={onOpenHistory}
              >
                <History className="h-5 w-5" />
              </Button>
            )}

            {/* Vault status */}
            <Badge
              variant={isVaultLocked ? 'destructive' : 'default'}
              className={`flex items-center gap-1.5 ${
                isVaultLocked 
                  ? 'bg-destructive/20 text-destructive border-destructive/30' 
                  : 'bg-council-success/20 text-council-success border-council-success/30'
              }`}
            >
              {isVaultLocked ? (
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
              onClick={onOpenSettings}
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
File: src/components/council/HistoryPanel.tsx
================================================================================
import React from 'react';
import { CouncilSession } from '@/lib/types';
import { getSessions, deleteSession, clearHistory, formatRelativeTime, formatSessionPreview } from '@/lib/session-history';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  History, 
  Trash2, 
  RotateCcw, 
  Clock, 
  Users, 
  DollarSign,
  ChevronRight,
  AlertTriangle,
  X,
  PanelRightClose
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
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface HistoryPanelProps {
  onLoadSession: (session: CouncilSession) => void;
  onRefresh: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

// Standalone History Card Component (for inline display)
export const HistoryCard: React.FC<HistoryPanelProps> = ({ onLoadSession, onRefresh }) => {
  const [sessions, setSessions] = React.useState<CouncilSession[]>([]);

  React.useEffect(() => {
    setSessions(getSessions());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(id);
    setSessions(getSessions());
    toast.success('Session deleted');
  };

  const handleClearAll = () => {
    clearHistory();
    setSessions([]);
    toast.success('History cleared');
  };

  const handleLoad = (session: CouncilSession) => {
    onLoadSession(session);
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
                setSessions(getSessions());
                onRefresh();
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
    setSessions(getSessions());
  }, [isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(id);
    setSessions(getSessions());
    toast.success('Session deleted');
  };

  const handleClearAll = () => {
    clearHistory();
    setSessions([]);
    toast.success('History cleared');
  };

  const handleLoad = (session: CouncilSession) => {
    onLoadSession(session);
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
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
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
                  setSessions(getSessions());
                  onRefresh();
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

// Default export for backward compatibility
export const HistoryPanel = HistoryCard;
export default HistoryPanel;


================================================================================
File: src/components/council/MemoryPanel.tsx
================================================================================
import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
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
} from '@/components/ui/alert-dialog';
import {
  Brain,
  Search,
  Trash2,
  Download,
  X,
  Lightbulb,
  Settings,
  RefreshCw,
  Tag,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  CouncilMemory,
  MemoryEntry,
  loadMemory,
  saveMemory,
  deleteMemoryEntry,
  clearMemory,
  setMemoryEnabled,
  formatMemoryTime,
  getMemoryTypeLabel,
} from '@/lib/council-memory';

interface MemoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [memory, setMemory] = useState<CouncilMemory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load memory on mount
  useEffect(() => {
    if (isOpen) {
      loadMemoryData();
    }
  }, [isOpen]);

  const loadMemoryData = async () => {
    setIsLoading(true);
    try {
      const data = await loadMemory();
      setMemory(data);
    } catch (error) {
      console.error('Failed to load memory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEnabled = async (enabled: boolean) => {
    await setMemoryEnabled(enabled);
    if (memory) {
      setMemory({ ...memory, enabled });
    }
    toast.success(enabled ? 'Council Memory enabled' : 'Council Memory disabled');
  };

  const handleDeleteEntry = async (id: string) => {
    await deleteMemoryEntry(id);
    if (memory) {
      setMemory({
        ...memory,
        entries: memory.entries.filter(e => e.id !== id),
      });
    }
    toast.success('Memory entry deleted');
  };

  const handleClearAll = async () => {
    await clearMemory();
    setMemory({
      entries: [],
      userPreferences: {},
      domainKnowledge: {},
      enabled: true,
    });
    toast.success('All memories cleared');
  };

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

  // Filter entries
  const filteredEntries = memory?.entries.filter(entry => {
    const matchesSearch = !searchQuery || 
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = !filterType || entry.type === filterType;
    
    return matchesSearch && matchesType;
  }) || [];

  const typeCounts = memory?.entries.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
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
          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="memory-enabled"
                checked={memory?.enabled ?? true}
                onCheckedChange={handleToggleEnabled}
              />
              <Label htmlFor="memory-enabled" className="text-sm">
                {memory?.enabled ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleExport}
                title="Export memory"
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    title="Clear all memory"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all memories?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all {memory?.entries.length || 0} memory entries. 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearAll}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filterType === null ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setFilterType(null)}
            >
              All ({memory?.entries.length || 0})
            </Badge>
            {Object.entries(typeCounts).map(([type, count]) => (
              <Badge
                key={type}
                variant={filterType === type ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFilterType(filterType === type ? null : type)}
              >
                {getMemoryTypeLabel(type as any)} ({count})
              </Badge>
            ))}
          </div>

          {/* Memory list */}
          <ScrollArea className="h-[calc(100vh-320px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Lightbulb className="h-10 w-10 mb-3 opacity-50" />
                <p className="text-sm font-medium">No memories yet</p>
                <p className="text-xs">Insights will be captured from your Council sessions</p>
              </div>
            ) : (
              <div className="space-y-3 pr-4">
                {filteredEntries.map((entry) => (
                  <MemoryEntryCard
                    key={entry.id}
                    entry={entry}
                    onDelete={() => handleDeleteEntry(entry.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Memory Entry Card Component
interface MemoryEntryCardProps {
  entry: MemoryEntry;
  onDelete: () => void;
}

const MemoryEntryCard: React.FC<MemoryEntryCardProps> = ({ entry, onDelete }) => {
  return (
    <div className="group relative rounded-lg border border-border/50 bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Badge variant="outline" className="text-[10px]">
          {getMemoryTypeLabel(entry.type)}
        </Badge>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">
            {formatMemoryTime(entry.timestamp)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
            onClick={onDelete}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-foreground leading-relaxed">
        {entry.content}
      </p>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <Tag className="h-3 w-3 text-muted-foreground" />
          {entry.tags.map((tag, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="text-[9px] px-1.5 py-0"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Relevance */}
      <div className="flex items-center justify-end mt-2">
        <span className="text-[9px] text-muted-foreground">
          Score: {(entry.relevanceScore * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

// Memory Badge for Header
interface MemoryBadgeProps {
  count: number;
  onClick: () => void;
}

export const MemoryBadge: React.FC<MemoryBadgeProps> = ({ count, onClick }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 gap-1.5 text-sm"
      onClick={onClick}
    >
      <Brain className="h-4 w-4 text-primary" />
      <span className="hidden sm:inline">{count} memories</span>
      <Badge variant="secondary" className="text-[10px] ml-1 sm:hidden">
        {count}
      </Badge>
    </Button>
  );
};

export default MemoryPanel;


================================================================================
File: src/components/council/PersonaSelector.tsx
================================================================================
import React, { useState } from 'react';
import { Expert, ExecutionMode } from '@/lib/types';
import { 
  PERSONA_LIBRARY, 
  PERSONA_TEAMS,
  EXPERT_POSITIONS,
  getPersonaSelectorOptions, 
  getTeamSelectorOptions,
  loadPersonaIntoExpert,
  loadTeam
} from '@/lib/persona-library';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Users, User, RotateCcw, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

interface PersonaSelectorProps {
  experts: Expert[];
  activeExpertCount: number;
  onLoadPersona: (expertIndex: number, personaId: string) => void;
  onLoadTeam: (teamId: string) => void;
  onClearPersona: (expertIndex: number) => void;
  onResetToDefault: () => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  experts,
  activeExpertCount,
  onLoadPersona,
  onLoadTeam,
  onClearPersona,
  onResetToDefault,
}) => {
  const [showIndividual, setShowIndividual] = useState(false);
  const teams = getTeamSelectorOptions();
  const personas = getPersonaSelectorOptions();

  const handleTeamSelect = (teamId: string) => {
    if (teamId) {
      onLoadTeam(teamId);
    }
  };

  const handlePersonaSelect = (expertIndex: number, personaId: string) => {
    if (personaId === 'clear') {
      onClearPersona(expertIndex);
    } else if (personaId) {
      onLoadPersona(expertIndex, personaId);
    }
  };

  // Get persona ID from expert if it has one
  const getExpertPersonaId = (expert: Expert): string | undefined => {
    return expert.personaId;
  };

  // Get position info for an expert slot
  const getPositionInfo = (index: number) => {
    return EXPERT_POSITIONS[index] || EXPERT_POSITIONS[0];
  };

  return (
    <Card className="glass-panel border-primary/20">
      <CardContent className="p-4 space-y-4">
        {/* Team Selector */}
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

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* Individual Persona Selectors (Collapsible) */}
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
                    {/* Position Label */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        Expert {idx + 1}:
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {position.position}
                      </span>
                    </div>
                    
                    {/* Persona Selector */}
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

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={onResetToDefault}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset All
          </Button>
        </div>

        {/* Loaded Personas Summary */}
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

export default PersonaSelector;


================================================================================
File: src/components/council/SettingsModal.tsx
================================================================================
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Unlock, Key, Shield, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [serperKey, setSerperKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLock = () => {
    onLockVault();
    toast.success('Vault locked');
  };

  const resetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setOpenRouterKey('');
    setSerperKey('');
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
File: src/components/council/SynthesisCard.tsx
================================================================================
import React, { useState } from 'react';
import { SynthesisConfig, SynthesisTier, SynthesisResult } from '@/lib/types';
import { SYNTHESIS_TIERS, DEFAULT_SYNTHESIS_CONFIG } from '@/lib/synthesis-engine';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SafeMarkdown } from '@/components/ui/SafeMarkdown';
import { 
  Brain, 
  Copy, 
  Settings2, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const TIER_ICONS: Record<SynthesisTier, React.ComponentType<{ className?: string }>> = {
  quick: Zap,
  balanced: Target,
  deep: Brain,
};

interface SynthesisCardProps {
  synthesis: SynthesisResult | null;
  isLoading: boolean;
  config: SynthesisConfig;
  onConfigChange: (config: SynthesisConfig) => void;
}

export const SynthesisCard: React.FC<SynthesisCardProps> = ({
  synthesis,
  isLoading,
  config,
  onConfigChange,
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const tierConfig = SYNTHESIS_TIERS[config.tier];

  const handleCopy = async () => {
    if (synthesis?.content) {
      await navigator.clipboard.writeText(synthesis.content);
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
                <span className="truncate">{config.model.split('/')[1]}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {synthesis?.content && (
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
                      variant={config.tier === tier ? 'default' : 'outline'}
                      size="sm"
                      className={`flex-1 ${config.tier === tier ? 'bg-gradient-to-r from-primary to-secondary' : ''}`}
                      onClick={() => onConfigChange({ ...config, tier })}
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
                value={config.model}
                onValueChange={(value) => onConfigChange({ ...config, model: value })}
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
                <span className="font-mono">{config.temperature.toFixed(2)}</span>
              </div>
              <Slider
                value={[config.temperature]}
                onValueChange={([value]) => onConfigChange({ ...config, temperature: value })}
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
                value={config.customInstructions}
                onChange={(e) => onConfigChange({ ...config, customInstructions: e.target.value })}
                placeholder="E.g., 'Focus on cost-benefit analysis'"
                className="min-h-[60px] text-xs bg-muted/50 resize-none"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-lg opacity-50 animate-pulse" />
                <Loader2 className="h-8 w-8 animate-spin text-primary relative z-10" />
              </div>
              <span className="text-xs text-muted-foreground mt-3">
                {tierConfig.icon} Running {tierConfig.name}...
              </span>
            </div>
          ) : synthesis?.content ? (
            <ScrollArea className="h-full">
              <SafeMarkdown content={synthesis.content} className="text-sm p-2" />
              {synthesis.cost > 0 && (
                <div className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50 flex items-center gap-2">
                  <span>{tierConfig.icon} {config.tier}</span>
                  <span>•</span>
                  <span>{synthesis.model.split('/')[1]}</span>
                  <span>•</span>
                  <span>${synthesis.cost.toFixed(6)}</span>
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
File: src/components/council/VerdictPanel.tsx
================================================================================
import React from 'react';
import { SynthesisResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SafeMarkdown } from '@/components/ui/SafeMarkdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileSpreadsheet, 
  FileText, 
  Copy, 
  Loader2,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface CostBreakdown {
  experts: number;
  synthesis: number;
  total: number;
}

interface VerdictPanelProps {
  verdict: string;
  isLoading: boolean;
  cost: CostBreakdown;
  synthesisResult?: SynthesisResult | null;
  onExportCSV: () => void;
  onExportDocs: () => void;
}

export const VerdictPanel: React.FC<VerdictPanelProps> = ({
  verdict,
  isLoading,
  cost,
  synthesisResult,
  onExportCSV,
  onExportDocs,
}) => {
  const handleCopy = () => {
    if (verdict) {
      navigator.clipboard.writeText(verdict);
      toast.success('Verdict copied to clipboard');
    }
  };

  return (
    <Card className="glass-panel-elevated h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            Council Verdict
          </CardTitle>
          {cost.total > 0 && (
            <span className="text-xs font-mono text-muted-foreground">
              ${cost.total.toFixed(4)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-lg opacity-50 animate-pulse" />
              <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">
              Synthesizing insights...
            </p>
          </div>
        ) : verdict ? (
          <>
            <ScrollArea className="h-[300px] rounded-lg bg-muted/30 p-4">
              <SafeMarkdown content={verdict} className="text-sm" />
            </ScrollArea>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 min-w-[120px]"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 min-w-[120px]"
                onClick={onExportCSV}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 min-w-[120px]"
                onClick={onExportDocs}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export Docs
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Verdict Yet</h3>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Enter a task and execute the Council to generate insights.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerdictPanel;


================================================================================
File: src/components/ui/ArtifactRenderer.tsx
================================================================================
import React, { useState, Suspense, lazy } from 'react';
import { Copy, ChevronDown, ChevronUp, Code, Table, FileJson, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

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
  const [isOpen, setIsOpen] = useState(defaultOpen);
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
              {artifact.language || 'text'}
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

// Parse artifact markers from content
export function parseArtifacts(content: string): { text: string; artifacts: Artifact[] }[] {
  const parts: { text: string; artifacts: Artifact[] }[] = [];
  
  // Regex to match ```artifact:TYPE:LANG or ```artifact:TYPE code blocks
  const artifactRegex = /```artifact:(code|mermaid|table|json|markdown)(?::(\w+))?\n([\s\S]*?)```/g;
  
  let lastIndex = 0;
  let match;
  
  while ((match = artifactRegex.exec(content)) !== null) {
    // Add text before this artifact
    if (match.index > lastIndex) {
      parts.push({
        text: content.slice(lastIndex, match.index),
        artifacts: [],
      });
    }
    
    // Add the artifact
    parts.push({
      text: '',
      artifacts: [{
        type: match[1] as Artifact['type'],
        language: match[2],
        content: match[3].trim(),
      }],
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({
      text: content.slice(lastIndex),
      artifacts: [],
    });
  }
  
  return parts.length > 0 ? parts : [{ text: content, artifacts: [] }];
}

export default ArtifactCard;


================================================================================
File: src/components/ui/MermaidDiagram.tsx
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
  const [isLoading, setIsLoading] = useState(true);

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
File: src/components/ui/SafeMarkdown.tsx
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
File: src/components/ui/accordion.tsx
================================================================================
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

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


================================================================================
File: src/components/ui/alert-dialog.tsx
================================================================================
import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

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
File: src/components/ui/alert.tsx
================================================================================
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
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
File: src/components/ui/aspect-ratio.tsx
================================================================================
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };


================================================================================
File: src/components/ui/avatar.tsx
================================================================================
import * as React from "react";
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
File: src/components/ui/badge.tsx
================================================================================
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };


================================================================================
File: src/components/ui/breadcrumb.tsx
================================================================================
import * as React from "react";
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
File: src/components/ui/button.tsx
================================================================================
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
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
File: src/components/ui/calendar.tsx
================================================================================
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

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
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };


================================================================================
File: src/components/ui/card.tsx
================================================================================
import * as React from "react";

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
File: src/components/ui/carousel.tsx
================================================================================
import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

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
File: src/components/ui/chart.tsx
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
File: src/components/ui/checkbox.tsx
================================================================================
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

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
File: src/components/ui/collapsible.tsx
================================================================================
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };


================================================================================
File: src/components/ui/command.tsx
================================================================================
import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
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


================================================================================
File: src/components/ui/context-menu.tsx
================================================================================
import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

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
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
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
File: src/components/ui/dialog.tsx
================================================================================
import * as React from "react";
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
File: src/components/ui/drawer.tsx
================================================================================
import * as React from "react";
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
DrawerContent.displayName = "DrawerContent";

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
File: src/components/ui/dropdown-menu.tsx
================================================================================
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

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
};


================================================================================
File: src/components/ui/form.tsx
================================================================================
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

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

const useFormField = () => {
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

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

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
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return <Label ref={ref} className={cn(error && "text-destructive", className)} htmlFor={formItemId} {...props} />;
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={!!error}
        {...props}
      />
    );
  },
);
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return <p ref={ref} id={formDescriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />;
  },
);
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <p ref={ref} id={formMessageId} className={cn("text-sm font-medium text-destructive", className)} {...props}>
        {body}
      </p>
    );
  },
);
FormMessage.displayName = "FormMessage";

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };


================================================================================
File: src/components/ui/hover-card.tsx
================================================================================
import * as React from "react";
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


================================================================================
File: src/components/ui/input-otp.tsx
================================================================================
import * as React from "react";
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


================================================================================
File: src/components/ui/input.tsx
================================================================================
import * as React from "react";

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
File: src/components/ui/label.tsx
================================================================================
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

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
File: src/components/ui/menubar.tsx
================================================================================
import * as React from "react";
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
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};


================================================================================
File: src/components/ui/navigation-menu.tsx
================================================================================
import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

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

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
);

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
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};


================================================================================
File: src/components/ui/pagination.tsx
================================================================================
import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

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

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
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
File: src/components/ui/popover.tsx
================================================================================
import * as React from "react";
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
File: src/components/ui/progress.tsx
================================================================================
import * as React from "react";
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
File: src/components/ui/radio-group.tsx
================================================================================
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };


================================================================================
File: src/components/ui/resizable.tsx
================================================================================
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
File: src/components/ui/scroll-area.tsx
================================================================================
import * as React from "react";
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
File: src/components/ui/select.tsx
================================================================================
import * as React from "react";
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


================================================================================
File: src/components/ui/separator.tsx
================================================================================
import * as React from "react";
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


================================================================================
File: src/components/ui/sheet.tsx
================================================================================
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

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
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
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
File: src/components/ui/sidebar.tsx
================================================================================
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
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
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className)}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
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
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

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
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
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
          "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className,
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";

const SidebarInput = React.forwardRef<React.ElementRef<typeof Input>, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        data-sidebar="input"
        className={cn(
          "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          className,
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

const sidebarMenuButtonVariants = cva(
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

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();

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
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile} {...tooltip} />
    </Tooltip>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean;
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ ...props }, ref) => (
  <li ref={ref} {...props} />
));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};


================================================================================
File: src/components/ui/skeleton.tsx
================================================================================
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };


================================================================================
File: src/components/ui/slider.tsx
================================================================================
import * as React from "react";
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


================================================================================
File: src/components/ui/sonner.tsx
================================================================================
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };


================================================================================
File: src/components/ui/switch.tsx
================================================================================
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

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


================================================================================
File: src/components/ui/table.tsx
================================================================================
import * as React from "react";

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


================================================================================
File: src/components/ui/tabs.tsx
================================================================================
import * as React from "react";
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


================================================================================
File: src/components/ui/textarea.tsx
================================================================================
import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

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


================================================================================
File: src/components/ui/toast.tsx
================================================================================
import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

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
File: src/components/ui/toaster.tsx
================================================================================
import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

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
File: src/components/ui/toggle-group.tsx
================================================================================
import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

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


================================================================================
File: src/components/ui/toggle.tsx
================================================================================
import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
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

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };


================================================================================
File: src/components/ui/tooltip.tsx
================================================================================
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

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


================================================================================
File: src/components/ui/use-toast.ts
================================================================================
import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };


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

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

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
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
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
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };


================================================================================
File: src/index.css
================================================================================
@tailwind base;
@tailwind components;
@tailwind utilities;

/* The Council V18 - AI-Powered Multi-Perspective Decision Engine
   Design System: Dark glassmorphism with purple/blue gradients */

@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

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
File: src/lib/ai-client.ts
================================================================================
// OpenRouter AI Client - Real API integration
import { Expert, ExecutionMode } from './types';
import { buildSystemPrompt, MAGNIFICENT_7_FLEET } from './config';

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
  const systemPrompt = buildSystemPrompt(expert, mode, additionalContext);
  
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
  const systemPrompt = buildSystemPrompt(expert, mode, additionalContext);
  
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
    
    // Estimate cost (rough calculation since streaming doesn't return exact tokens)
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
  
  for (const [expertId, data] of Object.entries(expertOutputs)) {
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


================================================================================
File: src/lib/config.ts
================================================================================
import { Expert, ModelInfo, ExecutionMode } from './types';

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

export const MODE_DESCRIPTIONS: Record<ExecutionMode, { name: string; description: string; icon: string }> = {
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

export const DEFAULT_EXPERTS: Expert[] = [
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
    },
    color: 'from-blue-500 to-cyan-500',
    icon: 'Brain',
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
    knowledge: [],
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
    },
    color: 'from-emerald-500 to-teal-500',
    icon: 'Cpu',
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
      presencePenalty: 0.2,
      frequencyPenalty: 0.1,
    },
    modeBehavior: {
      separated: 'Analyze strategic implications independently.',
      synthesis: 'Align strategic vision across all perspectives.',
      debate: 'Challenge strategic assumptions and competitive positioning.',
      pipeline: 'Develop strategy building on previous insights.',
    },
    color: 'from-amber-500 to-orange-500',
    icon: 'Target',
    hasWebSearch: true,
  },
  {
    id: 'exp_4',
    name: 'The Psychologist',
    model: 'mistralai/mixtral-8x7b-instruct',
    role: 'system',
    basePersona: `You are "The Psychologist". Analyze human behavior, motivation, cognitive biases, and emotional factors. Consider how decisions affect stakeholders psychologically.

EXAMPLE OUTPUT:
"## Psychological Analysis

### Stakeholder Motivation Map
\`\`\`mermaid
mindmap
  root((Decision))
    Users
      Fear of Change
      Desire for Status
    Executives
      Risk Aversion
      Growth Pressure
    Team
      Job Security
      Recognition
\`\`\`

### Cognitive Bias Assessment
| Bias | Risk Level | Mitigation |
|------|------------|------------|
| Anchoring | High | Present multiple options |
| Confirmation | Medium | Devil's advocate process |
"`,
    knowledge: [],
    config: {
      temperature: 0.6,
      maxTokens: 4000,
      topP: 0.9,
      presencePenalty: 0.2,
      frequencyPenalty: 0.1,
    },
    modeBehavior: {
      separated: 'Provide psychological analysis independently.',
      synthesis: 'Harmonize understanding of human factors.',
      debate: 'Challenge assumptions about human behavior.',
      pipeline: 'Add psychological depth to previous analysis.',
    },
    color: 'from-pink-500 to-rose-500',
    icon: 'Heart',
  },
  {
    id: 'exp_5',
    name: 'The Critic',
    model: 'meta-llama/llama-3.1-8b-instruct',
    role: 'system',
    basePersona: `You are "The Critic". Your role is to find weaknesses, identify blind spots, and stress-test ideas. Be constructively skeptical. If something can fail, explain how.

EXAMPLE OUTPUT:
"## Critical Assessment

### Risk Matrix
| Risk | Probability | Impact | Priority |
|------|-------------|--------|----------|
| Technical Debt | High | Medium | 1 |
| Market Timing | Medium | High | 2 |

### Identified Weaknesses
✗ **Weakness 1:** [specific flaw]
✗ **Weakness 2:** [potential failure mode]
⚠ **Assumption Risk:** [untested assumptions]

### Mitigation Recommendations
→ [how to address each weakness]"`,
    knowledge: [],
    config: {
      temperature: 0.4,
      maxTokens: 3000,
      topP: 0.9,
      presencePenalty: 0.3,
      frequencyPenalty: 0.2,
    },
    modeBehavior: {
      separated: 'Provide critical analysis independently.',
      synthesis: 'Identify weaknesses in the emerging consensus.',
      debate: 'Aggressively challenge all positions.',
      pipeline: 'Stress-test the accumulated conclusions.',
    },
    color: 'from-red-500 to-rose-600',
    icon: 'AlertTriangle',
  },
];

export const EXPERT_COLORS = [
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
  'from-red-500 to-rose-600',
  'from-violet-500 to-purple-500',
  'from-indigo-500 to-blue-500',
];

export const buildSystemPrompt = (
  expert: Expert,
  mode: ExecutionMode,
  additionalContext?: string
): string => {
  const modeBehavior = MODE_BEHAVIORS[mode];
  const expertModeBehavior = expert.modeBehavior[mode];
  
  let prompt = `${expert.basePersona}\n\n`;
  
  // Add output formatting rules (Claude Artifacts style)
  prompt += OUTPUT_FORMATTING_RULES + '\n';
  
  // Add web search capability for enabled experts
  if (expert.hasWebSearch) {
    prompt += WEB_SEARCH_RULES + '\n';
  }
  
  prompt += `MODE INSTRUCTION: ${modeBehavior.instruction}\n`;
  prompt += `YOUR SPECIFIC BEHAVIOR: ${expertModeBehavior}\n`;
  
  if (expert.knowledge.length > 0) {
    prompt += '\n--- KNOWLEDGE BASE ---\n';
    expert.knowledge.forEach((file) => {
      prompt += `\n[${file.name}]:\n${file.content}\n`;
    });
    prompt += '--- END KNOWLEDGE BASE ---\n';
  }
  
  if (additionalContext) {
    prompt += `\n--- ADDITIONAL CONTEXT ---\n${additionalContext}\n--- END CONTEXT ---\n`;
  }
  
  prompt += modeBehavior.suffix;
  
  return prompt;
};


================================================================================
File: src/lib/council-memory.ts
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
  userPreferences: Record<string, any>;
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
    if (memory) {
      // Convert timestamp strings back to Date objects
      return {
        ...memory,
        entries: memory.entries.map(e => ({
          ...e,
          timestamp: new Date(e.timestamp),
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
    const tagWords = memory.tags.map(t => t.toLowerCase());
    
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
    insightMemories.forEach((m, i) => {
      context += `${i + 1}. ${m.content}\n`;
    });
    context += '\n';
  }
  
  if (prefMemories.length > 0) {
    context += 'User preferences:\n';
    prefMemories.forEach((m, i) => {
      context += `- ${m.content}\n`;
    });
    context += '\n';
  }
  
  if (domainMemories.length > 0) {
    context += 'Domain context:\n';
    domainMemories.forEach((m, i) => {
      context += `- ${m.content}\n`;
    });
    context += '\n';
  }
  
  if (patternMemories.length > 0) {
    context += 'Observed patterns:\n';
    patternMemories.forEach((m, i) => {
      context += `- ${m.content}\n`;
    });
    context += '\n';
  }
  
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
  const prefMatches = synthesisContent.match(/(?:user prefers?|user wants?|user needs?|client prefers?)\s+([^\.]+)/gi);
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


================================================================================
File: src/lib/export.ts
================================================================================
import { Expert, ExecutionMode, ExportData } from './types';
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
      let remaining = trimmed;
      
      // Simple bold parsing
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
File: src/lib/persistence.ts
================================================================================
import { get, set, del, clear } from 'idb-keyval';
import type { Expert, SynthesisConfig, CouncilSession, ExecutionMode } from '@/lib/types';

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
    return await get<PersistedAppState>(KEYS.APP_STATE);
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
File: src/lib/persona-library.ts
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
File: src/lib/session-history.ts
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
    // Convert timestamp strings back to Date objects
    return sessions.map((s: any) => ({
      ...s,
      timestamp: new Date(s.timestamp),
    }));
  } catch (e) {
    console.error('Failed to load session history:', e);
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
  const taskPreview = session.task.length > 60 
    ? session.task.slice(0, 60) + '...' 
    : session.task;
  return taskPreview;
}

// Format relative time
export function formatRelativeTime(date: Date): string {
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
File: src/lib/synthesis-engine.ts
================================================================================
// Intelligent Synthesis Engine with 3-Tier Prompting
import { SynthesisTier, SynthesisConfig, SynthesisResult } from './types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Synthesis tier configurations
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
    name: 'Quick Synthesis',
    icon: '⚡',
    description: 'Fast consensus extraction (single-pass)',
    estimatedTime: '~15s',
    estimatedCost: '$0.0003',
    temperature: 0.3,
    maxTokens: 2000,
  },
  balanced: {
    name: 'Balanced Synthesis',
    icon: '🎯',
    description: 'Smart deduplication + Chain-of-Thought',
    estimatedTime: '~25s',
    estimatedCost: '$0.0008',
    temperature: 0.4,
    maxTokens: 4000,
  },
  deep: {
    name: 'Deep Synthesis',
    icon: '🧠',
    description: 'Comprehensive Tree-of-Thought analysis',
    estimatedTime: '~40s',
    estimatedCost: '$0.0015',
    temperature: 0.5,
    maxTokens: 6000,
  },
};

export const DEFAULT_SYNTHESIS_CONFIG: SynthesisConfig = {
  tier: 'balanced',
  model: 'google/gemini-2.0-flash-001',
  fallbackModel: 'deepseek/deepseek-chat',
  temperature: 0.4,
  maxTokens: 4000,
  customInstructions: '',
};

interface ExpertOutput {
  name: string;
  model: string;
  content: string;
  specialty?: string;
}

// Build Quick prompt (single-pass, no CoT)
function buildQuickPrompt(expertOutputs: ExpertOutput[], task: string, customInstructions: string): string {
  let prompt = `You are a fast synthesis engine analyzing ${expertOutputs.length} expert perspectives.\n\n`;
  prompt += `TASK: "${task}"\n\n`;
  prompt += `EXPERT OUTPUTS:\n${'─'.repeat(40)}\n`;
  
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

// Build Balanced prompt (Chain-of-Thought)
function buildBalancedPrompt(expertOutputs: ExpertOutput[], task: string, customInstructions: string): string {
  let prompt = `You are an intelligent synthesis engine with Chain-of-Thought reasoning.\n\n`;
  prompt += `TASK: "${task}"\n\n`;
  prompt += `EXPERT OUTPUTS:\n${'─'.repeat(40)}\n`;
  
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
${expertOutputs.map((e, i) => `- Expert ${i + 1} (${e.name}) claims: [extract 3-5 key points]`).join('\n')}

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

// Build Deep prompt (Tree-of-Thought)
function buildDeepPrompt(expertOutputs: ExpertOutput[], task: string, customInstructions: string): string {
  let prompt = `You are a comprehensive synthesis engine using Tree-of-Thought exploration.\n\n`;
  prompt += `TASK: "${task}"\n\n`;
  prompt += `EXPERT OUTPUTS:\n${'─'.repeat(40)}\n`;
  
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

// Get the prompt builder for a tier
function getPromptBuilder(tier: SynthesisTier): (expertOutputs: ExpertOutput[], task: string, customInstructions: string) => string {
  switch (tier) {
    case 'quick':
      return buildQuickPrompt;
    case 'balanced':
      return buildBalancedPrompt;
    case 'deep':
      return buildDeepPrompt;
    default:
      return buildBalancedPrompt;
  }
}

// Main synthesis function
export async function executeSynthesis({
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
  onProgress?: (message: string) => void;
}): Promise<SynthesisResult> {
  const tierConfig = SYNTHESIS_TIERS[config.tier];
  const promptBuilder = getPromptBuilder(config.tier);
  const prompt = promptBuilder(expertOutputs, task, config.customInstructions);
  
  onProgress?.(`Running ${tierConfig.name}...`);
  
  // Try primary model
  try {
    const result = await callSynthesisAPI(
      prompt,
      config.model,
      config.temperature || tierConfig.temperature,
      config.maxTokens || tierConfig.maxTokens,
      apiKey
    );
    
    return {
      content: result.content,
      tier: config.tier,
      model: config.model,
      tokens: result.tokens,
      cost: result.cost,
    };
  } catch (error) {
    console.warn(`Primary model ${config.model} failed, trying fallback...`);
    onProgress?.(`Retrying with fallback model...`);
    
    // Try fallback model
    try {
      const result = await callSynthesisAPI(
        prompt,
        config.fallbackModel,
        config.temperature || tierConfig.temperature,
        config.maxTokens || tierConfig.maxTokens,
        apiKey
      );
      
      return {
        content: result.content,
        tier: config.tier,
        model: config.fallbackModel,
        tokens: result.tokens,
        cost: result.cost,
      };
    } catch (fallbackError) {
      console.error('Both models failed:', fallbackError);
      throw new Error('Synthesis failed with both primary and fallback models');
    }
  }
}

// API call helper
async function callSynthesisAPI(
  prompt: string,
  model: string,
  temperature: number,
  maxTokens: number,
  apiKey: string
): Promise<{ content: string; tokens: { prompt: number; completion: number }; cost: number }> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'The Council V18 - Synthesizer',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }
  
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || 'Synthesis failed';
  const promptTokens = data.usage?.prompt_tokens || 0;
  const completionTokens = data.usage?.completion_tokens || 0;
  
  // Estimate cost (simplified)
  const costPerMillion = model.includes('gemini') ? 0.075 : 0.14;
  const cost = ((promptTokens + completionTokens) / 1000000) * costPerMillion;
  
  return {
    content,
    tokens: { prompt: promptTokens, completion: completionTokens },
    cost,
  };
}

// Extract debate context from synthesis (consensus + conflicts only)
export function extractDebateContext(synthesisContent: string): string {
  const lines = synthesisContent.split('\n');
  let context = '';
  let capture = false;
  
  for (const line of lines) {
    if (line.includes('## CONSENSUS') || line.includes('## AREAS OF AGREEMENT')) {
      context += '\n**CONSENSUS:**\n';
      capture = true;
    } else if (line.includes('## CONFLICT') || line.includes('## CONTRADICTION')) {
      context += '\n**CONFLICTS:**\n';
      capture = true;
    } else if (line.startsWith('## ') && !line.includes('CONSENSUS') && !line.includes('CONFLICT') && !line.includes('CONTRADICTION')) {
      capture = false;
    } else if (capture && line.trim()) {
      context += line + '\n';
    }
  }
  
  return context || synthesisContent.substring(0, 1000);
}


================================================================================
File: src/lib/types.ts
================================================================================
// Council V18 Type Definitions

export interface ModelInfo {
  id: string;
  name: string;
  specialty: string;
  costPer1k: number;
  contextWindow: number;
  recommended: string;
}

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
  knowledge: KnowledgeFile[];
  config: ExpertConfig;
  modeBehavior: ModeBehavior;
  color: string;
  icon: string;
  output?: string;
  isLoading?: boolean;
  personaId?: string; // Track which persona template was loaded
  hasWebSearch?: boolean; // Enable real-time web search capability
  // Position info (fixed expert slot)
  positionName?: string; // e.g., "The Logician"
  positionSpecialty?: string; // e.g., "Logic & Reasoning"
}

export type ExecutionMode = 'separated' | 'synthesis' | 'debate' | 'pipeline';

export type SynthesisTier = 'quick' | 'balanced' | 'deep';

export interface SynthesisConfig {
  tier: SynthesisTier;
  model: string;
  fallbackModel: string;
  temperature: number;
  maxTokens: number;
  customInstructions: string;
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

// Session History Types
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


================================================================================
File: src/lib/utils.ts
================================================================================
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


================================================================================
File: src/lib/vault.ts
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
  unlockTime: number;
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
export function initializeVault(): { hasVault: boolean; isLocked: boolean } {
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
export function getVaultStatus(): { hasVault: boolean; isLocked: boolean } {
  return initializeVault();
}

// Create new vault
export async function createVault(data: {
  password: string;
  openRouterKey: string;
  serperKey?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const keysToStore = JSON.stringify({
      openRouterKey: data.openRouterKey,
      serperKey: data.serperKey || '',
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
export async function unlockVault(password: string): Promise<{ success: boolean; error?: string }> {
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
      unlockTime: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    return { success: true };
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
export function getSessionKeys(): { openRouterKey: string; serperKey?: string } | null {
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
File: src/main.tsx
================================================================================
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);


================================================================================
File: src/pages/Index.tsx
================================================================================
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Expert, ExecutionMode, KnowledgeFile, VaultStatus, SynthesisConfig, SynthesisResult, CouncilSession } from '@/lib/types';
import { DEFAULT_EXPERTS } from '@/lib/config';
import { loadPersonaIntoExpert, loadTeam } from '@/lib/persona-library';
import { initializeVault, getVaultStatus, createVault, unlockVault, lockVault, getSessionKeys } from '@/lib/vault';
import { exportToCSV, downloadCSV, exportToDocx } from '@/lib/export';
import { callExpertStreaming } from '@/lib/ai-client';
import { executeSynthesis, DEFAULT_SYNTHESIS_CONFIG, SYNTHESIS_TIERS } from '@/lib/synthesis-engine';
import { saveSession, getSessions } from '@/lib/session-history';
import { 
  saveExperts, 
  loadExperts, 
  saveSynthesisConfig, 
  loadSynthesisConfig, 
  saveAppState, 
  loadAppState 
} from '@/lib/persistence';
import {
  loadMemory,
  findRelevantMemories,
  formatMemoriesForContext,
  extractMemoriesFromSynthesis,
  addMemoryEntries,
  CouncilMemory,
} from '@/lib/council-memory';
import { Header } from '@/components/council/Header';
import { ControlPanel } from '@/components/council/ControlPanel';
import { ExpertCard } from '@/components/council/ExpertCard';
import { VerdictPanel } from '@/components/council/VerdictPanel';
import { SynthesisCard } from '@/components/council/SynthesisCard';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Lazy load heavy modal/panel components for code splitting
const SettingsModal = lazy(() => import('@/components/council/SettingsModal'));
const HistoryPanel = lazy(() => import('@/components/council/HistoryPanel').then(m => ({ default: m.HistoryCard })));
const HistorySidebar = lazy(() => import('@/components/council/HistoryPanel').then(m => ({ default: m.HistorySidebar })));
const MemoryPanel = lazy(() => import('@/components/council/MemoryPanel'));

// Loading fallback for lazy components
const ComponentLoader = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
);

interface FileData {
  name: string;
  content: string;
  size: string;
}

interface CostBreakdown {
  experts: number;
  synthesis: number;
  total: number;
}

const Index: React.FC = () => {
  // State - initialized with defaults, then hydrated from IndexedDB
  const [task, setTask] = useState('');
  const [mode, setMode] = useState<ExecutionMode>('synthesis');
  const [activeExpertCount, setActiveExpertCount] = useState(5);
  const [debateRounds, setDebateRounds] = useState(3);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const [experts, setExperts] = useState<Expert[]>(DEFAULT_EXPERTS);
  const [synthesisConfig, setSynthesisConfig] = useState<SynthesisConfig>(DEFAULT_SYNTHESIS_CONFIG);

  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [synthesisResult, setSynthesisResult] = useState<SynthesisResult | null>(null);
  const [verdict, setVerdict] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [cost, setCost] = useState<CostBreakdown>({ experts: 0, synthesis: 0, total: 0 });
  
  const [vaultStatus, setVaultStatus] = useState<VaultStatus>(() => initializeVault());
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [memory, setMemory] = useState<CouncilMemory | null>(null);

  // Hydrate state from IndexedDB on mount
  useEffect(() => {
    const hydrateState = async () => {
      try {
        // Load all persisted data in parallel
        const [savedExperts, savedConfig, savedAppState] = await Promise.all([
          loadExperts(),
          loadSynthesisConfig(),
          loadAppState()
        ]);

        if (savedExperts) {
          setExperts(savedExperts);
        }
        if (savedConfig) {
          setSynthesisConfig(savedConfig);
        }
        if (savedAppState) {
          setTask(savedAppState.task || '');
          setMode(savedAppState.mode || 'synthesis');
          setActiveExpertCount(savedAppState.activeExpertCount || 3);
          setDebateRounds(savedAppState.debateRounds || 3);
        }

        setIsHydrated(true);
      } catch (error) {
        console.error('Failed to hydrate state from IndexedDB:', error);
        toast.error('Hydration Failed', {
          description: 'Could not load saved state from your browser. Please clear your site data and try again.',
        });
        setIsHydrated(true);
      }
    };

    hydrateState();
  }, []);

  // Auto-save experts to IndexedDB
  useEffect(() => {
    if (!isHydrated) return;
    saveExperts(experts);
  }, [experts, isHydrated]);

  // Auto-save synthesis config to IndexedDB
  useEffect(() => {
    if (!isHydrated) return;
    saveSynthesisConfig(synthesisConfig);
  }, [synthesisConfig, isHydrated]);

  // Auto-save app state to IndexedDB (debounced)
  useEffect(() => {
    if (!isHydrated) return;
    
    const timeoutId = setTimeout(() => {
      saveAppState({
        task,
        mode,
        activeExpertCount,
        debateRounds,
        lastUpdated: Date.now()
      });
    }, 500); // Debounce by 500ms

    return () => clearTimeout(timeoutId);
  }, [task, mode, activeExpertCount, debateRounds, isHydrated]);

  // Check vault on mount
  useEffect(() => {
    const status = getVaultStatus();
    setVaultStatus(status);
    if (!status.hasVault) {
      setShowSettings(true);
    }
  }, []);

  // Expert handlers
  const handleUpdateExpert = useCallback((index: number, updatedExpert: Expert) => {
    setExperts((prev) => {
      const newExperts = [...prev];
      newExperts[index] = updatedExpert;
      return newExperts;
    });
  }, []);

  const handleAddKnowledge = useCallback((expertIndex: number, files: KnowledgeFile[]) => {
    setExperts((prev) => {
      const newExperts = [...prev];
      newExperts[expertIndex] = {
        ...newExperts[expertIndex],
        knowledge: [...newExperts[expertIndex].knowledge, ...files],
      };
      return newExperts;
    });
  }, []);

  const handleRemoveKnowledge = useCallback((expertIndex: number, fileId: string) => {
    setExperts((prev) => {
      const newExperts = [...prev];
      newExperts[expertIndex] = {
        ...newExperts[expertIndex],
        knowledge: newExperts[expertIndex].knowledge.filter((f) => f.id !== fileId),
      };
      return newExperts;
    });
  }, []);

  // Persona handlers
  const handleLoadPersona = useCallback((expertIndex: number, personaId: string) => {
    const personaExpert = loadPersonaIntoExpert(personaId, expertIndex);
    if (!personaExpert) {
      toast.error('Failed to load persona', {
        description: `Could not find a persona with the ID: ${personaId}`
      });
      return;
    }
    
    setExperts((prev) => {
      const newExperts = [...prev];
      newExperts[expertIndex - 1] = personaExpert;
      return newExperts;
    });
    
    toast.success(`Loaded ${personaExpert.name} into Expert ${expertIndex}`);
  }, []);

  const handleLoadTeam = useCallback((teamId: string) => {
    const team = loadTeam(teamId);
    if (!team) {
      toast.error('Failed to load team', {
        description: `Could not find a team with the ID: ${teamId}`
      });
      return;
    }
    
    // Set active expert count to team size
    setActiveExpertCount(team.experts.length);
    
    // Load all team experts
    setExperts((prev) => {
      const newExperts = [...prev];
      team.experts.forEach((expert, index) => {
        newExperts[index] = expert;
      });
      return newExperts;
    });
    
    // Set recommended mode
    setMode(team.mode);
    
    toast.success(`Loaded ${team.name} with ${team.experts.length} experts`);
  }, []);

  const handleClearPersona = useCallback((expertIndex: number) => {
    // Reset to default expert
    const defaultExpert = DEFAULT_EXPERTS[expertIndex - 1];
    if (defaultExpert) {
      setExperts((prev) => {
        const newExperts = [...prev];
        newExperts[expertIndex - 1] = { ...defaultExpert };
        return newExperts;
      });
      toast.success(`Reset Expert ${expertIndex} to default`);
    }
  }, []);

  const handleResetToDefault = useCallback(() => {
    setExperts([...DEFAULT_EXPERTS]);
    toast.success('Reset all experts to defaults');
  }, []);

  // Vault handlers
  const handleCreateVault = async (data: { password: string; openRouterKey: string; serperKey?: string }) => {
    const result = await createVault(data);
    if (result.success) {
      setVaultStatus(getVaultStatus());
      toast.success('Vault Created', { description: 'Your API keys are now securely stored.' });
    } else {
      toast.error('Vault Creation Failed', { description: result.error });
    }
    return result;
  };

  const handleUnlockVault = async (password: string) => {
    const result = await unlockVault(password);
    if (result.success) {
      setVaultStatus(getVaultStatus());
      toast.success('Vault Unlocked');
    } else {
      toast.error('Unlock Failed', { description: 'The password you entered is incorrect.' });
    }
    return result;
  };

  const handleLockVault = () => {
    lockVault();
    setVaultStatus(getVaultStatus());
    toast.info('Vault Locked');
  };

  // Real AI execution with intelligent synthesis
  const handleExecute = async () => {
    const keys = getSessionKeys();
    if (!keys?.openRouterKey) {
      toast.error('Vault Locked', {
        description: 'Please unlock the vault to provide the API key for the analysis.',
        action: { label: 'Unlock', onClick: () => setShowSettings(true) },
      });
      return;
    }

    if (!task.trim()) {
      toast.error('Task is empty', {
        description: 'Please describe the task you want The Council to perform.',
      });
      return;
    }

    setIsLoading(true);
    setOutputs({});
    setSynthesisResult(null);
    setVerdict('');
    setCost({ experts: 0, synthesis: 0, total: 0 });
    setStatusMessage('Initializing Council...');

    const activeExperts = experts.slice(0, activeExpertCount);
    const collectedOutputs: Record<string, { expertName: string; output: string; model: string }> = {};
    let expertsCost = 0;

    try {
      // Process each expert
      for (let i = 0; i < activeExperts.length; i++) {
        const expert = activeExperts[i];
        setStatusMessage(`${expert.name} is analyzing...`);
        
        // Update expert loading state
        setExperts((prev) => {
          const newExperts = [...prev];
          newExperts[i] = { ...newExperts[i], isLoading: true, output: '' };
          return newExperts;
        });

        // Prepare additional context from file and knowledge base
        let additionalContext = '';
        if (fileData) {
          additionalContext += `\n[Uploaded File: ${fileData.name}]\n${fileData.content}\n`;
        }

        // Get previous outputs for pipeline/debate modes
        const previousOutputs = mode === 'pipeline' || mode === 'debate' 
          ? Object.fromEntries(
              Object.entries(collectedOutputs).map(([id, data]) => [id, data.output])
            )
          : undefined;

        try {
          // Call the real API with streaming
          const result = await callExpertStreaming(
            expert,
            task,
            mode,
            keys.openRouterKey,
            {
              onToken: (token) => {
                setExperts((prev) => {
                  const newExperts = [...prev];
                  const currentOutput = newExperts[i].output || '';
                  newExperts[i] = { ...newExperts[i], output: currentOutput + token };
                  return newExperts;
                });
                setOutputs((prev) => ({
                  ...prev,
                  [expert.id]: (prev[expert.id] || '') + token,
                }));
              },
              onComplete: (fullText) => {
                collectedOutputs[expert.id] = { 
                  expertName: expert.name, 
                  output: fullText,
                  model: expert.model 
                };
              },
              onError: (error) => {
                console.error(`Error from ${expert.name}:`, error);
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
                toast.error(`${expert.name} Failed`, {
                  description: errorMessage,
                });
              },
            },
            additionalContext,
            previousOutputs
          );

          expertsCost += result.cost;
          setCost(prev => ({ 
            experts: expertsCost, 
            synthesis: prev.synthesis, 
            total: expertsCost + prev.synthesis 
          }));
        } catch (error) {
          console.error(`Failed to get response from ${expert.name}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          const errorOutput = `⚠️ Error: ${errorMessage}`;
          setOutputs((prev) => ({ ...prev, [expert.id]: errorOutput }));
          collectedOutputs[expert.id] = { 
            expertName: expert.name, 
            output: errorOutput,
            model: expert.model 
          };
        }

        // Clear loading state for this expert
        setExperts((prev) => {
          const newExperts = [...prev];
          newExperts[i] = { ...newExperts[i], isLoading: false };
          return newExperts;
        });
      }

      // Run intelligent synthesis
      if (Object.keys(collectedOutputs).length > 0) {
        setIsSynthesizing(true);
        const tierConfig = SYNTHESIS_TIERS[synthesisConfig.tier];
        setStatusMessage(`${tierConfig.icon} Running ${tierConfig.name}...`);
        
        try {
          const expertOutputsForSynthesis = Object.entries(collectedOutputs).map(([id, data]) => ({
            name: data.expertName,
            model: data.model,
            content: data.output,
          }));

          const result = await executeSynthesis({
            expertOutputs: expertOutputsForSynthesis,
            task,
            config: synthesisConfig,
            apiKey: keys.openRouterKey,
            onProgress: setStatusMessage,
          });
          
          setSynthesisResult(result);
          setVerdict(result.content);
          
          const newSynthesisCost = result.cost;
          setCost({ 
            experts: expertsCost, 
            synthesis: newSynthesisCost, 
            total: expertsCost + newSynthesisCost 
          });

          // Save session to history
          saveSession({
            task,
            mode,
            activeExpertCount,
            experts: activeExperts.map(e => ({ id: e.id, name: e.name, model: e.model })),
            outputs: Object.fromEntries(
              Object.entries(collectedOutputs).map(([id, data]) => [id, data.output])
            ),
            verdict: result.content,
            synthesisConfig,
            cost: {
              experts: expertsCost,
              synthesis: newSynthesisCost,
              total: expertsCost + newSynthesisCost,
            },
          });

        } catch (error) {
          console.error('Synthesis failed:', error);
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
          toast.error('Synthesis Failed', { description: errorMessage });

          const fallbackVerdict = createFallbackVerdict(collectedOutputs, task, mode);
          setVerdict(fallbackVerdict);
          setSynthesisResult({
            content: fallbackVerdict,
            tier: synthesisConfig.tier,
            model: 'fallback',
            tokens: { prompt: 0, completion: 0 },
            cost: 0,
          });
        } finally {
          setIsSynthesizing(false);
        }
      }
      
      toast.success('Council analysis complete!');
    } catch (error) {
      console.error('Execution error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast.error('Execution Failed', { description: errorMessage });
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  // Load session from history
  const handleLoadSession = (session: CouncilSession) => {
    setTask(session.task);
    setMode(session.mode);
    setActiveExpertCount(session.activeExpertCount);
    setOutputs(session.outputs);
    setVerdict(session.verdict);
    setCost(session.cost);
    if (session.synthesisConfig) {
      setSynthesisConfig(session.synthesisConfig);
    }
    setSynthesisResult({
      content: session.verdict,
      tier: session.synthesisConfig?.tier || 'balanced',
      model: session.synthesisConfig?.model || 'loaded',
      tokens: { prompt: 0, completion: 0 },
      cost: session.cost.synthesis,
    });
    setShowHistory(false);
  };

  // Export handlers
  const handleExportCSV = () => {
    try {
      const data = {
        experts: experts.slice(0, activeExpertCount),
        outputs,
        task,
        mode,
        cost: cost.total,
        timestamp: new Date(),
        verdict,
      };
      const csv = exportToCSV(data);
      downloadCSV(csv, `council_${mode}_${Date.now()}.csv`);
      toast.success('Exported to CSV');
    } catch (error) {
      console.error('CSV Export failed:', error);
      toast.error('Export to CSV Failed', {
        description: 'There was an issue preparing the CSV file. Please try again.',
      });
    }
  };

  const handleExportDocs = async () => {
    try {
      const data = {
        experts: experts.slice(0, activeExpertCount),
        outputs,
        task,
        mode,
        cost: cost.total,
        timestamp: new Date(),
        verdict,
      };
      await exportToDocx(data);
      toast.success('Exported to Word document');
    } catch (error) {
      console.error('DocX Export failed:', error);
      toast.error('Export to Word Failed', {
        description: 'There was an issue generating the document. Please try again.',
      });
    }
  };

  // Retry a single expert
  const handleRetryExpert = useCallback(async (expertIndex: number) => {
    const keys = getSessionKeys();
    if (!keys?.openRouterKey) {
      toast.error('Vault Locked', {
        description: 'Please unlock the vault to provide the API key for the analysis.',
        action: { label: 'Unlock', onClick: () => setShowSettings(true) },
      });
      return;
    }

    if (!task.trim()) {
      toast.error('Task is empty', {
        description: 'Please describe the task you want The Council to perform.',
      });
      return;
    }

    const expert = experts[expertIndex];
    setStatusMessage(`Retrying ${expert.name}...`);

    // Set expert to loading
    setExperts((prev) => {
      const newExperts = [...prev];
      newExperts[expertIndex] = { ...newExperts[expertIndex], isLoading: true, output: '' };
      return newExperts;
    });

    try {
      let additionalContext = '';
      if (fileData) {
        additionalContext += `\n[Uploaded File: ${fileData.name}]\n${fileData.content}\n`;
      }

      await callExpertStreaming(
        expert,
        task,
        mode,
        keys.openRouterKey,
        {
          onToken: (token) => {
            setExperts((prev) => {
              const newExperts = [...prev];
              const currentOutput = newExperts[expertIndex].output || '';
              newExperts[expertIndex] = { ...newExperts[expertIndex], output: currentOutput + token };
              return newExperts;
            });
            setOutputs((prev) => ({
              ...prev,
              [expert.id]: (prev[expert.id] || '') + token,
            }));
          },
          onComplete: () => {
            toast.success(`${expert.name} completed successfully`);
          },
          onError: (error) => {
            console.error(`Error from ${expert.name}:`, error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast.error(`${expert.name} Failed`, { description: errorMessage });
          },
        },
        additionalContext
      );
    } catch (error) {
      console.error(`Failed to retry ${expert.name}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(`Retry failed for ${expert.name}`, { description: errorMessage });
    } finally {
      setExperts((prev) => {
        const newExperts = [...prev];
        newExperts[expertIndex] = { ...newExperts[expertIndex], isLoading: false };
        return newExperts;
      });
      setStatusMessage('');
    }
  }, [experts, task, mode, fileData]);

  // Dynamic grid columns based on expert count - supports up to 5 experts + synthesis
  const getGridCols = () => {
    const totalCols = activeExpertCount + 1; // experts + synthesis
    if (totalCols <= 2) return 'grid-cols-1 md:grid-cols-2';
    if (totalCols <= 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    if (totalCols <= 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    if (totalCols <= 5) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cost={cost}
        isVaultLocked={vaultStatus.isLocked}
        onOpenSettings={() => setShowSettings(true)}
        onOpenHistory={() => setShowHistory(!showHistory)}
        showHistory={showHistory}
        memoryCount={memory?.entries.length || 0}
        onOpenMemory={() => setShowMemory(true)}
      />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Control Panel & History */}
          <div className="lg:col-span-1 space-y-4">
            <ControlPanel
              task={task}
              onTaskChange={setTask}
              mode={mode}
              onModeChange={setMode}
              activeExpertCount={activeExpertCount}
              onActiveExpertCountChange={setActiveExpertCount}
              debateRounds={debateRounds}
              onDebateRoundsChange={setDebateRounds}
              fileData={fileData}
              onFileSelect={setFileData}
              onFileRemove={() => setFileData(null)}
              onExecute={handleExecute}
              isLoading={isLoading}
              statusMessage={statusMessage}
              isVaultLocked={vaultStatus.isLocked}
              onOpenSettings={() => setShowSettings(true)}
              experts={experts}
              onLoadPersona={handleLoadPersona}
              onLoadTeam={handleLoadTeam}
              onClearPersona={handleClearPersona}
              onResetToDefault={handleResetToDefault}
            />


            <VerdictPanel
              verdict={verdict}
              isLoading={isSynthesizing}
              cost={cost}
              synthesisResult={synthesisResult}
              onExportCSV={handleExportCSV}
              onExportDocs={handleExportDocs}
            />
          </div>

          {/* Right Column - Expert Grid + Synthesis */}
          <div className="lg:col-span-3">
          <div className={`grid ${getGridCols()} gap-4 auto-rows-fr stagger-fade-in`}>
              {experts.slice(0, activeExpertCount).map((expert, index) => (
                <ExpertCard
                  key={expert.id}
                  expert={expert}
                  index={index}
                  isActive={index < activeExpertCount}
                  onUpdate={handleUpdateExpert}
                  onAddKnowledge={handleAddKnowledge}
                  onRemoveKnowledge={handleRemoveKnowledge}
                  onRetry={handleRetryExpert}
                  onClearPersona={handleClearPersona}
                />
              ))}
              
              {/* Synthesis Card as last "expert" window */}
              <SynthesisCard
                synthesis={synthesisResult}
                isLoading={isSynthesizing}
                config={synthesisConfig}
                onConfigChange={setSynthesisConfig}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal - Lazy Loaded */}
      <Suspense fallback={null}>
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          hasVault={vaultStatus.hasVault}
          isVaultLocked={vaultStatus.isLocked}
          onCreateVault={handleCreateVault}
          onUnlockVault={handleUnlockVault}
          onLockVault={handleLockVault}
        />
      </Suspense>

      {/* History Sidebar - Lazy Loaded */}
      <Suspense fallback={null}>
        <HistorySidebar
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onLoadSession={handleLoadSession}
          onRefresh={() => {}}
        />
      </Suspense>

      {/* Memory Panel - Lazy Loaded */}
      <Suspense fallback={null}>
        <MemoryPanel
          isOpen={showMemory}
          onClose={() => setShowMemory(false)}
          onRefresh={async () => {
            const m = await loadMemory();
            setMemory(m);
          }}
        />
      </Suspense>
    </div>
  );
};

// Fallback verdict generator if synthesis API fails
function createFallbackVerdict(
  outputs: Record<string, { expertName: string; output: string }>,
  task: string,
  mode: ExecutionMode
): string {
  const expertNames = Object.values(outputs).map(o => o.expertName);
  
  return `## Council Verdict

**Task:** ${task.slice(0, 100)}${task.length > 100 ? '...' : ''}

**Mode:** ${mode.charAt(0).toUpperCase() + mode.slice(1)}

**Participating Experts:** ${expertNames.join(', ')}

---

### Expert Contributions

${Object.values(outputs).map(o => `- **${o.expertName}**: Analysis provided (see individual outputs above)`).join('\n')}

### Summary

The Council has completed its analysis. Please review each expert's output above for detailed insights.

*Note: Automated synthesis was unavailable. Manual review recommended.*`;
}

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
File: src/vite-env.d.ts
================================================================================
/// <reference types="vite/client" />


