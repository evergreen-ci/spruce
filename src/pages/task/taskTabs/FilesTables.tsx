import { Fragment, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import SearchInput from "@leafygreen-ui/search-input";
import { Body, Subtitle } from "@leafygreen-ui/typography";
import { Table, Skeleton } from "antd";
import { SortOrder } from "antd/es/table/interface";
import debounce from "lodash.debounce";
import get from "lodash/get";
import { useParams, useLocation } from "react-router-dom";
import { WordBreak } from "components/styles";
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

export const FilesTables: React.VFC = () => {
  const { id: taskId } = useParams<{ id: string }>();
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
      taskId,
      execution: initialExecution,
    },
  });
  const [filterStr, setFilterStr] = useState("");
  const [filteredData, setFilteredData] = useState<[GroupedFiles]>();

  const { task } = data ?? {};
  const { taskFiles } = task ?? {};

  useEffect(
    () =>
      debounce(() => {
        if (taskFiles) {
          const nextData = taskFiles.groupedFiles.map((currVal) => ({
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
    [taskFiles, filterStr]
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
        {filteredData?.length > 1 && <Subtitle>{taskName}</Subtitle>}
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
    <ContentWrapper>
      <TextInputWrapper>
        <SearchInput
          aria-labelledby="search-file-names-input"
          placeholder="Search file names"
          onChange={onSearch}
          data-cy="file-input"
        />
      </TextInputWrapper>
      {renderTable()}
    </ContentWrapper>
  );
};

const ContentWrapper = styled.div`
  padding: 0 ${size.xxs};
`;

const TextInputWrapper = styled.div`
  margin-bottom: ${size.s};
  width: 50%;
`;

const StyledTable = styled(Table)`
  padding-top: ${size.s};
  padding-bottom: ${size.s};
`;
