import { MockedProvider } from "@apollo/client/testing";
import { fireEvent } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks/dom";
import { GetUserQuery, GetUserQueryVariables } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { useNetworkStatus } from "hooks";
import { ApolloMock } from "types/gql";

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

const getUserMock: ApolloMock<GetUserQuery, GetUserQueryVariables> = {
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
