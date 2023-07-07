import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Parameters, Decorator } from "@storybook/react";
// This is required for storyshots https://github.com/lifeiscontent/storybook-addon-apollo-client/issues/16
import { WithApolloClient } from "storybook-addon-apollo-client/dist/decorators";
import { GlobalStyles } from "../src/components/styles/GlobalStyles";

export const parameters: Parameters = {
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
  // Prevent Storybook docs from freezing due to MemoryRouter. (See https://github.com/storybookjs/storybook/issues/19695 for the issue,
  // and https://github.com/storybookjs/storybook/issues/17720#issuecomment-1466725964 for the solution.)
  docs: {
    source: {
      // any non-empty string here will skip jsx rendering.
      code: "hello world",
    },
  },
};

export const decorators: Decorator[] = [
  (Story: () => JSX.Element) => (
    <>
      <GlobalStyles />
      <Story />
    </>
  ),
  (Story: () => JSX.Element, context) => {
    const { parameters: storyParameters } = context;
    const { reactRouter } = storyParameters;
    const { path, params, route } = reactRouter || {};
    const routes = [
      {
        path: path || "/",
        parameters: params || {},
        element: <Story />,
        errorElement: <div>Failed to render component.</div>,
      },
    ];
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: [route || "/"],
    });
    return <RouterProvider router={memoryRouter} />;
  },
  WithApolloClient,
];
