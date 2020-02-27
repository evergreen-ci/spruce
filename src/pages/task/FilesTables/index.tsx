import React, { Fragment } from "react";
import { useParams } from "react-router-dom";
import {
  GET_TASK_FILES,
  TaskFilesResponse,
  TaskFilesVars,
  File
} from "gql/queries/get-task-files";
import Table, { SortOrder } from "antd/es/table";
import { useQuery } from "@apollo/react-hooks/lib/useQuery";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: string, record: File): JSX.Element => {
      return (
        <a href={record.link} rel="noopener noreferrer" target="_blank">
          {text}
        </a>
      );
    },
    defaultSortOrder: "ascend" as SortOrder,
    sorter: (a: File, b: File): number => a.name.localeCompare(b.name)
  }
];
export const FilesTables: React.FC = () => {
  const { taskID } = useParams();
  const { data, loading, error } = useQuery<TaskFilesResponse, TaskFilesVars>(
    GET_TASK_FILES,
    {
      variables: {
        id: taskID
      }
    }
  );

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      {data.taskFiles.map(({ taskName, files }) => {
        return (
          <Fragment key={taskName}>
            <div>{taskName}</div>
            <Table
              rowKey={(record): string => `${record.name}_${record.link}`}
              columns={columns}
              dataSource={files}
              pagination={false}
            ></Table>
          </Fragment>
        );
      })}
    </>
  );
};
