import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import vitePluginImp from "vite-plugin-imp";
import { viteCommonjs, esbuildCommonjs } from "@originjs/vite-plugin-commonjs";
import envCompatible from "vite-plugin-env-compatible";
import checker from "vite-plugin-checker";
import { visualizer } from "rollup-plugin-visualizer";
import tsconfigPaths from "vite-tsconfig-paths";
import injectVariablesInHTML from "./config/injectVariablesInHTML";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
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
            from: ["%GIT_SHA%", "%RELEASE_STAGE%"],
            to: [process.env.GIT_SHA, process.env.REACT_APP_RELEASE_STAGE],
          }),
        ],
        manualChunks: {
          vendor: [
            "node_modules/react/index.js",
            "node_modules/react-dom/index.js",
          ],
          lodash: ["node_modules/lodash/index.js"],
          antd: ["node_modules/antd/es/index.js"],
          "date-fns": ["node_modules/date-fns/esm/index.js"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@leafygreen-ui/emotion": path.resolve(
        __dirname,
        "./config/leafygreen-ui/emotion"
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
      fastRefresh: true,
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
          libDirectory: "",
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
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // enable LESS {@import ...}
      },
    },
  },
});
