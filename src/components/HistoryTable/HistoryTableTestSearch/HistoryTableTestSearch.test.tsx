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
      "Search test name regex",
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("should clear input when a value is submitted", async () => {
    const user = userEvent.setup();
    render(<Content />, {
      route: `/variant-history/evergreen/lint`,
      path: "/variant-history/:projectId/:variantName",
    });
    const input = screen.getByPlaceholderText(
      "Search test name regex",
    ) as HTMLInputElement;

    expect(input).toHaveValue("");
    await user.type(input, "some-test-name");
    expect(input).toHaveValue("some-test-name");
    await user.type(input, "{enter}");
    expect(input).toHaveValue("");
  });

  it("should add input query params to the url", async () => {
    const user = userEvent.setup();
    const { router } = render(<Content />, {
      route: `/variant-history/evergreen/lint`,
      path: "/variant-history/:projectId/:variantName",
    });
    const input = screen.getByPlaceholderText(
      "Search test name regex",
    ) as HTMLInputElement;

    // FAILED TEST
    expect(input).toHaveValue("");
    await user.type(input, "some-test-name");
    expect(input).toHaveValue("some-test-name");
    await user.type(input, "{enter}");
    expect(router.state.location.search).toBe(`?failed=some-test-name`);
  });

  it("should add multiple input filters to the same key as query params", async () => {
    const user = userEvent.setup();
    const { router } = render(<Content />, {
      route: `/variant-history/evergreen/lint`,
      path: "/variant-history/:projectId/:variantName",
    });
    const input = screen.getByPlaceholderText(
      "Search test name regex",
    ) as HTMLInputElement;
    expect(input).toHaveValue("");
    await user.type(input, "some-test-name");
    expect(input).toHaveValue("some-test-name");
    await user.type(input, "{enter}");
    await user.type(input, "some-other-test-name");
    expect(input).toHaveValue("some-other-test-name");
    await user.type(input, "{enter}");
    expect(router.state.location.search).toBe(
      `?failed=some-test-name,some-other-test-name`,
    );
  });

  it("should not allow duplicate input filters for the same key as query params", async () => {
    const user = userEvent.setup();
    const { router } = render(<Content />, {
      route: `/variant-history/evergreen/lint`,
      path: "/variant-history/:projectId/:variantName",
    });
    const input = screen.getByPlaceholderText(
      "Search test name regex",
    ) as HTMLInputElement;
    expect(input).toHaveValue("");
    await user.type(input, "some-test-name");
    expect(input).toHaveValue("some-test-name");
    await user.type(input, "{enter}");
    await user.type(input, "some-test-name");
    expect(input).toHaveValue("some-test-name");
    await user.type(input, "{enter}");
    expect(router.state.location.search).toBe(`?failed=some-test-name`);
  });
});
