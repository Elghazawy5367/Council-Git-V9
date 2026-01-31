# JudgeSection Component

Complete documentation for the JudgeSection component that synthesizes multiple LLM responses using different judge modes.

## Overview

The **JudgeSection** component provides a UI for synthesizing multiple LLM responses using four different judge modes. It only appears when at least 2 successful LLM responses are available and provides judge mode selection, execution, and result display with markdown rendering.

## Requirements Met

✅ **1. Conditional Rendering** - Only visible after at least 2 LLM responses  
✅ **2. Radio Buttons** - Judge mode selection with 4 modes  
✅ **3. Success Display** - Shows which LLMs responded successfully  
✅ **4. Run Judge Button** - Disabled if no responses  
✅ **5. Markdown Output** - Judge output display with SafeMarkdown  
✅ **6. Score Breakdown** - Collapsible score section  
✅ **7. Contradictions** - Collapsible contradictions section  
✅ **8. Copy Button** - Plus export functionality  

## Features

### Core Features

- **Conditional Rendering**: Automatically shows/hides based on response count
- **Judge Mode Selection**: 4 modes with full descriptions
- **LLM Success Display**: Badges showing which LLMs responded
- **Synthesis Execution**: Run Judge button with loading state
- **Markdown Display**: Full GFM support via SafeMarkdown
- **Collapsible Sections**: Output, scores, and contradictions
- **Copy/Export**: Clipboard and file download functionality
- **Error Handling**: Clear error display with retry option

### Judge Modes

1. **Ruthless Judge** (Default)
   - Critical analysis with brutal honesty
   - Filters weak arguments and surfaces only high-confidence insights
   - Icon: Gavel

2. **Consensus Judge**
   - Finds common ground and builds unified perspective from all expert views
   - Emphasizes agreement and shared understanding
   - Icon: GitMerge

3. **Debate Judge**
   - Highlights conflicts and weighs opposing arguments
   - Shows all sides with scoring
   - Icon: Swords

4. **Pipeline Judge**
   - Sequential synthesis where each expert builds upon previous insights
   - Ordered integration approach
   - Icon: Workflow

## Usage

### Basic Usage

```tsx
import { CouncilProvider } from '@/contexts/CouncilContext';
import { JudgeSection } from '@/features/council/components/JudgeSection';

function App() {
  return (
    <CouncilProvider>
      <JudgeSection />
    </CouncilProvider>
  );
}
```

### With Other Components

```tsx
import { CouncilProvider } from '@/contexts/CouncilContext';
import { InputPanel } from '@/features/council/components/InputPanel';
import { LLMResponseCard } from '@/features/council/components/LLMResponseCard';
import { JudgeSection } from '@/features/council/components/JudgeSection';

function CouncilApp() {
  const { execution } = useCouncilContext();

  return (
    <div className="space-y-6">
      {/* Input */}
      <InputPanel />

      {/* LLM Responses */}
      {execution.llmResponses.map((response) => (
        <LLMResponseCard key={response.llmId} response={response} />
      ))}

      {/* Judge Section - only shows with 2+ responses */}
      <JudgeSection />
    </div>
  );
}
```

## Props

This component has no props. It uses the CouncilContext for all state and actions.

## Context Dependencies

### State Used

```typescript
execution: {
  llmResponses: LLMResponse[];  // Filters for successful responses
}

judge: {
  mode: JudgeMode;              // Current judge mode
  isRunning: boolean;           // Execution state
  result: string | null;        // Synthesized output
  error: string | null;         // Error message
}
```

### Actions Used

```typescript
setJudgeMode(mode: JudgeMode): void;   // Change judge mode
executeJudge(): Promise<void>;         // Run synthesis
```

## Component Structure

```tsx
<Card>
  <CardHeader>
    {/* Title, badge, copy/export buttons */}
  </CardHeader>

  <CardContent>
    {/* 1. Successful LLMs Display */}
    <div className="flex flex-wrap gap-2">
      {successfulResponses.map(...)}
    </div>

    <Separator />

    {/* 2. Judge Mode Selection */}
    <RadioGroup value={judge.mode} onValueChange={setJudgeMode}>
      {Object.entries(JUDGE_MODE_DESCRIPTIONS).map(...)}
    </RadioGroup>

    <Separator />

    {/* 3. Run Judge Button */}
    <Button onClick={handleRunJudge} disabled={...}>
      {judge.isRunning ? "Running..." : "Run Judge"}
    </Button>

    {/* 4. Judge Output (collapsible) */}
    {judge.result && (
      <Collapsible>
        <SafeMarkdown content={judge.result} />
      </Collapsible>
    )}

    {/* 5. Score Breakdown (collapsible) */}
    {judge.result && (
      <Collapsible>
        {/* Score table or placeholder */}
      </Collapsible>
    )}

    {/* 6. Contradictions (collapsible) */}
    {judge.result && (
      <Collapsible>
        {/* Contradictions list or placeholder */}
      </Collapsible>
    )}

    {/* 7. Error Display */}
    {judge.error && (
      <div className="border-destructive">
        {judge.error}
      </div>
    )}
  </CardContent>
</Card>
```

## State Management

### Local State

```typescript
const [isExpanded, setIsExpanded] = useState(true);
const [isScoresExpanded, setIsScoresExpanded] = useState(false);
const [isContradictionsExpanded, setIsContradictionsExpanded] = useState(false);
```

- `isExpanded`: Judge output collapsible state
- `isScoresExpanded`: Score breakdown collapsible state
- `isContradictionsExpanded`: Contradictions collapsible state

## Actions

### Copy to Clipboard

