import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
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

  // starts with initial url params as value
  expect(input.value).toBe("123");

  fireEvent.change(input, { target: { value: "" } });
  fireEvent.change(input, { target: { value: "abc" } });
  expect(input).toHaveValue("abc");
  fireEvent.focus(input);
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });

  // returns updates value when component changes
  expect(input.value).toBe("abc");

  // updates url query params when update fn is called
  getByText("host id from url: abc");

  fireEvent.change(input, { target: { value: "" } });
  expect(input).toHaveValue("");
  fireEvent.focus(input);
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });

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
  fireEvent.change(input, { target: { value: "     abc  " } });
  fireEvent.focus(input);
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });

  expect(getByText("host id from url: abc")).toBeInTheDocument();
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
  const terminatedCheckbox = getByLabelText("Terminated") as HTMLInputElement;

  // starts with initial url params as value
  expect(runningCheckbox.checked).toBe(true);
  expect(terminatedCheckbox.checked).toBe(true);

  // returns updates value when component changes
  fireEvent.click(runningCheckbox);

  // updates url query params when update fn is called
  expect(runningCheckbox.checked).toBe(false);
  expect(terminatedCheckbox.checked).toBe(true);

  getByText("statuses from url: terminated");

  // resets url query params when reset fn is called
  fireEvent.click(terminatedCheckbox);

  expect(runningCheckbox.checked).toBe(false);
  expect(terminatedCheckbox.checked).toBe(false);

  getByText("statuses from url: none");
});
