import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { GET_USER_PERMISSIONS } from "gql/queries";
import { renderWithRouterMatch as render, screen, waitFor } from "test_utils";
import { CreateDuplicateProjectButton } from "./CreateDuplicateProjectButton";
import { ProjectType } from "./tabs/utils";

const owner = "existing_owner";
const repo = "existing_repo";

const Button = ({
  mock = userPermissionsMock,
  projectType = ProjectType.AttachedProject,
}: {
  mock?: MockedResponse;
  projectType?: ProjectType;
}) => (
  <MockedProvider mocks={[mock]}>
    <CreateDuplicateProjectButton
      id="my_id"
      label={`${owner}/${repo}`}
      owner={owner}
      projectType={projectType}
      repo={repo}
    />
  </MockedProvider>
);

describe("createDuplicateProjectField", () => {
  it("does not show button when user lacks permissions", async () => {
    const lacksPersmissionsMock = {
      request: {
        query: GET_USER_PERMISSIONS,
        variables: {},
      },
      result: {
        data: {
          user: {
            userId: "string",
            permissions: {
              canCreateProject: false,
            },
          },
        },
      },
    };
    const { Component } = RenderFakeToastContext(
      <Button mock={lacksPersmissionsMock} />
    );
    render(<Component />);

    expect(screen.queryByDataCy("new-project-button")).not.toBeInTheDocument();
  });

  // Flakiness will be addressed in EVG-18333
  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip("when looking at a repo", () => {
    it("clicking the button opens the new project modal", async () => {
      const { Component } = RenderFakeToastContext(
        <Button projectType={ProjectType.Repo} />
      );
      render(<Component />);

      await screen.findByText("New Project");
      userEvent.click(screen.queryByDataCy("new-project-button"));
      await waitFor(() =>
        expect(screen.queryByDataCy("create-project-modal")).toBeVisible()
      );
      expect(screen.queryByDataCy("new-project-menu")).not.toBeInTheDocument();
    });
  });

  describe("when looking at a project", () => {
    it("clicking the button opens the menu", async () => {
      const { Component } = RenderFakeToastContext(<Button />);
      render(<Component />);

      await screen.findByText("New Project");
      userEvent.click(screen.queryByDataCy("new-project-button"));
      await waitFor(() =>
        expect(screen.queryByDataCy("new-project-menu")).toBeVisible()
      );
    });

    // Flakiness will be addressed in EVG-18333
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip("clicking the 'Create New Project' button opens the create project modal and closes the menu", async () => {
      const { Component } = RenderFakeToastContext(<Button />);
      render(<Component />);

      await screen.findByText("New Project");
      userEvent.click(screen.queryByDataCy("new-project-button"));
      await waitFor(() =>
        expect(screen.queryByDataCy("new-project-menu")).toBeVisible()
      );
      userEvent.click(screen.queryByDataCy("create-project-button"));
      await waitFor(() =>
        expect(screen.queryByDataCy("create-project-modal")).toBeVisible()
      );
      expect(screen.queryByDataCy("new-project-menu")).not.toBeInTheDocument();
    });

    // Flakiness will be addressed in EVG-18333
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip("clicking the 'Duplicate Project' button opens the create project modal and closes the menu", async () => {
      const { Component } = RenderFakeToastContext(<Button />);
      render(<Component />);

      await screen.findByText("New Project");
      userEvent.click(screen.queryByDataCy("new-project-button"));
      await waitFor(() =>
        expect(screen.queryByDataCy("new-project-menu")).toBeVisible()
      );
      userEvent.click(screen.queryByDataCy("copy-project-button"));
      await waitFor(() =>
        expect(screen.queryByDataCy("copy-project-modal")).toBeVisible()
      );
      expect(screen.queryByDataCy("new-project-menu")).not.toBeInTheDocument();
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
