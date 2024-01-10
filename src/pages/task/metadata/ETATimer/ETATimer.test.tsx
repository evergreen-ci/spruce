import { render, screen, waitFor, act } from "test_utils";
import ETATimer from ".";

describe("etaTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, "setInterval");
    jest.spyOn(global, "clearInterval");
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });
  it("counts down", async () => {
    const startTime = new Date();
    const expectedDuration = 10000;
    render(
      <ETATimer startTime={startTime} expectedDuration={expectedDuration} />,
    );
    expect(screen.getByText("ETA: 10s")).toBeInTheDocument();
    act(() => {
      jest.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.getByText("ETA: 9s")).toBeInTheDocument();
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.getByText("ETA: 8s")).toBeInTheDocument();
    });
  });
  it("stops counting down when it reaches 0", async () => {
    const startTime = new Date();
    const expectedDuration = 1000;
    render(
      <ETATimer startTime={startTime} expectedDuration={expectedDuration} />,
    );
    expect(screen.getByText("ETA: 1s")).toBeInTheDocument();
    act(() => {
      jest.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.getByText("ETA: 0s")).toBeInTheDocument();
    });
    expect(global.clearInterval).toHaveBeenCalledWith(expect.any(Number));
    expect(jest.getTimerCount()).toBe(0);
  });
});
