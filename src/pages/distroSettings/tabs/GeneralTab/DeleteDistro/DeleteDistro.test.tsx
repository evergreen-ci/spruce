import { MockedProvider } from "@apollo/client/testing";
import { FieldProps } from "@rjsf/core";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  DeleteDistroMutation,
  DeleteDistroMutationVariables,
  UserDistroSettingsPermissionsQuery,
  UserDistroSettingsPermissionsQueryVariables,
} from "gql/generated/types";
import { DELETE_DISTRO } from "gql/mutations";
import { USER_DISTRO_SETTINGS_PERMISSIONS } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { DeleteDistro } from ".";

const Field = ({ isAdmin = false }: { isAdmin?: boolean }) => (
  <MockedProvider
    mocks={[deleteDistroMock, isAdmin ? isAdminMock : notAdminMock]}
  >
    <DeleteDistro {...({} as unknown as FieldProps)} />
  </MockedProvider>
);

describe("deleteDistro", () => {
  it("button is disabled if not admin", async () => {
    const { Component } = RenderFakeToastContext(<Field />);
    render(<Component />, {
      path: "/distro/:distroId/settings/general",
      route: `/distro/${distroToDelete}/settings/general`,
    });
    const deleteButton = screen.getByDataCy("delete-distro-button");
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveAttribute("aria-disabled", "true");
    userEvent.hover(deleteButton);
    await waitFor(() => {
      expect(screen.getByDataCy("delete-button-tooltip")).toBeVisible();
    });
  });

  it("button is enabled if admin", async () => {
    const { Component } = RenderFakeToastContext(<Field isAdmin />);
    render(<Component />, {
      path: "/distro/:distroId/settings/general",
      route: "/distro/localhost/settings/general",
    });
    const deleteButton = screen.getByDataCy("delete-distro-button");
    await waitFor(() => {
      expect(deleteButton).toHaveAttribute("aria-disabled", "false");
    });
  });

  it("admin can successfully delete a distro", async () => {
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Field isAdmin />
    );
    render(<Component />, {
      path: "/distro/:distroId/settings/general",
      route: `/distro/${distroToDelete}/settings/general`,
    });
    const deleteButton = screen.getByDataCy("delete-distro-button");
    await waitFor(() => {
      expect(deleteButton).toHaveAttribute("aria-disabled", "false");
    });

    userEvent.click(deleteButton);
    expect(screen.getByDataCy("delete-distro-modal")).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", {
      name: "Delete",
    });
    expect(confirmButton).toHaveAttribute("aria-disabled", "false");

    userEvent.click(confirmButton);
    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledWith(
        `The distro “${distroToDelete}” was deleted. Future visits to this page will result in an error.`
      );
    });
  });
});

const distroToDelete = "localhost";

const deleteDistroMock: ApolloMock<
  DeleteDistroMutation,
  DeleteDistroMutationVariables
> = {
  request: {
    query: DELETE_DISTRO,
    variables: {
      distroId: distroToDelete,
    },
  },
  result: {
    data: {
      deleteDistro: {
        __typename: "DeleteDistroPayload",
        deletedDistroId: "localhost",
      },
    },
  },
};

const isAdminMock: ApolloMock<
  UserDistroSettingsPermissionsQuery,
  UserDistroSettingsPermissionsQueryVariables
> = {
  request: {
    query: USER_DISTRO_SETTINGS_PERMISSIONS,
    variables: {
      distroId: distroToDelete,
    },
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "me",
        permissions: {
          __typename: "Permissions",
          canCreateDistro: true,
          distroPermissions: {
            __typename: "DistroPermissions",
            admin: true,
          },
        },
      },
    },
  },
};

const notAdminMock: ApolloMock<
  UserDistroSettingsPermissionsQuery,
  UserDistroSettingsPermissionsQueryVariables
> = {
  request: {
    query: USER_DISTRO_SETTINGS_PERMISSIONS,
    variables: {
      distroId: distroToDelete,
    },
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "me",
        permissions: {
          __typename: "Permissions",
          canCreateDistro: false,
          distroPermissions: {
            __typename: "DistroPermissions",
            admin: false,
          },
        },
      },
    },
  },
};
