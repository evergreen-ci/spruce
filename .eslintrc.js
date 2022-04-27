const fs = require("fs");
const path = require("path");

const prettierConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".prettierrc"), "utf8")
);

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
    "airbnb",
    "plugin:import/errors",
    "plugin:import/warnings",
    "prettier",
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
  plugins: ["@typescript-eslint", "prettier"],
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
    "no-unused-vars": OFF,
    "@typescript-eslint/no-unused-vars": [
      errorIfStrict,
      { vars: "all", args: "after-used", ignoreRestSiblings: true },
    ],
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
    "no-console": OFF,
    "no-debugger": errorIfStrict,
    "no-shadow": OFF,
    "@typescript-eslint/no-shadow": ERROR,
    // disallow use of undeclared variables unless mentioned in a
    // /*global */ block
    "no-undef": OFF,
    "no-use-before-define": OFF,
    "@typescript-eslint/no-use-before-define": [
      ERROR,
      { functions: false, variables: false },
    ],
    "no-empty": [ERROR, { allowEmptyCatch: true }],
    "no-plusplus": [ERROR, { allowForLoopAfterthoughts: true }],
    "prettier/prettier": [errorIfStrict, prettierConfig],
  },
  overrides: [
    // Lint graphql files
    {
      files: ["*.graphql"],
      parser: "@graphql-eslint/eslint-plugin",
      plugins: ["@graphql-eslint"],
      rules: {
        "prettier/prettier": "error",
      },
    },
    // the following is required for `eslint-plugin-prettier@<=3.4.0` temporarily
    // after https://github.com/prettier/eslint-plugin-prettier/pull/415
    // been merged and released, it can be deleted safely
    {
      files: ["*.graphql"],
      rules: {
        "prettier/prettier": "off",
      },
    },
  ],
};
