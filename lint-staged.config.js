module.exports = {
  "*.{js,ts,tsx}": ["yarn eslint-staged", "yarn prettier"],
  "*.{graphql,gql}": "yarn prettier --parser graphql",
  "*.{ts,tsx}": "tsc -p tsconfig.json --noEmit",
};
