import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { CREATE_PROJECT } from "gql/mutations";
import { renderWithRouterMatch as render, screen, waitFor } from "test_utils";
import { CreateProjectModal } from "./CreateProjectModal";

const defaultOwner = "existing_owner";
const defaultRepo = "existing_repo";

const NewProjectModal = ({
  mock = createProjectMock,
  open = true,
  owner,
  repo,
}: {
  mock?: MockedResponse;
  open?: boolean;
  owner?: string;
  repo?: string;
}) => (
  <MockedProvider mocks={[mock]}>
    <CreateProjectModal
      handleClose={() => {}}
      open={open}
      owner={owner}
      repo={repo}
    />
  </MockedProvider>
);

describe("createProjectField", () => {
  it("does not render the modal when open prop is false", () => {
    const { Component } = RenderFakeToastContext(
      <NewProjectModal open={false} />
    );
    render(<Component />);

    expect(
      screen.queryByDataCy("create-project-modal")
    ).not.toBeInTheDocument();
  });

  it("disables the confirm button on initial render", () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    expect(screen.queryByText("Project Name")).toBeVisible();

    const confirmButton = screen.getByRole("button", {
      name: "Create Project",
    });
    expect(confirmButton).toBeDisabled();
  });

  it("disables the confirm button when project name field is missing", () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    expect(screen.queryByText("Project Name")).toBeVisible();
    userEvent.type(screen.queryByDataCy("repo-input"), "new-repo-name");
    userEvent.type(screen.queryByDataCy("owner-input"), "new-owner-name");
    const confirmButton = screen.getByRole("button", {
      name: "Create Project",
    });
    expect(confirmButton).toBeDisabled();
  });

  it("disables the confirm button when repo field is missing", () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    expect(screen.queryByText("Project Name")).toBeVisible();
    userEvent.type(
      screen.queryByDataCy("project-name-input"),
      "new-project-name-input"
    );
    userEvent.type(screen.queryByDataCy("owner-input"), "new-owner-name");
    expect(screen.queryByDataCy("repo-input")).toHaveValue("");
    const confirmButton = screen.getByRole("button", {
      name: "Create Project",
    });
    expect(confirmButton).toBeDisabled();
  });

  it("disables the confirm button when owner field is missing", () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    expect(screen.queryByText("Project Name")).toBeVisible();
    userEvent.type(
      screen.queryByDataCy("project-name-input"),
      "new-project-name-input"
    );
    userEvent.type(screen.queryByDataCy("repo-input"), "new-repo-name");
    const confirmButton = screen.getByRole("button", {
      name: "Create Project",
    });
    expect(confirmButton).toBeDisabled();
  });

  it("disables the confirm button when project name contains a space", () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    expect(screen.queryByText("Project Name")).toBeVisible();
    userEvent.type(screen.queryByDataCy("project-name-input"), "my test");
    userEvent.type(screen.queryByDataCy("repo-input"), "new-repo-name");
    userEvent.type(screen.queryByDataCy("owner-input"), "new-owner-name");
    const confirmButton = screen.getByRole("button", {
      name: "Create Project",
    });
    expect(confirmButton).toBeDisabled();
  });

  it("enables the confirm button if the optional project id is empty", async () => {
    const { Component, dispatchToast } = RenderFakeToastContext(
      <NewProjectModal />
    );
    render(<Component />);

    expect(screen.queryByText("Project Name")).toBeVisible();
    userEvent.type(
      screen.queryByDataCy("project-name-input"),
      "new-project-name-input"
    );
    userEvent.type(screen.queryByDataCy("repo-input"), "new-repo-name");
    userEvent.type(screen.queryByDataCy("owner-input"), "new-owner-name");
    const confirmButton = screen.getByRole("button", {
      name: "Create Project",
    });
    expect(confirmButton).toBeEnabled();

    userEvent.click(screen.queryByText("Create Project"));
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
  });

  it("form submission succeeds when all fields are updated", async () => {
    const mockWithId = {
      request: {
        query: CREATE_PROJECT,
        variables: {
          project: {
            identifier: "new-project-name-input",
            id: "new-project-id-input",
            owner: "new-owner-name",
            repo: "new-repo-name",
          },
        },
      },
      result: {
        data: {
          createProject: {
            identifier: "new-project-name-input",
          },
        },
      },
    };
    const { Component, dispatchToast } = RenderFakeToastContext(
      <NewProjectModal mock={mockWithId} />
    );
    render(<Component />);

    expect(screen.queryByText("Project Name")).toBeVisible();
    userEvent.type(
      screen.queryByDataCy("project-name-input"),
      "new-project-name-input"
    );
    userEvent.type(
      screen.queryByDataCy("project-id-input"),
      "new-project-id-input"
    );
    userEvent.type(screen.queryByDataCy("repo-input"), "new-repo-name");
    userEvent.type(screen.queryByDataCy("owner-input"), "new-owner-name");

    const confirmButton = screen.getByRole("button", {
      name: "Create Project",
    });
    expect(confirmButton).toBeEnabled();

    userEvent.click(screen.queryByText("Create Project"));
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
  });

  it("pre-fills the owner and repo when available", () => {
    const { Component } = RenderFakeToastContext(
      <NewProjectModal owner={defaultOwner} repo={defaultRepo} />
    );
    render(<Component />);

    expect(screen.queryByText("Project Name")).toBeVisible();
    expect(screen.queryByDataCy("owner-input")).toHaveValue(defaultOwner);
    expect(screen.queryByDataCy("repo-input")).toHaveValue(defaultRepo);
  });
});

const createProjectMock = {
  request: {
    query: CREATE_PROJECT,
    variables: {
      project: {
        identifier: "new-project-name-input",
        owner: "new-owner-name",
        repo: "new-repo-name",
      },
    },
  },
  result: {
    data: {
      createProject: {
        identifier: "new-project-name-input",
      },
    },
  },
};
