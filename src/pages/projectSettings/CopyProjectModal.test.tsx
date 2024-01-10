import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { GraphQLError } from "graphql";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  CopyProjectMutation,
  CopyProjectMutationVariables,
  ProjectHealthView,
  ProjectSettingsQuery,
  ProjectSettingsQueryVariables,
  RepoSettingsQuery,
  RepoSettingsQueryVariables,
  MergeQueue,
} from "gql/generated/types";
import { COPY_PROJECT } from "gql/mutations";
import { PROJECT_SETTINGS, REPO_SETTINGS } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { CopyProjectModal } from "./CopyProjectModal";

const newProjectIdentifier = "new_evergreen";
const projectIdToCopy = "evg";

const Modal = ({
  mock = copyProjectMock,
  open = true,
}: {
  mock?: MockedResponse;
  open?: boolean;
}) => (
  <MockedProvider mocks={[mock, projectSettingsMock, repoSettingsMock]}>
    <CopyProjectModal
      handleClose={() => {}}
      id={projectIdToCopy}
      label="evergreen"
      open={open}
    />
  </MockedProvider>
);

describe("copyProjectField", () => {
  it("does not render the modal when open prop is false", () => {
    const { Component } = RenderFakeToastContext(<Modal open={false} />);
    render(<Component />);

    expect(screen.queryByDataCy("copy-project-modal")).not.toBeInTheDocument();
  });

  it("disables the confirm button on initial render and uses the provided label", () => {
    const { Component } = RenderFakeToastContext(<Modal />);
    render(<Component />);

    expect(screen.queryByText("Duplicate “evergreen”")).toBeVisible();

    expect(screen.getByDataCy("copy-project-modal")).toBeInTheDocument();
    const confirmButton = screen.getByRole("button", {
      name: "Duplicate",
    });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");
  });

  it("submits the modal when a project name is provided", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(<Modal />);
    render(<Component />);

    await user.type(
      screen.queryByDataCy("project-name-input"),
      newProjectIdentifier,
    );

    const confirmButton = screen.getByRole("button", {
      name: "Duplicate",
    });
    const requestS3Creds = screen.getByDataCy("request-s3-creds");
    // LeafyGreen checkbox has pointer-events: none so click on the label instead.
    const requestS3CredLabel = screen.getByText(
      "Open a JIRA ticket to request an S3 Bucket from the Build team",
    );
    await user.click(requestS3CredLabel);
    expect(confirmButton).toBeEnabled();
    expect(requestS3Creds).toBeChecked();
    await user.click(requestS3CredLabel);
    expect(requestS3Creds).not.toBeChecked();
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
  });

  it("submits the modal when a project name and id are provided", async () => {
    const mockWithId: ApolloMock<
      CopyProjectMutation,
      CopyProjectMutationVariables
    > = {
      request: {
        query: COPY_PROJECT,
        variables: {
          project: {
            newProjectId: "evg_id",
            newProjectIdentifier,
            projectIdToCopy,
          },
          requestS3Creds: false,
        },
      },
      result: {
        data: {
          copyProject: {
            __typename: "Project",
            id: newProjectIdentifier,
            identifier: newProjectIdentifier,
          },
        },
      },
    };
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Modal mock={mockWithId} />,
    );
    render(<Component />);

    await user.type(screen.queryByDataCy("project-id-input"), "evg_id");
    await user.type(
      screen.queryByDataCy("project-name-input"),
      newProjectIdentifier,
    );

    const confirmButton = screen.getByRole("button", {
      name: "Duplicate",
    });
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
  });

  it("shows a warning toast when an error and data are returned", async () => {
    const mockWithError: ApolloMock<
      CopyProjectMutation,
      CopyProjectMutationVariables
    > = {
      request: {
        query: COPY_PROJECT,
        variables: {
          project: {
            newProjectIdentifier,
            projectIdToCopy,
          },
          requestS3Creds: false,
        },
      },
      result: {
        data: {
          copyProject: {
            __typename: "Project",
            id: newProjectIdentifier,
            identifier: newProjectIdentifier,
          },
        },
        errors: [new GraphQLError("There was an error copying the project")],
      },
    };
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Modal mock={mockWithError} />,
    );
    render(<Component />);

    await user.type(
      screen.queryByDataCy("project-name-input"),
      newProjectIdentifier,
    );

    const confirmButton = screen.getByRole("button", {
      name: "Duplicate",
    });
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
  });

  it("shows a warning toast when no data is returned", async () => {
    const mockWithError: ApolloMock<
      CopyProjectMutation,
      CopyProjectMutationVariables
    > = {
      request: {
        query: COPY_PROJECT,
        variables: {
          project: {
            newProjectIdentifier,
            projectIdToCopy,
          },
          requestS3Creds: false,
        },
      },
      result: {
        errors: [new GraphQLError("There was an error copying the project")],
      },
    };
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Modal mock={mockWithError} />,
    );
    render(<Component />);

    await user.type(
      screen.queryByDataCy("project-name-input"),
      newProjectIdentifier,
    );

    const confirmButton = screen.getByRole("button", {
      name: "Duplicate",
    });
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(1));
  });
});

