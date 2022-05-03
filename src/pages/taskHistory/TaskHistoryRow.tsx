import { memo } from "react";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { context, Cell, Row, types, hooks } from "components/HistoryTable";
import { ListChildComponentProps, areEqual } from "react-window";
import { array } from "utils";

const { convertArrayToObject } = array;
const { TaskCell, EmptyCell } = Cell;
const { useHistoryTable } = context;
const { useTestResults } = hooks;
const { rowType } = types;

const TaskHistoryRow = memo((props: ListChildComponentProps) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Task history" });
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
    <Row
      {...props}
      columns={orderedColumns}
      numVisibleCols={visibleColumns.length}
      selected={commit?.selected}
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
}, areEqual);

export default TaskHistoryRow;
