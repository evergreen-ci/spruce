import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import { CREATE_PROJECT } from "gql/mutations";
import { GET_GITHUB_ORGS } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { selectLGOption } from "test_utils/utils";
import { CreateProjectModal } from "./CreateProjectModal";

const mockedUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
}));

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

describe("createProjectField", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("does not render the modal when open prop is false", () => {
    const { Component } = RenderFakeToastContext(
      <NewProjectModal open={false} />
    );
    render(<Component />);

    expect(
      screen.queryByDataCy("create-project-modal")
    ).not.toBeInTheDocument();
  });

  it("disables the confirm button on initial render", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    await waitFor(() =>
      expect(screen.queryByDataCy("create-project-modal")).toBeVisible()
    );

    expect(
      screen.getByRole("button", {
        name: "Create Project",
      })
    ).toBeDisabled();
  });

  it("pre-fills the owner and repo", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    await waitFor(() =>
      expect(screen.queryByDataCy("create-project-modal")).toBeVisible()
    );

    expect(screen.queryByDataCy("owner-select")).toHaveTextContent(
      defaultOwner
    );
    expect(screen.queryByDataCy("repo-input")).toHaveValue(defaultRepo);
  });

  it("disables the confirm button when repo field is missing", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    await waitFor(() =>
      expect(screen.queryByDataCy("create-project-modal")).toBeVisible()
    );
    userEvent.type(
      screen.queryByDataCy("project-name-input"),
      "new-project-name-input"
    );
    userEvent.clear(screen.queryByDataCy("repo-input"));
    expect(
      screen.getByRole("button", {
        name: "Create Project",
      })
    ).toBeDisabled();
  });

  it("disables the confirm button when project name field is missing", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    await waitFor(() =>
      expect(screen.queryByDataCy("create-project-modal")).toBeVisible()
    );
    expect(screen.queryByDataCy("project-name-input")).toHaveValue("");
    expect(
      screen.getByRole("button", {
        name: "Create Project",
      })
    ).toBeDisabled();
  });

  it("disables the confirm button when project name contains a space", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    await waitFor(() =>
      expect(screen.queryByDataCy("create-project-modal")).toBeVisible()
    );
    userEvent.type(screen.queryByDataCy("project-name-input"), "my test");
    expect(
      screen.getByRole("button", {
        name: "Create Project",
      })
    ).toBeDisabled();
  });

  it("enables the confirm button if the optional project id is empty", async () => {
    const { Component, dispatchToast } = RenderFakeToastContext(
      <NewProjectModal />
    );
    render(<Component />);

    await waitFor(() =>
      expect(screen.queryByDataCy("create-project-modal")).toBeVisible()
    );

    await selectLGOption("owner-select", "10gen");
    userEvent.clear(screen.queryByDataCy("repo-input"));
    userEvent.type(screen.queryByDataCy("repo-input"), "new-repo-name");
    userEvent.type(
      screen.queryByDataCy("project-name-input"),
      "new-project-name"
    );
    expect(
      screen.getByRole("button", {
        name: "Create Project",
      })
    ).toBeEnabled();

    userEvent.click(screen.queryByText("Create Project"));
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
  });

  it("form submission succeeds when all fields are updated", async () => {
    const mockWithId = {
      request: {
        query: CREATE_PROJECT,
        variables: {
          project: {
            id: "new-project-id",
            identifier: "new-project-name",
            owner: "10gen",
            repo: "new-repo-name",
          },
        },
      },
      result: {
        data: {
          createProject: {
            identifier: "new-project-name",
          },
        },
      },
    };
    const { Component, dispatchToast } = RenderFakeToastContext(
      <NewProjectModal mock={mockWithId} />
    );
    render(<Component />);

    await waitFor(() =>
      expect(screen.queryByDataCy("create-project-modal")).toBeVisible()
    );
    userEvent.type(
      screen.queryByDataCy("project-name-input"),
      "new-project-name"
    );
    userEvent.type(screen.queryByDataCy("project-id-input"), "new-project-id");
    await selectLGOption("owner-select", "10gen");
    userEvent.clear(screen.queryByDataCy("repo-input"));
    userEvent.type(screen.queryByDataCy("repo-input"), "new-repo-name");

    expect(
      screen.getByRole("button", {
        name: "Create Project",
      })
    ).toBeEnabled();

    userEvent.click(screen.queryByText("Create Project"));
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
  });
});

const createProjectMock = {
  request: {
    query: CREATE_PROJECT,
    variables: {
      project: {
        identifier: "new-project-name",
        owner: "10gen",
        repo: "new-repo-name",
      },
    },
  },
  result: {
    data: {
      createProject: {
        identifier: "new-project-name",
      },
    },
  },
};

const getGithubOrgsMock = {
  request: {
    query: GET_GITHUB_ORGS,
  },
  result: {
    data: {
      spruceConfig: {
        githubOrgs: ["evergreen-ci", "10gen"],
      },
    },
  },
};
