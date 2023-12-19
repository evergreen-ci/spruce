import { render, screen, waitFor, act } from "test_utils";
import RuntimeTimer from ".";

describe("runtimeTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, "setInterval");
    jest.spyOn(global, "clearInterval");
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });
  it("counts up as the run time progresses", async () => {
    // 10 seconds ago
    const startTime = new Date(Date.now() - 10000);
    render(<RuntimeTimer startTime={startTime} />);
    expect(screen.getByText("Running Time: 10s")).toBeInTheDocument();
    act(() => {
      jest.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.getByText("Running Time: 11s")).toBeInTheDocument();
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.getByText("Running Time: 12s")).toBeInTheDocument();
    });
  });
});
