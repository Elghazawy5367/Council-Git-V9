import React, { useState, Suspense, lazy } from 'react';
import { Copy, ChevronDown, ChevronUp, Code, Table, FileJson, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { languageMapping } from '@/lib/language-mapping';

// Lazy load MermaidDiagram
const MermaidDiagram = lazy(() => import('./MermaidDiagram'));

export interface Artifact {
  type: 'code' | 'mermaid' | 'table' | 'json' | 'markdown';
  language?: string;
  content: string;
  title?: string;
}

interface ArtifactCardProps {
  artifact: Artifact;
  defaultOpen?: boolean;
}

const DiagramLoader = () => (
  <div className="flex items-center justify-center p-4 bg-muted/30 rounded-lg">
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      Loading diagram...
    </div>
  </div>
);

const getArtifactIcon = (type: Artifact['type']) => {
  switch (type) {
    case 'code':
      return Code;
    case 'mermaid':
      return FileText;
    case 'table':
      return Table;
    case 'json':
      return FileJson;
    default:
      return FileText;
  }
};

const getArtifactTitle = (artifact: Artifact): string => {
  if (artifact.title) return artifact.title;
  switch (artifact.type) {
    case 'code':
      return `Code (${artifact.language || 'text'})`;
    case 'mermaid':
      return 'Diagram';
    case 'table':
      return 'Data Table';
    case 'json':
      return 'JSON Data';
    case 'markdown':
      return 'Formatted Text';
    default:
      return 'Artifact';
  }
};

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Icon = getArtifactIcon(artifact.type);
  const title = getArtifactTitle(artifact);

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content);
    toast.success('Copied to clipboard');
  };

  const renderContent = () => {
    switch (artifact.type) {
      case 'mermaid':
        return (
          <Suspense fallback={<DiagramLoader />}>
            <MermaidDiagram chart={artifact.content} className="w-full" />
          </Suspense>
        );

      case 'code':
        return (
          <div className="relative">
            <div className="absolute top-2 right-2 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/70 rounded">
              {languageMapping[artifact.language || ''] || artifact.language || 'text'}
            </div>
            <pre className="overflow-x-auto p-4 pt-8 rounded-lg bg-muted/40 border border-border/30 text-sm font-mono">
              <code>{artifact.content}</code>
            </pre>
          </div>
        );

      case 'json':
        return (
          <pre className="overflow-x-auto p-4 rounded-lg bg-muted/40 border border-border/30 text-sm font-mono">
            <code>{JSON.stringify(JSON.parse(artifact.content), null, 2)}</code>
          </pre>
        );

      case 'table':
      case 'markdown':
      default:
        return (
          <div className="p-3 bg-muted/20 rounded-lg border border-border/20">
            <pre className="whitespace-pre-wrap text-sm">{artifact.content}</pre>
          </div>
        );
    }
  };

  return (
    <Card className="my-4 border-primary/20 bg-gradient-to-br from-card to-muted/20 overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="py-2 px-3 bg-muted/30 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{title}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                {artifact.type}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopy}
                title="Copy content"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-3">{renderContent()}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ArtifactCard;
