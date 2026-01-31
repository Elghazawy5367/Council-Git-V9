/**
 * LLMResponseCard Demo
 * Demonstrates all states and features of the LLMResponseCard component
 */

import { useState } from 'react';
import { LLMResponseCard } from '@/features/council/components/LLMResponseCard';
import type { LLMResponse } from '@/services/openrouter';
import { Button } from '@/components/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/card';

// Mock responses for demonstration
const mockResponses: LLMResponse[] = [
  {
    llmId: 'gpt4',
    llmName: 'GPT-4 Turbo',
    response: `# Analysis Results

Based on my analysis, here are the key findings:

## Key Points
- **Performance**: The system shows excellent response times
- **Scalability**: Can handle 10,000+ concurrent users
- **Cost**: Estimated at $0.05 per 1000 requests

## Code Example

\`\`\`typescript
interface Config {
  maxRetries: number;
  timeout: number;
}

const config: Config = {
  maxRetries: 3,
  timeout: 5000
};
\`\`\`

## Recommendations
1. Implement caching for frequently accessed data
2. Use connection pooling for database queries
3. Monitor error rates and set up alerts

> **Note**: These recommendations are based on current usage patterns and may need adjustment as the system scales.`,
    status: 'success',
    tokens: { prompt: 150, completion: 250, total: 400 },
    cost: 0.0042,
    timestamp: Date.now() - 120000,
  },
  {
    llmId: 'claude',
    llmName: 'Claude 3.5 Sonnet',
    response: `I agree with the previous analysis, but I'd like to add some important considerations:

### Security Considerations
- Always validate user input
- Use parameterized queries to prevent SQL injection
- Implement rate limiting

### Performance Optimization
Here's a comparison table:

| Approach | Latency | Cost | Scalability |
|----------|---------|------|-------------|
| Synchronous | 100ms | Low | Limited |
| Async | 50ms | Medium | Good |
| Event-driven | 20ms | High | Excellent |

The event-driven approach offers the best performance but requires more infrastructure investment.`,
    status: 'success',
    tokens: { prompt: 180, completion: 220, total: 400 },
    cost: 0.0038,
    timestamp: Date.now() - 90000,
  },
  {
    llmId: 'gemini',
    llmName: 'Gemini Pro',
    response: '',
    status: 'loading',
    timestamp: Date.now(),
  },
  {
    llmId: 'deepseek',
    llmName: 'DeepSeek',
    response: '',
    status: 'error',
    error: 'API rate limit exceeded. Please try again in a few minutes.',
    timestamp: Date.now() - 30000,
  },
];

export default function LLMResponseCardDemo() {
  const [responses, setResponses] = useState<LLMResponse[]>(mockResponses);
  const [feedbackLog, setFeedbackLog] = useState<string[]>([]);

  const handleFeedback = (llmId: string, type: 'up' | 'down') => {
    const log = `${llmId}: ${type === 'up' ? '👍 Thumbs Up' : '👎 Thumbs Down'}`;
    setFeedbackLog(prev => [log, ...prev]);
  };

  const handleRetry = (llmId: string) => {
    setResponses(prev => prev.map(r => 
      r.llmId === llmId 
        ? { ...r, status: 'loading' as const }
        : r
    ));
    
    // Simulate retry success after 2 seconds
    setTimeout(() => {
      setResponses(prev => prev.map(r => 
        r.llmId === llmId 
          ? { 
              ...r, 
              status: 'success' as const,
              response: `Retry successful! Here's the response from ${r.llmName}.\n\n## New Analysis\n\nAfter retrying, I can now provide the following insights:\n\n- The issue was temporary\n- System is now responding normally\n- All checks passed`,
              tokens: { prompt: 100, completion: 150, total: 250 },
              cost: 0.0025,
            }
          : r
      ));
    }, 2000);
  };

  const resetDemo = () => {
    setResponses(mockResponses);
    setFeedbackLog([]);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">LLMResponseCard Component Demo</h1>
          <p className="text-muted-foreground">
            Showcasing all states: success, loading, and error
          </p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={resetDemo} variant="outline">
              Reset Demo
            </Button>
          </CardContent>
        </Card>

        {/* Response Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">LLM Responses</h2>
          {responses.map((response) => (
            <LLMResponseCard
              key={response.llmId}
              response={response}
              onFeedback={(type) => handleFeedback(response.llmId, type)}
              onRetry={() => handleRetry(response.llmId)}
            />
          ))}
        </div>

        {/* Feedback Log */}
        {feedbackLog.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Feedback Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {feedbackLog.map((log, index) => (
                  <div key={index} className="text-sm text-muted-foreground font-mono">
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feature List */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <h3>All Requirements Implemented:</h3>
              <ul>
                <li>✅ Header with LLM icon, name, and provider badge</li>
                <li>✅ Content area with markdown-rendered response (via SafeMarkdown)</li>
                <li>✅ Footer with 4 buttons: thumbs up/down, retry, copy, export</li>
                <li>✅ Status indicators: loading (skeleton), success, error</li>
                <li>✅ Collapsible/expandable functionality</li>
                <li>✅ Syntax highlighting for code blocks (via SafeMarkdown)</li>
              </ul>
              
              <h3>Additional Features:</h3>
              <ul>
                <li>✅ Token count and cost display</li>
                <li>✅ Timestamp display</li>
                <li>✅ Toast notifications for user actions</li>
                <li>✅ Copy to clipboard</li>
                <li>✅ Export as markdown file</li>
                <li>✅ Feedback state management (highlight selected feedback)</li>
                <li>✅ Error state with detailed error messages</li>
                <li>✅ Loading state with skeleton placeholders</li>
                <li>✅ Scrollable content area (max 600px height)</li>
                <li>✅ Responsive design</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
