module.exports = {
  presets: [
    "react-app",
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
        importSource: "@emotion/react",
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "import",
      {
        libraryName: "antd",
        libraryDirectory: "lib",
        style: "css",
      },
      "antd",
    ],
    "@emotion/babel-plugin",
    "import-graphql",
  ],
};
