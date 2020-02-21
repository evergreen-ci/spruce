export const getApiUrl = () => process.env.REACT_APP_API_URL || "";

export const getBugsnagApiKey = () =>
  process.env.REACT_APP_BUGSNAG_API_KEY || "i-am-a-fake-key";

export const getUiUrl = () => process.env.REACT_APP_UI_URL || "";

export const isDevelopment = () => process.env.NODE_ENV === "development";

export const isTest = () => process.env.NODE_ENV === "test";

export const getSchemaString = () => process.env.REACT_APP_SCHEMA_STRING || "";

export const getGQLUrl = () => process.env.REACT_APP_GQL_URL || "";

export const shouldEnableGQLMockServer = () =>
  process.env.REACT_APP_ENABLE_GQL_MOCK_SERVER === "true" ? true : false;

// in development, the dev server on port 3000 proxies the local evergreen server on port 9090
// therefore in dev we want the login domain to be localhost:3000
// however in prod and staging and we want the login domain to be evergreen.com
export const getLoginDomain = () =>
  isDevelopment() || isTest()
    ? process.env.REACT_APP_SPRUCE_URL
    : process.env.REACT_APP_UI_URL;
