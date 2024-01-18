import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { context, types } from "components/HistoryTable";
import { HistoryTableReducerState } from "components/HistoryTable/historyTableContextReducer";
import { mainlineCommitData } from "components/HistoryTable/testData";
import { CommitRowType } from "components/HistoryTable/types";
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
import VariantHistoryRow from "./VariantHistoryRow";

const { HistoryTableProvider } = context;
const { rowType } = types;

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

describe("variantHistoryRow", () => {
  it("renders a row when there is data", () => {
    render(<VariantHistoryRow index={0} data={taskRow} />, {
      route: "/variant-history/mci/ubuntu1604",
      path: "/variant-history/:projectId/:variantName",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            processedCommitCount: 1,
            processedCommits: [taskRow],
            loadedCommits: [mainlineCommitData.versions[0].version],
            visibleColumns: [
              "test-cmd-codegen-core",
              "test-thirdparty",
              "test-db-auth",
              "test-evergreen",
              "test-graphql",
              "test-jira-integration",
              "test-mci",
            ],
          },
        }),
    });
    expect(screen.queryAllByDataCy("loading-cell")).toHaveLength(0);
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(7);
  });

  it("amount of cells rendered corresponds to the amount of visibleColumns", () => {
    render(<VariantHistoryRow index={0} data={taskRow} />, {
      route: "/variant-history/mci/ubuntu1604",
      path: "/variant-history/:projectId/:variantName",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            processedCommitCount: 1,
            processedCommits: [taskRow],
            loadedCommits: [mainlineCommitData.versions[0].version],
            visibleColumns: [
              "test-cmd-codegen-core",
              "test-thirdparty",
              "test-db-auth",
            ],
          },
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(3);
  });

  it("renders a blank cell when there isn't a matching variant for that column", () => {
    render(<VariantHistoryRow index={0} data={taskRow} />, {
      route: "/variant-history/mci/ubuntu1604",
      path: "/variant-history/:projectId/:variantName",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            processedCommitCount: 1,
            processedCommits: [taskRow],
            loadedCommits: [mainlineCommitData.versions[0].version],
            visibleColumns: ["test-cmd-codegen-core", "DNE"],
          },
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(screen.queryAllByDataCy("empty-cell")).toHaveLength(1);
  });

  it("should show failing tests when you hover over a failing task cell and there are no filters applied", async () => {
    const user = userEvent.setup();
    render(<VariantHistoryRow index={0} data={taskRow} />, {
      route: "/variant-history/mci/ubuntu1604",
      path: "/variant-history/:projectId/:variantName",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            processedCommitCount: 1,
            processedCommits: [taskRow],
            loadedCommits: [mainlineCommitData.versions[0].version],
            visibleColumns: ["test-cmd-codegen-core"],
          },
          mocks,
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
    render(<VariantHistoryRow index={0} data={taskRow} />, {
      route: "/variant-history/mci/ubuntu1604",
      path: "/variant-history/:projectId/:variantName",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            processedCommitCount: 1,
            processedCommits: [taskRow],
            loadedCommits: [mainlineCommitData.versions[0].version],
            visibleColumns: ["test-cmd-codegen-core"],
            historyTableFilters: [
              {
                testName: "TestJiraIntegration",
                testStatus: TestStatus.Failed,
              },
            ],
          },
          mocks,
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
    render(<VariantHistoryRow index={0} data={taskRow} />, {
      route: "/variant-history/mci/ubuntu1604",
      path: "/variant-history/:projectId/:variantName",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            processedCommitCount: 1,
            processedCommits: [taskRow],
            loadedCommits: [mainlineCommitData.versions[0].version],
            visibleColumns: ["test-cmd-codegen-core"],
            historyTableFilters: [
              { testName: "NotARealTest", testStatus: TestStatus.Failed },
            ],
          },
          mocks,
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
        displayName: "Ubuntu 16.04",
        variant: "ubuntu1604",
        tasks: [
          {
            displayName: "test-cmd-codegen-core",
            status: "failed",
            execution: 0,
            id: "some_id_1",
          },
          {
            displayName: "test-thirdparty",
            id: "some_id_2",
            execution: 0,
            status: "success",
          },
          {
            displayName: "test-db-auth",
            id: "some_id_3",
            execution: 0,
            status: "success",
          },
          {
            displayName: "test-evergreen",
            id: "some_id_4",
            execution: 0,
            status: "success",
          },
          {
            displayName: "test-graphql",
            id: "some_id_5",
            execution: 0,
            status: "success",
          },
          {
            displayName: "test-jira-integration",
            id: "some_id_6",
            execution: 0,
            status: "success",
          },
          {
            displayName: "test-mci",
            id: "some_id_7",
            execution: 0,
            status: "success",
          },
        ],
      },
    ],
  },
  date: new Date("2021-09-02T14:20:04Z"),
  selected: false,
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
          taskId: "some_id_1",
          execution: 0,
          matchingFailedTestNames: ["TestJiraIntegration"],
          totalTestCount: 1,
          __typename: "TaskTestResultSample",
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
          taskId: "some_id_1",
          execution: 0,
          matchingFailedTestNames: ["TestJiraIntegration"],
          totalTestCount: 1,
          __typename: "TaskTestResultSample",
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
          taskId: "some_id_1",
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
