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
      (c) => c.type !== rowType.DATE_SEPERATOR
    );
    // Should have processed the new commits and have every real commit
    expect(processedCommits.length).toEqual(
      splitMainlineCommitDataPart1.versions.length
    );
    // First element should be the date seperator
    expect(result.current.isItemLoaded(0)).toBe(true);
    expect(result.current.getItem(0)).toEqual({
      type: rowType.DATE_SEPERATOR,
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
      type: rowType.DATE_SEPERATOR,
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

  test("Should add a line seperator between commits when they are a different date", () => {
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
      type: rowType.DATE_SEPERATOR,
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
      type: rowType.DATE_SEPERATOR,
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
});
