import type { StorybookViteConfig } from "@storybook/builder-vite";
import { mergeConfig, PluginOption } from "vite";
import viteConfig from "../vite.config";

const storybookConfig: StorybookViteConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
    "@storybook/addon-storyshots",
    "storybook-addon-apollo-client",
    "storybook-addon-react-router-v6",
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
    config.plugins = config.plugins.filter((plugin) => {
      // Storybook injects its own react plugin, so we need to remove it
      if (matchVitePlugin(plugin, "vite:react-babel")) {
        return false;
      }
      // Storybook mocks out the core-js package which breaks on production builds https://github.com/storybookjs/builder-vite/issues/412
      if (isProductionBuild) {
        if (matchVitePlugin(plugin, "mock-core-js")) {
          return false;
        }
      }
      return true;
    });

    return mergeConfig(viteConfig, config);
  },
};

/**
 * matchVitePlugin takes in a vite plugin and returns a boolean indicating whether it matches the given plugin name
 */
const matchVitePlugin = (plugin: PluginOption, name: string) => {
  if (!plugin) return false;
  if (Array.isArray(plugin)) {
    return plugin.find((p) => matchVitePlugin(p, name));
  }
  return plugin.name === name;
};

module.exports = storybookConfig;
