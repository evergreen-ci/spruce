const {
  ciDeploy,
  evergreenDeploy,
  localDeploy,
} = require("./deploy-production");

const main = async () => {
  if (!(await isOnMainBranch())) {
    console.log("You must be on the main branch to deploy!");
    return;
  }
  if (!(await isWorkingDirectoryClean())) {
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
