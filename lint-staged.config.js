module.exports = {
  "(?!src/)*.{js,ts,tsx}": ["yarn eslint:staged", "yarn prettier"], // For files that are not in src/, run eslint and prettier
  "src/**/*.{js,ts,tsx}": ["yarn eslint:staged", "yarn prettier"], // For files in src/, run eslint and prettier
  "cypress/**/*.{js,ts}": ["yarn eslint:staged", "yarn prettier"], // For files in cypress/, run eslint and prettier
  "src/**/*.{graphql,gql}": [
    "yarn eslint:staged",
    "yarn prettier --parser graphql",
  ], // For GraphQL files, run eslint and prettier
  "*.{ts,tsx}": () => "tsc -p tsconfig.json --noEmit", // For TypeScript files, run tsc
};
