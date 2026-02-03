/**
 * Word Document (DOCX) Report Template
 * 
 * Generates professional Word documents using the docx library
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { Report } from '../types';

export async function renderDocxReport(report: Report): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: 'Council Intelligence Report',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Timestamp
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated: ${new Date(report.timestamp).toLocaleString()}`,
                italics: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Metadata
          ...createMetadataSection(report),

          // Executive Summary
          new Paragraph({
            text: 'Executive Summary',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Total Opportunities: ', bold: true }),
              new TextRun({ text: report.summary.totalOpportunities.toString() }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'High Impact: ', bold: true }),
              new TextRun({ text: report.summary.highImpact.toString() }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Ready to Build: ', bold: true }),
              new TextRun({ text: report.summary.readyToBuild.toString() }),
            ],
            spacing: { after: 200 },
          }),

          // Recommendations
          new Paragraph({
            text: 'Recommendations',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),

          ...report.recommendations.map(
            (rec, idx) =>
              new Paragraph({
                text: `${idx + 1}. ${rec}`,
                spacing: { after: 100 },
              })
          ),

          // Detailed Analysis
          new Paragraph({
            text: 'Detailed Analysis',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),

          ...parseAnalysisToParagraphs(report.detailedAnalysis),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

function createMetadataSection(report: Report): Paragraph[] {
  if (!report.metadata) {
    return [];
  }

  const paragraphs: Paragraph[] = [];

  if (report.metadata.version) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Version: ', italics: true }),
          new TextRun({ text: report.metadata.version, italics: true }),
        ],
        spacing: { after: 50 },
      })
    );
  }

  if (report.metadata.dataSource) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Data Source: ', italics: true }),
          new TextRun({ text: report.metadata.dataSource, italics: true }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  return paragraphs;
}

function parseAnalysisToParagraphs(analysis: string): Paragraph[] {
  const lines = analysis.split('\n');
  const paragraphs: Paragraph[] = [];

  for (const line of lines) {
    if (line.trim() === '') {
      continue;
    }

    // Heading detection
    if (line.startsWith('## ')) {
      paragraphs.push(
        new Paragraph({
          text: line.replace('## ', ''),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        })
      );
    } else if (line.startsWith('### ')) {
      paragraphs.push(
        new Paragraph({
          text: line.replace('### ', ''),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        })
      );
    } else if (line.startsWith('- ')) {
      // Bullet point
      paragraphs.push(
        new Paragraph({
          text: line.replace('- ', ''),
          bullet: { level: 0 },
          spacing: { after: 50 },
        })
      );
    } else if (line.startsWith('  - ')) {
      // Nested bullet
      paragraphs.push(
        new Paragraph({
          text: line.replace('  - ', ''),
          bullet: { level: 1 },
          spacing: { after: 50 },
        })
      );
    } else {
      // Regular paragraph
      paragraphs.push(
        new Paragraph({
          text: line,
          spacing: { after: 100 },
        })
      );
    }
  }

  return paragraphs;
}
