import { useEffect, useRef, ComponentType, useMemo } from "react";
import throttle from "lodash.throttle";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  VariableSizeList as List,
  ListChildComponentProps,
} from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { MainlineCommitsForHistoryQuery } from "gql/generated/types";
import { useHistoryTable } from "./HistoryTableContext";

interface HistoryTableProps {
  loadMoreItems: () => void;
  recentlyFetchedCommits: MainlineCommitsForHistoryQuery["mainlineCommits"];
  children: ComponentType<ListChildComponentProps<any>>;
}
const HistoryTable: React.VFC<HistoryTableProps> = ({
  loadMoreItems,
  recentlyFetchedCommits,
  children,
}) => {
  const {
    commitCount,
    processedCommitCount,
    selectedCommit,
    getItemHeight,
    ingestNewCommits,
    isItemLoaded,
    markSelectedRowVisited,
    onChangeTableWidth,
    toggleRowSizeAtIndex,
  } = useHistoryTable();

  const throttledOnChangeTableWidth = useMemo(
    () => throttle(onChangeTableWidth, 400),
    [onChangeTableWidth]
  );

  const listRef = useRef<List>(null);
  useEffect(() => {
    if (recentlyFetchedCommits) {
      ingestNewCommits(recentlyFetchedCommits);
    }
    // Remove ingestNewCommits from the effect list to avoid infinite loop
  }, [recentlyFetchedCommits]); // eslint-disable-line react-hooks/exhaustive-deps

  // When we fetch new commits we need to tell react-window to re-render the list and update the heights for each of the rows since they will have changed based off of the new commits
  useEffect(() => {
    if (processedCommitCount > 0) {
      if (listRef.current) {
        listRef.current.resetAfterIndex(0);
      }
    }
  }, [processedCommitCount]);

  useEffect(() => {
    if (
      selectedCommit &&
      selectedCommit.rowIndex &&
      !selectedCommit.visited &&
      listRef.current
    ) {
      listRef.current.scrollToItem(selectedCommit.rowIndex, "center");
      markSelectedRowVisited();
    } else if (selectedCommit && !selectedCommit.loaded) {
      loadMoreItems();
    }
  }, [
    processedCommitCount,
    selectedCommit,
    markSelectedRowVisited,
    loadMoreItems,
  ]);

  const toggleRowSize = (index: number, numCommits: number) => {
    toggleRowSizeAtIndex(index, numCommits);
    if (listRef.current) {
      listRef.current.resetAfterIndex(index);
    }
  };

  return (
    <AutoSizer onResize={({ width }) => throttledOnChangeTableWidth(width)}>
      {({ height, width }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={commitCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <List
              height={height}
              itemCount={commitCount}
              itemSize={getItemHeight}
              onItemsRendered={onItemsRendered}
              ref={(list) => {
                // @ts-ignore next-line
                ref?.(list); // This is the syntax recommended by react-window's creator https://github.com/bvaughn/react-window/issues/324#issuecomment-528887341
                listRef.current = list;
              }}
              width={width}
              itemData={{ toggleRowSize }}
            >
              {children}
            </List>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};

export default HistoryTable;
