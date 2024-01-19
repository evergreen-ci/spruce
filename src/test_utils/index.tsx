import {
  act,
  queries,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { RenderResult, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import * as customQueries from "./custom-queries";

type QueriesType = typeof queries;
type CustomQueriesType = typeof customQueries;

type CustomRenderType = CustomQueriesType & QueriesType;
type customRenderOptions = RenderOptions<CustomRenderType>;
/**
 * `customRender` or `render` takes an instance of react-testing-library's render method
 *  and adds additional selectors for querying components in tests.
 * @param ui - React Component to render
 * @param options - Options to pass to render
 * @returns RenderResult with custom queries bound to screen
 */
const customRender = (ui: React.ReactElement, options?: customRenderOptions) =>
  render(ui, {
    queries: { ...queries, ...customQueries },
    ...options,
  }) as RenderResult<CustomRenderType>;

const customWithin = (ui: HTMLElement) =>
  within(ui, { ...queries, ...customQueries });

interface renderWithRouterMatchOptions extends customRenderOptions {
  route?: string;
  history?: any;
  path?: string;
}

/**
 * `renderWithRouterMatch` implements the `customRender` method and wraps a component
 * with an instance of `react-router`'s `<Router />` component.
 * @param ui - React Component to render
 * @param options - Options to pass to render
 * @returns RenderResult with custom queries bound to screen
 */
const renderWithRouterMatch = (
  ui: React.ReactElement,
  options: renderWithRouterMatchOptions = {},
) => {
  const { path = "/", route = "/", wrapper: TestWrapper, ...rest } = options;

  const getMemoryRouter = (element: React.ReactElement) => {
    const routes = [
      {
        path,
        element: TestWrapper ? <TestWrapper>{element}</TestWrapper> : element,
        errorElement: <div>Failed to render component.</div>,
      },
      {
        path: "*",
        element: <div>Not found</div>,
      },
    ];
    return createMemoryRouter(routes, {
      initialEntries: [route],
    });
  };

  const memoryRouter = getMemoryRouter(ui);

  const { rerender, ...renderRest } = customRender(
    <RouterProvider router={memoryRouter} />,
    {
      ...rest,
    },
  );

  const customRerender = (element: React.ReactElement) => {
    rerender(<RouterProvider router={getMemoryRouter(element)} />);
  };

  return {
    router: memoryRouter,
    rerender: customRerender,
    ...renderRest,
  };
};

// Bind custom query methods to screen
// https://github.com/testing-library/dom-testing-library/issues/516
const boundQueries = within<typeof customQueries>(document.body, customQueries);
const customScreen = { ...screen, ...boundQueries };

export {
  act,
  customRender as render,
  renderHook,
  renderWithRouterMatch,
  customScreen as screen,
  userEvent,
  waitFor,
  customWithin as within,
};
