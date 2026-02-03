# UI Component Migration Plan: Custom to shadcn/ui

**Version:** 1.0  
**Date:** February 3, 2026  
**Status:** Ready for Implementation

## Executive Summary

This document provides a step-by-step migration plan to replace custom UI components with standardized shadcn/ui assembled components. The Council application currently has **52+ shadcn/ui primitives** already installed and **136 imports** of primitives in features, showing good adoption. This migration will standardize the remaining custom components.

### Current State
- ✅ shadcn/ui primitives: 52+ components installed
- ✅ Radix UI: All dependencies present
- ✅ Tailwind CSS: Configured with CSS variables
- ⚠️ Custom components: 7 components need migration
- ⚠️ Duplicate implementations: Skeleton component

### Migration Benefits
- **Consistency:** Uniform component behavior and styling
- **Maintainability:** Community-maintained components
- **Accessibility:** Radix UI primitives are accessible by default
- **Type Safety:** Full TypeScript support
- **Bundle Size:** Eliminate duplicate code
- **Developer Experience:** Better documentation and examples

---

## 1. Dependency Installation

### Current Dependencies ✅
All required dependencies are already installed:

```json
{
  "@radix-ui/react-*": "Latest versions installed",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7",
  "lucide-react": "^0.462.0"
}
```

### No Additional Dependencies Required
✅ All shadcn/ui primitives already installed  
✅ Tailwind CSS configured properly  
✅ Path aliases configured (@/components, @/lib)

### Optional: Add shadcn/ui CLI (Recommended)
```bash
# For adding new components in the future
npx shadcn@latest add [component-name]
```

---

## 2. Component Inventory & Analysis

### 2.1 Current Custom Components

| Component | Location | Lines | Usage Count | Status |
|-----------|----------|-------|-------------|--------|
| Skeleton | `src/components/Skeleton.tsx` | 129 | Low | **DUPLICATE** ⚠️ |
| EmptyState | `src/components/EmptyState.tsx` | 109 | Low | **Optimize** |
| MobileMenu | `src/components/MobileMenu.tsx` | ~100 | Medium | **Replace** |
| NavLink | `src/components/NavLink.tsx` | ~50 | Medium | **Replace** |
| LayoutDebugger | `src/components/LayoutDebugger.tsx` | ~50 | Low | **Keep** |
| ErrorBoundary | `src/components/ErrorBoundary.tsx` | ~100 | Critical | **Keep** ✅ |
| Dashboard/* | `src/components/dashboard/*` | ~800 | High | **Keep** ✅ |

### 2.2 shadcn/ui Primitives Available

Already installed (52+ components):
- ✅ `skeleton` - Replaces custom Skeleton
- ✅ `sheet` - For MobileMenu
- ✅ `drawer` - Alternative for MobileMenu
- ✅ `navigation-menu` - For NavLink
- ✅ `button`, `card`, `badge`, `dialog`, `tabs`, etc.

---

## 3. Priority Matrix

### High Priority (Quick Wins + High Impact)

#### Priority 1: Skeleton Component ⚡
- **Risk:** Low (simple component)
- **Impact:** High (eliminates duplication)
- **Effort:** 1-2 hours
- **Why:** Direct duplicate of primitives/skeleton.tsx

#### Priority 2: EmptyState Component 🎯
- **Risk:** Low (well-isolated)
- **Impact:** Medium (standardization)
- **Effort:** 2-3 hours
- **Why:** Can use Card + Button primitives

#### Priority 3: MobileMenu Component 📱
- **Risk:** Medium (navigation logic)
- **Impact:** Medium (mobile UX)
- **Effort:** 3-4 hours
- **Why:** Sheet/Drawer primitives available

### Medium Priority

#### Priority 4: NavLink Component 🔗
- **Risk:** Low (simple wrapper)
- **Impact:** Medium (navigation)
- **Effort:** 2-3 hours
- **Why:** Can use NavigationMenu primitive

### Low Priority (Keep As-Is)

- ✅ **ErrorBoundary** - Critical functionality, react-error-boundary based
- ✅ **LayoutDebugger** - Development tool, low impact
- ✅ **Dashboard components** - Already using primitives extensively

---

## 4. File-by-File Migration Checklist

### Phase 1: Eliminate Duplicates (Week 1, Day 1-2)

#### ✅ Step 1.1: Migrate Skeleton Component

**Files to Modify:**
- [ ] `src/components/Skeleton.tsx` (REMOVE after migration)
- [ ] Find and replace imports across codebase

**Commands:**
```bash
# Find all usages
grep -r "from.*Skeleton" src --include="*.tsx" --include="*.ts"

# Check current imports
grep -r "components/Skeleton" src --include="*.tsx" --include="*.ts"
```

**Migration Steps:**
1. [ ] Find all imports of `src/components/Skeleton.tsx`
2. [ ] Replace with `@/components/primitives/skeleton`
3. [ ] Update component usage:
   ```typescript
   // Before
   import { Skeleton, ExpertCardSkeleton } from '@/components/Skeleton';
   
   // After
   import { Skeleton } from '@/components/primitives/skeleton';
   // Move ExpertCardSkeleton to feature-specific component
   ```
4. [ ] Test all pages using Skeleton
5. [ ] Remove `src/components/Skeleton.tsx`
6. [ ] Commit: "Migrate Skeleton to shadcn/ui primitive"

**Affected Files (Estimate: 2-5 files):**
- Search result: Check actual usage with grep command

**Testing:**
```bash
# Run dev server
npm run dev

# Check pages that use skeletons
# - Dashboard pages
# - Loading states
# - Expert cards
```

**Rollback:**
```bash
git revert HEAD
```

---

### Phase 2: Standardize EmptyState (Week 1, Day 3)

#### ✅ Step 2.1: Enhance EmptyState with Primitives

**Current Structure:**
```typescript
// src/components/EmptyState.tsx
export const EmptyState: React.FC<EmptyStateProps> = ({ ... }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Custom implementation */}
    </div>
  );
};
```

**New Structure (Using Primitives):**
```typescript
// src/components/EmptyState.tsx
import { Card, CardContent } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';

