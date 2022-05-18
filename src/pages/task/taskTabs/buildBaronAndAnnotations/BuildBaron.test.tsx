import { MockedProvider } from "@apollo/client/testing";
import MatchMediaMock from "jest-matchmedia-mock";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import {
  FILE_JIRA_TICKET,
  MOVE_ANNOTATION,
  REMOVE_ANNOTATION,
} from "gql/mutations";
import {
  GET_BUILD_BARON,
  GET_SPRUCE_CONFIG,
  GET_USER,
  GET_CREATED_TICKETS,
} from "gql/queries";
import {
  renderWithRouterMatch as render,
  fireEvent,
  waitFor,
} from "test_utils";
import { AnnotationTicketsTable } from "./AnnotationTicketsTable";
import BuildBaron from "./BuildBaron";

const taskId =
  "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41";
const execution = 1;

let matchMedia;
describe("buildBaron", () => {
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
        <BuildBaron
          annotation={null}
          bbData={buildBaronQuery}
          error={null}
          taskId={taskId}
          execution={execution}
          loading={false}
          userCanModify
        />
      </MockedProvider>
    );

    const { queryByDataCy } = render(<Component />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
    });

    expect(queryByDataCy("bb-content")).toBeInTheDocument();
    expect(queryByDataCy("bb-error")).toBeNull();
  });

  it("clicking on file a new ticket dispatches a toast", async () => {
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={buildBaronMocks} addTypename={false}>
        <BuildBaron
          annotation={null}
          bbData={buildBaronQuery}
          error={null}
          taskId={taskId}
          execution={execution}
          loading={false}
          userCanModify
        />
      </MockedProvider>
    );
    const { queryByDataCy, getByText } = render(<Component />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
    });
    fireEvent.click(queryByDataCy("file-ticket-button"));
    expect(getByText("File Ticket")).toBeInTheDocument();
    fireEvent.click(getByText("File Ticket"));

    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledWith(
        "Ticket successfully created for this task."
      );
    });
  });

  it("the correct JiraTicket rows are rendered in the component", () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={buildBaronMocks} addTypename={false}>
        <BuildBaron
          annotation={null}
          bbData={buildBaronQuery}
          error={null}
          taskId={taskId}
          execution={execution}
          loading={false}
          userCanModify
        />
      </MockedProvider>
    );
    const { queryAllByDataCy, queryByDataCy } = render(<Component />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
    });

    expect(queryAllByDataCy("jira-ticket-row")).toHaveLength(3);

    expect(queryByDataCy("EVG-12345")).toBeInTheDocument();
    expect(queryByDataCy("EVG-12346")).toBeInTheDocument();
    expect(queryByDataCy("EVG-12347")).toBeInTheDocument();

    expect(queryByDataCy("EVG-12345-badge")).toHaveTextContent("Resolved");
    expect(queryByDataCy("EVG-12345-metadata")).toHaveTextContent(
      "Created: Sep 23, 2020 Updated: Sep 23, 2020 Unassigned"
    );

    expect(queryByDataCy("EVG-12346-badge")).toHaveTextContent("Closed");
    expect(queryByDataCy("EVG-12346-metadata")).toHaveTextContent(
      "Created: Sep 18, 2020 Updated: Sep 18, 2020 Assignee: Some Name"
    );

    expect(queryByDataCy("EVG-12347-badge")).toHaveTextContent("Open");
    expect(queryByDataCy("EVG-12347-metadata")).toHaveTextContent(
      "Created: Sep 18, 2020 Updated: Sep 18, 2020 Assignee: Backlog - Evergreen Team"
    );
  });
});

describe("annotationTicketsTable", () => {
  it("should still display the JIRA issue link and key while waiting for data to load", () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={ticketsTableMocks} addTypename={false}>
        <AnnotationTicketsTable
          jiraIssues={[
            {
              issueKey: "EVG-1234567",
              url: "https://fake-url/EVG-1234567",
            },
          ]}
          isIssue
          taskId={taskId}
          execution={execution}
          userCanModify={false}
          selectedRowKey=""
          setSelectedRowKey={() => {}}
          loading
        />
      </MockedProvider>
    );
    const { getByText } = render(<Component />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
    });
    expect(getByText("EVG-1234567")).toBeInTheDocument();
    expect(getByText("EVG-1234567")).toHaveAttribute(
      "href",
      "https://fake-url/EVG-1234567"
    );
  });
});

const buildBaronQuery = {
  buildBaron: {
    buildBaronConfigured: true,
    bbTicketCreationDefined: true,
    searchReturnInfo: {
      issues: [
        {
          key: "EVG-12345",
          fields: {
            summary: "This is a random Jira ticket title 1",
            assigneeDisplayName: null,
            resolutionName: "Declined",
            created: "2020-09-23T15:31:33.000+0000",
            updated: "2020-09-23T15:33:02.000+0000",
            status: {
              id: "5",
              name: "Resolved",
            },
          },
        },
        {
          key: "EVG-12346",
          fields: {
            summary: "This is a random Jira ticket title 2",
            assigneeDisplayName: "Some Name",
            resolutionName: "Declined",
            created: "2020-09-18T16:58:32.000+0000",
            updated: "2020-09-18T19:56:42.000+0000",
            status: {
              id: "6",
              name: "Closed",
            },
          },
        },
        {
          key: "EVG-12347",
          fields: {
            summary: "This is a random Jira ticket title 3",
            assigneeDisplayName: "Backlog - Evergreen Team",
            resolutionName: "Declined",
            created: "2020-09-18T17:04:06.000+0000",
            updated: "2020-09-18T19:56:29.000+0000",
            status: {
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

const buildBaronMocks = [
  {
    request: {
      query: GET_BUILD_BARON,
      variables: {
        taskId,
        execution,
      },
    },
    result: {
      data: buildBaronQuery,
    },
  },
  {
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
  },
  {
    request: {
      query: GET_CREATED_TICKETS,
      variables: {
        taskId,
      },
    },
    result: {
      data: {
        bbGetCreatedTickets: [],
      },
    },
  },
  {
    request: {
      query: GET_SPRUCE_CONFIG,
    },
    result: {
      data: {
        spruceConfig: {
          bannerTheme: "information",
          banner: "",
          ui: {
            userVoice: "",
            defaultProject: "evergreen",
          },
          jira: {
            host: "jira.mongodb.org",
          },
        },
      },
    },
  },
  {
    request: {
      query: GET_USER,
    },
    result: {
      data: {
        userId: "mohamed.khelif",
        displayName: "Mohamed Khelif",
      },
    },
  },
];

const apiIssue = {
  url: "https://fake-url/EVG-1234567",
  issueKey: "EVG-1234567",
};

const ticketsTableMocks = [
  {
    request: {
      query: MOVE_ANNOTATION,
      variables: { taskId, execution, apiIssue, isIssue: true },
    },
    result: { data: { moveAnnotationIssue: true } },
  },
  {
    request: {
      query: REMOVE_ANNOTATION,
      variables: { taskId, execution, apiIssue, isIssue: true },
    },
    result: { data: { removeAnnotationIssue: true } },
  },
  {
    request: {
      query: GET_USER,
    },
    result: {
      data: {
        userId: "minna.kt",
        displayName: "Minna K-T",
      },
    },
  },
];
