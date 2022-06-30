import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    projectId: "yshv48",
    reporterOptions: {
      mochaFile: "bin/cypress/junit-[hash].xml",
    },
    defaultCommandTimeout: 8000,
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/integration/**/*.ts",
    scrollBehavior: "bottom",
    viewportHeight: 800,
    viewportWidth: 1280,
  },
});
