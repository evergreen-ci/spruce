module.exports = {
  "*.{js,ts,tsx}": ["yarn eslint-staged", "yarn prettier"],
  "src/**/*.{js,ts,tsx}": ["yarn eslint-staged:src", "yarn prettier"],
  "cypress/**/*.{js,ts}": ["yarn eslint-staged:cypress", "yarn prettier"],
  "*.{graphql,gql}": "yarn prettier --parser graphql",
  "*.{ts,tsx}": () => "tsc -p tsconfig.json --noEmit",
};
