import {
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables,
} from "gql/generated/types";
import { TASK_TEST_SAMPLE } from "gql/queries";
import { act, renderHook, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { TestStatus } from "types/history";
import { useHistoryTable } from "../HistoryTableContext";
import { mainlineCommitData } from "../testData";
import { rowType } from "../types";
import { ProviderWrapper } from "./test-utils";
import useTestResults from "./useTestResults";

describe("useTestResults", () => {
  it("should return an empty map when nothing is loaded", () => {
    const { result } = renderHook(() => useMergedTestHook(0), {
      wrapper: ({ children }) => ProviderWrapper({ children }),
    });
    expect(result.current.hookResponse).toStrictEqual({
      getTaskMetadata: expect.any(Function),
    });
  });

  it("should return the default state when there is no valid data for a row", () => {
    const { result } = renderHook(() => useMergedTestHook(0), {
      wrapper: ({ children }) => ProviderWrapper({ children }),
    });
    expect(
      result.current.hookResponse.getTaskMetadata(
        "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
      ),
    ).toMatchObject({
      inactive: false,
      label: "",
      failingTests: [],
    });
  });

  it("should not attempt to fetch data for non commit rows", () => {
    const { result } = renderHook(() => useMergedTestHook(0), {
      wrapper: ({ children }) => ProviderWrapper({ children, mocks }),
    });
    expect(
      result.current.hookResponse.getTaskMetadata("some_id"),
    ).toMatchObject({
      inactive: false,
      label: "",
      failingTests: [],
    });
    act(() => {
      result.current.historyTable.ingestNewCommits(mainlineCommitData);
    });
    expect(result.current.historyTable.processedCommitCount).toBe(9);
    expect(result.current.historyTable.getItem(0)).toMatchObject({
      type: rowType.DATE_SEPARATOR,
    });
    expect(
      result.current.hookResponse.getTaskMetadata("some_id"),
    ).toMatchObject({
      inactive: false,
      label: "",
      failingTests: [],
    });
  });

  it("should return all matching test results when there are no filters applied and the row is a commit", async () => {
    const { result } = renderHook(() => useMergedTestHook(1), {
      wrapper: ({ children }) => ProviderWrapper({ children, mocks }),
    });
    expect(
      result.current.hookResponse.getTaskMetadata(
        "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
      ),
    ).toMatchObject({
      inactive: false,
      label: "",
      failingTests: [],
    });
    act(() => {
      result.current.historyTable.ingestNewCommits(mainlineCommitData);
    });
    expect(result.current.historyTable.processedCommitCount).toBe(9);
    expect(result.current.historyTable.getItem(2)).toMatchObject({
      type: rowType.COMMIT,
    });
    await waitFor(() => {
      expect(
        result.current.hookResponse.getTaskMetadata(
          "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
        ),
      ).toMatchObject({
        inactive: false,
        label: "",
        failingTests: ["TestJiraIntegration"],
        loading: false,
      });
    });
  });

  it("should return all matching test results when there are matching filters applied and the row is a commit", async () => {
    const { result } = renderHook(() => useMergedTestHook(1), {
      wrapper: ({ children }) => ProviderWrapper({ children, mocks }),
    });
    expect(
      result.current.hookResponse.getTaskMetadata(
        "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
      ),
    ).toMatchObject({
      inactive: false,
      label: "",
      failingTests: [],
      loading: false,
    });
    act(() => {
      result.current.historyTable.ingestNewCommits(mainlineCommitData);
    });
    expect(result.current.historyTable.processedCommitCount).toBe(9);
    expect(result.current.historyTable.getItem(2)).toMatchObject({
      type: rowType.COMMIT,
    });
    act(() => {
      result.current.historyTable.setHistoryTableFilters([
        { testName: "TestJiraIntegration", testStatus: TestStatus.Failed },
      ]);
    });
    await waitFor(() => {
      expect(
        result.current.hookResponse.getTaskMetadata(
          "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
        ),
      ).toMatchObject({
        inactive: false,
        label: "1 / 1 Failing Tests",
        failingTests: ["TestJiraIntegration"],
        loading: false,
      });
    });
  });

  it("should not return matching test results when there are non matching filters applied and the row is a commit", async () => {
    const { result } = renderHook(() => useMergedTestHook(1), {
      wrapper: ({ children }) => ProviderWrapper({ children, mocks }),
    });
    expect(
      result.current.hookResponse.getTaskMetadata(
        "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
      ),
    ).toMatchObject({
      inactive: false,
      label: "",
      failingTests: [],
    });
    act(() => {
      result.current.historyTable.ingestNewCommits(mainlineCommitData);
    });
    expect(result.current.historyTable.processedCommitCount).toBe(9);
    expect(result.current.historyTable.getItem(2)).toMatchObject({
      type: rowType.COMMIT,
    });
    act(() => {
      result.current.historyTable.setHistoryTableFilters([
        { testName: "NotARealTest", testStatus: TestStatus.Failed },
      ]);
    });
    await waitFor(() => {
      expect(
        result.current.hookResponse.getTaskMetadata(
          "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
        ),
      ).toMatchObject({
        inactive: true,
        label: "0 / 1 Failing Tests",
        failingTests: [],
      });
    });
  });
});

type UseMergedTestHookType = (args: Parameters<typeof useTestResults>[0]) => {
  hookResponse: ReturnType<typeof useTestResults>;
  historyTable: ReturnType<typeof useHistoryTable>;
};
/**
 * `useMergedTestHook` combines the useTestResults and useHistoryTable hooks together
 * and combines them into a shared hook which can be rendered under the same wrapper context
 * and can be used together
 * @param rowIndex - the row index to use for the useTestResults hook
 * @returns - the merged hooks
 * - hookResponse - the useTestResults hook
 * - historyTable - the useHistoryTable hook
 */
const useMergedTestHook: UseMergedTestHookType = (rowIndex) => {
  const hookResponse = useTestResults(rowIndex);
  const historyTable = useHistoryTable();

  return {
    hookResponse,
    historyTable,
  };
};

// This is a sanity check to ensure the useMergedHookRender hook is working as expected
describe("useMergedHookRender - sanity check", () => {
  it("should return the correct hooks", () => {
    const { result } = renderHook(() => useMergedTestHook(0), {
      wrapper: ProviderWrapper,
    });
    expect(result.current.hookResponse).toStrictEqual({
      getTaskMetadata: expect.any(Function),
    });
    expect(result.current.historyTable).toStrictEqual({
      columnLimit: 7,
      commitCount: 10,
      currentPage: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      historyTableFilters: [],
      pageCount: 0,
      processedCommitCount: 0,
      processedCommits: [],
      selectedCommit: null,
      visibleColumns: [],
      addColumns: expect.any(Function),
      getItem: expect.any(Function),
      ingestNewCommits: expect.any(Function),
      isItemLoaded: expect.any(Function),
      toggleRowExpansion: expect.any(Function),
      markSelectedRowVisited: expect.any(Function),
      nextPage: expect.any(Function),
      onChangeTableWidth: expect.any(Function),
      previousPage: expect.any(Function),
      setHistoryTableFilters: expect.any(Function),
      setSelectedCommit: expect.any(Function),
    });
  });
});

const noFilterData: ApolloMock<
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables
> = {
  request: {
    query: TASK_TEST_SAMPLE,
    variables: {
      tasks: [
        "evergreen_lint_lint_model_distro_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
        "evergreen_race_detector_test_model_distro_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
        "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
        "evergreen_ubuntu1604_test_model_distro_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
      ],
      filters: [],
    },
  },
  result: {
    data: {
      taskTestSample: [
        {
          taskId:
            "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
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
        "evergreen_lint_lint_model_distro_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
        "evergreen_race_detector_test_model_distro_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
        "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
        "evergreen_ubuntu1604_test_model_distro_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
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
          taskId:
            "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
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
        "evergreen_lint_lint_model_distro_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
        "evergreen_race_detector_test_model_distro_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
        "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
        "evergreen_ubuntu1604_test_model_distro_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
      ],
      filters: [{ testName: "NotARealTest", testStatus: TestStatus.Failed }],
    },
  },
  result: {
    data: {
      taskTestSample: [
        {
          taskId:
            "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
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
