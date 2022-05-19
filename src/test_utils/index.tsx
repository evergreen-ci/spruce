import React from "react";
import {
  render,
  queries,
  RenderResult,
  RenderOptions,
  within,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import {
  Route,
  Routes,
  unstable_HistoryRouter as HistoryRouter,
} from "react-router-dom";
import { v4 as uuid } from "uuid";
import * as customQueries from "./custom-queries";

type QueriesType = typeof queries;
type CustomQueriesType = typeof customQueries;

type CustomRenderType = CustomQueriesType & QueriesType;
type customRenderOptions = RenderOptions<CustomRenderType>;
/** `customRender` or `render` takes an instance of react-testing-library's render method
 *  and adds additional selectors for querying your components in tests  */
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

/** `renderWithRouterMatch` implements the `customRender` method and wraps a passed in component
 *  with an instance of `react-router`'s `<Router />` component.
 */
const renderWithRouterMatch = (
  ui: React.ReactElement,
  options: renderWithRouterMatchOptions = {}
) => {
  const {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
    path = "/",
    ...rest
  } = options;
  const { rerender, ...renderRest } = customRender(
    <HistoryRouter history={history}>
      <Routes>
        <Route path={path} element={ui} />
      </Routes>
    </HistoryRouter>,
    rest
  );
  const customRerender = (element: React.ReactElement) => {
    rerender(
      <HistoryRouter history={history}>
        <Routes>
          <Route path={path} element={element} />
        </Routes>
      </HistoryRouter>
    );
  };
  return {
    history,
    rerender: customRerender,
    ...renderRest,
  };
};

/** mockUUID mocks the implementation of the uuid library and provides an implementation that can be used in tests */
export const mockUUID = () => {
  const MAX_INT = Number.MAX_SAFE_INTEGER;
  uuid.mockImplementation(() =>
    Math.floor(Math.random() * Math.floor(MAX_INT))
  );
};

// re-export everything
export * from "@testing-library/react";

// override render method
export {
  customRender as render,
  renderWithRouterMatch,
  customWithin as within,
};
