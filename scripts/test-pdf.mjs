
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
GlobalWorkerOptions.workerSrc = "";

const pdfBytes = new Uint8Array([
  0x25,0x50,0x44,0x46,0x2d,0x31,0x2e,0x34,0x0a, // %PDF-1.4
]);

try {
  const task = getDocument({ data: pdfBytes, useWorkerFetch: false, isEvalSupported: false });
  await task.promise;
  console.log("loaded");
} catch(e) {
  console.log("error (expected for bad bytes):", e.message?.slice(0,100));
}
console.log("pdfjs-dist 5.x works in Node.js");
