import { renderHook } from "@testing-library/react-hooks";
import useIntersectionObserver from ".";

describe("useIntersectionObserver", () => {
  it("should call the callback when the element is not intersecting", () => {
    const mockIntersectionObserver = jest.fn((callback) => {
      callback([
        {
          isIntersecting: false,
        },
      ]);
      return {
        disconnect: jest.fn(),
        observe: jest.fn(),
      };
    });

    // @ts-expect-error
    window.IntersectionObserver = mockIntersectionObserver;
    const mockCallback = jest.fn();
    renderHook(() =>
      useIntersectionObserver(
        {
          current: document.createElement("div"),
        },
        mockCallback
      )
    );
    expect(mockCallback).toHaveBeenCalledWith([{ isIntersecting: false }]);
  });
  it("should call the callback when the element is intersecting", () => {
    const mockIntersectionObserver = jest.fn((callback) => {
      callback([
        {
          isIntersecting: true,
        },
      ]);
      return {
        disconnect: jest.fn(),
        observe: jest.fn(),
      };
    });

    // @ts-expect-error
    window.IntersectionObserver = mockIntersectionObserver;
    const mockCallback = jest.fn();
    renderHook(() =>
      useIntersectionObserver(
        {
          current: document.createElement("div"),
        },
        mockCallback
      )
    );
    expect(mockCallback).toHaveBeenCalledWith([{ isIntersecting: true }]);
  });
});
