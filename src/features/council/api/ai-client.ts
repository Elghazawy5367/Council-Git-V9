// OpenRouter AI Client - Real API integration
import { Expert, ExecutionMode } from '@/lib/types';
import { buildSystemPrompt, MAGNIFICENT_7_FLEET } from '@/lib/config';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

// Calculate cost based on model and tokens
export function calculateCost(modelId: string, promptTokens: number, completionTokens: number): number {
  const model = MAGNIFICENT_7_FLEET.find(m => m.id === modelId);
  if (!model) return 0;
  
  // costPer1k is per 1000 output tokens (simplified)
  const outputCost = (completionTokens / 1000) * model.costPer1k;
  const inputCost = (promptTokens / 1000) * (model.costPer1k * 0.1); // Input typically 10% of output cost
  return outputCost + inputCost;
}

// Non-streaming API call
export async function callExpert(
  expert: Expert,
  task: string,
  mode: ExecutionMode,
  apiKey: string,
  additionalContext?: string,
  previousOutputs?: Record<string, string>
): Promise<{ output: string; cost: number; tokens: { prompt: number; completion: number } }> {
  const systemPrompt = buildSystemPrompt(expert, mode, additionalContext);
  
  let userPrompt = `TASK: ${task}`;
  
  // For pipeline mode, include previous outputs
  if (mode === 'pipeline' && previousOutputs && Object.keys(previousOutputs).length > 0) {
    userPrompt += '\n\n--- PREVIOUS EXPERT ANALYSES ---\n';
    for (const [expertId, output] of Object.entries(previousOutputs)) {
      userPrompt += `\n[Expert ${expertId}]:\n${output}\n`;
    }
    userPrompt += '--- END PREVIOUS ANALYSES ---\n\nBuild upon these insights with your unique perspective.';
  }
  
  // For debate mode, you might want to include opposing arguments
  if (mode === 'debate' && previousOutputs && Object.keys(previousOutputs).length > 0) {
    userPrompt += '\n\n--- OTHER EXPERT POSITIONS ---\n';
    for (const [expertId, output] of Object.entries(previousOutputs)) {
      userPrompt += `\n[${expertId}]:\n${output}\n`;
    }
    userPrompt += '--- END POSITIONS ---\n\nChallenge these positions and defend your own view.';
  }

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'The Council V18',
    },
    body: JSON.stringify({
      model: expert.model,
      messages,
      temperature: expert.config.temperature,
      max_tokens: expert.config.maxTokens,
      top_p: expert.config.topP,
      presence_penalty: expert.config.presencePenalty,
      frequency_penalty: expert.config.frequencyPenalty,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const data: OpenRouterResponse = await response.json();
  const output = data.choices[0]?.message?.content || 'No response generated';
  
  const promptTokens = data.usage?.prompt_tokens || 0;
  const completionTokens = data.usage?.completion_tokens || 0;
  const cost = calculateCost(expert.model, promptTokens, completionTokens);

  return {
    output,
    cost,
    tokens: { prompt: promptTokens, completion: completionTokens },
  };
}

// Streaming API call
export async function callExpertStreaming(
  expert: Expert,
  task: string,
  mode: ExecutionMode,
  apiKey: string,
  callbacks: StreamCallbacks,
  additionalContext?: string,
  previousOutputs?: Record<string, string>
): Promise<{ cost: number }> {
  const systemPrompt = buildSystemPrompt(expert, mode, additionalContext);
  
  let userPrompt = `TASK: ${task}`;
  
  if (mode === 'pipeline' && previousOutputs && Object.keys(previousOutputs).length > 0) {
    userPrompt += '\n\n--- PREVIOUS EXPERT ANALYSES ---\n';
    for (const [expertId, output] of Object.entries(previousOutputs)) {
      userPrompt += `\n[Expert ${expertId}]:\n${output}\n`;
    }
    userPrompt += '--- END PREVIOUS ANALYSES ---\n\nBuild upon these insights.';
  }

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'The Council V18',
    },
    body: JSON.stringify({
      model: expert.model,
      messages,
      temperature: expert.config.temperature,
      max_tokens: expert.config.maxTokens,
      top_p: expert.config.topP,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let fullText = '';
  let estimatedTokens = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

      for (const line of lines) {
        const data = line.replace('data: ', '').trim();
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullText += content;
            estimatedTokens += 1; // Rough estimate
            callbacks.onToken(content);
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }

    callbacks.onComplete(fullText);
    
    // Estimate cost (rough calculation since streaming doesn\'t return exact tokens)
    const estimatedPromptTokens = Math.ceil((systemPrompt.length + userPrompt.length) / 4);
    const cost = calculateCost(expert.model, estimatedPromptTokens, estimatedTokens);
    
    return { cost };
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error('Stream error'));
    throw error;
  }
}

// Synthesize verdict from all expert outputs
export async function synthesizeVerdict(
  expertOutputs: Record<string, { expertName: string; output: string }>,
  task: string,
  mode: ExecutionMode,
  apiKey: string
): Promise<{ verdict: string; cost: number }> {
  // Use Gemini Flash for synthesis (fast and good at summarization)
  const synthesizerModel = 'google/gemini-2.0-flash-001';
  
  const systemPrompt = `You are "The Synthesizer" - a master at distilling insights from multiple expert perspectives into a cohesive, actionable verdict.

Your task is to:
1. Identify points of CONSENSUS across all experts
2. Highlight UNIQUE INSIGHTS that only specific experts raised
3. Resolve any CONFLICTS between expert opinions with reasoned judgment
4. Provide a clear, actionable RECOMMENDATION

Structure your response as:
## Council Verdict

### Consensus Points
[List 3-5 key agreements]

### Unique Insights
[Credit specific experts for their unique contributions]

### Resolved Conflicts
[If any experts disagreed, explain how you resolved it]

### Unified Recommendation
[Clear, actionable next steps]

### Confidence Level
[Percentage based on expert agreement and evidence quality]`;

  let userPrompt = `ORIGINAL TASK: ${task}\n\nMODE: ${mode}\n\n--- EXPERT ANALYSES ---\n`;
  
  for (const [expertId, data] of Object.entries(expertOutputs)) {
    userPrompt += `\n### ${data.expertName}\n${data.output}\n`;
  }
  
  userPrompt += '\n--- END EXPERT ANALYSES ---\n\nSynthesize these perspectives into a unified verdict.';

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'The Council V18 - Synthesizer',
    },
    body: JSON.stringify({
      model: synthesizerModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // Lower temp for more focused synthesis
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Synthesis error: ${response.status}`);
  }

  const data: OpenRouterResponse = await response.json();
  const verdict = data.choices[0]?.message?.content || 'Synthesis failed';
  
  const model = MAGNIFICENT_7_FLEET.find(m => m.id === synthesizerModel);
  const cost = model ? calculateCost(synthesizerModel, data.usage?.prompt_tokens || 0, data.usage?.completion_tokens || 0) : 0;

  return { verdict, cost };
}
