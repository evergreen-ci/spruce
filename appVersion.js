// This script writes the version number to the stdout so it can be read by appVersion.sh

const appVersion = require("./package.json").version;

console.log(appVersion);
