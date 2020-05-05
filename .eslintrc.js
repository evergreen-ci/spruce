var fs = require("fs");
let schema;
try {
  schema = fs.readFileSync("./sdlschema.graphql", "utf8");
} catch (e) {
  schema = "";
}

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    jsx: true,
    useJSXTextNode: true,
  },
  ignorePatterns: [
    "config/**/*.js",
    "node_modules/**/*.ts",
    "coverage/lcov-report/*.js",
    "scripts/*",
    "src/serviceWorker.ts",
    "src/gql/generated/types.ts",
  ],
  extends: [
    "react-app",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  plugins: ["@typescript-eslint", "graphql", "react-hooks"],
  rules: {
    "graphql/template-strings": [
      "error",
      {
        schemaString: schema,
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
  },
};
