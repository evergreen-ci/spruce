import { MockedProvider } from "@apollo/client/testing";
import { getUserMock } from "gql/mocks/getUser";
import { useNetworkStatus } from "hooks";
import { act, renderHook } from "test_utils";

const Provider = ({ children }) => (
  <MockedProvider mocks={[getUserMock]}>{children}</MockedProvider>
);

describe("useNetworkStatus", () => {
  const updateNetworkStatus = (status: string) => {
    act(() => {
      window.dispatchEvent(new window.Event(status));
    });
  };

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
    updateNetworkStatus("offline");
    expect(result.current).toBe(false);
  });
});
