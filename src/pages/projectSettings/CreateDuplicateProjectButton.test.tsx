import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { GET_USER_PERMISSIONS } from "gql/queries";
import { renderWithRouterMatch as render, waitFor } from "test_utils";
import { CreateDuplicateProjectButton } from "./CreateDuplicateProjectButton";
import { ProjectType } from "./tabs/utils";

const owner = "existing_owner";
const repo = "existing_repo";

const Button = ({
  projectType = ProjectType.AttachedProject,
}: {
  projectType?: ProjectType;
}) => (
  <MockedProvider mocks={[userPermissionsMock]}>
    <CreateDuplicateProjectButton
      id="my_id"
      label={`${owner}/${repo}`}
      owner={owner}
      projectType={projectType}
      repo={repo}
    />
  </MockedProvider>
);

describe("createProjectField", () => {
  describe("when looking at a repo", () => {
    it("clicking the button opens the new project modal", async () => {
      const { Component } = RenderFakeToastContext(
        <Button projectType={ProjectType.Repo} />
      );
      const { queryByDataCy, queryByText } = render(() => <Component />);

      await waitFor(() =>
        expect(queryByText("New Project")).toBeInTheDocument()
      );
      userEvent.click(queryByDataCy("new-project-button"));
      await waitFor(() =>
        expect(queryByDataCy("create-project-modal")).toBeVisible()
      );
      expect(queryByDataCy("new-project-menu")).not.toBeInTheDocument();
    });
  });

  describe("when looking at a project", () => {
    it("clicking the button opens the menu", async () => {
      const { Component } = RenderFakeToastContext(<Button />);
      const { queryByDataCy, queryByText } = render(() => <Component />);

      await waitFor(() =>
        expect(queryByText("New Project")).toBeInTheDocument()
      );
      userEvent.click(queryByDataCy("new-project-button"));
      await waitFor(() =>
        expect(queryByDataCy("new-project-menu")).toBeVisible()
      );
    });

    it("clicking the 'Create New Project' button opens the create project modal and closes the menu", async () => {
      const { Component } = RenderFakeToastContext(<Button />);
      const { queryByDataCy, queryByText } = render(() => <Component />);

      await waitFor(() =>
        expect(queryByText("New Project")).toBeInTheDocument()
      );
      userEvent.click(queryByDataCy("new-project-button"));
      await waitFor(() =>
        expect(queryByDataCy("new-project-menu")).toBeVisible()
      );
      userEvent.click(queryByDataCy("create-project-button"));
      await waitFor(() =>
        expect(queryByDataCy("create-project-modal")).toBeVisible()
      );
      expect(queryByDataCy("new-project-menu")).not.toBeInTheDocument();
    });

    it("clicking the 'Duplicate Project' button opens the create project modal and closes the menu", async () => {
      const { Component } = RenderFakeToastContext(<Button />);
      const { queryByDataCy, queryByText } = render(() => <Component />);

      await waitFor(() =>
        expect(queryByText("New Project")).toBeInTheDocument()
      );
      userEvent.click(queryByDataCy("new-project-button"));
      await waitFor(() =>
        expect(queryByDataCy("new-project-menu")).toBeVisible()
      );
      userEvent.click(queryByDataCy("copy-project-button"));
      await waitFor(() =>
        expect(queryByDataCy("copy-project-modal")).toBeVisible()
      );
      expect(queryByDataCy("new-project-menu")).not.toBeInTheDocument();
    });
  });
});

const userPermissionsMock = {
  request: {
    query: GET_USER_PERMISSIONS,
    variables: {},
  },
  result: {
    data: {
      user: {
        userId: "string",
        permissions: {
          canCreateProject: true,
        },
      },
    },
  },
};
