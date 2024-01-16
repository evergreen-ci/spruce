import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { OtherUserQuery, OtherUserQueryVariables } from "gql/generated/types";
import { getUserMock } from "gql/mocks/getUser";
import { OTHER_USER } from "gql/queries";
import { useBreadcrumbRoot } from "hooks";
import { renderHook, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";

const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ["userId"],
    },
  },
});

const SameUserProvider = ({ children }) => (
  <MockedProvider mocks={[getUserMock, sameUserMock]} cache={cache}>
    {children}
  </MockedProvider>
);

const OtherUserProvider = ({ children }) => (
  <MockedProvider mocks={[getUserMock, otherUserMock]} cache={cache}>
    {children}
  </MockedProvider>
);

describe("useBreadcrumbRoot", () => {
  it("returns the correct breadcrumb root when the version is a patch belonging to current user", async () => {
    const { result } = renderHook(
      () => useBreadcrumbRoot(true, "admin", "spruce"),
      { wrapper: SameUserProvider },
    );
    await waitFor(() => {
      expect(result.current.to).toBe("/user/admin/patches");
    });
    expect(result.current.text).toBe("My Patches");
  });

  it("returns the correct breadcrumb root when the version is a patch belonging to other user", async () => {
    const { result } = renderHook(
      () => useBreadcrumbRoot(true, "john.doe", "spruce"),
      { wrapper: OtherUserProvider },
    );
    await waitFor(() => {
      expect(result.current.to).toBe("/user/john.doe/patches");
    });
    expect(result.current.text).toBe("John Doe's Patches");
  });

  it("returns the correct breadcrumb root when the version is a commit", () => {
    const { result } = renderHook(
      () => useBreadcrumbRoot(false, "admin", "spruce"),
      { wrapper: SameUserProvider },
    );

    expect(result.current.to).toBe("/commits/spruce");
    expect(result.current.text).toBe("spruce");
  });
});

const sameUserMock: ApolloMock<OtherUserQuery, OtherUserQueryVariables> = {
  request: {
    query: OTHER_USER,
    variables: {
      userId: "admin",
    },
  },
  result: {
    data: {
      otherUser: {
        __typename: "User",
        userId: "admin",
        displayName: "Evergreen Admin",
      },
      currentUser: getUserMock.result.data.user,
    },
  },
};

const otherUserMock: ApolloMock<OtherUserQuery, OtherUserQueryVariables> = {
  request: {
    query: OTHER_USER,
    variables: {
      userId: "john.doe",
    },
  },
  result: {
    data: {
      otherUser: {
        __typename: "User",
        userId: "john.doe",
        displayName: "John Doe",
      },
      currentUser: getUserMock.result.data.user,
    },
  },
};
