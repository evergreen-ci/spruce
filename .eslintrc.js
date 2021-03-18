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
    "plugin:testing-library/recommended",
    "plugin:testing-library/react",
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
    "@emotion",
    "testing-library",
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
    // Help us with emotion
    "@emotion/import-from-emotion": ERROR,
    "@emotion/no-vanilla": errorIfStrict,
    "@emotion/pkg-renaming": ERROR,
    "@emotion/syntax-preference": [errorIfStrict, "string"],
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
    "no-console": OFF,
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
    "react/react-in-jsx-scope": OFF, // This is no longer necessary as of React 17
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
    "react/require-default-props": OFF,
    "react-hooks/rules-of-hooks": ERROR, // Checks rules of Hooks
    "react-hooks/exhaustive-deps": WARN, // Checks effect dependencies
    "import/order": [
      "error",
      {
        groups: ["external", "builtin", "internal"],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
          {
            pattern: "@**",
            group: "external",
            position: "before",
          },
          {
            pattern:
              "(analytics|components|constants|context|gql|hoc|hooks|pages|types|utils)/**",
            group: "internal",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};
