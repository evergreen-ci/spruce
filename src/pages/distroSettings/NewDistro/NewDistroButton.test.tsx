import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  UserDistroSettingsPermissionsQuery,
  UserDistroSettingsPermissionsQueryVariables,
} from "gql/generated/types";
import { USER_DISTRO_SETTINGS_PERMISSIONS } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { NewDistroButton } from "./NewDistroButton";

const Button = ({ mock = hasPermissionsMock }: { mock?: MockedResponse }) => (
  <MockedProvider mocks={[mock]}>
    <NewDistroButton />
  </MockedProvider>
);

describe("new distro button", () => {
  it("does not show button when user lacks permissions", async () => {
    const lacksPermissionsMock: ApolloMock<
      UserDistroSettingsPermissionsQuery,
      UserDistroSettingsPermissionsQueryVariables
    > = {
      request: {
        query: USER_DISTRO_SETTINGS_PERMISSIONS,
        variables: { distroId },
      },
      result: {
        data: {
          user: {
            __typename: "User",
            userId: "string",
            permissions: {
              __typename: "Permissions",
              canCreateDistro: false,
              distroPermissions: {
                __typename: "DistroPermissions",
                admin: false,
                edit: false,
              },
            },
          },
        },
      },
    };
    const { Component } = RenderFakeToastContext(
      <Button mock={lacksPermissionsMock} />,
    );
    render(<Component />, {
      path: "/distro/:distroId/settings/general",
      route: `/distro/${distroId}/settings/general`,
    });

    expect(screen.queryByDataCy("new-distro-button")).not.toBeInTheDocument();
  });

  describe("when user has create distro permissions", () => {
    it("clicking the button opens the menu", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(<Button />);
      render(<Component />, {
        path: "/distro/:distroId/settings/general",
        route: `/distro/${distroId}/settings/general`,
      });

      await screen.findByText("New distro");
      await user.click(screen.queryByDataCy("new-distro-button"));
      expect(screen.queryByDataCy("new-distro-menu")).toBeVisible();
    });

    it("clicking the 'Create new distro' button opens the create distro modal and closes the menu", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(<Button />);
      render(<Component />, {
        path: "/distro/:distroId/settings/general",
        route: `/distro/${distroId}/settings/general`,
      });

      await screen.findByText("New distro");
      await user.click(screen.queryByDataCy("new-distro-button"));
      expect(screen.queryByDataCy("new-distro-menu")).toBeVisible();
      await user.click(screen.queryByDataCy("create-distro-button"));
      await waitFor(() => {
        expect(screen.queryByDataCy("create-distro-modal")).toBeVisible();
      });
      expect(screen.queryByDataCy("new-distro-menu")).not.toBeInTheDocument();
    });

    it("clicking the 'Copy distro' button opens the create distro modal and closes the menu", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(<Button />);
      render(<Component />, {
        path: "/distro/:distroId/settings/general",
        route: `/distro/${distroId}/settings/general`,
      });

      await screen.findByText("New distro");
      await user.click(screen.queryByDataCy("new-distro-button"));
      expect(screen.queryByDataCy("new-distro-menu")).toBeVisible();
      await user.click(screen.queryByDataCy("copy-distro-button"));
      await waitFor(() => {
        expect(screen.queryByDataCy("copy-distro-modal")).toBeVisible();
      });
      expect(screen.queryByDataCy("new-distro-menu")).not.toBeInTheDocument();
    });
  });
});

const distroId = "localhost";

const hasPermissionsMock: ApolloMock<
  UserDistroSettingsPermissionsQuery,
  UserDistroSettingsPermissionsQueryVariables
> = {
  request: {
    query: USER_DISTRO_SETTINGS_PERMISSIONS,
    variables: { distroId },
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "string",
        permissions: {
          __typename: "Permissions",
          canCreateDistro: true,
          distroPermissions: {
            __typename: "DistroPermissions",
            admin: true,
            edit: true,
          },
        },
      },
    },
  },
};
