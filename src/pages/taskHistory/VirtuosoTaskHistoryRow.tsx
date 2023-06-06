import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { context, Cell, types, hooks } from "components/HistoryTable";
import VirtuosoRow from "components/HistoryTable/HistoryTableRow/VirtuosoRow";
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
const TaskHistoryRow: React.VFC<Props> = ({ index, data }) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Task history" });
  let orderedColumns = [];
  const { visibleColumns } = useHistoryTable();

  const { getTaskMetadata } = useTestResults(index);

  if (data && data.type === rowType.COMMIT && data.commit) {
    const { buildVariants } = data.commit;
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
    <VirtuosoRow
      data={data}
      index={index}
      columns={orderedColumns}
      numVisibleCols={visibleColumns.length}
      selected={data?.selected}
      onClickGithash={() => {
        sendEvent({
          name: "Click commit label",
          link: "githash",
          commitType: "active",
        });
      }}
      onClickUpstreamProject={() => {
        sendEvent({
          name: "Click commit label",
          link: "upstream project",
          commitType: "active",
        });
      }}
      onClickFoldedGithash={() => {
        sendEvent({
          name: "Click commit label",
          link: "githash",
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
      onClickFoldedUpstreamProject={() => {
        sendEvent({
          name: "Click commit label",
          link: "upstream project",
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

export default TaskHistoryRow;
