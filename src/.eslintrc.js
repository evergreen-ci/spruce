const fs = require("fs");

let schema;
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
  extends: [
    "../.eslintrc.js",
    "plugin:react/recommended",
    "prettier/react",
    "prettier/@typescript-eslint",
  ],
  plugins: [
    "react",
    "graphql",
    "react-hooks",
    "@emotion",
    "testing-library",
    "jest",
  ],
  rules: {
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
    "react/display-name": OFF,
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
  overrides: [
    {
      // or whatever matches stories specified in .storybook/main.js
      files: ["*.stories.@(ts|tsx|js|jsx|mjs|cjs)"],
      extends: ["plugin:storybook/recommended"],
      rules: {
        "storybook/story-exports": ERROR,
        "storybook/no-stories-of": ERROR,
        "storybook/no-redundant-story-name": WARN,
        "storybook/csf-component": WARN, // Enables support for auto generated prop controls and documentation
      },
    },
    {
      files: ["*.test.ts", "*.test.tsx"],
      extends: [
        "plugin:testing-library/recommended",
        "plugin:testing-library/react",
        "plugin:jest/all",
      ],
      rules: {
        "jest/no-hooks": OFF,
        "jest/no-mocks-import": OFF,
        "jest/prefer-expect-assertions": OFF,
      },
    },
  ],
};
