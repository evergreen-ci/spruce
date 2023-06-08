import { useEffect, useMemo, useRef } from "react";
import throttle from "lodash.throttle";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { useDimensions } from "hooks/useDimensions";
import { leaveBreadcrumb } from "utils/errorReporting";
import { types } from ".";
import { useHistoryTable } from "./HistoryTableContext";
import LoadingRow from "./HistoryTableRow/LoadingRow";

interface HistoryTableProps {
  loadMoreItems: () => void;
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
  children,
  loading,
}) => {
  const {
    processedCommitCount,
    processedCommits,
    onChangeTableWidth,
    selectedCommit,
    visibleColumns,
  } = useHistoryTable();

  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<VirtuosoHandle>(null);
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
    if (selectedCommit?.loaded && listRef.current) {
      leaveBreadcrumb(
        "scrolling to selected commit",
        {
          selectedCommit,
        },
        "process"
      );
      listRef.current.scrollToIndex(selectedCommit.rowIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCommit?.loaded]);

  // In order to jump to the selected commit, we need to first load the necessary amount of commits
  useEffect(() => {
    if (selectedCommit) {
      if (!selectedCommit.loaded) {
        leaveBreadcrumb(
          "selectedCommit not loaded, loading more items",
          {
            selectedCommit,
            processedCommitCount,
          },
          "process"
        );
        loadMoreItems();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedCommitCount]);

  const Component = children;
  return (
    <div ref={ref} style={{ height: "100%" }}>
      <Virtuoso
        ref={listRef}
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
            loading ? (
              <LoadingRow numVisibleCols={visibleColumns.length} />
            ) : (
              <div>End of list</div>
            ),
        }}
      />
    </div>
  );
};

export default HistoryTable;
