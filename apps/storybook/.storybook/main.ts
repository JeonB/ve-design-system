import type { StorybookConfig } from "@storybook/react-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { join } from "node:path";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|js|jsx|mjs)"],
  addons: [],
  framework: "@storybook/react-vite",
  viteFinal: async (viteConfig) => {
    const alias = {
      "@ve/ui": join(__dirname, "../../../packages/ui/src"),
      "@ve/tokens": join(__dirname, "../../../packages/tokens/src")
    };

    return {
      ...viteConfig,
      plugins: [...(viteConfig.plugins ?? []), vanillaExtractPlugin()],
      resolve: {
        ...(viteConfig.resolve ?? {}),
        alias: {
          ...((viteConfig.resolve && viteConfig.resolve.alias) || {}),
          ...alias
        }
      }
    };
  }
};

export default config;