export const EmptyState: React.FC<EmptyStateProps> = ({ ... }) => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        {/* Use primitives */}
      </CardContent>
    </Card>
  );
};
```

**Migration Steps:**
1. [ ] Update EmptyState to use Card primitive
2. [ ] Ensure Button primitive is used (already done ✅)
3. [ ] Test all EmptyState variants:
   - [ ] NoExpertsEmptyState
   - [ ] NoHistoryEmptyState
   - [ ] VaultLockedEmptyState
   - [ ] NoMemoriesEmptyState
   - [ ] NoResultsEmptyState
4. [ ] Verify styling matches
5. [ ] Commit: "Enhance EmptyState with Card primitive"

**Testing Pages:**
- Dashboard (empty states)
- History view (no history)
- Memory view (no memories)
- Search results (no results)

**Rollback:**
```bash
git revert HEAD
```

---

### Phase 3: Replace MobileMenu (Week 1, Day 4-5)

#### ✅ Step 3.1: Replace MobileMenu with Sheet

**Current Implementation:**
```typescript
// src/components/MobileMenu.tsx
// Custom mobile menu implementation
```

**New Implementation (Using Sheet):**
```typescript
// src/components/MobileMenu.tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/primitives/sheet';
import { Button } from '@/components/primitives/button';

export const MobileMenu: React.FC<MobileMenuProps> = ({ ... }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        {/* Menu items */}
      </SheetContent>
    </Sheet>
  );
};
```

**Migration Steps:**
1. [ ] Analyze current MobileMenu functionality
2. [ ] Create new implementation with Sheet primitive
3. [ ] Test on mobile viewports (< 768px)
4. [ ] Verify navigation works
5. [ ] Check accessibility (keyboard navigation, screen readers)
6. [ ] Test on actual mobile devices (Chrome DevTools mobile emulation)
7. [ ] Commit: "Replace MobileMenu with shadcn/ui Sheet"

**Testing:**
```bash
# Test responsive behavior
npm run dev

