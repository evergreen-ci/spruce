module.exports = {
  moduleDirectories: ["node_modules", "utils", "src", __dirname],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/src/{serviceWorker.ts,index.tsx,react-app-env.d.ts}",
  ],
  coverageReporters: ["text"],
  moduleFileExtensions: [
    "web.js",
    "js",
    "web.ts",
    "ts",
    "web.tsx",
    "tsx",
    "json",
    "web.jsx",
    "jsx",
    "node",
  ],
  moduleNameMapper: {
    "^react-native$": "react-native-web",
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  modulePaths: ["<rootDir>/src"],
  resetMocks: true,
  roots: ["<rootDir>/src"],
  setupFiles: ["react-app-polyfill/jsdom"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  snapshotSerializers: ["@emotion/jest/serializer"],
  testEnvironment: "jsdom",
  resolver: "<rootDir>/src/jestResolver.js",
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
  ],
  testRunner: "<rootDir>/node_modules/jest-circus/runner.js",
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)":
      "<rootDir>/config/jest/fileTransform.js",
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
    "^.+\\.module\\.(css|sass|scss)$",
    "node_modules/(?!(antd)/)",
  ],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  globalSetup: "<rootDir>/global-setup.js",
};
