# Council Experts Section Fix - Complete Documentation

## Executive Summary

**Issue:** Council experts section was completely non-functional. No expert cards were visible, and tasks could not be executed.

**Root Cause:** Experts array initialized as empty `[]` instead of being populated with `DEFAULT_EXPERTS` on app load.

**Status:** ✅ **FIXED**

---

## Problem Details

### Symptoms
- ❌ No expert cards visible on main Council page
- ❌ Empty state message shown instead: "No experts available"
- ❌ "Run Council" button disabled or non-functional
- ❌ Cannot execute any tasks
- ❌ Dashboard shows but no experts in grid

### User Impact
- **Severity:** CRITICAL - Core feature completely broken
- **Affected Users:** ALL users
- **Workaround:** None (feature unusable)

---

## Root Cause Analysis

### The Bug

**Location:** `src/stores/council.store.ts:66`

```typescript
// ❌ BEFORE (BROKEN)
export const useCouncilStore = create<CouncilState>((set, get) => ({
  experts: [], // Empty array - no experts initialized!
  // ...
}));
```

### Why It Failed

1. **Empty Initialization:** Experts array started empty and was never populated
2. **No Auto-Init:** No initialization code in `main.tsx` or `Index.tsx`
3. **Manual Reset Only:** `resetToDefault()` existed but wasn't called automatically
4. **Rendering Logic:** `Index.tsx:65-66` checks `experts.length === 0` and shows empty state

### Execution Flow (Before Fix)

```
App Load
  ↓
council.store.ts initializes
  ↓
experts: [] (empty)
  ↓
Index.tsx renders
  ↓
experts.length === 0
  ↓
NoExpertsEmptyState shown ❌
  ↓
No expert cards rendered
  ↓
Tasks cannot execute
```

---

## The Fix

### Changes Made

#### 1. Initialize Experts Array
**File:** `src/stores/council.store.ts:66`

```typescript
// ✅ AFTER (FIXED)
export const useCouncilStore = create<CouncilState>((set, get) => ({
  experts: [...DEFAULT_EXPERTS], // Initialize with default experts
  // ...
}));
```

#### 2. Fix Active Expert Count
**File:** `src/stores/council.store.ts:478`

```typescript
// ❌ BEFORE
activeExpertCount: 5, // Allowed 5 but only 3 experts exist

// ✅ AFTER
activeExpertCount: 3, // Match DEFAULT_EXPERTS length
```

#### 3. Update Control Panel Slider
**File:** `src/features/council/components/ControlPanel.tsx:182,189`

```typescript
// ❌ BEFORE
<Slider max={5} ... />
<span>5</span>

// ✅ AFTER  
<Slider max={3} ... />
<span>3</span>
```

#### 4. Fix Reset Function
**File:** `src/stores/council.store.ts:554`

```typescript
// ✅ FIXED
resetToDefault: () => {
  set({ 
    experts: [...DEFAULT_EXPERTS], 
    activeExpertCount: 3,  // Was 5
    mode: 'parallel'        // Was 'synthesis'
  });
}
```

---

## DEFAULT_EXPERTS Configuration

**Location:** `src/lib/config.ts:193-346`

**Currently Defined:** 3 experts

1. **The Logician** (`exp_1`)
   - Model: `deepseek/deepseek-chat`
   - Specialty: Formal logic, deductive reasoning
   - Icon: Brain
   - Color: Blue to Cyan gradient

2. **The Architect** (`exp_2`)
   - Model: `qwen/qwen-2.5-72b-instruct`
   - Specialty: Systems design, technical feasibility
   - Icon: Cpu
   - Color: Emerald to Teal gradient

3. **The Strategist** (`exp_3`)
   - Model: `cohere/command-r7b-12-2024`
   - Specialty: Competitive strategy, market positioning
   - Icon: Chess (Target in UI)
   - Color: Red to Orange gradient

---

## Verification Steps

### How to Test the Fix

1. **Start the Application**
   ```bash
   npm run dev
   ```

2. **Check Expert Cards Render**
   - Navigate to main Council page
   - Should see 3 expert cards immediately
   - No empty state message

3. **Verify Expert Details**
   - Each card should show:
     - Expert name and specialty
     - Model selection dropdown
     - Configuration sliders
     - Knowledge base upload
     - Output area (when task runs)

4. **Test Slider Range**
   - Adjust "Active Experts" slider
   - Should range from 1 to 3
   - Each expert card should activate/deactivate correctly

5. **Test Task Execution**
   - Enter a task/question
   - Click "Run Council (Phase 1)"
   - Experts should start analyzing
   - Loading indicators should appear
   - Output should populate in cards

6. **Test Phase 2**
   - After Phase 1 completes
   - Select a judge mode
   - Click "Run Judge (Phase 2)"
   - Synthesis should execute

---

## Technical Architecture

### Expert Rendering Flow

```
useCouncilStore
  ↓
experts: [...DEFAULT_EXPERTS]
  ↓
Index.tsx
  ↓
experts.slice(0, activeExpertCount)
  ↓
experts.map((expert, index) => <ExpertCard key={expert.id} index={index} />)
  ↓
ExpertCard receives expert via useExpertStore(state => state.experts[index])
  ↓
Renders expert UI with all properties
```

### Two-Phase Execution Architecture

**Phase 1: Expert Analysis** (Parallel)
```
User clicks "Run Council"
  ↓
executePhase1() called
  ↓
councilService.executeCouncilExperts()
  ↓
Promise.allSettled(experts.map(expert => executeExpert()))
  ↓
All experts analyze in parallel
  ↓
Outputs collected
  ↓
executionPhase: 'phase1-complete'
```

