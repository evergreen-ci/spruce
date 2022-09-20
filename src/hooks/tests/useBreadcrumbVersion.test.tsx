import { MockedProvider } from "@apollo/client/testing";
import { renderHook } from "@testing-library/react-hooks";
import { GET_OTHER_USER } from "gql/queries";
import { useBreadcrumbVersion } from "hooks";

const Provider = ({ children }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("useBreadcrumbRoot", () => {
  it("returns the correct breadcrumb when the version is a patch", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useBreadcrumbVersion(
          { id: "patch_id", revision: "evg123spruce456", isPatch: true },
          1234
        ),
      { wrapper: Provider }
    );
    await waitForNextUpdate();

    expect(result.current.to).toBe("/version/patch_id/tasks");
    expect(result.current.text).toBe("Patch 1234");
  });

  it("returns the correct breadcrumb when the version is a commit", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useBreadcrumbVersion(
          { id: "commit_id", revision: "evg123spruce456", isPatch: false },
          1234
        ),
      { wrapper: Provider }
    );
    await waitForNextUpdate();

    expect(result.current.to).toBe("/version/commit_id/tasks");
    expect(result.current.text).toBe("evg123s");
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
