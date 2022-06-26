import type { StorybookViteConfig, ViteFinal } from "@storybook/builder-vite";
import { mergeConfig } from "vite";
import path from "path";
// @ts-ignore
import viteConfig from "../vite.config";

const storybookConfig: StorybookViteConfig = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-react-router-v6",
    "storybook-addon-apollo-client",
  ],
  // framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
    babelModeV7: true,
    emotionAlias: false,
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
    },
  },
  async viteFinal(config, options) {
    let mergedConfig = mergeConfig(viteConfig, config);
    const emotionAliasConfig: Partial<ViteFinal> = {
      optimizeDeps: {
        include: ["node_modules"],
      },
      resolve: {
        alias: {
          // resolve emotion 10 imports to emotion 11
          "@emotion/react": path.resolve(
            path.join(__dirname, "../node_modules/@emotion/react")
          ),
          "@emotion/styled": path.resolve(
            path.join(__dirname, "../node_modules/@emotion/styled")
          ),
          "@emotion/core": path.resolve(
            path.join(__dirname, "../node_modules/@emotion/react")
          ),
          "emotion-theming": path.resolve(
            path.join(__dirname, "../node_modules/@emotion/react")
          ),
        },
      },
    };
    return mergedConfig;
  },
};

export default storybookConfig;
