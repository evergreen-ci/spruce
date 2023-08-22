import { defineConfig } from "cypress";
import { execSync } from "child_process";

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
    setupNodeEvents(on) {
      on("before:run", () => {
        try {
          execSync("yarn dump-evg");
        } catch (e) {
          console.error(e);
        }
      });
      on("after:run", () => {
        try {
          execSync("yarn evg-ops --clean-up");
        } catch (e) {
          console.error(e);
        }
      });
    },
  },
});
