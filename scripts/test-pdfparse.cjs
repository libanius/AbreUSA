
const pdfParse = require("pdf-parse");
const buf = Buffer.from("%PDF-1.4
1 0 obj
<< >>
endobj
trailer
<< /Root 1 0 R >>
startxref
9
%%EOF");
pdfParse(buf).then(d => {
  console.log("numpages:", d.numpages);
  console.log("text:", JSON.stringify(d.text));
}).catch(e => console.log("error:", e.message));
