import type { StorybookViteConfig, ViteFinal } from "@storybook/builder-vite";
import { readdirSync } from "fs";
import path from "path";
import { mergeConfig } from "vite";
import gql from "./graphql.js";
import vitePluginImp from "vite-plugin-imp";

// Allow imports from absolute paths
const absolutePaths = readdirSync(path.resolve(__dirname, "../src")).filter(
  (file: string) => !file.startsWith(".")
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

const storybookConfig: StorybookViteConfig = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
    // babelModeV7: true,
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  async viteFinal(config, options) {
    console.log(config);
    console.log(options);
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@leafygreen-ui/emotion": path.resolve(
            __dirname,
            "../config/leafygreen-ui/emotion"
          ),
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
          ...absolutePathAliasMap,
        },
      },
      optimizeDeps: {
        include: ["graphql-tag"],
      },
      plugins: [
        gql(),
        vitePluginImp({
          optimize: true,
          libList: [
            {
              libName: "antd",
              libDirectory: "es",
              style: (name) => `antd/es/${name}/style/index.js`,
            },
            {
              libName: "lodash",
              libDirectory: "",
              camel2DashComponentName: false,
              style: (name) => `lodash/${name}`,
            },
            {
              libName: "date-fns",
              libDirectory: "",
              style: (name) => `date-fns/esm/${name}`,
              camel2DashComponentName: false,
            },
          ],
        }),
      ],
      css: {
        preprocessorOptions: {
          less: {
            javascriptEnabled: true, // enable LESS {@import ...}
          },
        },
      },
    });
  },
};

export default storybookConfig;
