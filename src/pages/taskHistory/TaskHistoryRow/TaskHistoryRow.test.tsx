import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { context } from "components/HistoryTable";
import { HistoryTableReducerState } from "components/HistoryTable/historyTableContextReducer";
import { mainlineCommitData } from "components/HistoryTable/testData";
import { rowType, CommitRowType } from "components/HistoryTable/types";
import {
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables,
} from "gql/generated/types";
import { GET_TASK_TEST_SAMPLE } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { TestStatus } from "types/history";
import TaskHistoryRow from ".";

const { HistoryTableProvider } = context;

const initialState: HistoryTableReducerState = {
  columnLimit: 7,
  columns: [],
  commitCache: new Map(),
  commitCount: 10,
  currentPage: 0,
  historyTableFilters: [],
  loadedCommits: [],
  pageCount: 0,
  processedCommitCount: 0,
  processedCommits: [],
  selectedCommit: null,
  visibleColumns: [],
};

interface wrapperProps {
  children: React.ReactNode;
  mocks?: MockedResponse[];
  state?: Partial<HistoryTableReducerState>;
}

const wrapper: React.VFC<wrapperProps> = ({ children, mocks = [], state }) => (
  <MockedProvider mocks={mocks}>
    <HistoryTableProvider initialState={{ ...initialState, ...state }}>
      {children}
    </HistoryTableProvider>
  </MockedProvider>
);

