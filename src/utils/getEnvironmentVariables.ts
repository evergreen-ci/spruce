export const getApiUrl: () => string = () =>
  process.env.REACT_APP_API_URL || "";

export const getBugsnagApiKey: () => string = () =>
  process.env.REACT_APP_BUGSNAG_API_KEY || "i-am-a-fake-key";

export const getUiUrl: () => string = () => process.env.REACT_APP_UI_URL || "";

export const isDevelopment: () => boolean = () =>
  process.env.NODE_ENV === "development";

export const isProduction = (): boolean =>
  process.env.NODE_ENV === "production";

export const isTest: () => boolean = () => process.env.NODE_ENV === "test";

export const getSchemaString: () => string = () =>
  process.env.REACT_APP_SCHEMA_STRING || "";

export const getGQLUrl: () => string = () =>
  process.env.REACT_APP_GQL_URL || "";

export const shouldEnableGQLMockServer: () => boolean = () =>
  process.env.REACT_APP_ENABLE_GQL_MOCK_SERVER === "true";

// in development, the dev server on port 3000 proxies the local evergreen server on port 9090
// therefore in dev we want the login domain to be localhost:3000
// however in prod and staging and we want the login domain to be evergreen.com
export const getLoginDomain: () => string = () =>
  isDevelopment() || isTest()
    ? process.env.REACT_APP_SPRUCE_URL
    : process.env.REACT_APP_UI_URL;
