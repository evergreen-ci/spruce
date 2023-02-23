import { MockedProvider } from "@apollo/client/testing";
import { fireEvent } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks/dom";
import { getUserMock } from "gql/mocks/getUser";
import { useNetworkStatus } from "hooks";

const Provider = ({ children }) => (
  <MockedProvider mocks={[getUserMock]}>{children}</MockedProvider>
);

describe("useNetworkStatus", () => {
  it("useNetworkStatus should return true when the user's browser is online", () => {
    const { result } = renderHook(() => useNetworkStatus(), {
      wrapper: Provider,
    });
    expect(result.current).toBe(true);
  });

  it("useNetworkStatus should return false when the user's browser is offline", () => {
    const { result } = renderHook(() => useNetworkStatus(), {
      wrapper: Provider,
    });
    fireEvent(window, new Event("offline"));
    expect(result.current).toBe(false);
  });
});
