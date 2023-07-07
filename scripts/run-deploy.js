const { evergreenDeploy, localDeploy } = require("./deploy-production");

const main = async () => {
  if (process.argv.includes("--local")) {
    await localDeploy();
    return;
  }
  await evergreenDeploy();
};

main();
