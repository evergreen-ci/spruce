const path = require("path");
const webpack = require("../config/webpack.config");
const paths = require("../config/paths");

const webpackConfig = webpack("development");

module.exports = ({ config }) => {
  config.module.rules.push(
    // Graphql loader to resolve *.graphql and *.gql files
    {
      test: /\.(graphql|gql)$/,
      exclude: paths.appNodeModules,
      loader: require.resolve("graphql-tag/loader"),
    }
  );
  config.module.rules.push({
    test: /\.less$/,
    loaders: [
      "style-loader",
      "css-loader",
      {
        loader: "less-loader",
        options: { javascriptEnabled: true },
      },
    ],
    include: path.resolve(__dirname, "../src/"),
  });
  config.resolve.modules.push(...webpackConfig.resolve.modules);

  return config;
};
