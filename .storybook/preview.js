import { MockedProvider } from "@apollo/client/testing";
import { WithApolloClient } from "storybook-addon-apollo-client/dist/decorators";
import { addDecorator, addParameters } from "@storybook/react";


addDecorator(WithApolloClient)
addParameters({
  actions: { argTypesRegex: "^on[A-Z].*" },
  apolloClient: {
    MockedProvider,
    // any props you want to pass to MockedProvider on every story
  }
})