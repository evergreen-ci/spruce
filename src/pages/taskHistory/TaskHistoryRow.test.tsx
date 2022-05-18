import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { context, constants } from "components/HistoryTable";
import { HistoryTableReducerState } from "components/HistoryTable/historyTableContextReducer";
import { mainlineCommitData } from "components/HistoryTable/testData";
import { rowType, CommitRowType } from "components/HistoryTable/types";
import { GET_TASK_TEST_SAMPLE } from "gql/queries";
import {
  fireEvent,
  renderWithRouterMatch as render,
  act,
  waitFor,
} from "test_utils";
import { TestStatus } from "types/history";
import TaskHistoryRow from "./TaskHistoryRow";

const { HistoryTableProvider } = context;
const { COMMIT_HEIGHT } = constants;

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

const wrapper: React.VFC<wrapperProps> = ({ children, mocks = [], state }) => (
  <MockedProvider mocks={mocks}>
    <HistoryTableProvider initialState={{ ...initialState, ...state }}>
      {children}
    </HistoryTableProvider>
  </MockedProvider>
);

describe("taskHistoryRow", () => {
  it("renders an initial loading row with 7 cells when there is no data", () => {
    const { queryAllByDataCy } = render(
      <TaskHistoryRow index={0} style={{}} data={undefined} />,
      {
        wrapper,
      }
    );
    expect(queryAllByDataCy("loading-cell")).toHaveLength(7);
  });
  it("renders a row when there is data", async () => {
    const { queryAllByDataCy } = render(
      <TaskHistoryRow index={0} style={{}} data={undefined} />,
      {
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
      }
    );
    expect(queryAllByDataCy("loading-cell")).toHaveLength(0);
    expect(queryAllByDataCy("task-cell")).toHaveLength(7);
  });
  it("amount of cells rendered should correspond to the amount of visibleColumns", async () => {
    const { queryAllByDataCy } = render(
      <TaskHistoryRow index={0} style={{}} data={undefined} />,
      {
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
      }
    );
    expect(queryAllByDataCy("task-cell")).toHaveLength(3);
  });
  it("renders a blank cell when there isn't a matching variant for that row", () => {
    const { queryAllByDataCy } = render(
      <TaskHistoryRow index={0} style={{}} data={undefined} />,
      {
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
      }
    );
    expect(queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(queryAllByDataCy("empty-cell")).toHaveLength(1);
  });
  it("should show failing tests when you hover over a failing task cell and there are no filters applied", async () => {
    const { queryAllByDataCy, queryByDataCy, queryByText } = render(
      <TaskHistoryRow index={0} style={{}} data={undefined} />,
      {
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
            },
            mocks,
          }),
      }
    );
    expect(queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(queryAllByDataCy("empty-cell")).toHaveLength(0);
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    fireEvent.mouseEnter(queryByDataCy("history-table-icon"));

    await waitFor(() => {
      expect(queryByText("TestJiraIntegration")).toBeVisible();
    });
  });
  it("should show a matching test label when looking at a task cell with filters applied", async () => {
    const { queryAllByDataCy, queryByDataCy, queryByText } = render(
      <TaskHistoryRow index={0} style={{}} data={undefined} />,
      {
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
            mocks,
          }),
      }
    );
    expect(queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(queryAllByDataCy("empty-cell")).toHaveLength(0);
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(queryByText("1 / 1 Failing Tests")).toBeVisible();
    fireEvent.mouseEnter(queryByDataCy("history-table-icon"));

    await waitFor(() => {
      expect(queryByText("TestJiraIntegration")).toBeVisible();
    });
  });
  it("should disable a task cell when there are test filters applied and it does not match the task filters", async () => {
    const { queryAllByDataCy, queryByDataCy } = render(
      <TaskHistoryRow index={0} style={{}} data={undefined} />,
      {
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
            mocks,
          }),
      }
    );
    expect(queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(queryAllByDataCy("empty-cell")).toHaveLength(0);
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(queryByDataCy("task-cell")).toHaveAttribute("aria-disabled", "true");
  });
});

const taskRow: CommitRowType = {
  type: rowType.COMMIT,
  rowHeight: COMMIT_HEIGHT,
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

const noFilterData = {
  request: {
    query: GET_TASK_TEST_SAMPLE,
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
          taskId: "some_id_5",
          execution: 0,
          matchingFailedTestNames: ["TestJiraIntegration"],
          totalTestCount: 1,
          __typename: "TaskTestResultSample",
        },
      ],
    },
  },
};

const withMatchingFilter = {
  request: {
    query: GET_TASK_TEST_SAMPLE,
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
          taskId: "some_id_5",
          execution: 0,
          matchingFailedTestNames: ["TestJiraIntegration"],
          totalTestCount: 1,
          __typename: "TaskTestResultSample",
        },
      ],
    },
  },
};

const withNonMatchingFilter = {
  request: {
    query: GET_TASK_TEST_SAMPLE,
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
          taskId: "some_id_5",
          execution: 0,
          matchingFailedTestNames: [],
          totalTestCount: 1,
          __typename: "TaskTestResultSample",
        },
      ],
    },
  },
};

const mocks = [withMatchingFilter, withNonMatchingFilter, noFilterData];
