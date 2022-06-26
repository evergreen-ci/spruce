import { MockedProvider } from '@apollo/client/testing';
import { withRouter } from 'storybook-addon-react-router-v6';

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
  }
}
export const decorators = [withRouter]