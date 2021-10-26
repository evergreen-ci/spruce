import {
  renderWithRouterMatch as render,
  fireEvent,
} from "test_utils/test-utils";
import { HistoryTableTestSearch } from "./HistoryTableTestSearch";

const Content = () => <HistoryTableTestSearch />;

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

  // FAILED TEST
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

  // PASSED TEST
  fireEvent.click(queryByDataCy("test-search-passed"));
  fireEvent.change(input, {
    target: { value: "some-other-test-name" },
  });
  expect(input).toHaveValue("some-other-test-name");
  fireEvent.focus(input);
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });

  // ALL TEST
  fireEvent.click(queryByDataCy("test-search-all"));
  fireEvent.change(input, {
    target: { value: "another-test-name" },
  });
  expect(input).toHaveValue("another-test-name");
  fireEvent.focus(input);
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });

  const { location } = history;
  expect(location.search).toBe(
    `?all=another-test-name&failed=some-test-name&passed=some-other-test-name`
  );
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
  expect(location.search).toBe(`?failed=some-test-name,some-other-test-name`);
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
  expect(location.search).toBe(`?failed=some-test-name`);
});

test("Should convert a test specified to be passing /and/ failing as all", () => {
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

  fireEvent.click(queryByDataCy("test-search-passed"));
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });

  const { location } = history;
  expect(location.search).toBe(`?all=some-test-name`);
});

test("Should prevent adding test as passing or failing if the test is already chosen as all", () => {
  const { queryByDataCy, history } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });

  fireEvent.click(queryByDataCy("test-search-all"));
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

  fireEvent.click(queryByDataCy("test-search-failed"));
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });

  fireEvent.click(queryByDataCy("test-search-passed"));
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });

  const { location } = history;
  expect(location.search).toBe(`?all=some-test-name`);
});

test("Should convert a passing or failing test as all if test is submitted as all", () => {
  const { queryByDataCy, history } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });

  fireEvent.click(queryByDataCy("test-search-failed"));
  const input = queryByDataCy("history-table-test-search-input");
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });

  fireEvent.click(queryByDataCy("test-search-all"));
  expect(input).toHaveValue("");
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });

  fireEvent.click(queryByDataCy("test-search-passed"));
  fireEvent.change(input, {
    target: { value: "some-other-test-name" },
  });
  expect(input).toHaveValue("some-other-test-name");
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });

  fireEvent.click(queryByDataCy("test-search-all"));
  fireEvent.change(input, {
    target: { value: "some-other-test-name" },
  });
  expect(input).toHaveValue("some-other-test-name");
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });

  const { location } = history;
  expect(location.search).toBe(`?all=some-test-name,some-other-test-name`);
});
