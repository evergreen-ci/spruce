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
  height: number;
  width: number;
}
const HistoryTable: React.FC<HistoryTableProps> = ({
  loadMoreItems,
  recentlyFetchedCommits,
  children,
  height,
  width,
}) => {
  useEffect(() => {}, [width, height]);
  const {
    getItemHeight,
    fetchNewCommit,
    isItemLoaded,
    toggleRowSizeAtIndex,
    commitCount,
    onChangeTableWidth,
  } = useHistoryTable();
  const listRef = useRef<List>(null);

  useEffect(() => {
    onChangeTableWidth(width);
  }, [width, onChangeTableWidth]);

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
          style={{ border: "1px solid black" }}
        >
          {children}
        </List>
      )}
    </InfiniteLoader>
  );
};
export interface WrapperInterface
  extends Omit<HistoryTableProps, "height" | "width"> {}

const Wrapper: React.FC<WrapperInterface> = (props) => (
  <AutoSizer>
    {({ height, width }) => (
      <HistoryTable height={height} width={width} {...props} />
    )}
  </AutoSizer>
);
export default Wrapper;
