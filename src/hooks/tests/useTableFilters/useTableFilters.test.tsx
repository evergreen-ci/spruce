import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";
import {
  InputFilterTestComponent,
  CheckboxFilterTestComponent,
} from "./TestComponent";

test("useTableInputFilter", async () => {
  const { getByText, getByPlaceholderText } = render(
    <MemoryRouter initialEntries={[`/hosts?hostId=123`]}>
      <Route path="/hosts">
        <InputFilterTestComponent />
      </Route>
    </MemoryRouter>
  );

  const input = getByPlaceholderText("Search ID") as HTMLInputElement;
  const searchButton = getByText("Search");
  const resetButton = getByText("Reset");

  // starts with initial url params as value
  expect(input.value).toBe("123");

  fireEvent.change(input, { target: { value: "" } });
  fireEvent.change(input, { target: { value: "abc" } });
  fireEvent.click(searchButton);

  // returns updates value when component changes
  expect(input.value).toBe("abc");

  // updates url query params when update fn is called
  getByText("host id from url: abc");

  fireEvent.click(resetButton);

  // resets url query params when reset fn is called
  expect(input.value).toBe("");
  getByText("host id from url: N/A");
});

test("useTableInputFilter - trims whitespace from input value", async () => {
  const { getByText, getByPlaceholderText } = render(
    <MemoryRouter initialEntries={[`/hosts?hostId=123`]}>
      <Route path="/hosts">
        <InputFilterTestComponent />
      </Route>
    </MemoryRouter>
  );

  const input = getByPlaceholderText("Search ID") as HTMLInputElement;
  const searchButton = getByText("Search");

  fireEvent.change(input, { target: { value: "     abc  " } });
  fireEvent.click(searchButton);

  getByText("host id from url: abc");
});

test("useTableCheckboxFilter", async () => {
  const { getByText, getByLabelText } = render(
    <MemoryRouter initialEntries={[`/hosts?statuses=running,terminated`]}>
      <Route path="/hosts">
        <CheckboxFilterTestComponent />
      </Route>
    </MemoryRouter>
  );

  const runningCheckbox = getByLabelText("Running") as HTMLInputElement;
  const termindatedCheckbox = getByLabelText("Terminated") as HTMLInputElement;
  const searchButton = getByText("Filter");
  const resetButton = getByText("Reset");

  // starts with initial url params as value
  expect(runningCheckbox.checked).toBe(true);
  expect(termindatedCheckbox.checked).toBe(true);

  // returns updates value when component changes
  fireEvent.click(runningCheckbox);
  fireEvent.click(searchButton);

  // updates url query params when update fn is called
  expect(runningCheckbox.checked).toBe(false);
  expect(termindatedCheckbox.checked).toBe(true);

  getByText("statuses from url: terminated");

  // resets url query params when reset fn is called
  fireEvent.click(resetButton);

  expect(runningCheckbox.checked).toBe(false);
  expect(termindatedCheckbox.checked).toBe(false);

  getByText("statuses from url: none");
});
