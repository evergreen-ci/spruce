import { MockedProvider } from "@apollo/client/testing";
import { fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks/dom";
import { getUserMock } from "gql/mocks/getUser";
import { usePageVisibility } from "hooks";

const Provider = ({ children }) => (
  <MockedProvider mocks={[getUserMock]}>{children}</MockedProvider>
);

describe("usePageVisibility", () => {
  it("usePageVisibility should return true when user is viewing document", () => {
    const { result } = renderHook(() => usePageVisibility(), {
      wrapper: Provider,
    });
    expect(result.current).toBe(true);
  });

  it("usePageVisibility should return false when user is not viewing document", () => {
    const { result } = renderHook(() => usePageVisibility(), {
      wrapper: Provider,
    });
    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
      });
    });
    fireEvent(document, new Event("visibilitychange"));
    expect(result.current).toBe(false);
  });
});
