import { defineConfig } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import * as fs from "fs";
import path from "path";
import vitePluginImp from "vite-plugin-imp";
import { viteCommonjs, esbuildCommonjs } from "@originjs/vite-plugin-commonjs";
import envCompatible from "vite-plugin-env-compatible";
import checker from "vite-plugin-checker";
import { visualizer } from "rollup-plugin-visualizer";
import tsconfigPaths from "vite-tsconfig-paths";
import dns from "dns";
import injectVariablesInHTML from "./config/injectVariablesInHTML";

// Remove when https://github.com/cypress-io/cypress/issues/25397 is resolved.
dns.setDefaultResultOrder("ipv4first");

// Do not apply Antd's global styles
fs.writeFileSync(require.resolve("antd/es/style/core/global.less"), "");
fs.writeFileSync(require.resolve("antd/lib/style/core/global.less"), "");

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      "/graphql": {
        target: "http://localhost:9090/graphql/query",
        changeOrigin: true,
      },
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [esbuildCommonjs(["antd"])],
    },
  },
  build: {
    sourcemap: true,
    outDir: "build",
    rollupOptions: {
      output: {
        plugins: [
          // Replace the variables in our HTML files.
          injectVariablesInHTML({
            files: "build/index.html",
            variables: [
              "%APP_VERSION%",
              "%GIT_SHA%",
              "%REACT_APP_RELEASE_STAGE%",
              "%REACT_APP_NEW_RELIC_ACCOUNT_ID%",
              "%REACT_APP_NEW_RELIC_TRUST_KEY%",
              "%REACT_APP_NEW_RELIC_AGENT_ID%",
              "%REACT_APP_NEW_RELIC_LICENSE_KEY%",
              "%REACT_APP_NEW_RELIC_APPLICATION_ID%",
            ],
          }),
        ],
        manualChunks: {
          vendor: [
            "react",
            "react-router-dom",
            "react-dom",
            "react-router",
            "lodash",
            "date-fns",
            "antd",
            "date-fns/esm/locale",
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@leafygreen-ui/emotion": path.resolve(
        __dirname,
        "./config/leafygreen-ui/emotion",
      ),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  plugins: [
    tsconfigPaths(),
    viteCommonjs(),
    // Inject env variables
    envCompatible({
      prefix: "REACT_APP_",
    }),
    // Use emotion jsx tag instead of React.JSX
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin", "import-graphql"],
      },
      // exclude storybook stories
      exclude: [/\.stories\.tsx?$/],
    }),
    // Dynamic imports of antd styles
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
          libDirectory: "esm",
          style: (name) => `date-fns/esm/${name}`,
          camel2DashComponentName: false,
        },
      ],
    }),
    // Typescript checking
    checker({ typescript: true }),
    // Bundle analyzer
    visualizer({
      filename: "build/source_map.html",
      template: "treemap",
    }),
    sentryVitePlugin({
      org: "mongodb-org",
      project: "spruce",
      authToken: process.env.REACT_APP_SENTRY_AUTH_TOKEN,
      release: {
        name: process.env.npm_package_version,
      },
      sourcemaps: {
        assets: "./build/assets/*",
      },
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
