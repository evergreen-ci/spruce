import React, { Fragment, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { Body } from "@leafygreen-ui/typography";
import { Table, Skeleton, Input } from "antd";
import { SortOrder } from "antd/es/table/interface";
import debounce from "lodash.debounce";
import get from "lodash/get";
import { useParams, useLocation } from "react-router-dom";
import { H3, WordBreak } from "components/Typography";
import { size } from "constants/tokens";
import {
  TaskFilesQuery,
  TaskFilesQueryVariables,
  File,
  GroupedFiles,
} from "gql/generated/types";
import { GET_TASK_FILES } from "gql/queries";
import { RequiredQueryParams } from "types/task";
import { queryString } from "utils";

const { parseQueryString, queryParamAsNumber } = queryString;

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: string, record: File): JSX.Element => (
      <a
        data-cy="fileLink"
        href={record.link}
        rel="noopener noreferrer"
        target="_blank"
      >
        <WordBreak>{text}</WordBreak>
      </a>
    ),
    defaultSortOrder: "ascend" as SortOrder,
    sorter: (a: File, b: File): number => a.name.localeCompare(b.name),
  },
];

export const FilesTables: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { search: queryVars } = useLocation();
  const parsed = parseQueryString(queryVars);
  const initialExecution = queryParamAsNumber(
    parsed[RequiredQueryParams.Execution]
  );
  const { data, loading, error } = useQuery<
    TaskFilesQuery,
    TaskFilesQueryVariables
  >(GET_TASK_FILES, {
    variables: {
      id,
      execution: initialExecution,
    },
  });
  const [filterStr, setFilterStr] = useState("");
  const [filteredData, setFilteredData] = useState<[GroupedFiles]>();

  useEffect(
    () =>
      debounce(() => {
        if (data) {
          const nextData = data.taskFiles.groupedFiles.map((currVal) => ({
            taskName: currVal.taskName,
            files: filterStr.length
              ? currVal.files.filter(({ name }) =>
                  name.toLowerCase().includes(filterStr.toLowerCase())
                )
              : currVal.files,
          })) as [GroupedFiles];
          setFilteredData(nextData);
        }
      }, 300)(),
    [data, filterStr]
  );

  if (error) {
    return <div>{error.message}</div>;
  }

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFilterStr(e.target.value);
  };

  const rowKey = (record: File): string => `${record.name}_${record.link}`;

  const renderTable = () => {
    if (loading || (!filteredData && data)) {
      return <Skeleton active title={false} paragraph={{ rows: 8 }} />;
    }
    const filteredFiles = (filteredData || []).filter(({ files }) =>
      get(files, "length", 0)
    );
    if (!filteredFiles.length) {
      return <Body>No files found</Body>;
    }
    return filteredFiles.map(({ taskName, files }) => (
      <Fragment key={taskName}>
        {filteredData?.length > 1 && <H3>{taskName}</H3>}
        <StyledTable
          rowKey={rowKey}
          columns={columns}
          dataSource={files}
          pagination={false}
          data-cy="files-table"
        />
      </Fragment>
    ));
  };

  return (
    <>
      <div>
        <StyledInput
          placeholder="Search File Names"
          onChange={onSearch}
          suffix={<Icon glyph="MagnifyingGlass" />}
          data-cy="file-input"
        />
      </div>
      {renderTable()}
    </>
  );
};

const StyledTable = styled(Table)`
  padding-top: ${size.s}px;
  padding-bottom: ${size.s}px;
`;

const StyledInput = styled(Input)`
  margin-bottom: ${size.s}px;
  max-width: 500px;
`;
