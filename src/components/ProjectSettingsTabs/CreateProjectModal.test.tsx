import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { CREATE_PROJECT } from "gql/mutations";
import { render, fireEvent, waitFor } from "test_utils";
import { CreateProjectModal } from "./CreateProjectModal";

describe("createProjectField", () => {
  const owner = "existing_owner";
  const repo = "existing_repo";

  const NewProjectModal = () => (
    <MockedProvider mocks={[createProjectMock]}>
      <CreateProjectModal owner={null} repo={null} />
    </MockedProvider>
  );

  const NewProjectModalWithOwner = () => (
    <MockedProvider mocks={[createProjectMock]}>
      <CreateProjectModal owner={owner} repo={repo} />
    </MockedProvider>
  );

  it("clicking the button opens the modal", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    const { queryByDataCy } = render(<Component />);
    expect(queryByDataCy("create-project-modal")).not.toBeInTheDocument();

    const createProjectButton = queryByDataCy("create-project-button");
    fireEvent.click(createProjectButton);
    await waitFor(() =>
      expect(queryByDataCy("create-project-modal")).toBeVisible()
    );
  });

  it("disables the confirm button on initial render", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    const { queryByDataCy, queryByText } = render(<Component />);

    const createProjectButton = queryByDataCy("create-project-button");
    fireEvent.click(createProjectButton);

    await waitFor(() => expect(queryByText("Project Name")).toBeVisible());

    await waitFor(() => {
      const confirmButton = queryByText("Create Project").closest("button");
      expect(confirmButton).toBeDisabled();
    });
  });

  it("disables the confirm button when only owner field is updated", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    const { queryByDataCy, queryByText } = render(<Component />);

    const createProjectButton = queryByDataCy("create-project-button");
    fireEvent.click(createProjectButton);

    await waitFor(() => expect(queryByText("Project Name")).toBeVisible());
    userEvent.type(queryByDataCy("owner-input"), "new-owner-name");
    await waitFor(() => {
      const confirmButton = queryByText("Create Project").closest("button");
      expect(confirmButton).toBeDisabled();
    });
  });

  it("enables the confirm button if the optional project id is empty", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    const { queryByDataCy, queryByText } = render(<Component />);

    const createProjectButton = queryByDataCy("create-project-button");
    fireEvent.click(createProjectButton);

    await waitFor(() => expect(queryByText("Project Name")).toBeVisible());

    userEvent.type(
      queryByDataCy("project-name-input"),
      "new-project-name-input"
    );
    userEvent.type(queryByDataCy("repo-input"), "new-repo-name");
    userEvent.type(queryByDataCy("owner-input"), "new-owner-name");
    await waitFor(() => {
      const confirmButton = queryByText("Create Project").closest("button");
      expect(confirmButton).not.toBeDisabled();
    });
  });

  it("enables the confirm button when all fields are updated", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    const { queryByDataCy, queryByText } = render(<Component />);

    const createProjectButton = queryByDataCy("create-project-button");
    fireEvent.click(createProjectButton);

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
      expect(confirmButton).not.toBeDisabled();
    });
  });

  it("pre-fills the owner and repo when available", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModalWithOwner />);
    const { queryByDataCy, queryByText } = render(<Component />);

    const createProjectButton = queryByDataCy("create-project-button");
    fireEvent.click(createProjectButton);

    await waitFor(() => expect(queryByText("Project Name")).toBeVisible());

    expect(queryByDataCy("owner-input")).toHaveValue(owner);
    expect(queryByDataCy("repo-input")).toHaveValue(repo);
  });
});

const createProjectMock = {
  request: {
    query: CREATE_PROJECT,
    variables: {
      project: {
        identifier: "projectName",
        id: "projectId",
        owner: "owner",
        repo: "repo",
      },
    },
  },
  result: {
    data: {
      id: "projectName",
    },
  },
};