const copyProjectMock: ApolloMock<
  CopyProjectMutation,
  CopyProjectMutationVariables
> = {
  request: {
    query: COPY_PROJECT,
    variables: {
      project: {
        newProjectIdentifier,
        projectIdToCopy,
      },
      requestS3Creds: false,
    },
  },
  result: {
    data: {
      copyProject: {
        __typename: "Project",
        id: newProjectIdentifier,
        identifier: newProjectIdentifier,
      },
    },
  },
};

const projectSettingsMock: ApolloMock<
  ProjectSettingsQuery,
  ProjectSettingsQueryVariables
> = {
  request: {
    query: PROJECT_SETTINGS,
    variables: {
      identifier: newProjectIdentifier,
    },
  },
  result: {
    data: {
      projectSettings: {
        projectRef: {
          __typename: "Project",
          externalLinks: [],
          id: "asrt",
          identifier: "asrt",
          repoRefId: "arst",
          enabled: true,
          owner: "arst-ci",
          repo: "arst",
          branch: "main",
          displayName: "arst",
          batchTime: 60,
          remotePath: ".arst.yml",
          spawnHostScriptPath: "",
          dispatchingDisabled: false,
          versionControlEnabled: false,
          deactivatePrevious: true,
          repotrackerDisabled: false,
          stepbackDisabled: null,
          stepbackBisect: null,
          patchingDisabled: false,
          taskSync: {
            configEnabled: false,
            patchEnabled: false,
            __typename: "TaskSyncOptions",
          },
          disabledStatsCache: false,
          restricted: false,
          admins: ["admin"],
          buildBaronSettings: {
            ticketCreateProject: "suv",
            ticketSearchProjects: ["suv"],
            __typename: "BuildBaronSettings",
            ticketCreateIssueType: "",
          },
          taskAnnotationSettings: {
            jiraCustomFields: null,
            fileTicketWebhook: {
              endpoint: "",
              secret: "",
              __typename: "Webhook",
            },
            __typename: "TaskAnnotationSettings",
          },
          perfEnabled: false,
          notifyOnBuildFailure: false,
          patchTriggerAliases: [],
          githubTriggerAliases: [],
          workstationConfig: {
            gitClone: false,
            setupCommands: null,
            __typename: "WorkstationConfig",
          },
          triggers: [
            {
              project: "asrt",
              level: "task",
              buildVariantRegex: "",
              taskRegex: "dist",
              status: "success",
              dateCutoff: 1,
              configFile: ".arst.yml",
              alias: "e2e",
              __typename: "TriggerAlias",
            },
          ],
          periodicBuilds: [],
          projectHealthView: ProjectHealthView.Failed,
          prTestingEnabled: true,
          manualPrTestingEnabled: null,
          githubChecksEnabled: false,
          gitTagVersionsEnabled: true,
          gitTagAuthorizedUsers: ["user"],
          gitTagAuthorizedTeams: ["team"],
          commitQueue: {
            enabled: true,
            mergeMethod: "squash",
            mergeQueue: MergeQueue.Evergreen,
            message: "",
            __typename: "CommitQueueParams",
          },
        },
        subscriptions: [],
        vars: {
          vars: {},
          privateVars: [],
          adminOnlyVars: [],
          __typename: "ProjectVars",
        },
        githubWebhooksEnabled: true,
        __typename: "ProjectSettings",
        aliases: [
          {
            id: "arst",
            alias: "arst",
            description: "desc",
            gitTag: "v[0-9]+\\.[0-9]+\\.[0-9]+",
            variant: "ubuntu[0-9]+04",
            task: "arst",
            remotePath: "",
            variantTags: [],
            parameters: [],
            taskTags: [],
            __typename: "ProjectAlias",
          },
        ],
      },
    },
  },
};

const repoSettingsMock: ApolloMock<
  RepoSettingsQuery,
  RepoSettingsQueryVariables
> = {
  request: {
    query: REPO_SETTINGS,
    variables: {
      repoId: newProjectIdentifier,
    },
  },
  result: {
    data: {
      repoSettings: { githubWebhooksEnabled: true, __typename: "RepoSettings" },
    },
  },
};
