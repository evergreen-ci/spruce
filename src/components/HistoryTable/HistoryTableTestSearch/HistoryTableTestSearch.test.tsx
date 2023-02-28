import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import { HistoryTableTestSearch } from "./HistoryTableTestSearch";

const Content = () => <HistoryTableTestSearch />;
describe("historyTableTestSearch", () => {
  it("renders normally and doesn't affect the url", () => {
    render(<Content />, {
      route: `/variant-history/evergreen/lint`,
      path: "/variant-history/:projectId/:variantName",
    });
    const input = screen.getByPlaceholderText(
      "Search test name regex"
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("should clear input when a value is submitted", () => {
    render(<Content />, {
      route: `/variant-history/evergreen/lint`,
      path: "/variant-history/:projectId/:variantName",
    });
    const input = screen.getByPlaceholderText(
      "Search test name regex"
    ) as HTMLInputElement;

    expect(input).toHaveValue("");
    userEvent.type(input, "some-test-name");
    expect(input).toHaveValue("some-test-name");
    expect(input).toHaveFocus();
    userEvent.type(input, "{enter}");
    expect(input).toHaveValue("");
  });

  it("should add input query params to the url", () => {
    const { history } = render(<Content />, {
      route: `/variant-history/evergreen/lint`,
      path: "/variant-history/:projectId/:variantName",
    });
    const input = screen.getByPlaceholderText(
      "Search test name regex"
    ) as HTMLInputElement;

    // FAILED TEST
    expect(input).toHaveValue("");
    userEvent.type(input, "some-test-name");
    expect(input).toHaveValue("some-test-name");
    expect(input).toHaveFocus();
    userEvent.type(input, "{enter}");
    const { location } = history;
    expect(location.search).toBe(`?failed=some-test-name`);
  });

  it("should add multiple input filters to the same key as query params", () => {
    const { history } = render(<Content />, {
      route: `/variant-history/evergreen/lint`,
      path: "/variant-history/:projectId/:variantName",
    });
    const input = screen.getByPlaceholderText(
      "Search test name regex"
    ) as HTMLInputElement;
    expect(input).toHaveValue("");
    userEvent.type(input, "some-test-name");
    expect(input).toHaveValue("some-test-name");
    userEvent.type(input, "{enter}");
    userEvent.type(input, "some-other-test-name");
    expect(input).toHaveValue("some-other-test-name");
    userEvent.type(input, "{enter}");
    const { location } = history;
    expect(location.search).toBe(`?failed=some-test-name,some-other-test-name`);
  });

  it("should not allow duplicate input filters for the same key as query params", () => {
    const { history } = render(<Content />, {
      route: `/variant-history/evergreen/lint`,
      path: "/variant-history/:projectId/:variantName",
    });
    const input = screen.getByPlaceholderText(
      "Search test name regex"
    ) as HTMLInputElement;
    expect(input).toHaveValue("");
    userEvent.type(input, "some-test-name");
    expect(input).toHaveValue("some-test-name");
    userEvent.type(input, "{enter}");
    userEvent.type(input, "some-test-name");
    expect(input).toHaveValue("some-test-name");
    userEvent.type(input, "{enter}");
    const { location } = history;
    expect(location.search).toBe(`?failed=some-test-name`);
  });
});
