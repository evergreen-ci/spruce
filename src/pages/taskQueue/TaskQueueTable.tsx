import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { useParams, useLocation } from "react-router-dom";
import { useTaskQueueAnalytics } from "analytics";
import { StyledRouterLink, WordBreak } from "components/styles";
import { getVersionRoute, getTaskRoute } from "constants/routes";
import {
  DistroTaskQueueQuery,
  DistroTaskQueueQueryVariables,
  TaskQueueItem,
  TaskQueueItemType,
} from "gql/generated/types";
import { DISTRO_TASK_QUEUE } from "gql/queries";
import { usePrevious } from "hooks";
import { string } from "utils";
import { formatZeroIndexForDisplay } from "utils/numbers";

const { msToDuration } = string;

export const TaskQueueTable = () => {
  const taskQueueAnalytics = useTaskQueueAnalytics();

  const { distro, taskId } = useParams<{ distro: string; taskId?: string }>();

  const {
    data: taskQueueItemsData,
    loading,
    refetch: refetchQueue,
  } = useQuery<DistroTaskQueueQuery, DistroTaskQueueQueryVariables>(
    DISTRO_TASK_QUEUE,
    {
      errorPolicy: "ignore",
      fetchPolicy: "cache-and-network",
      variables: { distroId: distro },
    }
  );

  const taskQueueItems = taskQueueItemsData?.distroTaskQueue ?? [];

  // REFETCH QUEUE IF URL PARAM CHANGES
  const { search } = useLocation();
  const prevSearch = usePrevious<string>(search);
  const searchChanged = search !== prevSearch;

  useEffect(() => {
    if (searchChanged && distro) {
      refetchQueue({ distroId: distro });
    }
  }, [searchChanged, refetchQueue, distro]);

  // SCROLL TO TASK
  const taskRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (taskRowRef.current) {
      taskRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });

  const columns: Array<ColumnProps<TaskQueueItem>> = [
    {
      className: "cy-task-queue-col-index",
      dataIndex: "number",
      key: "number",
      render: (...[, , index]) => (
        <Body weight="medium">{formatZeroIndexForDisplay(index)}</Body>
      ),
      title: "",
    },
    {
      className: "cy-task-queue-col-task",
      dataIndex: "displayName",
      key: "displayName",
      render: (_, { buildVariant, displayName, id, project }) => (
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
      title: "Task",
      width: "30%",
    },
    {
      className: "cy-task-queue-col-runtime",
      dataIndex: "expectedDuration",
      key: "expectedDuration",
      render: (runtimeMilliseconds) => msToDuration(runtimeMilliseconds),
      title: "Est. Runtime",
      width: "10%",
    },
    {
      className: "cy-task-queue-col-version",
      dataIndex: "version",
      key: "version",
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
      title: "Version",
      width: "30%",
    },
    {
      align: "center",
      className: "cy-task-queue-col-priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => <Badge>{priority}</Badge>,
      title: "Priority",
      width: "10%",
    },
    {
      align: "center",
      className: "cy-task-queue-col-type",
      dataIndex: "requester",
      key: "requester",
      render: (type) => {
        const copy = {
          [TaskQueueItemType.Commit]: "Commit",
          [TaskQueueItemType.Patch]: "Patch",
        }[type];
        return <Badge>{copy}</Badge>;
      },
      title: "Task Type",
      width: "10%",
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
        renderCell: (...[, { id }]) =>
          id === taskId ? <div ref={taskRowRef} /> : null,
        selectedRowKeys: [taskId],
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
