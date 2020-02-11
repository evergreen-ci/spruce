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
    useJSXTextNode: true
  },
  extends: [
    "react-app",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  plugins: ["@typescript-eslint", "graphql"],
  rules: {
    "graphql/template-strings": [
      "error",
      {
        schemaString: schema
      }
    ]
  }
};
