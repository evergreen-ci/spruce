import { useMemo } from "react";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { context, Cell, types, hooks } from "components/HistoryTable";
import BaseRow from "components/HistoryTable/HistoryTableRow/BaseRow";
import { array } from "utils";

const { convertArrayToObject } = array;
const { EmptyCell, TaskCell } = Cell;
const { useHistoryTable } = context;
const { useTestResults } = hooks;
const { rowType } = types;

interface Props {
  index: number;
  data: types.CommitRowType;
}
const VariantHistoryRow: React.VFC<Props> = ({ data, index }) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Variant history" });
  const { visibleColumns } = useHistoryTable();

  const { getTaskMetadata } = useTestResults(index);
  const orderedColumns = useMemo(
    () =>
      data.type === rowType.COMMIT
        ? generateColumns(data, visibleColumns, getTaskMetadata, sendEvent)
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleColumns, getTaskMetadata]
  );
  const eventHandlers = useMemo(
    () => ({
      onClickFoldedGithash: () =>
        sendEvent({
          commitType: "inactive",
          link: "githash",
          name: "Click commit label",
        }),
      onClickFoldedJiraTicket: () => {
        sendEvent({
          commitType: "inactive",
          link: "jira",
          name: "Click commit label",
        });
      },
      onClickFoldedUpstreamProject: () => {
        sendEvent({
          commitType: "inactive",
          link: "upstream project",
          name: "Click commit label",
        });
      },
      onClickGithash: () =>
        sendEvent({
          commitType: "active",
          link: "githash",
          name: "Click commit label",
        }),
      onClickJiraTicket: () => {
        sendEvent({
          commitType: "active",
          link: "jira",
          name: "Click commit label",
        });
      },
      onClickUpstreamProject: () => {
        sendEvent({
          commitType: "active",
          link: "upstream project",
          name: "Click commit label",
        });
      },
      onToggleFoldedCommit: ({ isVisible }) => {
        sendEvent({
          name: "Toggle folded commit",
          toggle: isVisible ? "open" : "close",
        });
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <BaseRow
      data={data}
      index={index}
      columns={orderedColumns}
      numVisibleCols={visibleColumns.length}
      selected={data?.selected}
      eventHandlers={eventHandlers}
    />
  );
};

const generateColumns = (
  data: types.CommitRow,
  visibleColumns: string[],
  getTaskMetadata: ReturnType<typeof useTestResults>["getTaskMetadata"],
  sendEvent: ReturnType<typeof useProjectHealthAnalytics>["sendEvent"]
) => {
  const { buildVariants } = data.commit;
  return visibleColumns.map((c) => {
    if (buildVariants && buildVariants.length > 0) {
      const { tasks } = buildVariants[0];
      const taskMap = convertArrayToObject(tasks, "displayName");
      const t = taskMap[c];
      if (t) {
        const { failingTests, inactive, label } = getTaskMetadata(t.id);
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
};

export default VariantHistoryRow;
