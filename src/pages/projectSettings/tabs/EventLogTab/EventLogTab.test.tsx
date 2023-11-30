import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  ProjectEventLogsQuery,
  ProjectEventLogsQueryVariables,
  ProjectHealthView,
  MergeQueue,
} from "gql/generated/types";
import { PROJECT_EVENT_LOGS } from "gql/queries";
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
      route: "/project/spruce/settings",
      path: "/project/:projectIdentifier/settings",
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
      route: "/project/spruce/settings",
      path: "/project/:projectIdentifier/settings",
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
    query: PROJECT_EVENT_LOGS,
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
        timestamp: new Date("2023-01-04T18:32:56.046Z"),
        user: "art.oeinf",
        before: {
          __typename: "ProjectEventSettings",
          projectRef: {
            __typename: "Project",
            banner: null,
            externalLinks: [],
            identifier: "spruce",
            repoRefId: "6352b7f70ae6065419d5a499",
            enabled: true,
            owner: "evergreen-ci",
            repo: "spruce",
            branch: "main",
            displayName: "Spruce",
            batchTime: 60,
            remotePath: ".evergreen.yml",
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
            admins: ["rsatsrt"],
            buildBaronSettings: {
              ticketCreateProject: "EVG",
              ticketSearchProjects: ["EVG"],
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
            triggers: [],
            periodicBuilds: [],
            tracksPushEvents: true,
            hidden: false,
            prTestingEnabled: true,
            manualPrTestingEnabled: false,
            githubChecksEnabled: false,
            gitTagVersionsEnabled: true,
            gitTagAuthorizedUsers: ["tarst.arstarts"],
            gitTagAuthorizedTeams: ["arst"],
            commitQueue: {
              enabled: true,
              mergeMethod: "squash",
              mergeQueue: MergeQueue.Evergreen,
              message: "",
              __typename: "CommitQueueParams",
            },
            parsleyFilters: [],
            projectHealthView: ProjectHealthView.All,
          },
          subscriptions: [],
          vars: {
            vars: {
              node_path: "/opt/axstarst$PATH",
            },
            privateVars: [],
            adminOnlyVars: [],
            __typename: "ProjectVars",
          },
          githubWebhooksEnabled: true,
          aliases: [],
        },
        after: {
          __typename: "ProjectEventSettings",
          projectRef: {
            __typename: "Project",
            banner: null,
            externalLinks: [],
            identifier: "spruce",
            repoRefId: "arst",
            enabled: true,
            owner: "evergreen-ci",
            repo: "spruce",
            branch: "main",
            displayName: "Spruce",
            batchTime: 30,
            remotePath: ".srat.yml",
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
            admins: ["arstastr", "asrt", "ata", "oienrsat"],
            buildBaronSettings: {
              ticketCreateProject: "EVG",
              ticketSearchProjects: ["EVG"],
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
            triggers: [],
            periodicBuilds: [],
            tracksPushEvents: true,
            hidden: false,
            prTestingEnabled: true,
            manualPrTestingEnabled: false,
            githubChecksEnabled: false,
            gitTagVersionsEnabled: true,
            gitTagAuthorizedUsers: ["sartaie"],
            gitTagAuthorizedTeams: ["evergreen"],
            commitQueue: {
              enabled: true,
              mergeMethod: "squash",
              mergeQueue: MergeQueue.Github,
              message: "",
              __typename: "CommitQueueParams",
            },
            parsleyFilters: [],
            projectHealthView: ProjectHealthView.Failed,
          },
          subscriptions: [],
          vars: {
            vars: {},
            privateVars: [],
            adminOnlyVars: [],
            __typename: "ProjectVars",
          },
          githubWebhooksEnabled: true,
          aliases: [],
        },
      },
    ],
  },
};
