# InputPanel Component Documentation

## Overview

The **InputPanel** component is a comprehensive input interface for the Council AI system that allows users to enter questions, attach files, select AI models, and execute the council for multi-perspective analysis.

## Location

- **File**: `src/features/council/components/InputPanel.tsx`
- **Demo**: `src/examples/InputPanelDemo.tsx`

## Features

### ✅ 1. Text Input with Character Counter

- Large textarea for entering questions or tasks
- Real-time character counter showing `X / 10,000`
- Counter turns **red** when limit exceeded
- Input border turns **red** when over limit
- Warning message displayed
- Disabled during execution

**Character Limit**: 10,000 characters

### ✅ 2. File Upload with Tabs

Three upload modes:

#### Local Files Tab (Active)
- Drag-and-drop file upload
- Click to browse files
- Visual feedback when dragging
- Border highlights on drag over
- Multiple file selection supported
- Disabled during execution

#### Google Drive Tab (Coming Soon)
- Currently disabled
- Shows "Google Drive integration coming soon..." message

#### URL Tab (Coming Soon)
- Currently disabled
- URL input field
- Add URL button
- Shows "URL integration coming soon..." message

### ✅ 3. File Validation

**Allowed File Types:**
- **Images**: PNG, JPEG, JPG, GIF, WebP
- **PDFs**: application/pdf
- **Text**: Plain text, Markdown, CSV

**Validation:**
- File type checking
- Size limit: **10MB per file**
- Toast notifications for errors
- Invalid files rejected automatically

### ✅ 4. File Preview Cards

Each attached file displays:
- **Icon**: Image/PDF/Text icon based on file type
- **Name**: File name (truncated if long)
- **Size**: Formatted size (B, KB, MB)
- **Remove Button**: X icon button to remove file

**Layout:**
- 1 column on mobile
- 2 columns on larger screens
- Shows total count: "Attached Files (X)"

### ✅ 5. LLM Selector

All 4 AI models with checkboxes:

1. **🤖 GPT-4 Turbo** (OpenAI)
2. **🧠 Claude 3.5 Sonnet** (Anthropic)
3. **✨ Gemini Pro** (Google)
4. **🔮 DeepSeek**

**Features:**
- Icon + name + provider for each model
- Selection counter: "X / 4 selected"
- Hover effects on cards
- Error message if none selected
- Disabled during execution
- All selected by default

### ✅ 6. Run Council Button

**Design:**
- Full width
- Large size (h-12)
- Prominent styling
- Icon + text

**States:**

1. **Normal**: 
   - Green/Primary color
   - "Run Council" with Upload icon
   - Enabled when valid input

2. **Disabled**:
   - Grayed out
   - Shown when:
     - No text entered
     - Text over limit
     - No LLMs selected
     - Already running

3. **Loading**:
   - "Running Council..." text
   - Spinning Loader2 icon
   - All inputs disabled

**Help Text:**
Below the button shows helpful messages:
- "Enter a question or task to run the council"
- "Select at least one AI model"
- "Check your input"

### ✅ 7. Loading State

When execution starts:
- Button shows spinner
- Button text changes
- Textarea disabled
- File inputs disabled
- Checkboxes disabled
- File remove buttons disabled

---

## Component Structure

```tsx
<Card>
  <CardHeader>
    <CardTitle>Council Input</CardTitle>
    <Tooltip>Info about the component</Tooltip>
  </CardHeader>
  
  <CardContent>
    {/* Text Input */}
    <Textarea with character counter />
    
    {/* File Upload */}
    <Tabs>
      <TabsList>Local | Drive | URL</TabsList>
      <TabsContent>
        Drag-and-drop zone
        File input
      </TabsContent>
    </Tabs>
    
    {/* File Previews */}
    <Grid of file cards with remove buttons />
    
    {/* LLM Selector */}
    <Grid of checkboxes for each LLM />
    
    {/* Run Button */}
    <Button with loading state />
  </CardContent>
</Card>
```

---

## Integration

### Context Usage

The component integrates with `CouncilContext`:

