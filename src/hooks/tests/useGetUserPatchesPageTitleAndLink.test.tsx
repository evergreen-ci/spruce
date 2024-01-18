import { MockedProvider } from "@apollo/client/testing";
import { OtherUserQuery, OtherUserQueryVariables } from "gql/generated/types";
import { OTHER_USER } from "gql/queries";
import { useGetUserPatchesPageTitleAndLink } from "hooks";
import { renderHook, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";

const mocks: ApolloMock<OtherUserQuery, OtherUserQueryVariables>[] = [
  {
    request: {
      query: OTHER_USER,
      variables: {
        userId: "admin",
      },
    },
    result: {
      data: {
        otherUser: {
          userId: "admin",
          displayName: "Evergreen Admin",
          __typename: "User",
        },
        currentUser: { userId: "admin", __typename: "User" },
      },
    },
  },
  {
    request: {
      query: OTHER_USER,
      variables: {
        userId: "justin.mathew",
      },
    },
    result: {
      data: {
        otherUser: {
          userId: "justin.mathew",
          displayName: "Justin Mathew",
          __typename: "User",
        },
        currentUser: { userId: "admin", __typename: "User" },
      },
    },
  },
  {
    request: {
      query: OTHER_USER,
      variables: {
        userId: "justin.mathews",
      },
    },
    result: {
      data: {
        otherUser: {
          userId: "justin.mathews",
          displayName: "Justin Mathews",
          __typename: "User",
        },
        currentUser: { userId: "admin", __typename: "User" },
      },
    },
  },
];

const Provider = ({ children }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("useGetUserPatchesPageTitleAndLink", () => {
  it("return correct title and link when the userId passed into the hook parameter is that of the logged in user", async () => {
    const { result } = renderHook(
      () => useGetUserPatchesPageTitleAndLink("admin"),
      { wrapper: Provider },
    );
    await waitFor(() => {
      expect(result.current.title).toBe("My Patches");
    });
    expect(result.current.link).toBe("/user/admin/patches");
  });

  it("return correct title and link when the userId passed into the hook parameter is not that of the logged in user", async () => {
    const { result } = renderHook(
      () => useGetUserPatchesPageTitleAndLink("justin.mathew"),
      { wrapper: Provider },
    );
    await waitFor(() => {
      expect(result.current.title).toBe("Justin Mathew's Patches");
    });
    expect(result.current.link).toBe("/user/justin.mathew/patches");
  });

  it("return correct title and link when the userId passed into the hook parameter is not that of the logged in user and the display name of the other user ends with the letter 's'", async () => {
    const { result } = renderHook(
      () => useGetUserPatchesPageTitleAndLink("justin.mathews"),
      { wrapper: Provider },
    );
    await waitFor(() => {
      expect(result.current.title).toBe("Justin Mathews' Patches");
    });
    expect(result.current.link).toBe("/user/justin.mathews/patches");
  });
});
