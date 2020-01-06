export const getApiUrl = () => process.env.REACT_APP_API_URL || "";

export const getBugsnagApiKey = () =>
  process.env.REACT_APP_BUGSNAG_API_KEY || "i-am-a-fake-key";

export const getUiUrl = () => process.env.REACT_APP_UI_URL || "";

export const isDevelopment = () => process.env.NODE_ENV === "development";

export const isTest = () => process.env.NODE_ENV === "test";

export const getSchemaString = () => process.env.REACT_APP_SCHEMA_STRING || "";

export const getGQLUrl = () => process.env.REACT_APP_GQL_URL || "";
