import { render, queries, within, screen } from "@testing-library/react";
import type {
  RenderResult,
  RenderOptions,
  Screen,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import {
  Route,
  Routes,
  // This is okay as long as there is only one version of history
  // https://reactrouter.com/docs/en/v6/routers/history-router
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

// Bind custom query methods to screen
// https://github.com/testing-library/dom-testing-library/issues/516
const boundQueries = Object.entries(customQueries).reduce(
  (q, [queryName, queryFn]) => {
    // eslint-disable-next-line no-param-reassign
    q[queryName] = queryFn.bind(null, document.body);
    return q;
  },
  {}
) as Screen<CustomQueriesType>;
const customScreen = { ...screen, ...boundQueries };

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
  customScreen as screen,
  customRender as render,
  renderWithRouterMatch,
  customWithin as within,
};
