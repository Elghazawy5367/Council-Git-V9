/**
 * Example page demonstrating the InputPanel component
 */

import { CouncilProvider } from '@/contexts/CouncilContext';
import { InputPanel } from '@/features/council/components/InputPanel';

export default function InputPanelDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">InputPanel Component Demo</h1>
          <p className="text-muted-foreground">
            Comprehensive input interface for the Council AI system
          </p>
        </div>
        
        <CouncilProvider>
          <InputPanel />
        </CouncilProvider>

        <div className="prose prose-sm max-w-none">
          <h2>Features</h2>
          <ul>
            <li>✅ Text input with 10,000 character limit</li>
            <li>✅ Character counter (turns red when over limit)</li>
            <li>✅ File upload with drag-and-drop support</li>
            <li>✅ File tabs (Local/Drive/URL)</li>
            <li>✅ File validation (images, PDFs, text files)</li>
            <li>✅ File preview cards with remove buttons</li>
            <li>✅ LLM selector with checkboxes (4 models)</li>
            <li>✅ Prominent "Run Council" button</li>
            <li>✅ Button disabled when no text or no LLMs selected</li>
            <li>✅ Loading state with spinner</li>
            <li>✅ Tooltips for guidance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
