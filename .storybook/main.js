const { readdirSync } = require('fs');
const path = require('path');
const react = require("@vitejs/plugin-react");
const gql = require("./graphql.js")
// Allow imports from absolute paths
const absolutePaths = readdirSync(path.resolve(__dirname, "../src")).filter(
  (file) => !file.startsWith(".")
);
const absolutePathsWithExtensionsTrimmed = absolutePaths.map((file) =>
  file.replace(".tsx", "").replace(".ts", "").replace(".js", "")
);
const absolutePathAliasMap = absolutePathsWithExtensionsTrimmed.reduce(
  (acc, cur) => {
    acc[cur] = path.resolve(__dirname, `../src/${cur}`);
    return acc;
  },
  {}
);

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-vite"
  },
  "features": {
    "storyStoreV7": true,
    "babelModeV7": true,
  },
  async viteFinal(config, {}) {
    console.log(config)
    config.resolve.alias = {
        ...config.resolve.alias,
        "@leafygreen-ui/emotion": path.resolve(
          __dirname,
          "../config/leafygreen-ui/emotion"
        ),
      '@emotion/react': path.resolve(path.join(__dirname, '../node_modules/@emotion/react')),
      '@emotion/styled': path.resolve(path.join(__dirname,'../node_modules/@emotion/styled')),
      '@emotion/core':path.resolve(path.join(__dirname, '../node_modules/@emotion/react')),
      'emotion-theming': path.resolve(path.join(__dirname, '../node_modules/@emotion/react')),
      ...absolutePathAliasMap
    }
    console.log(
      config.optimizeDeps
    )
    config.optimizeDeps.include.push("graphql-tag")
     // Support imports of graphql files
    config.plugins.push(gql())
    return config;
  },
}