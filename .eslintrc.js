var fs = require("fs");
let schema;
try {
  schema = fs.readFileSync("./sdlschema", "utf8");
} catch (e) {
  schema = "";
}

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    jsx: true,
    useJSXTextNode: true,
  },
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
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
  },
};
