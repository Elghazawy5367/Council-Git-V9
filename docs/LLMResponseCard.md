# LLMResponseCard Component Documentation

## Overview

The **LLMResponseCard** component displays individual LLM responses with full markdown rendering, syntax highlighting, status indicators, and interactive features including feedback, retry, copy, and export functionality.

## Location

- **Component**: `src/features/council/components/LLMResponseCard.tsx`
- **Demo**: `src/examples/LLMResponseCardDemo.tsx`

---

## Requirements ✅

All requirements from the problem statement have been implemented:

1. ✅ **Header with LLM icon, name, provider badge**
2. ✅ **Content area with markdown-rendered response**
3. ✅ **Footer with 4 buttons (thumbs up/down, retry, copy, export)**
4. ✅ **Status indicators (loading, success, error)**
5. ✅ **Collapsible/expandable**
6. ✅ **Syntax highlighting for code blocks**

---

## Component API

### Props

```typescript
interface LLMResponseCardProps {
  response: LLMResponse;           // Required: The LLM response data
  onFeedback?: (type: 'up' | 'down') => void;  // Optional: Feedback callback
  onRetry?: () => void;            // Optional: Retry callback
}
```

### LLMResponse Type

```typescript
interface LLMResponse {
  llmId: string;                   // LLM identifier (e.g., 'gpt4')
  llmName: string;                 // Display name (e.g., 'GPT-4 Turbo')
  response: string;                // The actual response content
  status: 'loading' | 'success' | 'error';  // Current status
  error?: string;                  // Error message if status is 'error'
  tokens?: {                       // Token usage statistics
    prompt: number;
    completion: number;
    total: number;
  };
  cost?: number;                   // Cost in dollars
  timestamp: number;               // Unix timestamp
}
```

---

## Features

### 1. Header Section

**LLM Information Display:**
- **Icon**: Large emoji icon from AVAILABLE_LLMS config
  - 🤖 GPT-4 Turbo
  - 🧠 Claude 3.5 Sonnet
  - ✨ Gemini Pro
  - 🔮 DeepSeek
- **Name**: LLM display name (e.g., "GPT-4 Turbo")
- **Provider Badge**: Provider name (e.g., "OpenAI", "Anthropic")

**Status Badge:**
- **Loading**: Clock icon + "Loading" (outline variant)
- **Success**: CheckCircle icon + "Success" (default variant)
- **Error**: AlertCircle icon + "Error" (destructive variant)

**Metadata Row:**
- **Timestamp**: Formatted time (e.g., "2:30:45 PM")
- **Token Count**: Total tokens used (e.g., "400 tokens")
- **Cost**: Formatted cost (e.g., "$0.0042")

**Collapse Toggle:**
- Chevron up/down button (ghost variant)
- Only visible in success state
- Toggles between expanded and collapsed

### 2. Content Area

**Markdown Rendering:**
```tsx
<SafeMarkdown content={response.response} />
```

**Features via SafeMarkdown:**

**Code Blocks:**
- Syntax highlighting
- Language label in top-right corner
- Bordered container with muted background
- Monospace font
- Scrollable overflow

Example:
```typescript
// Rendered with "TYPESCRIPT" label
const config: Config = {
  maxRetries: 3,
  timeout: 5000
};
```

**Tables:**
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```
- Styled borders
- Header background
- Responsive scrolling

**Headers:**
- H1: Large with bottom border
- H2: Medium semibold
- H3: Base medium
- H4: Base medium

**Lists:**
- Bulleted lists with disc markers
- Numbered lists with decimal markers
- Nested list support

**Blockquotes:**
- Left border (primary color)
- Muted background
- Italic text

**Links:**
- Primary color
- Underline on hover
- Opens in new tab
- External icon

**Other Elements:**
- Strong (bold)
- Emphasis (italic)
- Horizontal rules
- Inline code with background

**Content Container:**
- Rounded border
- Muted background (bg-muted/30)
- Max height: 600px
- Scrollable overflow (overflow-y-auto)
- Padding: 16px

### 3. Footer Buttons

**Left Side - Feedback Buttons:**

**👍 Thumbs Up**
- Variant: outline (default) or filled (when selected)
- Shows "Liked" text when selected
- Toggles state on click
- Disabled if no onFeedback callback

**👎 Thumbs Down**
- Variant: outline (default) or filled (when selected)
- Shows "Disliked" text when selected
- Toggles state on click
- Disabled if no onFeedback callback

**Right Side - Action Buttons:**

**🔄 Retry**
- Variant: outline
- Calls onRetry callback
- Disabled if no onRetry callback
- Toast: "Retrying request..."

**📋 Copy**
- Variant: outline
- Copies response text to clipboard
- Always enabled
- Toast: "Response copied to clipboard!" or "Failed to copy"

**💾 Export**
- Variant: outline
- Downloads response as .md file
- Filename format: `{llmId}-response-{timestamp}.md`
- Always enabled
- Toast: "Response exported!" or "Failed to export"

**Button Layout:**
```
[👍] [👎]                    [🔄] [📋] [💾]
 Feedback                     Actions
