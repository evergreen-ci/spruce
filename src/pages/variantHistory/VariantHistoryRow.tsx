import { ListChildComponentProps } from "react-window";
import { context, Cell, Row, types } from "components/HistoryTable";

const { TaskCell, EmptyCell } = Cell;
const { useHistoryTable } = context;
const { rowType } = types;

const VariantHistoryRow: React.FC<ListChildComponentProps> = (props) => {
  let orderedColumns = [];
  const { index } = props;
  const { visibleColumns, getItem, isItemLoaded } = useHistoryTable();
  const commit = getItem(index);

  if (isItemLoaded(index) && commit.type === rowType.COMMIT && commit.commit) {
    const { buildVariants } = commit.commit;
    orderedColumns = visibleColumns.map((c) => {
      if (buildVariants && buildVariants.length > 0) {
        const { tasks } = buildVariants[0];
        const foundTask = tasks.find((t) => t.displayName === c);
        if (foundTask) {
          return <TaskCell key={c} task={foundTask} />;
        }
      }
      // Returned if the task did not run for this commit
      return <EmptyCell key={`empty_task_${c}`} />;
    });
  }
  return <Row {...props} columns={orderedColumns} />;
};

export default VariantHistoryRow;
