module.exports = {
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
    const { loadConfigFromFile, mergeConfig } = require("vite");
    const path = require("path");

    // Load our Vite config file.
    const { config: viteConfig } = await loadConfigFromFile(
      configType,
      path.resolve(__dirname, "../vite.config.ts")
    );

    const isProductionBuild = configType === "PRODUCTION";
    config.plugins = config.plugins.filter((plugin) => {
      // Storybook injects its own react plugin, so we need to remove it
      if (matchVitePlugin(plugin, "vite:react-babel")) {
        return false;
      }
      return true;
    });

    return mergeConfig(viteConfig, config);
  },
};

/**
 * matchVitePlugin takes in a vite plugin and returns a boolean indicating whether it matches the given plugin name
 */
const matchVitePlugin = (plugin, name) => {
  if (!plugin) return false;
  if (Array.isArray(plugin)) {
    return plugin.find((p) => matchVitePlugin(p, name));
  }
  return plugin.name === name;
};
