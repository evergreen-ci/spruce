import fs from "fs";
import { generatedFileName as localGeneratedTypesFileName } from "../../codegen";
import process from "process";
import { canResolveDNS, checkIsAncestor, downloadAndGenerate } from "./utils";

/**
 * Compare the local generated types with the remote version.
 * Exit with code 1 if the local schema is outdated or validation fails and 0 otherwise.
 * @returns {Promise<void>}
 */
export const diffTypes = async (): Promise<void> => {
  try {
    const hasInternetAccess = await canResolveDNS("github.com");
    if (!hasInternetAccess) {
      console.info(
        "Skipping GQL codegen validation because I can't connect to github.com."
      );
      process.exit(0);
    }
    const latestGeneratedTypesFileName = await downloadAndGenerate();
    const filenames = [
      latestGeneratedTypesFileName,
      localGeneratedTypesFileName,
    ];
    filenames.forEach((filename) => {
      if (!fs.existsSync(filename)) {
        console.error(
          `Types file located at ${filename} does not exist. Validation failed.`
        );
        process.exit(1);
      }
    });
    const [file1, file2] = filenames.map((filename) =>
      fs.readFileSync(filename)
    );
    if (!file1.equals(file2) && !(await checkIsAncestor())) {
      console.error(
        "You are developing against an outdated schema and the codegen task will fail in CI. Run 'yarn codegen' against the latest Evergreen code."
      );
      process.exit(1);
    }
    process.exit(0);
  } catch (error) {
    console.error(
      `An issue occurred validating the generated GQL types file: ${error}`
    );
    process.exit(1);
  }
};