**Phase 2: Judge Synthesis**
```
User selects judge mode
  ↓
User clicks "Run Judge"
  ↓
executePhase2(synthesisMutation) called
  ↓
Judge model synthesizes expert outputs
  ↓
Final verdict generated
  ↓
executionPhase: 'complete'
```

---

## Related Components

### Key Files

1. **State Management**
   - `src/stores/council.store.ts` - Unified council state
   - `src/features/council/store/expert-store.ts` - Deprecated, proxies to council.store

2. **UI Components**
   - `src/pages/Index.tsx` - Main layout and expert grid
   - `src/features/council/components/ExpertCard.tsx` - Individual expert card
   - `src/features/council/components/ControlPanel.tsx` - Control panel with sliders
   - `src/features/council/components/VerdictPanel.tsx` - Shows synthesis results

3. **Service Layer**
   - `src/services/council.service.ts` - Execution logic
   - `src/features/council/api/ai-client.ts` - OpenRouter API calls

4. **Configuration**
   - `src/lib/config.ts` - DEFAULT_EXPERTS, models, modes
   - `src/features/council/lib/persona-library.ts` - Persona templates

---

## Future Improvements

### Recommendations

1. **Add More Experts**
   - Currently only 3 experts defined
   - Could add 2 more to reach the original 5:
     - The Critic (adversarial perspective)
     - The Empath (user psychology)

2. **Dynamic Expert Loading**
   - Allow users to add/remove experts
   - Persist custom experts to IndexedDB
   - Import/export expert configurations

3. **Expert Templates**
   - Pre-configured expert sets for different tasks
   - Industry-specific expert teams
   - Domain expert specializations

4. **Better Error Handling**
   - Show specific error when experts fail to load
   - Provide fallback experts
   - Add retry mechanisms

5. **Performance Optimization**
   - Lazy load expert cards
   - Virtual scrolling for many experts
   - Memoize expensive computations

---

## Known Issues & Limitations

### Current Limitations

1. **Fixed Expert Count**
   - Only 3 experts defined in DEFAULT_EXPERTS
   - Max slider set to 3 (was incorrectly 5)
   - Cannot dynamically add more without code changes

2. **No Persistence**
   - Expert configurations reset on page reload
   - Custom personas not saved
   - Knowledge base files lost on refresh

3. **No Expert Validation**
   - No checks if expert configuration is valid
   - Missing required properties could crash
   - No schema validation

### Issues Fixed by This PR

✅ Experts array initialization
✅ Active expert count mismatch
✅ Slider range mismatch
✅ Reset function consistency
✅ Execution can now start

---

## Testing Checklist

### Manual Testing

- [x] App loads without errors
- [x] 3 expert cards visible on load
- [x] Expert names and icons correct
- [x] Model dropdowns work
- [x] Sliders adjust (1-3 range)
- [x] Knowledge upload works
- [x] Phase 1 execution starts
- [x] Expert outputs populate
- [x] Phase 2 button enables after Phase 1
- [x] Judge synthesis works
- [x] Final verdict displays
- [x] No console errors

### Browser Testing

- [ ] Chrome
- [ ] Firefox  
- [ ] Safari
- [ ] Edge

### Responsive Testing

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## Rollback Plan

If issues arise, revert these changes:

```bash
git revert 9dc7df8
```

Then the experts array will be empty again, but you can manually call `resetToDefault()` via browser console:

```javascript
// Browser console
useCouncilStore.getState().resetToDefault()
```

---

## Documentation Updates

### Files Created
- `COUNCIL_EXPERTS_FIX.md` - This document

### Files Modified
- `src/stores/council.store.ts`
- `src/features/council/components/ControlPanel.tsx`

### Memory Facts Stored
1. Council experts initialization requirement
2. ExpertCard rendering logic
3. Two-phase execution architecture

---

## Contact & Support

**Issue Date:** February 25, 2026  
**Fix Date:** February 25, 2026  
**Status:** ✅ RESOLVED  
**Severity:** CRITICAL  
**Impact:** ALL users affected  

**Related Issues:**
- Empty experts array
- NoExpertsEmptyState showing  
- Tasks not executing
- Expert cards not rendering

**Keywords:** Council, experts, initialization, expert cards, execution, Phase 1, Phase 2, DEFAULT_EXPERTS, useCouncilStore

---

## Appendix

### Expert Properties Schema

```typescript
interface Expert {
  id: string;
  name: string;
  model: string;
  role: string;
  basePersona: string;
  knowledge: KnowledgeFile[];
  config: {
    temperature: number;
    maxTokens: number;
    topP: number;
    presencePenalty: number;
    frequencyPenalty: number;
  };
  modeBehavior: {
    separated?: string;
    synthesis?: string;
    debate?: string;
    pipeline?: string;
    parallel?: string;
    consensus?: string;
    adversarial?: string;
    sequential?: string;
    modeName: string;
    description: string;
    isEnabled: boolean;
  };
  color: string;
  icon: string;
  content: string;
  hasWebSearch?: boolean;
  output?: string;
  isLoading?: boolean;
  error?: string;
}
```

### Execution Phases

```typescript
type ExecutionPhase = 
  | 'idle'              // Initial state
  | 'phase1-experts'    // Running experts
  | 'phase1-complete'   // Experts done, ready for judge
  | 'phase2-synthesis'  // Running judge
  | 'complete';         // All done
```

---

**Document Version:** 1.0  
**Last Updated:** February 25, 2026  
**Author:** GitHub Copilot Agent  
**Status:** Complete ✅
