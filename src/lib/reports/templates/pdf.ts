/**
 * PDF Report Template
 * 
 * Generates PDF reports using jsPDF
 */

import { jsPDF } from 'jspdf';
import { Report } from '../types';

export async function renderPdfReport(report: Report): Promise<Buffer> {
  const doc = new jsPDF();
  
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Council Intelligence Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Timestamp
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(`Generated: ${new Date(report.timestamp).toLocaleString()}`, pageWidth / 2, yPos, {
    align: 'center',
  });
  yPos += 15;

  // Metadata
  if (report.metadata) {
    doc.setFontSize(9);
    if (report.metadata.version) {
      doc.text(`Version: ${report.metadata.version}`, margin, yPos);
      yPos += 6;
    }
    if (report.metadata.dataSource) {
      doc.text(`Data Source: ${report.metadata.dataSource}`, margin, yPos);
      yPos += 10;
    }
  }

  // Executive Summary
  yPos = checkPageBreak(doc, yPos, 40);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', margin, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Opportunities: ${report.summary.totalOpportunities}`, margin, yPos);
  yPos += 7;
  doc.text(`High Impact: ${report.summary.highImpact}`, margin, yPos);
  yPos += 7;
  doc.text(`Ready to Build: ${report.summary.readyToBuild}`, margin, yPos);
  yPos += 15;

  // Recommendations
  yPos = checkPageBreak(doc, yPos, 40);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommendations', margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  for (let i = 0; i < report.recommendations.length; i++) {
    const rec = report.recommendations[i];
    yPos = checkPageBreak(doc, yPos, 15);
    
    const lines = doc.splitTextToSize(`${i + 1}. ${rec}`, maxWidth - 5);
    doc.text(lines, margin, yPos);
    yPos += lines.length * 6;
  }
  
  yPos += 10;

  // Detailed Analysis
  yPos = checkPageBreak(doc, yPos, 40);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Analysis', margin, yPos);
  yPos += 10;

  // Parse and render analysis
  yPos = renderAnalysisText(doc, report.detailedAnalysis, margin, yPos, maxWidth);

  // Convert to buffer
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}

function checkPageBreak(doc: jsPDF, yPos: number, requiredSpace: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  
  if (yPos + requiredSpace > pageHeight - 20) {
    doc.addPage();
    return 20;
  }
  
  return yPos;
}

function renderAnalysisText(
  doc: jsPDF,
  analysis: string,
  x: number,
  startY: number,
  maxWidth: number
): number {
  let yPos = startY;
  const lines = analysis.split('\n');

  for (const line of lines) {
    if (line.trim() === '') {
      yPos += 4;
      continue;
    }

    yPos = checkPageBreak(doc, yPos, 20);

    // Heading detection
    if (line.startsWith('## ')) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(line.replace('## ', ''), x, yPos);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      yPos += 10;
    } else if (line.startsWith('### ')) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(line.replace('### ', ''), x, yPos);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      yPos += 8;
    } else if (line.startsWith('- ')) {
      const text = line.replace('- ', '• ');
      const textLines = doc.splitTextToSize(text, maxWidth - 5);
      doc.text(textLines, x, yPos);
      yPos += textLines.length * 6;
    } else if (line.startsWith('  - ')) {
      const text = line.replace('  - ', '  ◦ ');
      const textLines = doc.splitTextToSize(text, maxWidth - 10);
      doc.text(textLines, x + 5, yPos);
      yPos += textLines.length * 6;
    } else {
      // Handle bold text **text**
      const processedLine = line.replace(/\*\*(.*?)\*\*/g, '$1');
      const textLines = doc.splitTextToSize(processedLine, maxWidth);
      doc.text(textLines, x, yPos);
      yPos += textLines.length * 6;
    }
  }

  return yPos;
}
