// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";
process.env.PUBLIC_URL = "";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

const jest = require("jest");
const { execSync } = require("child_process");
const path = require("path");

const argv = process.argv.slice(2);

/**
 * isInGitRepository identifies whether the current working directory uses git.
 * @returns - A boolean indicating whether the current directory uses git.
 */
function isInGitRepository() {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

// Watch unless on CI or explicitly running all tests
if (
  !process.env.CI &&
  argv.indexOf("--watchAll") === -1 &&
  argv.indexOf("--watchAll=false") === -1
) {
  // https://github.com/facebook/create-react-app/issues/5210
  const hasSourceControl = isInGitRepository();
  argv.push(hasSourceControl ? "--watch" : "--watchAll");
}

if (argv.indexOf("--reporters=jest-junit") !== -1) {
  process.env.JEST_JUNIT_OUTPUT_DIR = path.join(process.cwd(), "/bin/jest");
}

jest.run(argv);
