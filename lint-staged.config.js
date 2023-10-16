module.exports = {
  "(?!src/)*.{js,ts,tsx}": ["yarn eslint:staged", "yarn prettier"], // For files that are not in src/, run eslint and prettier
  "src/**/*.{js,ts,tsx}": ["yarn eslint:staged", "yarn prettier"], // For files in src/, run eslint and prettier
  "cypress/**/*.{js,ts}": ["yarn eslint:staged", "yarn prettier"], // For files in cypress/, run eslint and prettier
  "src/gql/**/*.{graphql,gql}": [
    "yarn eslint:staged",
    "yarn prettier --parser graphql",
    "yarn check-schema-and-codegen",
  ], // For GraphQL files, run eslint and prettier, and gql schema check
  "*.{ts,tsx}": () => [
    "tsc -p tsconfig.json --noEmit",
    "yarn check-schema-and-codegen",
  ], // For TypeScript files, run tsc, and gql schema check
};
