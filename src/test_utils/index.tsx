import { render, queries, within, screen } from "@testing-library/react";
import type {
  RenderResult,
  RenderOptions,
  BoundFunctions,
} from "@testing-library/react";
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
  options: renderWithRouterMatchOptions = {}
) => {
  const { route = "/", path = "/", wrapper: TestWrapper, ...rest } = options;

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
    }
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
const boundQueries = Object.entries(customQueries).reduce(
  (q, [queryName, queryFn]) => {
    // eslint-disable-next-line no-param-reassign
    q[queryName] = queryFn.bind(null, document.body);
    return q;
  },
  {}
) as BoundFunctions<CustomQueriesType>;
const customScreen = { ...screen, ...boundQueries };

// re-export everything
export * from "@testing-library/react";

// override render method
export {
  customScreen as screen,
  customRender as render,
  renderWithRouterMatch,
  customWithin as within,
  userEvent,
};
