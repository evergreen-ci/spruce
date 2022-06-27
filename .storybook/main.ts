import type { StorybookViteConfig } from "@storybook/builder-vite";
import { mergeConfig } from "vite";
// @ts-ignore
import viteConfig from "../vite.config";

const storybookConfig: StorybookViteConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-storyshots",
    "storybook-addon-react-router-v6",
    "storybook-addon-apollo-client",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
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
  async viteFinal(config) {
    let mergedConfig = mergeConfig(viteConfig, config);
    return mergedConfig;
  },
};

export default storybookConfig;
