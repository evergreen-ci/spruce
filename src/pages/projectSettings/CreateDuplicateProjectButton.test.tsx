import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables,
} from "gql/generated/types";
import { USER_PROJECT_SETTINGS_PERMISSIONS } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { CreateDuplicateProjectButton } from "./CreateDuplicateProjectButton";
import { ProjectType } from "./tabs/utils";

const owner = "existing_owner";
const repo = "existing_repo";

const Button = ({
  mock = permissionsMock,
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
    const lacksPermissionsMock: ApolloMock<
      UserProjectSettingsPermissionsQuery,
      UserProjectSettingsPermissionsQueryVariables
    > = {
      request: {
        query: USER_PROJECT_SETTINGS_PERMISSIONS,
        variables: {},
      },
      result: {
        data: {
          user: {
            __typename: "User",
            userId: "string",
            permissions: {
              __typename: "Permissions",
              canCreateProject: false,
            },
          },
        },
      },
    };
    const { Component } = RenderFakeToastContext(
      <Button mock={lacksPermissionsMock} />
    );
    render(<Component />);

    expect(screen.queryByDataCy("new-project-button")).not.toBeInTheDocument();
  });

  describe("when looking at a repo", () => {
    it("clicking the button opens the new project modal", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <Button projectType={ProjectType.Repo} />
      );
      render(<Component />);

      await screen.findByText("New Project");
      await user.click(screen.queryByDataCy("new-project-button"));
      await waitFor(() => {
        expect(screen.queryByDataCy("create-project-modal")).toBeVisible();
      });
      expect(screen.queryByDataCy("new-project-menu")).not.toBeInTheDocument();
    });
  });

  describe("when looking at a project", () => {
    it("clicking the button opens the menu", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(<Button />);
      render(<Component />);

      await screen.findByText("New Project");
      await user.click(screen.queryByDataCy("new-project-button"));
      expect(screen.queryByDataCy("new-project-menu")).toBeVisible();
    });

    it("clicking the 'Create New Project' button opens the create project modal and closes the menu", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(<Button />);
      render(<Component />);

      await screen.findByText("New Project");
      await user.click(screen.queryByDataCy("new-project-button"));
      expect(screen.queryByDataCy("new-project-menu")).toBeVisible();
      await user.click(screen.queryByDataCy("create-project-button"));
      await waitFor(() => {
        expect(screen.queryByDataCy("create-project-modal")).toBeVisible();
      });
      expect(screen.queryByDataCy("new-project-menu")).not.toBeInTheDocument();
    });

    it("clicking the 'Duplicate Project' button opens the create project modal and closes the menu", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(<Button />);
      render(<Component />);

      await screen.findByText("New Project");
      await user.click(screen.queryByDataCy("new-project-button"));
      expect(screen.queryByDataCy("new-project-menu")).toBeVisible();
      await user.click(screen.queryByDataCy("copy-project-button"));
      await waitFor(() => {
        expect(screen.queryByDataCy("copy-project-modal")).toBeVisible();
      });
      expect(screen.queryByDataCy("new-project-menu")).not.toBeInTheDocument();
    });
  });
});

const permissionsMock: ApolloMock<
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables
> = {
  request: {
    query: USER_PROJECT_SETTINGS_PERMISSIONS,
    variables: {},
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "string",
        permissions: {
          __typename: "Permissions",
          canCreateProject: true,
        },
      },
    },
  },
};
