/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { act, renderHook } from "@testing-library/react-hooks";
import { useDimensions } from "hooks/useDimensions";

describe("useDimensions", () => {
  it("validate default value", () => {
    window.ResizeObserver = class ResizeObserver {
      observe() {}

      disconnect() {}

      unobserve() {}
    };
    const { result } = renderHook(() => useDimensions({ current: null }));
    expect(result.current).toMatchObject({
      width: 0,
      height: 0,
    });
  });

  it("synchronously sets up ResizeObserver listener", () => {
    let listener = null;
    window.ResizeObserver = class ResizeObserver {
      constructor(ls) {
        listener = ls;
      }

      observe() {}

      disconnect() {}

      unobserve() {}
    };
    renderHook(() => useDimensions({ current: null }));
    expect(typeof listener).toBe("function");
  });

  it("tracks DOM dimensions", () => {
    let listener = null;
    window.ResizeObserver = class ResizeObserver {
      constructor(l) {
        listener = l;
      }

      observe() {}

      disconnect() {}

      unobserve() {}
    };

    const { result } = renderHook(() =>
      useDimensions({ current: document.createElement("div") })
    );

    act(() => {
      listener!([
        {
          contentRect: {
            width: 200,
            height: 200,
          },
        },
      ]);
    });

    expect(result.current).toMatchObject({
      width: 200,
      height: 200,
    });
  });

  it("tracks multiple updates", () => {
    let listener = null;
    window.ResizeObserver = class ResizeObserver {
      constructor(l) {
        listener = l;
      }

      observe() {}

      disconnect() {}

      unobserve() {}
    };

    const { result } = renderHook(() =>
      useDimensions({ current: document.createElement("div") })
    );

    act(() => {
      listener!([
        {
          contentRect: {
            width: 200,
            height: 200,
          },
        },
      ]);
    });

    expect(result.current).toMatchObject({
      width: 200,
      height: 200,
    });

    act(() => {
      listener!([
        {
          contentRect: {
            width: 100,
            height: 100,
          },
        },
      ]);
    });

    expect(result.current).toMatchObject({
      width: 100,
      height: 100,
    });
  });

  it("calls .disconnect() on ResizeObserver when component unmounts", () => {
    const spy = jest.fn();
    window.ResizeObserver = class ResizeObserver {
      observe() {}

      disconnect() {
        spy();
      }

      unobserve() {}
    };

    const { unmount } = renderHook(() =>
      useDimensions({ current: document.createElement("div") })
    );

    expect(spy).toHaveBeenCalledTimes(0);

    unmount();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
