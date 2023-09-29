module.exports = {
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/src/{index.tsx,react-app-env.d.ts}",
  ],
  coverageReporters: ["text"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^nanoid$": "<rootDir>/node_modules/nanoid/index.cjs",
    "^antd/es/(.*)$": "antd/lib/$1",
  },
  modulePaths: ["<rootDir>/src"],
  resetMocks: true,
  setupFiles: ["react-app-polyfill/jsdom", "jest-canvas-mock"],
  setupFilesAfterEnv: ["<rootDir>/config/jest/setupTests.ts"],
  snapshotSerializers: ["@emotion/jest/serializer"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/{src,scripts}/**/*.{spec,test}.{js,jsx,ts,tsx}"],
  testRunner: "<rootDir>/node_modules/jest-circus/runner.js",
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "babel-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)":
      "<rootDir>/config/jest/fileTransform.js",
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!${[
      // jest doesn't officially support ESM so ignore ansi_up: https://jestjs.io/docs/ecmascript-modules
      "ansi_up",
      "antd",
      // The following modules are all related to the query-string package.
      "query-string",
      "decode-uri-component",
      "split-on-first",
      "filter-obj",
    ].join("|")})`,
  ],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  globalSetup: "<rootDir>/global-setup.js",
  testTimeout: 30000,
};
