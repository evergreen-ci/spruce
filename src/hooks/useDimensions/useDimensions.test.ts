import { useDimensions } from "hooks/useDimensions";
import { act, renderHook } from "test_utils";

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
        observe: () => {},
        disconnect: disconnectSpy,
        unobserve: () => {},
      };
    });
  });

  it("validate default value", () => {
    const { result } = renderHook(() => useDimensions({ current: null }));
    expect(result.current).toMatchObject({
      width: 0,
      height: 0,
    });
  });

  it("synchronously sets up ResizeObserver listener", () => {
    renderHook(() => useDimensions({ current: null }));
    expect(typeof listener).toBe("function");
  });

  it("tracks DOM dimensions", () => {
    const { result } = renderHook(() =>
      useDimensions({ current: document.createElement("div") }),
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
    const { result } = renderHook(() =>
      useDimensions({ current: document.createElement("div") }),
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
    const { unmount } = renderHook(() =>
      useDimensions({ current: document.createElement("div") }),
    );

    expect(disconnectSpy).toHaveBeenCalledTimes(0);

    unmount();

    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });
});
