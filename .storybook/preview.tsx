import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Parameters, Decorator } from "@storybook/react";
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
  (Story: () => JSX.Element) => {
    const routes = [
      {
        path: "/",
        element: <Story />,
        errorElement: <div>Failed to render component.</div>,
      },
    ];
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    return <RouterProvider router={memoryRouter} />;
  },
];
