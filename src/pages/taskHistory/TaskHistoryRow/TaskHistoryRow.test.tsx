import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { context } from "components/HistoryTable";
import { HistoryTableReducerState } from "components/HistoryTable/historyTableContextReducer";
import { mainlineCommitData } from "components/HistoryTable/testData";
import { rowType, CommitRowType } from "components/HistoryTable/types";
import {
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables,
} from "gql/generated/types";
import { TASK_TEST_SAMPLE } from "gql/queries";
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
  loadedCommits: [],
  processedCommits: [],
  processedCommitCount: 0,
  commitCache: new Map(),
  visibleColumns: [],
  currentPage: 0,
  pageCount: 0,
  columns: [],
  columnLimit: 7,
  historyTableFilters: [],
  commitCount: 10,
  selectedCommit: null,
};

interface wrapperProps {
  children: React.ReactNode;
  mocks?: MockedResponse[];
  state?: Partial<HistoryTableReducerState>;
}

const wrapper: React.FC<wrapperProps> = ({ children, mocks = [], state }) => (
  <MockedProvider mocks={mocks}>
    <HistoryTableProvider initialState={{ ...initialState, ...state }}>
      {children}
    </HistoryTableProvider>
  </MockedProvider>
);

describe("taskHistoryRow", () => {
  it("renders a row when there is data", () => {
    render(<TaskHistoryRow index={0} data={taskRow} />, {
      route: "/task-history/mci/test-thirdparty",
      path: "/task-history/:projectId/:taskName",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            processedCommitCount: 1,
            processedCommits: [taskRow],
            loadedCommits: [mainlineCommitData.versions[0].version],
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
      route: "/task-history/mci/test-thirdparty",
      path: "/task-history/:projectId/:taskName",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            processedCommitCount: 1,
            processedCommits: [taskRow],
            loadedCommits: [mainlineCommitData.versions[0].version],
            visibleColumns: ["lint", "race-detector", "ubuntu1604"],
          },
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(3);
  });

  it("renders a blank cell when there isn't a matching variant for that column", () => {
    render(<TaskHistoryRow index={0} data={taskRow} />, {
      route: "/task-history/mci/test-thirdparty",
      path: "/task-history/:projectId/:taskName",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            processedCommitCount: 1,
            processedCommits: [taskRow],
            loadedCommits: [mainlineCommitData.versions[0].version],
            visibleColumns: ["lint", "DNE"],
          },
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(screen.queryAllByDataCy("empty-cell")).toHaveLength(1);
  });

  it("should show failing tests when you hover over a failing task cell and there are no filters applied", async () => {
    const user = userEvent.setup();
    render(<TaskHistoryRow index={0} data={taskRow} />, {
      route: "/task-history/mci/test-thirdparty",
      path: "/task-history/:projectId/:taskName",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            processedCommitCount: 1,
            processedCommits: [taskRow],
            loadedCommits: [mainlineCommitData.versions[0].version],
            visibleColumns: ["ubuntu1804"],
            historyTableFilters: [],
          },
          mocks: [noFilterData],
        }),
    });

    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(screen.queryAllByDataCy("empty-cell")).toHaveLength(0);

    await waitFor(() => {
      expect(screen.queryByDataCy("task-cell")).toHaveAttribute(
        "aria-disabled",
        "false",
      );
    });
    await waitFor(() => {
      expect(screen.queryByDataCy("history-table-icon")).toHaveAttribute(
        "aria-disabled",
        "false",
      );
    });

    await user.hover(screen.queryByDataCy("history-table-icon"));
    await waitFor(() => {
      expect(screen.queryByText("TestJiraIntegration")).toBeVisible();
    });
  });

  it("should show a matching test label when looking at a task cell with filters applied", async () => {
    const user = userEvent.setup();
    render(<TaskHistoryRow index={0} data={taskRow} />, {
      route: "/task-history/mci/test-thirdparty",
      path: "/task-history/:projectId/:taskName",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            processedCommitCount: 1,
            processedCommits: [taskRow],
            loadedCommits: [mainlineCommitData.versions[0].version],
            visibleColumns: ["ubuntu1804"],
            historyTableFilters: [
              {
                testName: "TestJiraIntegration",
                testStatus: TestStatus.Failed,
              },
            ],
          },
          mocks: [withMatchingFilter],
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(screen.queryAllByDataCy("empty-cell")).toHaveLength(0);

    await waitFor(() => {
      expect(screen.queryByDataCy("task-cell")).toHaveAttribute(
        "aria-disabled",
        "false",
      );
    });
    await waitFor(() => {
      expect(screen.queryByDataCy("history-table-icon")).toHaveAttribute(
        "aria-disabled",
        "false",
      );
    });

    expect(screen.queryByText("1 / 1 Failing Tests")).toBeVisible();
    await user.hover(screen.queryByDataCy("history-table-icon"));
    await waitFor(() => {
      expect(screen.queryByText("TestJiraIntegration")).toBeVisible();
    });
  });

  it("should disable a task cell when there are test filters applied and it does not match the task filters", () => {
    render(<TaskHistoryRow index={0} data={taskRow} />, {
      route: "/task-history/mci/test-thirdparty",
      path: "/task-history/:projectId/:taskName",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            processedCommitCount: 1,
            processedCommits: [taskRow],
            loadedCommits: [mainlineCommitData.versions[0].version],
            visibleColumns: ["ubuntu1804"],
            historyTableFilters: [
              { testName: "NotARealTest", testStatus: TestStatus.Failed },
            ],
          },
          mocks: [withNonMatchingFilter],
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(screen.queryAllByDataCy("empty-cell")).toHaveLength(0);
    expect(screen.queryByDataCy("task-cell")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

const taskRow: CommitRowType = {
  type: rowType.COMMIT,
  selected: false,
  commit: {
    id: "evergreen_d4cf298cf0b2536fb3bff875775b93a9ceafb75c",
    author: "Malik Hadjri",
    createTime: new Date("2021-09-02T14:20:04Z"),
    message:
      "EVG-15213: Reference a project’s configuration when interacting with perf plugin configs (#4992)",
    revision: "d4cf298cf0b2536fb3bff875775b93a9ceafb75c",
    order: 3399,
    buildVariants: [
      {
        displayName: "Lint",
        variant: "lint",
        tasks: [
          {
            displayName: "test-thirdparty",
            id: "some_id_1",
            execution: 0,
            status: "success",
          },
        ],
      },
      {
        displayName: "Race Detector",
        variant: "race-detector",
        tasks: [
          {
            displayName: "test-thirdparty",
            id: "some_id_2",
            execution: 0,
            status: "success",
          },
        ],
      },
      {
        displayName: "Ubuntu 16.04",
        variant: "ubuntu1604",
        tasks: [
          {
            displayName: "test-thirdparty",
            id: "some_id_3",
            execution: 0,
            status: "success",
          },
        ],
      },
      {
        displayName: "Ubuntu 17.04",
        variant: "ubuntu1704",
        tasks: [
          {
            displayName: "test-thirdparty",
            id: "some_id_4",
            execution: 0,
            status: "success",
          },
        ],
      },
      {
        displayName: "Ubuntu 18.04",
        variant: "ubuntu1804",
        tasks: [
          {
            displayName: "test-thirdparty",
            id: "some_id_5",
            execution: 0,
            status: "failed",
          },
        ],
      },
      {
        displayName: "Ubuntu 19.04",
        variant: "ubuntu1904",
        tasks: [
          {
            displayName: "test-thirdparty",
            id: "some_id_6",
            execution: 0,
            status: "success",
          },
        ],
      },
      {
        displayName: "Ubuntu 20.04",
        variant: "ubuntu2004",
        tasks: [
          {
            displayName: "test-thirdparty",
            id: "some_id_7",
            execution: 0,
            status: "success",
          },
        ],
      },
    ],
  },
  date: new Date("2021-09-02T14:20:04Z"),
};

const noFilterData: ApolloMock<
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables
> = {
  request: {
    query: TASK_TEST_SAMPLE,
    variables: {
      tasks: [
        "some_id_1",
        "some_id_2",
        "some_id_3",
        "some_id_4",
        "some_id_5",
        "some_id_6",
        "some_id_7",
      ],
      filters: [],
    },
  },
  result: {
    data: {
      taskTestSample: [
        {
          __typename: "TaskTestResultSample",
          taskId: "some_id_5",
          execution: 0,
          matchingFailedTestNames: ["TestJiraIntegration"],
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
    query: TASK_TEST_SAMPLE,
    variables: {
      tasks: [
        "some_id_1",
        "some_id_2",
        "some_id_3",
        "some_id_4",
        "some_id_5",
        "some_id_6",
        "some_id_7",
      ],
      filters: [
        { testName: "TestJiraIntegration", testStatus: TestStatus.Failed },
      ],
    },
  },
  result: {
    data: {
      taskTestSample: [
        {
          __typename: "TaskTestResultSample",
          taskId: "some_id_5",
          execution: 0,
          matchingFailedTestNames: ["TestJiraIntegration"],
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
    query: TASK_TEST_SAMPLE,
    variables: {
      tasks: [
        "some_id_1",
        "some_id_2",
        "some_id_3",
        "some_id_4",
        "some_id_5",
        "some_id_6",
        "some_id_7",
      ],
      filters: [{ testName: "NotARealTest", testStatus: TestStatus.Failed }],
    },
  },
  result: {
    data: {
      taskTestSample: [
        {
          __typename: "TaskTestResultSample",
          taskId: "some_id_5",
          execution: 0,
          matchingFailedTestNames: [],
          totalTestCount: 1,
        },
      ],
    },
  },
};
