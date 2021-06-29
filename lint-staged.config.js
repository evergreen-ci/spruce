module.exports = {
  "*.{js,ts,tsx,graphql,gql}": ["yarn eslint-staged", "yarn prettier"],
  "*.{ts,tsx}": () => "tsc -p tsconfig.json --noEmit",
};
