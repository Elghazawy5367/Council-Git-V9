/**
 * Council Service Layer
 * Encapsulates business logic for council operations
 * Enhanced with AutoGen-style message passing
 */

import { Expert, ExecutionMode, SynthesisConfig, SynthesisResult, ExpertMessage, ConversationContext } from '@/features/council/lib/types';
import { callExpertStreaming } from '@/features/council/api/ai-client';
import { saveSession } from '@/features/council/lib/session-history';

export interface ExpertOutput {
  name: string;
  model: string;
  content: string;
}

export interface CostBreakdown {
  experts: number;
  synthesis: number;
  total: number;
}

export interface StreamingCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

export interface ExecutionContext {
  task: string;
  mode: ExecutionMode;
  activeExperts: Expert[];
  apiKey: string;
  synthesisConfig: SynthesisConfig;
  enableMessaging?: boolean; // Enable AutoGen-style messaging
}

export interface ExecutionResult {
  outputs: Record<string, { expertName: string; output: string; model: string }>;
  expertsCost: number;
  success: boolean;
  error?: Error;
  messages?: ExpertMessage[]; // Message history
  conversationContext?: Record<string, ConversationContext>; // Per-expert context
}

/**
 * Message passing state for council execution
 */
class MessagePassingState {
  private messages: ExpertMessage[] = [];
  private contexts: Map<string, ConversationContext> = new Map();

  constructor(private experts: Expert[]) {
    // Initialize conversation contexts for each expert
    experts.forEach(expert => {
      this.contexts.set(expert.id, {
        messages: [],
        previousResponses: {},
        conversationHistory: '',
        round: 0,
      });
    });
  }

  /**
   * Add a message to the conversation
   */
  addMessage(message: ExpertMessage): void {
    this.messages.push(message);
    
    // Update sender's context
    const senderContext = this.contexts.get(message.sender);
    if (senderContext) {
      senderContext.messages.push(message);
    }

    // Update recipient's context (if specified)
    if (message.recipient) {
      const recipientContext = this.contexts.get(message.recipient);
      if (recipientContext) {
        recipientContext.messages.push(message);
      }
    } else {
      // Broadcast: add to all contexts
      this.contexts.forEach((context, expertId) => {
        if (expertId !== message.sender) {
          context.messages.push(message);
        }
      });
    }
  }

  /**
   * Update an expert's response in all contexts
   */
  updateExpertResponse(expertId: string, expertName: string, output: string): void {
    // Add as a message
    const message: ExpertMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      sender: expertId,
      senderName: expertName,
      content: output,
      timestamp: new Date(),
      type: 'response',
    };
    
    this.addMessage(message);

    // Update previous responses in all contexts
    this.contexts.forEach(context => {
      context.previousResponses[expertId] = output;
    });
  }

  /**
   * Get conversation context for a specific expert
   */
  getContext(expertId: string): ConversationContext {
    const context = this.contexts.get(expertId);
    if (!context) {
      throw new Error(`No context found for expert ${expertId}`);
    }

    // Build formatted conversation history
    context.conversationHistory = this.formatConversationHistory(expertId);
    
    return context;
  }

  /**
   * Format conversation history for prompt
   */
  private formatConversationHistory(expertId: string): string {
    const context = this.contexts.get(expertId);
    if (!context || context.messages.length === 0) {
      return '';
    }

    const lines: string[] = ['## Previous Expert Responses\n'];
    
    // Group messages by sender
    const messagesBySender = new Map<string, ExpertMessage[]>();
    context.messages.forEach(msg => {
      const list = messagesBySender.get(msg.senderName) || [];
      list.push(msg);
      messagesBySender.set(msg.senderName, list);
    });

    // Format each expert's contributions
    messagesBySender.forEach((messages, senderName) => {
      lines.push(`### ${senderName}`);
      messages.forEach(msg => {
        const typeLabel = msg.type !== 'response' ? ` [${msg.type}]` : '';
        lines.push(`${msg.content}${typeLabel}\n`);
      });
      lines.push('');
    });

    return lines.join('\n');
  }

  /**
   * Get all messages
   */
  getAllMessages(): ExpertMessage[] {
    return [...this.messages];
  }

  /**
   * Get all contexts
   */
  getAllContexts(): Record<string, ConversationContext> {
    const result: Record<string, ConversationContext> = {};
    this.contexts.forEach((context, expertId) => {
      result[expertId] = { ...context };
    });
    return result;
  }

  /**
   * Increment round for all contexts
   */
  incrementRound(): void {
    this.contexts.forEach(context => {
      context.round++;
    });
  }
}

