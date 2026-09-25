import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { join } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      "@ve/ui": join(__dirname, "../../packages/ui/src"),
      "@ve/tokens": join(__dirname, "../../packages/tokens/src")
    }
  },
  server: {
    port: 4310,
    strictPort: true
  }
});
