import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import { Skeleton, Table } from "antd";
import { H2 } from "components/Typography";
import { uiColors } from "@leafygreen-ui/palette";
import {
  GET_CODE_CHANGES,
  GetCodeChangesQuery,
  FileDiff
} from "gql/queries/get-code-changes";
import Button from "@leafygreen-ui/button";
import styled from "@emotion/styled";
import { SortOrder } from "antd/es/table";

export const CodeChanges = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<GetCodeChangesQuery>(
    GET_CODE_CHANGES,
    {
      variables: { id: id }
    }
  );
  if (loading) {
    return <Skeleton active={true} title={true} paragraph={{ rows: 8 }} />;
  }
  if (error) {
    return <div id="patch-error">{error.message}</div>;
  }
  const content = data.patch.moduleCodeChanges.map(modCodeChange => {
    return (
      <div key={modCodeChange.branchName}>
        <H2>Changes on {modCodeChange.branchName}: </H2>
        <StyledButton
          size="small"
          title="Open diff as html file"
          href={modCodeChange.htmlLink}
        >
          HTML
        </StyledButton>
        <StyledButton
          size="small"
          title="Open diff as raw file"
          href={modCodeChange.rawLink}
        >
          RAW
        </StyledButton>
        <StyledTable
          rowKey={rowKey}
          columns={columns}
          dataSource={modCodeChange.fileDiffs}
          pagination={false}
          scroll={{ y: 196 }}
        />
      </div>
    );
  });
  return <div>{content}</div>;
};

const StyledButton = styled(Button)`
  margin-left: 16px;
`;

const columns = [
  {
    title: "File",
    dataIndex: "fileName",
    key: "fileName",
    render: (text: string, record: FileDiff): JSX.Element => {
      return (
        <a
          className="fileLink"
          href={record.diffLink}
          rel="noopener noreferrer"
          target="_blank"
        >
          {text}
        </a>
      );
    },
    defaultSortOrder: "ascend" as SortOrder,
    sorter: (a: FileDiff, b: FileDiff): number =>
      a.fileName.localeCompare(b.fileName)
  },
  {
    title: "Additions",
    dataIndex: "additions",
    key: "additions",
    sorter: (a: FileDiff, b: FileDiff): number =>
      a.additions < b.additions ? -1 : 1,
    render: (text: number) => {
      if (text === 0) {
        return text;
      }
      return <Addition>+{text}</Addition>;
    }
  },
  {
    title: "Deletions",
    dataIndex: "deletions",
    key: "deletions",
    sorter: (a: FileDiff, b: FileDiff): number =>
      a.deletions < b.deletions ? -1 : 1,
    render: (text: number) => {
      if (text === 0) {
        return text;
      }
      return <Deletion>-{text}</Deletion>;
    }
  }
];

const rowKey = (record: FileDiff): string => record.fileName;

const Addition = styled.span`
  color: ${uiColors.green.base};
`;

const Deletion = styled.span`
  color: ${uiColors.red.base};
`;

const StyledTable = styled(Table)`
  margin-top: 13px;
`;
