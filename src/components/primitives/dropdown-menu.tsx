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

import { useFeatureConfigStore } from "@/features/council/store/feature-config-store";
import FeatureConfigModal from "@/features/council/components/FeatureConfigModal";
import { useNavigate } from "react-router-dom";

const ProjectFeaturesDropdown = () => {
  const navigate = useNavigate();
  const [showConfigDialog, setShowConfigDialog] = React.useState(false);
  
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
    redditSniper,
    redditPainPoints,
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
    updateRedditSniperConfig,
    updateRedditPainPointsConfig,
  } = useFeatureConfigStore();

  interface Feature {
    name: string;
    description: string;
    icon: string;
    enabled: boolean;
    category: string;
    configKey: string;
    toggleAction: () => void;
  }

  interface Feature {
    name: string;
    description: string;
    icon: string;
    enabled: boolean;
    category: string;
    configKey: string;
    toggleAction: () => void;
  }

  // Static feature list mapped to actual store configs
  const features: Feature[] = [
    // Intelligence Layer
    { 
      name: "Phantom Scout", 
      description: "GitHub intelligence gathering & Blue Ocean discovery",
      icon: "👻",
      enabled: scout.enabled,
      category: "intelligence",
      configKey: "scout",
      toggleAction: () => updateScoutConfig({ enabled: !scout.enabled })
    },
    { 
      name: "Self-Improving Loop", 
      description: "Learn patterns from successful repositories",
      icon: "🧠",
      enabled: selfImprove.enabled,
      category: "intelligence",
      configKey: "selfImprove",
      toggleAction: () => updateSelfImproveConfig({ enabled: !selfImprove.enabled })
    },
    { 
      name: "Stargazer Analysis", 
      description: "Detect institutional backing & quality signals",
      icon: "⭐",
      enabled: stargazerAnalysis.enabled,
      category: "intelligence",
      configKey: "stargazerAnalysis",
      toggleAction: () => updateStargazerAnalysisConfig({ enabled: !stargazerAnalysis.enabled })
    },
    { 
      name: "Reddit Sniper", 
      description: "Detect high-intent buying signals on Reddit in real-time",
      icon: "🎯",
      enabled: redditSniper.enabled,
      category: "intelligence",
      configKey: "redditSniper",
      toggleAction: () => updateRedditSniperConfig({ enabled: !redditSniper.enabled })
    },
    { 
      name: "Reddit Pain Points", 
      description: "Extract market gaps and frustrations from subreddits",
      icon: "💬",
      enabled: redditPainPoints.enabled,
      category: "intelligence",
      configKey: "redditPainPoints",
      toggleAction: () => updateRedditPainPointsConfig({ enabled: !redditPainPoints.enabled })
    },
    
    // Quality Layer
    { 
      name: "Code Mirror", 
      description: "Elite code quality analysis against standards",
      icon: "🪞",
      enabled: mirror.enabled,
      category: "quality",
      configKey: "mirror",
      toggleAction: () => updateMirrorConfig({ enabled: !mirror.enabled })
    },
    { 
      name: "Quality Pipeline", 
      description: "Automated linting, type checking & fixing",
      icon: "⚡",
      enabled: quality.enabled,
      category: "quality",
      configKey: "quality",
      toggleAction: () => updateQualityConfig({ enabled: !quality.enabled })
    },
    
    // Foundation Layer
    { 
      name: "Data Fetching & Cache", 
      description: "React Query with intelligent caching",
      icon: "📊",
      enabled: dataFetching.enabled,
      category: "foundation",
      configKey: "dataFetching",
      toggleAction: () => updateDataFetchingConfig({ enabled: !dataFetching.enabled })
    },
    { 
      name: "Type-Safe Forms", 
      description: "Zod validation for bulletproof forms",
      icon: "📝",
      enabled: typeSafeForms.enabled,
      category: "foundation",
      configKey: "typeSafeForms",
      toggleAction: () => updateTypeSafeFormsConfig({ enabled: !typeSafeForms.enabled })
    },
    { 
      name: "Error Handling", 
      description: "Retry logic & circuit breakers",
      icon: "🛡️",
      enabled: errorHandling.enabled,
      category: "foundation",
      configKey: "errorHandling",
      toggleAction: () => updateErrorHandlingConfig({ enabled: !errorHandling.enabled })
    },
    { 
      name: "Auth & Security", 
      description: "Encrypted vault & session management",
      icon: "🔐",
      enabled: authSecurity.enabled,
      category: "foundation",
      configKey: "authSecurity",
      toggleAction: () => updateAuthSecurityConfig({ enabled: !authSecurity.enabled })
    },
    { 
      name: "Local Database", 
      description: "IndexedDB with Dexie for offline-first storage",
      icon: "💾",
      enabled: localDatabase.enabled,
      category: "foundation",
      configKey: "localDatabase",
      toggleAction: () => updateLocalDatabaseConfig({ enabled: !localDatabase.enabled })
    },
    
    // UI/UX Layer
    { 
      name: "Mobile Drawers", 
      description: "Touch-optimized slide-out panels with gestures",
      icon: "📱",
      enabled: mobileDrawers.enabled,
      category: "ux",
      configKey: "mobileDrawers",
      toggleAction: () => updateMobileDrawersConfig({ enabled: !mobileDrawers.enabled })
    },
    { 
      name: "Virtualized Lists", 
      description: "Render only visible items for performance",
      icon: "📜",
      enabled: virtualizedLists.enabled,
      category: "ux",
      configKey: "virtualizedLists",
      toggleAction: () => updateVirtualizedListsConfig({ enabled: !virtualizedLists.enabled })
    },
    { 
      name: "Streaming AI", 
      description: "Real-time typewriter effect for AI responses",
      icon: "✨",
      enabled: streamingAI.enabled,
      category: "ux",
      configKey: "streamingAI",
      toggleAction: () => updateStreamingAIConfig({ enabled: !streamingAI.enabled })
    },
    
    // AI Layer
    { 
      name: "Agent Orchestration", 
      description: "Multi-expert AI coordination system",
      icon: "🤖",
      enabled: agentOrchestration.enabled,
      category: "ai",
      configKey: "agentOrchestration",
      toggleAction: () => updateAgentOrchestrationConfig({ enabled: !agentOrchestration.enabled })
    },
  ];

  const intelligenceFeatures = features.filter(f => f.category === "intelligence");
  const qualityFeatures = features.filter(f => f.category === "quality");
  const foundationFeatures = features.filter(f => f.category === "foundation");
  const uxFeatures = features.filter(f => f.category === "ux");
  const aiFeatures = features.filter(f => f.category === "ai");

  const activeCount = features.filter(f => f.enabled).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
        <span>⚙️</span>
        <span>Features</span>
        <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
          {activeCount}/{features.length}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[420px] max-h-[600px] overflow-y-auto">
        <div className="sticky top-0 bg-popover z-10 border-b pb-2">
          <DropdownMenuLabel className="text-base font-semibold flex items-center justify-between py-3">
            <span>🎯 Feature Control Panel</span>
            <span className="text-xs text-muted-foreground font-normal">
              {activeCount} Active
            </span>
          </DropdownMenuLabel>
        </div>
        
        
        {/* Intelligence Layer */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-3 pt-3">
          🧠 Intelligence Layer
        </DropdownMenuLabel>
        {intelligenceFeatures.map((feature) => (
          <div
            key={feature.name}
            className="flex items-start gap-3 px-3 py-3 hover:bg-accent/50 transition-colors cursor-pointer border-b border-border/50 last:border-0"
            onClick={(e) => {
              e.stopPropagation();
              feature.toggleAction();
            }}
          >
            <span className="text-xl mt-0.5">{feature.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{feature.name}</span>
                <div 
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    feature.enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    feature.toggleAction();
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-background shadow-lg transition-transform ${
                      feature.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Quality Layer */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-3 pt-3">
          ⚡ Quality Layer
        </DropdownMenuLabel>
        {qualityFeatures.map((feature) => (
          <div
            key={feature.name}
            className="flex items-start gap-3 px-3 py-3 hover:bg-accent/50 transition-colors cursor-pointer border-b border-border/50 last:border-0"
            onClick={(e) => {
              e.stopPropagation();
              feature.toggleAction();
            }}
          >
            <span className="text-xl mt-0.5">{feature.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{feature.name}</span>
                <div 
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    feature.enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    feature.toggleAction();
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-background shadow-lg transition-transform ${
                      feature.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Foundation Layer */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-3 pt-3">
          🏗️ Foundation Layer
        </DropdownMenuLabel>
        {foundationFeatures.map((feature) => (
          <div
            key={feature.name}
            className="flex items-start gap-3 px-3 py-3 hover:bg-accent/50 transition-colors cursor-pointer border-b border-border/50 last:border-0"
            onClick={(e) => {
              e.stopPropagation();
              feature.toggleAction();
            }}
          >
            <span className="text-xl mt-0.5">{feature.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{feature.name}</span>
                <div 
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    feature.enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    feature.toggleAction();
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-background shadow-lg transition-transform ${
                      feature.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* UX Layer */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-3 pt-3">
          🎨 UI/UX Layer
        </DropdownMenuLabel>
        {uxFeatures.map((feature) => (
          <div
            key={feature.name}
            className="flex items-start gap-3 px-3 py-3 hover:bg-accent/50 transition-colors cursor-pointer border-b border-border/50 last:border-0"
            onClick={(e) => {
              e.stopPropagation();
              feature.toggleAction();
            }}
          >
            <span className="text-xl mt-0.5">{feature.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{feature.name}</span>
                <div 
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    feature.enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    feature.toggleAction();
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-background shadow-lg transition-transform ${
                      feature.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
        
        {/* AI Layer */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-3 pt-3">
          🤖 AI Layer
        </DropdownMenuLabel>
        {aiFeatures.map((feature) => (
          <div
            key={feature.name}
            className="flex items-start gap-3 px-3 py-3 hover:bg-accent/50 transition-colors cursor-pointer border-b border-border/50 last:border-0"
            onClick={(e) => {
              e.stopPropagation();
              feature.toggleAction();
            }}
          >
            <span className="text-xl mt-0.5">{feature.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{feature.name}</span>
                <div 
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    feature.enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    feature.toggleAction();
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-background shadow-lg transition-transform ${
                      feature.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
        
        <div className="sticky bottom-0 bg-popover border-t mt-2 p-3 space-y-2">
          <div className="text-xs text-center text-muted-foreground">
            💡 Toggle features on/off · Changes saved instantly
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                navigate('/features');
              }}
              className="text-xs py-2 px-3 rounded-md bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground font-medium transition-colors"
            >
              🎯 Features Dashboard
            </button>
            <button
              onClick={() => setShowConfigDialog(true)}
              className="text-xs py-2 px-3 rounded-md bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
            >
              ⚙️ Advanced Config
            </button>
          </div>
        </div>
      </DropdownMenuContent>
      
      <FeatureConfigModal 
        isOpen={showConfigDialog} 
        onClose={() => setShowConfigDialog(false)} 
      />
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
