This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Table of Contents

- [Getting Started](#getting-started)
  - [Running Locally](#running-locally)
  - [Environment Variables](#environment-variables)
- [Deployment](#deployment)
  - [Requirements](#requirements)
  - [How to Deploy](#how-to-deploy)

## Getting Started

### Running Locally

1. Clone the Spruce Github repository
2. Run `npm install`
3. To luanch the app, run one these three commands:
   `npm run start:dev-server` will make requests to a GQL server at localhost:8080/query
   `npm run start:mock-live-schema` will obtain a GQL schema via intropspection from localhost:8080/query and mock GQL responses
   `npm run start:mock-custom-schema` will obtain the schema from .build-dev-cmdrc.json and mock GQL responses

### Environment Variables

[env-cmd](https://github.com/toddbluhm/env-cmd#readme) is used to configure build environments for production and staging environments. This file is git ignored because it contains API keys that we do not want to publish. It should be named `.cmdrc.json` and placed in the config folder at the root of the project. This file is required to deploy Spruce to production and to staging. Ask a team member to send you their copy of the file, which should look like the following:

```js
{
  "staging": {
    "REACT_APP_API_URL": "https://evergreen-staging.corp.mongodb.com/api",
    "REACT_APP_UI_URL": "https://evergreen-staging.corp.mongodb.com"
  },
  "prod": {
    "REACT_APP_BUGSNAG_API_KEY": "this-is-the-api-key",
    "REACT_APP_API_URL": "https://evergreen.mongodb.com/api",
    "REACT_APP_UI_URL": "https://evergreen.mongodb.com",
    "REACT_APP_NEW_RELIC_ACCOUNT_ID": "dummy-new-relic-account-id",
    "REACT_APP_NEW_RELIC_AGENT_ID": "dummy-new-relic-agent-id",
    "REACT_APP_NEW_RELIC_APPLICATION_ID": "dummy-new-relic-application-id",
    "REACT_APP_NEW_RELIC_LICENSE_KEY": "dummy-new-relic-license-key",
    "REACT_APP_NEW_RELIC_TRUST_KEY": "dummy-new-relic-trust-key"
  }
}
```

## Deployment

### Requirements

A `.cmdrc.json` file is required to deploy Spruce to staging or production environments. See [Environment Variables](#environment-variables) section for more info about this file.

Having a `.cmdrc.json` file sets the API and UI URLs that the application needs in production and staging environments to point to the correct APIs.

### How to Deploy:

1. Build the application for the environment to which you wish to deploy

- For staging, run `npm run build:staging`
- For production, run `npm run build:production`

2. Run `BUCKET=the-s3-bucket npm run deploy` and replace `the-s3-bucket` with the name of the S3 bucket

- Staging: evergreen-staging.spruce
- Production: evergreen.spruce
