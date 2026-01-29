# Migration Examples

## Example 1: Index.tsx (Main Page)

### Before
```typescript
import React, { Suspense, lazy } from "react";
import { Header } from "@/features/council/components/Header";
import { ControlPanel } from "@/features/council/components/ControlPanel";
import { ExpertCard } from "@/features/council/components/ExpertCard";
import { VerdictPanel } from "@/features/council/components/VerdictPanel";
import { SynthesisCard } from "@/features/council/components/SynthesisCard";
import { useControlPanelStore } from "@/features/council/store/control-panel-store";
import { useExpertStore } from "@/features/council/store/expert-store";
import { useSettingsStore } from "@/features/settings/store/settings-store";

const Index: React.FC = () => {
  const activeExpertCount = useControlPanelStore(state => state.activeExpertCount);
  const experts = useExpertStore(state => state.experts);
  const showSettings = useSettingsStore(state => state.showSettings);
  const setShowSettings = useSettingsStore(state => state.setShowSettings);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <ControlPanel />
        {/* ... */}
      </main>
    </div>
  );
};
```

### After (New Unified Store)
```typescript
import React, { Suspense, lazy } from "react";
import { Header } from "@/features/council/components/Header";
import { ControlPanel } from "@/features/council/components/ControlPanel";
import { ExpertCard } from "@/features/council/components/ExpertCard";
import { VerdictPanel } from "@/features/council/components/VerdictPanel";
import { SynthesisCard } from "@/features/council/components/SynthesisCard";
import { useCouncilStore } from "@/stores/council.store";
import { useUIStore } from "@/stores/ui.store";

const Index: React.FC = () => {
  // Single unified store for council state
  const { activeExpertCount, experts } = useCouncilStore((state) => ({
    activeExpertCount: state.activeExpertCount,
    experts: state.experts,
  }));
  
  // Separate UI state store
  const { showSettings, setShowSettings } = useUIStore((state) => ({
    showSettings: state.showSettings,
    setShowSettings: state.setShowSettings,
  }));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <ControlPanel />
        {/* ... */}
      </main>
    </div>
  );
};
```

### Alternative (Using Selector Hooks)
```typescript
import React, { Suspense, lazy } from "react";
import { Header } from "@/features/council/components/Header";
import { ControlPanel } from "@/features/council/components/ControlPanel";
import { useCouncilControl, useCouncilExperts } from "@/stores/council.store";
import { useUIStore } from "@/stores/ui.store";

const Index: React.FC = () => {
  // Use dedicated selector hooks
  const { activeExpertCount } = useCouncilControl();
  const experts = useCouncilExperts();
  const { showSettings, setShowSettings } = useUIStore((state) => ({
    showSettings: state.showSettings,
    setShowSettings: state.setShowSettings,
  }));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <ControlPanel />
        {/* ... */}
      </main>
    </div>
  );
};
```

## Example 2: ControlPanel.tsx

### Before
```typescript
import { useControlPanelStore } from '@/features/council/store/control-panel-store';
import { useExecutionStore } from '@/features/council/store/execution-store';
import { useExpertStore } from '@/features/council/store/expert-store';

export const ControlPanel: React.FC = () => {
  const task = useControlPanelStore((state) => state.task);
  const setTask = useControlPanelStore((state) => state.setTask);
  const mode = useControlPanelStore((state) => state.mode);
  const setMode = useControlPanelStore((state) => state.setMode);
  const executeCouncil = useExecutionStore((state) => state.executeCouncil);
  const isLoading = useExecutionStore((state) => state.isLoading);
  const experts = useExpertStore((state) => state.experts);
  
  const handleExecute = () => {
    executeCouncil(synthesisMutation);
  };
  
  return (
    <Card>
      <Input value={task} onChange={(e) => setTask(e.target.value)} />
      <Button onClick={handleExecute} disabled={isLoading}>
        Execute
      </Button>
    </Card>
  );
};
```

### After
```typescript
import { useCouncilStore } from '@/stores/council.store';

export const ControlPanel: React.FC = () => {
  // Single store, all council state
  const { 
    task, 
    setTask, 
    mode, 
    setMode, 
    executeCouncil, 
    isLoading,
    experts 
  } = useCouncilStore((state) => ({
    task: state.task,
    setTask: state.setTask,
    mode: state.mode,
    setMode: state.setMode,
    executeCouncil: state.executeCouncil,
    isLoading: state.isLoading,
    experts: state.experts,
  }));
  
  const handleExecute = () => {
    executeCouncil(synthesisMutation);
  };
  
  return (
    <Card>
      <Input value={task} onChange={(e) => setTask(e.target.value)} />
      <Button onClick={handleExecute} disabled={isLoading}>
        Execute
      </Button>
    </Card>
  );
};
```

## Example 3: DashboardLayout.tsx

### Before
```typescript
import { useDashboardStore } from '@/features/dashboard/store/dashboard-store';

export const DashboardLayout: React.FC = () => {
  const { metrics, clearAllData } = useDashboardStore();
  
  const handleClear = async () => {
    try {
      await clearAllData();
      toast.success('Analytics data cleared');
    } catch (error) {
      toast.error('Failed to clear data');
    }
  };
  
  return (
    <div>
      <h1>Analytics</h1>
      <p>Total Decisions: {metrics.totalDecisions}</p>
      <Button onClick={handleClear}>Clear Data</Button>
    </div>
  );
};
```

