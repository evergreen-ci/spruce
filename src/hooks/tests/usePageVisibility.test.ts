import { fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import { usePageVisibility } from "hooks";

describe("usePageVisibility", () => {
  it("usePageVisibility should return true when user is viewing document", () => {
    const { result } = renderHook(() => usePageVisibility());
    expect(result.current).toBe(true);
  });

  it("usePageVisibility should return false when user is not viewing document", () => {
    const { result } = renderHook(() => usePageVisibility());
    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
      });
      fireEvent(document, new Event("visibilitychange"));
    });
    expect(result.current).toBe(false);
  });
});
