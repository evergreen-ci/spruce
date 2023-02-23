import { MockedProvider } from "@apollo/client/testing";
import { renderHook } from "@testing-library/react-hooks";
import {
  GetOtherUserQuery,
  GetOtherUserQueryVariables,
} from "gql/generated/types";
import { getUserMock } from "gql/mocks/getUser";
import { GET_OTHER_USER } from "gql/queries";
import { useBreadcrumbRoot } from "hooks";
import { ApolloMock } from "types/gql";

const SameUserProvider = ({ children }) => (
  <MockedProvider mocks={[getUserMock, sameUserMock]}>
    {children}
  </MockedProvider>
);

const OtherUserProvider = ({ children }) => (
  <MockedProvider mocks={[getUserMock, otherUserMock]}>
    {children}
  </MockedProvider>
);

describe("useBreadcrumbRoot", () => {
  it("returns the correct breadcrumb root when the version is a patch belonging to current user", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useBreadcrumbRoot(true, "admin", "spruce"),
      { wrapper: SameUserProvider }
    );
    await waitForNextUpdate();

    expect(result.current.to).toBe("/user/admin/patches");
    expect(result.current.text).toBe("My Patches");
  });

  it("returns the correct breadcrumb root when the version is a patch belonging to other user", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useBreadcrumbRoot(true, "john.doe", "spruce"),
      { wrapper: OtherUserProvider }
    );
    await waitForNextUpdate();

    expect(result.current.to).toBe("/user/john.doe/patches");
    expect(result.current.text).toBe("John Doe's Patches");
  });

  it("returns the correct breadcrumb root when the version is a commit", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useBreadcrumbRoot(false, "admin", "spruce"),
      { wrapper: SameUserProvider }
    );
    await waitForNextUpdate();

    expect(result.current.to).toBe("/commits/spruce");
    expect(result.current.text).toBe("spruce");
  });
});

const sameUserMock: ApolloMock<GetOtherUserQuery, GetOtherUserQueryVariables> =
  {
    request: {
      query: GET_OTHER_USER,
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
  };

const otherUserMock: ApolloMock<GetOtherUserQuery, GetOtherUserQueryVariables> =
  {
    request: {
      query: GET_OTHER_USER,
      variables: {
        userId: "john.doe",
      },
    },
    result: {
      data: {
        otherUser: {
          userId: "john.doe",
          displayName: "John Doe",
        },
        currentUser: {
          userId: "admin",
        },
      },
    },
  };