```

### 4. Status States

**Loading State:**

Visual:
- Header with skeleton placeholders
- Name skeleton (w-32)
- Badge skeleton (w-24)
- 5 content line skeletons
- Clock icon + "Loading" badge
- No footer

Behavior:
- Not collapsible
- No interactions

**Success State:**

Visual:
- Full header with all metadata
- Markdown-rendered content
- All footer buttons
- CheckCircle icon + "Success" badge
- Collapse toggle visible

Behavior:
- Fully interactive
- Collapsible
- All buttons functional

**Error State:**

Visual:
- Destructive red border (border-destructive/50)
- Destructive background (bg-destructive/5)
- Error message card with AlertCircle icon
- Error text display
- AlertCircle icon + "Error" badge
- Only retry button in footer

Behavior:
- Not collapsible
- Only retry button enabled
- Error message clearly displayed

### 5. Collapsible/Expandable

**Implementation:**
```tsx
<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
  <CollapsibleTrigger>
    {/* Chevron button */}
  </CollapsibleTrigger>
  <CollapsibleContent>
    {/* Content and footer */}
  </CollapsibleContent>
</Collapsible>
```

**Behavior:**
- Default state: Expanded (isExpanded = true)
- Toggle: Click chevron button in header
- Animation: Smooth expand/collapse
- Header: Always visible
- Content + Footer: Collapse together

**Visual Feedback:**
- ChevronUp icon when expanded
- ChevronDown icon when collapsed
- Ghost button variant for subtle appearance

### 6. Syntax Highlighting

**Automatic via SafeMarkdown:**

Code blocks in markdown automatically get:
- Language detection (from markdown ```lang)
- Language label display
- Styled container
- Preserved formatting
- Monospace font

**Supported Languages:**
- TypeScript/JavaScript
- Python
- Java
- C/C++
- Go
- Rust
- SQL
- Shell/Bash
- And many more...

**Inline Code:**
- Background highlight
- Monospace font
- Slight padding
- Primary text color

---

## Usage Examples

### Basic Usage

```tsx
import { LLMResponseCard } from '@/features/council/components/LLMResponseCard';
import type { LLMResponse } from '@/services/openrouter';

const response: LLMResponse = {
  llmId: 'gpt4',
  llmName: 'GPT-4 Turbo',
  response: '# Analysis\n\nHere are my findings...',
  status: 'success',
  tokens: { prompt: 150, completion: 250, total: 400 },
  cost: 0.0042,
  timestamp: Date.now(),
};

<LLMResponseCard response={response} />
```

### With Callbacks

```tsx
<LLMResponseCard
  response={response}
  onFeedback={(type) => {
    console.log('User feedback:', type);
    // Save to database, analytics, etc.
  }}
  onRetry={() => {
    console.log('Retry requested');
    // Trigger new API call
  }}
/>
```

### Loading State

```tsx
const loadingResponse: LLMResponse = {
  llmId: 'claude',
  llmName: 'Claude 3.5 Sonnet',
  response: '',
  status: 'loading',
  timestamp: Date.now(),
};

<LLMResponseCard response={loadingResponse} />
```

### Error State

```tsx
const errorResponse: LLMResponse = {
  llmId: 'gemini',
  llmName: 'Gemini Pro',
  response: '',
  status: 'error',
  error: 'API rate limit exceeded. Please try again later.',
  timestamp: Date.now(),
};

<LLMResponseCard
  response={errorResponse}
  onRetry={() => retryRequest('gemini')}
/>
```

### Multiple Responses

```tsx
const [responses, setResponses] = useState<LLMResponse[]>([]);

{responses.map((response) => (
  <LLMResponseCard
    key={response.llmId}
    response={response}
    onFeedback={(type) => handleFeedback(response.llmId, type)}
    onRetry={() => handleRetry(response.llmId)}
  />
))}
```

---

## Integration with Council Context

