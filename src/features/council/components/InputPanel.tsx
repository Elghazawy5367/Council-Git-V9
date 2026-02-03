/**
 * InputPanel Component
 * 
 * REQUIREMENTS:
 * 1. Text input area with character counter
 * 2. File upload with tabs (Local/Drive/URL)
 * 3. File preview with remove option
 * 4. LLM selector (checkboxes)
 * 5. Single prominent "Run Council" button
 * 6. Button disabled when no text
 * 7. Loading state when running
 */

import { useState } from 'react';
import { useCouncilContext } from '@/contexts/CouncilContext';
import { Button } from '@/components/primitives/button';
import { Textarea } from '@/components/primitives/textarea';
import { Checkbox } from '@/components/primitives/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/primitives/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/primitives/tooltip';
import { Upload, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedFileUpload } from './EnhancedFileUpload';

const MAX_CHARS = 10000;

export function InputPanel() {
  const {
    input,
    execution,
    llmSelection,
    setInputText,
    setInputFiles,
    setInputSource,
    toggleLLM,
    executeParallel,
  } = useCouncilContext();

  const [uploadTab, setUploadTab] = useState<'local' | 'drive' | 'url'>('local');
  const [urlInput, setUrlInput] = useState('');

  const charCount = input.text.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isRunning = execution.isRunning;
  const canRun = input.text.trim().length > 0 && !isOverLimit && !isRunning && llmSelection.selectedLLMs.length > 0;

  // Handle Run Council
  const handleRunCouncil = async () => {
    try {
      await executeParallel();
      toast.success('Council execution started!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to run council');
    }
  };

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Council Input</span>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Enter your question or task, optionally attach files, select LLMs, and run the council for multi-perspective analysis.</p>
            </TooltipContent>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Input Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Your Question or Task</label>
              <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
                {charCount} / {MAX_CHARS}
              </span>
            </div>
            <Textarea
              value={input.text}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your question or task here... The council of AI experts will analyze it from multiple perspectives."
              className={`min-h-[150px] resize-none ${isOverLimit ? 'border-red-500' : ''}`}
              disabled={isRunning}
            />
            {isOverLimit && (
              <p className="text-xs text-red-500">
                Character limit exceeded. Please reduce your input.
              </p>
            )}
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Attach Files (Optional)</label>
            <Tabs value={uploadTab} onValueChange={(v) => {
              setUploadTab(v as 'local' | 'drive' | 'url');
              setInputSource(v as 'local' | 'drive' | 'url');
            }}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="local">Local Files</TabsTrigger>
                <TabsTrigger value="drive" disabled>
                  Google Drive
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 ml-1" />
                  </TooltipTrigger>
                </TabsTrigger>
                <TabsTrigger value="url" disabled>
                  URL
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 ml-1" />
                  </TooltipTrigger>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="local" className="mt-4">
                <EnhancedFileUpload
                  files={input.files}
                  onFilesChange={setInputFiles}
                  disabled={isRunning}
                  maxFiles={10}
                />
              </TabsContent>
              
              <TabsContent value="drive" className="text-center text-sm text-muted-foreground py-4">
                Google Drive integration coming soon...
              </TabsContent>
              
              <TabsContent value="url" className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Enter file URL..."
                    className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background"
                    disabled={isRunning}
                  />
                  <Button variant="outline" size="sm" disabled={isRunning || !urlInput}>
                    Add URL
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* LLM Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Select AI Models</label>
              <div className="text-xs text-muted-foreground">
                {llmSelection.selectedLLMs.length} / {llmSelection.availableLLMs.length} selected
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {llmSelection.availableLLMs.map((llm) => (
                <div
                  key={llm.id}
                  className="flex items-center space-x-3 p-3 rounded-md border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={`llm-${llm.id}`}
                    checked={llmSelection.selectedLLMs.includes(llm.id)}
                    onCheckedChange={() => toggleLLM(llm.id)}
                    disabled={isRunning}
                  />
                  <label
                    htmlFor={`llm-${llm.id}`}
                    className="flex-1 flex items-center gap-2 text-sm font-medium cursor-pointer"
                  >
                    <span className="text-lg">{llm.icon}</span>
                    <div>
                      <div>{llm.name}</div>
                      <div className="text-xs text-muted-foreground font-normal">{llm.provider}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            {llmSelection.selectedLLMs.length === 0 && (
              <p className="text-xs text-red-500">Please select at least one AI model</p>
            )}
          </div>

          {/* Run Council Button */}
          <Button
            onClick={handleRunCouncil}
            disabled={!canRun}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Running Council...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Run Council
              </>
            )}
          </Button>
          
          {!canRun && !isRunning && (
            <p className="text-xs text-center text-muted-foreground">
              {input.text.trim().length === 0 
                ? 'Enter a question or task to run the council'
                : llmSelection.selectedLLMs.length === 0 
                ? 'Select at least one AI model'
                : 'Check your input'}
            </p>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
