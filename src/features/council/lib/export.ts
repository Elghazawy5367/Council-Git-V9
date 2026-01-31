import { ExportData } from './types';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export function exportToCSV(data: ExportData): string {
  const rows: string[][] = [];
  
  // Header
  rows.push(['Expert', 'Model', 'Output', 'Task', 'Mode', 'Cost', 'Timestamp']);
  
  // Data rows
  data.experts.forEach((expert) => {
    const output = data.outputs[expert.id] || '';
    rows.push([
      expert.name,
      expert.model,
      output.replace(/"/g, '""'), // Escape quotes
      data.task.replace(/"/g, '""'),
      data.mode,
      data.cost.toFixed(4),
      data.timestamp.toISOString(),
    ]);
  });
  
  // Convert to CSV string - optimized to avoid nested map
  const csvLines: string[] = [];
  for (const row of rows) {
    const quotedCells: string[] = [];
    for (const cell of row) {
      quotedCells.push(`"${cell}"`);
    }
    csvLines.push(quotedCells.join(','));
  }
  return csvLines.join('\n');
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}

// Convert markdown-style text to docx paragraphs
function markdownToDocxParagraphs(text: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('### ')) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: trimmed.replace('### ', ''), bold: true })],
        spacing: { before: 200, after: 100 },
      }));
    } else if (trimmed.startsWith('## ')) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: trimmed.replace('## ', ''), bold: true })],
        spacing: { before: 300, after: 150 },
      }));
    } else if (trimmed.startsWith('# ')) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: trimmed.replace('# ', ''), bold: true, size: 32 })],
        spacing: { before: 400, after: 200 },
      }));
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      paragraphs.push(new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: trimmed.replace(/^[-•]\s*/, '') })],
        spacing: { before: 50, after: 50 },
      }));
    } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: trimmed.replace(/\*\*/g, ''), bold: true })],
        spacing: { before: 100, after: 100 },
      }));
    } else if (trimmed === '---') {
      paragraphs.push(new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
        spacing: { before: 200, after: 200 },
      }));
    } else if (trimmed) {
      // Parse inline formatting - optimized to avoid redundant regex
      const children: TextRun[] = [];
      
      // Quick check if bold formatting exists before regex processing
      if (trimmed.includes('**')) {
        const boldRegex = /\*\*(.+?)\*\*/g;
        let lastIndex = 0;
        let match;
        
        while ((match = boldRegex.exec(trimmed)) !== null) {
          if (match.index > lastIndex) {
            children.push(new TextRun({ text: trimmed.slice(lastIndex, match.index) }));
          }
          children.push(new TextRun({ text: match[1], bold: true }));
          lastIndex = match.index + match[0].length;
        }
        
        if (lastIndex < trimmed.length) {
          children.push(new TextRun({ text: trimmed.slice(lastIndex) }));
        }
      }
      
      if (children.length === 0) {
        children.push(new TextRun({ text: trimmed }));
      }
      
      paragraphs.push(new Paragraph({
        children,
        spacing: { before: 50, after: 50 },
      }));
    } else {
      // Empty line
      paragraphs.push(new Paragraph({ children: [] }));
    }
  }
  
  return paragraphs;
}

export async function exportToDocx(data: ExportData): Promise<void> {
  const sections: Paragraph[] = [];
  
  // Title
  sections.push(new Paragraph({
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'The Council Analysis Report', bold: true, size: 48 })],
    spacing: { after: 400 },
  }));
  
  // Metadata
  sections.push(new Paragraph({
    children: [
      new TextRun({ text: 'Task: ', bold: true }),
      new TextRun({ text: data.task }),
    ],
    spacing: { before: 100, after: 100 },
  }));
  
  sections.push(new Paragraph({
    children: [
      new TextRun({ text: 'Mode: ', bold: true }),
      new TextRun({ text: data.mode.charAt(0).toUpperCase() + data.mode.slice(1) }),
    ],
    spacing: { before: 100, after: 100 },
  }));
  
  sections.push(new Paragraph({
    children: [
      new TextRun({ text: 'Date: ', bold: true }),
      new TextRun({ text: data.timestamp.toLocaleString() }),
    ],
    spacing: { before: 100, after: 100 },
  }));
  
  sections.push(new Paragraph({
    children: [
      new TextRun({ text: 'Total Cost: ', bold: true }),
      new TextRun({ text: `$${data.cost.toFixed(4)}` }),
    ],
    spacing: { before: 100, after: 300 },
  }));
  
  // Separator
  sections.push(new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: '8B5CF6' } },
    spacing: { before: 200, after: 300 },
  }));
  
  // Expert Analyses
  sections.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: 'Expert Analyses', bold: true, size: 32 })],
    spacing: { before: 300, after: 200 },
  }));
  
  for (const expert of data.experts) {
    const output = data.outputs[expert.id] || 'No output';
    
    sections.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: expert.name, bold: true })],
      spacing: { before: 250, after: 100 },
    }));
    
    sections.push(new Paragraph({
      children: [new TextRun({ text: `Model: ${expert.model}`, italics: true, color: '6B7280' })],
      spacing: { before: 50, after: 150 },
    }));
    
    // Parse expert output
    sections.push(...markdownToDocxParagraphs(output));
    
    // Separator between experts
    sections.push(new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' } },
      spacing: { before: 200, after: 200 },
    }));
  }
  
  // Final Verdict
  if (data.verdict) {
    sections.push(new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: 'Final Verdict', bold: true, size: 32, color: '8B5CF6' })],
      spacing: { before: 400, after: 200 },
    }));
    
    sections.push(...markdownToDocxParagraphs(data.verdict));
  }
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: sections,
    }],
  });
  
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `council_${data.mode}_${Date.now()}.docx`);
}

export function exportToRichText(data: ExportData): string {
  let richText = '';
  
  // Title
  richText += `# The Council Analysis Report\n\n`;
  richText += `**Task:** ${data.task}\n\n`;
  richText += `**Mode:** ${data.mode.charAt(0).toUpperCase() + data.mode.slice(1)}\n\n`;
  richText += `**Date:** ${data.timestamp.toLocaleString()}\n\n`;
  richText += `**Total Cost:** $${data.cost.toFixed(4)}\n\n`;
  richText += `---\n\n`;
  
  // Expert outputs
  richText += `## Expert Analyses\n\n`;
  data.experts.forEach((expert) => {
    const output = data.outputs[expert.id] || 'No output';
    richText += `### ${expert.name}\n`;
    richText += `*Model: ${expert.model}*\n\n`;
    richText += `${output}\n\n`;
    richText += `---\n\n`;
  });
  
  // Verdict
  if (data.verdict) {
    richText += `## Final Verdict\n\n`;
    richText += `${data.verdict}\n\n`;
  }
  
  return richText;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadRichText(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  saveAs(blob, filename);
}
