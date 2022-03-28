import { ListChildComponentProps } from "react-window";
import { context, Cell, Row, types, hooks } from "components/HistoryTable";
import { array } from "utils";

const { convertArrayToObject } = array;
const { TaskCell, EmptyCell } = Cell;
const { useHistoryTable } = context;
const { useTestResults } = hooks;
const { rowType } = types;

const VariantHistoryRow: React.FC<ListChildComponentProps> = (props) => {
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
    />
  );
};

export default VariantHistoryRow;
