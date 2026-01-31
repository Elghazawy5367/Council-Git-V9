# Ruthless Judge Service

## Overview

The **Ruthless Judge Service** is a sophisticated evaluation system that analyzes multiple LLM responses, scores them on various criteria, identifies contradictions, and synthesizes a unified answer with proper citations.

## Features

✅ **Multi-Response Evaluation**: Analyzes responses from multiple LLMs
✅ **Scoring System**: Rates each response on accuracy, completeness, and conciseness (0-100 scale)
✅ **Contradiction Detection**: Identifies conflicts between different responses
✅ **Unified Synthesis**: Combines best elements from all responses with citations
✅ **Judge Commentary**: Provides detailed reasoning for decisions
✅ **Edge Case Handling**: Gracefully handles single responses, failures, and errors
✅ **GPT-4 Powered**: Uses GPT-4 Turbo as the judge for high-quality analysis

## Installation

The service is already included in the repository:
- **Implementation**: `src/services/ruthless-judge.ts`
- **Examples**: `src/examples/RuthlessJudgeExample.tsx`
- **Documentation**: `docs/RuthlessJudge.md`

## Usage

### Basic Usage

```typescript
import RuthlessJudgeService from '@/services/ruthless-judge';
import { LLMResponse } from '@/services/openrouter';

// Initialize the service with your OpenRouter API key
const judge = new RuthlessJudgeService(apiKey);

// Get responses from LLMs
const responses: LLMResponse[] = [
  // ... your LLM responses
];

// Judge the responses
const result = await judge.judge(responses);

// Access the results
console.log('Unified Response:', result.unifiedResponse);
console.log('Confidence:', result.confidence);
console.log('Contradictions:', result.contradictions);

// View scores for each LLM
Object.entries(result.scoreBreakdown).forEach(([llmId, scores]) => {
  console.log(`${llmId}:`);
  console.log(`  Accuracy: ${scores.accuracy}/100`);
  console.log(`  Completeness: ${scores.completeness}/100`);
  console.log(`  Conciseness: ${scores.conciseness}/100`);
  console.log(`  Total: ${scores.total}/100`);
});
```

### Integration with CouncilContext

```typescript
import { useCouncilContext } from '@/contexts/CouncilContext';
import RuthlessJudgeService from '@/services/ruthless-judge';

function MyComponent() {
  const { execution, apiKey } = useCouncilContext();

  const runJudge = async () => {
    if (!apiKey || execution.llmResponses.length === 0) {
      return;
    }

    const judge = new RuthlessJudgeService(apiKey);
    const result = await judge.judge(execution.llmResponses);

    // Display unified response
    setUnifiedAnswer(result.unifiedResponse);
    setConfidence(result.confidence);
  };

  return <button onClick={runJudge}>Judge Responses</button>;
}
```

## API Reference

### `RuthlessJudgeService`

The main service class for judging LLM responses.

#### Constructor

```typescript
constructor(apiKey: string)
```

**Parameters:**
- `apiKey`: Your OpenRouter API key

#### Methods

##### `judge(responses: LLMResponse[]): Promise<JudgmentResult>`

Evaluates multiple LLM responses and returns a comprehensive judgment.

**Parameters:**
- `responses`: Array of LLM responses to evaluate

**Returns:** `Promise<JudgmentResult>`

**Throws:** Error if the judge API call fails (gracefully handles with fallback)

## Types

### `JudgmentResult`

The complete result from the judging process.

```typescript
interface JudgmentResult {
  unifiedResponse: string;       // Markdown formatted unified answer
  scoreBreakdown: {               // Scores for each LLM
    [llmId: string]: ScoreDetail;
  };
  contradictions: string[];       // List of identified contradictions
  confidence: number;             // 0-100 confidence in the result
  judgeCommentary: string;        // Judge's reasoning and explanation
}
```

### `ScoreDetail`

Individual scores for a single LLM response.

```typescript
interface ScoreDetail {
  accuracy: number;       // 0-100: Factual correctness
  completeness: number;   // 0-100: How thorough the answer is
  conciseness: number;    // 0-100: Clarity and organization
  total: number;          // Average of the three scores
}
```

## Scoring Criteria

### Accuracy (0-100)
- **100-90**: Completely accurate, no factual errors
- **89-70**: Mostly accurate with minor issues
- **69-50**: Some inaccuracies but generally correct
- **49-30**: Multiple factual errors
- **29-0**: Mostly or completely inaccurate

### Completeness (0-100)
- **100-90**: Thoroughly addresses all aspects
- **89-70**: Covers most important points
- **69-50**: Addresses main points but misses details
- **49-30**: Incomplete, missing key information
- **29-0**: Barely addresses the question

### Conciseness (0-100)
- **100-90**: Clear, well-organized, no redundancy
- **89-70**: Generally clear with minor issues
- **69-50**: Somewhat verbose or unclear
- **49-30**: Poorly organized or very verbose
- **29-0**: Confusing, disorganized, or overly verbose

