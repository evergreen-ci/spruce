const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../env", ".cmdrc.json");
const prod = {
  REACT_APP_LOBSTER_URL: "https://evergreen.mongodb.com",
  REACT_APP_SIGNAL_PROCESSING_URL:
    "https://signal-processing-service.server-tig.prod.corp.mongodb.com",
  REACT_APP_API_URL: "https://evergreen.mongodb.com/api",
  REACT_APP_UI_URL: "https://evergreen.mongodb.com",
  REACT_APP_GQL_URL: "https://evergreen.mongodb.com/graphql/query",
  REACT_APP_SPRUCE_URL: "https://spruce.mongodb.com",
  REACT_APP_BUGSNAG_API_KEY: process.env.REACT_APP_BUGSNAG_API_KEY,
  REACT_APP_NEW_RELIC_ACCOUNT_ID: process.env.REACT_APP_NEW_RELIC_ACCOUNT_ID,
  REACT_APP_NEW_RELIC_AGENT_ID: process.env.REACT_APP_NEW_RELIC_AGENT_ID,
  REACT_APP_NEW_RELIC_APPLICATION_ID:
    process.env.REACT_APP_NEW_RELIC_APPLICATION_ID,
  REACT_APP_NEW_RELIC_LICENSE_KEY: process.env.REACT_APP_NEW_RELIC_LICENSE_KEY,
  REACT_APP_NEW_RELIC_TRUST_KEY: process.env.REACT_APP_NEW_RELIC_TRUST_KEY,
  REACT_APP_DEPLOYS_EMAIL: process.env.REACT_APP_DEPLOYS_EMAIL,
};
fs.writeFile(file, JSON.stringify({ prod }), (err) => {
  if (err) {
    return console.error(err);
  }
});
