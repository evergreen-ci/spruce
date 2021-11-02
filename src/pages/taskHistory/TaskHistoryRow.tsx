import { ListChildComponentProps } from "react-window";
import { context, Cell, Row, types } from "components/HistoryTable";

const { TaskCell, EmptyCell } = Cell;
const { useHistoryTable } = context;
const { rowType } = types;

const TaskHistoryRow: React.FC<ListChildComponentProps> = (props) => {
  let orderedColumns = [];
  const { index } = props;
  const { visibleColumns, getItem, isItemLoaded } = useHistoryTable();
  const commit = getItem(index);

  if (isItemLoaded(index) && commit.type === rowType.COMMIT && commit.commit) {
    const { buildVariants } = commit.commit;
    orderedColumns = visibleColumns.map((c) => {
      if (buildVariants) {
        const foundVariant = buildVariants.find((bv) => bv.variant === c);
        if (foundVariant) {
          const { tasks } = foundVariant;
          return <TaskCell key={c} task={tasks[0]} />;
        }
      }
      // Returned if the build variant did not run for this commit
      return <EmptyCell key={`empty_variant_${c}`} />;
    });
  }
  return (
    <Row {...props} columns={orderedColumns} visibleCols={visibleColumns} />
  );
};

export default TaskHistoryRow;
