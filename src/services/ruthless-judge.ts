/**
 * Ruthless Judge Service
 * 
 * REQUIREMENTS:
 * 1. Take array of LLM responses
 * 2. Use GPT-4 (via OpenRouter) as the judge
 * 3. Extract key points from each response
 * 4. Identify contradictions
 * 5. Score each response on accuracy, completeness, conciseness
 * 6. Synthesize unified answer with citations
 * 7. Provide judge commentary explaining choices
 */

import OpenRouterService, { LLMResponse } from './openrouter';

// Score breakdown for a single LLM
interface ScoreDetail {
  accuracy: number;       // 0-100
  completeness: number;   // 0-100
  conciseness: number;    // 0-100
  total: number;          // Average of above
}

// Judgment result interface
export interface JudgmentResult {
  unifiedResponse: string; // Markdown formatted unified answer
  scoreBreakdown: { [llmId: string]: ScoreDetail };
  contradictions: string[];
  confidence: number; // 0-100
  judgeCommentary: string;
}

// Internal structured response from judge
interface JudgeStructuredResponse {
  unifiedResponse: string;
  scores: {
    [llmId: string]: {
      accuracy: number;
      completeness: number;
      conciseness: number;
      reasoning: string;
    };
  };
  contradictions: string[];
  confidence: number;
  commentary: string;
}

class RuthlessJudgeService {
  private openRouterService: OpenRouterService;
  private judgeModel = 'openai/gpt-4-turbo-preview'; // GPT-4 for judging
  
  constructor(apiKey: string) {
    this.openRouterService = new OpenRouterService(apiKey);
  }

  /**
   * Judge multiple LLM responses and synthesize a unified answer
   */
  async judge(responses: LLMResponse[]): Promise<JudgmentResult> {
    // Log judgment start
    console.log('[Judge] Running judgment', {
      responsesCount: responses.length,
      llms: responses.map(r => r.llmId)
    });

    // Handle edge cases
    if (responses.length === 0) {
      console.log('[Judge] No responses to judge');
      return this.handleNoResponses();
    }

    const successfulResponses = responses.filter(r => r.status === 'success' && r.response.trim());
    console.log('[Judge] Successful responses', {
      count: successfulResponses.length,
      llms: successfulResponses.map(r => r.llmId)
    });
    
    if (successfulResponses.length === 0) {
      return this.handleAllFailures(responses);
    }

    if (successfulResponses.length === 1) {
      return this.handleSingleResponse(successfulResponses[0]);
    }

    // Create judge prompt
    const judgePrompt = this.createJudgePrompt(successfulResponses);

    try {
      // Call GPT-4 as the judge
      console.log('[Judge] Calling GPT-4 judge with prompt length:', judgePrompt.length);
      const judgeResponse = await this.callJudge(judgePrompt);
      
      // Parse and validate response
      const parsedResult = this.parseJudgeResponse(judgeResponse, successfulResponses);
      
      console.log('[Judge] Judgment complete', {
        confidence: parsedResult.confidence,
        contradictions: parsedResult.contradictions.length,
        llmsScored: Object.keys(parsedResult.scoreBreakdown).length
      });
      
      return parsedResult;
    } catch (error) {
      console.error('[Judge] Judge error:', error);
      console.log('[Judge] Using fallback judgment');
      // Fallback: return basic synthesis
      return this.createFallbackJudgment(successfulResponses);
    }
  }

  /**
   * Create detailed prompt for the judge
   */
  private createJudgePrompt(responses: LLMResponse[]): string {
    const responsesFormatted = responses.map((resp, index) => {
      return `
### Response ${index + 1}: ${resp.llmName} (ID: ${resp.llmId})
${resp.response}
`;
    }).join('\n---\n');

    return `You are a ruthless AI judge tasked with evaluating multiple AI responses to synthesize the best possible answer.

**YOUR TASK:**
1. Carefully analyze each response below
2. Extract key points from each
3. Identify any contradictions between responses
4. Score each response on three criteria (0-100 scale):
   - **Accuracy**: Factual correctness and truthfulness
   - **Completeness**: How thorough and comprehensive the answer is
   - **Conciseness**: How clear and well-organized the answer is
5. Synthesize a unified answer that combines the best elements from all responses
6. Include citations (e.g., "[Response 1]" or "[GPT-4]") when you use information from a specific response
7. Provide commentary explaining your scoring and synthesis decisions

**RESPONSES TO EVALUATE:**
${responsesFormatted}

**CRITICAL: Respond ONLY with valid JSON in this exact format:**
\`\`\`json
{
  "unifiedResponse": "# Synthesized Answer\\n\\nYour unified answer here with [citations]...",
  "scores": {
    "${responses[0].llmId}": {
      "accuracy": 85,
      "completeness": 90,
      "conciseness": 80,
      "reasoning": "Brief explanation of scores"
    }
    // ... scores for each llmId
  },
  "contradictions": [
    "Description of any contradictions found",
    "Another contradiction if any"
  ],
  "confidence": 85,
  "commentary": "Detailed explanation of your judging process, what you considered, and why you made the choices you did in the synthesis."
}
\`\`\`

**INSTRUCTIONS:**
- Be ruthless but fair in your scoring
- The unified response should be in Markdown format
- Include specific citations to attribute ideas
- If there are no contradictions, use an empty array
- Confidence should reflect how certain you are about the unified answer
- Commentary should be thorough and explain your reasoning

Respond with ONLY the JSON, no other text.`;
  }

