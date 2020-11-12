module.exports = {
  "*.{js,ts,tsx}": ["yarn eslint-staged", "yarn prettier"],
  "*.{ts,tsx}": () => "tsc -p tsconfig.json --noEmit",
};
