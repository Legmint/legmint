import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

/**
 * RenderService
 *
 * Renders legal document templates to PDF or DOCX format
 * - PDF: HTML template + Puppeteer
 * - DOCX: docx library for Word documents
 */
@Injectable()
export class RenderService {
  private readonly logger = new Logger(RenderService.name);

  /**
   * Render template to PDF using Puppeteer
   *
   * @param htmlTemplate - HTML template string with Handlebars syntax
   * @param data - Data object to populate template
   * @param options - PDF rendering options
   * @returns Buffer of PDF file
   */
  async renderToPdf(
    htmlTemplate: string,
    data: any,
    options?: {
      format?: 'A4' | 'Letter';
      margin?: { top?: string; right?: string; bottom?: string; left?: string };
    }
  ): Promise<Buffer> {
    this.logger.log('Rendering template to PDF');

    try {
      // 1. Compile Handlebars template
      const template = Handlebars.compile(htmlTemplate);
      const html = template(data);

      // 2. Launch Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      });

      const page = await browser.newPage();

      // 3. Set HTML content
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });

      // 4. Generate PDF
      const pdfBuffer = await page.pdf({
        format: options?.format || 'A4',
        margin: options?.margin || {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
        printBackground: true,
      });

      await browser.close();

      this.logger.log('PDF rendered successfully');
      return Buffer.from(pdfBuffer);
    } catch (error) {
      this.logger.error(`PDF rendering failed: ${error.message}`);
      throw new Error(`PDF rendering failed: ${error.message}`);
    }
  }

  /**
   * Render template to DOCX
   *
   * @param templateData - Structured template data
   * @param data - User answers
   * @returns Buffer of DOCX file
   */
  async renderToDocx(templateData: any, data: any): Promise<Buffer> {
    this.logger.log('Rendering template to DOCX');

    try {
      // Create document sections
      const sections = this.buildDocxSections(templateData, data);

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: sections,
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);

      this.logger.log('DOCX rendered successfully');
      return buffer;
    } catch (error) {
      this.logger.error(`DOCX rendering failed: ${error.message}`);
      throw new Error(`DOCX rendering failed: ${error.message}`);
    }
  }

  /**
   * Build DOCX sections from template data
   */
  private buildDocxSections(templateData: any, data: any): Paragraph[] {
    const sections: Paragraph[] = [];

    // Title
    sections.push(
      new Paragraph({
        text: templateData.title || 'Document',
        heading: HeadingLevel.HEADING_1,
      })
    );

    // Date
    if (data.effectiveDate) {
      sections.push(
        new Paragraph({
          text: `Effective Date: ${data.effectiveDate}`,
          spacing: { before: 200, after: 200 },
        })
      );
    }

    // Parties section
    if (data.partyA || data.companyName || data.providerName) {
      sections.push(
        new Paragraph({
          text: 'Parties',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400 },
        })
      );

      const partyAName = data.partyA?.name || data.companyName || data.providerName || data.brandName || '';
      const partyBName = data.partyB?.name || data.customerName || data.clientName || '';

      if (partyAName) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Party A: ', bold: true }),
              new TextRun(partyAName),
            ],
          })
        );
      }

      if (partyBName) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Party B: ', bold: true }),
              new TextRun(partyBName),
            ],
          })
        );
      }
    }

    // Additional sections based on data
    for (const [key, value] of Object.entries(data)) {
      if (
        typeof value === 'string' &&
        value.length > 20 &&
        !['effectiveDate', 'jurisdiction'].includes(key)
      ) {
        sections.push(
          new Paragraph({
            text: this.formatFieldName(key),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 },
          })
        );

        sections.push(
          new Paragraph({
            text: value,
            spacing: { after: 200 },
          })
        );
      }
    }

    // Governing Law
    if (data.jurisdiction) {
      sections.push(
        new Paragraph({
          text: 'Governing Law',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400 },
        })
      );

      sections.push(
        new Paragraph({
          text: `This agreement shall be governed by the laws of ${data.jurisdiction}.`,
        })
      );
    }

    return sections;
  }

  /**
   * Format camelCase field names to Title Case
   */
  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Get default HTML template
   */
  getDefaultHtmlTemplate(templateCode: string, jurisdictionOverlay?: any): string {
    const governingLaw = jurisdictionOverlay?.governingLaw || '{{jurisdiction}}';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{title}}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000;
      margin: 0;
      padding: 0;
    }
    h1 {
      font-size: 18pt;
      text-align: center;
      margin-bottom: 30px;
      text-transform: uppercase;
      font-weight: bold;
    }
    h2 {
      font-size: 14pt;
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    p {
      margin: 10px 0;
      text-align: justify;
    }
    .section {
      margin-bottom: 20px;
    }
    .parties {
      margin-bottom: 30px;
    }
    .signature-block {
      margin-top: 50px;
      page-break-inside: avoid;
    }
    .signature-line {
      border-top: 1px solid #000;
      width: 250px;
      margin-top: 40px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>{{title}}</h1>

  <div class="section">
    <p><strong>Effective Date:</strong> {{effectiveDate}}</p>
  </div>

  <div class="parties">
    <h2>Parties</h2>
    <p><strong>Party A:</strong> {{partyA.name}}{{#if partyA.address}}, {{partyA.address}}{{/if}}</p>
    {{#if partyB}}
    <p><strong>Party B:</strong> {{partyB.name}}{{#if partyB.address}}, {{partyB.address}}{{/if}}</p>
    {{/if}}
  </div>

  <div class="section">
    <h2>1. Purpose</h2>
    <p>{{purpose}}</p>
  </div>

  <div class="section">
    <h2>2. Terms and Conditions</h2>
    <p>This agreement sets forth the terms and conditions governing the relationship between the parties.</p>
  </div>

  {{#if jurisdiction}}
  <div class="section">
    <h2>Governing Law</h2>
    <p>This agreement shall be governed by and construed in accordance with the laws of ${governingLaw}.</p>
  </div>
  {{/if}}

  <div class="signature-block">
    <p><strong>Party A:</strong></p>
    <div class="signature-line"></div>
    <p>{{partyA.name}}</p>
    <p>Date: _________________</p>
  </div>

  {{#if partyB}}
  <div class="signature-block">
    <p><strong>Party B:</strong></p>
    <div class="signature-line"></div>
    <p>{{partyB.name}}</p>
    <p>Date: _________________</p>
  </div>
  {{/if}}
</body>
</html>
    `.trim();
  }
}
