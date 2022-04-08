import { act, renderHook } from "@testing-library/react-hooks";
import { GET_TASK_TEST_SAMPLE } from "gql/queries";
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
        "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04"
      )
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
      result.current.hookResponse.getTaskMetadata("some_id")
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
      result.current.hookResponse.getTaskMetadata("some_id")
    ).toMatchObject({
      inactive: false,
      label: "",
      failingTests: [],
    });
  });
  it("should return all matching test results when there are no filters applied and the row is a commit", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useMergedTestHook(1),
      {
        wrapper: ({ children }) => ProviderWrapper({ children, mocks }),
      }
    );
    expect(
      result.current.hookResponse.getTaskMetadata(
        "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04"
      )
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
    await waitForNextUpdate();
    const response = result.current.hookResponse.getTaskMetadata(
      "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04"
    );
    expect(response).toMatchObject({
      inactive: false,
      label: "",
      failingTests: ["TestJiraIntegration"],
      loading: false,
    });
  });
  it("should return all matching test results when there are matching filters applied and the row is a commit", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useMergedTestHook(1),
      {
        wrapper: ({ children }) => ProviderWrapper({ children, mocks }),
      }
    );
    expect(
      result.current.hookResponse.getTaskMetadata(
        "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04"
      )
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
    await waitForNextUpdate();
    expect(
      result.current.hookResponse.getTaskMetadata(
        "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04"
      )
    ).toMatchObject({
      inactive: false,
      label: "1 / 1 Failing Tests",
      failingTests: ["TestJiraIntegration"],
      loading: false,
    });
  });
  it("should not return matching test results when there are non matching filters applied and the row is a commit", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useMergedTestHook(1),
      {
        wrapper: ({ children }) => ProviderWrapper({ children, mocks }),
      }
    );
    expect(
      result.current.hookResponse.getTaskMetadata(
        "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04"
      )
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
    await waitForNextUpdate();
    expect(
      result.current.hookResponse.getTaskMetadata(
        "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04"
      )
    ).toMatchObject({
      inactive: true,
      label: "0 / 1 Failing Tests",
      failingTests: [],
    });
  });
});

type UseMergedTestHookType = (
  args: Parameters<typeof useTestResults>[0]
) => {
  hookResponse: ReturnType<typeof useTestResults>;
  historyTable: ReturnType<typeof useHistoryTable>;
};
/** useMergedTestHook combines the useTestResults and useHistoryTable hooks together
 * and combines them into a shared hook which can be rendered under the same wrapper context
 * and can be used together */
const useMergedTestHook: UseMergedTestHookType = (args) => {
  const hookResponse = useTestResults(args);
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
      processedCommitCount: 0,
      ingestNewCommits: expect.any(Function),
      getItem: expect.any(Function),
      isItemLoaded: expect.any(Function),
      getItemHeight: expect.any(Function),
      toggleRowSizeAtIndex: expect.any(Function),
      hasNextPage: false,
      hasPreviousPage: false,
      historyTableFilters: [],
      setHistoryTableFilters: expect.any(Function),
      processedCommits: [],
      visibleColumns: [],
      addColumns: expect.any(Function),
      nextPage: expect.any(Function),
      previousPage: expect.any(Function),
      currentPage: 0,
      pageCount: 0,
      columnLimit: 7,
      commitCount: 10,
      onChangeTableWidth: expect.any(Function),
      selectedCommit: null,
      setSelectedCommit: expect.any(Function),
    });
  });
});

const noFilterData = {
  request: {
    query: GET_TASK_TEST_SAMPLE,
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

const withMatchingFilter = {
  request: {
    query: GET_TASK_TEST_SAMPLE,
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

const withNonMatchingFilter = {
  request: {
    query: GET_TASK_TEST_SAMPLE,
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
