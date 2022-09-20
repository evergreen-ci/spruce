import { MockedProvider } from "@apollo/client/testing";
import { renderHook } from "@testing-library/react-hooks";
import { GET_OTHER_USER } from "gql/queries";
import { useBreadcrumbRoot } from "hooks";

const Provider = ({ children }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("useBreadcrumbRoot", () => {
  it("returns the correct breadcrumb root when the version is a patch", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useBreadcrumbRoot(true, "admin", "spruce"),
      { wrapper: Provider }
    );
    await waitForNextUpdate();

    expect(result.current.to).toBe("/user/admin/patches");
    expect(result.current.text).toBe("My Patches");
  });

  it("returns the correct breadcrumb root when the version is a commit", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useBreadcrumbRoot(false, "admin", "spruce"),
      { wrapper: Provider }
    );
    await waitForNextUpdate();

    expect(result.current.to).toBe("/commits/spruce");
    expect(result.current.text).toBe("spruce");
  });
});

const mocks = [
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
  },
];
