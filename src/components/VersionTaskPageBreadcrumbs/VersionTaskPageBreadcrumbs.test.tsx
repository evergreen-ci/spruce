import { MockedProvider } from "@apollo/client/testing";
import {
  getCommitsRoute,
  getVersionRoute,
  getUserPatchesRoute,
} from "constants/routes";
import { GET_OTHER_USER } from "gql/queries";
import { renderWithRouterMatch as render, waitFor } from "test_utils";
import PageBreadcrumbs from ".";

describe("versionTaskPageBreadcrumbs", () => {
  it("should generate a my patches link if the current user owns the patch", async () => {
    const { getByText } = render(
      <MockedProvider mocks={[sameUserMock]} addTypename={false}>
        <PageBreadcrumbs
          patchNumber={1}
          versionMetadata={{
            id: "123",
            revision: "abc123456",
            isPatch: true,
            author: "mohamed.khelif",
            projectIdentifier: "spruce",
            project: "spruce",
          }}
        />
      </MockedProvider>,
      {
        route: "/version/123",
        path: "/version/*",
      }
    );
    await waitFor(() => {
      expect(getByText("My Patches")).toBeInTheDocument();
      expect(getByText("My Patches")).toHaveAttribute(
        "href",
        getUserPatchesRoute("mohamed.khelif")
      );
    });
  });
  it("should generate another user's patches link if the user does not own the patch", async () => {
    const { getByText } = render(
      <MockedProvider mocks={[otherUserMock]} addTypename={false}>
        <PageBreadcrumbs
          patchNumber={1}
          versionMetadata={{
            id: "123",
            revision: "abc123456",
            isPatch: true,
            author: "john.doe",
            projectIdentifier: "spruce",
            project: "spruce",
          }}
        />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(getByText("John Doe's Patches")).toBeInTheDocument();
      expect(getByText("John Doe's Patches")).toHaveAttribute(
        "href",
        getUserPatchesRoute("john.doe")
      );
    });
  });

  it("mainline commits should link to the project health view", () => {
    const { getByText } = render(
      <MockedProvider mocks={[sameUserMock]} addTypename={false}>
        <PageBreadcrumbs
          patchNumber={1}
          versionMetadata={{
            id: "123",
            revision: "abc123456",
            isPatch: false,
            author: "john.doe",
            projectIdentifier: "spruce",
            project: "spruce",
          }}
        />
      </MockedProvider>
    );

    expect(getByText("spruce")).toBeInTheDocument();
    expect(getByText("spruce")).toHaveAttribute(
      "href",
      getCommitsRoute("spruce")
    );
  });
  it("should not have link to the version page if a user is on a version page", () => {
    const { getByText } = render(
      <MockedProvider mocks={[sameUserMock]} addTypename={false}>
        <PageBreadcrumbs
          patchNumber={1}
          versionMetadata={{
            id: "123",
            revision: "abc123456",
            isPatch: false,
            author: "john.doe",
            projectIdentifier: "spruce",
            project: "spruce",
          }}
        />
      </MockedProvider>
    );
    expect(getByText("abc1234")).toBeInTheDocument();
    expect(getByText("abc1234")).not.toHaveAttribute("href");
  });
  it("should have a link to the version page if a user is on a task page", () => {
    const { getByText } = render(
      <MockedProvider mocks={[sameUserMock]} addTypename={false}>
        <PageBreadcrumbs
          patchNumber={1}
          versionMetadata={{
            id: "123",
            revision: "abc123456",
            isPatch: false,
            author: "john.doe",
            projectIdentifier: "spruce",
            project: "spruce",
          }}
          taskName="task-1"
        />
      </MockedProvider>
    );
    expect(getByText("abc1234")).toBeInTheDocument();
    expect(getByText("abc1234")).toHaveAttribute(
      "href",
      getVersionRoute("123")
    );
  });
});

const sameUserMock = {
  request: {
    query: GET_OTHER_USER,
    variables: {
      userId: "mohamed.khelif",
    },
  },
  result: {
    data: {
      otherUser: {
        userId: "mohamed.khelif",
        displayName: "Mohamed Khelif",
      },
      currentUser: {
        userId: "mohamed.khelif",
      },
    },
  },
};

const otherUserMock = {
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
        userId: "mohamed.khelif",
      },
    },
  },
};
