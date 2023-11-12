import { MockedProvider } from "@apollo/client/testing";
import { RepotrackerBanner } from "components/Banners";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables,
  RepotrackerErrorQuery,
  RepotrackerErrorQueryVariables,
  SetLastRevisionMutation,
  SetLastRevisionMutationVariables,
} from "gql/generated/types";
import { SET_LAST_REVISION } from "gql/mutations";
import {
  USER_PROJECT_SETTINGS_PERMISSIONS,
  REPOTRACKER_ERROR,
} from "gql/queries";
import { render, screen, userEvent, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";

describe("repotracker banner", () => {
  describe("repotracker error does not exist", () => {
    it("does not render banner", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[projectNoError]}>
          <RepotrackerBanner projectIdentifier="evergreen" />
        </MockedProvider>
      );
      render(<Component />);
      await waitFor(() => {
        expect(screen.queryByDataCy("repotracker-error-banner")).toBeNull();
      });
    });
  });

  describe("repotracker error exists", () => {
    it("renders a banner", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[projectWithError, adminUser]}>
          <RepotrackerBanner projectIdentifier="evergreen" />
        </MockedProvider>
      );
      render(<Component />);
      await waitFor(() => {
        expect(screen.queryByDataCy("repotracker-error-banner")).toBeVisible();
      });
    });

    it("does not render modal trigger if user is not admin", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[projectWithError, basicUser]}>
          <RepotrackerBanner projectIdentifier="evergreen" />
        </MockedProvider>
      );
      render(<Component />);
      await waitFor(() => {
        expect(screen.queryByDataCy("repotracker-error-banner")).toBeVisible();
      });
      expect(screen.queryByDataCy("repotracker-error-trigger")).toBeNull();
    });

    it("renders modal trigger if user is admin", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[projectWithError, adminUser]}>
          <RepotrackerBanner projectIdentifier="evergreen" />
        </MockedProvider>
      );
      render(<Component />);
      await waitFor(() => {
        expect(screen.queryByDataCy("repotracker-error-banner")).toBeVisible();
      });
      expect(screen.queryByDataCy("repotracker-error-trigger")).toBeVisible();
    });

    it("can submit new base revision via modal", async () => {
      const user = userEvent.setup();
      const { Component, dispatchToast } = RenderFakeToastContext(
        <MockedProvider mocks={[projectWithError, adminUser, setLastRevision]}>
          <RepotrackerBanner projectIdentifier="evergreen" />
        </MockedProvider>
      );
      render(<Component />);
      await waitFor(() => {
        expect(screen.queryByDataCy("repotracker-error-banner")).toBeVisible();
      });
      expect(screen.queryByDataCy("repotracker-error-trigger")).toBeVisible();

      // Open modal.
      await user.click(screen.queryByDataCy("repotracker-error-trigger"));
      await waitFor(() => {
        expect(screen.queryByDataCy("repotracker-error-modal")).toBeVisible();
      });

      // Submit new base revision.
      const confirmButton = screen.getByRole("button", { name: "Confirm" });
      expect(confirmButton).toHaveAttribute("aria-disabled", "true");
      await user.type(
        screen.getByLabelText("Base Revision"),
        "new_base_revision"
      );
      expect(confirmButton).toHaveAttribute("aria-disabled", "false");
      await user.click(confirmButton);
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    });
  });
});

const projectNoError: ApolloMock<
  RepotrackerErrorQuery,
  RepotrackerErrorQueryVariables
> = {
  request: {
    query: REPOTRACKER_ERROR,
    variables: {
      projectIdentifier: "evergreen",
    },
  },
  result: {
    data: {
      project: {
        __typename: "Project",
        id: "evergreen",
        branch: "",
        repotrackerError: null,
      },
    },
  },
};

const projectWithError: ApolloMock<
  RepotrackerErrorQuery,
  RepotrackerErrorQueryVariables
> = {
  request: {
    query: REPOTRACKER_ERROR,
    variables: {
      projectIdentifier: "evergreen",
    },
  },
  result: {
    data: {
      project: {
        __typename: "Project",
        id: "evergreen",
        branch: "main",
        repotrackerError: {
          __typename: "RepotrackerError",
          exists: true,
          invalidRevision: "invalid_revision",
        },
      },
    },
  },
};

const adminUser: ApolloMock<
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables
> = {
  request: {
    query: USER_PROJECT_SETTINGS_PERMISSIONS,
    variables: { projectIdentifier: "evergreen" },
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "admin",
        permissions: {
          __typename: "Permissions",
          canCreateProject: true,
          projectPermissions: {
            __typename: "ProjectPermissions",
            admin: true,
          },
        },
      },
    },
  },
};

const basicUser: ApolloMock<
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables
> = {
  request: {
    query: USER_PROJECT_SETTINGS_PERMISSIONS,
    variables: { projectIdentifier: "evergreen" },
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "basic",
        permissions: {
          __typename: "Permissions",
          canCreateProject: false,
          projectPermissions: {
            __typename: "ProjectPermissions",
            admin: false,
          },
        },
      },
    },
  },
};

const setLastRevision: ApolloMock<
  SetLastRevisionMutation,
  SetLastRevisionMutationVariables
> = {
  request: {
    query: SET_LAST_REVISION,
    variables: {
      projectIdentifier: "evergreen",
      revision: "new_base_revision",
    },
  },
  result: {
    data: {
      setLastRevision: {
        __typename: "SetLastRevisionPayload",
        mergeBaseRevision: "new_base_revision",
      },
    },
  },
};
