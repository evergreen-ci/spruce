import { MockedProvider } from "@apollo/client/testing";
import { WithApolloClient } from "storybook-addon-apollo-client/dist/decorators";
import { addDecorator, addParameters } from "@storybook/react";
import StoryRouter from 'storybook-react-router';


addDecorator(WithApolloClient)
addParameters({
  actions: { argTypesRegex: "^on[A-Z].*" },
  apolloClient: {
    MockedProvider,
    // any props you want to pass to MockedProvider on every story
  }
})
addDecorator(StoryRouter())