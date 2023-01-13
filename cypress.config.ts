import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    projectId: "yshv48",
    reporterOptions: {
      mochaFile: "bin/cypress/junit-[hash].xml",
    },
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/integration/**/*.ts",
    viewportWidth: 1920,
    viewportHeight: 1080,
    testIsolation: false,
  },
});
