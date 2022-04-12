import { memo } from "react";
import { ListChildComponentProps, areEqual } from "react-window";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { context, Cell, Row, types, hooks } from "components/HistoryTable";
import { array } from "utils";

const { convertArrayToObject } = array;
const { TaskCell, EmptyCell } = Cell;
const { useHistoryTable } = context;
const { useTestResults } = hooks;
const { rowType } = types;

const VariantHistoryRow = memo((props: ListChildComponentProps) => {
  const { index } = props;
  const { sendEvent } = useProjectHealthAnalytics();
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
              onClick={({ taskStatus }) => {
                sendEvent({
                  name: "Click task cell",
                  page: "Variant history",
                  taskStatus,
                });
              }}
              inactive={inactive}
              key={c}
              task={t}
              failingTests={failingTests}
              label={label}
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
      selected={commit?.selected}
    />
  );
}, areEqual);

export default VariantHistoryRow;
