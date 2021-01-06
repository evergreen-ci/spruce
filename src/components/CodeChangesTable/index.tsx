import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { WordBreak } from "components/Typography";
import { FileDiff } from "gql/generated/types";

const { green, red } = uiColors;
export const CodeChangesTable: React.FC<{
  fileDiffs: FileDiff[];
  showHeader?: boolean;
}> = ({ fileDiffs, showHeader = true }) => (
  <StyledTable
    data-cy="code-changes-table"
    rowKey={rowKey}
    columns={columns(showHeader)}
    dataSource={fileDiffs}
    pagination={false}
    showHeader={showHeader}
  />
);

interface FileDiffTextProps {
  type: string;
  value: number;
}

export const FileDiffText: React.FC<FileDiffTextProps> = ({ value, type }) => {
  const hasValue = value > 0;
  return (
    <FileDiffTextContainer hasValue={hasValue} type={type}>
      {hasValue && type}
      {value}
    </FileDiffTextContainer>
  );
};

const rowKey = (record: FileDiff): string =>
  `code_changes_row_${record.diffLink}`;

const columns: (showHeader: boolean) => Array<ColumnProps<FileDiff>> = (
  showHeader: boolean
) => [
  {
    title: <span data-cy="file-column">File</span>,
    dataIndex: "fileName",
    key: "fileName",
    width: showHeader && "40%",
    render: (text: string, record: FileDiff): JSX.Element => (
      <a
        className="fileLink"
        href={record.diffLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        <WordBreak>{text}</WordBreak>
      </a>
    ),
  },
  {
    title: <span data-cy="additions-column">Additions</span>,
    dataIndex: "additions",
    key: "additions",
    width: !showHeader && 80,
    render: (text: number): JSX.Element => (
      <FileDiffText value={text} type="+" />
    ),
  },
  {
    title: <span data-cy="deletions-column">Deletions</span>,
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
  margin-bottom: 50px;
`;
const FileDiffTextContainer = styled("span")`
  ${(props: { type: string; hasValue: boolean }): string =>
    props.hasValue &&
    (props.type === "+" ? `color: ${green.base};` : `color: ${red.base};`)}
  &:nth-of-type(2) {
    margin-left: 16px;
  }
`;
