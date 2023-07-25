const {
  evergreenDeploy,
  localDeploy,
  ciDeploy,
} = require("./deploy-production");

const main = async () => {
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
