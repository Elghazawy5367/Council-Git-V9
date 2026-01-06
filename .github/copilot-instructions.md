# [# The Council - Copilot Instructions

**The Council** is a React + TypeScript AI orchestration app that queries multiple AI models via OpenRouter and synthesizes their outputs. Built for a solo founder on a Samsung tablet with zero infrastructure costs.

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript 5.8 + Vite 6
- **State**: Zustand stores (feature-based)
- **Storage**: Dexie (IndexedDB wrapper)
- **UI**: Radix UI primitives + Tailwind CSS + shadcn/ui
- **AI**: OpenRouter API (usage-based)
- **Routing**: React Router v6

### Feature Organization
```
src/
├── features/
│   ├── council/          # Core AI orchestration
│   │   ├── api/          # ai-client.ts (OpenRouter integration)
│   │   ├── components/   # ExpertCard, SynthesisCard, etc.
│   │   ├── hooks/        # useExecuteSynthesis, etc.
│   │   ├── lib/          # types.ts, synthesis logic
│   │   └── store/        # Zustand stores (expert, execution, memory)
│   └── settings/         # API key management, synthesis config
├── components/
│   ├── ErrorBoundary.tsx # Production error handling (react-error-boundary)
│   └── primitives/       # Radix UI + shadcn/ui components
├── lib/
│   ├── db.ts            # Dexie schema + migrations
│   ├── synthesis-engine.ts # Multi-tier synthesis strategies
│   └── config.ts        # System prompts, model configurations
└── pages/
    └── Index.tsx        # Main Council interface
```

### State Management Pattern
Each feature has its own Zustand store with a consistent pattern:
```typescript
// Example: src/features/council/store/expert-store.ts
export const useExpertStore = create<ExpertState>((set) => ({
  experts: [],
  addExpert: (expert) => set((state) => ({ experts: [...state.experts, expert] })),
  // ... other actions
}));
```

**Key stores:**
- `useExpertStore` - Manages expert configurations and outputs
- `useExecutionStore` - Tracks synthesis execution state
- `useControlPanelStore` - UI state (active expert count, execution mode)
- `useSettingsStore` - API keys, synthesis config (persisted to localStorage)
- `useMemoryStore` - Session history and memory

## Critical Patterns

### 1. AI Client Architecture
**File**: [src/features/council/api/ai-client.ts](src/features/council/api/ai-client.ts)

The `callExpert()` function handles all OpenRouter API calls:
- Builds system prompts from expert persona + mode behavior
- Supports 4 execution modes: `separated`, `synthesis`, `debate`, `pipeline`
- Pipeline mode includes previous expert outputs in the prompt
- Returns both output text and cost calculations

```typescript
// Always ensure hasWebSearch and modeBehavior defaults
const expertWithDefaults = {
  ...expert,
  hasWebSearch: expert.hasWebSearch ?? false,
  modeBehavior: { ...expert.modeBehavior, isEnabled: true }
};
```

### 2. Database Migrations (Dexie)
**File**: [src/lib/db.ts](src/lib/db.ts)

Uses versioned schema migrations:
```typescript
this.version(2)
  .stores({ experts: "++id, name, role, model, persona" })
  .upgrade(async (tx) => {
    return tx.table("experts").toCollection().modify(expert => {
      if (!expert.persona) expert.persona = `Specialist in ${expert.role}`;
    });
  });
```

**When adding new fields:** Always create a new version and provide an upgrade function.

### 3. Synthesis Strategies
**File**: [src/lib/synthesis-engine.ts](src/lib/synthesis-engine.ts)

Three tiers with different prompt styles:
- **Quick** (⚡): Fast consensus extraction, ~15s
- **Balanced** (🎯): Deduplication + Chain-of-Thought, ~25s
- **Deep** (🔍): Multi-pass refinement, ~45s

Each tier has specific temperature, max tokens, and prompt templates. The actual execution is in `useExecuteSynthesis` hook.

### 4. Error Boundaries
**File**: [src/components/ErrorBoundary.tsx](src/components/ErrorBoundary.tsx)