### After
```typescript
import { useAnalyticsStore } from '@/stores/analytics.store';

export const DashboardLayout: React.FC = () => {
  const { metrics, clearAllData } = useAnalyticsStore();
  
  const handleClear = async () => {
    try {
      await clearAllData();
      toast.success('Analytics data cleared');
    } catch (error) {
      toast.error('Failed to clear data');
    }
  };
  
  return (
    <div>
      <h1>Analytics</h1>
      <p>Total Decisions: {metrics.totalDecisions}</p>
      <Button onClick={handleClear}>Clear Data</Button>
    </div>
  );
};
```

## Example 4: Using Service Layer

### Before (Business Logic in Component)
```typescript
import { useExpertStore } from '@/features/council/store/expert-store';
import { callExpert } from '@/features/council/api/ai-client';

export const CustomExecutor: React.FC = () => {
  const experts = useExpertStore((state) => state.experts);
  const updateExpert = useExpertStore((state) => state.updateExpert);
  
  const executeCustomLogic = async () => {
    // Complex business logic directly in component
    for (let i = 0; i < experts.length; i++) {
      const expert = experts[i];
      updateExpert(i, { isLoading: true });
      
      try {
        const result = await callExpert(expert, task, mode, apiKey);
        updateExpert(i, { 
          output: result.output, 
          isLoading: false 
        });
      } catch (error) {
        updateExpert(i, { 
          output: 'Failed', 
          isLoading: false 
        });
      }
    }
  };
  
  return <Button onClick={executeCustomLogic}>Execute</Button>;
};
```

### After (Service Layer)
```typescript
import { useCouncilStore } from '@/stores/council.store';
import * as councilService from '@/services/council.service';

export const CustomExecutor: React.FC = () => {
  const { experts, updateExpert, task, mode } = useCouncilStore((state) => ({
    experts: state.experts,
    updateExpert: state.updateExpert,
    task: state.task,
    mode: state.mode,
  }));
  
  const executeCustomLogic = async () => {
    // Business logic extracted to service layer
    const result = await councilService.executeCouncilExperts(
      {
        task,
        mode,
        activeExperts: experts,
        apiKey: '', // Get from settings
        synthesisConfig: {}, // Get from settings
      },
      (index, update) => {
        updateExpert(index, update);
      },
      (message) => {
        console.log('Status:', message);
      }
    );
  };
  
  return <Button onClick={executeCustomLogic}>Execute</Button>;
};
```

## Example 5: Settings Modal

### Before
```typescript
import { useSettingsStore } from '@/features/settings/store/settings-store';

export const SettingsModal: React.FC = () => {
  const showSettings = useSettingsStore((state) => state.showSettings);
  const setShowSettings = useSettingsStore((state) => state.setShowSettings);
  const openRouterKey = useSettingsStore((state) => state.openRouterKey);
  const setOpenRouterKey = useSettingsStore((state) => state.setOpenRouterKey);
  
  return (
    <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <Input value={openRouterKey} onChange={(e) => setOpenRouterKey(e.target.value)} />
    </Dialog>
  );
};
```

### After
```typescript
import { useUIStore } from '@/stores/ui.store';
import { useSettingsStore } from '@/features/settings/store/settings-store';

export const SettingsModal: React.FC = () => {
  // UI state from UI store
  const { showSettings, setShowSettings } = useUIStore();
  
  // Settings data from settings store
  const { openRouterKey, setOpenRouterKey } = useSettingsStore();
  
  return (
    <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <Input value={openRouterKey} onChange={(e) => setOpenRouterKey(e.target.value)} />
    </Dialog>
  );
};
```

## Key Patterns

### Pattern 1: Combine Related State

**Before:**
```typescript
const task = useControlPanelStore((state) => state.task);
const mode = useControlPanelStore((state) => state.mode);
const count = useControlPanelStore((state) => state.activeExpertCount);
```

**After:**
```typescript
const { task, mode, count } = useCouncilStore((state) => ({
  task: state.task,
  mode: state.mode,
  count: state.activeExpertCount,
}));
```

### Pattern 2: Use Selector Hooks

**Before:**
```typescript
const experts = useExpertStore((state) => state.experts);
const setExperts = useExpertStore((state) => state.setExperts);
```

**After:**
```typescript
import { useCouncilExperts } from '@/stores/council.store';

const experts = useCouncilExperts();
// Or for more control:
const { experts, setExperts } = useCouncilStore((state) => ({
  experts: state.experts,
  setExperts: state.setExperts,
}));
```

### Pattern 3: Extract Complex Logic

**Before:**
```typescript
function MyComponent() {
  const doComplexThing = async () => {
    // 50 lines of business logic
  };
}
```

**After:**
```typescript
// services/myFeature.service.ts
export async function doComplexThing(params) {
  // 50 lines of business logic
}

// MyComponent.tsx
import * as myFeatureService from '@/services/myFeature.service';

function MyComponent() {
  const doComplexThing = () => myFeatureService.doComplexThing(params);
}
```

## Migration Checklist Per Component

- [ ] Identify all store imports
- [ ] Replace with unified store imports
- [ ] Update selectors to new state structure
- [ ] Test component functionality
- [ ] Check for deprecation warnings
- [ ] Extract business logic to service layer (if applicable)
- [ ] Update component tests
- [ ] Commit changes

## Tips

1. **Start with leaf components** - Components that don't have many children
2. **Test incrementally** - Don't migrate too many at once
3. **Use TypeScript** - Let the compiler guide you
4. **Check console warnings** - Deprecation warnings will tell you what needs updating
5. **Look at other migrated components** - Use them as reference
