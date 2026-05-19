
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// Minimal text-based PDF
const pdfContent = Buffer.from(
  "%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
" +
  "2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
" +
  "3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
" +
  "4 0 obj
<< /Length 44 >>
stream
BT /F1 12 Tf 100 700 Td (Hello World) Tj ET
endstream
endobj
" +
  "xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
" +
  "trailer
<< /Size 5 /Root 1 0 R >>
startxref
360
%%EOF
"
);
const data = await pdfParse(pdfContent);
console.log("Pages:", data.numpages);
console.log("Text:", JSON.stringify(data.text.trim()));
