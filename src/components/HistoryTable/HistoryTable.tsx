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
const HistoryTable = ({
  loadMoreItems,
  recentlyFetchedCommits,
  children,
}: HistoryTableProps): JSX.Element => {
  const {
    getItemHeight,
    fetchNewCommit,
    isItemLoaded,
    toggleRowSizeAtIndex,
    commitCount,
    onChangeTableWidth,
  } = useHistoryTable();
  const listRef = useRef<List>(null);

  const throttleOnChangeTableWidth = useMemo(
    () => throttle(onChangeTableWidth, 400),
    [onChangeTableWidth]
  );

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
    <AutoSizer onResize={({ width }) => throttleOnChangeTableWidth(width)}>
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
