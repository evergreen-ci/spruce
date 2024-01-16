import { render, screen, userEvent, waitFor } from "test_utils";
import ErrorBanner from ".";

const errors = ["error1", "error2", "error3"];

describe("errorBanner", () => {
  it("shows correct text when there is only one error", () => {
    render(<ErrorBanner errors={errors.slice(0, 1)} />);
    expect(
      screen.getByText("1 error in configuration file"),
    ).toBeInTheDocument();
  });

  it("shows correct text when there are multiple errors", () => {
    render(<ErrorBanner errors={errors} />);
    expect(
      screen.getByText("3 errors in configuration file"),
    ).toBeInTheDocument();
  });

  it("opens modal when clicking on trigger text", async () => {
    const user = userEvent.setup();
    render(<ErrorBanner errors={errors} />);
    await user.click(screen.getByDataCy("configuration-errors-modal-trigger"));
    await waitFor(() => {
      expect(screen.getByDataCy("configuration-errors-modal")).toBeVisible();
    });
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });
});
