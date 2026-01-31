# CouncilWorkflow Component

Complete orchestration component for the two-phase Council AI workflow.

## Overview

The `CouncilWorkflow` component is the main orchestration component that brings together all parts of the Council system:
- Input Panel for user configuration
- Response Grid for LLM outputs
- Judge Section for synthesis

It handles the complete two-phase workflow with proper loading states, responsive layout, and progress indicators.

## Features

### ✅ Two-Phase Workflow Orchestration
- **Phase 1**: Parallel LLM execution
- **Phase 2**: Judge synthesis
- Automatic phase transitions
- Clear visual feedback

### ✅ Responsive Layout
- **Mobile**: Single column
- **Tablet**: 2-column grid
- **Desktop**: 3-column grid
- Adaptive spacing

### ✅ Loading States
- Phase 1 loading indicator
- Phase 2 loading indicator
- Empty state message
- Progress feedback

### ✅ Progress Indicators
- Spinner animations
- Status messages
- Response counts
- Phase indicators

## Usage

### Basic Usage

```tsx
import { CouncilProvider } from '@/contexts/CouncilContext';
import { CouncilWorkflow } from '@/features/council/components/CouncilWorkflow';

function App() {
  return (
    <CouncilProvider>
      <CouncilWorkflow />
    </CouncilProvider>
  );
}
```

### With Custom Wrapper

```tsx
import { CouncilProvider } from '@/contexts/CouncilContext';
import { CouncilWorkflow } from '@/features/council/components/CouncilWorkflow';

function CustomWorkflowPage() {
  return (
    <div className="min-h-screen bg-background">
      <CouncilProvider>
        <nav>{/* Your navigation */}</nav>
        <CouncilWorkflow />
        <footer>{/* Your footer */}</footer>
      </CouncilProvider>
    </div>
  );
}
```

## Component Structure

### Layout Sections

1. **Header**
   - Title with Sparkles icon
   - Description text
   - Centered layout

2. **Input Panel**
   - Text input area
   - File upload
   - LLM selection
   - Run Council button

3. **Phase 1 Loading** (conditional)
   - Large spinner
   - Status message
   - LLM count

4. **Response Grid** (conditional)
   - Section header with count
   - Responsive grid layout
   - LLM response cards

5. **Empty State** (conditional)
   - Helpful message
   - Getting started guidance
   - Dashed border style

6. **Phase 2 Loading** (conditional)
   - Large spinner
   - Synthesis message

7. **Judge Section** (conditional)
   - Appears after 2+ responses
   - Mode selection
   - Synthesis results

## Responsive Grid

### Breakpoints

```css
grid-cols-1           /* Base: 1 column (< 768px) */
md:grid-cols-2        /* Medium: 2 columns (768px - 1023px) */
lg:grid-cols-3        /* Large: 3 columns (≥ 1024px) */
```

### Gap Spacing

- Grid gap: `gap-6` (1.5rem / 24px)
- Section spacing: `space-y-8` (2rem / 32px)
- Container padding: `px-4 py-8`

## State Management

### Context Integration

```tsx
const { execution, llmSelection } = useCouncilContext();

// Check execution states
const isLoading = execution.isRunning && execution.phase === 'parallel';
const isJudging = execution.isRunning && execution.phase === 'judge';
```

### State Properties Used

```typescript
execution: {
  phase: 'idle' | 'parallel' | 'judge';
  isRunning: boolean;
  llmResponses: LLMResponse[];
}

llmSelection: {
  selectedLLMs: string[];
}
```

## Loading States

### Phase 1: Parallel Execution

Shows when `execution.isRunning && execution.phase === 'parallel'`

```tsx
<Card className="border-primary/50 bg-primary/5">
  <Loader2 className="h-12 w-12 animate-spin" />
  <h3>Running Council...</h3>
  <p>{selectedLLMs.length} LLMs are analyzing your input in parallel</p>
</Card>
```

### Phase 2: Judge Synthesis

Shows when `execution.isRunning && execution.phase === 'judge'`

```tsx
<Card className="border-primary/50 bg-primary/5">
  <Loader2 className="h-12 w-12 animate-spin" />
  <h3>Running Judge Synthesis...</h3>
  <p>Analyzing and synthesizing all responses</p>
</Card>
```

### Empty State

Shows when `!isLoading && execution.llmResponses.length === 0`

