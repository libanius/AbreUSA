import { NextRequest, NextResponse } from "next/server";
import { extractDocuments } from "@/lib/extract-document";

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Extração não configurada" },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const passportFile = formData.get("passport") as File | null;
    const addressFile = formData.get("addressProof") as File | null;

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
    console.error("Document extraction error:", err);
    return NextResponse.json({ error: "Falha na extração" }, { status: 500 });
  }
}
