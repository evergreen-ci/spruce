# [Spruce](https://spruce.mongodb.com) &middot; [![GitHub license](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://github.com/evergreen-ci/spruce/main/LICENSE)

Spruce is the React UI for MongoDB's continuous integration software.


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
2. Ask a colleague for their .cmdrc.json file and follow the instructions [here](#environment-variables)
3. Run `yarn`
4. Start a local evergreen server by doing the following:

- Clone the evergreen repo into your go path
- Run `make local-evergreen`

5. Run `yarn run dev`. This will launch the app and point it at the local evergreen server you just ran.

### Storybook

Run `yarn run storybook` to launch storybook and view our shared components.

### Code Formatting

Install the Prettier code formatting plugin in your code editor if you don't have it already. The plugin will use the .prettierrc settings file found at the root of Spruce to format your code.

### GQL Query Linting

Follow these directions to enable query linting during local development so your Evergreen GraphQL schema changes are reflected in your Spruce query linting results.

1. Symlink the standard definition language GraphQL schema used in your backend to a file named sdlschema in the root of the Spruce directory to enable query linting with ESlint like so `ln -s /path/to/schema sdlschema.graphql`
2. Run `yarn run eslint` to see the results of query linting in your terminal or install a plugin to integrate ESlint into your editor. If you are using VSCode, we recommend ESLint by Dirk Baeumer.

### Environment Variables

[env-cmd](https://github.com/toddbluhm/env-cmd#readme) is used to configure build environments for production, staging and development. This file is git ignored because it contains API keys that we do not want to publish. It should be named `.cmdrc.json` and placed in the `env/` folder at the root of the project. This file is required to deploy Spruce to production and to staging. Ask a team member to send you their copy of the file, which should look like the following:

```js
{
  "devServer": {
    "REACT_APP_SIGNAL_PROCESSING_URL": "https://performance-monitoring-and-analysis.server-tig.staging.corp.mongodb.com",
    "REACT_APP_GQL_URL": "http://localhost:9090/graphql/query",
    "REACT_APP_API_URL": "http://localhost:3000/api",
    "REACT_APP_UI_URL": "http://localhost:9090",
    "REACT_APP_SPRUCE_URL": "http://localhost:3000"
  },
  "staging": {
    "REACT_APP_API_URL": "https://evergreen-staging.corp.mongodb.com/api",
    "REACT_APP_UI_URL": "https://evergreen-staging.corp.mongodb.com",
    "REACT_APP_SPRUCE_URL": "https://evergreen-staging.spruce.s3-website-us-east-1.amazonaws.com"
  },
  "prod": {
    "REACT_APP_SIGNAL_PROCESSING_URL": "https://performance-monitoring-and-analysis.server-tig.prod.corp.mongodb.com",
    "REACT_APP_DEPLOYS_EMAIL": "something@something.com", 
    "REACT_APP_SPRUCE_URL": "https://spruce.mongodb.com",
    "REACT_APP_BUGSNAG_API_KEY": "this-is-the-api-key",
    "REACT_APP_API_URL": "https://evergreen.mongodb.com/api",
    "REACT_APP_UI_URL": "https://evergreen.mongodb.com",
    "REACT_APP_LOBSTER_URL": "https://evergreen.mongodb.com",
    "REACT_APP_NEW_RELIC_ACCOUNT_ID": "dummy-new-relic-account-id",
    "REACT_APP_NEW_RELIC_AGENT_ID": "dummy-new-relic-agent-id",
    "REACT_APP_NEW_RELIC_APPLICATION_ID": "dummy-new-relic-application-id",
    "REACT_APP_NEW_RELIC_LICENSE_KEY": "dummy-new-relic-license-key",
    "REACT_APP_NEW_RELIC_TRUST_KEY": "dummy-new-relic-trust-key"
  }
}
```

## GraphQL Type Generation

We use Code generation to generate our types for our GraphQL queries and mutations. When you create a query or mutation you can run the code generation script with the steps below. The types for your query/mutation response and variables will be generated and saved to `gql/generated/types.ts`. Much of the underlying types for subfields in your queries will likely be generated there as well and you can refer to those before creating your own.

### Setting up code generation

- create a symlink from the `schema.graphql` file from evergreen with the spruce folder using `ln -s path-to-evergreen-schema.graphql sdlschema.graphql`

### Using code generation

- From within the spruce folder run `yarn run codegen`
- As long as your queries are declared correctly the types should generate

### Code generation troubleshooting and tips

- Queries should be declared with a query name so the code generation knows what to name the corresponding type.
- Each query and mutation should have a unique name.
- Since query analysis for type generation occurs statically we cant place dynamic variables with in query strings we instead have to hard code the variable in the query or pass it in as query variable.

## Testing
Spruce has a combination of unit tests using Jest, and integration tests using Cypress.

### Unit tests
TODO: write more here. The Jest tests can be run by typing `yarn test`

### E2E tests
At a high level, we use Cypress to start a virtual browser that is running Spruce. Cypress then is able to run our test specs, which tell it to interact with the browser in certain ways and makes assertions about what happens in the UI. Note that you must be running the Evergreen server on localhost:9090 for the front-end to work.

In order to run the Cypress tests, do the following, assuming you have this repo checked out and all the dependencies installed by yarn:
1. Start the evergreen back-end with the sample local test data. You can do this by typing `make local-evergreen` in your evergreen folder.
2. Start the Spruce dev server by typing `yarn dev` in this repo.
3. Run Cypress by typing one of the following:
    - `yarn cy:open` - opens the Cypress app in interactive mode. You can select tests to run from here in the Cypress browser.
    - `yarn cy:run` - runs all the Cypress tests at the command-line and reports the results
    - `yarn cy:test cypress/integration/hosts/hosts-filtering.ts` - runs tests in a specific file at the command-line. Replace the final argument with the relative path to your test file

## How to get data for your feature
If you need more data to be able to test out your feature locally the easiest way to do it is to populate the local db using real data from the staging or production environments.

1. You should identify if the data you need is located in the staging or prod db and ssh into them (You should be connected to the office network or vpn before proceeding). The urls for these db servers can be located in the `fabfile.py` located in the evergreen directory or [here](https://github.com/10gen/kernel-tools/blob/master/evergreen/fabfile.py).
2. You should ensure you are connected to a secondary node before proceeding.
3. Run `mongo` to open the the mongo shell.
4. Identify the query you need to fetch the data you are looking for. 

    ```
    mci:SECONDARY> rs.secondaryOk() // Allows read operations on a secondary node
    mci:SECONDARY> use mci // use the correct db
    switched to db mci
    mci:SECONDARY>  db.distro.find({_id: "archlinux-small"}) // the full query
    ```
5. Exit from the mongo shell and prepare to run `mongoexport`
    ```
    mongoexport --db=mci --collection=distro --out=distro.json --query='{_id: "archlinux-small"}' 
    2020-07-29T17:41:50.266+0000	connected to: localhost
    2020-07-29T17:41:50.269+0000	exported 1 record
    ```
   After running this command a file will be saved to your home directory with the results of the `mongoexport`

    *Note you may need to provide the full path to mongoexport on the staging db*

    ```
    /var/lib/mongodb-mms-automation/mongodb-linux-x86_64-4.0.5/bin/mongoexport --db=mci --collection=distro --out=distro.json --query='{_id: "archlinux-small"}' 
    2020-07-29T17:41:50.266+0000	connected to: localhost
    2020-07-29T17:41:50.269+0000	exported 1 record
    ```
6. Exit the ssh session using `exit` or `Ctrl + D`
7. You can now transfer this json file to your local system by running the following command. `scp <db you sshed into>:~/distro.json .` This will save a file named `distro.json` to the current directory
8. You should run this file through the scramble-eggs script to sanitize it and remove any sensitive information `make scramble file=<path to file>.json` from within the evergreen folder
9. Once you have this file you can copy the contents of it to the relevant `testdata/local/<collection>.json` file with in the evergreen folder
10. You can then delete `/bin/.load-local-data` within the evergreen folder and run `make local-evergreen` to repopulate the local database with your new data.

**Notes**

When creating your queries you should be sure to limit the amount of documents so you don't accidently export an entire collection you can do this by passing a `--limit=<number>` flag to `mongoexport`
## Deployment

### Requirements

You must be on the `main` Branch if deploying to prod.

A `.cmdrc.json` file is required to deploy because it sets the environment variables that the application needs in production and staging environments. See [Environment Variables](#environment-variables) section for more info about this file.

### How to Deploy:

Run the `deploy:prod` or `deploy:staging` yarn command

1. `yarn run deploy:prod` = deploy to https://spruce.mongodb.com
2. `yarn run deploy:staging` = deploy to https://spruce-staging.corp.mongodb.com

After deploying you will be prompted to run `git push --tags` or `git push upstream --tags` depending on your setup, this is important so we can track releases. 
