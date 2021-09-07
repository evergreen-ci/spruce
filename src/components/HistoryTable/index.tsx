import { useEffect } from "react";
import { VariableSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { MainlineCommitsForHistoryQuery } from "gql/generated/types";
import { useHistoryTable } from "./HistoryTableContext";
import Row from "./Row";

const itemStatusMap = {};

const isItemLoaded = (index) => !!itemStatusMap[index];

interface HistoryTableProps {
  loadMoreItems: () => void;
  recentlyFetchedCommits: MainlineCommitsForHistoryQuery["mainlineCommits"];
}
const HistoryTable: React.FC<HistoryTableProps> = ({
  loadMoreItems,
  recentlyFetchedCommits,
}) => {
  const { itemHeight, fetchNewCommit } = useHistoryTable();

  useEffect(() => {
    if (recentlyFetchedCommits) {
      fetchNewCommit(recentlyFetchedCommits);
    }
  }, [recentlyFetchedCommits, fetchNewCommit]);
  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={10000}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          height={1000}
          itemCount={10000}
          itemSize={itemHeight}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width="100%"
        >
          {Row}
        </List>
      )}
    </InfiniteLoader>
  );
};

export default HistoryTable;
