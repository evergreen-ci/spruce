import { ListChildComponentProps } from "react-window";
import { useHistoryTable } from "components/HistoryTable/HistoryTableContext";
import Row, { Cell } from "components/HistoryTable/Row";
import { rowType } from "components/HistoryTable/types";

const { TaskCell, EmptyCell } = Cell;

const VariantHistoryRow: React.FC<ListChildComponentProps> = ({ ...rest }) => {
  let orderedColumns = [];
  const { index } = rest;
  const { visibleColumns, getItem, isItemLoaded } = useHistoryTable();
  const commit = getItem(index);

  if (isItemLoaded(index) && commit.type === rowType.COMMIT && commit.commit) {
    const { buildVariants } = commit.commit;
    orderedColumns = visibleColumns.map((c) => {
      if (buildVariants.length > 0) {
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
  return <Row {...rest} columns={orderedColumns} />;
};

export default VariantHistoryRow;
