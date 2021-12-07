import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { context, types } from "components/HistoryTable";
import { HistoryTableReducerState } from "components/HistoryTable/historyTableContextReducer";
import { mainlineCommitData } from "components/HistoryTable/testData";
import { GET_TASK_TEST_SAMPLE } from "gql/queries";
import {
  fireEvent,
  renderWithRouterMatch as render,
  act,
  waitFor,
} from "test_utils/test-utils";
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

describe("VariantHistoryRow", () => {
  it("Renders an initial loading row with 7 cells when there is no data", () => {
    const { queryAllByDataCy } = render(
      () => <VariantHistoryRow index={0} style={{}} data={undefined} />,
      {
        wrapper,
      }
    );
    expect(queryAllByDataCy("loading-cell")).toHaveLength(7);
  });
  it("Renders a row when there is data", async () => {
    const { queryAllByDataCy } = render(
      () => <VariantHistoryRow index={0} style={{}} data={undefined} />,
      {
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
      }
    );
    expect(queryAllByDataCy("loading-cell")).toHaveLength(0);
    expect(queryAllByDataCy("task-cell")).toHaveLength(7);
  });
  it("Amount of cells rendered corresponds to the amount of visibleColumns", async () => {
    const { queryAllByDataCy } = render(
      () => <VariantHistoryRow index={0} style={{}} data={undefined} />,
      {
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
      }
    );
    expect(queryAllByDataCy("task-cell")).toHaveLength(3);
  });
  it("renders a blank cell when there isn't a matching variant for that row", () => {
    const { queryAllByDataCy } = render(
      () => <VariantHistoryRow index={0} style={{}} data={undefined} />,
      {
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
      }
    );
    expect(queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(queryAllByDataCy("empty-cell")).toHaveLength(1);
  });
  it("should show failing tests when you hover over a failing task cell and there are no filters applied", async () => {
    const { queryAllByDataCy, queryByDataCy, queryByText } = render(
      () => <VariantHistoryRow index={0} style={{}} data={undefined} />,
      {
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
      () => <VariantHistoryRow index={0} style={{}} data={undefined} />,
      {
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
      () => <VariantHistoryRow index={0} style={{}} data={undefined} />,
      {
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
      }
    );
    expect(queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(queryAllByDataCy("empty-cell")).toHaveLength(0);
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(queryByDataCy("task-cell")).toHaveAttribute("aria-disabled", "true");
  });
});

const taskRow = {
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
