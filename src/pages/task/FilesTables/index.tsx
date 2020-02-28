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
import Icon from "@leafygreen-ui/icon";
import { Input } from "antd";
import debounce from "lodash.debounce";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: string, record: File, index: number): JSX.Element => {
      return (
        <a
          className="fileLink"
          href={record.link}
          rel="noopener noreferrer"
          target="_blank"
        >
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

  useEffect(
    debounce(() => {
      if (data) {
        const nextData = data.taskFiles.map(currVal => ({
          taskName: currVal.taskName,
          files: filterStr.length
            ? currVal.files.filter(({ name }) =>
                name.toLowerCase().includes(filterStr.toLowerCase())
              )
            : currVal.files
        })) as [TaskFilesData];
        setFilteredData(nextData);
      }
    }, 300),
    [data, filterStr]
  );

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  if (!filteredData && data) {
    // this will happen once per mount
    return <></>;
  }

  const onSearch = (e): void => {
    setFilterStr(e.target.value);
  };

  const tables = filteredData
    .filter(({ files }) => files.length)
    .map(({ taskName, files }) => {
      return (
        <Fragment key={taskName}>
          <H3>{taskName}</H3>
          <StyledTable
            rowKey={(record: File): string => `${record.name}_${record.link}`}
            columns={columns}
            dataSource={files}
            pagination={false}
            scroll={{ y: 196 }}
          />
        </Fragment>
      );
    });
  const body = tables.length ? tables : <div>No files found</div>;
  return (
    <>
      <StyledInput
        placeholder="Search File Names"
        onChange={onSearch}
        suffix={<Icon glyph="MagnifyingGlass" />}
      />
      {body}
    </>
  );
};

const StyledTable = styled(Table)`
  padding-top: 15px;
  padding-bottom: 15px;
`;

const StyledInput = styled(Input)`
  margin-bottom: 15px;
  max-width: 500px;
`;
