module.exports = {
  "(?!src/)*.{js,ts,tsx}": ["yarn eslint-staged", "yarn prettier"], // For files that are not in src/, run eslint-staged and prettier
  "src/**/*.{js,ts,tsx}": ["yarn eslint-staged:src", "yarn prettier"], // For files in src/, run eslint-staged:src and prettier
  "cypress/**/*.{js,ts}": ["yarn eslint-staged:cypress", "yarn prettier"], // For files in cypress/, run eslint-staged:cypress and prettier
  "*.{graphql,gql}": "yarn prettier --parser graphql", // For GraphQL files, run prettier
  "*.{ts,tsx}": () => "tsc -p tsconfig.json --noEmit", // For TypeScript files, run tsc
};
