import React, { useRef, useState, useEffect } from "react";
import { Table } from "antd";
import { ColumnProps, TableRowSelection } from "antd/es/table";
import { VariableSizeGrid as Grid } from "react-window";
import ResizeObserver from "rc-resize-observer";
import { useQuery } from "@apollo/react-hooks";
import {
  DistroTaskQueueQuery,
  DistroTaskQueueQueryVariables,
  TaskQueueItem,
} from "gql/generated/types";
import { DISTRO_TASK_QUEUE } from "gql/queries";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  TableContainer,
  TableControlOuterRow,
  TableControlInnerRow,
  PageWrapper,
} from "components/styles";

export const TaskQueue = () => {
  const gridRef = useRef<any>();

  const { data: taskQueueItemsData } = useQuery<
    DistroTaskQueueQuery,
    DistroTaskQueueQueryVariables
  >(DISTRO_TASK_QUEUE, { variables: { distroId: "osx-108" } });

  const taskQueueItems = taskQueueItemsData?.distroTaskQueue ?? [];

  const columns: Array<ColumnProps<TaskQueueItem>> = [
    {
      title: "Task",
      dataIndex: "displayName",
      key: "displayName",
      className: "cy-hosts-table-col-ID",
      width: "25%",
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
    },
    {
      title: "Task Type",
      dataIndex: "requester",
      key: "requester",
      className: "cy-hosts-table-col-ID",
      width: "25%",
    },
  ];

  const renderVirtualList = (rawData) => {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            ref={gridRef}
            className="virtual-grid"
            columnCount={4}
            columnWidth={() => width / 4}
            height={height}
            rowCount={taskQueueItems.length}
            rowHeight={() => 54}
            width={width}
            onScroll={() => undefined}
          >
            {({ columnIndex, rowIndex, style }) => (
              <div style={style}>
                {taskQueueItems[rowIndex][columns[columnIndex].dataIndex]}
              </div>
            )}
          </Grid>
        )}
      </AutoSizer>
    );
  };

  return (
    <PageWrapper>
      <TableContainer hide={false}>
        <Table
          columns={columns}
          rowKey={({ id }: { id: string }): string => id}
          pagination={false}
          dataSource={taskQueueItems}
          components={{
            body: {
              wrapper: renderVirtualList,
            },
          }}
        />
      </TableContainer>
    </PageWrapper>
  );
};
