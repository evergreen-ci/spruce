import { renderHook, act } from "@testing-library/react-hooks";
import { HistoryTableProvider, useHistoryTable } from "./HistoryTableContext";
import { mainlineCommitData } from "./testData";
import { rowType } from "./types";

const wrapper = ({ children }) => (
  <HistoryTableProvider>{children}</HistoryTableProvider>
);
describe("historyTableContext", () => {
  it("initializes with the default state", () => {
    const { result } = renderHook(() => useHistoryTable(), { wrapper });
    expect(result.current).toStrictEqual({
      processedCommitCount: 0,
      fetchNewCommit: expect.any(Function),
      getItem: expect.any(Function),
      isItemLoaded: expect.any(Function),
      itemHeight: expect.any(Function),
      hasNextPage: false,
      hasPreviousPage: false,
      processedCommits: [],
      visibleColumns: [],
      addColumns: expect.any(Function),
      nextPage: expect.any(Function),
      previousPage: expect.any(Function),
      currentPage: 0,
      pageCount: 0,
      columnLimit: 7,
      commitCount: 0,
    });
  });
  it("should process new commits when they are passed in", () => {
    const { result } = renderHook(() => useHistoryTable(), { wrapper });
    const splitMainlineCommitDataPart1 = {
      ...mainlineCommitData,
      versions: mainlineCommitData.versions.slice(0, 1),
    };
    act(() => {
      result.current.fetchNewCommit(splitMainlineCommitDataPart1);
    });
    // Filter out the column date seperators
    const processedCommits = result.current.processedCommits.filter(
      (c) => c.type !== rowType.DATE_SEPARATOR
    );
    // Should have processed the new commits and have every real commit
    expect(processedCommits).toHaveLength(
      splitMainlineCommitDataPart1.versions.length
    );
    // First element should be the date separator
    expect(result.current.isItemLoaded(0)).toBe(true);
    expect(result.current.getItem(0)).toStrictEqual({
      type: rowType.DATE_SEPARATOR,
      date: splitMainlineCommitDataPart1.versions[0].version.createTime,
    });
    expect(result.current.isItemLoaded(1)).toBe(true);
    expect(result.current.getItem(1)).toStrictEqual({
      type: rowType.COMMIT,
      date: splitMainlineCommitDataPart1.versions[0].version.createTime,
      commit: splitMainlineCommitDataPart1.versions[0].version,
    });
    expect(result.current.isItemLoaded(2)).toBe(false);
  });
  it("should process additional commits when they are passed in", () => {
    const { result } = renderHook(() => useHistoryTable(), { wrapper });
    const splitMainlineCommitDataPart1 = {
      ...mainlineCommitData,
      versions: mainlineCommitData.versions.slice(0, 1),
    };
    const splitMainlineCommitDataPart2 = {
      ...mainlineCommitData,
      versions: mainlineCommitData.versions.slice(1, 2),
    };
    act(() => {
      result.current.fetchNewCommit(splitMainlineCommitDataPart1);
    });
    expect(result.current.isItemLoaded(0)).toBeTruthy();
    expect(result.current.getItem(0)).toStrictEqual({
      type: rowType.DATE_SEPARATOR,
      date: splitMainlineCommitDataPart1.versions[0].version.createTime,
    });
    expect(result.current.isItemLoaded(1)).toBeTruthy();
    expect(result.current.isItemLoaded(2)).toBeFalsy();
    act(() => {
      result.current.fetchNewCommit(splitMainlineCommitDataPart2);
    });
    expect(result.current.isItemLoaded(2)).toBeTruthy();
    expect(result.current.getItem(2)).toStrictEqual({
      type: rowType.COMMIT,
      date: splitMainlineCommitDataPart2.versions[0].version.createTime,
      commit: splitMainlineCommitDataPart2.versions[0].version,
    });
  });
  it("should handle calculating the commitCount based off of the passed in values", () => {
    const { result } = renderHook(() => useHistoryTable(), { wrapper });
    const commitDate1 = {
      ...mainlineCommitData,
      versions: [mainlineCommitData.versions[0]],
      prevPageOrderNumber: null,
    };
    const commitDate2 = {
      ...mainlineCommitData,
      versions: [mainlineCommitData.versions[2]],
      nextPageOrderNumber: null,
      prevPageOrderNumber: 6798,
    };
    act(() => {
      result.current.fetchNewCommit(commitDate1);
    });
    expect(result.current.commitCount).toBe(6798);
    act(() => {
      result.current.fetchNewCommit(commitDate2);
    });
    expect(result.current.commitCount).toBe(4);
  });
  it("should add a line separator between commits when they are a different date", () => {
    const { result } = renderHook(() => useHistoryTable(), { wrapper });
    const commitDate1 = {
      ...mainlineCommitData,
      versions: [mainlineCommitData.versions[0]],
    };
    const commitDate2 = {
      ...mainlineCommitData,
      versions: [mainlineCommitData.versions[2]],
    };
    act(() => {
      result.current.fetchNewCommit(commitDate1);
    });
    expect(result.current.isItemLoaded(0)).toBeTruthy();
    expect(result.current.getItem(0)).toStrictEqual({
      type: rowType.DATE_SEPARATOR,
      date: commitDate1.versions[0].version.createTime,
    });
    expect(result.current.isItemLoaded(1)).toBeTruthy();
    expect(result.current.getItem(1)).toStrictEqual({
      type: rowType.COMMIT,
      date: commitDate1.versions[0].version.createTime,
      commit: commitDate1.versions[0].version,
    });
    expect(result.current.isItemLoaded(2)).toBeFalsy();
    act(() => {
      result.current.fetchNewCommit(commitDate2);
    });
    expect(result.current.isItemLoaded(2)).toBeTruthy();
    expect(result.current.getItem(2)).toStrictEqual({
      type: rowType.DATE_SEPARATOR,
      date: commitDate2.versions[0].version.createTime,
    });
    expect(result.current.isItemLoaded(3)).toBeTruthy();
    expect(result.current.getItem(3)).toStrictEqual({
      type: rowType.COMMIT,
      date: commitDate2.versions[0].version.createTime,
      commit: commitDate2.versions[0].version,
    });
  });
  it("should deduplicate passed in versions", () => {
    const { result } = renderHook(() => useHistoryTable(), { wrapper });
    const duplicateCommitData = {
      ...mainlineCommitData,
      versions: [mainlineCommitData.versions[0]],
    };
    act(() => {
      result.current.fetchNewCommit(duplicateCommitData);
    });

    expect(result.current.processedCommits).toHaveLength(2);
    act(() => {
      result.current.fetchNewCommit(duplicateCommitData);
    });

    expect(result.current.processedCommits).toHaveLength(2);
  });
  describe("columns", () => {
    const columns = [
      "enterprise-windows-required",
      "enterprise-windows-all-feature-flags-required",
      "enterprise-rhel-80-64-bit-dynamic-required",
      "enterprise-rhel-80-64-bit-dynamic-all-feature-flags-required",
      "linux-64-debug-required",
      "ubuntu1804-debug-aubsan-lite-required",
      "ubuntu1804-debug-aubsan-lite-all-feature-flags-required",
      "enterprise-rhel-80-64-bit-suggested",
      "enterprise-windows-suggested",
      "enterprise-windows-all-feature-flags-suggested",
      "ubuntu1804-debug-suggested",
      "macos-debug-suggested",
      "windows-debug-suggested",
      "amazon",
      "amazon2",
      "amazon2-arm64",
      "debian10",
      "debian92",
      "enterprise-linux-64-amazon-ami",
      "enterprise-amazon2",
      "enterprise-amazon2-arm64",
      "enterprise-debian10-64",
      "enterprise-debian92-64",
      "enterprise-rhel-70-64-bit",
      "enterprise-rhel-72-s390x",
    ];
    it("should load in a set of columns and only display the first 7", () => {
      const { result } = renderHook(() => useHistoryTable(), { wrapper });
      act(() => {
        result.current.addColumns(columns);
      });
      expect(result.current.visibleColumns).toHaveLength(7);
      expect(result.current.visibleColumns).toStrictEqual(columns.slice(0, 7));
    });
    it("should be able to paginate forward on visible columns", () => {
      const { result } = renderHook(() => useHistoryTable(), { wrapper });
      act(() => {
        result.current.addColumns(columns);
      });
      expect(result.current.visibleColumns).toHaveLength(7);
      expect(result.current.visibleColumns).toStrictEqual(columns.slice(0, 7));
      act(() => {
        result.current.nextPage();
      });
      expect(result.current.visibleColumns).toHaveLength(7);
      expect(result.current.visibleColumns).toStrictEqual(columns.slice(7, 14));
    });
    it("should be able to paginate backwards on visible columns", () => {
      const { result } = renderHook(() => useHistoryTable(), { wrapper });
      act(() => {
        result.current.addColumns(columns);
      });
      expect(result.current.visibleColumns).toHaveLength(7);
      expect(result.current.visibleColumns).toStrictEqual(columns.slice(0, 7));
      expect(result.current.hasNextPage).toBeTruthy();
      expect(result.current.hasPreviousPage).toBeFalsy();
      act(() => {
        result.current.nextPage();
      });
      expect(result.current.hasPreviousPage).toBeTruthy();
      expect(result.current.visibleColumns).toHaveLength(7);
      expect(result.current.visibleColumns).toStrictEqual(columns.slice(7, 14));
      act(() => {
        result.current.previousPage();
      });
      expect(result.current.hasPreviousPage).toBeFalsy();
      expect(result.current.visibleColumns).toHaveLength(7);
      expect(result.current.visibleColumns).toStrictEqual(columns.slice(0, 7));
    });
    it("should not be able to paginate backwards on non existant pages", () => {
      const { result } = renderHook(() => useHistoryTable(), { wrapper });
      act(() => {
        result.current.addColumns(columns);
      });
      expect(result.current.hasPreviousPage).toBeFalsy();
      expect(result.current.visibleColumns).toHaveLength(7);
      expect(result.current.visibleColumns).toStrictEqual(columns.slice(0, 7));
      act(() => {
        result.current.previousPage();
      });
      expect(result.current.visibleColumns).toHaveLength(7);
      expect(result.current.visibleColumns).toStrictEqual(columns.slice(0, 7));
    });
  });
});
