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
