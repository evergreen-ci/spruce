import { useEffect, useRef, ComponentType } from "react";
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
const HistoryTable: React.FC<HistoryTableProps> = ({
  loadMoreItems,
  recentlyFetchedCommits,
  children,
}) => {
  const {
    getItemHeight,
    fetchNewCommit,
    isItemLoaded,
    toggleRowSizeAtIndex,
    commitCount,
    selectedCommit,
    markSelectedVisited,
  } = useHistoryTable();
  const listRef = useRef<List>(null);
  useEffect(() => {
    if (recentlyFetchedCommits) {
      fetchNewCommit(recentlyFetchedCommits);
    }
    // Remove fetchNewCommit from the effect list to avoid infinite loop
  }, [recentlyFetchedCommits]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [commitCount]);

  useEffect(() => {
    if (selectedCommit) {
      if (selectedCommit.loaded && !selectedCommit.visited) {
        if (listRef.current) {
          listRef.current.scrollToItem(selectedCommit.rowIndex, "start");
          markSelectedVisited();
        }
      }
    }
  }, [selectedCommit, commitCount, markSelectedVisited]);

  useEffect(() => {
    if (selectedCommit) {
      if (!selectedCommit.loaded && !selectedCommit.visited) {
        loadMoreItems();
      }
    }
  }, [selectedCommit, commitCount, loadMoreItems]);

  const toggleRowSize = (index: number, numCommits: number) => {
    toggleRowSizeAtIndex(index, numCommits);
    if (listRef.current) {
      listRef.current.resetAfterIndex(index);
    }
  };

  return (
    <AutoSizer>
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
