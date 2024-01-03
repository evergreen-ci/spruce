import { renderHook, act } from "test_utils";
import { useRunningTime } from "."; // Make sure to adjust the import path

describe("useRunningTime", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it("should initialize runningTime based on the provided startTime", () => {
    const startTime = new Date();
    const { result } = renderHook(() => useRunningTime(startTime));

    expect(result.current.runningTime).toBe(0);
  });
  it("should update runningTime at intervals", () => {
    const startTime = new Date();
    const { result } = renderHook(() => useRunningTime(startTime));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.runningTime).toBe(1000);
  });

  it("should stop the timer when endTimer is called", () => {
    const startTime = new Date();
    const { result } = renderHook(() => useRunningTime(startTime));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.runningTime).toBe(1000);

    act(() => {
      result.current.endTimer();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.runningTime).toBe(1000); // Should not have changed after stopping the timer
  });
});