**State:**
- `input.text` - Current text input
- `input.files` - Attached files array
- `execution.isRunning` - Loading state
- `llmSelection.selectedLLMs` - Selected LLM IDs
- `llmSelection.availableLLMs` - All available LLMs

**Actions:**
- `setInputText(text)` - Update text
- `setInputFiles(files)` - Update files
- `setInputSource(source)` - Set upload source
- `toggleLLM(llmId)` - Toggle LLM selection
- `executeParallel()` - Run the council

### Usage Example

```tsx
import { CouncilProvider } from '@/contexts/CouncilContext';
import { InputPanel } from '@/features/council/components/InputPanel';

function App() {
  return (
    <CouncilProvider>
      <InputPanel />
    </CouncilProvider>
  );
}
```

---

## Dependencies

### Shadcn UI Components
- `Button` - Run Council button and file remove buttons
- `Textarea` - Text input field
- `Checkbox` - LLM selector checkboxes
- `Card`, `CardHeader`, `CardTitle`, `CardContent` - Container
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` - File upload tabs
- `Tooltip`, `TooltipProvider`, `TooltipTrigger`, `TooltipContent` - Info tooltips

### Icons (lucide-react)
- `Upload` - Upload icon
- `X` - Remove icon
- `FileText` - Text file icon
- `Image` - Image file icon
- `File` - PDF file icon
- `Loader2` - Loading spinner
- `Info` - Information icon

### External Libraries
- `sonner` - Toast notifications

---

## User Experience

### Visual Feedback
- ✅ Drag-and-drop border highlights
- ✅ Character counter color changes (red when over)
- ✅ Hover effects on all interactive elements
- ✅ Disabled state styling
- ✅ Loading spinner animation
- ✅ Toast notifications for actions

### Error Prevention
- ✅ File type validation
- ✅ File size validation
- ✅ Character limit enforcement
- ✅ Required field checking
- ✅ Clear error messages

### Helpful Guidance
- ✅ Info tooltips
- ✅ Placeholder text
- ✅ File type hints
- ✅ Help text below button
- ✅ Selection counters

---

## Responsive Design

### Mobile (< 640px)
- Single column layout
- Full width components
- Stacked file previews
- Stacked LLM checkboxes

### Desktop (>= 640px)
- 2-column file preview grid
- 2-column LLM selector grid
- Optimized spacing

---

## Accessibility

- ✅ Proper labels for all inputs
- ✅ ARIA attributes where needed
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Disabled state indicators

---

## Performance

- Efficient re-renders with React hooks
- File validation before state update
- Lazy file reading (only when needed)
- Optimized drag-and-drop handlers
- No unnecessary re-renders

---

## Error Handling

### File Upload Errors
- Invalid file type → Toast notification
- File too large → Toast notification with size info
- Multiple file selection → Only valid files added

### Execution Errors
- No text → Help text shown, button disabled
- No LLMs selected → Error message shown
- API errors → Toast notification with error message

---

## Future Enhancements

Possible improvements:
- [ ] Google Drive integration
- [ ] URL file upload
- [ ] File preview thumbnails for images
- [ ] PDF preview in modal
- [ ] File drag reordering
- [ ] Bulk file actions
- [ ] Save draft functionality
- [ ] Auto-save input

---

## Code Quality

- ✅ TypeScript strict mode
- ✅ No `any` types
- ✅ Full type safety
- ✅ Clean component structure
- ✅ Reusable helper functions
- ✅ Consistent styling
- ✅ Well-documented code

---

## Testing

To test the component:

1. Start dev server: `npm run dev`
2. Navigate to demo page or integrate into main app
3. Test all features:
   - Enter text and watch character counter
   - Try to exceed character limit
   - Drag and drop files
   - Click to upload files
   - Try invalid file types
   - Try large files
   - Toggle LLM checkboxes
   - Try to run with no input
   - Try to run with no LLMs
   - Run council and observe loading state

---

## Summary

The InputPanel component provides a complete, production-ready input interface for the Council AI system with all required features, excellent UX, proper error handling, and full accessibility support.
