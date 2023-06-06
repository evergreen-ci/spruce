import { useEffect, useMemo, useRef } from "react";
import { Skeleton } from "antd";
import throttle from "lodash.throttle";
import { Virtuoso } from "react-virtuoso";
import { MainlineCommitsForHistoryQuery } from "gql/generated/types";
import { useDimensions } from "hooks/useDimensions";
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
    onChangeTableWidth,
  } = useHistoryTable();

  const ref = useRef<HTMLDivElement>(null);
  const size = useDimensions(ref);
  const throttledOnChangeTableWidth = useMemo(
    () => throttle(onChangeTableWidth, 400),
    [onChangeTableWidth]
  );

  useEffect(() => {
    if (size) {
      throttledOnChangeTableWidth(size.width);
    }
  }, [size, throttledOnChangeTableWidth]);

  useEffect(() => {
    if (recentlyFetchedCommits) {
      ingestNewCommits(recentlyFetchedCommits);
    }
  }, [recentlyFetchedCommits?.nextPageOrderNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  const Component = children;
  return (
    <div ref={ref} style={{ height: "100%" }}>
      <Virtuoso
        totalCount={processedCommitCount}
        data={processedCommits}
        itemContent={(index, data) => <Component index={index} data={data} />}
        atBottomStateChange={(isAtBottom) => {
          if (isAtBottom && !loading) {
            loadMoreItems();
          }
        }}
        components={{
          Footer: () =>
            loading ? <Skeleton active /> : <div>End of list</div>,
        }}
      />
    </div>
  );
};

export default HistoryTable;
