const path = require("path");
const fs = require("fs");
const { merge } = require("webpack-merge");

module.exports = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    "@storybook/addon-knobs",
    "@storybook/addon-storyshots",
    "@storybook/addon-actions",
    "@storybook/addon-queryparams",
    "storybook-addon-apollo-client",
  ],
  presets: ["@storybook/preset-ant-design"],
};
