import { ciDeploy, evergreenDeploy, localDeploy } from "./deploy-production";
import { red, yellow } from "../utils/colors";
import { isDryRun, isRunningOnCI } from "./utils/environment";
import { isOnMainBranch, isWorkingDirectoryClean } from "./utils/git";

const main = async () => {
  // If this is a dry run, disable the safety checks
  if (isDryRun) {
    console.log(yellow("Dry run mode enabled. No changes will be made."));
  } else {
    console.log("Checking if you are on the main branch");
    if (!isOnMainBranch()) {
      console.log(red("You must be on the main branch to deploy!"));
      process.exit(1);
    }
    // If this is a ci run, disable the working directory check
    if (!isRunningOnCI()) {
      if (!isWorkingDirectoryClean()) {
        console.log(red("You must have a clean working directory to deploy"));
        process.exit(1);
      }
    }
  }
  if (process.argv.includes("--local")) {
    await localDeploy();
    return;
  }
  if (isRunningOnCI()) {
    await ciDeploy();
    return;
  }
  await evergreenDeploy();
};

main();
