import { render, screen, userEvent, waitFor } from "test_utils";
import WarningBanner from ".";

const warnings = ["warning1", "warning2", "warning3"];

describe("warningBanner", () => {
  it("shows correct text when there is only one warning", () => {
    render(<WarningBanner warnings={warnings.slice(0, 1)} />);
    expect(
      screen.getByText("1 warning in configuration file"),
    ).toBeInTheDocument();
  });

  it("shows correct text when there are multiple warnings", () => {
    render(<WarningBanner warnings={warnings} />);
    expect(
      screen.getByText("3 warnings in configuration file"),
    ).toBeInTheDocument();
  });

  it("opens modal when clicking on trigger text", async () => {
    const user = userEvent.setup();
    render(<WarningBanner warnings={warnings} />);
    await user.click(
      screen.getByDataCy("configuration-warnings-modal-trigger"),
    );
    await waitFor(() => {
      expect(screen.getByDataCy("configuration-warnings-modal")).toBeVisible();
    });
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("should be possible to dismiss the banner", async () => {
    const user = userEvent.setup();
    render(<WarningBanner warnings={warnings} />);
    expect(
      screen.getByDataCy("configuration-warnings-banner"),
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText("X Icon"));
    expect(screen.queryByDataCy("configuration-warnings-banner")).toBeNull();
  });
});
