import { MockedProvider } from "@apollo/client/testing";
import { renderHook } from "@testing-library/react-hooks";
import { OtherUserQuery, OtherUserQueryVariables } from "gql/generated/types";
import { GET_OTHER_USER } from "gql/queries";
import { useGetUserPatchesPageTitleAndLink } from "hooks";
import { ApolloMock } from "types/gql";

const mocks: ApolloMock<OtherUserQuery, OtherUserQueryVariables>[] = [
  {
    request: {
      query: GET_OTHER_USER,
      variables: {
        userId: "admin",
      },
    },
    result: {
      data: {
        currentUser: { __typename: "User", userId: "admin" },
        otherUser: {
          __typename: "User",
          displayName: "Evergreen Admin",
          userId: "admin",
        },
      },
    },
  },
  {
    request: {
      query: GET_OTHER_USER,
      variables: {
        userId: "justin.mathew",
      },
    },
    result: {
      data: {
        currentUser: { __typename: "User", userId: "admin" },
        otherUser: {
          __typename: "User",
          displayName: "Justin Mathew",
          userId: "justin.mathew",
        },
      },
    },
  },
  {
    request: {
      query: GET_OTHER_USER,
      variables: {
        userId: "justin.mathews",
      },
    },
    result: {
      data: {
        currentUser: { __typename: "User", userId: "admin" },
        otherUser: {
          __typename: "User",
          displayName: "Justin Mathews",
          userId: "justin.mathews",
        },
      },
    },
  },
];

const Provider = ({ children }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("useGetUserPatchesPageTitleAndLink", () => {
  it("return correct title and link when the userId passed into the hook parameter is that of the logged in user", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useGetUserPatchesPageTitleAndLink("admin"),
      { wrapper: Provider }
    );

    await waitForNextUpdate();

    expect(result.current.title).toBe("My Patches");
    expect(result.current.link).toBe("/user/admin/patches");
  });

  it("return correct title and link when the userId passed into the hook parameter is not that of the logged in user", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useGetUserPatchesPageTitleAndLink("justin.mathew"),
      { wrapper: Provider }
    );

    await waitForNextUpdate();

    expect(result.current.title).toBe("Justin Mathew's Patches");
    expect(result.current.link).toBe("/user/justin.mathew/patches");
  });

  it("return correct title and link when the userId passed into the hook parameter is not that of the logged in user and the display name of the other user ends with the letter 's'", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useGetUserPatchesPageTitleAndLink("justin.mathews"),
      { wrapper: Provider }
    );
    await waitForNextUpdate();
    expect(result.current.title).toBe("Justin Mathews' Patches");
    expect(result.current.link).toBe("/user/justin.mathews/patches");
  });
});