# Check in browser DevTools:
# - iPhone SE (375px)
# - iPad (768px)
# - Desktop (1024px+)
```

**Rollback:**
```bash
git revert HEAD
```

---

### Phase 4: Enhance NavLink (Week 2, Day 1)

#### ✅ Step 4.1: Enhance NavLink Component

**Current Implementation:**
```typescript
// src/components/NavLink.tsx
// Custom navigation link
```

**Options:**
1. **Option A:** Keep as thin wrapper around React Router Link
2. **Option B:** Use NavigationMenu primitive for complex navigation
3. **Option C:** Use Button primitive with "link" variant

**Recommended: Option A (Minimal Change)**
```typescript
// src/components/NavLink.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/primitives/button';
import { cn } from '@/lib/utils';

export const NavLink: React.FC<NavLinkProps> = ({ 
  to, 
  children, 
  active,
  className,
  ...props 
}) => {
  return (
    <Button
      asChild
      variant={active ? 'secondary' : 'ghost'}
      className={cn('justify-start', className)}
    >
      <Link to={to} {...props}>
        {children}
      </Link>
    </Button>
  );
};
```

**Migration Steps:**
1. [ ] Analyze current NavLink usage
2. [ ] Update to use Button primitive
3. [ ] Test navigation in all locations
4. [ ] Verify active state styling
5. [ ] Check accessibility
6. [ ] Commit: "Enhance NavLink with Button primitive"

**Testing:**
- Navigation bar
- Sidebar navigation
- Mobile menu
- Active/inactive states

**Rollback:**
```bash
git revert HEAD
```

---

## 5. Testing Strategy

### 5.1 Unit Testing

**No existing unit test infrastructure** - Skip for minimal changes approach

### 5.2 Manual Testing Checklist

#### After Each Migration:
- [ ] Run `npm run dev`
- [ ] Test component in all locations
- [ ] Check dark mode
- [ ] Test responsive breakpoints (mobile, tablet, desktop)
- [ ] Verify accessibility (keyboard navigation)
- [ ] Check browser console for errors
- [ ] Test user interactions (clicks, hovers, focus)

#### Critical Pages to Test:
- [ ] Dashboard (/)
- [ ] Council interface (/council)
- [ ] Settings
- [ ] All empty states
- [ ] Mobile navigation
- [ ] Loading states

### 5.3 Visual Regression Testing

**Before Migration:**
```bash
# Take screenshots of key pages
npm run dev
# Manually screenshot:
# - Dashboard
# - Council interface
# - Empty states
# - Mobile menu
```

**After Migration:**
```bash
# Compare with before screenshots
# Verify:
# - Layout unchanged
# - Colors consistent
# - Spacing correct
# - Animations smooth
```

### 5.4 Build Testing

```bash
# Always test build after migration
npm run typecheck  # TypeScript compilation
npm run build      # Production build
npm run preview    # Test production build
```

### 5.5 Browser Testing

Test in:
- [ ] Chrome (primary)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers (Chrome Mobile, Safari iOS)

---

## 6. Rollback Plan

### 6.1 Per-Component Rollback

**If a migration fails:**
```bash
# Revert last commit
git revert HEAD

# Or reset to previous state
git reset --hard HEAD~1

# Push changes
git push origin [branch-name]
```

### 6.2 Full Migration Rollback

**If entire migration needs rollback:**
```bash
# Find commit before migration started
git log --oneline

# Reset to that commit
git reset --hard [commit-hash]

# Force push (if already pushed)
git push --force origin [branch-name]
```

### 6.3 Partial Rollback

**Keep successful migrations, rollback failures:**
```bash
# Cherry-pick successful migrations
git log --oneline
git revert [failed-commit-hash]
```

### 6.4 Emergency Rollback

**If production is broken:**
```bash
# Immediate revert to last known good state
git revert HEAD --no-edit
git push origin main

