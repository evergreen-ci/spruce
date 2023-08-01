const {
  ciDeploy,
  evergreenDeploy,
  localDeploy,
} = require("./deploy-production");

const { isOnMainBranch } = require("./deploy-utils");

const main = async () => {
  if (!isOnMainBranch()) {
    console.log("You must be on the main branch to deploy!");
    return;
  }
  if (!isWorkingDirectoryClean()) {
    console.log("You must have a clean working directory to deploy");
    return;
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
