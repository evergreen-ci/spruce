# [Spruce](https://spruce.mongodb.com) &middot; [![GitHub license](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://github.com/evergreen-ci/spruce/main/LICENSE)

Spruce is the React UI for MongoDB's continuous integration software.

## Getting Started

### Running Locally

1. Clone the Spruce GitHub repository
2. Ensure you have Node.js v20+ and MongoDB Command Line Database Tools
   v100.8.0+ installed
3. Run `yarn install`
4. Start a local Evergreen server by doing the following:
    - Clone the [Evergreen repo](https://github.com/evergreen-ci/evergreen)
    - From the Evergreen directory, run `make local-evergreen`
5. Run `yarn run dev`. This will launch the app and point it at the local
   Evergreen server you just started.

### Storybook

Run `yarn run storybook` to launch storybook and view our shared components.

### Code Formatting

Install the Prettier code formatting plugin in your code editor if you don't
have it already. The plugin will use the .prettierrc settings file found at the
root of Spruce to format your code.

### GQL Query Linting

Follow these directions to enable query linting during local development so your
Evergreen GraphQL schema changes are reflected in your Spruce query linting
results.

1. Symlink the standard definition language GraphQL schema used in your backend
   to a file named sdlschema in the root of the Spruce directory to enable query
   linting with ESLint like so
   `ln -s <path_to_evergreen_repo>/graphql/schema sdlschema`
2. Run `yarn run eslint` to see the results of query linting in your terminal or
   install a plugin to integrate ESlint into your editor. If you are using
   VS Code, we recommend ESLint by Dirk Baeumer.

### Environment Variables

[env-cmd](https://github.com/toddbluhm/env-cmd#readme) is used to configure
build environments for production, staging and development. We use two files to
represent these various environments: `.env-cmdrc.local.json` for local builds
with non-sensitive information, and `.env-cmdrc.json` for builds deployed to S3.
This file is git ignored because it contains API keys that we do not want to
publish. It should be named `.env-cmdrc.json` and placed in the root of the
project. This file is required to deploy Spruce to production and to staging.
The credential file is located in the R&D Dev Prod 1Password vault.

## GraphQL Type Generation

We use code generation to generate our types for our GraphQL queries and
mutations. When you create a query or mutation you can run the code generation
script with the steps below. The types for your query/mutation response and
variables will be generated and saved to `gql/generated/types.ts`. Much of the
underlying types for subfields in your queries will likely be generated there as
well and you can refer to those before creating your own.

### Setting up code generation

- Create a symlink from the `schema` folder from Evergreen to Spruce using

```bash
ln -s <path_to_evergreen_repo>/graphql/schema sdlschema
```

### Using code generation

- From within the Spruce folder run `yarn codegen`
- As long as your queries are declared correctly the types should generate

### Code generation troubleshooting and tips

- Queries should be declared with a query name so the code generation knows what
  to name the corresponding type.
- Each query and mutation should have a unique name.
- Since query analysis for type generation occurs statically we can't place
  dynamic variables with in query strings. We instead have to hard code the
  variable in the query or pass it in as query variable.

### Common errors

- Sometimes you may run into an error where a dependency is out of date or in a
  broken state. If you run into this issue try running `yarn install` to
  reinstall all dependencies. If that does not work try deleting your
  `node_modules` folder and running `yarn install` again. You can use the
  `yarn clean` command to do this for you.

## Testing

Spruce has a combination of unit tests using Jest, and integration tests using
Cypress.

### Unit tests

Unit tests are used to test individual features in isolation. We utilize the
[Jest Test Runner](https://jestjs.io/) to execute our unit tests and generate
reports.

There are 3 types of unit tests you may encounter in this codebase.

#### Component Tests

These test React components. We utilize
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
to help us write our component tests. React Testing Library provides several
utilities that are useful for making assertions on React Componenents. When
writing component tests you should import
[test_utils](https://github.com/evergreen-ci/spruce/blob/main/src/test_utils/index.tsx)
instead of React Testing Library; `test_utils` is a wrapper around React Testing
Library which provides a series of helpful utilities for common testing
scenarios such as `queryByDataCy`, which is a helper for selecting `data-cy`
attributes, or `renderWithRouterMatch`, which is helpful for testing components
that rely on React Router.

#### Hook Tests

Often times you may find yourself writing
[custom React hooks](https://reactjs.org/docs/hooks-custom.html). The best way
to test these is using React Testing Library's [`renderHook`](https://testing-library.com/docs/react-testing-library/api#renderhook) utility. This allows you to test your custom hooks in isolation without
needing to wrap them in a component. It provides several methods that make it
easy to assert and test different behaviors in your hooks. Such as [`waitFor`](https://testing-library.com/docs/dom-testing-library/api-async/#waitfor), 
which will wait for your hook to rerender before allowing a test to proceed.

#### Standard utility tests

These are the most basic of tests. They do not require any special libraries to
run and often just test standard JavaScript functions.

- You can run all unit tests using `yarn test`
- You can run a specific unit test using `yarn test -t <test_name>`
- You can run Jest in watch mode using `yarn test:watch` This will open an
  interactive CLI that can be used to automatically run tests as you update them.

### E2E tests

At a high level, we use [Cypress](https://www.cypress.io/) to start a virtual
browser that is running Spruce. Cypress then is able to run our test specs,
which tell it to interact with the browser in certain ways and makes assertions
about what happens in the UI. Note that you must be running the Evergreen server
on http://localhost:9090 for the front-end to work.

In order to run the Cypress tests, do the following, assuming you have this repo
checked out and all the dependencies installed by Yarn:

1. Increase the limit on open files by running `ulimit -n 64000` before running
   mongod in the same shell.
2. Start the evergreen back-end with the sample local test data. You can do this
   by typing `make local-evergreen` in your evergreen folder.
3. Start the Spruce local server by typing `yarn build:local && yarn serve` in
   this repo.
4. Run Cypress by typing one of the following:
   - `yarn cy:open` - opens the Cypress app in interactive mode. You can select
     tests to run from here in the Cypress browser.
   - `yarn cy:run` - runs all the Cypress tests at the command-line and reports
     the results
   - `yarn cy:test cypress/integration/hosts/hosts-filtering.ts` - runs tests in
     a specific file at the command-line. Replace the final argument with the
     relative path to your test file

### Snapshot Tests

Snapshot tests are automatically generated when we create Storybook stories.
These tests create a snapshot of the UI and compare them to previous snapshots
which are stored as files along side your Storybook stories in a `__snapshots__`
directory. They try to catch unexpected UI regressions. Read more about them
[here](https://jestjs.io/docs/snapshot-testing).

## How to get data for your feature

If you need more data to be able to test out your feature locally, the easiest
way to do so is to populate the local db using real data from the staging or
production environments.

1. You should identify if the data you need is located in the staging or prod db
   and ssh into them (You should be connected to the office network or vpn
   before proceeding). The urls for these db servers can be located in the
   `fabfile.py` located in the evergreen directory or
   [here](https://github.com/10gen/kernel-tools/blob/master/evergreen/fabfile.py).
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

   After running this command a file will be saved to your home directory with
   the results of the `mongoexport`

   _Note you may need to provide the full path to mongoexport on the staging db_

   ```
   /var/lib/mongodb-mms-automation/mongodb-linux-x86_64-4.0.5/bin/mongoexport --db=mci --collection=distro --out=distro.json --query='{_id: "archlinux-small"}'
   2020-07-29T17:41:50.266+0000	connected to: localhost
   2020-07-29T17:41:50.269+0000	exported 1 record
   ```

6. Exit the ssh session using `exit` or `Ctrl + D`
7. You can now transfer this json file to your local system by running the
   following command. `scp <db you sshed into>:~/distro.json .` This will save a
   file named `distro.json` to the current directory
8. You should run this file through the scramble-eggs script to sanitize it and
   remove any sensitive information `make scramble file=<path to file>.json`
   from within the evergreen folder
9. Once you have this file you can copy the contents of it to the relevant
   `testdata/local/<collection>.json` file with in the evergreen folder
10. You can then run `yarn evg-db-ops --reseed` to repopulate the local database
    with your new data.

**Notes**

When creating your queries you should be sure to limit the amount of documents
so you don't accidently export an entire collection you can do this by passing a
`--limit=<number>` flag to `mongoexport`

### Logkeeper

Spruce has a minimal dependency on Logkeeper: it is used by Cypress tests on
the Job Logs page. If you'd like to get set up to develop these tests, complete
the following:

1. Clone the [Logkeeper repository](https://github.com/evergreen-ci/logkeeper)
2. Run `yarn bootstrap-logkeeper` within Spruce to download some sample resmoke logs from S3.
3. Run the command output by the previous step to seed the env variables and
   start the local logkeeper server at http://localhost:8080.

## Deployment

### Requirements

You must be on the `main` branch if deploying to prod.

An `.env-cmdrc.json` file is required to deploy because it sets the environment
variables that the application needs in production and staging environments. See
[Environment Variables](#environment-variables) section for more info about this
file.

### How to Deploy:

Run one of the following commands to deploy to the appropriate environment

1. `yarn deploy:prod` = deploy to https://spruce.mongodb.com
2. `yarn deploy:staging` = deploy to https://spruce-staging.corp.mongodb.com
3. `yarn deploy:beta` = deploy to https://spruce-beta.corp.mongodb.com (Beta
   connects to the production backend)

In case of emergency (i.e. Evergreen, GitHub, or other systems are down), a
production build can be pushed directly to S3 with `yarn deploy:prod --local`.
