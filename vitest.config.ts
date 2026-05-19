import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: [
      // Explicit alias for dynamic route segment (brackets break default resolver)
      {
        find: "@/app/api/customer/orders/[id]/documents/route",
        replacement: path.resolve(
          __dirname,
          "app/api/customer/orders/[id]/documents/route.ts",
        ),
      },
      {
        find: "@/app/api/customer/orders/[id]/correction/route",
        replacement: path.resolve(
          __dirname,
          "app/api/customer/orders/[id]/correction/route.ts",
        ),
      },
      {
        find: "@/app/api/extract-document/route",
        replacement: path.resolve(__dirname, "app/api/extract-document/route.ts"),
      },
      // Generic @ alias (must come last)
      { find: "@", replacement: path.resolve(__dirname, ".") },
    ],
  },
});
