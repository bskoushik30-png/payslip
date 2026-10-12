import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFGenerationOptions {
  filename?: string;
  employeeId: string;
  month: string;
  year: number | string;
}

export const generatePayslipPDF = async (
  elementId: string,
  options: PDFGenerationOptions
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF generation.`);
    return false;
  }

  const cleanFilename =
    options.filename ||
    `Payslip_${(options.employeeId || 'EMP').replace(/[^a-zA-Z0-9_-]/g, '')}_${options.month}_${options.year}.pdf`;

  // Create an offscreen clean clone container to capture FULL unclipped document height
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'fixed';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = '800px';
  clone.style.maxWidth = '800px';
  clone.style.height = 'auto';
  clone.style.maxHeight = 'none';
  clone.style.overflow = 'visible';
  clone.style.backgroundColor = '#ffffff';
  clone.style.padding = '24px';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';
  clone.style.zIndex = '-9999';

  document.body.appendChild(clone);

  try {
    // Generate high-resolution canvas from full height clone
    const canvas = await html2canvas(clone, {
      scale: 2, // High resolution (crisp text & borders)
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: clone.scrollWidth || 800,
      height: clone.scrollHeight,
      windowWidth: clone.scrollWidth || 800,
      windowHeight: clone.scrollHeight,
    });

    // Remove clone
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const margin = 8; // 8mm margin
    const printableWidth = pdfWidth - margin * 2;
    const printableHeight = pdfHeight - margin * 2;

    const imgWidth = printableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Handle single-page fit vs multi-page full capture
    if (imgHeight <= printableHeight) {
      // Perfectly fits on a single page
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight, undefined, 'FAST');
    } else if (imgHeight <= printableHeight * 1.25) {
      // Slightly tall: Scale to fit perfectly on 1 clean A4 page without clipping any footer or signature
      const scaleFactor = printableHeight / imgHeight;
      const scaledWidth = imgWidth * scaleFactor;
      const scaledHeight = printableHeight;
      const xPos = margin + (printableWidth - scaledWidth) / 2;
      pdf.addImage(imgData, 'PNG', xPos, margin, scaledWidth, scaledHeight, undefined, 'FAST');
    } else {
      // Multi-page document: Paginate cleanly so all content is preserved
      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= printableHeight;

      while (heightLeft > 0) {
        position -= printableHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= printableHeight;
      }
    }

    pdf.save(cleanFilename);
    return true;
  } catch (canvasErr) {
    console.warn('html2canvas capture error:', canvasErr);
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }

    // Fallback: trigger print dialog for Save as PDF
    window.print();
    return false;
  }
};

export const printElement = (elementId: string = 'payslip-print-modal-container'): void => {
  const element = document.getElementById(elementId) || document.getElementById('payslip-print-container');
  if (!element) {
    window.print();
    return;
  }

  // Create an isolated iframe for clean, full-page printing without ANY modal/app scroll clipping
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  // Collect all stylesheets and style tags from parent window
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((el) => el.outerHTML)
    .join('\n');

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Salary Slip Document</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
        ${styles}
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          *, *::before, *::after {
            box-sizing: border-box;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
            overflow: visible !important;
            height: auto !important;
            width: 100% !important;
          }
          .payslip-page {
            box-shadow: none !important;
            border: none !important;
            margin: 0 auto !important;
            padding: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        </style>
      </head>
      <body>
        <div style="padding: 4px; width: 100%; max-width: 800px; margin: 0 auto;">
          ${element.outerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Trigger print after iframe renders
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1500);
  }, 350);
};
