const { upload } = require("bugsnag-sourcemaps");
const glob = require("glob");
const reportBuild = require("bugsnag-build-reporter");
const appVersion = require("./package.json").version;

/**
 * Find all of the map files in ./build
 */
function findSourceMaps(callback) {
  return glob("build/**/*/*.map", callback);
}

/**
 * Uploads the source map with accompanying sources
 * @param sourceMap - single .map file
 * @returns {Promise<string>} - upload to Bugsnag
 */
function uploadSourceMap(sourceMap) {
  // Remove .map from the file to get the js filename
  const minifiedFile = sourceMap.replace(".map", "");

  // Remove absolute path to the static assets folder
  const minifiedFileRelativePath = minifiedFile.split("build/")[1];

  return upload({
    apiKey: process.env.REACT_APP_BUGSNAG_API_KEY,
    appVersion,
    overwrite: true,
    minifiedUrl: `http*://${process.env.REACT_APP_SITE_HOSTNAME}/${minifiedFileRelativePath}`,
    sourceMap,
    minifiedFile,
    projectRoot: __dirname,
    uploadSources: true,
  });
}

/**
 * Notifies Bugsnag of the release
 */
function notifyRelease() {
  reportBuild({
    apiKey: process.env.REACT_APP_BUGSNAG_API_KEY,
    appVersion,
  })
    .then(() => console.log("Bugsnag build reported"))
    .catch((err) =>
      console.log("Reporting Bugsnag build failed", err.messsage)
    );
}

/**
 * Find and upload Source Maps
 */
function processSourceMaps() {
  findSourceMaps((_, files) =>
    Promise.all(files.map(uploadSourceMap))
      .then(() => {
        notifyRelease();
      })
      .catch((e) => {
        console.log(e);
      })
  );
}

processSourceMaps();
