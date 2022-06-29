import { MockedProvider } from "@apollo/client/testing";
import { fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import { GET_USER } from "gql/queries";
import { useNetworkStatus } from "hooks";

const Provider = ({ children }) => (
  <MockedProvider mocks={[getUserMock]}>{children}</MockedProvider>
);

describe("useNetworkStatus", () => {
  it("useNetworkStatus should return true when the user's browser is online", async () => {
    const { result } = renderHook(() => useNetworkStatus(), {
      wrapper: Provider,
    });
    expect(result.current).toBe(true);
  });

  it("useNetworkStatus should return false when the user's browser is offline", async () => {
    const { result } = renderHook(() => useNetworkStatus(), {
      wrapper: Provider,
    });
    act(() => {
      fireEvent(window, new Event("offline"));
    });
    expect(result.current).toBe(false);
  });
});

const getUserMock = {
  request: {
    query: GET_USER,
  },
  result: {
    data: {
      user: {
        userId: "",
        displayName: "",
        emailAddress: "fake.user@mongodb.com",
        __typename: "User",
      },
    },
  },
};
