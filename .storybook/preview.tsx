import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router-dom";

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
  (Story: () => JSX.Element) => (
    <MemoryRouter initialEntries={["/"]}>
      <Story />
    </MemoryRouter>
  ),
];
