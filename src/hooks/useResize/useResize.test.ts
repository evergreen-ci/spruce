import { renderHook, act } from "test_utils";
import { useResize } from ".";

describe("useResize", () => {
  const dispatchResizeEvent = () => {
    act(() => {
      window.dispatchEvent(new window.Event("resize"));
    });
  };

  it("should return true while window is resizing", () => {
    const { result } = renderHook(() => useResize());
    expect(result.current).toBe(false);

    dispatchResizeEvent();
    expect(result.current).toBe(true);
  });

  it("should call onResize callback if it is provided", () => {
    const onResize = jest.fn();
    const { result } = renderHook(() => useResize({ onResize }));
    expect(result.current).toBe(false);

    dispatchResizeEvent();
    expect(result.current).toBe(true);
    expect(onResize).toHaveBeenCalledTimes(1);
  });

  it("should return false when window is done resizing", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useResize());
    expect(result.current).toBe(false);

    dispatchResizeEvent();
    expect(result.current).toBe(true);

    // Advance timer so that the timeout is triggered.
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(false);
    jest.useRealTimers();
  });
});
