# UI Migration Quick Checklist

**Quick reference for executing the UI component migration plan.**

## Pre-Migration Checklist ✅

- [x] All shadcn/ui dependencies installed
- [x] Tailwind CSS configured
- [x] Path aliases set up
- [x] Development environment ready

## Phase 1: Skeleton Component Migration ⚡

### Day 1-2

**Find Usages:**
```bash
grep -r "from.*Skeleton" src --include="*.tsx" --include="*.ts"
```

**Migration Steps:**
- [ ] 1. Find all imports of `@/components/Skeleton`
- [ ] 2. Replace with `@/components/primitives/skeleton`
- [ ] 3. Update component usage (remove variant/width/height props)
- [ ] 4. Move specialized skeletons to feature folders
- [ ] 5. Test all pages
- [ ] 6. Run `npm run typecheck`
- [ ] 7. Run `npm run build`
- [ ] 8. Commit: "Migrate Skeleton to shadcn/ui primitive"
- [ ] 9. Remove `src/components/Skeleton.tsx`

**Test:**
- [ ] Dashboard pages
- [ ] Loading states
- [ ] Expert cards
- [ ] Dark mode

**Rollback:** `git revert HEAD`

---

## Phase 2: EmptyState Enhancement 🎯

### Day 3

**Migration Steps:**
- [ ] 1. Add Card import to EmptyState.tsx
- [ ] 2. Wrap content in Card component
- [ ] 3. Test all EmptyState variants:
  - [ ] NoExpertsEmptyState
  - [ ] NoHistoryEmptyState
  - [ ] VaultLockedEmptyState
  - [ ] NoMemoriesEmptyState
  - [ ] NoResultsEmptyState
- [ ] 4. Verify styling consistency
- [ ] 5. Run `npm run typecheck`
- [ ] 6. Run `npm run build`
- [ ] 7. Commit: "Enhance EmptyState with Card primitive"

**Test:**
- [ ] Dashboard (empty states)
- [ ] History view (no history)
- [ ] Memory view (no memories)
- [ ] Search results (no results)
- [ ] Dark mode

**Rollback:** `git revert HEAD`

---

## Phase 3: MobileMenu Replacement 📱

### Day 4-5

**Migration Steps:**
- [ ] 1. Analyze current MobileMenu.tsx
- [ ] 2. Import Sheet components
- [ ] 3. Replace implementation with Sheet
- [ ] 4. Test on mobile viewports:
  - [ ] iPhone SE (375px)
  - [ ] iPad (768px)
  - [ ] Desktop (1024px+)
- [ ] 5. Check accessibility (keyboard, screen readers)
- [ ] 6. Test on actual mobile devices
- [ ] 7. Run `npm run typecheck`
- [ ] 8. Run `npm run build`
- [ ] 9. Commit: "Replace MobileMenu with shadcn/ui Sheet"

**Test:**
- [ ] Mobile navigation
- [ ] Menu open/close
- [ ] Navigation links work
- [ ] Dark mode
- [ ] Touch interactions

**Rollback:** `git revert HEAD`

---

## Phase 4: NavLink Enhancement 🔗

### Day 1 (Week 2)

**Migration Steps:**
- [ ] 1. Analyze current NavLink.tsx
- [ ] 2. Import Button primitive
- [ ] 3. Wrap Link with Button (asChild pattern)
- [ ] 4. Test navigation in all locations
- [ ] 5. Verify active state styling
- [ ] 6. Check accessibility
- [ ] 7. Run `npm run typecheck`
- [ ] 8. Run `npm run build`
- [ ] 9. Commit: "Enhance NavLink with Button primitive"

**Test:**
- [ ] Navigation bar
- [ ] Sidebar navigation
- [ ] Mobile menu
- [ ] Active/inactive states
- [ ] Dark mode

**Rollback:** `git revert HEAD`

---

## Final Testing Checklist 🧪

### Critical Pages
- [ ] Dashboard (/)
- [ ] Council interface (/council)
- [ ] Settings
- [ ] All empty states
- [ ] Mobile navigation
- [ ] Loading states

### Build Testing
```bash
npm run typecheck  # TypeScript
npm run build      # Production
npm run preview    # Test build
```

### Visual Testing
- [ ] Light mode
- [ ] Dark mode
- [ ] Mobile (< 768px)
- [ ] Tablet (768-1024px)
- [ ] Desktop (> 1024px)

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## Post-Migration Cleanup 🧹

- [ ] Remove old Skeleton.tsx
- [ ] Remove any .bak files
- [ ] Update documentation
- [ ] Create summary report
- [ ] Verify git history clean

---

## Quick Commands Reference

```bash
# Find component usage
grep -r "ComponentName" src --include="*.tsx" | wc -l

# TypeScript check
npm run typecheck

# Build
npm run build

# Dev server
npm run dev

# Preview build
npm run preview

# Create feature branch
git checkout -b ui-migration/[component-name]

# Commit
git add .
git commit -m "Migrate [component] to shadcn/ui"

# Rollback last commit
git revert HEAD
```

---

## Emergency Rollback 🚨

```bash
# Revert last commit
git revert HEAD --no-edit
git push origin main

# Or reset to specific commit
git log --oneline
git reset --hard [commit-hash]
git push --force origin main
```

---

## Success Criteria ✅

- [ ] All TypeScript errors resolved
- [ ] Build succeeds
- [ ] All tests pass
- [ ] Visual consistency maintained
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Accessibility verified
- [ ] Bundle size unchanged or reduced
- [ ] No console errors
- [ ] Documentation updated

---

## Priority Order

1. **Skeleton** - Highest priority (duplicate code)
2. **EmptyState** - High priority (standardization)
3. **MobileMenu** - Medium priority (UX improvement)
4. **NavLink** - Low priority (enhancement)

---

## Risk Levels

- 🟢 **Low Risk:** Skeleton, EmptyState, NavLink
- 🟡 **Medium Risk:** MobileMenu

---

**Quick Tip:** Do one component at a time, test thoroughly, commit, then move to next.

**Estimated Total Time:** 1-2 weeks (part-time)

**Document Version:** 1.0  
**Last Updated:** February 3, 2026
