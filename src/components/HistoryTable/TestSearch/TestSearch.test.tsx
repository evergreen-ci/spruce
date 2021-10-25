import {
  renderWithRouterMatch as render,
  fireEvent,
} from "test_utils/test-utils";
import { TestSearch } from "./TestSearch";

const Content = () => <TestSearch />;

test("Renders normally and doesn't affect the url", () => {
  const { queryByDataCy } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });
  const input = queryByDataCy("history-table-test-search-input");
  expect(input).toBeInTheDocument();
  expect(input).toHaveValue("");
});

test("Should clear input when a value is submitted", () => {
  const { queryByDataCy } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });
  const input = queryByDataCy("history-table-test-search-input");

  expect(input).toHaveValue("");
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.focus(input);
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });
  expect(input).toHaveValue("");
});

test("Should add input query params to the url", () => {
  const { queryByDataCy, history } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });
  const input = queryByDataCy("history-table-test-search-input");

  expect(input).toHaveValue("");
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.focus(input);
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });
  const { location } = history;

  expect(location.search).toBe(`?tests=some-test-name`);
});

test("Should add multiple input filters to the same key as query params", () => {
  const { queryByDataCy, history } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });
  const input = queryByDataCy("history-table-test-search-input");
  expect(input).toHaveValue("");
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });
  fireEvent.change(input, {
    target: { value: "some-other-test-name" },
  });
  expect(input).toHaveValue("some-other-test-name");
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });
  const { location } = history;
  expect(location.search).toBe(`?tests=some-test-name,some-other-test-name`);
});

test("Should not allow duplicate input filters for the same key as query params", () => {
  const { queryByDataCy, history } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });
  const input = queryByDataCy("history-table-test-search-input");
  expect(input).toHaveValue("");
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });
  const { location } = history;
  expect(location.search).toBe(`?tests=some-test-name`);
});
