import { NextRequest, NextResponse } from "next/server";
import { extractDocuments } from "@/lib/extract-document";

const SUPPORTED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

function extractionError(errorCode: string, message: string, details?: string, status = 422) {
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

    if (passportFile && !SUPPORTED_MIME_TYPES.includes(passportFile.type)) {
      console.error(
        `[extract-document] Unsupported passport MIME type: ${passportFile.type}`,
      );
      return extractionError(
        "unsupported_file_type",
        "Tipo de arquivo não suportado para extração automática",
        `Passaporte: tipo '${passportFile.type}' não suportado. Use JPEG, PNG ou WebP.`,
      );
    }

    if (addressFile && !SUPPORTED_MIME_TYPES.includes(addressFile.type)) {
      console.error(
        `[extract-document] Unsupported address proof MIME type: ${addressFile.type}`,
      );
      return extractionError(
        "unsupported_file_type",
        "Tipo de arquivo não suportado para extração automática",
        `Comprovante: tipo '${addressFile.type}' não suportado. Use JPEG, PNG ou WebP.`,
      );
    }

    const [passportBuffer, addressBuffer] = await Promise.all([
      passportFile ? Buffer.from(await passportFile.arrayBuffer()) : null,
      addressFile ? Buffer.from(await addressFile.arrayBuffer()) : null,
    ]);

    const result = await extractDocuments(
      passportBuffer,
      passportFile?.type ?? null,
      addressBuffer,
      addressFile?.type ?? null,
    );

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[extract-document] Extraction failed:", message, err);
    return NextResponse.json(
      {
        error: "Falha na extração de documentos",
        errorCode: "extraction_api_failed",
        details: message,
      },
      { status: 500 },
    );
  }
}
