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
  }, [recentlyFetchedCommits]);

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
          {({ onItemsRendered }) => (
            <List
              height={height}
              itemCount={commitCount}
              itemSize={getItemHeight}
              onItemsRendered={onItemsRendered}
              ref={listRef}
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
