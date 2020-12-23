import React from "react";
import styled from "@emotion/styled";
import { Table } from "antd";
import { FileDiffText } from "components/CodeChangesBadge";
import { CodeChangesTableFileDiffsFragment } from "gql/generated/types";

interface CodeChangesTableProps {
  fileDiffs: CodeChangesTableFileDiffsFragment[];
  showHeader?: boolean;
}
export const CodeChangesTable: React.FC<CodeChangesTableProps> = ({
  fileDiffs,
  showHeader = true,
}) => (
  <StyledTable
    data-cy="code-changes-table"
    rowKey={rowKey}
    columns={columns(showHeader)}
    dataSource={fileDiffs}
    pagination={false}
    showHeader={showHeader}
  />
);

const rowKey = (
  record: CodeChangesTableFileDiffsFragment,
  index: number
): string => `${index}`;

const columns = (
  showHeader: boolean
): Array<{
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  render: (
    text: string | number,
    record?: CodeChangesTableFileDiffsFragment
  ) => JSX.Element;
}> => [
  {
    title: "File",
    dataIndex: "fileName",
    key: "fileName",
    render: (
      text: string,
      record: CodeChangesTableFileDiffsFragment
    ): JSX.Element => (
      <a
        className="fileLink"
        href={record.diffLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        {text}
      </a>
    ),
  },
  {
    title: "Additions",
    dataIndex: "additions",
    key: "additions",
    width: !showHeader && 80,
    render: (text: number): JSX.Element => (
      <FileDiffText value={text} type="+" />
    ),
  },
  {
    title: "Deletions",
    dataIndex: "deletions",
    key: "deletions",
    width: !showHeader && 80,
    render: (text: number): JSX.Element => (
      <FileDiffText value={text} type="-" />
    ),
  },
];

const StyledTable = styled(Table)`
  margin-top: 13px;
`;