/**
 * Create a message from expert output
 */
export function createExpertMessage(
  expertId: string,
  expertName: string,
  content: string,
  type: ExpertMessage['type'] = 'response',
  recipient?: string,
  replyTo?: string
): ExpertMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    sender: expertId,
    senderName: expertName,
    recipient,
    content,
    timestamp: new Date(),
    type,
    replyTo,
  };
}

/**
 * Execute a single expert analysis
 * Enhanced with conversation context support
 */
export async function executeExpert(
  expert: Expert,
  task: string,
  mode: ExecutionMode,
  apiKey: string,
  callbacks: StreamingCallbacks,
  previousOutputs?: Record<string, string>,
  conversationContext?: ConversationContext
): Promise<{ output: string; cost: number }> {
  let finalContent = '';

  // Build additional context from conversation history
  let additionalContext: string | undefined;
  if (conversationContext && conversationContext.conversationHistory) {
    additionalContext = conversationContext.conversationHistory;
  }

  const result = await callExpertStreaming(
    expert,
    task,
    mode,
    apiKey,
    {
      onToken: callbacks.onToken,
      onComplete: (fullText) => {
        finalContent = fullText;
        callbacks.onComplete(fullText);
      },
      onError: callbacks.onError,
    },
    additionalContext,
    previousOutputs
  );

  return {
    output: finalContent,
    cost: result.cost,
  };
}

/**
 * Execute all experts in the council
 * Enhanced with AutoGen-style message passing
 * Now uses true parallel execution with Promise.allSettled() for better performance and error isolation
 */