  /**
   * Call GPT-4 as the judge
   */
  private async callJudge(prompt: string): Promise<string> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${(this.openRouterService as any).apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://council-app.local',
        'X-Title': 'The Council V18 - Ruthless Judge',
      },
      body: JSON.stringify({
        model: this.judgeModel,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent judging
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Judge API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Parse judge response and validate structure
   */
  private parseJudgeResponse(judgeResponse: string, originalResponses: LLMResponse[]): JudgmentResult {
    try {
      // Extract JSON from response (might be wrapped in ```json```)
      let jsonStr = judgeResponse.trim();
      const jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }

      const parsed: JudgeStructuredResponse = JSON.parse(jsonStr);

      // Calculate totals and create score breakdown
      const scoreBreakdown: { [llmId: string]: ScoreDetail } = {};
      
      for (const [llmId, scores] of Object.entries(parsed.scores)) {
        const total = Math.round((scores.accuracy + scores.completeness + scores.conciseness) / 3);
        scoreBreakdown[llmId] = {
          accuracy: scores.accuracy,
          completeness: scores.completeness,
          conciseness: scores.conciseness,
          total,
        };
      }

      // Ensure all original LLMs have scores (use default if missing)
      originalResponses.forEach(resp => {
        if (!scoreBreakdown[resp.llmId]) {
          scoreBreakdown[resp.llmId] = {
            accuracy: 50,
            completeness: 50,
            conciseness: 50,
            total: 50,
          };
        }
      });

      return {
        unifiedResponse: parsed.unifiedResponse || 'No unified response generated.',
        scoreBreakdown,
        contradictions: parsed.contradictions || [],
        confidence: Math.max(0, Math.min(100, parsed.confidence || 0)),
        judgeCommentary: parsed.commentary || 'No commentary provided.',
      };
    } catch (error) {
      console.error('Failed to parse judge response:', error);
      // Return fallback if parsing fails
      return this.createFallbackJudgment(originalResponses);
    }
  }

  /**
   * Handle case with no responses
   */
  private handleNoResponses(): JudgmentResult {
    return {
      unifiedResponse: '# No Responses Available\n\nNo LLM responses were provided for evaluation.',
      scoreBreakdown: {},
      contradictions: [],
      confidence: 0,
      judgeCommentary: 'No responses were available to judge.',
    };
  }

  /**
   * Handle case where all responses failed
   */
  private handleAllFailures(responses: LLMResponse[]): JudgmentResult {
    const scoreBreakdown: { [llmId: string]: ScoreDetail } = {};
    
    responses.forEach(resp => {
      scoreBreakdown[resp.llmId] = {
        accuracy: 0,
        completeness: 0,
        conciseness: 0,
        total: 0,
      };
    });

    return {
      unifiedResponse: '# All Responses Failed\n\nUnfortunately, all LLM responses encountered errors and no valid content is available.',
      scoreBreakdown,
      contradictions: [],
      confidence: 0,
      judgeCommentary: 'All LLM responses failed or returned empty content.',
    };
  }

  /**
   * Handle case with only one successful response
   */
  private handleSingleResponse(response: LLMResponse): JudgmentResult {
    return {
      unifiedResponse: `# Response from ${response.llmName}\n\n${response.response}`,
      scoreBreakdown: {
        [response.llmId]: {
          accuracy: 75,
          completeness: 75,
          conciseness: 75,
          total: 75,
        },
      },
      contradictions: [],
      confidence: 60,
      judgeCommentary: `Only one successful response was available from ${response.llmName}. No comparison or synthesis was possible, so the single response is presented as-is with moderate scores.`,
    };
  }

  /**
   * Create fallback judgment if judge fails
   */
  private createFallbackJudgment(responses: LLMResponse[]): JudgmentResult {
    const scoreBreakdown: { [llmId: string]: ScoreDetail } = {};
    
    responses.forEach(resp => {
      scoreBreakdown[resp.llmId] = {
        accuracy: 60,
        completeness: 60,
        conciseness: 60,
        total: 60,
      };
    });

    // Simple concatenation of responses
    const unifiedResponse = `# Combined Responses\n\n${responses.map(r => 
      `## ${r.llmName}\n\n${r.response}`
    ).join('\n\n---\n\n')}`;

    return {
      unifiedResponse,
      scoreBreakdown,
      contradictions: ['Unable to analyze contradictions due to judge failure.'],
      confidence: 40,
      judgeCommentary: 'The judge failed to analyze the responses properly. This is a basic concatenation of all available responses without detailed analysis.',
    };
  }
}

export default RuthlessJudgeService;
export type { JudgmentResult, ScoreDetail };
