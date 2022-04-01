import { memo } from "react";
import { ListChildComponentProps, areEqual } from "react-window";
import { context, Cell, Row, types, hooks } from "components/HistoryTable";
import { array } from "utils";

const { convertArrayToObject } = array;
const { TaskCell, EmptyCell } = Cell;
const { useHistoryTable } = context;
const { useTestResults } = hooks;
const { rowType } = types;

const TaskHistoryRow = memo((props: ListChildComponentProps) => {
  const { index } = props;
  let orderedColumns = [];
  const { visibleColumns, getItem } = useHistoryTable();

  const commit = getItem(index);
  const { getTaskMetadata } = useTestResults(index);

  if (commit && commit.type === rowType.COMMIT && commit.commit) {
    const { buildVariants } = commit.commit;
    const buildVariantMap = convertArrayToObject(buildVariants, "variant");
    orderedColumns = visibleColumns.map((c) => {
      if (buildVariants) {
        const foundVariant = buildVariantMap[c];
        if (foundVariant) {
          const { tasks } = foundVariant;
          // the tasks array should in theory only have one item in it so we should always use it.
          const t = tasks[0];
          const { inactive, failingTests, label, loading } = getTaskMetadata(
            t.id
          );
          return (
            <TaskCell
              inactive={inactive}
              key={c}
              task={t}
              failingTests={failingTests}
              label={label}
              loading={loading}
            />
          );
        }
      }
      // Returned if the build variant did not run for this commit
      return <EmptyCell key={`empty_variant_${c}`} />;
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

export default TaskHistoryRow;