# Or redeploy previous version
npm run deploy  # Deploys previous working build
```

---

## 7. Migration Timeline

### Week 1: Core Migrations

**Day 1-2: Skeleton Component**
- Morning: Analyze usage, create migration script
- Afternoon: Execute migration, test
- Evening: Commit and verify

**Day 3: EmptyState Enhancement**
- Morning: Implement Card primitive wrapper
- Afternoon: Test all EmptyState variants
- Evening: Commit and verify

**Day 4-5: MobileMenu Replacement**
- Day 4 Morning: Implement Sheet-based menu
- Day 4 Afternoon: Test mobile viewports
- Day 5 Morning: Test on actual devices
- Day 5 Afternoon: Commit and verify

### Week 2: Final Touches

**Day 1: NavLink Enhancement**
- Morning: Implement Button primitive wrapper
- Afternoon: Test navigation
- Evening: Commit and verify

**Day 2: Final Testing & Documentation**
- Morning: Full application test
- Afternoon: Update documentation
- Evening: Create summary report

---

## 8. Success Metrics

### Quantitative Metrics
- [ ] Duplicate code eliminated: 1 component (Skeleton)
- [ ] Components using primitives: 100% of migrated components
- [ ] Bundle size reduction: Estimate 2-5KB
- [ ] TypeScript errors: 0
- [ ] Build time: Unchanged or improved

### Qualitative Metrics
- [ ] Consistent styling across all components
- [ ] Improved maintainability
- [ ] Better accessibility
- [ ] Enhanced developer experience

---

## 9. Risk Assessment

### Low Risk Components ✅
- **Skeleton:** Direct replacement, no logic changes
- **EmptyState:** Isolated, well-defined interface
- **NavLink:** Simple wrapper, minimal usage

### Medium Risk Components ⚠️
- **MobileMenu:** Navigation logic, mobile-specific

### Mitigation Strategies
1. **Incremental Migration:** One component at a time
2. **Git Branching:** Feature branches for each migration
3. **Thorough Testing:** Manual testing after each change
4. **Quick Rollback:** Git revert ready for each step
5. **Backup:** Keep old components until verification complete

---

## 10. Implementation Commands

### 10.1 Find Component Usage

```bash
# Find all imports of a component
grep -r "from.*ComponentName" src --include="*.tsx" --include="*.ts"

# Find all usages
grep -r "ComponentName" src --include="*.tsx" --include="*.ts"

# Count usages
grep -r "ComponentName" src --include="*.tsx" --include="*.ts" | wc -l
```

### 10.2 Search and Replace

```bash
# Use sed for batch replacements (with backup)
find src -name "*.tsx" -exec sed -i.bak 's/old-import/new-import/g' {} +

# Remove backups after verification
find src -name "*.bak" -delete
```

### 10.3 Testing Commands

```bash
# TypeScript check
npm run typecheck

# Build test
npm run build

# Dev server
npm run dev

# Preview production build
npm run preview
```

### 10.4 Git Commands

```bash
# Create feature branch
git checkout -b ui-migration/skeleton-component

# Commit changes
git add .
git commit -m "Migrate Skeleton to shadcn/ui primitive"

# Push branch
git push origin ui-migration/skeleton-component

# Merge to main (after testing)
git checkout main
git merge ui-migration/skeleton-component
```

---

## 11. Post-Migration Checklist

### After All Migrations Complete:

- [ ] All custom components migrated or optimized
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] All pages tested
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Accessibility verified
- [ ] Documentation updated
- [ ] Old component files removed
- [ ] Git history clean
- [ ] Create migration summary report

### Files to Remove:
- [ ] `src/components/Skeleton.tsx` (after migration complete)
- [ ] Any `.bak` files from replacements
- [ ] Unused custom implementations

### Files to Update:
- [ ] Component index files (exports)
- [ ] Documentation
- [ ] README (if applicable)

---

## 12. Component-Specific Migration Guides

### 12.1 Skeleton Migration Guide

**Before:**
```typescript
import { Skeleton, ExpertCardSkeleton } from '@/components/Skeleton';

