import { sync } from "replace-in-file";

type InjectVariablesInHTMLConfig = {
  files: string | string[];
  variables: string[];
}
export default (options: InjectVariablesInHTMLConfig) => {
  const from = options.variables.map((v) => new RegExp(v, "g"));
  const to = options.variables.map((v) => process.env[v.replace(/%/g, "")]);
  return {
    name: "injectVariablesInHTML",
    writeBundle: async () => {
      try {
        sync({
          files: options.files,
          from,
          to
        });
      } catch (error) {
        console.error("Error occurred:", error);
      }
    },
  };
};
