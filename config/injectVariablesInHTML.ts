import { sync, ReplaceInFileConfig } from "replace-in-file";

export default (options: ReplaceInFileConfig) => {
  return {
    name: "injectVariablesInHTML",
    writeBundle: async () => {
      try {
        sync(options);
      } catch (error) {
        console.error("Error occurred:", error);
      }
    },
  };
};
