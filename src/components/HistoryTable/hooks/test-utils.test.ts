import { useState } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useHistoryTableTestHook, ProviderWrapper } from "./test-utils";

// This is a sanity check to ensure the useMergedHookRender hook is working as expected
describe("useHistoryTableTestHook - sanity check", () => {
  it("should return the correct hooks", () => {
    const { result } = renderHook(
      () => useHistoryTableTestHook(useTestHook)(0),
      {
        wrapper: ProviderWrapper,
      }
    );

    expect(result.current.hookResponse.count).toBe(0);
    expect(result.current.historyTable).toStrictEqual({
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
    });
  });

  it("should be able to perform hook actions", async () => {
    const { result } = renderHook(
      () => useHistoryTableTestHook(useTestHook)(0),
      {
        wrapper: ProviderWrapper,
      }
    );
    expect(result.current.hookResponse.count).toBe(0);
    act(() => {
      result.current.hookResponse.incrementCount();
    });
    expect(result.current.hookResponse.count).toBe(1);

    expect(result.current.historyTable.isItemLoaded(0)).toBe(false);
  });
});

const useTestHook = (row: number) => {
  const [count, setCount] = useState(row);
  const incrementCount = () => {
    setCount(count + 1);
  };
  return { count, incrementCount };
};
