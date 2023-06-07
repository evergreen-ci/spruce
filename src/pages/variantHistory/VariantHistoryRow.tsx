import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { context, Cell, types, hooks } from "components/HistoryTable";
import BaseRow from "components/HistoryTable/HistoryTableRow/BaseRow";
import { array } from "utils";

const { convertArrayToObject } = array;
const { TaskCell, EmptyCell } = Cell;
const { useHistoryTable } = context;
const { useTestResults } = hooks;
const { rowType } = types;

interface Props {
  index: number;
  data: types.CommitRowType;
}
const VariantHistoryRow: React.VFC<Props> = ({ index, data }) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Variant history" });
  let orderedColumns = [];
  const { visibleColumns } = useHistoryTable();

  const { getTaskMetadata } = useTestResults(index);

  if (data && data.type === rowType.COMMIT && data.commit) {
    const { buildVariants } = data.commit;
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
    <BaseRow
      data={data}
      index={index}
      columns={orderedColumns}
      numVisibleCols={visibleColumns.length}
      selected={data?.selected}
      onClickGithash={() =>
        sendEvent({
          name: "Click commit label",
          link: "githash",
          commitType: "active",
        })
      }
      onClickFoldedGithash={() =>
        sendEvent({
          name: "Click commit label",
          link: "githash",
          commitType: "inactive",
        })
      }
      onClickUpstreamProject={() => {
        sendEvent({
          name: "Click commit label",
          link: "upstream project",
          commitType: "active",
        });
      }}
      onClickFoldedUpstreamProject={() => {
        sendEvent({
          name: "Click commit label",
          link: "upstream project",
          commitType: "inactive",
        });
      }}
      onClickJiraTicket={() => {
        sendEvent({
          name: "Click commit label",
          link: "jira",
          commitType: "active",
        });
      }}
      onClickFoldedJiraTicket={() => {
        sendEvent({
          name: "Click commit label",
          link: "jira",
          commitType: "inactive",
        });
      }}
      onToggleFoldedCommit={({ isVisible }) => {
        sendEvent({
          name: "Toggle folded commit",
          toggle: isVisible ? "open" : "close",
        });
      }}
    />
  );
};

export default VariantHistoryRow;
