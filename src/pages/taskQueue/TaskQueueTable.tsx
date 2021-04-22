import React, { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { useParams, useLocation } from "react-router-dom";
import { useTaskQueueAnalytics } from "analytics";
import Badge from "components/Badge";
import { StyledRouterLink, StyledLink } from "components/styles";
import { getVersionRoute, getTaskRoute } from "constants/routes";
import {
  DistroTaskQueueQuery,
  DistroTaskQueueQueryVariables,
  TaskQueueItem,
  TaskQueueItemType,
} from "gql/generated/types";
import { DISTRO_TASK_QUEUE } from "gql/queries";
import { usePrevious } from "hooks";
import { environmentalVariables, string } from "utils";

const { msToDuration } = string;
const { getUiUrl } = environmentalVariables;

export const TaskQueueTable = () => {
  const taskQueueAnalytics = useTaskQueueAnalytics();

  const { distro, taskId } = useParams<{ distro: string; taskId?: string }>();

  const { data: taskQueueItemsData, loading, refetch: refetchQueue } = useQuery<
    DistroTaskQueueQuery,
    DistroTaskQueueQueryVariables
  >(DISTRO_TASK_QUEUE, {
    variables: { distroId: distro },
    errorPolicy: "ignore",
  });

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
      title: "",
      dataIndex: "number",
      key: "number",
      className: "cy-task-queue-col-index",
      render: (...[, , index]) => <Body weight="medium">{index + 1}</Body>,
    },
    {
      title: "Task",
      dataIndex: "displayName",
      key: "displayName",
      className: "cy-task-queue-col-task",
      width: "30%",
      render: (_, { displayName, id, project, buildVariant, requester }) => (
        <TaskCell>
          <Body>
            {requester === TaskQueueItemType.Patch ? (
              <StyledRouterLink
                data-cy="current-task-link"
                to={getTaskRoute(id)}
                onClick={() =>
                  taskQueueAnalytics.sendEvent({ name: "Click Task Link" })
                }
              >
                {displayName}
              </StyledRouterLink>
            ) : (
              <StyledLink
                data-cy="current-task-link"
                href={`${getUiUrl()}/task/${id}`}
                onClick={() =>
                  taskQueueAnalytics.sendEvent({ name: "Click Version Link" })
                }
              >
                {displayName}
              </StyledLink>
            )}
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
      className: "cy-task-queue-col-runtime",
      width: "15%",
      render: (runtimeMilliseconds) => msToDuration(runtimeMilliseconds),
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      className: "cy-task-queue-col-version",
      width: "30%",
      render: (value, { requester }) =>
        requester === TaskQueueItemType.Patch ? (
          <StyledRouterLink
            to={getVersionRoute(value)}
            onClick={() =>
              taskQueueAnalytics.sendEvent({ name: "Click Version Link" })
            }
          >
            {value}
          </StyledRouterLink>
        ) : (
          <StyledLink
            href={`${getUiUrl()}/version/${value}`}
            onClick={() =>
              taskQueueAnalytics.sendEvent({ name: "Click Version Link" })
            }
          >
            {value}
          </StyledLink>
        ),
    },
    {
      title: "Task Type",
      dataIndex: "requester",
      key: "requester",
      className: "cy-task-queue-col-type",
      width: "15%",
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
      loading={loading}
    />
  );
};

const TaskCell = styled.div`
  display: flex;
  flex-direction: column;
`;
