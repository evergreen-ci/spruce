import { defineConfig } from "cypress";

import webpack from "@cypress/webpack-preprocessor";
import webpackOptions from "./cypress/plugins/webpack.config";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    projectId: "yshv48",
    reporterOptions: {
      mochaFile: "bin/cypress/junit-[hash].xml",
    },
    defaultCommandTimeout: 15000,
    retries: {
      runMode: 0,
      openMode: 0,
    },
    setupNodeEvents(on) {
      console.log("00000000000000000000000000000");
      on("file:preprocessor", webpack({ webpackOptions }));
    },
    supportFile: "cypress/support/e2e.ts",
  },
});
