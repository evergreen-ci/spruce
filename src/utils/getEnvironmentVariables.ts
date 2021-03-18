export const getApiUrl: () => string = () =>
  process.env.REACT_APP_API_URL || "";

export const getBugsnagApiKey: () => string = () =>
  process.env.REACT_APP_BUGSNAG_API_KEY || "i-am-a-fake-key";

export const getUserVoiceKey: () => string = () =>
  process.env.REACT_APP_USER_VOICE_KEY || "fake-user-voice-forum";

export const getUiUrl: () => string = () => process.env.REACT_APP_UI_URL || "";

export const getSpruceURL: () => string = () =>
  process.env.REACT_APP_SPRUCE_URL;

export const isDevelopment: () => boolean = () =>
  process.env.NODE_ENV === "development";

export const isProduction = (): boolean =>
  process.env.NODE_ENV === "production";

export const isTest: () => boolean = () => process.env.NODE_ENV === "test";

export const getGQLUrl: () => string = () =>
  process.env.REACT_APP_GQL_URL || "";

export const getLobsterURL = (): string =>
  process.env.REACT_APP_LOBSTER_URL || "";

export const getWebWorkerURL = (webWorkerFilename: string): string =>
  `${process.env.PUBLIC_URL}/web_worker/${webWorkerFilename}`;

// in development, the dev server on port 3000 proxies the local evergreen server on port 9090
// therefore in dev we want the login domain to be localhost:3000
// however in prod and staging and we want the login domain to be evergreen.com
export const getLoginDomain: () => string = () =>
  isDevelopment() || isTest()
    ? process.env.REACT_APP_SPRUCE_URL
    : process.env.REACT_APP_UI_URL;
