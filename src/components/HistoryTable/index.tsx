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
              {children}
            </List>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};

export default HistoryTable;
