import {
  renderWithRouterMatch as render,
  fireEvent,
} from "test_utils/test-utils";
import { HistoryTableTestSearch } from "./HistoryTableTestSearch";

const Content = () => <HistoryTableTestSearch />;

test("Renders normally and doesn't affect the url", () => {
  const { getByPlaceholderText } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });
  const input = getByPlaceholderText("Search Test Name") as HTMLInputElement;
  expect(input).toBeInTheDocument();
  expect(input).toHaveValue("");
});

test("Should clear input when a value is submitted", () => {
  const { getByPlaceholderText } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });
  const input = getByPlaceholderText("Search Test Name") as HTMLInputElement;

  expect(input).toHaveValue("");
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.focus(input);
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });
  expect(input).toHaveValue("");
});

test("Should add input query params to the url", () => {
  const { getByText, getByPlaceholderText, history } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });
  const input = getByPlaceholderText("Search Test Name") as HTMLInputElement;

  // FAILED TEST
  expect(input).toHaveValue("");
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.focus(input);
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });

  // PASSED TEST
  fireEvent.click(getByText("Passed test"));
  fireEvent.change(input, {
    target: { value: "some-other-test-name" },
  });
  expect(input).toHaveValue("some-other-test-name");
  fireEvent.focus(input);
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });

  // ALL TEST
  fireEvent.click(getByText("All test"));
  fireEvent.change(input, {
    target: { value: "another-test-name" },
  });
  expect(input).toHaveValue("another-test-name");
  fireEvent.focus(input);
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });

  const { location } = history;
  expect(location.search).toBe(
    `?all=another-test-name&failed=some-test-name&passed=some-other-test-name`
  );
});

test("Should add multiple input filters to the same key as query params", () => {
  const { getByPlaceholderText, history } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });
  const input = getByPlaceholderText("Search Test Name") as HTMLInputElement;
  expect(input).toHaveValue("");
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });
  fireEvent.change(input, {
    target: { value: "some-other-test-name" },
  });
  expect(input).toHaveValue("some-other-test-name");
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });
  const { location } = history;
  expect(location.search).toBe(`?failed=some-test-name,some-other-test-name`);
});

test("Should not allow duplicate input filters for the same key as query params", () => {
  const { getByPlaceholderText, history } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });
  const input = getByPlaceholderText("Search Test Name") as HTMLInputElement;
  expect(input).toHaveValue("");
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });
  const { location } = history;
  expect(location.search).toBe(`?failed=some-test-name`);
});

test("Should convert a test specified to be passing /and/ failing as all", () => {
  const { getByText, getByPlaceholderText, history } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });
  const input = getByPlaceholderText("Search Test Name") as HTMLInputElement;
  expect(input).toHaveValue("");
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });

  fireEvent.click(getByText("Passed test"));
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });

  const { location } = history;
  expect(location.search).toBe(`?all=some-test-name`);
});

test("Should prevent adding test as passing or failing if the test is already tagged with all", () => {
  const { getByText, getByPlaceholderText, history } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });

  fireEvent.click(getByText("All test"));

  const input = getByPlaceholderText("Search Test Name") as HTMLInputElement;
  expect(input).toHaveValue("");
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });

  fireEvent.click(getByText("Failed test"));
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyDown(input, {
    key: "Enter",
    keyCode: 13,
  });

  fireEvent.click(getByText("Passed test"));
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });

  const { location } = history;
  expect(location.search).toBe(`?all=some-test-name`);
});

test("Should convert a passing or failing test as all if test is submitted as all", () => {
  const { getByText, getByPlaceholderText, history } = render(Content, {
    route: `/variant-history/evergreen/lint`,
    path: "/variant-history/:projectId/:variantName",
  });

  fireEvent.click(getByText("Failed test"));

  const input = getByPlaceholderText("Search Test Name") as HTMLInputElement;
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });

  fireEvent.click(getByText("All test"));
  expect(input).toHaveValue("");
  fireEvent.change(input, {
    target: { value: "some-test-name" },
  });
  expect(input).toHaveValue("some-test-name");
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });

  fireEvent.click(getByText("Passed test"));
  fireEvent.change(input, {
    target: { value: "some-other-test-name" },
  });
  expect(input).toHaveValue("some-other-test-name");
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });

  fireEvent.click(getByText("All test"));
  fireEvent.change(input, {
    target: { value: "some-other-test-name" },
  });
  expect(input).toHaveValue("some-other-test-name");
  fireEvent.keyPress(input, {
    key: "Enter",
    keyCode: 13,
  });

  const { location } = history;
  expect(location.search).toBe(`?all=some-test-name,some-other-test-name`);
});
