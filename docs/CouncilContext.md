# CouncilContext - State Management for Two-Phase AI Workflow

## Overview

The `CouncilContext` provides centralized state management for the Council application's two-phase workflow:

1. **Phase 1 (Parallel Execution)**: Multiple LLMs analyze the input simultaneously
2. **Phase 2 (Judge Synthesis)**: A judge synthesizes all LLM responses into a unified answer

## Features

✅ Two-phase workflow state management
✅ Input tracking (text + files)
✅ LLM selection and responses tracking
✅ Execution progress monitoring
✅ Judge state management
✅ Comprehensive actions for all operations

## Installation

The context is already set up in the repository:

- **Context**: `src/contexts/CouncilContext.tsx`
- **Service**: `src/services/openrouter.ts`
- **Example**: `src/examples/CouncilContextExample.tsx`

## Usage

### 1. Wrap your app with the provider

```tsx
import { CouncilProvider } from '@/contexts/CouncilContext';

function App() {
  return (
    <CouncilProvider>
      <YourComponents />
    </CouncilProvider>
  );
}
```

### 2. Use the context in your components

```tsx
import { useCouncilContext } from '@/contexts/CouncilContext';

function YourComponent() {
  const {
    input,
    execution,
    judge,
    llmSelection,
    setInputText,
    executeParallel,
    executeJudge,
    setApiKey,
  } = useCouncilContext();

  // Your component logic
}
```

## API Reference

### State

#### `input: InputState`
Tracks user input:
- `text: string` - The input text
- `files: File[]` - Uploaded files
- `source: 'local' | 'drive' | 'url'` - Source of input

#### `execution: ExecutionState`
Tracks execution state:
- `phase: 'idle' | 'parallel' | 'judge'` - Current execution phase
- `isRunning: boolean` - Whether execution is in progress
- `llmResponses: LLMResponse[]` - Array of LLM responses
- `progress: Map<string, ExecutionProgress>` - Progress per LLM

#### `judge: JudgeState`
Tracks judge synthesis:
- `mode: 'ruthless-judge' | 'consensus-judge' | 'debate-judge' | 'pipeline-judge'`
- `isRunning: boolean` - Whether judge is running
- `result: string | null` - Judge's synthesized result
- `error: string | null` - Any error that occurred

#### `llmSelection: LLMSelectionState`
Tracks LLM selection:
- `selectedLLMs: string[]` - IDs of selected LLMs
- `availableLLMs: LLMConfig[]` - All available LLMs

#### `apiKey: string | null`
OpenRouter API key

### Actions

#### Input Actions
- `setInputText(text: string): void` - Set input text
- `setInputFiles(files: File[]): void` - Set input files
- `setInputSource(source): void` - Set input source
- `clearInput(): void` - Clear all input

#### LLM Selection Actions
- `toggleLLM(llmId: string): void` - Toggle LLM selection
- `selectAllLLMs(): void` - Select all available LLMs
- `deselectAllLLMs(): void` - Deselect all LLMs

#### Execution Actions
- `executeParallel(): Promise<void>` - Execute Phase 1 (parallel)
- `cancelExecution(): void` - Cancel ongoing execution
- `clearResponses(): void` - Clear LLM responses

#### Judge Actions
- `setJudgeMode(mode): void` - Set judge synthesis mode
- `executeJudge(): Promise<void>` - Execute Phase 2 (judge)
- `clearJudgeResult(): void` - Clear judge result

#### API Key Actions
- `setApiKey(key: string): void` - Set OpenRouter API key

## Example Workflow

```tsx
import { useCouncilContext } from '@/contexts/CouncilContext';

function CouncilWorkflow() {
  const {
    setInputText,
    setApiKey,
    executeParallel,
    setJudgeMode,
    executeJudge,
    execution,
    judge,
  } = useCouncilContext();

  const handleWorkflow = async () => {
    // 1. Set API key
    setApiKey('your-openrouter-api-key');

    // 2. Set input
    setInputText('What are the pros and cons of TypeScript?');

    // 3. Execute Phase 1 (Parallel)
    await executeParallel();
    console.log('Phase 1 complete:', execution.llmResponses);

    // 4. Set judge mode
    setJudgeMode('ruthless-judge');

    // 5. Execute Phase 2 (Judge)
    await executeJudge();
    console.log('Phase 2 complete:', judge.result);
  };

  return (
    <button onClick={handleWorkflow}>
      Run Full Workflow
    </button>
  );
}
```

## Judge Modes

### Ruthless Judge
Critical analysis with brutal honesty. Filters weak arguments and highlights only high-confidence insights.

### Consensus Judge
Finds common ground among expert responses. Builds a unified perspective.

### Debate Judge
Highlights conflicts and disagreements. Weighs opposing arguments.

### Pipeline Judge
Sequential synthesis. Builds upon each insight in order.

## Available LLMs

The context includes 4 pre-configured LLMs via OpenRouter:

1. **GPT-4 Turbo** (OpenAI) 🤖
2. **Claude 3.5 Sonnet** (Anthropic) 🧠
3. **Gemini Pro** (Google) ✨
4. **DeepSeek** (DeepSeek) 🔮

## Error Handling

All execution functions return Promises and can throw errors:

```tsx
try {
  await executeParallel();
} catch (error) {
  console.error('Execution failed:', error);
  // Handle error appropriately
}
```

## TypeScript Support

All types are fully typed and exported:

```tsx
import type {
  InputState,
  ExecutionState,
  JudgeState,
  LLMSelectionState,
  CouncilContextValue,
} from '@/contexts/CouncilContext';
```

## Integration with Existing Stores

The `CouncilContext` is designed to work alongside the existing Zustand stores:

- Use `CouncilContext` for component-level state management
- Use existing stores (`useCouncilStore`) for global app state
- Both can coexist and complement each other

## Demo

See `src/examples/CouncilContextExample.tsx` for a complete working example.

## Requirements Checklist

✅ Manage two-phase workflow state
✅ Track input (text + files)
✅ Track LLM selection and responses
✅ Track execution progress
✅ Track judge state
✅ Provide actions for all operations

## License

Part of the Council V18 project.
