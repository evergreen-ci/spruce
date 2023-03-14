import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  ProjectEventLogsQuery,
  ProjectEventLogsQueryVariables,
} from "gql/generated/types";
import { GET_PROJECT_EVENT_LOGS } from "gql/queries";
import { renderWithRouterMatch as render, screen, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { ProjectType } from "../utils";
import { EventLogTab } from "./EventLogTab";

const Wrapper = ({ children, mocks = [] }) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    {children}
  </MockedProvider>
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
    query: GET_PROJECT_EVENT_LOGS,
    variables: {
      identifier: "spruce",
      limit,
    },
  },
  result: {
    data: {
      projectEvents: {
        count: 1,
        eventLogEntries: [eventLogEntry],
      },
    },
  },
});

const eventLogEntry: ProjectEventLogsQuery["projectEvents"]["eventLogEntries"][0] =
  {
    timestamp: new Date("2023-01-04T18:32:56.046Z"),
    user: "art.oeinf",
    before: {
      projectRef: {
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
        patchingDisabled: false,
        taskSync: {
          configEnabled: false,
          patchEnabled: false,
          __typename: "TaskSyncOptions",
        },
        disabledStatsCache: false,
        __typename: "Project",
        private: false,
        restricted: false,
        admins: ["rsatsrt"],
        buildBaronSettings: {
          ticketCreateProject: "EVG",
          ticketSearchProjects: ["EVG"],
          __typename: "BuildBaronSettings",
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
          message: "",
          __typename: "CommitQueueParams",
        },
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
      __typename: "ProjectEventSettings",
      aliases: [],
    },
    after: {
      projectRef: {
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
        patchingDisabled: false,
        taskSync: {
          configEnabled: false,
          patchEnabled: false,
          __typename: "TaskSyncOptions",
        },
        disabledStatsCache: false,
        __typename: "Project",
        private: false,
        restricted: false,
        admins: ["arstastr", "asrt", "ata", "oienrsat"],
        buildBaronSettings: {
          ticketCreateProject: "EVG",
          ticketSearchProjects: ["EVG"],
          __typename: "BuildBaronSettings",
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
      __typename: "ProjectEventSettings",
      aliases: [],
    },
    __typename: "ProjectEventLogEntry",
  };