describe("taskHistoryRow", () => {
  it("renders a row when there is data", () => {
    render(<TaskHistoryRow index={0} data={taskRow} />, {
      path: "/task-history/:projectId/:taskName",
      route: "/task-history/mci/test-thirdparty",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            loadedCommits: [mainlineCommitData.versions[0].version],
            processedCommitCount: 1,
            processedCommits: [taskRow],
            visibleColumns: [
              "lint",
              "race-detector",
              "ubuntu1604",
              "ubuntu1704",
              "ubuntu1804",
              "ubuntu1904",
              "ubuntu2004",
            ],
          },
        }),
    });
    expect(screen.queryAllByDataCy("loading-cell")).toHaveLength(0);
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(7);
  });

  it("amount of cells rendered should correspond to the amount of visibleColumns", () => {
    render(<TaskHistoryRow index={0} data={taskRow} />, {
      path: "/task-history/:projectId/:taskName",
      route: "/task-history/mci/test-thirdparty",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            loadedCommits: [mainlineCommitData.versions[0].version],
            processedCommitCount: 1,
            processedCommits: [taskRow],
            visibleColumns: ["lint", "race-detector", "ubuntu1604"],
          },
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(3);
  });

  it("renders a blank cell when there isn't a matching variant for that column", () => {
    render(<TaskHistoryRow index={0} data={taskRow} />, {
      path: "/task-history/:projectId/:taskName",
      route: "/task-history/mci/test-thirdparty",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            loadedCommits: [mainlineCommitData.versions[0].version],
            processedCommitCount: 1,
            processedCommits: [taskRow],
            visibleColumns: ["lint", "DNE"],
          },
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(screen.queryAllByDataCy("empty-cell")).toHaveLength(1);
  });

  it("should show failing tests when you hover over a failing task cell and there are no filters applied", async () => {
    render(<TaskHistoryRow index={0} data={taskRow} />, {
      path: "/task-history/:projectId/:taskName",
      route: "/task-history/mci/test-thirdparty",
      wrapper: ({ children }) =>
        wrapper({
          children,
          mocks: [noFilterData],
          state: {
            historyTableFilters: [],
            loadedCommits: [mainlineCommitData.versions[0].version],
            processedCommitCount: 1,
            processedCommits: [taskRow],
            visibleColumns: ["ubuntu1804"],
          },
        }),
    });

    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(screen.queryAllByDataCy("empty-cell")).toHaveLength(0);

    await waitFor(() => {
      expect(screen.queryByDataCy("task-cell")).toHaveAttribute(
        "aria-disabled",
        "false"
      );
    });
    await waitFor(() => {
      expect(screen.queryByDataCy("history-table-icon")).toHaveAttribute(
        "aria-disabled",
        "false"
      );
    });

    userEvent.hover(screen.queryByDataCy("history-table-icon"));

    await waitFor(() => {
      expect(screen.queryByText("TestJiraIntegration")).toBeVisible();
    });
  });

  it("should show a matching test label when looking at a task cell with filters applied", async () => {
    render(<TaskHistoryRow index={0} data={taskRow} />, {
      path: "/task-history/:projectId/:taskName",
      route: "/task-history/mci/test-thirdparty",
      wrapper: ({ children }) =>
        wrapper({
          children,
          mocks: [withMatchingFilter],
          state: {
            historyTableFilters: [
              {
                testName: "TestJiraIntegration",
                testStatus: TestStatus.Failed,
              },
            ],
            loadedCommits: [mainlineCommitData.versions[0].version],
            processedCommitCount: 1,
            processedCommits: [taskRow],
            visibleColumns: ["ubuntu1804"],
          },
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(screen.queryAllByDataCy("empty-cell")).toHaveLength(0);

    await waitFor(() => {
      expect(screen.queryByDataCy("task-cell")).toHaveAttribute(
        "aria-disabled",
        "false"
      );
    });
    await waitFor(() => {
      expect(screen.queryByDataCy("history-table-icon")).toHaveAttribute(
        "aria-disabled",
        "false"
      );
    });

    expect(screen.queryByText("1 / 1 Failing Tests")).toBeVisible();
    userEvent.hover(screen.queryByDataCy("history-table-icon"));
    await waitFor(() => {
      expect(screen.queryByText("TestJiraIntegration")).toBeVisible();
    });
  });

  it("should disable a task cell when there are test filters applied and it does not match the task filters", () => {
    render(<TaskHistoryRow index={0} data={taskRow} />, {
      path: "/task-history/:projectId/:taskName",
      route: "/task-history/mci/test-thirdparty",
      wrapper: ({ children }) =>
        wrapper({
          children,
          mocks: [withNonMatchingFilter],
          state: {
            historyTableFilters: [
              { testName: "NotARealTest", testStatus: TestStatus.Failed },
            ],
            loadedCommits: [mainlineCommitData.versions[0].version],
            processedCommitCount: 1,
            processedCommits: [taskRow],
            visibleColumns: ["ubuntu1804"],
          },
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(screen.queryAllByDataCy("empty-cell")).toHaveLength(0);
    expect(screen.queryByDataCy("task-cell")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });
});

const taskRow: CommitRowType = {
  commit: {
    author: "Malik Hadjri",
    buildVariants: [
      {
        displayName: "Lint",
        tasks: [
          {
            displayName: "test-thirdparty",
            execution: 0,
            id: "some_id_1",
            status: "success",
          },
        ],
        variant: "lint",
      },
      {
        displayName: "Race Detector",
        tasks: [
          {
            displayName: "test-thirdparty",
            execution: 0,
            id: "some_id_2",
            status: "success",
          },
        ],
        variant: "race-detector",
      },
      {
        displayName: "Ubuntu 16.04",
        tasks: [
          {
            displayName: "test-thirdparty",
            execution: 0,
            id: "some_id_3",
            status: "success",
          },
        ],
        variant: "ubuntu1604",
      },
      {
        displayName: "Ubuntu 17.04",
        tasks: [
          {
            displayName: "test-thirdparty",
            execution: 0,
            id: "some_id_4",
            status: "success",
          },
        ],
        variant: "ubuntu1704",
      },
      {
        displayName: "Ubuntu 18.04",
        tasks: [
          {
            displayName: "test-thirdparty",
            execution: 0,
            id: "some_id_5",
            status: "failed",
          },
        ],
        variant: "ubuntu1804",
      },
      {
        displayName: "Ubuntu 19.04",
        tasks: [
          {
            displayName: "test-thirdparty",
            execution: 0,
            id: "some_id_6",
            status: "success",
          },
        ],
        variant: "ubuntu1904",
      },
      {
        displayName: "Ubuntu 20.04",
        tasks: [
          {
            displayName: "test-thirdparty",
            execution: 0,
            id: "some_id_7",
            status: "success",
          },
        ],
        variant: "ubuntu2004",
      },
    ],
    createTime: new Date("2021-09-02T14:20:04Z"),
    id: "evergreen_d4cf298cf0b2536fb3bff875775b93a9ceafb75c",
    message:
      "EVG-15213: Reference a project’s configuration when interacting with perf plugin configs (#4992)",
    order: 3399,
    revision: "d4cf298cf0b2536fb3bff875775b93a9ceafb75c",
  },
  date: new Date("2021-09-02T14:20:04Z"),
  selected: false,
  type: rowType.COMMIT,
};

const noFilterData: ApolloMock<
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables
> = {
  request: {
    query: GET_TASK_TEST_SAMPLE,
    variables: {
      filters: [],
      tasks: [
        "some_id_1",
        "some_id_2",
        "some_id_3",
        "some_id_4",
        "some_id_5",
        "some_id_6",
        "some_id_7",
      ],
    },
  },
  result: {
    data: {
      taskTestSample: [
        {
          __typename: "TaskTestResultSample",
          execution: 0,
          matchingFailedTestNames: ["TestJiraIntegration"],
          taskId: "some_id_5",
          totalTestCount: 1,
        },
      ],
    },
  },
};

const withMatchingFilter: ApolloMock<
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables
> = {
  request: {
    query: GET_TASK_TEST_SAMPLE,
    variables: {
      filters: [
        { testName: "TestJiraIntegration", testStatus: TestStatus.Failed },
      ],
      tasks: [
        "some_id_1",
        "some_id_2",
        "some_id_3",
        "some_id_4",
        "some_id_5",
        "some_id_6",
        "some_id_7",
      ],
    },
  },
  result: {
    data: {
      taskTestSample: [
        {
          __typename: "TaskTestResultSample",
          execution: 0,
          matchingFailedTestNames: ["TestJiraIntegration"],
          taskId: "some_id_5",
          totalTestCount: 1,
        },
      ],
    },
  },
};

const withNonMatchingFilter: ApolloMock<
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables
> = {
  request: {
    query: GET_TASK_TEST_SAMPLE,
    variables: {
      filters: [{ testName: "NotARealTest", testStatus: TestStatus.Failed }],
      tasks: [
        "some_id_1",
        "some_id_2",
        "some_id_3",
        "some_id_4",
        "some_id_5",
        "some_id_6",
        "some_id_7",
      ],
    },
  },
  result: {
    data: {
      taskTestSample: [
        {
          __typename: "TaskTestResultSample",
          execution: 0,
          matchingFailedTestNames: [],
          taskId: "some_id_5",
          totalTestCount: 1,
        },
      ],
    },
  },
};
