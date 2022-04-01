import { memo } from "react";
import { ListChildComponentProps, areEqual } from "react-window";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { context, Cell, Row, types, hooks } from "components/HistoryTable";
import { TaskCellAnalytics } from "components/HistoryTable/Cell/Cell";
import { FoldedCommitAnalytics } from "components/HistoryTable/HistoryTableRow/FoldedCommit";
import { array } from "utils";

const { convertArrayToObject } = array;
const { TaskCell, EmptyCell } = Cell;
const { useHistoryTable } = context;
const { useTestResults } = hooks;
const { rowType } = types;

const VariantHistoryRow = memo((props: ListChildComponentProps) => {
  const { sendEvent } = useProjectHealthAnalytics();
  const { index } = props;
  let orderedColumns = [];
  const { visibleColumns, getItem } = useHistoryTable();

  const commit = getItem(index);
  const { getTaskMetadata } = useTestResults(index);

  if (commit && commit.type === rowType.COMMIT && commit.commit) {
    const { buildVariants } = commit.commit;
    orderedColumns = visibleColumns.map((c) => {
      if (buildVariants && buildVariants.length > 0) {
        const { tasks } = buildVariants[0];
        const taskMap = convertArrayToObject(tasks, "displayName");
        const t = taskMap[c];
        if (t) {
          const { inactive, failingTests, label } = getTaskMetadata(t.id);
          return (
            <TaskCell
              inactive={inactive}
              key={c}
              task={t}
              failingTests={failingTests}
              label={label}
              sendAnalytics={(v: TaskCellAnalytics) => {
                sendEvent({ name: "Click variant history task cell", ...v });
              }}
            />
          );
        }
      }
      // Returned if the task did not run for this commit
      return <EmptyCell key={`empty_task_${c}`} />;
    });
  }
  return (
    <Row
      {...props}
      columns={orderedColumns}
      numVisibleCols={visibleColumns.length}
      sendFoldedCommitAnalytics={(v: FoldedCommitAnalytics) => {
        sendEvent({ name: "Toggle variant history folded commit", ...v });
      }}
      selected={commit?.selected}
    />
  );
}, areEqual);

export default VariantHistoryRow;
