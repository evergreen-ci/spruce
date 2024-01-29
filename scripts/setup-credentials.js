const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../", ".env-cmdrc.json");
const production = {
  REACT_APP_SIGNAL_PROCESSING_URL:
    "https://performance-monitoring-and-analysis.server-tig.prod.corp.mongodb.com",
  REACT_APP_API_URL: "https://evergreen.mongodb.com/api",
  REACT_APP_UI_URL: "https://evergreen.mongodb.com",
  REACT_APP_GQL_URL: "https://evergreen.mongodb.com/graphql/query",
  REACT_APP_PARSLEY_URL: "https://parsley.mongodb.com",
  REACT_APP_SPRUCE_URL: "https://spruce.mongodb.com",
  REACT_APP_RELEASE_STAGE: "production",
  REACT_APP_SENTRY_AUTH_TOKEN: process.env.REACT_APP_SENTRY_AUTH_TOKEN,
  REACT_APP_SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
  REACT_APP_NEW_RELIC_ACCOUNT_ID: process.env.REACT_APP_NEW_RELIC_ACCOUNT_ID,
  REACT_APP_NEW_RELIC_AGENT_ID: process.env.REACT_APP_NEW_RELIC_AGENT_ID,
  REACT_APP_NEW_RELIC_APPLICATION_ID:
    process.env.REACT_APP_NEW_RELIC_APPLICATION_ID,
  REACT_APP_NEW_RELIC_LICENSE_KEY: process.env.REACT_APP_NEW_RELIC_LICENSE_KEY,
  REACT_APP_NEW_RELIC_TRUST_KEY: process.env.REACT_APP_NEW_RELIC_TRUST_KEY,
  DEPLOYS_EMAIL: process.env.DEPLOYS_EMAIL,
  REACT_APP_HONEYCOMB_BASE_URL: process.env.REACT_APP_HONEYCOMB_BASE_URL,
};
fs.writeFile(file, JSON.stringify({ production }), (err) => {
  if (err) {
    return console.error(err);
  }
});
