import { ListChildComponentProps } from "react-window";
import {
  context,
  Cell,
  Row,
  types,
  useTestResults,
} from "components/HistoryTable";

const { TaskCell, EmptyCell } = Cell;
const { useHistoryTable } = context;
const { rowType } = types;

const TaskHistoryRow: React.FC<ListChildComponentProps> = (props) => {
  let orderedColumns = [];
  const { index } = props;
  const {
    visibleColumns,
    getItem,
    isItemLoaded,
    historyTableFilters,
  } = useHistoryTable();
  const commit = getItem(index);
  const { taskTestMap } = useTestResults(index);
  if (isItemLoaded(index) && commit.type === rowType.COMMIT && commit.commit) {
    const { buildVariants } = commit.commit;
    orderedColumns = visibleColumns.map((c) => {
      if (buildVariants) {
        const foundVariant = buildVariants.find((bv) => bv.variant === c);
        if (foundVariant) {
          const { tasks } = foundVariant;
          const t = tasks[0];
          const testResults = taskTestMap.get(t.id);
          const hasResults =
            testResults != null &&
            testResults.matchingFailedTestNames.length > 0;
          const label = hasResults
            ? `${testResults.matchingFailedTestNames.length} / ${testResults.totalTestCount} Failing Tests`
            : undefined;
          return (
            <TaskCell
              inactive={historyTableFilters.length > 0 && !hasResults}
              key={c}
              task={t}
              failingTests={
                hasResults ? testResults.matchingFailedTestNames : undefined
              }
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
