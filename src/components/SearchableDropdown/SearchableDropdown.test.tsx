import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { render, act } from "test_utils/test-utils";
import SearchableDropdown from ".";

test("Sets the currently selected project to what ever is passed in's display name", async () => {
  const ContentWrapper = () => <SearchableDropdown value="evergreen" />;
  const { queryByDataCy } = render(ContentWrapper());
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(queryByDataCy("project-name")).toHaveTextContent(
    "Project: evergreen smoke test"
  );
});

test("Should toggle dropdown when clicking on it ", async () => {
  const ContentWrapper = () => <SearchableDropdown value="evergreen" />;
  const { queryByDataCy } = render(ContentWrapper());
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(queryByDataCy("project-select-options")).not.toBeInTheDocument();
  userEvent.click(queryByDataCy("project-select"));
  expect(queryByDataCy("project-select-options")).toBeInTheDocument();
  userEvent.click(queryByDataCy("project-select"));
  expect(queryByDataCy("project-select-options")).not.toBeInTheDocument();
});

test("Should narrow down search results when filtering on projects", async () => {
  const ContentWrapper = () => <SearchableDropdown value="evergreen" />;
  const { queryByDataCy, findAllByDataCy } = render(ContentWrapper());
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(queryByDataCy("project-select-options")).not.toBeInTheDocument();
  userEvent.click(queryByDataCy("project-select"));
  expect(queryByDataCy("project-select-options")).toBeInTheDocument();
  let options = await findAllByDataCy("project-display-name");
  expect(options.length).toBe(6);
  userEvent.type(queryByDataCy("project-search"), "logkeeper");
  options = await findAllByDataCy("project-display-name");
  expect(options.length).toBe(1);
});
