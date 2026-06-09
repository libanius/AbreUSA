const MB = 1024 * 1024;

export const MAX_PREPARED_FILE_BYTES = 1.75 * MB;
export const MAX_COMBINED_UPLOAD_BYTES = 3.75 * MB;

const MAX_IMAGE_DIMENSION = 2200;
const COMPRESSIBLE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);
const ACCEPTED_UPLOAD_TYPES = new Set([
  ...COMPRESSIBLE_IMAGE_TYPES,
  "image/heic",
  "image/heif",
  "application/pdf",
]);

export class UploadPreparationError extends Error {
  constructor(
    public readonly code:
      | "unsupported_file_type"
      | "file_too_large"
      | "combined_files_too_large"
      | "image_compression_failed",
    message: string,
  ) {
    super(message);
    this.name = "UploadPreparationError";
  }
}

function inferMimeType(file: File) {
  if (file.type) return file.type.toLowerCase().trim();

  const extension = file.name.split(".").pop()?.toLowerCase();
  const mimeByExtension: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    heic: "image/heic",
    heif: "image/heif",
    pdf: "application/pdf",
  };

  return extension ? mimeByExtension[extension] ?? "" : "";
}

export function validateUploadFile(file: File) {
  const mimeType = inferMimeType(file);

  if (!ACCEPTED_UPLOAD_TYPES.has(mimeType)) {
    throw new UploadPreparationError(
      "unsupported_file_type",
      "Formato não suportado. Use JPG, JPEG, PNG, WebP, PDF ou HEIC.",
    );
  }

  if (
    file.size > MAX_PREPARED_FILE_BYTES &&
    !COMPRESSIBLE_IMAGE_TYPES.has(mimeType) &&
    mimeType !== "application/pdf"
  ) {
    throw new UploadPreparationError(
      "file_too_large",
      "Este arquivo é muito grande. Para PDF ou HEIC, envie um arquivo de até 1,7 MB ou converta-o para JPG.",
    );
  }

  return { mimeType, needsCompression: file.size > MAX_PREPARED_FILE_BYTES };
}

export function validateCombinedUploadSize(files: Array<File | null>) {
  const totalBytes = files.reduce((total, file) => total + (file?.size ?? 0), 0);

  if (totalBytes > MAX_COMBINED_UPLOAD_BYTES) {
    throw new UploadPreparationError(
      "combined_files_too_large",
      "Os dois documentos juntos ainda estão muito grandes. Reduza os arquivos e tente novamente.",
    );
  }

  return totalBytes;
}

function compressedFileName(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "") || "documento";
  return `${baseName}-otimizado.jpg`;
}

async function loadImage(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.decoding = "async";
    image.src = objectUrl;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("O navegador não conseguiu gerar a imagem otimizada."));
        }
      },
      "image/jpeg",
      quality,
    );
  });
}

async function compressImage(file: File) {
  const image = await loadImage(file);
  const scale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
  );
  let width = Math.max(1, Math.round(image.naturalWidth * scale));
  let height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("O navegador não oferece suporte à preparação da imagem.");
  }

  const qualityLevels = [0.82, 0.7, 0.58, 0.46, 0.34];

  for (let resizeAttempt = 0; resizeAttempt < 3; resizeAttempt += 1) {
    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    for (const quality of qualityLevels) {
      const blob = await canvasToBlob(canvas, quality);
      if (blob.size <= MAX_PREPARED_FILE_BYTES) {
        return new File([blob], compressedFileName(file.name), {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
      }
    }

    width = Math.max(1, Math.round(width * 0.75));
    height = Math.max(1, Math.round(height * 0.75));
  }

  throw new Error("A imagem permaneceu acima do limite após a otimização.");
}

async function renderPdfFirstPage(file: File) {
  const pdfjs = await import("pdfjs-dist/webpack");
  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjs.getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  const initialViewport = page.getViewport({ scale: 1 });
  const scale = Math.min(
    2.5,
    MAX_IMAGE_DIMENSION /
      Math.max(initialViewport.width, initialViewport.height),
  );
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { alpha: false });

  if (!context) {
    throw new Error("O navegador não conseguiu preparar a página do PDF.");
  }

  canvas.width = Math.max(1, Math.round(viewport.width));
  canvas.height = Math.max(1, Math.round(viewport.height));
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: context, viewport }).promise;

  for (const quality of [0.86, 0.76, 0.64, 0.52, 0.4]) {
    const blob = await canvasToBlob(canvas, quality);
    if (blob.size <= MAX_PREPARED_FILE_BYTES) {
      return new File([blob], compressedFileName(file.name), {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    }
  }

  throw new Error("A primeira página do PDF permaneceu acima do limite.");
}

export async function prepareUploadFile(file: File) {
  const validation = validateUploadFile(file);

  if (!validation.needsCompression) {
    return file;
  }

  try {
    return validation.mimeType === "application/pdf"
      ? await renderPdfFirstPage(file)
      : await compressImage(file);
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    throw new UploadPreparationError(
      "image_compression_failed",
      `Não foi possível reduzir este documento. Tente outra foto ou converta o arquivo para JPG. ${details}`,
    );
  }
}
