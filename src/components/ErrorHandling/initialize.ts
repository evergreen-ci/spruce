import { environmentVariables } from "utils";
import { initializeSentry, isInitialized } from "./Sentry";

const { isProductionBuild } = environmentVariables;

export const initializeErrorHandling = () => {
  if (!isProductionBuild()) {
    return;
  }

  if (!isInitialized()) {
    initializeSentry();
  }
};
