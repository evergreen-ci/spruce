import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { useParams } from "react-router-dom";
import { useTaskQueueAnalytics } from "analytics";
import { StyledRouterLink, WordBreak } from "components/styles";
import {
  getVersionRoute,
  getTaskRoute,
  getUserPatchesRoute,
} from "constants/routes";
import {
  DistroTaskQueueQuery,
  DistroTaskQueueQueryVariables,
  TaskQueueItem,
  TaskQueueItemType,
} from "gql/generated/types";
import { DISTRO_TASK_QUEUE } from "gql/queries";
import { formatZeroIndexForDisplay } from "utils/numbers";
import { msToDuration } from "utils/string";

export const TaskQueueTable = () => {
  const taskQueueAnalytics = useTaskQueueAnalytics();

  const { distro, taskId } = useParams<{ distro: string; taskId?: string }>();

  const { data: taskQueueItemsData, loading } = useQuery<
    DistroTaskQueueQuery,
    DistroTaskQueueQueryVariables
  >(DISTRO_TASK_QUEUE, {
    variables: { distroId: distro },
  });

  const taskQueueItems = taskQueueItemsData?.distroTaskQueue ?? [];

  // SCROLL TO TASK
  const taskRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (taskRowRef.current) {
      taskRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [taskId]);

  const columns: Array<ColumnProps<TaskQueueItem>> = [
    {
      title: "",
      dataIndex: "number",
      key: "number",
      render: (...[, , index]) => (
        <Body weight="medium">{formatZeroIndexForDisplay(index)}</Body>
      ),
    },
    {
      title: "Task",
      dataIndex: "displayName",
      key: "displayName",
      width: "25%",
      render: (_, { displayName, id, project, buildVariant }) => (
        <TaskCell>
          <Body>
            <StyledRouterLink
              data-cy="current-task-link"
              to={getTaskRoute(id)}
              onClick={() =>
                taskQueueAnalytics.sendEvent({ name: "Click Task Link" })
              }
            >
              <WordBreak>{displayName}</WordBreak>
            </StyledRouterLink>
          </Body>
          <Body>{buildVariant}</Body>
          <Disclaimer>{project}</Disclaimer>
        </TaskCell>
      ),
    },
    {
      title: "Est. Runtime",
      dataIndex: "expectedDuration",
      key: "expectedDuration",
      width: "10%",
      render: (runtimeMilliseconds) => msToDuration(runtimeMilliseconds),
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      width: "25%",
      render: (version) => (
        <StyledRouterLink
          to={getVersionRoute(version)}
          onClick={() =>
            taskQueueAnalytics.sendEvent({ name: "Click Version Link" })
          }
        >
          <WordBreak>{version}</WordBreak>
        </StyledRouterLink>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: "10%",
      align: "center",
      render: (priority) => <Badge>{priority}</Badge>,
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      className: "cy-task-queue-col-author",
      width: "10%",
      align: "center",
      render: (author) => (
        <StyledRouterLink
          to={getUserPatchesRoute(author)}
          onClick={() =>
            taskQueueAnalytics.sendEvent({ name: "Click Author Patches Link" })
          }
        >
          <WordBreak>{author}</WordBreak>
        </StyledRouterLink>
      ),
    },
    {
      title: "Task Type",
      dataIndex: "requester",
      key: "requester",
      className: "cy-task-queue-col-type",
      width: "10%",
      align: "center",
      render: (type) => {
        const copy = {
          [TaskQueueItemType.Commit]: "Commit",
          [TaskQueueItemType.Patch]: "Patch",
        }[type];
        return <Badge>{copy}</Badge>;
      },
    },
  ];

  return (
    <Table
      data-cy="task-queue-table"
      columns={columns}
      tableLayout="fixed"
      rowKey={({ id }: { id: string }): string => id}
      rowSelection={{
        hideSelectAll: true,
        selectedRowKeys: [taskId],
        renderCell: (...[, { id }]) =>
          id === taskId ? <div ref={taskRowRef} /> : null,
      }}
      pagination={false}
      dataSource={taskQueueItems}
      loading={loading && taskQueueItems.length === 0}
    />
  );
};

const TaskCell = styled.div`
  display: flex;
  flex-direction: column;
`;
