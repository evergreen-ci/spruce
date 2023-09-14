import fs from "fs";
import process from "process";
import { generatedFileName as existingTypesFileName } from "../../codegen";
import {
  checkIsAncestor,
  generateTypes,
  getLatestCommitFromRemote,
} from "./utils";

const failCopy = "GQL types validation failed:";

/**
 * An async function that returns 1 if the local types file is outdated and 0 otherwise.
 * @returns Promise<number>
 */
export const checkSchemaAndCodegenCore = async (): Promise<number> => {
  try {
    const commit = await getLatestCommitFromRemote();
    const hasLatestCommit = await checkIsAncestor(commit);
    if (!hasLatestCommit) {
      console.error(
        `${failCopy} Your local Evergreen code is missing commit ${commit}. Pull Evergreen and run 'yarn codegen'.`
      );
      return 1;
    }
    // Finally check to see if 'yarn codegen' was ran.
    const filenames = [await generateTypes(), existingTypesFileName];
    const [file1, file2] = filenames.map((filename) =>
      fs.readFileSync(filename)
    );
    if (!file1.equals(file2)) {
      console.error(
        `${failCopy} Your GQL types file (${existingTypesFileName}) is outdated. Run 'yarn codegen'.`
      );
      return 1;
    }
  } catch (error) {
    console.error(`An error occured during GQL types validation: ${error}`);
  }
  return 0;
};

export const checkSchemaAndCodegen = async () => {
  process.exit(await checkSchemaAndCodegenCore());
};
