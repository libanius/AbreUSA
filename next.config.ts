import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep pdfjs-dist and heic-convert as Node.js externals so their native
  // optional deps (canvas, etc.) are not bundled by Turbopack.
  serverExternalPackages: ["pdfjs-dist", "heic-convert", "heic-decode"],

  // Include the assistant instructions file in serverless function bundles.
  // This ensures the file is available via fs.readFileSync on Vercel.
  outputFileTracingIncludes: {
    "/api/chat-assistant": ["./content/assistant-instructions.md"],
  },
};

export default nextConfig;
