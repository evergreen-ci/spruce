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

export const CodeChanges = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<GetCodeChangesQuery>(
    GET_CODE_CHANGES,
    {
      variables: { id }
    }
  );
  if (loading) {
    return <Skeleton active={true} title={true} paragraph={{ rows: 8 }} />;
  }
  if (error) {
    return <div id="patch-error">{error.message}</div>;
  }
  if (!data.patch.moduleCodeChanges.length) {
    return <Title className="cy-no-code-changes">No code changes</Title>;
  }
  return (
    <div data-cy="code-changes">
      {data.patch.moduleCodeChanges.map(modCodeChange => {
        const sortedFileDiffs = [...modCodeChange.fileDiffs].sort((a, b) =>
          a.fileName.localeCompare(b.fileName)
        );
        return (
          <div key={modCodeChange.branchName}>
            <Title>Changes on {modCodeChange.branchName}: </Title>
            <StyledButton
              className="cy-html-diff-btn"
              size="small"
              title="Open diff as html file"
              href={modCodeChange.htmlLink}
            >
              HTML
            </StyledButton>
            <StyledButton
              className="cy-raw-diff-btn"
              size="small"
              title="Open diff as raw file"
              href={modCodeChange.rawLink}
            >
              Raw
            </StyledButton>
            <StyledTable
              className="cy-code-changes-table"
              rowKey={rowKey}
              columns={columns}
              dataSource={sortedFileDiffs}
              pagination={false}
              scroll={{ y: 300 }}
            />
          </div>
        );
      })}
    </div>
  );
};

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
    }
  },
  {
    title: "Additions",
    dataIndex: "additions",
    key: "additions",
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
    render: (text: number) => (text === 0 ? text : <Deletion>-{text}</Deletion>)
  }
];

const rowKey = (record: FileDiff, index: number): string => `${index}`;

const StyledButton = styled(Button)`
  margin-left: 16px;
`;

const Addition = styled.span`
  color: ${uiColors.green.base};
`;

const Deletion = styled.span`
  color: ${uiColors.red.base};
`;

const StyledTable = styled(Table)`
  margin-top: 13px;
  margin-bottom: 13px;
`;

const Title = styled(H2)`
  font-weight: normal;
`;
