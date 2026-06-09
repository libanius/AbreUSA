import { NextRequest, NextResponse } from "next/server";
import { extractDocuments } from "@/lib/extract-document";
import {
  preprocessFile,
  ACCEPTED_MIME_TYPES,
} from "@/lib/preprocess-document";

function extractionError(
  errorCode: string,
  message: string,
  details?: string,
  status = 422,
) {
  return NextResponse.json({ error: message, errorCode, details }, { status });
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("[extract-document] Missing OPENAI_API_KEY");
    return extractionError(
      "missing_openai_api_key",
      "Extração não configurada no servidor",
      "OPENAI_API_KEY not set",
      503,
    );
  }

  try {
    const formData = await request.formData();
    const passportFile = formData.get("passport") as File | null;
    const addressFile = formData.get("addressProof") as File | null;

    if (!passportFile && !addressFile) {
      console.error("[extract-document] No files provided");
      return extractionError(
        "file_not_provided",
        "Nenhum arquivo recebido",
        "Both passport and addressProof are missing from the request",
      );
    }

    // Validate MIME types up front
    for (const [label, file] of [
      ["passport", passportFile],
      ["addressProof", addressFile],
    ] as const) {
      if (!file) continue;
      const mime = (file.type || "application/octet-stream")
        .toLowerCase()
        .trim();
      if (!ACCEPTED_MIME_TYPES.has(mime)) {
        console.error(
          `[extract-document] Unsupported MIME type for ${label}: ${mime}`,
        );
        return extractionError(
          "unsupported_file_type",
          "Tipo de arquivo não suportado para extração automática",
          `${label}: tipo '${mime}' não suportado. Use JPG, JPEG, PNG, PDF ou HEIC.`,
        );
      }
    }

    // Read file buffers
    const [passportBuffer, addressBuffer] = await Promise.all([
      passportFile ? Buffer.from(await passportFile.arrayBuffer()) : null,
      addressFile ? Buffer.from(await addressFile.arrayBuffer()) : null,
    ]);

    // Preprocess images: auto-rotate EXIF, resize, convert to JPEG
    let passportProcessed: {
      buffer: Buffer;
      mimeType: string;
      text?: string | null;
    } | null = null;
    let addressProcessed: {
      buffer: Buffer;
      mimeType: string;
      text?: string | null;
    } | null = null;

    if (passportBuffer && passportFile) {
      try {
        const result = await preprocessFile(passportBuffer, passportFile.type);
        passportProcessed = result;
      } catch (err) {
        const code =
          (err as Error & { errorCode?: string }).errorCode ??
          "image_decode_failed";
        const msg = err instanceof Error ? err.message : String(err);
        console.error(
          `[extract-document] Passport preprocessing failed [${code}]: ${msg}`,
        );
        return extractionError(
          code,
          "Não foi possível processar o passaporte.",
          msg,
        );
      }
    }

    if (addressBuffer && addressFile) {
      try {
        const result = await preprocessFile(addressBuffer, addressFile.type);
        addressProcessed = result;
      } catch (err) {
        const code =
          (err as Error & { errorCode?: string }).errorCode ??
          "image_decode_failed";
        const msg = err instanceof Error ? err.message : String(err);
        console.error(
          `[extract-document] Address proof preprocessing failed [${code}]: ${msg}`,
        );
        return extractionError(
          code,
          "Não foi possível processar o comprovante de endereço.",
          msg,
        );
      }
    }

    const result = await extractDocuments(
      passportProcessed?.buffer ?? null,
      passportProcessed?.mimeType ?? null,
      passportProcessed?.text ?? null,
      addressProcessed?.buffer ?? null,
      addressProcessed?.mimeType ?? null,
      addressProcessed?.text ?? null,
    );

    return NextResponse.json(result);
  } catch (err) {
    const code =
      (err as Error & { errorCode?: string }).errorCode ??
      "extraction_api_failed";
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      "[extract-document] Extraction failed:",
      code,
      message,
      err,
    );
    return NextResponse.json(
      {
        error: "Falha na extração de documentos",
        errorCode: code,
        details: message,
      },
      { status: 500 },
    );
  }
}