export async function executeCouncilExperts(
  context: ExecutionContext,
  onExpertUpdate: (index: number, update: { output?: string; isLoading?: boolean; error?: string }) => void,
  onStatusUpdate: (message: string) => void
): Promise<ExecutionResult> {
  const collectedOutputs: Record<string, { expertName: string; output: string; model: string }> = {};
  let expertsCost = 0;

  // Initialize message passing state if enabled
  const messagingState = context.enableMessaging 
    ? new MessagePassingState(context.activeExperts)
    : null;

  // For parallel mode, execute all experts simultaneously
  if (context.mode === 'parallel') {
    onStatusUpdate('Running all experts in parallel...');
    
    // Initialize all experts as loading
    for (let i = 0; i < context.activeExperts.length; i++) {
      onExpertUpdate(i, { isLoading: true, output: '' });
    }

    // Execute all experts in parallel using Promise.allSettled for error isolation
    const expertPromises = context.activeExperts.map((expert, index) => {
      const conversationContext = messagingState?.getContext(expert.id);
      
      return executeExpert(
        expert,
        context.task,
        context.mode,
        context.apiKey,
        {
          onToken: (token) => {
            onExpertUpdate(index, { output: token });
          },
          onComplete: (fullText) => {
            // Complete callback handled in executeExpert
          },
          onError: (error) => {
            console.error(`Streaming error for expert ${expert.name}:`, error);
          },
        },
        undefined,
        conversationContext
      ).then(result => ({ index, expert, result, success: true }))
        .catch(error => ({ index, expert, error, success: false }))
    });

    const results = await Promise.allSettled(expertPromises);

    // Process results
    results.forEach((promiseResult, idx) => {
      if (promiseResult.status === 'fulfilled') {
        const { index, expert, result, success } = promiseResult.value;
        
        if (success && result) {
          collectedOutputs[expert.id] = {
            expertName: expert.name,
            output: result.output,
            model: expert.model,
          };
          expertsCost += result.cost;
          onExpertUpdate(index, { output: result.output, isLoading: false });
          
          // Update messaging state
          if (messagingState) {
            messagingState.updateExpertResponse(expert.id, expert.name, result.output);
          }
        } else {
          const errorMessage = 'Failed to generate output.';
          collectedOutputs[expert.id] = {
            expertName: expert.name,
            output: errorMessage,
            model: expert.model,
          };
          onExpertUpdate(index, { 
            output: errorMessage, 
            isLoading: false,
            error: promiseResult.value.error instanceof Error ? promiseResult.value.error.message : 'Unknown error'
          });
        }
      } else {
        // Promise.allSettled rejected (should not happen with our error handling)
        const expert = context.activeExperts[idx];
        const errorMessage = 'Failed to generate output.';
        collectedOutputs[expert.id] = {
          expertName: expert.name,
          output: errorMessage,
          model: expert.model,
        };
        onExpertUpdate(idx, { 
          output: errorMessage, 
          isLoading: false,
          error: promiseResult.reason?.message || 'Unknown error'
        });
      }
    });

    onStatusUpdate('All experts have completed their analysis!');
  } else {
    // For sequential/adversarial modes, execute one at a time
    for (let i = 0; i < context.activeExperts.length; i++) {
      const expert = context.activeExperts[i];
      onStatusUpdate(`${expert.name} is analyzing...`);
      onExpertUpdate(i, { isLoading: true, output: '' });

      const previousOutputs =
        context.mode === 'sequential' || context.mode === 'adversarial'
          ? Object.fromEntries(Object.entries(collectedOutputs).map(([id, data]) => [id, data.output]))
          : undefined;

      // Get conversation context for this expert
      const conversationContext = messagingState?.getContext(expert.id);

      try {
        const result = await executeExpert(
          expert,
          context.task,
          context.mode,
          context.apiKey,
          {
            onToken: (token) => {
              onExpertUpdate(i, { output: token });
            },
            onComplete: (fullText) => {
              // Complete callback handled in executeExpert
            },
            onError: (error) => {
              console.error(`Streaming error for expert ${expert.name}:`, error);
            },
          },
          previousOutputs,
          conversationContext
        );

        collectedOutputs[expert.id] = {
          expertName: expert.name,
          output: result.output,
          model: expert.model,
        };
        expertsCost += result.cost;

        onExpertUpdate(i, { output: result.output, isLoading: false });
        
        // Update messaging state
        if (messagingState) {
          messagingState.updateExpertResponse(expert.id, expert.name, result.output);
          messagingState.incrementRound();
        }
      } catch (error) {
        console.error(`Error with expert ${expert.name}:`, error);
        const errorMessage = 'Failed to generate output.';
        
        onExpertUpdate(i, { 
          output: errorMessage, 
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });

        collectedOutputs[expert.id] = {
          expertName: expert.name,
          output: errorMessage,
          model: expert.model,
        };
      }
    }
  }

  return {
    outputs: collectedOutputs,
    expertsCost,
    success: true,
    messages: messagingState?.getAllMessages(),
    conversationContext: messagingState?.getAllContexts(),
  };
}

/**
 * Save execution session to history
 */
export function saveExecutionSession(
  task: string,
  mode: ExecutionMode,
  activeExpertCount: number,
  activeExperts: Expert[],
  outputs: Record<string, { expertName: string; output: string; model: string }>,
  verdict: string,
  synthesisConfig: SynthesisConfig,
  cost: CostBreakdown
): void {
  saveSession({
    task,
    mode,
    activeExpertCount,
    experts: activeExperts.map((e) => ({ id: e.id, name: e.name, model: e.model })),
    outputs: Object.fromEntries(Object.entries(outputs).map(([id, data]) => [id, data.output])),
    verdict,
    synthesisConfig,
    cost,
  });
}

/**
 * Calculate total cost
 */
export function calculateTotalCost(expertsCost: number, synthesisCost: number): CostBreakdown {
  return {
    experts: expertsCost,
    synthesis: synthesisCost,
    total: expertsCost + synthesisCost,
  };
}
