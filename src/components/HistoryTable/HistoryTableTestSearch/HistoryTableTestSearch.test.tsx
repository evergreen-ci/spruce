import {
  renderWithRouterMatch as render,
  fireEvent,
} from "test_utils/test-utils";
import { HistoryTableTestSearch } from "./HistoryTableTestSearch";

const Content = () => <HistoryTableTestSearch />;
describe("historyTableTestSearch", () => {
  it("renders normally and doesn't affect the url", () => {
    const { getByPlaceholderText } = render(Content, {
      route: `/variant-history/evergreen/lint`,
      path: "/variant-history/:projectId/:variantName",
    });
    const input = getByPlaceholderText("Search Test Name") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("should clear input when a value is submitted", () => {
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

  it("should add input query params to the url", () => {
    const { getByPlaceholderText, history } = render(Content, {
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
    const { location } = history;
    expect(location.search).toBe(`?failed=some-test-name`);
  });

  it("should add multiple input filters to the same key as query params", () => {
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

  it("should not allow duplicate input filters for the same key as query params", () => {
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
});
