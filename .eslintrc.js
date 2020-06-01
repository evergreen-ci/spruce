const fs = require("fs");
const path = require("path");

let schema;
const prettierConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".prettierrc"), "utf8")
);
try {
  schema = fs.readFileSync("./sdlschema.graphql", "utf8");
} catch (e) {
  schema = "";
}

const ERROR = "error";
const WARN = "warn";
const OFF = "off";

const errorIfStrict = process.env.STRICT ? ERROR : WARN;

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
    mocha: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "plugin:import/errors",
    "plugin:import/warnings",
    "prettier",
    "prettier/react",
    "prettier/@typescript-eslint",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    cy: true,
    Cypress: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "graphql",
    "react-hooks",
    "prettier",
    "emotion",
  ],
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    "import/extensions": [".js", ".mjs", ".jsx", ".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
  rules: {
    "arrow-body-style": [
      errorIfStrict,
      "as-needed",
      {
        requireReturnForObjectLiteral: false,
      },
    ],
    "consistent-return": "off",
    curly: [errorIfStrict, "multi-line"],
    eqeqeq: [errorIfStrict, "always", { null: "ignore" }],
    // Help us with emotion
    "emotion/syntax-preference": [errorIfStrict, "string"],
    "emotion/no-vanilla": errorIfStrict,
    "emotion/import-from-emotion": ERROR,
    "graphql/template-strings": [
      ERROR,
      {
        schemaString: schema,
      },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    // We use import resolver for this
    "import/no-unresolved": OFF,
    "import/no-extraneous-dependencies": OFF,
    "import/newline-after-import": WARN,
    "import/prefer-default-export": OFF,

    // disallow use of undeclared variables unless mentioned in a
    // /*global */ block
    "no-undef": ERROR,
    "no-use-before-define": [ERROR, { functions: false, variables: false }],
    "no-empty": [ERROR, { allowEmptyCatch: true }],
    "@typescript-eslint/no-unused-vars": [
      errorIfStrict,
      { vars: "all", args: "after-used", ignoreRestSiblings: true },
    ],
    "prettier/prettier": [2, prettierConfig],
    "react/sort-comp": [
      errorIfStrict,
      { order: ["everything-else", "render"] },
    ],
    "react/jsx-props-no-spreading": [
      errorIfStrict,
      {
        custom: "ignore",
        explicitSpread: "ignore",
      },
    ],
    "react/prop-types": OFF,
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
    "react-hooks/rules-of-hooks": ERROR, // Checks rules of Hooks
    "react-hooks/exhaustive-deps": WARN, // Checks effect dependencies
    // These rules help ensure we are following proper accessability standards
    "jsx-a11y/aria-role": [errorIfStrict, { ignoreNonDom: false }],
    "jsx-a11y/aria-props": errorIfStrict,
    // renamed to anchor-is-valid
    "jsx-a11y/href-no-hash": OFF,
    "jsx-a11y/anchor-is-valid": errorIfStrict,
    "jsx-a11y/label-has-associated-control": [
      errorIfStrict,
      { some: ["nesting", "id"] },
    ],
  },
};
