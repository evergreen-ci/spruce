import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { TestComponent } from "./TestComponent";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

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
