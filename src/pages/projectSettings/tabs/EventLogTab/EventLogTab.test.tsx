import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  ProjectEventLogsQuery,
  ProjectEventLogsQueryVariables,
  ProjectHealthView,
  MergeQueue,
} from "gql/generated/types";
import { GET_PROJECT_EVENT_LOGS } from "gql/queries";
import { renderWithRouterMatch as render, screen, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { ProjectType } from "../utils";
import { EventLogTab } from "./EventLogTab";

const Wrapper = ({ children, mocks = [] }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("loading events", () => {
  it("does not show a load more button when the event count is less than the limit", async () => {
    const { Component } = RenderFakeToastContext(
      <Wrapper mocks={[mock()]}>
        <EventLogTab projectType={ProjectType.AttachedProject} />
      </Wrapper>
    );
    render(<Component />, {
      path: "/project/:projectIdentifier/settings",
      route: "/project/spruce/settings",
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("event-log-card")).toHaveLength(1);
    });
    expect(screen.queryByDataCy("load-more-button")).not.toBeInTheDocument();
    expect(screen.getByText("No more events to show.")).toBeInTheDocument();
  });

  it("shows a 'Load more' button when the number of events loaded meets the limit", async () => {
    const limit = 1;
    const { Component } = RenderFakeToastContext(
      <Wrapper mocks={[mock(limit)]}>
        <EventLogTab projectType={ProjectType.AttachedProject} limit={limit} />
      </Wrapper>
    );
    render(<Component />, {
      path: "/project/:projectIdentifier/settings",
      route: "/project/spruce/settings",
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("event-log-card")).toHaveLength(1);
    });
    expect(screen.getByDataCy("load-more-button")).toBeInTheDocument();
    expect(
      screen.queryByText("No more events to show.")
    ).not.toBeInTheDocument();
  });
});

const mock = (
  limit: number = 15
): ApolloMock<ProjectEventLogsQuery, ProjectEventLogsQueryVariables> => ({
  request: {
    query: GET_PROJECT_EVENT_LOGS,
    variables: {
      identifier: "spruce",
      limit,
    },
  },
  result: {
    data: projectEventsQuery,
  },
});

const projectEventsQuery: ProjectEventLogsQuery = {
  projectEvents: {
    __typename: "ProjectEvents",
    count: 1,
    eventLogEntries: [
      {
        __typename: "ProjectEventLogEntry",
        after: {
          __typename: "ProjectEventSettings",
          aliases: [],
          githubWebhooksEnabled: true,
          projectRef: {
            __typename: "Project",
            admins: ["arstastr", "asrt", "ata", "oienrsat"],
            banner: null,
            batchTime: 30,
            branch: "main",
            buildBaronSettings: {
              __typename: "BuildBaronSettings",
              ticketCreateProject: "EVG",
              ticketSearchProjects: ["EVG"],
            },
            commitQueue: {
              __typename: "CommitQueueParams",
              enabled: true,
              mergeMethod: "squash",
              mergeQueue: MergeQueue.Github,
              message: "",
            },
            deactivatePrevious: true,
            disabledStatsCache: false,
            dispatchingDisabled: false,
            displayName: "Spruce",
            enabled: true,
            externalLinks: [],
            gitTagAuthorizedTeams: ["evergreen"],
            gitTagAuthorizedUsers: ["sartaie"],
            gitTagVersionsEnabled: true,
            githubChecksEnabled: false,
            githubTriggerAliases: [],
            hidden: false,
            identifier: "spruce",
            manualPrTestingEnabled: false,
            notifyOnBuildFailure: false,
            owner: "evergreen-ci",
            parsleyFilters: [],
            patchTriggerAliases: [],
            patchingDisabled: false,
            perfEnabled: false,
            periodicBuilds: [],
            prTestingEnabled: true,
            projectHealthView: ProjectHealthView.Failed,
            remotePath: ".srat.yml",
            repo: "spruce",
            repoRefId: "arst",
            repotrackerDisabled: false,
            restricted: false,
            spawnHostScriptPath: "",
            stepbackDisabled: null,
            taskAnnotationSettings: {
              __typename: "TaskAnnotationSettings",
              fileTicketWebhook: {
                __typename: "Webhook",
                endpoint: "",
                secret: "",
              },
              jiraCustomFields: null,
            },
            taskSync: {
              __typename: "TaskSyncOptions",
              configEnabled: false,
              patchEnabled: false,
            },
            tracksPushEvents: true,
            triggers: [],
            versionControlEnabled: false,
            workstationConfig: {
              __typename: "WorkstationConfig",
              gitClone: false,
              setupCommands: null,
            },
          },
          subscriptions: [],
          vars: {
            __typename: "ProjectVars",
            adminOnlyVars: [],
            privateVars: [],
            vars: {},
          },
        },
        before: {
          __typename: "ProjectEventSettings",
          aliases: [],
          githubWebhooksEnabled: true,
          projectRef: {
            __typename: "Project",
            admins: ["rsatsrt"],
            banner: null,
            batchTime: 60,
            branch: "main",
            buildBaronSettings: {
              __typename: "BuildBaronSettings",
              ticketCreateProject: "EVG",
              ticketSearchProjects: ["EVG"],
            },
            commitQueue: {
              __typename: "CommitQueueParams",
              enabled: true,
              mergeMethod: "squash",
              mergeQueue: MergeQueue.Evergreen,
              message: "",
            },
            deactivatePrevious: true,
            disabledStatsCache: false,
            dispatchingDisabled: false,
            displayName: "Spruce",
            enabled: true,
            externalLinks: [],
            gitTagAuthorizedTeams: ["arst"],
            gitTagAuthorizedUsers: ["tarst.arstarts"],
            gitTagVersionsEnabled: true,
            githubChecksEnabled: false,
            githubTriggerAliases: [],
            hidden: false,
            identifier: "spruce",
            manualPrTestingEnabled: false,
            notifyOnBuildFailure: false,
            owner: "evergreen-ci",
            parsleyFilters: [],
            patchTriggerAliases: [],
            patchingDisabled: false,
            perfEnabled: false,
            periodicBuilds: [],
            prTestingEnabled: true,
            projectHealthView: ProjectHealthView.All,
            remotePath: ".evergreen.yml",
            repo: "spruce",
            repoRefId: "6352b7f70ae6065419d5a499",
            repotrackerDisabled: false,
            restricted: false,
            spawnHostScriptPath: "",
            stepbackDisabled: null,
            taskAnnotationSettings: {
              __typename: "TaskAnnotationSettings",
              fileTicketWebhook: {
                __typename: "Webhook",
                endpoint: "",
                secret: "",
              },
              jiraCustomFields: null,
            },
            taskSync: {
              __typename: "TaskSyncOptions",
              configEnabled: false,
              patchEnabled: false,
            },
            tracksPushEvents: true,
            triggers: [],
            versionControlEnabled: false,
            workstationConfig: {
              __typename: "WorkstationConfig",
              gitClone: false,
              setupCommands: null,
            },
          },
          subscriptions: [],
          vars: {
            __typename: "ProjectVars",
            adminOnlyVars: [],
            privateVars: [],
            vars: {
              node_path: "/opt/axstarst$PATH",
            },
          },
        },
        timestamp: new Date("2023-01-04T18:32:56.046Z"),
        user: "art.oeinf",
      },
    ],
  },
};
