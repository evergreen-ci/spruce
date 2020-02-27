import React, { Fragment, useState, useEffect } from "react";
import {
  File,
  GET_TASK_FILES,
  TaskFilesResponse,
  TaskFilesVars,
  TaskFilesData
} from "gql/queries/get-task-files";
import { H3 } from "components/Typography";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks/lib/useQuery";
import styled from "@emotion/styled/macro";
import Table, { SortOrder } from "antd/es/table";

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
  const [filterStr, setFilterStr] = useState("");
  const [filteredData, setFilteredData] = useState<[TaskFilesData]>();
  useEffect(() => {
    const nextData = data.taskFiles.map(currVal => ({
      taskName: currVal.taskName,
      files: filterStr.length
        ? currVal.files.filter(({ name }) => name.includes(filterStr))
        : currVal.files
    })) as [TaskFilesData];
    setFilteredData(nextData);
  }, [data, filterStr]);

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
            <H3>{taskName}</H3>
            <StyledTable
              rowKey={(record: File): string => `${record.name}_${record.link}`}
              columns={columns}
              dataSource={filteredData}
              pagination={false}
            />
          </Fragment>
        );
      })}
    </>
  );
};

const StyledTable = styled(Table)`
  padding-top: 15px;
  padding-bottom: 15px;
`;
