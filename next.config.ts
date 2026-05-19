import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep pdfjs-dist and heic-convert as Node.js externals so their native
  // optional deps (canvas, etc.) are not bundled by Turbopack.
  serverExternalPackages: ["pdfjs-dist", "heic-convert", "heic-decode"],
};

export default nextConfig;