Uses `react-error-boundary` library. All app routes wrapped in `<RootErrorBoundary>` in [App.tsx](src/App.tsx). Provides:
- Mobile-friendly fallback UI
- Development-only error stack traces
- Retry and home navigation buttons

### 5. Code Splitting
Lazy-load heavy components:
```typescript
const SettingsModal = lazy(() => import("@/features/settings/components/SettingsModal"));
```

Used for modals and sidebars to reduce initial bundle size (<2MB target).

## Development Workflow

### Commands
```bash
npm run dev        # Dev server on port 5000
npm run typecheck  # TypeScript validation (strict mode enabled)
npm run lint       # ESLint
npm run build      # Production build
```

### TypeScript Strict Mode
**Config**: [tsconfig.json](tsconfig.json)
- `strict: true` enforced
- `noUnusedLocals` and `noUnusedParameters` enabled
- Path aliases: `@/*` → `src/*`, `@features/*` → `src/features/*`

**Rules:**
- No `any` types (use `unknown` or proper types)
- All functions must have explicit return types
- API responses validated with Zod (see `@features/council/lib/types.ts`)

### Constraints (Tablet-First)
- **No Docker** - dev container for cloud environments only
- **Vite only** - fast, lightweight, SWC for transpilation
- **Bundle size**: Keep total < 2MB (use lazy loading)
- **Dependencies**: Avoid packages >2MB or native bindings

## Integration Points

### OpenRouter API
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Key stored**: `useSettingsStore().openRouterKey` (encrypted in localStorage via vault system)
- **Cost tracking**: `calculateCost()` in ai-client.ts uses model-specific pricing

### IndexedDB (Dexie)
- **Tables**: `experts`, `sessions`
- **Initialization**: Call `initDatabase()` on app start
- **Schema changes**: Always use versioned migrations in db.ts

## Common Tasks

### Adding a New Expert Field
1. Update `Expert` interface in [src/features/council/lib/types.ts](src/features/council/lib/types.ts)
2. Create new Dexie version in [src/lib/db.ts](src/lib/db.ts)
3. Add migration logic to populate existing records
4. Update UI components that display experts

### Adding a New Execution Mode
1. Add mode to `ExecutionMode` type in types.ts
2. Update `ModeBehavior` interface with new prompt field
3. Modify `buildSystemPrompt()` in [src/lib/config.ts](src/lib/config.ts)
4. Update `callExpert()` in ai-client.ts to handle mode-specific logic

### Adding a New Radix UI Component
1. Use existing pattern from [src/components/primitives/](src/components/primitives/)
2. Follow shadcn/ui conventions (e.g., `primitives/button.tsx`)
3. Use `class-variance-authority` for variants
4. Export from primitives directory

## Important Files to Reference

- **[src/lib/config.ts](src/lib/config.ts)** - Model configurations, system prompts
- **[src/lib/types.ts](src/lib/types.ts)** - Global type definitions (SynthesisConfig, etc.)
- **[src/features/council/lib/types.ts](src/features/council/lib/types.ts)** - Council-specific types (Expert, ModeBehavior)
- **[src/pages/Index.tsx](src/pages/Index.tsx)** - Main UI layout and grid logic

## Conventions

- **File naming**: kebab-case for files, PascalCase for React components
- **Component structure**: `ComponentName.tsx` with default export
- **Hooks**: Prefix with `use`, place in `features/[feature]/hooks/`
- **Types**: Co-locate in `lib/types.ts` within feature, or global in `src/lib/types.ts`
- **Imports**: Use path aliases (`@/` and `@features/`)

## Budget & Philosophy

- **Zero infrastructure costs** - No Firebase, Supabase, AWS, etc.
- **Personal use only** - Single user, no auth/multi-tenancy
- **Usage-based AI** - Pay per API call (OpenRouter)
- **Offline-capable** - IndexedDB for persistence, works without network
- **Solo-maintainable** - Clear patterns, minimal abstractions

---

**Last Updated**: January 6, 2026  
**For questions on patterns**: Check existing implementation in `src/features/council/` before creating new patterns.
]
