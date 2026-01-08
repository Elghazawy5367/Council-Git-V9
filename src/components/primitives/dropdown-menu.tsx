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
  // Static feature list - no dynamic imports needed
  const features = [
    { 
      name: "Phantom Scout", 
      description: "24/7 automated GitHub intelligence gathering",
      icon: "👻",
      enabled: true,
      category: "intelligence"
    },
    { 
      name: "Code Mirror", 
      description: "Elite code quality analysis and standards",
      icon: "🪞",
      enabled: true,
      category: "quality"
    },
    { 
      name: "Quality Pipeline", 
      description: "Automated linting and type checking",
      icon: "⚡",
      enabled: true,
      category: "quality"
    },
    { 
      name: "Self-Improving Loop", 
      description: "Learn from successful GitHub repositories",
      icon: "🧠",
      enabled: true,
      category: "intelligence"
    },
    { 
      name: "Stargazer Analysis", 
      description: "Detect institutional backing & quality signals",
      icon: "⭐",
      enabled: true,
      category: "intelligence"
    },
    { 
      name: "Data Fetching & Cache", 
      description: "React Query with intelligent caching",
      icon: "📊",
      enabled: true,
      category: "foundation"
    },
    { 
      name: "Type-Safe Forms", 
      description: "Zod validation for bulletproof forms",
      icon: "📝",
      enabled: true,
      category: "foundation"
    },
    { 
      name: "Error Handling", 
      description: "Retry logic & circuit breakers",
      icon: "🛡️",
      enabled: true,
      category: "foundation"
    },
    { 
      name: "Auth & Security", 
      description: "Encrypted vault & session management",
      icon: "🔐",
      enabled: true,
      category: "foundation"
    },
    { 
      name: "Agent Orchestration", 
      description: "Multi-expert AI coordination system",
      icon: "🤖",
      enabled: true,
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
