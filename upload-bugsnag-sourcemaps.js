const { browser } = require("@bugsnag/source-maps");

browser.uploadMultiple({
  apiKey: process.env.REACT_APP_BUGSNAG_API_KEY,
  detectAppVersion: true,
  overwrite: true,
  directory: "./build/static/js",
  baseUrl: process.env.REACT_APP_SPRUCE_URL,
});
