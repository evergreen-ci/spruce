module.exports = {
  extends: ["tslint:recommended", "tslint-react", "tslint-config-prettier"],
  linterOptions: {
    exclude: [
      "env/**/*.js",
      "node_modules/**/*.ts",
      "coverage/lcov-report/*.js",
      "scripts/*",
      "src/gql/generated/types.ts",
    ],
  },
  rules: {
    "no-console": false,
    "ordered-imports": [false],
    "object-literal-sort-keys": false,
    "object-literal-shorthand": false,
    "interface-name": false,
    "max-classes-per-file": false,
    "comment-format": false,
    "class-name": false,
    "max-line-length": false,
  },
};