## Judgment Process

1. **Input Validation**: Checks for edge cases (no responses, all failures, single response)
2. **Prompt Creation**: Generates detailed instructions for GPT-4 judge
3. **GPT-4 Analysis**: Sends all responses to GPT-4 for evaluation
4. **Response Parsing**: Extracts structured JSON from judge's response
5. **Score Calculation**: Computes total scores and validates ranges
6. **Result Assembly**: Creates final `JudgmentResult` with all components

## Edge Cases

### No Responses
```typescript
// Returns a default result indicating no responses available
{
  unifiedResponse: '# No Responses Available...',
  scoreBreakdown: {},
  contradictions: [],
  confidence: 0,
  judgeCommentary: 'No responses were available to judge.'
}
```

### All Failed Responses
```typescript
// Returns a result indicating all failures
{
  unifiedResponse: '# All Responses Failed...',
  scoreBreakdown: { /* 0 scores for each */ },
  contradictions: [],
  confidence: 0,
  judgeCommentary: 'All LLM responses failed...'
}
```

### Single Successful Response
```typescript
// Returns the single response with moderate scores
{
  unifiedResponse: '# Response from [LLM Name]...',
  scoreBreakdown: { [llmId]: { accuracy: 75, ... } },
  contradictions: [],
  confidence: 60,
  judgeCommentary: 'Only one successful response...'
}
```

### Judge API Failure
If the judge itself fails, the service provides a fallback:
```typescript
{
  unifiedResponse: '# Combined Responses\n\n...',
  scoreBreakdown: { /* 60 scores for each */ },
  contradictions: ['Unable to analyze contradictions...'],
  confidence: 40,
  judgeCommentary: 'The judge failed to analyze...'
}
```

## Configuration

The service uses the following defaults:

- **Judge Model**: `openai/gpt-4-turbo-preview`
- **Temperature**: 0.3 (for consistent judging)
- **Max Tokens**: 4000 (for detailed responses)

These can be modified in the service implementation if needed.

## Examples

### Example 1: Basic Judging

```typescript
const judge = new RuthlessJudgeService(apiKey);

const responses = [
  { llmId: 'gpt4', llmName: 'GPT-4', response: '...', status: 'success', timestamp: Date.now() },
  { llmId: 'claude', llmName: 'Claude', response: '...', status: 'success', timestamp: Date.now() },
];

const result = await judge.judge(responses);
console.log(result.unifiedResponse);
```

### Example 2: Displaying Scores

```typescript
const result = await judge.judge(responses);

// Create a score table
const scoreTable = Object.entries(result.scoreBreakdown).map(([llmId, scores]) => ({
  llm: llmId,
  accuracy: scores.accuracy,
  completeness: scores.completeness,
  conciseness: scores.conciseness,
  total: scores.total,
}));

console.table(scoreTable);
```

### Example 3: Handling Contradictions

```typescript
const result = await judge.judge(responses);

if (result.contradictions.length > 0) {
  console.log('⚠️  Contradictions found:');
  result.contradictions.forEach((contradiction, i) => {
    console.log(`${i + 1}. ${contradiction}`);
  });
} else {
  console.log('✅ No contradictions found');
}
```

## Performance

- **Average judging time**: 5-15 seconds (depends on response length)
- **Token usage**: ~1000-3000 tokens per judgment
- **Cost**: ~$0.01-0.03 per judgment (GPT-4 rates)

## Error Handling

The service implements comprehensive error handling:

1. **Input validation**: Checks for empty or invalid inputs
2. **API errors**: Catches and handles OpenRouter API failures
3. **Parsing errors**: Falls back to basic synthesis if JSON parsing fails
4. **Timeout handling**: Uses reasonable timeouts for API calls
5. **Graceful degradation**: Always returns a valid `JudgmentResult`, even on errors

## Best Practices

1. **Filter responses**: Remove failed responses before judging for better results
2. **Check confidence**: Use the confidence score to determine result reliability
3. **Review contradictions**: Important to understand where LLMs disagree
4. **Use citations**: The unified response includes citations - trace back to sources
5. **Monitor costs**: Each judgment uses GPT-4, track API usage

## Limitations

- Requires valid OpenRouter API key with GPT-4 access
- Judge quality depends on GPT-4's performance
- Longer responses may hit token limits
- Cannot judge visual or audio content (text only)
- Scoring is subjective and based on GPT-4's interpretation

## Future Enhancements

Potential improvements for future versions:

- [ ] Support for different judge models (Claude, Gemini)
- [ ] Customizable scoring criteria
- [ ] Parallel judging for very large response sets
- [ ] Caching of judgments for identical response sets
- [ ] Detailed citation tracking with source mapping
- [ ] Multi-language support
- [ ] Scoring explanations per criterion

## License

Part of the Council V18 project.

## Related

- [OpenRouter Service](./OpenRouter.md)
- [CouncilContext](./CouncilContext.md)
- [Two-Phase Architecture](./CouncilContext-Architecture.md)
