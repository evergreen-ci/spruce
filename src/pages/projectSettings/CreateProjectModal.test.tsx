import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { CREATE_PROJECT } from "gql/mutations";
import { renderWithRouterMatch as render, waitFor } from "test_utils";
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
  it("does not render the modal when open prop is false", async () => {
    const { Component } = RenderFakeToastContext(
      <NewProjectModal open={false} />
    );
    const { queryByDataCy } = render(<Component />);

    expect(queryByDataCy("create-project-modal")).not.toBeInTheDocument();
  });

  it("disables the confirm button on initial render", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    const { queryByText } = render(<Component />);

    await waitFor(() => expect(queryByText("Project Name")).toBeVisible());

    await waitFor(() => {
      const confirmButton = queryByText("Create Project").closest("button");
      expect(confirmButton).toBeDisabled();
    });
  });

  it("disables the confirm button when project name field is missing", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    const { queryByDataCy, queryByText } = render(<Component />);

    await waitFor(() => expect(queryByText("Project Name")).toBeVisible());
    userEvent.type(queryByDataCy("repo-input"), "new-repo-name");
    userEvent.type(queryByDataCy("owner-input"), "new-owner-name");
    await waitFor(() => {
      const confirmButton = queryByText("Create Project").closest("button");
      expect(confirmButton).toBeDisabled();
    });
  });

  it("disables the confirm button when repo field is missing", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    const { queryByDataCy, queryByText } = render(<Component />);

    await waitFor(() => expect(queryByText("Project Name")).toBeVisible());
    userEvent.type(
      queryByDataCy("project-name-input"),
      "new-project-name-input"
    );
    userEvent.type(queryByDataCy("owner-input"), "new-owner-name");
    expect(queryByDataCy("repo-input")).toHaveValue("");
    await waitFor(() => {
      const confirmButton = queryByText("Create Project").closest("button");
      expect(confirmButton).toBeDisabled();
    });
  });

  it("disables the confirm button when owner field is missing", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    const { queryByDataCy, queryByText } = render(<Component />);

    await waitFor(() => expect(queryByText("Project Name")).toBeVisible());
    userEvent.type(
      queryByDataCy("project-name-input"),
      "new-project-name-input"
    );
    userEvent.type(queryByDataCy("repo-input"), "new-repo-name");
    await waitFor(() => {
      const confirmButton = queryByText("Create Project").closest("button");
      expect(confirmButton).toBeDisabled();
    });
  });

  it("disables the confirm button when project name contains a space", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    const { queryByDataCy, queryByText } = render(<Component />);

    await waitFor(() => expect(queryByText("Project Name")).toBeVisible());
    userEvent.type(queryByDataCy("project-name-input"), "my test");
    userEvent.type(queryByDataCy("repo-input"), "new-repo-name");
    userEvent.type(queryByDataCy("owner-input"), "new-owner-name");
    await waitFor(() => {
      const confirmButton = queryByText("Create Project").closest("button");
      expect(confirmButton).toBeDisabled();
    });
  });

  it("enables the confirm button if the optional project id is empty", async () => {
    const { Component, dispatchToast } = RenderFakeToastContext(
      <NewProjectModal />
    );
    const { queryByDataCy, queryByText } = render(<Component />);

    await waitFor(() => expect(queryByText("Project Name")).toBeVisible());
    userEvent.type(
      queryByDataCy("project-name-input"),
      "new-project-name-input"
    );
    userEvent.type(queryByDataCy("repo-input"), "new-repo-name");
    userEvent.type(queryByDataCy("owner-input"), "new-owner-name");
    await waitFor(() => {
      const confirmButton = queryByText("Create Project").closest("button");
      expect(confirmButton).toBeEnabled();
    });

    userEvent.click(queryByText("Create Project"));
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
    const { queryByDataCy, queryByText } = render(<Component />);

    await waitFor(() => expect(queryByText("Project Name")).toBeVisible());
    userEvent.type(
      queryByDataCy("project-name-input"),
      "new-project-name-input"
    );
    userEvent.type(queryByDataCy("project-id-input"), "new-project-id-input");
    userEvent.type(queryByDataCy("repo-input"), "new-repo-name");
    userEvent.type(queryByDataCy("owner-input"), "new-owner-name");

    await waitFor(() => {
      const confirmButton = queryByText("Create Project").closest("button");
      expect(confirmButton).toBeEnabled();
    });

    userEvent.click(queryByText("Create Project"));
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
  });

  it("pre-fills the owner and repo when available", async () => {
    const { Component } = RenderFakeToastContext(
      <NewProjectModal owner={defaultOwner} repo={defaultRepo} />
    );
    const { queryByDataCy, queryByText } = render(<Component />);

    await waitFor(() => expect(queryByText("Project Name")).toBeVisible());
    expect(queryByDataCy("owner-input")).toHaveValue(defaultOwner);
    expect(queryByDataCy("repo-input")).toHaveValue(defaultRepo);
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
