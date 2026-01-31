/**
 * CouncilWorkflow Demo Page
 * 
 * Demonstrates the complete two-phase Council workflow with all components integrated.
 */

import { CouncilProvider } from '@/contexts/CouncilContext';
import { CouncilWorkflow } from '@/features/council/components/CouncilWorkflow';

export default function CouncilWorkflowDemo() {
  return (
    <CouncilProvider>
      <div className="min-h-screen bg-background">
        <CouncilWorkflow />
      </div>

      {/* Feature Information */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h2>Council Workflow Features</h2>
          
          <h3>Two-Phase Architecture</h3>
          <ul>
            <li><strong>Phase 1: Parallel Execution</strong> - All selected LLMs analyze your input simultaneously</li>
            <li><strong>Phase 2: Judge Synthesis</strong> - Intelligent synthesis of all responses using judge modes</li>
          </ul>

          <h3>Layout Components</h3>
          <ul>
            <li><strong>Input Panel</strong> - Text input, file upload, LLM selection, and Run Council button</li>
            <li><strong>Response Grid</strong> - Responsive grid displaying all LLM responses</li>
            <li><strong>Judge Section</strong> - Mode selection and synthesis results (appears after 2+ responses)</li>
          </ul>

          <h3>Responsive Design</h3>
          <ul>
            <li><strong>Mobile</strong> - Single column layout</li>
            <li><strong>Tablet</strong> - 2-column grid for responses</li>
            <li><strong>Desktop</strong> - 3-column grid for responses</li>
          </ul>

          <h3>Loading States</h3>
          <ul>
            <li><strong>Phase 1 Loading</strong> - Shows spinner while LLMs are processing</li>
            <li><strong>Phase 2 Loading</strong> - Shows spinner during judge synthesis</li>
            <li><strong>Empty State</strong> - Helpful message when no responses yet</li>
          </ul>

          <h3>Interactive Features</h3>
          <ul>
            <li>Feedback buttons (thumbs up/down) on each response</li>
            <li>Retry button for failed responses</li>
            <li>Copy and export functionality</li>
            <li>Collapsible response cards</li>
          </ul>

          <h3>Usage Instructions</h3>
          <ol>
            <li>Enter your question or task in the input area</li>
            <li>Optionally upload files (images, PDFs, text)</li>
            <li>Select which LLMs you want to use (default: all)</li>
            <li>Click "Run Council" to start Phase 1</li>
            <li>Wait for LLM responses to appear</li>
            <li>Once 2+ responses are ready, the Judge Section appears</li>
            <li>Select a judge mode (default: Ruthless Judge)</li>
            <li>Click "Run Judge" to synthesize all responses</li>
            <li>Review the unified synthesis result</li>
          </ol>

          <h3>Requirements Met</h3>
          <ul>
            <li>✅ Orchestrates two-phase workflow</li>
            <li>✅ Layout: Input Panel + Response Grid + Judge Section</li>
            <li>✅ Responsive grid for LLM cards (1/2/3 columns)</li>
            <li>✅ Handle loading states (both phases)</li>
            <li>✅ Show progress during execution</li>
          </ul>
        </div>
      </div>
    </CouncilProvider>
  );
}
