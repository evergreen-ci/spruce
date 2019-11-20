export const getBugsnagApiKey = () =>
  process.env.REACT_APP_BUGSNAG_API_KEY || "i-am-a-fake-key";
