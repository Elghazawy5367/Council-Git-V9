# State Management Refactoring Guide

## Overview

The Council application has been refactored to use a unified store architecture with a clear service layer for business logic. This guide helps you understand and migrate to the new architecture.

## Architecture Changes

### Before (Fragmented Stores)
```
src/features/council/store/
├── expert-store.ts         ❌ Expert management
├── execution-store.ts      ❌ Execution state
├── control-panel-store.ts  ❌ UI controls
├── memory-store.ts         ❌ Council memory
└── feature-config-store.ts ❌ Feature configs

src/features/dashboard/store/
└── dashboard-store.ts      ❌ Analytics

src/features/settings/store/
└── settings-store.ts       ❌ Settings + UI state
```

**Problems:**
- 9 separate stores with overlapping concerns
- Circular dependencies between stores
- Business logic scattered in stores and components
- No clear separation of concerns
- 87 components directly coupled to store internals

### After (Unified Architecture)

```
src/stores/
├── council.store.ts        ✅ Unified council state
├── analytics.store.ts      ✅ Dashboard analytics
├── ui.store.ts            ✅ Global UI state
└── settings.store.ts      ✅ Settings only

src/services/
├── council.service.ts     ✅ Business logic
├── intelligence.service.ts ✅ AI operations
└── vault.service.ts       ✅ Vault operations
```

**Benefits:**
- Single source of truth for each domain
- Clear separation of state and logic
- No circular dependencies
- Easier testing and maintenance
- Better type safety

## Migration Guide

### Current Status: Backward Compatible ✅

**All existing code continues to work!** The old store imports are now compatibility wrappers that proxy to the new unified stores.

```typescript
// This still works (backward compatible)
import { useExpertStore } from '@/features/council/store/expert-store';

// But will show deprecation warning in console:
// [DEPRECATED] useExpertStore is deprecated. Please migrate to useCouncilStore.
```

### Migrating Components

#### Option 1: Gradual Migration (Recommended)

Migrate high-impact components first, then gradually update others.

**Before:**
```typescript
import { useExpertStore } from '@/features/council/store/expert-store';
import { useControlPanelStore } from '@/features/council/store/control-panel-store';
import { useExecutionStore } from '@/features/council/store/execution-store';

function MyComponent() {
  const experts = useExpertStore((state) => state.experts);
  const task = useControlPanelStore((state) => state.task);
  const isLoading = useExecutionStore((state) => state.isLoading);
  
  // ...
}
```

**After:**
```typescript
import { useCouncilStore } from '@/stores/council.store';

function MyComponent() {
  const { experts, task, isLoading } = useCouncilStore((state) => ({
    experts: state.experts,
    task: state.task,
    isLoading: state.isLoading,
  }));
  
  // ...
}
```

#### Option 2: Use Selector Hooks

For even cleaner code, use the provided selector hooks:

```typescript
import { useCouncilExperts, useCouncilControl, useCouncilExecution } from '@/stores/council.store';

function MyComponent() {
  const experts = useCouncilExperts();
  const { task, setTask } = useCouncilControl();
  const { isLoading, executeCouncil } = useCouncilExecution();
  
  // ...
}
```

### Store Migration Reference

#### Council Operations

**Old Way:**
```typescript
import { useExpertStore } from '@/features/council/store/expert-store';
import { useExecutionStore } from '@/features/council/store/execution-store';
import { useControlPanelStore } from '@/features/council/store/control-panel-store';
```

**New Way:**
```typescript
import { useCouncilStore } from '@/stores/council.store';
// OR use selector hooks:
import { 
  useCouncilExperts, 
  useCouncilExecution, 
  useCouncilControl 
} from '@/stores/council.store';
```

#### Dashboard Analytics

**Old Way:**
```typescript
import { useDashboardStore } from '@/features/dashboard/store/dashboard-store';
```

**New Way:**
```typescript
import { useAnalyticsStore } from '@/stores/analytics.store';
```

#### UI State (Settings Modal, Sidebars, etc.)

**Old Way:**
```typescript
import { useSettingsStore } from '@/features/settings/store/settings-store';

const showSettings = useSettingsStore((state) => state.showSettings);
const setShowSettings = useSettingsStore((state) => state.setShowSettings);
```

**New Way:**
```typescript
import { useUIStore } from '@/stores/ui.store';

const showSettings = useUIStore((state) => state.showSettings);
const setShowSettings = useUIStore((state) => state.setShowSettings);
```

## Service Layer Usage

### Business Logic Should Use Services

**Before (Logic in Component):**
```typescript
function MyComponent() {
  const executeCouncil = async () => {
    // Complex business logic here
    for (const expert of experts) {
      const result = await callExpert(expert, ...);
      // More complex logic
    }
  };
}
```

