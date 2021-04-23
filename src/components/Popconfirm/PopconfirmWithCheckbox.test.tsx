import React from "react";
import {
  renderWithRouterMatch as render,
  fireEvent,
  waitFor,
} from "test_utils/test-utils";
import { PopconfirmWithCheckbox } from ".";

const noop = () => {};
const btn = <button type="button">btn</button>;
const checkboxLabel = "a cool checkbox label";
const title = "cool title";

it("Passing in the checkboxLabel prop should display a confirmation checkbox and checkbox label.", async () => {
  const { queryByText, queryByDataCy } = render(() => (
    <PopconfirmWithCheckbox
      title={title}
      checkboxLabel={checkboxLabel}
      onConfirm={noop}
    >
      {btn}
    </PopconfirmWithCheckbox>
  ));
  expect(queryByText(checkboxLabel)).not.toBeInTheDocument();
  await fireEvent.click(queryByText("btn"));
  expect(queryByText(checkboxLabel)).toBeInTheDocument();
  expect(queryByDataCy("popconfirm-checkbox")).toBeInTheDocument();
});

it("Passing in an empty checkboxLabel prop should not render confirmation checkbox and checkbox label.", async () => {
  const { queryByText, queryByDataCy } = render(() => (
    <PopconfirmWithCheckbox title={title} checkboxLabel="" onConfirm={noop}>
      {btn}
    </PopconfirmWithCheckbox>
  ));
  await fireEvent.click(queryByText("btn"));
  waitFor(() => expect(queryByText(checkboxLabel)).not.toBeVisible());
  expect(queryByDataCy("popconfirm-checkbox")).not.toBeInTheDocument();
});

it("Not providing a checkboxLabel prop should not render confirmation checkbox and checkbox label.", async () => {
  const { queryByText, queryByDataCy } = render(() => (
    <PopconfirmWithCheckbox title={title} onConfirm={noop}>
      {btn}
    </PopconfirmWithCheckbox>
  ));
  await fireEvent.click(queryByText("btn"));
  waitFor(() => expect(queryByText(checkboxLabel)).not.toBeVisible());
  expect(queryByDataCy("popconfirm-checkbox")).not.toBeInTheDocument();
});

it("Ok button is enabled on initial render when no checkbox label is provided.", async () => {
  const mockCb = jest.fn();
  const { queryByText } = render(() => (
    <PopconfirmWithCheckbox title={title} onConfirm={mockCb}>
      {btn}
    </PopconfirmWithCheckbox>
  ));
  await fireEvent.click(queryByText("btn"));
  await waitFor(() => expect(queryByText("Yes")).toBeInTheDocument());
  await fireEvent.click(queryByText("Yes"));
  expect(mockCb.mock.calls.length).toBe(1);
});

it("Ok button is disabled on initial render when a checkbox label is provided.", async () => {
  const mockCb = jest.fn();
  const { queryByText } = render(() => (
    <PopconfirmWithCheckbox
      checkboxLabel={checkboxLabel}
      title={title}
      onConfirm={mockCb}
    >
      {btn}
    </PopconfirmWithCheckbox>
  ));
  await fireEvent.click(queryByText("btn"));
  await waitFor(() => expect(queryByText("Yes")).toBeInTheDocument());
  await fireEvent.click(queryByText("Yes"));
  expect(mockCb.mock.calls.length).toBe(0);
});

it("Ok button is enabled after checking the checkbox.", async () => {
  const mockCb = jest.fn();
  const { queryByText, queryByDataCy } = render(() => (
    <PopconfirmWithCheckbox
      checkboxLabel={checkboxLabel}
      title={title}
      onConfirm={mockCb}
    >
      {btn}
    </PopconfirmWithCheckbox>
  ));
  await fireEvent.click(queryByText("btn"));
  await waitFor(() => expect(queryByText("Yes")).toBeInTheDocument());

  // attempt before checking
  await fireEvent.click(queryByText("Yes"));
  expect(mockCb.mock.calls.length).toBe(0);

  await fireEvent.click(queryByDataCy("popconfirm-checkbox"));
  // attempt after checking
  await fireEvent.click(queryByText("Yes"));
  expect(mockCb.mock.calls.length).toBe(1);
});
