import { ListChildComponentProps } from "react-window";
import { useHistoryTable } from "components/HistoryTable/HistoryTableContext";
import Row, { TaskCell, Cell } from "components/HistoryTable/Row";
import { rowType } from "components/HistoryTable/types";

const TaskHistoryRow: React.FC<ListChildComponentProps> = ({ ...rest }) => {
  let orderedColumns = [];
  const { index } = rest;
  const { visibleColumns, getItem, isItemLoaded } = useHistoryTable();
  const commit = getItem(index);

  if (isItemLoaded(index) && commit.type === rowType.COMMIT && commit.commit) {
    const { buildVariants } = commit.commit;
    orderedColumns = visibleColumns.map((c) => {
      const foundVariant = buildVariants.find((bv) => bv.variant === c);
      if (foundVariant) {
        const { tasks } = foundVariant;
        return <TaskCell key={c} task={tasks[0]} />;
      }
      // Returned if the build variant did not run for this commit
      return <Cell key={`empty_variant_${c}`}>DNR</Cell>;
    });
  }
  return <Row {...rest} columns={orderedColumns} />;
};

export default TaskHistoryRow;
