import { useEffect, useMemo, useRef } from "react";
import throttle from "lodash.throttle";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { useDimensions } from "hooks/useDimensions";
import { leaveBreadcrumb, SentryBreadcrumb } from "utils/errorReporting";
import { types } from ".";
import { useHistoryTable } from "./HistoryTableContext";
import EndOfHistoryRow from "./HistoryTableRow/EndOfHistoryRow";
import LoadingSection from "./LoadingSection";

interface HistoryTableProps {
  loadMoreItems: () => void;
  children: ({
    data,
    index,
  }: {
    index: number;
    data: types.CommitRowType;
  }) => React.ReactElement;
  finalRowCopy?: string;
  loading: boolean;
}
const HistoryTable: React.FC<HistoryTableProps> = ({
  children: Component,
  finalRowCopy,
  loadMoreItems,
  loading,
}) => {
  const {
    onChangeTableWidth,
    processedCommitCount,
    processedCommits,
    selectedCommit,
    visibleColumns,
  } = useHistoryTable();

  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<VirtuosoHandle>(null);
  const size = useDimensions(ref);
  const throttledOnChangeTableWidth = useMemo(
    () => throttle(onChangeTableWidth, 400),
    [onChangeTableWidth],
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
        SentryBreadcrumb.UI,
      );
      listRef.current.scrollToIndex(selectedCommit.rowIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCommit?.loaded]);

  // In order to jump to the selected commit, we need to first load the necessary amount of commits
  useEffect(() => {
    if (selectedCommit && !selectedCommit.loaded) {
      leaveBreadcrumb(
        "selectedCommit not loaded, loading more items",
        {
          selectedCommit,
          processedCommitCount,
        },
        SentryBreadcrumb.UI,
      );
      loadMoreItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedCommitCount]);

  return (
    <div ref={ref} style={{ height: "100%" }}>
      <Virtuoso
        ref={listRef}
        totalCount={processedCommitCount}
        data={processedCommits}
        itemContent={(index, data) => <Component index={index} data={data} />}
        endReached={() => {
          if (!loading) {
            loadMoreItems();
          }
        }}
        components={{
          Footer: () =>
            loading ? (
              <LoadingSection
                numVisibleCols={visibleColumns.length}
                numLoadingRows={10}
              />
            ) : (
              <EndOfHistoryRow>{finalRowCopy}</EndOfHistoryRow>
            ),
        }}
      />
    </div>
  );
};

export default HistoryTable;