<Skeleton variant="text" width="100%" height={16} />
<ExpertCardSkeleton />
```

**After:**
```typescript
import { Skeleton } from '@/components/primitives/skeleton';

<Skeleton className="h-4 w-full" />

// Move specialized skeletons to feature components
// src/features/council/components/ExpertCardSkeleton.tsx
import { Skeleton } from '@/components/primitives/skeleton';
export const ExpertCardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <Skeleton className="h-4 w-full" />
  </div>
);
```

**Key Differences:**
- ✅ No more variant prop (use className)
- ✅ No width/height props (use Tailwind classes)
- ✅ Specialized skeletons move to feature folders

### 12.2 EmptyState Enhancement Guide

**Before:**
```typescript
import { EmptyState } from '@/components/EmptyState';

<EmptyState
  title="No Data"
  description="No data available"
  action={{ label: "Add", onClick: handleAdd }}
/>
```

**After:**
```typescript
import { EmptyState } from '@/components/EmptyState';
// Component now uses Card + Button primitives internally

<EmptyState
  title="No Data"
  description="No data available"
  action={{ label: "Add", onClick: handleAdd }}
/>
```

**Key Changes:**
- ✅ API unchanged (backward compatible)
- ✅ Internal implementation uses Card primitive
- ✅ Better visual consistency

### 12.3 MobileMenu Migration Guide

**Before:**
```typescript
import { MobileMenu } from '@/components/MobileMenu';

<MobileMenu items={navItems} />
```

**After:**
```typescript
import { MobileMenu } from '@/components/MobileMenu';
// Component now uses Sheet primitive internally

<MobileMenu items={navItems} />
```

**Key Changes:**
- ✅ API unchanged (backward compatible)
- ✅ Better animations (Radix UI)
- ✅ Improved accessibility

---

## 13. Troubleshooting Guide

### Issue: TypeScript Errors After Migration

**Solution:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run typecheck
```

### Issue: Styling Breaks

**Solution:**
1. Check Tailwind class conflicts
2. Verify CSS variable usage
3. Check dark mode classes
4. Inspect with browser DevTools

### Issue: Component Not Rendering

**Solution:**
1. Check import paths
2. Verify component exports
3. Check console for errors
4. Verify prop types match

### Issue: Build Fails

**Solution:**
```bash
# Clean build cache
npm run clean
rm -rf dist node_modules/.vite

# Reinstall and rebuild
npm install
npm run build
```

---

## 14. Additional Resources

### Official Documentation
- shadcn/ui: https://ui.shadcn.com/
- Radix UI: https://www.radix-ui.com/
- Tailwind CSS: https://tailwindcss.com/

### Component Examples
- shadcn/ui Examples: https://ui.shadcn.com/examples
- Radix UI Examples: https://www.radix-ui.com/primitives/docs/overview/introduction

### Community Resources
- shadcn/ui GitHub: https://github.com/shadcn-ui/ui
- Discord: shadcn/ui community
- Twitter: @shadcn

---

## 15. Summary

This migration plan provides a comprehensive, step-by-step approach to replacing custom UI components with shadcn/ui assembled components. The strategy prioritizes:

1. **Quick Wins:** Eliminate duplicate Skeleton component first
2. **Low Risk:** Simple components before complex ones
3. **High Impact:** Focus on most-used components
4. **Incremental:** One component at a time with rollback options

### Expected Outcomes:
- ✅ Consistent UI across application
- ✅ Reduced maintenance burden
- ✅ Better accessibility
- ✅ Improved developer experience
- ✅ Smaller bundle size
- ✅ Community-maintained components

### Timeline:
- Week 1: Core migrations (Skeleton, EmptyState, MobileMenu)
- Week 2: Final touches (NavLink, testing, documentation)

### Next Steps:
1. Review and approve this plan
2. Create feature branch
3. Start with Phase 1 (Skeleton migration)
4. Test thoroughly after each phase
5. Document learnings and adjust plan as needed

---

**Document Version:** 1.0  
**Last Updated:** February 3, 2026  
**Author:** Council Development Team  
**Status:** Ready for Implementation ✅
