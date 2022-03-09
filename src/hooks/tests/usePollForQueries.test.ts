import { fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import { usePollForQueries } from "hooks";

describe("usePollForQueries", () => {
  beforeEach(() => {
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      configurable: true,
    });
  });

  it("usePollForQueries should not call the functions when initialized", () => {
    const startPolling = jest.fn();
    const stopPolling = jest.fn();
    const { result } = renderHook(() =>
      usePollForQueries(startPolling, stopPolling)
    );
    expect(startPolling).toHaveBeenCalledTimes(0);
    expect(stopPolling).toHaveBeenCalledTimes(0);
    expect(result.current).toBe("started");
  });

  describe("stopPolling", () => {
    it("usePollForQueries should stop polling when user's browser is offline", () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();

      const { result } = renderHook(() =>
        usePollForQueries(startPolling, stopPolling)
      );
      expect(result.current).toBe("started");

      act(() => {
        fireEvent(window, new Event("offline"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe("stopped");
    });

    it("usePollForQueries should stop polling when user is not viewing document", () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();

      const { result } = renderHook(() =>
        usePollForQueries(startPolling, stopPolling)
      );
      expect(result.current).toBe("started");

      act(() => {
        Object.defineProperty(document, "visibilityState", {
          value: "hidden",
        });
        fireEvent(document, new Event("visibilitychange"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe("stopped");
    });

    it("usePollForQueries should only call stopPolling once if first user goes offline, then stops viewing document", () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();

      const { result } = renderHook(() =>
        usePollForQueries(startPolling, stopPolling)
      );
      expect(result.current).toBe("started");

      // go offline
      act(() => {
        fireEvent(window, new Event("offline"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe("stopped");

      // document hidden
      act(() => {
        Object.defineProperty(document, "visibilityState", {
          value: "hidden",
        });
        fireEvent(document, new Event("visibilitychange"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe("stopped");
    });

    it("usePollForQueries should only call stopPolling once if user first stops viewing document, then goes offline", () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();

      const { result } = renderHook(() =>
        usePollForQueries(startPolling, stopPolling)
      );
      expect(result.current).toBe("started");

      // document hidden
      act(() => {
        Object.defineProperty(document, "visibilityState", {
          value: "hidden",
        });
        fireEvent(document, new Event("visibilitychange"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe("stopped");

      // go offline
      act(() => {
        fireEvent(window, new Event("offline"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe("stopped");
    });
  });

  describe("startPolling", () => {
    it("usePollForQueries should only restart polling when the browser is online AND document is visible", () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();

      const { result } = renderHook(() =>
        usePollForQueries(startPolling, stopPolling)
      );
      expect(result.current).toBe("started");

      // go offline
      act(() => {
        fireEvent(window, new Event("offline"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe("stopped");

      // document hidden
      act(() => {
        Object.defineProperty(document, "visibilityState", {
          value: "hidden",
        });
        fireEvent(document, new Event("visibilitychange"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe("stopped");

      // go online - should not start polling because document is still hidden
      act(() => {
        fireEvent(window, new Event("online"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe("stopped");

      // document visible - start polling
      act(() => {
        Object.defineProperty(document, "visibilityState", {
          value: "visible",
        });
        fireEvent(document, new Event("visibilitychange"));
      });
      expect(startPolling).toHaveBeenCalledTimes(1);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe("started");
    });
  });
});
