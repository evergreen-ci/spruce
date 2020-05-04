module.exports = {
  "*.{js,ts,tsx}": ["npm run eslint", "npm run prettier"],
  "*.{ts,tsx}": () => "tsc -p tsconfig.json --noEmit",
};
