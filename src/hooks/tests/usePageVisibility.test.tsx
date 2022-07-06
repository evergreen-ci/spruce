import { MockedProvider } from "@apollo/client/testing";
import { fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import { GET_USER } from "gql/queries";
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
      fireEvent(document, new Event("visibilitychange"));
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
