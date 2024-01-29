/**
 * `getApiUrl()` - Get the API URL from the environment variables
 * @returns - The Evergreen API URL
 */
export const getApiUrl: () => string = () =>
  process.env.REACT_APP_API_URL || "";

/**
 * `getSentryDSN()` - Get the Sentry Data Source Name (SENTRY_DSN) from the environment variables
 * @returns - The application's DSN
 */
export const getSentryDSN: () => string = () =>
  process.env.REACT_APP_SENTRY_DSN;

/**
 * `getUiUrl()` - Get the backing evergreen URL from the environment variables
 * @returns - Returns the backing evergreen url
 */
export const getUiUrl: () => string = () => process.env.REACT_APP_UI_URL || "";

/**
 * `getSignalProcessingUrl()` - Get the TIPS Signal Processing URL from the environment variables
 * @returns - Returns the TIPS Signal Processing Iframe URL
 */
export const getSignalProcessingUrl: () => string = () =>
  process.env.REACT_APP_SIGNAL_PROCESSING_URL || "";

/**
 * `getSpruceURL()` - Get the SPRUCE URL from the environment variables
 * @returns - Returns the Spruce URL
 */
export const getSpruceURL: () => string = () =>
  process.env.REACT_APP_SPRUCE_URL;

/**
 * `isDevelopmentBuild()` indicates if the current environment is a local development environment.
 * @returns `true` if the current environment is a local development environment.
 */
export const isDevelopmentBuild: () => boolean = () =>
  process.env.NODE_ENV === "development";

/**
 * `isProductionBuild()` indicates if the current environment is a production bundle.
 * @returns `true` if the current environment is a production build.
 */
export const isProductionBuild = (): boolean =>
  process.env.NODE_ENV === "production";

/**
 * `isBeta()` indicates if the current build is a build meant for a beta deployment.
 * @returns `true` if the current build is a beta build.
 */
export const isBeta = (): boolean => getReleaseStage() === "beta";

/**
 * `isStaging()` indicates if the current build is a build meant for a staging deployment.
 * @returns `true` if the current build is a staging build.
 */
export const isStaging = (): boolean => getReleaseStage() === "staging";

/**
 * `isProduction()` indicates if the current build is a build meant for a production deployment.
 * @returns `true` if the current build is a production build.
 */
export const isProduction = (): boolean => getReleaseStage() === "production";

/**
 * `isTest()` indicates if the current environment is a test environment.
 * @returns `true` if the current environment is a test environment.
 */
export const isTest = () => process.env.NODE_ENV === "test";

/**
 * `getGQLUrl()` - Get the GQL URL from the environment variables
 * @returns - Returns the graphql endpoint for the current environment.
 */
export const getGQLUrl: () => string = () =>
  process.env.REACT_APP_GQL_URL || "";

/**
 * `getParsleyUrl()` - Get the Parsley URL from the environment variables
 * @returns - Returns the Parsley URL.
 */
export const getParsleyUrl = (): string =>
  process.env.REACT_APP_PARSLEY_URL || "";

/**
 * `getAppVersion()` - Get the app release version from the environment variables
 * @returns - Returns the release version.
 */
export const getAppVersion = () => process.env.REACT_APP_VERSION || "";

/**
 * `getReleaseStage()` - Get the release stage from the environment variables
 * @returns - Returns the production release environment
 */
export const getReleaseStage = () => process.env.REACT_APP_RELEASE_STAGE || "";

/**
 * `getHoneycombBaseURL()` - Get the base Honeycomb URL from the environment variables
 * @returns - Returns the base Honeycomb URL
 */
export const getHoneycombBaseURL = () =>
  process.env.REACT_APP_HONEYCOMB_BASE_URL || "";

/**
 * `getLoginDomain()` - Get the login domain depending on the release stage
 * @returns - Returns the login domain
 * in development, the dev server on port 3000 proxies the local evergreen server on port 9090
 * therefore in dev we want the login domain to be localhost:3000
 * however in prod and staging and we want the login domain to be evergreen.com
 */
export const getLoginDomain = (): string =>
  isDevelopmentBuild() || getReleaseStage() === "local"
    ? process.env.REACT_APP_SPRUCE_URL
    : process.env.REACT_APP_UI_URL;
