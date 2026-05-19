
import { createRequire } from "module";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const BASE_URL = "http://localhost:3000";
const RESULTS = [];

function pass(label, detail = "") {
  RESULTS.push({ ok: true, label, detail });
  console.log(`  ✓ PASS  ${label}${detail ? " — " + detail : ""}`);
}
function fail(label, detail = "") {
  RESULTS.push({ ok: false, label, detail });
  console.log(`  ✗ FAIL  ${label}${detail ? " — " + detail : ""}`);
}

async function postExtract(files) {
  const form = new FormData();
  for (const [field, { buffer, name, type }] of Object.entries(files)) {
    form.append(field, new Blob([buffer], { type }), name);
  }
  const res = await fetch(`${BASE_URL}/api/extract-document`, { method: "POST", body: form });
  return { status: res.status, body: await res.json() };
}

// ── Fixtures ──────────────────────────────────────────────────────────────────
// Blank JPEG (100x100)
const jpegBuffer = await sharp({
  create: { width: 100, height: 100, channels: 3, background: { r: 255, g: 255, b: 255 } }
}).jpeg().toBuffer();

// Minimal text PDF simulating a bank statement with a US address
const addressPdfText =
  "%PDF-1.4\n" +
  "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n" +
  "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n" +
  "3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n";
const pdfBody = "BT /F1 12 Tf 100 700 Td (John Smith) Tj 0 -20 Td (123 Main Street) Tj 0 -20 Td (Miami FL 33101) Tj 0 -20 Td (Bank Statement - Chase Bank) Tj ET";
const pdfStream = `4 0 obj\n<< /Length ${pdfBody.length} >>\nstream\n${pdfBody}\nendstream\nendobj\n`;
const pdfXref = "xref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000266 00000 n \n";
const addressPdfContent = Buffer.from(addressPdfText + pdfStream + pdfXref + "trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n360\n%%EOF\n");

// Blank (no-text) PDF — simulates scanned document
const blankPdf = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n" +
  "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n" +
  "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\n" +
  "xref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n" +
  "trailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n190\n%%EOF\n"
);

// ── Test 1: heic-convert module ───────────────────────────────────────────────
console.log("\n1. heic-convert module");
try {
  const heicConvert = require("heic-convert");
  typeof heicConvert === "function"
    ? pass("heic-convert loads and exports a function")
    : fail("heic-convert export type unexpected", typeof heicConvert);
} catch (e) { fail("heic-convert load failed", e.message); }

// ── Test 2: pdfjs-dist 3.x loads ─────────────────────────────────────────────
console.log("\n2. pdfjs-dist 3.x module");
try {
  const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");
  pdfjs.GlobalWorkerOptions.workerSrc = "";
  typeof pdfjs.getDocument === "function"
    ? pass("pdfjs-dist 3.x loads and getDocument is available")
    : fail("getDocument not found");
} catch (e) { fail("pdfjs-dist 3.x load failed", e.message); }

// ── Test 3: PDF text extraction (text PDF with address) ───────────────────────
console.log("\n3. PDF with address text → extraction");
try {
  const { status, body } = await postExtract({
    addressProof: { buffer: addressPdfContent, name: "bank-statement.pdf", type: "application/pdf" }
  });
  if (body.errorCode === "pdf_requires_image") {
    fail("PDF still blocked with pdf_requires_image");
  } else if (body.errorCode === "extraction_api_failed") {
    fail("PDF text reached GPT-4o but API failed", body.details?.slice(0, 100));
  } else if (status === 200 && typeof body.confidence === "number") {
    const addr = body.address;
    const extracted = [addr?.streetAddress, addr?.city, addr?.state, addr?.zipCode].filter(Boolean);
    pass(`PDF text extracted — confidence=${body.confidence}`, `address fields: ${JSON.stringify(extracted)}`);
  } else {
    fail("Unexpected PDF response", `status=${status} errorCode=${body.errorCode}`);
  }
} catch (e) { fail("PDF text test threw", e.message); }

// ── Test 4: Blank/scanned PDF (no text) — graceful fallback ──────────────────
console.log("\n4. Blank PDF (no text / scanned) — graceful fallback");
try {
  const { status, body } = await postExtract({
    passport: { buffer: blankPdf, name: "scanned-passport.pdf", type: "application/pdf" }
  });
  if (body.errorCode === "pdf_requires_image") {
    fail("Blank PDF blocked with pdf_requires_image");
  } else if (status === 200 && body.confidence === 0) {
    pass("Blank PDF handled gracefully — confidence=0, no crash");
  } else if (status === 200) {
    pass(`Blank PDF processed — confidence=${body.confidence}`);
  } else {
    fail("Unexpected blank PDF response", `status=${status} errorCode=${body.errorCode}`);
  }
} catch (e) { fail("Blank PDF test threw", e.message); }

// ── Test 5: JPEG regression ───────────────────────────────────────────────────
console.log("\n5. JPEG extraction (regression)");
try {
  const { status, body } = await postExtract({
    passport: { buffer: jpegBuffer, name: "passport.jpg", type: "image/jpeg" }
  });
  status === 200 && typeof body.confidence === "number"
    ? pass("JPEG still works", `confidence=${body.confidence}`)
    : fail("JPEG broken", JSON.stringify(body).slice(0, 100));
} catch (e) { fail("JPEG test threw", e.message); }

// ── Test 6: HEIC MIME type not blocked at route ───────────────────────────────
console.log("\n6. HEIC MIME type not blocked at route level");
try {
  const { status, body } = await postExtract({
    passport: { buffer: jpegBuffer, name: "photo.heic", type: "image/heic" }
  });
  if (body.errorCode === "unsupported_file_type") {
    fail("HEIC blocked at route level — should not happen");
  } else if (body.errorCode === "pdf_requires_image") {
    fail("HEIC got pdf_requires_image unexpectedly");
  } else {
    pass("HEIC MIME accepted by route", `errorCode=${body.errorCode ?? "none"}, status=${status}`);
  }
} catch (e) { fail("HEIC test threw", e.message); }

// ── Test 7: Both passport (JPEG) + address (PDF) simultaneously ───────────────
console.log("\n7. Combined: JPEG passport + PDF address proof");
try {
  const { status, body } = await postExtract({
    passport: { buffer: jpegBuffer, name: "passport.jpg", type: "image/jpeg" },
    addressProof: { buffer: addressPdfContent, name: "bank-statement.pdf", type: "application/pdf" }
  });
  if (status === 200 && typeof body.confidence === "number") {
    pass(`Both files processed together — confidence=${body.confidence}`,
      `passport.fullName=${JSON.stringify(body.passport?.fullName)}, address.city=${JSON.stringify(body.address?.city)}`);
  } else {
    fail("Combined extraction failed", `status=${status} error=${body.errorCode}`);
  }
} catch (e) { fail("Combined test threw", e.message); }

// ── Summary ───────────────────────────────────────────────────────────────────
const passed = RESULTS.filter(r => r.ok).length;
const total = RESULTS.length;
console.log(`\n${"─".repeat(60)}`);
console.log(`RESULTADO: ${passed}/${total} testes passaram`);
if (passed < total) {
  console.log("FALHAS:");
  RESULTS.filter(r => !r.ok).forEach(r => console.log(`  • ${r.label}: ${r.detail}`));
}
console.log(`${"─".repeat(60)}\n`);
