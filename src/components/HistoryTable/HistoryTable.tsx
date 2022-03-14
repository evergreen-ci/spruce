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
    toggleRowSize,
    commitCount,
    rowSizes,
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

  const toggleRow = (index: number, commitLength: number) => {
    toggleRowSize(index, commitLength);
    if (listRef.current) {
      listRef.current.resetAfterIndex(index);
    }
  };

  return rowSizes.length ? (
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
              itemData={{ toggleRow }}
            >
              {children}
            </List>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  ) : null;
};

export default HistoryTable;