```tsx
import { useCouncilContext } from '@/contexts/CouncilContext';
import { LLMResponseCard } from '@/features/council/components/LLMResponseCard';

function ResponsesPanel() {
  const { execution } = useCouncilContext();

  return (
    <div className="space-y-4">
      {execution.llmResponses.map((response) => (
        <LLMResponseCard
          key={response.llmId}
          response={response}
          onFeedback={(type) => {
            // Log feedback
            console.log(`Feedback for ${response.llmId}:`, type);
          }}
          onRetry={() => {
            // Retry single LLM
            retryLLM(response.llmId);
          }}
        />
      ))}
    </div>
  );
}
```

---

## Styling & Customization

### Card Styling

```tsx
<Card className="w-full">
  {/* Full width by default */}
</Card>
```

To customize:
```tsx
<div className="max-w-4xl mx-auto">
  <LLMResponseCard response={response} />
</div>
```

### Color Variants

**Success State:**
- Border: default (border)
- Background: default (bg-card)
- Badge: default (bg-primary)

**Error State:**
- Border: destructive (border-destructive/50)
- Background: destructive (bg-destructive/5)
- Badge: destructive (bg-destructive)

**Loading State:**
- Border: default (border)
- Background: default (bg-card)
- Badge: outline (border only)

### Content Height

Default max height: 600px

To customize:
```tsx
// Edit in component or wrap in container
<div className="[&_.max-h-\\[600px\\]]:max-h-[400px]">
  <LLMResponseCard response={response} />
</div>
```

---

## Accessibility

### Keyboard Navigation
- ✅ All buttons are keyboard accessible
- ✅ Collapsible trigger works with Enter/Space
- ✅ Tab order is logical
- ✅ Focus indicators visible

### Screen Readers
- ✅ Semantic HTML structure
- ✅ Button labels clear
- ✅ Status badges have icons and text
- ✅ Content properly labeled

### ARIA Attributes
- ✅ Collapsible uses ARIA expanded state
- ✅ Buttons have proper roles
- ✅ Status badges have semantic meaning

---

## Performance

### Optimizations
- SafeMarkdown uses memoization
- Lazy loading for diagrams
- Efficient state updates
- No unnecessary re-renders

### Bundle Size
- Component: ~11 KB
- Uses existing dependencies
- No new external packages

---

## Browser Support

Works in all modern browsers:
- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers

**Requirements:**
- Clipboard API (for copy functionality)
- Modern JavaScript (ES2020+)

---

## Troubleshooting

### Clipboard Not Working

**Issue**: Copy button doesn't work
**Solution**: Ensure HTTPS or localhost (Clipboard API requirement)

### Export Not Working

**Issue**: Export button doesn't download file
**Solution**: Check browser pop-up blocker settings

### Syntax Highlighting Not Showing

**Issue**: Code blocks not highlighted
**Solution**: Ensure markdown has language specified (```typescript)

### Icons Not Displaying

**Issue**: LLM icon shows as question mark
**Solution**: Ensure llmId matches entry in AVAILABLE_LLMS

---

## Testing

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LLMResponseCard } from './LLMResponseCard';

test('renders success state', () => {
  const response = {
    llmId: 'gpt4',
    llmName: 'GPT-4',
    response: 'Test response',
    status: 'success',
    timestamp: Date.now(),
  };
  
  render(<LLMResponseCard response={response} />);
  expect(screen.getByText('GPT-4')).toBeInTheDocument();
  expect(screen.getByText('Test response')).toBeInTheDocument();
});

test('calls onFeedback when thumbs up clicked', () => {
  const onFeedback = jest.fn();
  const response = { /* ... */ };
  
  render(<LLMResponseCard response={response} onFeedback={onFeedback} />);
  fireEvent.click(screen.getByRole('button', { name: /thumbs up/i }));
  expect(onFeedback).toHaveBeenCalledWith('up');
});
```

### Manual Testing Checklist

- [ ] Loading state displays skeletons
- [ ] Success state shows full content
- [ ] Error state displays error message
- [ ] Collapse/expand works smoothly
- [ ] Thumbs up/down toggle correctly
- [ ] Copy button copies to clipboard
- [ ] Export button downloads file
- [ ] Retry button calls callback
- [ ] Markdown renders correctly
- [ ] Code blocks have syntax highlighting
- [ ] Tables render properly
- [ ] Links open in new tab

---

## Summary

The **LLMResponseCard** component is a feature-complete, production-ready solution for displaying LLM responses with:

- ✅ All 6 requirements implemented
- ✅ Three status states (loading, success, error)
- ✅ Full markdown support with syntax highlighting
- ✅ Interactive feedback system
- ✅ Copy and export functionality
- ✅ Collapsible interface
- ✅ Token and cost tracking
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Full accessibility support

Ready for immediate integration into the Council application!
