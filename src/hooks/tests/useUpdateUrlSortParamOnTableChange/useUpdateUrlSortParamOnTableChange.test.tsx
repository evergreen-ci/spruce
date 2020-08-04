import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { TestComponent } from "./TestComponent";

test("useUpdateUrlSortParamOnTableChange", () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={[`/hosts`]}>
      <Route path="/hosts">
        <TestComponent />
      </Route>
    </MemoryRouter>
  );

  const idHeader = getByText("ID");
  const statusHeader = getByText("Status");

  fireEvent.click(idHeader);

  getByText("sortBy: ID");
  getByText("sortDir: ASC");

  fireEvent.click(statusHeader);

  getByText("sortBy: STATUS");
  getByText("sortDir: ASC");

  fireEvent.click(statusHeader);

  getByText("sortBy: STATUS");
  getByText("sortDir: DESC");

  fireEvent.click(statusHeader);

  getByText("sortBy: none");
  getByText("sortDir: none");
});
