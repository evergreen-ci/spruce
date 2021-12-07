import { ListChildComponentProps } from "react-window";
import {
  context,
  Cell,
  Row,
  types,
  useTestResults,
} from "components/HistoryTable";
import { array } from "utils";

const { convertArrayToObject } = array;
const { TaskCell, EmptyCell } = Cell;
const { useHistoryTable } = context;
const { rowType } = types;

const TaskHistoryRow: React.FC<ListChildComponentProps> = (props) => {
  let orderedColumns = [];
  const { index } = props;
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
          const { inactive, failingTests, label } = getTaskMetadata(t.id);
          return (
            <TaskCell
              aria-disabled={inactive}
              inactive={inactive}
              key={c}
              task={t}
              failingTests={failingTests}
              label={label}
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
    />
  );
};

export default TaskHistoryRow;
