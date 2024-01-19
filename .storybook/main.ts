// eslint-disable-next-line import/no-import-module-exports
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
    "storybook-addon-apollo-client",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: true,
  },
};

// storybook/addon-storyshots does not support es6 module exports so we must use commonjs
// https://github.com/storybookjs/storybook/issues/20814
module.exports = config;
