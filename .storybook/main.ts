import type { StorybookViteConfig } from "@storybook/builder-vite";
import { mergeConfig } from "vite";
// @ts-ignore
import viteConfig from "../vite.config";
import react from "@vitejs/plugin-react";

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
        esModuleInterop: true,
      },
    },
  },
  async viteFinal(config) {
    let mergedConfig = mergeConfig(viteConfig, config);
    mergedConfig.plugins = mergedConfig.plugins.filter((plugin) => {
      if (Array.isArray(plugin)) {
        if (plugin.find((p) => p.name === "vite:react-babel")) {
          return false;
        }
      }
      return true;
    });
    mergedConfig.plugins.push(
      // Use emotion jsx tag instead of React.JSX
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin", "import-graphql"],
        },
        fastRefresh: false,
      })
    );
    return mergedConfig;
  },
};

export default storybookConfig;

module.exports = storybookConfig;
