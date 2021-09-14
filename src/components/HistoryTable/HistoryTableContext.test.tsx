import { renderHook, act } from "@testing-library/react-hooks";
import { HistoryTableProvider, useHistoryTable } from "./HistoryTableContext";
import { mainlineCommitData } from "./testData";
import { rowType } from "./utils";

const wrapper = ({ children }) => (
  <HistoryTableProvider>{children}</HistoryTableProvider>
);
describe("HistoryTableContext", () => {
  test("Initializes with the default state", () => {
    const { result } = renderHook(() => useHistoryTable(), { wrapper });
    expect(result.current).toEqual({
      processedCommitCount: 0,
      fetchNewCommit: expect.any(Function),
      getItem: expect.any(Function),
      isItemLoaded: expect.any(Function),
      itemHeight: expect.any(Function),
      processedCommits: [],
      visibleColumns: [],
      addColumns: expect.any(Function),
      nextPage: expect.any(Function),
      previousPage: expect.any(Function),
    });
  });
  test("Should process new commits when they are passed in", () => {
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
    expect(processedCommits.length).toEqual(
      splitMainlineCommitDataPart1.versions.length
    );
    // First element should be the date separator
    expect(result.current.isItemLoaded(0)).toBe(true);
    expect(result.current.getItem(0)).toEqual({
      type: rowType.DATE_SEPARATOR,
      date: splitMainlineCommitDataPart1.versions[0].version.createTime,
    });
    expect(result.current.isItemLoaded(1)).toBe(true);
    expect(result.current.getItem(1)).toEqual({
      type: rowType.COMMIT,
      date: splitMainlineCommitDataPart1.versions[0].version.createTime,
      commit: splitMainlineCommitDataPart1.versions[0].version,
    });
    expect(result.current.isItemLoaded(2)).toBe(false);
  });
  test("Should process additional commits when they are passed in", () => {
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
    expect(result.current.getItem(0)).toEqual({
      type: rowType.DATE_SEPARATOR,
      date: splitMainlineCommitDataPart1.versions[0].version.createTime,
    });
    expect(result.current.isItemLoaded(1)).toBeTruthy();
    expect(result.current.isItemLoaded(2)).toBeFalsy();
    act(() => {
      result.current.fetchNewCommit(splitMainlineCommitDataPart2);
    });
    expect(result.current.isItemLoaded(2)).toBeTruthy();
    expect(result.current.getItem(2)).toEqual({
      type: rowType.COMMIT,
      date: splitMainlineCommitDataPart2.versions[0].version.createTime,
      commit: splitMainlineCommitDataPart2.versions[0].version,
    });
  });

  test("Should add a line separator between commits when they are a different date", () => {
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
    expect(result.current.getItem(0)).toEqual({
      type: rowType.DATE_SEPARATOR,
      date: commitDate1.versions[0].version.createTime,
    });
    expect(result.current.isItemLoaded(1)).toBeTruthy();
    expect(result.current.getItem(1)).toEqual({
      type: rowType.COMMIT,
      date: commitDate1.versions[0].version.createTime,
      commit: commitDate1.versions[0].version,
    });
    expect(result.current.isItemLoaded(2)).toBeFalsy();
    act(() => {
      result.current.fetchNewCommit(commitDate2);
    });
    expect(result.current.isItemLoaded(2)).toBeTruthy();
    expect(result.current.getItem(2)).toEqual({
      type: rowType.DATE_SEPARATOR,
      date: commitDate2.versions[0].version.createTime,
    });
    expect(result.current.isItemLoaded(3)).toBeTruthy();
    expect(result.current.getItem(3)).toEqual({
      type: rowType.COMMIT,
      date: commitDate2.versions[0].version.createTime,
      commit: commitDate2.versions[0].version,
    });
  });
  test("Should deduplicate passed in versions", () => {
    const { result } = renderHook(() => useHistoryTable(), { wrapper });
    const duplicateCommitData = {
      ...mainlineCommitData,
      versions: [mainlineCommitData.versions[0]],
    };
    act(() => {
      result.current.fetchNewCommit(duplicateCommitData);
    });

    expect(result.current.processedCommits.length).toEqual(2);
    act(() => {
      result.current.fetchNewCommit(duplicateCommitData);
    });

    expect(result.current.processedCommits.length).toEqual(2);
  });
  describe("Columns", () => {
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
      "enterprise-rhel-72-s390x-all-feature-flags",
      "enterprise-rhel-72-s390x-inmem",
    ];
    test("Should load in a set of columns and only display the first 8", () => {
      const { result } = renderHook(() => useHistoryTable(), { wrapper });
      act(() => {
        result.current.addColumns(columns);
      });
      expect(result.current.visibleColumns.length).toEqual(8);
      expect(result.current.visibleColumns).toEqual(columns.slice(0, 8));
    });
    test("Should be able to paginate forward on visible columns", () => {
      const { result } = renderHook(() => useHistoryTable(), { wrapper });
      act(() => {
        result.current.addColumns(columns);
      });
      expect(result.current.visibleColumns.length).toEqual(8);
      expect(result.current.visibleColumns).toEqual(columns.slice(0, 8));
      act(() => {
        result.current.nextPage();
      });
      // expect(result.current.visibleColumns.length).toEqual(8);
      expect(result.current.visibleColumns).toEqual(columns.slice(8, 16));
    });
    test("Should be able to paginate backwards on visible columns", () => {
      const { result } = renderHook(() => useHistoryTable(), { wrapper });
      act(() => {
        result.current.addColumns(columns);
      });
      expect(result.current.visibleColumns.length).toEqual(8);
      expect(result.current.visibleColumns).toEqual(columns.slice(0, 8));
      act(() => {
        result.current.nextPage();
      });
      expect(result.current.visibleColumns.length).toEqual(8);
      expect(result.current.visibleColumns).toEqual(columns.slice(8, 16));
      act(() => {
        result.current.previousPage();
      });
      expect(result.current.visibleColumns.length).toEqual(8);
      expect(result.current.visibleColumns).toEqual(columns.slice(0, 8));
    });
    test("Should not be able to paginate backwards on non existant pages", () => {
      const { result } = renderHook(() => useHistoryTable(), { wrapper });
      act(() => {
        result.current.addColumns(columns);
      });
      expect(result.current.visibleColumns.length).toEqual(8);
      expect(result.current.visibleColumns).toEqual(columns.slice(0, 8));
      act(() => {
        result.current.previousPage();
      });
      expect(result.current.visibleColumns.length).toEqual(8);
      expect(result.current.visibleColumns).toEqual(columns.slice(0, 8));
    });
  });
});
