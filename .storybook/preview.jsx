import { MemoryRouter } from "react-router-dom"
import { WithApolloClient } from "storybook-addon-apollo-client/dist/decorators";
import { MockedProvider } from "@apollo/client/testing";


const WithReactRouter = (Story) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
)

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  apolloClient: {
    MockedProvider
  },
}
export const decorators = [WithReactRouter, WithApolloClient]