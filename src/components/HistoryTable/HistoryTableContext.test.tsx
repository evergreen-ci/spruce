import { renderHook, act } from "@testing-library/react-hooks";
import {
  FOLDED_COMMITS_HEIGHT,
  COMMIT_HEIGHT,
  DATE_SEPARATOR_HEIGHT,
} from "./constants";
import { HistoryTableProvider, useHistoryTable } from "./HistoryTableContext";
import { columns, mainlineCommitData } from "./testData";
import { rowType, CommitRowType } from "./types";

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
  it("should process new commits when they are passed in", () => {
    const { result } = renderHook(() => useHistoryTable(), { wrapper });
    const splitMainlineCommitDataPart1 = {
      ...mainlineCommitData,
      versions: mainlineCommitData.versions.slice(0, 1),
    };
    act(() => {
      result.current.fetchNewCommit(splitMainlineCommitDataPart1);
    });
    // Filter out the column date separators
    const processedCommits = result.current.processedCommits.filter(
      (c) => c.type !== rowType.DATE_SEPARATOR
    );
    // Should have processed the new commits and have every real commit
    expect(processedCommits).toHaveLength(
      splitMainlineCommitDataPart1.versions.length
    );
    // First element should be the date separator
    expect(result.current.isItemLoaded(0)).toBe(true);
    expect(result.current.getItem(0)).toStrictEqual<CommitRowType>({
      type: rowType.DATE_SEPARATOR,
      date: splitMainlineCommitDataPart1.versions[0].version.createTime,
      rowHeight: DATE_SEPARATOR_HEIGHT,
    });
    expect(result.current.isItemLoaded(1)).toBe(true);
    expect(result.current.getItem(1)).toStrictEqual<CommitRowType>({
      type: rowType.COMMIT,
      date: splitMainlineCommitDataPart1.versions[0].version.createTime,
      commit: splitMainlineCommitDataPart1.versions[0].version,
      rowHeight: COMMIT_HEIGHT,
      selected: false,
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
    // Fetch new commit
    act(() => {
      result.current.fetchNewCommit(splitMainlineCommitDataPart1);
    });
    expect(result.current.isItemLoaded(0)).toBeTruthy();
    expect(result.current.getItem(0)).toStrictEqual<CommitRowType>({
      type: rowType.DATE_SEPARATOR,
      date: splitMainlineCommitDataPart1.versions[0].version.createTime,
      rowHeight: DATE_SEPARATOR_HEIGHT,
    });
    expect(result.current.isItemLoaded(1)).toBeTruthy();
    expect(result.current.isItemLoaded(2)).toBeFalsy();

    // Fetch another new commit
    act(() => {
      result.current.fetchNewCommit(splitMainlineCommitDataPart2);
    });
    expect(result.current.isItemLoaded(2)).toBeTruthy();
    expect(result.current.getItem(2)).toStrictEqual<CommitRowType>({
      type: rowType.COMMIT,
      date: splitMainlineCommitDataPart2.versions[0].version.createTime,
      commit: splitMainlineCommitDataPart2.versions[0].version,
      rowHeight: COMMIT_HEIGHT,
      selected: false,
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
    expect(result.current.getItem(0)).toStrictEqual<CommitRowType>({
      type: rowType.DATE_SEPARATOR,
      date: commitDate1.versions[0].version.createTime,
      rowHeight: DATE_SEPARATOR_HEIGHT,
    });
    expect(result.current.isItemLoaded(1)).toBeTruthy();
    expect(result.current.getItem(1)).toStrictEqual<CommitRowType>({
      type: rowType.COMMIT,
      date: commitDate1.versions[0].version.createTime,
      commit: commitDate1.versions[0].version,
      rowHeight: COMMIT_HEIGHT,
      selected: false,
    });
    expect(result.current.isItemLoaded(2)).toBeFalsy();
    act(() => {
      result.current.fetchNewCommit(commitDate2);
    });
    expect(result.current.isItemLoaded(2)).toBeTruthy();
    expect(result.current.getItem(2)).toStrictEqual<CommitRowType>({
      type: rowType.DATE_SEPARATOR,
      date: commitDate2.versions[0].version.createTime,
      rowHeight: DATE_SEPARATOR_HEIGHT,
    });
    expect(result.current.isItemLoaded(3)).toBeTruthy();
    expect(result.current.getItem(3)).toStrictEqual<CommitRowType>({
      type: rowType.COMMIT,
      date: commitDate2.versions[0].version.createTime,
      commit: commitDate2.versions[0].version,
      rowHeight: COMMIT_HEIGHT,
      selected: false,
    });
  });
  it("should handle expanding rows", () => {
    const { result } = renderHook(() => useHistoryTable(), { wrapper });
    const expandableMainlineCommitData = {
      ...mainlineCommitData,
      versions: mainlineCommitData.versions.slice(-2),
    };
    const { version } = expandableMainlineCommitData.versions[0];
    const { rolledUpVersions } = expandableMainlineCommitData.versions[1];
    act(() => {
      result.current.fetchNewCommit(expandableMainlineCommitData);
    });
    // Verify elements
    expect(result.current.isItemLoaded(0)).toBe(true);
    expect(result.current.getItem(0)).toStrictEqual<CommitRowType>({
      type: rowType.DATE_SEPARATOR,
      date: version.createTime,
      rowHeight: DATE_SEPARATOR_HEIGHT,
    });
    expect(result.current.isItemLoaded(1)).toBe(true);
    expect(result.current.getItem(1)).toStrictEqual<CommitRowType>({
      type: rowType.COMMIT,
      date: version.createTime,
      commit: version,
      rowHeight: COMMIT_HEIGHT,
      selected: false,
    });
    expect(result.current.isItemLoaded(2)).toBe(true);
    expect(result.current.getItem(2)).toStrictEqual<CommitRowType>({
      type: rowType.DATE_SEPARATOR,
      date: rolledUpVersions[0].createTime,
      rowHeight: DATE_SEPARATOR_HEIGHT,
    });
    expect(result.current.isItemLoaded(3)).toBe(true);
    expect(result.current.getItem(3)).toStrictEqual<CommitRowType>({
      type: rowType.FOLDED_COMMITS,
      date: rolledUpVersions[0].createTime,
      rolledUpCommits: rolledUpVersions,
      rowHeight: FOLDED_COMMITS_HEIGHT,
      selected: false,
    });
    expect(result.current.isItemLoaded(4)).toBe(false);
    // Now trigger a size update to the folded commit
    act(() => {
      result.current.toggleRowSizeAtIndex(3, rolledUpVersions.length);
    });
    // Check the new row height
    const expandedRowHeight =
      FOLDED_COMMITS_HEIGHT + COMMIT_HEIGHT * rolledUpVersions.length;
    expect(result.current.getItem(3)).toStrictEqual<CommitRowType>({
      type: rowType.FOLDED_COMMITS,
      date: rolledUpVersions[0].createTime,
      rolledUpCommits: rolledUpVersions,
      rowHeight: expandedRowHeight,
      selected: false,
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
    it("should initially load in a set of columns and only display the first 7", () => {
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
    it("should not be able to paginate backwards on non existent pages", () => {
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
  describe("change table width", () => {
    it(`should adjust the number of visible columns, current page, and page count after changing the 
    screen width to a value where the number of columns that fit on the screen changes`, () => {
      const { result } = renderHook(() => useHistoryTable(), { wrapper });
      act(() => {
        result.current.addColumns(columns);
        result.current.onChangeTableWidth(3000);
      });
      expect(result.current.pageCount).toBe(2);
      expect(result.current.visibleColumns).toHaveLength(18);
      expect(result.current.visibleColumns).toStrictEqual(columns.slice(0, 18));
      expect(result.current.currentPage).toBe(0);
      act(() => {
        result.current.onChangeTableWidth(5000);
      });
      expect(result.current.pageCount).toBe(1);
      expect(result.current.visibleColumns).toHaveLength(25);
      expect(result.current.visibleColumns).toStrictEqual(columns);
      act(() => {
        result.current.onChangeTableWidth(200);
      });
      expect(result.current.pageCount).toBe(25);
      expect(result.current.visibleColumns).toHaveLength(1);
      expect(result.current.visibleColumns).toStrictEqual(columns.slice(0, 1));
      expect(result.current.currentPage).toBe(0);
    });
    it(`should not mutate the reducer state if the screen width is adjusted and number of columns 
    that fit on the screen is unchanged`, () => {
      const { result } = renderHook(() => useHistoryTable(), { wrapper });
      act(() => {
        result.current.addColumns(columns);
      });
      const initialState = { ...result.current };
      act(() => {
        result.current.onChangeTableWidth(1300);
      });
      expect(result.current).toStrictEqual(initialState);
    });
    it(`should reset the current page to 0 if the screen width is adjusted and the number of columns 
      that fit on the screen changes`, () => {
      const { result } = renderHook(() => useHistoryTable(), { wrapper });
      act(() => {
        result.current.addColumns(columns);
        result.current.nextPage();
      });
      expect(result.current.currentPage).toBe(1);
      act(() => {
        result.current.onChangeTableWidth(6000);
      });
      expect(result.current.currentPage).toBe(0);
    });
  });
  describe("test filters", () => {
    it("should add new test filters when they are passed in", () => {
      const { result } = renderHook(() => useHistoryTable(), { wrapper });
      expect(result.current.historyTableFilters).toStrictEqual([]);
      act(() => {
        result.current.setHistoryTableFilters([
          {
            testName: "test-name",
            testStatus: "passed",
          },
          {
            testName: "test-name2",
            testStatus: "failed",
          },
        ]);
      });
      expect(result.current.historyTableFilters).toStrictEqual([
        {
          testName: "test-name",
          testStatus: "passed",
        },
        {
          testName: "test-name2",
          testStatus: "failed",
        },
      ]);
    });
    it("should overwrite test filters when new ones are passed in", () => {
      const { result } = renderHook(() => useHistoryTable(), { wrapper });
      expect(result.current.historyTableFilters).toStrictEqual([]);
      act(() => {
        result.current.setHistoryTableFilters([
          {
            testName: "test-name",
            testStatus: "passed",
          },
          {
            testName: "test-name2",
            testStatus: "failed",
          },
        ]);
      });
      expect(result.current.historyTableFilters).toStrictEqual([
        {
          testName: "test-name",
          testStatus: "passed",
        },
        {
          testName: "test-name2",
          testStatus: "failed",
        },
      ]);
      act(() => {
        result.current.setHistoryTableFilters([
          {
            testName: "test-new",
            testStatus: "passed",
          },
          {
            testName: "test-new2",
            testStatus: "failed",
          },
        ]);
      });
      expect(result.current.historyTableFilters).toStrictEqual([
        {
          testName: "test-new",
          testStatus: "passed",
        },
        {
          testName: "test-new2",
          testStatus: "failed",
        },
      ]);
    });
  });
});