```tsx
<Card className="border-dashed">
  <Sparkles className="h-12 w-12 text-muted-foreground/50" />
  <h3>No Responses Yet</h3>
  <p>Enter your question above and click "Run Council" to get started</p>
</Card>
```

## Event Handlers

### Retry LLM

Called when user clicks retry button on a failed response:

```typescript
const handleRetryLLM = (llmId: string): void => {
  console.log('Retry LLM:', llmId);
  // TODO: Implement retry logic in CouncilContext
};
```

### Provide Feedback

Called when user clicks thumbs up/down on a response:

```typescript
const handleProvideFeedback = (llmId: string, type: 'up' | 'down'): void => {
  console.log('Feedback:', llmId, type);
  // TODO: Implement feedback tracking
};
```

## Styling

### Container

```tsx
className="container mx-auto px-4 py-8 space-y-8 max-w-7xl"
```

- `container mx-auto` - Centered container
- `px-4 py-8` - Padding (16px horizontal, 32px vertical)
- `space-y-8` - 32px spacing between sections
- `max-w-7xl` - Maximum width of 80rem (1280px)

### Loading Cards

```tsx
className="border-primary/50 bg-primary/5"
```

- Primary border at 50% opacity
- Primary background at 5% opacity
- Visual distinction from normal content

### Empty State Card

```tsx
className="border-dashed"
```

- Dashed border style
- Indicates no content yet
- Invites user action

## User Workflow

1. **View Input Panel** - Always visible at top
2. **Enter Question** - Type in text area
3. **Optional: Upload Files** - Add supporting files
4. **Select LLMs** - Choose which models to use
5. **Click "Run Council"** - Start Phase 1
6. **Watch Loading** - See spinner and status
7. **View Responses** - Grid appears with cards
8. **Provide Feedback** - Like/dislike individual responses
9. **Wait for Judge Section** - Appears after 2+ responses
10. **Select Judge Mode** - Choose synthesis strategy
11. **Click "Run Judge"** - Start Phase 2
12. **Watch Synthesis** - See judge loading state
13. **View Unified Result** - Read synthesized answer

## Examples

### Simple Integration

```tsx
import { CouncilWorkflow } from '@/features/council/components/CouncilWorkflow';

export default function Page() {
  return <CouncilWorkflow />;
}
```

### With Layout

```tsx
import { CouncilWorkflow } from '@/features/council/components/CouncilWorkflow';

export default function CouncilPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <h1>Council AI</h1>
      </header>
      <main>
        <CouncilWorkflow />
      </main>
    </div>
  );
}
```

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy (h1, h2, h3)
- Descriptive text for screen readers
- Loading states announced
- Keyboard navigation supported

## Performance

- Lazy rendering of response cards
- Conditional rendering of sections
- Optimized grid layout
- Minimal re-renders

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid support required
- Flexbox support required
- ES6+ JavaScript support required

## Dependencies

### Internal Components
- `InputPanel` - User input interface
- `LLMResponseCard` - Individual response display
- `JudgeSection` - Synthesis interface

### Context
- `CouncilContext` - State management
- `useCouncilContext` - Context hook

### Primitives
- `Card`, `CardContent` - Layout components
- Icons: `Loader2`, `Sparkles`

## Troubleshooting

### Responses Not Showing

**Problem**: Response grid doesn't appear after running council

**Solution**: Check that:
1. API key is set in context
2. LLMs are selected
3. Input text is not empty
4. Network connection is active

### Layout Issues

**Problem**: Grid layout not responsive

**Solution**: Verify:
1. Tailwind CSS is properly configured
2. Responsive classes are applied correctly
3. Container width is not constrained by parent

### Loading States Stuck

**Problem**: Loading spinner doesn't disappear

**Solution**: Check:
1. API calls are completing
2. Error handling is working
3. Context state is updating correctly

## Future Enhancements

- [ ] Add retry all button
- [ ] Add clear all button
- [ ] Add export all responses
- [ ] Add response filtering
- [ ] Add sort options
- [ ] Add search within responses
- [ ] Add response comparison view
- [ ] Add statistics dashboard

## Related Components

- [InputPanel](./InputPanel.md) - User input interface
- [LLMResponseCard](./LLMResponseCard.md) - Individual response display
- [JudgeSection](./JudgeSection.md) - Synthesis interface
- [CouncilContext](./CouncilContext.md) - State management

## License

Part of the Council AI project.
