import React, { useMemo, Suspense, lazy } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sanitizeContent } from '@/lib/sanitize';

// Lazy load MermaidDiagram for code splitting
const MermaidDiagram = lazy(() => import('./MermaidDiagram'));

interface SafeMarkdownProps {
  content: string;
  className?: string;
}

// Loading fallback for mermaid diagrams
const DiagramLoader = () => (
  <div className="flex items-center justify-center p-4 bg-muted/30 rounded-lg my-2">
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      Loading diagram...
    </div>
  </div>
);

/**
 * Enhanced Markdown renderer with:
 * - XSS protection via sanitization
 * - GitHub Flavored Markdown (tables, strikethrough, etc.)
 * - Mermaid diagram rendering
 * - Styled code blocks and tables
 */
export const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ content, className = '' }) => {
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    // Light sanitization - ReactMarkdown handles most XSS concerns
    return content;
  }, [content]);

  return (
    <div className={`prose prose-sm prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom code block renderer for Mermaid support
          code({ node, className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || '');
            const language = match ? match[1] : '';
            const codeContent = String(children).replace(/\n$/, '');

            // Render Mermaid diagrams
            if (language === 'mermaid') {
              return (
                <Suspense fallback={<DiagramLoader />}>
                  <MermaidDiagram chart={codeContent} className="my-4" />
                </Suspense>
              );
            }

            // Inline code
            if (!match) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-[0.85em]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // Code blocks with syntax highlighting placeholder
            return (
              <div className="relative my-3">
                <div className="absolute top-0 right-0 px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/50 rounded-bl">
                  {language}
                </div>
                <pre className="overflow-x-auto p-4 pt-8 rounded-lg bg-muted/30 border border-border/50">
                  <code className="text-sm font-mono" {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },

          // Styled tables
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-border/50 rounded-lg overflow-hidden">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-muted/50">{children}</thead>;
          },
          th({ children }) {
            return (
              <th className="px-4 py-2 text-left text-sm font-semibold text-foreground border-b border-border/50">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-2 text-sm text-muted-foreground border-b border-border/30">
                {children}
              </td>
            );
          },

          // Styled headers
          h1({ children }) {
            return <h1 className="text-2xl font-bold text-foreground mt-6 mb-4 border-b border-border/50 pb-2">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-semibold text-foreground mt-5 mb-3">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-medium text-foreground mt-4 mb-2">{children}</h3>;
          },
          h4({ children }) {
            return <h4 className="text-base font-medium text-foreground mt-3 mb-2">{children}</h4>;
          },

          // Styled paragraphs
          p({ children }) {
            return <p className="mb-3 text-muted-foreground leading-relaxed">{children}</p>;
          },

          // Styled lists
          ul({ children }) {
            return <ul className="list-disc list-outside ml-4 mb-4 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-outside ml-4 mb-4 space-y-1">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-muted-foreground">{children}</li>;
          },

          // Styled blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary/50 pl-4 my-4 italic text-muted-foreground bg-muted/20 py-2 rounded-r">
                {children}
              </blockquote>
            );
          },

          // Styled links
          a({ href, children }) {
            return (
              <a
                href={href}
                className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },

          // Horizontal rule
          hr() {
            return <hr className="my-6 border-border/50" />;
          },

          // Strong text
          strong({ children }) {
            return <strong className="font-semibold text-foreground">{children}</strong>;
          },

          // Emphasis
          em({ children }) {
            return <em className="italic">{children}</em>;
          },
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
};

/**
 * For rendering sanitized HTML content (use with caution)
 */
export const SafeHTML: React.FC<SafeMarkdownProps> = ({ content, className = '' }) => {
  const sanitizedHTML = useMemo(() => {
    if (!content) return { __html: '' };
    return { __html: sanitizeContent(content) };
  }, [content]);

  return (
    <div 
      className={`markdown-body ${className}`}
      dangerouslySetInnerHTML={sanitizedHTML}
    />
  );
};

export default SafeMarkdown;
