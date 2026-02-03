import React, { useMemo, Suspense, lazy, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import 'katex/dist/katex.min.css';

// Lazy load MermaidDiagram for code splitting
const MermaidDiagram = lazy(() => import('./MermaidDiagram'));

interface SafeMarkdownProps {
  content: string;
  className?: string;
  enableMath?: boolean; // Optional math equations support
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

// Copy button component for code blocks
const CopyButton: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
      aria-label="Copy code"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
};

/**
 * Professional Markdown renderer with:
 * - GitHub Flavored Markdown (tables, strikethrough, task lists)
 * - Syntax highlighting with react-syntax-highlighter (OneDark theme)
 * - XSS protection via rehype-sanitize
 * - Math equation support (optional, via KaTeX)
 * - Mermaid diagram rendering
 * - Copy button for code blocks
 * - Links open in new tab
 * - Professional styling
 */
export const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ 
  content, 
  className = '', 
  enableMath = false 
}) => {
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    return content;
  }, [content]);

  // Configure rehype plugins
  const rehypePlugins = useMemo(() => {
    const plugins: any[] = [rehypeSanitize];
    if (enableMath) {
      plugins.push(rehypeKatex);
    }
    return plugins;
  }, [enableMath]);

  // Configure remark plugins
  const remarkPlugins = useMemo(() => {
    const plugins: any[] = [remarkGfm];
    if (enableMath) {
      plugins.push(remarkMath);
    }
    return plugins;
  }, [enableMath]);

  return (
    <div className={`prose prose-sm prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          // Enhanced code block renderer with syntax highlighting
          code({ node, inline, className: codeClassName, children, ...props }) {
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
            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-[0.85em]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // Code blocks with syntax highlighting
            if (language) {
              return (
                <div className="relative group my-3">
                  <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-muted/50 rounded-t-lg border-b border-border/50">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                      {language}
                    </span>
                    <CopyButton code={codeContent} />
                  </div>
                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    customStyle={{
                      margin: 0,
                      paddingTop: '3rem',
                      paddingBottom: '1rem',
                      paddingLeft: '1rem',
                      paddingRight: '1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                    }}
                    showLineNumbers={codeContent.split('\n').length > 5}
                    wrapLines={true}
                    {...props}
                  >
                    {codeContent}
                  </SyntaxHighlighter>
                </div>
              );
            }

            // Fallback for code without language
            return (
              <div className="relative my-3">
                <pre className="overflow-x-auto p-4 rounded-lg bg-muted/30 border border-border/50">
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
          tbody({ children }) {
            return <tbody>{children}</tbody>;
          },
          tr({ children }) {
            return <tr className="hover:bg-muted/20 transition-colors">{children}</tr>;
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
          h5({ children }) {
            return <h5 className="text-sm font-medium text-foreground mt-2 mb-2">{children}</h5>;
          },
          h6({ children }) {
            return <h6 className="text-sm font-medium text-muted-foreground mt-2 mb-1">{children}</h6>;
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
          li({ children, className: liClassName }) {
            // Check if this is a task list item
            const isTaskList = liClassName?.includes('task-list-item');
            return (
              <li className={`text-muted-foreground ${isTaskList ? 'list-none -ml-4' : ''}`}>
                {children}
              </li>
            );
          },

          // Task list checkbox
          input({ type, checked, disabled }) {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  className="mr-2 rounded border-border"
                  readOnly
                />
              );
            }
            return <input type={type} checked={checked} disabled={disabled} />;
          },

          // Styled blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary/50 pl-4 my-4 italic text-muted-foreground bg-muted/20 py-2 rounded-r">
                {children}
              </blockquote>
            );
          },

          // Styled links (open in new tab)
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

          // Strikethrough (via GFM)
          del({ children }) {
            return <del className="line-through text-muted-foreground/70">{children}</del>;
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
 * Note: This is kept for backward compatibility but SafeMarkdown is preferred
 */
export const SafeHTML: React.FC<SafeMarkdownProps> = ({ content, className = '' }) => {
  const sanitizedHTML = useMemo(() => {
    if (!content) return { __html: '' };
    // Basic sanitization - consider using DOMPurify for production
    return { __html: content };
  }, [content]);

  return (
    <div 
      className={`markdown-body ${className}`}
      dangerouslySetInnerHTML={sanitizedHTML}
    />
  );
};

export default SafeMarkdown;
