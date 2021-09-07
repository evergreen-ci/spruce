import { renderHook, act } from "@testing-library/react-hooks";
import { HistoryTableProvider, useHistoryTable } from "./HistoryTableContext";
import { mainlineCommitData } from "./testData";

const wrapper = ({ children }) => (
  <HistoryTableProvider>{children}</HistoryTableProvider>
);
describe("HistoryTableContext", () => {
  test("Initializes with the default state", () => {
    const { result } = renderHook(() => useHistoryTable(), { wrapper });
    expect(result.current).toEqual({
      loadedCommits: [],
      fetchNewCommit: expect.any(Function),
      getItem: expect.any(Function),
      isItemLoaded: expect.any(Function),
      itemHeight: expect.any(Function),
    });
  });
  test("Should process new commits when they are passed in", () => {
    const { result } = renderHook(() => useHistoryTable(), { wrapper });
    act(() => {
      result.current.fetchNewCommit(mainlineCommitData);
    });
    expect(result.current.loadedCommits).toEqual(mainlineCommitData.versions);
    for (let i = 0; i < mainlineCommitData.versions.length; i++) {
      expect(result.current.getItem(i)).toEqual(mainlineCommitData.versions[i]);
      expect(result.current.isItemLoaded(i)).toBeTruthy();
    }
  });
  test("Should process additional commits when they are passed in", () => {
    const { result } = renderHook(() => useHistoryTable(), { wrapper });
    const splitMainlineCommitDataPart1 = {
      ...mainlineCommitData,
      versions: mainlineCommitData.versions.slice(0, 2),
    };
    const splitMainlineCommitDataPart2 = {
      ...mainlineCommitData,
      versions: mainlineCommitData.versions.slice(2),
    };
    act(() => {
      result.current.fetchNewCommit(splitMainlineCommitDataPart1);
    });
    expect(result.current.loadedCommits).toEqual(
      splitMainlineCommitDataPart1.versions
    );
    for (let i = 0; i < splitMainlineCommitDataPart1.versions.length; i++) {
      expect(result.current.getItem(i)).toEqual(mainlineCommitData.versions[i]);
      expect(result.current.isItemLoaded(i)).toBeTruthy();
    }
    expect(result.current.isItemLoaded(3)).toBeFalsy();
    act(() => {
      result.current.fetchNewCommit(splitMainlineCommitDataPart2);
    });
    expect(result.current.loadedCommits).toEqual(mainlineCommitData.versions);
    for (let i = 0; i < splitMainlineCommitDataPart1.versions.length; i++) {
      expect(result.current.getItem(i)).toEqual(mainlineCommitData.versions[i]);
      expect(result.current.isItemLoaded(i)).toBeTruthy();
    }
  });
});
