import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { GraphQLError } from "graphql";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  CreateProjectMutation,
  CreateProjectMutationVariables,
  GithubOrgsQuery,
  GithubOrgsQueryVariables,
} from "gql/generated/types";
import { CREATE_PROJECT } from "gql/mutations";
import { GITHUB_ORGS } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { selectLGOption } from "test_utils/utils";
import { ApolloMock } from "types/gql";
import { CreateProjectModal } from "./CreateProjectModal";

const defaultOwner = "evergreen-ci";
const defaultRepo = "spruce";

const NewProjectModal = ({
  mock = createProjectMock,
  open = true,
  owner = defaultOwner,
  repo = defaultRepo,
}: {
  mock?: MockedResponse;
  open?: boolean;
  owner?: string;
  repo?: string;
}) => (
  <MockedProvider mocks={[getGithubOrgsMock, mock]}>
    <CreateProjectModal
      handleClose={() => {}}
      open={open}
      owner={owner}
      repo={repo}
    />
  </MockedProvider>
);

const waitForModalLoad = async () => {
  await waitFor(() =>
    expect(screen.queryByDataCy("create-project-modal")).toBeVisible(),
  );
  await waitFor(() =>
    expect(screen.queryByDataCy("loading-skeleton")).toBeNull(),
  );
};

describe("createProjectField", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("does not render the modal when open prop is false", () => {
    const { Component } = RenderFakeToastContext(
      <NewProjectModal open={false} />,
    );
    render(<Component />);

    expect(
      screen.queryByDataCy("create-project-modal"),
    ).not.toBeInTheDocument();
  });

  it("disables the confirm button on initial render", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    await waitForModalLoad();

    expect(
      screen.getByRole("button", {
        name: "Create project",
      }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("shows warning banner for performance tooling", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    await waitForModalLoad();
    expect(screen.queryByDataCy("performance-tooling-banner")).toBeVisible();
  });

  it("pre-fills the owner and repo", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);
    await waitForModalLoad();

    expect(screen.queryByDataCy("new-owner-select")).toHaveTextContent(
      defaultOwner,
    );
    expect(screen.queryByDataCy("new-repo-input")).toHaveValue(defaultRepo);
  });

  it("disables the confirm button when repo field is missing", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);
    await waitForModalLoad();

    await user.type(
      screen.queryByDataCy("project-name-input"),
      "new-project-name-input",
    );
    await user.clear(screen.queryByDataCy("new-repo-input"));
    expect(
      screen.getByRole("button", {
        name: "Create project",
      }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("disables the confirm button when project name field is missing", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);
    await waitForModalLoad();

    expect(screen.queryByDataCy("project-name-input")).toHaveValue("");
    expect(
      screen.getByRole("button", {
        name: "Create project",
      }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("disables the confirm button when project name contains a space", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);
    await waitForModalLoad();

    await user.type(screen.queryByDataCy("project-name-input"), "my test");
    expect(
      screen.getByRole("button", {
        name: "Create project",
      }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("form submission succeeds when performance tooling is enabled", async () => {
    const mockWithId: ApolloMock<
      CreateProjectMutation,
      CreateProjectMutationVariables
    > = {
      request: {
        query: CREATE_PROJECT,
        variables: {
          project: {
            id: "new-project-id",
            identifier: "new-project-id",
            owner: "10gen",
            repo: "new-repo-name",
          },
          requestS3Creds: true,
        },
      },
      result: {
        data: {
          createProject: {
            __typename: "Project",
            id: "new-project-id",
            identifier: "new-project-id",
          },
        },
      },
    };
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <NewProjectModal mock={mockWithId} />,
    );
    const { router } = render(<Component />);
    await waitForModalLoad();

    await user.type(
      screen.queryByDataCy("project-name-input"),
      "new-project-id",
    );
    await selectLGOption("new-owner-select", "10gen");
    await user.clear(screen.queryByDataCy("new-repo-input"));
    await user.type(screen.queryByDataCy("new-repo-input"), "new-repo-name");

    const confirmButton = screen.getByRole("button", {
      name: "Create project",
    });
    expect(confirmButton).toBeEnabled();

    // Turn on performance tooling.
    const enablePerformanceTooling = screen.getByDataCy(
      "enable-performance-tooling",
    );
    const enablePerformanceToolingLabel = screen.getByText(
      "Enable performance tooling",
    );
    expect(enablePerformanceTooling).not.toBeChecked();
    await user.click(enablePerformanceToolingLabel); // LeafyGreen checkbox has pointer-events: none so click on the label instead.
    expect(enablePerformanceTooling).toBeChecked();

    // Turn on request for S3 creds.
    const requestS3Creds = screen.getByDataCy("request-s3-creds");
    const requestS3CredLabel = screen.getByText(
      "Open a JIRA ticket to request an S3 Bucket from the Build team",
    );
    expect(requestS3Creds).not.toBeChecked();
    await user.click(requestS3CredLabel); // LeafyGreen checkbox has pointer-events: none so click on the label instead.
    expect(requestS3Creds).toBeChecked();
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
    expect(router.state.location.pathname).toBe(
      "/project/new-project-id/settings",
    );
  });
  it("shows a warning toast when an error and data are returned", async () => {
    const mockWithWarn = {
      request: {
        query: CREATE_PROJECT,
        variables: {
          project: {
            identifier: "new-project-name",
            owner: "10gen",
            repo: "new-repo-name",
          },
          requestS3Creds: false,
        },
      },
      result: {
        data: {
          createProject: {
            id: "new-project-id",
            identifier: "new-project-name",
          },
        },
        errors: [new GraphQLError("There was an error creating the project")],
      },
    };
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <NewProjectModal mock={mockWithWarn} />,
    );
    const { router } = render(<Component />);
    await waitForModalLoad();

    await user.type(
      screen.queryByDataCy("project-name-input"),
      "new-project-name",
    );
    await selectLGOption("new-owner-select", "10gen");
    await user.clear(screen.queryByDataCy("new-repo-input"));
    await user.type(screen.queryByDataCy("new-repo-input"), "new-repo-name");

    const confirmButton = screen.getByRole("button", {
      name: "Create project",
    });
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
    expect(router.state.location.pathname).toBe(
      "/project/new-project-name/settings",
    );
  });
});

const createProjectMock: ApolloMock<
  CreateProjectMutation,
  CreateProjectMutationVariables
> = {
  request: {
    query: CREATE_PROJECT,
    variables: {
      project: {
        identifier: "new-project-name",
        owner: "10gen",
        repo: "new-repo-name",
      },
      requestS3Creds: false,
    },
  },
  result: {
    data: {
      createProject: {
        __typename: "Project",
        id: "new-project-id",
        identifier: "new-project-name",
      },
    },
  },
};

const getGithubOrgsMock: ApolloMock<GithubOrgsQuery, GithubOrgsQueryVariables> =
  {
    request: {
      query: GITHUB_ORGS,
    },
    result: {
      data: {
        spruceConfig: {
          __typename: "SpruceConfig",
          githubOrgs: ["evergreen-ci", "10gen"],
        },
      },
    },
  };
