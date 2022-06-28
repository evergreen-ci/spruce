import { MockedProvider } from "@apollo/client/testing";
import { withRouter } from "storybook-addon-react-router-v6";

const isTest = process.env.NODE_ENV === "test";
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  apolloClient: {
    MockedProvider,
  },
};

export const decorators = [
  withRouter,
  // storybook-addon-apollo-client will not add the mockedprovider decorator in the test environment which causes snapshot tests to fail.
  ...(isTest ? [(Story) => <MockedProvider>{<Story />}</MockedProvider>] : []),
];
