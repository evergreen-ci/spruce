import MatchMediaMock from "jest-matchmedia-mock";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  AnnotationEventDataQuery,
  AnnotationEventDataQueryVariables,
  BuildBaronCreateTicketMutation,
  BuildBaronCreateTicketMutationVariables,
  BuildBaronQuery,
  BuildBaronQueryVariables,
  CreatedTicketsQuery,
  CreatedTicketsQueryVariables,
  CustomCreatedIssuesQuery,
  CustomCreatedIssuesQueryVariables,
  SuspectedIssuesQuery,
  SuspectedIssuesQueryVariables,
} from "gql/generated/types";
import {
  getSpruceConfigMock,
  getUserSettingsMock,
} from "gql/mocks/getSpruceConfig";
import { getUserMock } from "gql/mocks/getUser";
import { FILE_JIRA_TICKET } from "gql/mutations";
import {
  ANNOTATION_EVENT_DATA,
  BUILD_BARON,
  CREATED_TICKETS,
  JIRA_CUSTOM_CREATED_ISSUES,
  JIRA_ISSUES,
  JIRA_SUSPECTED_ISSUES,
} from "gql/queries";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import { MockedProvider } from "test_utils/graphql";
import { ApolloMock } from "types/gql";
import BuildBaronContent from "./BuildBaronContent";

const taskId =
  "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41";
const execution = 0;

let matchMedia;
describe("buildBaronContent", () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
    jest.restoreAllMocks();
  });

  it("the BuildBaron component renders without crashing.", () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={buildBaronMocks} addTypename={false}>
        <BuildBaronContent
          annotation={null}
          taskId={taskId}
          execution={execution}
          userCanModify
          bbData={buildBaronQuery.buildBaron}
          loading={false}
        />
      </MockedProvider>
    );

    render(<Component />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
    });
    expect(screen.getByDataCy("bb-content")).toBeInTheDocument();
    expect(screen.queryByDataCy("bb-error")).toBeNull();
  });

  it("clicking on file a new ticket dispatches a toast", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={buildBaronMocks} addTypename={false}>
        <BuildBaronContent
          annotation={null}
          taskId={taskId}
          execution={execution}
          userCanModify
          loading={false}
          bbData={buildBaronQuery.buildBaron}
        />
      </MockedProvider>
    );
    render(<Component />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
    });
    await user.click(screen.queryByDataCy("file-ticket-button"));
    expect(screen.getByDataCy("file-ticket-popconfirm")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(dispatchToast.success).toHaveBeenCalledWith(
      "Successfully requested ticket"
    );
  });

  it("the correct JiraTicket rows are rendered in the component", () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={buildBaronMocks} addTypename={false}>
        <BuildBaronContent
          annotation={null}
          taskId={taskId}
          execution={execution}
          userCanModify
          bbData={buildBaronQuery.buildBaron}
          loading={false}
        />
      </MockedProvider>
    );
    render(<Component />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
    });

    expect(screen.queryAllByDataCy("jira-ticket-row")).toHaveLength(3);

    expect(screen.getByDataCy("EVG-12345")).toBeInTheDocument();
    expect(screen.getByDataCy("EVG-12346")).toBeInTheDocument();
    expect(screen.getByDataCy("EVG-12347")).toBeInTheDocument();

    expect(screen.queryByDataCy("EVG-12345-badge")).toHaveTextContent(
      "Resolved"
    );
    expect(screen.queryByDataCy("EVG-12345-metadata")).toHaveTextContent(
      "Created: Sep 23, 2020Updated: Sep 23, 2020Unassigned"
    );

    expect(screen.queryByDataCy("EVG-12346-badge")).toHaveTextContent("Closed");
    expect(screen.queryByDataCy("EVG-12346-metadata")).toHaveTextContent(
      "Created: Sep 18, 2020Updated: Sep 18, 2020Assignee: Some Name"
    );

    expect(screen.queryByDataCy("EVG-12347-badge")).toHaveTextContent("Open");
    expect(screen.queryByDataCy("EVG-12347-metadata")).toHaveTextContent(
      "Created: Sep 18, 2020Updated: Sep 18, 2020Assignee: Backlog - Evergreen Team"
    );
  });
});

