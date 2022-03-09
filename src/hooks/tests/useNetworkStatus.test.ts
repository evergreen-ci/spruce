import { fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useNetworkStatus } from "hooks";

describe("useNetworkStatus", () => {
  it("useNetworkStatus should return online when the user's' browser is online", () => {
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current).toBe(false);
  });

  it("useNetworkStatus should return offline when the user's browser is offline", () => {
    const { result } = renderHook(() => useNetworkStatus());
    act(() => {
      fireEvent(window, new Event("offline"));
    });
    expect(result.current).toBe(true);
  });
});
