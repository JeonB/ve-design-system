import { vanillaExtractPlugin } from "@vanilla-extract/esbuild-plugin";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.js"],
  format: ["esm"],
  dts: false,
  clean: true,
  external: ["react"],
  esbuildPlugins: [vanillaExtractPlugin()]
});
