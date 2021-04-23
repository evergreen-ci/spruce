import React from "react";
import { render, queries, RenderResult } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router, Route } from "react-router-dom";
import { v4 as uuid } from "uuid";
import * as customQueries from "./custom-queries";

type QueriesType = typeof queries;
type CustomQueriesType = typeof customQueries;

type CustomRenderType = CustomQueriesType & QueriesType;
const customRender = (ui, options?): RenderResult<CustomRenderType> =>
  render(ui, {
    queries: { ...queries, ...customQueries },
    ...options,
  }) as RenderResult<CustomRenderType>;

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };

export const renderWithRouterMatch = (
  ui,
  {
    path = "/",
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) => ({
  history,
  ...customRender(
    <Router history={history}>
      <Route path={path} component={ui} />
    </Router>
  ),
});

export const mockUUID = () => {
  const MAX_INT = Number.MAX_SAFE_INTEGER;
  uuid.mockImplementation(() =>
    Math.floor(Math.random() * Math.floor(MAX_INT))
  );
};
