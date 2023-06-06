import { useEffect } from "react";
import { Skeleton } from "antd";
import { Virtuoso } from "react-virtuoso";
import { MainlineCommitsForHistoryQuery } from "gql/generated/types";
import { types } from ".";
import { useHistoryTable } from "./HistoryTableContext";

interface HistoryTableProps {
  loadMoreItems: () => void;
  recentlyFetchedCommits: MainlineCommitsForHistoryQuery["mainlineCommits"];
  children: ({
    index,
    data,
  }: {
    index: number;
    data: types.CommitRowType;
  }) => React.ReactElement;
  loading: boolean;
}
const HistoryTable: React.VFC<HistoryTableProps> = ({
  loadMoreItems,
  recentlyFetchedCommits,
  children,
  loading,
}) => {
  const {
    processedCommitCount,

    ingestNewCommits,

    processedCommits,
  } = useHistoryTable();

  // const throttledOnChangeTableWidth = useMemo(
  //   () => throttle(onChangeTableWidth, 400),
  //   [onChangeTableWidth]
  // );

  useEffect(() => {
    if (recentlyFetchedCommits) {
      ingestNewCommits(recentlyFetchedCommits);
    }
    // Remove ingestNewCommits from the effect list to avoid infinite loop
  }, [recentlyFetchedCommits?.nextPageOrderNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  // const toggleRowSize = (index: number, numCommits: number) => {
  //   toggleRowSizeAtIndex(index, numCommits);
  // };
  console.log(processedCommits);
  const Component = children;
  return (
    <Virtuoso
      totalCount={processedCommitCount}
      data={processedCommits}
      itemContent={(index, data) => <Component index={index} data={data} />}
      atBottomStateChange={(isAtBottom) => {
        if (isAtBottom) {
          loadMoreItems();
        }
      }}
      components={{
        Footer: () => (loading ? <Skeleton active /> : <div>End of list</div>),
      }}
    />
  );
};

export default HistoryTable;
