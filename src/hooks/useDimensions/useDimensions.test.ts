import { act, renderHook } from "@testing-library/react-hooks";
import { useDimensions } from "hooks/useDimensions";

describe("useDimensions", () => {
  let listener;
  let disconnectSpy;

  beforeEach(() => {
    // @ts-ignore next-line
    window.requestAnimationFrame = jest.fn((cb) => cb()); // eslint-disable-line jest/prefer-spy-on
    disconnectSpy = jest.fn();
    // eslint-disable-next-line jest/prefer-spy-on
    window.ResizeObserver = jest.fn().mockImplementation((l) => {
      listener = l;
      return {
        disconnect: disconnectSpy,
        observe: () => {},
        unobserve: () => {},
      };
    });
  });

  it("validate default value", () => {
    const { result } = renderHook(() => useDimensions({ current: null }));
    expect(result.current).toMatchObject({
      height: 0,
      width: 0,
    });
  });

  it("synchronously sets up ResizeObserver listener", () => {
    renderHook(() => useDimensions({ current: null }));
    expect(typeof listener).toBe("function");
  });

  it("tracks DOM dimensions", () => {
    const { result } = renderHook(() =>
      useDimensions({ current: document.createElement("div") })
    );

    act(() => {
      listener!([
        {
          contentRect: {
            height: 200,
            width: 200,
          },
        },
      ]);
    });

    expect(result.current).toMatchObject({
      height: 200,
      width: 200,
    });
  });

  it("tracks multiple updates", () => {
    const { result } = renderHook(() =>
      useDimensions({ current: document.createElement("div") })
    );

    act(() => {
      listener!([
        {
          contentRect: {
            height: 200,
            width: 200,
          },
        },
      ]);
    });

    expect(result.current).toMatchObject({
      height: 200,
      width: 200,
    });

    act(() => {
      listener!([
        {
          contentRect: {
            height: 100,
            width: 100,
          },
        },
      ]);
    });

    expect(result.current).toMatchObject({
      height: 100,
      width: 100,
    });
  });

  it("calls .disconnect() on ResizeObserver when component unmounts", () => {
    const { unmount } = renderHook(() =>
      useDimensions({ current: document.createElement("div") })
    );

    expect(disconnectSpy).toHaveBeenCalledTimes(0);

    unmount();

    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });
});