```typescript
const handleCopy = async (): Promise<void> => {
  if (!judge.result) return;
  
  try {
    await navigator.clipboard.writeText(judge.result);
    toast.success('Judge output copied to clipboard!');
  } catch (error) {
    toast.error('Failed to copy to clipboard');
  }
};
```

**Requirements:**
- HTTPS or localhost
- Modern browser with Clipboard API

### Export as Markdown

```typescript
const handleExport = (): void => {
  if (!judge.result) return;
  
  try {
    const blob = new Blob([judge.result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `judge-synthesis-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Judge output exported!');
  } catch (error) {
    toast.error('Failed to export judge output');
  }
};
```

**Filename Format:**
- `judge-synthesis-{timestamp}.md`
- Example: `judge-synthesis-1738305600000.md`

### Run Judge

```typescript
const handleRunJudge = async (): Promise<void> => {
  try {
    await executeJudge();
    toast.success('Judge synthesis completed!');
  } catch (error) {
    toast.error(`Judge synthesis failed: ${error.message}`);
  }
};
```

**Behavior:**
1. Sets `judge.isRunning = true`
2. Sets `execution.phase = 'judge'`
3. Filters successful responses
4. Combines responses with judge mode prompt
5. Calls LLM for synthesis
6. Sets `judge.result` on success
7. Sets `judge.error` on failure
8. Resets running state

## Styling

### Layout
- Full width card
- Responsive padding
- Section separators
- Consistent spacing (space-y-6)

### Colors
- Primary color for icons and accents
- Muted background for content area
- Destructive red for errors
- Secondary badges for LLM success

### Typography
- Card title: default size
- Section labels: text-sm font-medium
- Descriptions: text-sm text-muted-foreground
- Content: prose prose-sm

### States
- Default: Normal colors
- Hover: Slight opacity change
- Disabled: Reduced opacity, no pointer
- Loading: Spinner animation

## Conditional Rendering Logic

```typescript
const successfulResponses = execution.llmResponses.filter(
  (r) => r.status === 'success'
);

if (successfulResponses.length < 2) {
  return null;
}
```

**Show When:**
- 2 or more successful LLM responses

**Hide When:**
- 0 or 1 successful response
- All responses failed
- No responses yet

## Integration Notes

### With CouncilContext

The component is fully integrated with CouncilContext:
- Reads `execution.llmResponses` for response data
- Reads `judge` state for mode, result, error
- Calls `setJudgeMode()` to change mode
- Calls `executeJudge()` to run synthesis

### With Other Components

**InputPanel** → **LLMResponseCard(s)** → **JudgeSection**

1. User enters input in InputPanel
2. Parallel execution creates LLMResponseCard for each LLM
3. JudgeSection appears when 2+ responses succeed
4. User selects judge mode and runs synthesis
5. Synthesized result displays in JudgeSection

## Future Enhancements

### Score Breakdown Display

When integrated with RuthlessJudgeService's structured output:

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>LLM</TableHead>
      <TableHead>Accuracy</TableHead>
      <TableHead>Completeness</TableHead>
      <TableHead>Conciseness</TableHead>
      <TableHead>Total</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {Object.entries(scoreBreakdown).map(([llmId, scores]) => (
      <TableRow key={llmId}>
        <TableCell>{llmId}</TableCell>
        <TableCell>{scores.accuracy}/100</TableCell>
        <TableCell>{scores.completeness}/100</TableCell>
        <TableCell>{scores.conciseness}/100</TableCell>
        <TableCell className="font-medium">{scores.total}/100</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Contradictions Display

When integrated with RuthlessJudgeService's structured output:

```tsx
<ul className="space-y-2">
  {contradictions.map((contradiction, index) => (
    <li key={index} className="flex items-start gap-2">
      <AlertCircle className="h-4 w-4 mt-0.5 text-destructive" />
      <span className="text-sm">{contradiction}</span>
    </li>
  ))}
</ul>
```

## Accessibility

- ✅ Proper labels for all radio buttons
- ✅ ARIA attributes on collapsible sections
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Disabled state indicators

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires Clipboard API for copy functionality
- Requires Blob API for export functionality
- HTTPS or localhost required for clipboard

## Performance

- Lightweight component (~350 lines)
- No expensive computations
- Efficient re-renders with React memo patterns
- Collapsible sections reduce DOM when not needed

## Troubleshooting

### Component Not Showing

**Problem:** JudgeSection doesn't appear

**Solutions:**
- Ensure at least 2 successful LLM responses exist
- Check `execution.llmResponses` array
- Verify response status is 'success'

### Judge Button Disabled

**Problem:** Can't click Run Judge button

**Solutions:**
- Check if `judge.isRunning` is true
- Verify `successfulResponses.length > 0`
- Ensure API key is set

### Copy Fails

**Problem:** Copy to clipboard doesn't work

**Solutions:**
- Ensure HTTPS or localhost
- Check browser Clipboard API support
- Verify permissions

### Export Fails

**Problem:** Export doesn't download file

**Solutions:**
- Check browser Blob API support
- Verify file download permissions
- Check for popup blockers

## Examples

See `src/examples/JudgeSectionDemo.tsx` for a complete working example with:
- Mock LLM responses
- Feature showcase
- Usage instructions
- Integration patterns

## Related Components

- **InputPanel** - User input interface
- **LLMResponseCard** - Individual LLM response display
- **CouncilContext** - State management provider

## Configuration

Judge modes are configured in `src/lib/config.ts`:

```typescript
export const JUDGE_MODE_DESCRIPTIONS: Record<string, {...}> = {
  'ruthless-judge': {...},
  'consensus-judge': {...},
  'debate-judge': {...},
  'pipeline-judge': {...},
};
```

## License

Part of the Council-Git-V9 project.
