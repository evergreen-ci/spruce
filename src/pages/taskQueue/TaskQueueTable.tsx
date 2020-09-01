import React, { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { useParams, useLocation } from "react-router-dom";
import { StyledRouterLink } from "components/styles";
import { getTaskRoute } from "constants/routes";
import {
  DistroTaskQueueQuery,
  DistroTaskQueueQueryVariables,
  TaskQueueItem,
} from "gql/generated/types";
import { DISTRO_TASK_QUEUE } from "gql/queries";
import { usePrevious } from "hooks";

export const TaskQueueTable = () => {
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
      className: "cy-hosts-table-col-index",
      render: (...[, , index]) => <Body weight="medium">{index + 1}</Body>,
    },
    {
      title: "Task",
      dataIndex: "displayName",
      key: "displayName",
      className: "cy-hosts-table-col-ID",
      width: "25%",
      render: (_, { displayName, id, project, buildVariant }) => (
        <TaskCell>
          <Body>
            <StyledRouterLink data-cy="current-task-link" to={getTaskRoute(id)}>
              {displayName}
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
      className: "cy-hosts-table-col-ID",
      width: "25%",
    },
    {
      title: "Revision",
      dataIndex: "revision",
      key: "revision",
      className: "cy-hosts-table-col-ID",
      width: "25%",
      render: (value) => value.slice(0, 7),
    },
    {
      title: "Task Type",
      dataIndex: "requester",
      key: "requester",
      className: "cy-hosts-table-col-ID",
      width: "25%",
    },
  ];

  return (
    <Table
      columns={columns}
      rowKey={({ id }: { id: string }): string => id}
      rowSelection={{
        hideSelectAll: true,
        selectedRowKeys: [taskId],
        renderCell(...[, { id }]) {
          if (id === taskId) {
            return <div ref={taskRowRef} />;
          }
          return null;
        },
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
