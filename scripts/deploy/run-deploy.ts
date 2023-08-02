import {
  isDryRun,
  isOnMainBranch,
  isWorkingDirectoryClean,
} from "./deploy-utils";
import { ciDeploy, evergreenDeploy, localDeploy } from "./deploy-production";
import { red, yellow } from "../utils/colors";

const main = async () => {
  // If this is a dry run, disable the safety checks
  if (isDryRun) {
    console.log(yellow("Dry run mode enabled. No changes will be made."));
  } else {
    if (!isOnMainBranch()) {
      console.log(red("You must be on the main branch to deploy!"));
      process.exit(1);
    }
    if (!isWorkingDirectoryClean()) {
      console.log(red("You must have a clean working directory to deploy"));
      process.exit(1);
    }
  }
  if (process.argv.includes("--local")) {
    await localDeploy();
    return;
  }
  if (process.argv.includes("--ci")) {
    await ciDeploy();
    return;
  }
  await evergreenDeploy();
};

main();
