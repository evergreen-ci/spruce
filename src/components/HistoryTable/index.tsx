import { useEffect, useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { MainlineCommitsForHistoryQuery } from "gql/generated/types";
import { useHistoryTable } from "./HistoryTableContext";
import Row from "./Row";

interface HistoryTableProps {
  loadMoreItems: () => void;
  recentlyFetchedCommits: MainlineCommitsForHistoryQuery["mainlineCommits"];
}
const HistoryTable: React.FC<HistoryTableProps> = ({
  loadMoreItems,
  recentlyFetchedCommits,
}) => {
  const { itemHeight, fetchNewCommit, isItemLoaded } = useHistoryTable();
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

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={10000}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered }) => (
            <List
              height={height}
              itemCount={10000}
              itemSize={itemHeight}
              onItemsRendered={onItemsRendered}
              ref={listRef}
              width={width}
            >
              {Row}
            </List>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};

export default HistoryTable;
