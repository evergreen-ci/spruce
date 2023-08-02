const isRunningOnCI = () => process.env.CI === "true";

const isDryRun = process.argv.includes("--dry-run");

export { isRunningOnCI, isDryRun };
