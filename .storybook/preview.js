import { MockedProvider } from "@apollo/client/testing";
import { WithApolloClient } from "storybook-addon-apollo-client/dist/decorators";

// Enable storyshots support
export const decorators = [WithApolloClient];
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  apolloClient: {
    MockedProvider,
    // any props you want to pass to MockedProvider on every story
  },
};