**After (Service Layer):**
```typescript
import * as councilService from '@/services/council.service';

function MyComponent() {
  const executeCouncil = async () => {
    const result = await councilService.executeCouncilExperts(
      context,
      onExpertUpdate,
      onStatusUpdate
    );
  };
}
```

### Available Services

#### Council Service

```typescript
import * as councilService from '@/services/council.service';

// Execute single expert
await councilService.executeExpert(expert, task, mode, apiKey, callbacks);

// Execute all experts
await councilService.executeCouncilExperts(context, onExpertUpdate, onStatusUpdate);

// Save session
councilService.saveExecutionSession(task, mode, experts, ...);

// Calculate costs
const cost = councilService.calculateTotalCost(expertsCost, synthesisCost);
```

## Best Practices

### 1. Use Selectors for Performance

**Good:**
```typescript
// Only re-renders when experts change
const experts = useCouncilStore((state) => state.experts);
```

**Bad:**
```typescript
// Re-renders on any state change
const state = useCouncilStore();
const experts = state.experts;
```

### 2. Combine Related Selectors

**Good:**
```typescript
const { experts, task, mode } = useCouncilStore((state) => ({
  experts: state.experts,
  task: state.task,
  mode: state.mode,
}));
```

**Bad:**
```typescript
const experts = useCouncilStore((state) => state.experts);
const task = useCouncilStore((state) => state.task);
const mode = useCouncilStore((state) => state.mode);
```

### 3. Business Logic Goes in Services

**Good:**
```typescript
// services/myFeature.service.ts
export async function complexOperation(params) {
  // Complex logic here
  return result;
}

// Component
import * as myFeatureService from '@/services/myFeature.service';
const result = await myFeatureService.complexOperation(params);
```

**Bad:**
```typescript
// Component with complex logic
function MyComponent() {
  const doSomething = async () => {
    // 50 lines of complex business logic
  };
}
```

### 4. Keep Stores Focused

Each store should have a single, clear responsibility:

- **CouncilStore:** Council execution state
- **AnalyticsStore:** Analytics and metrics
- **UIStore:** UI state (modals, sidebars)
- **SettingsStore:** User settings and preferences

## Testing

### Testing Components with New Stores

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCouncilStore } from '@/stores/council.store';

describe('MyComponent', () => {
  it('should update experts', () => {
    const { result } = renderHook(() => useCouncilStore());
    
    act(() => {
      result.current.setExperts([...newExperts]);
    });
    
    expect(result.current.experts).toEqual(newExperts);
  });
});
```

### Testing Services

```typescript
import * as councilService from '@/services/council.service';

describe('councilService', () => {
  it('should calculate total cost', () => {
    const cost = councilService.calculateTotalCost(10, 5);
    expect(cost).toEqual({ experts: 10, synthesis: 5, total: 15 });
  });
});
```

## Migration Checklist

When migrating a component:

- [ ] Replace old store imports with new unified store
- [ ] Update selectors to use new state structure
- [ ] Extract complex business logic to service layer
- [ ] Test the component thoroughly
- [ ] Remove deprecation warnings from console
- [ ] Update any related tests

## Timeline

### Phase 1: Foundation (Complete ✅)
- Unified stores created
- Service layer established
- Backward compatibility layer

### Phase 2: Service Extraction (In Progress)
- Extract remaining business logic
- Create additional service files

### Phase 3: Component Migration
- Migrate high-impact components
- Update documentation
- Remove deprecation warnings

### Phase 4: Cleanup
- Remove old store files
- Remove compatibility layer
- Final testing

## Support

If you encounter issues during migration:

1. Check deprecation warnings in console
2. Review this guide
3. Look at migrated components as examples
4. TypeScript errors will guide you to fixes

## FAQ

### Q: Do I need to migrate immediately?

**A:** No! Backward compatibility is maintained. Migrate gradually when updating related code.

### Q: Will my components break?

**A:** No! The compatibility layer ensures existing code continues to work.

### Q: Why was this refactoring needed?

**A:** The previous architecture had:
- 9 stores with overlapping concerns
- Circular dependencies
- Business logic mixed with state
- Hard to test and maintain

The new architecture provides:
- Clear separation of concerns
- Better type safety
- Easier testing
- No circular dependencies

### Q: How do I know which store to use?

**A:** Follow the domain:
- Council execution → `useCouncilStore`
- Analytics/metrics → `useAnalyticsStore`
- UI state → `useUIStore`
- Settings → `useSettingsStore`

### Q: Can I still use the old imports?

**A:** Yes, but you'll see deprecation warnings. Plan to migrate when convenient.

## Example Migrations

See `docs/MIGRATION_EXAMPLES.md` for complete before/after examples of migrated components.
