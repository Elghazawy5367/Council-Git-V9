/**
 * Demo page for JudgeSection component
 * Shows the component with mock data in different states
 */

import { useState } from 'react';
import { CouncilProvider } from '@/contexts/CouncilContext';
import { JudgeSection } from '@/features/council/components/JudgeSection';
import { Button } from '@/components/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/card';
import type { LLMResponse } from '@/services/openrouter';

// Mock LLM responses for testing
const mockResponses: LLMResponse[] = [
  {
    llmId: 'gpt4',
    llmName: 'GPT-4 Turbo',
    response: `# Analysis of the Problem

Based on my analysis, there are three key considerations:

1. **Technical Feasibility**: The approach is technically sound and can be implemented with current technology.
2. **Cost Effectiveness**: The solution offers good ROI with estimated savings of 30%.
3. **Timeline**: Implementation can be completed within 6 months.

## Recommendations

I recommend proceeding with Option A as it provides the best balance of cost and effectiveness.`,
    status: 'success',
    tokens: { prompt: 150, completion: 120, total: 270 },
    cost: 0.0054,
    timestamp: Date.now() - 5000,
  },
  {
    llmId: 'claude',
    llmName: 'Claude 3.5 Sonnet',
    response: `# Counterpoint Analysis

While I agree with the technical assessment, I have concerns about the timeline:

1. **Resource Constraints**: Current team capacity may not support a 6-month timeline.
2. **Risk Mitigation**: A 9-month timeline with phased rollout reduces risk significantly.
3. **Quality Assurance**: Rushing implementation could compromise quality.

## Alternative Recommendation

Consider Option B with extended timeline for better quality assurance.`,
    status: 'success',
    tokens: { prompt: 150, completion: 100, total: 250 },
    cost: 0.0050,
    timestamp: Date.now() - 3000,
  },
  {
    llmId: 'gemini',
    llmName: 'Gemini Pro',
    response: `# Comprehensive Evaluation

After reviewing both perspectives, here's a balanced view:

## Synthesis
- Technical feasibility: **Confirmed** ✓
- Cost effectiveness: **30% savings confirmed** ✓
- Timeline debate: **Valid concerns on both sides**

## Compromise Solution

I propose a hybrid approach:
1. Start with Option A for quick wins (3 months)
2. Phase 2 incorporates Option B improvements (additional 6 months)
3. Total timeline: 9 months with early value delivery

This addresses both speed and quality concerns.`,
    status: 'success',
    tokens: { prompt: 150, completion: 140, total: 290 },
    cost: 0.0058,
    timestamp: Date.now() - 1000,
  },
];

// Wrapper component to provide context
function JudgeSectionDemoInner() {
  const [showDemo, setShowDemo] = useState(true);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Judge Section Demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This demo shows the JudgeSection component with 3 successful LLM responses.
            </p>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Features Demonstrated:</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>✅ Conditional rendering (only shows with 2+ responses)</li>
                <li>✅ Display of successful LLMs</li>
                <li>✅ Radio buttons for judge mode selection (4 modes)</li>
                <li>✅ Run Judge button (executes synthesis)</li>
                <li>✅ Judge output display with markdown rendering</li>
                <li>✅ Collapsible sections for scores and contradictions</li>
                <li>✅ Copy and export functionality</li>
                <li>✅ Loading and error states</li>
              </ul>
            </div>

            <Button onClick={() => setShowDemo(!showDemo)} variant="outline">
              {showDemo ? 'Hide Demo' : 'Show Demo'}
            </Button>
          </CardContent>
        </Card>

        {showDemo && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Judge Section Component:</h2>
            <JudgeSection />
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">How to Use:</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>The component automatically shows when there are 2+ successful LLM responses</li>
                <li>Select a judge mode using the radio buttons (default: Ruthless Judge)</li>
                <li>Review which LLMs responded successfully (shown as badges)</li>
                <li>Click "Run Judge" to synthesize all responses</li>
                <li>View the synthesized output with markdown formatting</li>
                <li>Use Copy or Export buttons to save the output</li>
                <li>Expand Score Breakdown and Contradictions sections for details</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Judge Modes:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><strong>Ruthless Judge:</strong> Critical analysis with brutal honesty</li>
                <li><strong>Consensus Judge:</strong> Finds common ground and unified perspective</li>
                <li><strong>Debate Judge:</strong> Highlights conflicts and weighs arguments</li>
                <li><strong>Pipeline Judge:</strong> Sequential synthesis building on insights</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Integration:</h3>
              <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
{`import { CouncilProvider } from '@/contexts/CouncilContext';
import { JudgeSection } from '@/features/council/components/JudgeSection';

function App() {
  return (
    <CouncilProvider>
      <JudgeSection />
    </CouncilProvider>
  );
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Demo component with provider
export default function JudgeSectionDemo() {
  return (
    <CouncilProvider>
      <JudgeSectionDemoInner />
    </CouncilProvider>
  );
}
