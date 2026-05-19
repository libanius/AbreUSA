
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
pdfjsLib.GlobalWorkerOptions.workerSrc = '';

// A minimal text PDF (bank statement style)
const pdfBytes = new Uint8Array(Buffer.from(
  '%PDF-1.4\n' +
  '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n' +
  '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n' +
  '3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n' +
  '4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 100 700 Td (Hello World) Tj ET\nendstream\nendobj\n' +
  'xref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000266 00000 n \n' +
  'trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n360\n%%EOF\n'
));

async function run() {
  const task = pdfjsLib.getDocument({ data: pdfBytes, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true });
  const pdf = await task.promise;
  console.log('Pages:', pdf.numPages);
  const page = await pdf.getPage(1);
  const content = await page.getTextContent();
  const text = content.items.map(i => i.str).join(' ').trim();
  console.log('Text:', JSON.stringify(text));
}
run().catch(e => console.error('ERROR:', e.message));