const buildBaronQuery: BuildBaronQuery = {
  buildBaron: {
    __typename: "BuildBaron",
    buildBaronConfigured: true,
    bbTicketCreationDefined: true,
    searchReturnInfo: {
      __typename: "SearchReturnInfo",
      issues: [
        {
          __typename: "JiraTicket",
          key: "EVG-12345",
          fields: {
            __typename: "TicketFields",
            summary: "This is a random Jira ticket title 1",
            assigneeDisplayName: null,
            resolutionName: "Declined",
            created: "2020-09-23T15:31:33.000+0000",
            updated: "2020-09-23T15:33:02.000+0000",
            status: {
              __typename: "JiraStatus",
              id: "5",
              name: "Resolved",
            },
          },
        },
        {
          __typename: "JiraTicket",
          key: "EVG-12346",
          fields: {
            __typename: "TicketFields",
            summary: "This is a random Jira ticket title 2",
            assigneeDisplayName: "Some Name",
            resolutionName: "Declined",
            created: "2020-09-18T16:58:32.000+0000",
            updated: "2020-09-18T19:56:42.000+0000",
            status: {
              __typename: "JiraStatus",
              id: "6",
              name: "Closed",
            },
          },
        },
        {
          __typename: "JiraTicket",
          key: "EVG-12347",
          fields: {
            __typename: "TicketFields",
            summary: "This is a random Jira ticket title 3",
            assigneeDisplayName: "Backlog - Evergreen Team",
            resolutionName: "Declined",
            created: "2020-09-18T17:04:06.000+0000",
            updated: "2020-09-18T19:56:29.000+0000",
            status: {
              __typename: "JiraStatus",
              id: "1",
              name: "Open",
            },
          },
        },
      ],
      search:
        '(project in (EVG)) and ( text~"docker\\\\-cleanup" ) order by updatedDate desc',
      source: "JIRA",
      featuresURL: "",
    },
  },
};

const getBuildBaronMock: ApolloMock<BuildBaronQuery, BuildBaronQueryVariables> =
  {
    request: {
      query: BUILD_BARON,
      variables: {
        taskId,
        execution,
      },
    },
    result: {
      data: buildBaronQuery,
    },
  };

const fileJiraTicketMock: ApolloMock<
  BuildBaronCreateTicketMutation,
  BuildBaronCreateTicketMutationVariables
> = {
  request: {
    query: FILE_JIRA_TICKET,
    variables: {
      taskId,
      execution,
    },
  },
  result: {
    data: {
      bbCreateTicket: true,
    },
  },
};
const getJiraTicketsMock: ApolloMock<
  CreatedTicketsQuery,
  CreatedTicketsQueryVariables
> = {
  request: {
    query: CREATED_TICKETS,
    variables: {
      taskId,
    },
  },
  result: {
    data: {
      bbGetCreatedTickets: [],
    },
  },
};

const customCreatedIssuesMock: ApolloMock<
  CustomCreatedIssuesQuery,
  CustomCreatedIssuesQueryVariables
> = {
  request: {
    query: JIRA_CUSTOM_CREATED_ISSUES,
    variables: {
      taskId,
      execution,
    },
  },
  result: {
    data: {
      task: {
        id: taskId,
        execution,
        annotation: null,
      },
    },
  },
};

const suspectedIssueMock: ApolloMock<
  SuspectedIssuesQuery,
  SuspectedIssuesQueryVariables
> = {
  request: {
    query: JIRA_SUSPECTED_ISSUES,
    variables: {
      taskId,
      execution,
    },
  },
  result: {
    data: {
      task: {
        id: taskId,
        execution,
        annotation: null,
      },
    },
  },
};

const jiraIssuesMock: ApolloMock<
  SuspectedIssuesQuery,
  SuspectedIssuesQueryVariables
> = {
  request: {
    query: JIRA_ISSUES,
    variables: {
      taskId,
      execution,
    },
  },
  result: {
    data: {
      task: {
        id: taskId,
        execution,
        annotation: null,
      },
    },
  },
};

const annotationEventDataMock: ApolloMock<
  AnnotationEventDataQuery,
  AnnotationEventDataQueryVariables
> = {
  request: {
    query: ANNOTATION_EVENT_DATA,
    variables: {
      taskId,
      execution,
    },
  },
  result: {
    data: {
      task: {
        id: taskId,
        execution,
        annotation: null,
      },
    },
  },
};

const buildBaronMocks = [
  customCreatedIssuesMock,
  fileJiraTicketMock,
  getBuildBaronMock,
  getJiraTicketsMock,
  getSpruceConfigMock,
  annotationEventDataMock,
  getUserSettingsMock,
  getUserMock,
  jiraIssuesMock,
  suspectedIssueMock,
];
