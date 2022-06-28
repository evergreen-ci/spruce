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
    "storybook-addon-react-router-v6",
    "storybook-addon-apollo-client",
    "@storybook/addon-storyshots",
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
  async viteFinal(config, { configType }) {
    const isProductionBuild = configType === "PRODUCTION";
    let mergedConfig = mergeConfig(viteConfig, config);

    // Storybook injects its own react plugin, so we need to remove it
    // and replace it with our own version that supports emotion and our babel config.
    mergedConfig.plugins = mergedConfig.plugins.filter((plugin) => {
      if (Array.isArray(plugin)) {
        if (plugin.find((p) => p.name === "vite:react-babel")) {
          return false;
        }
      }
      // Storybook mocks out the core-js package which breaks on production builds https://github.com/storybookjs/builder-vite/issues/412
      if (isProductionBuild) {
        if (plugin.name === "mock-core-js") {
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
        fastRefresh: true,
        // exclude story book stories from fast refresh (storybook should handle this itself)
        exclude: [/\.stories\.([tj])sx?$/, /node_modules/],
      })
    );
    return mergedConfig;
  },
};

module.exports = storybookConfig;
