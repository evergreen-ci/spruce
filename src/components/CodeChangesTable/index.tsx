import React from "react";
import styled from "@emotion/styled";

import { Table } from "antd";
import { uiColors } from "@leafygreen-ui/palette";
import { FileDiff } from "types/patch";

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
    scroll={{ y: 300 }}
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

const rowKey = (record: FileDiff, index: number): string => `${index}`;

const columns = (showHeader: boolean) => [
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
  },
  {
    title: "Additions",
    dataIndex: "additions",
    key: "additions",
    width: !showHeader && 80,
    render: (text: number) => <FileDiffText value={text} type="+" />,
  },
  {
    title: "Deletions",
    dataIndex: "deletions",
    key: "deletions",
    width: !showHeader && 80,
    render: (text: number) => <FileDiffText value={text} type="-" />,
  },
];

const StyledTable = styled(Table)`
  margin-top: 13px;
  margin-bottom: 50px;
`;
const FileDiffTextContainer = styled("span")`
  ${(props: { type: string; hasValue: boolean }) =>
    props.hasValue &&
    (props.type === "+" ? `color: ${green.base};` : `color: ${red.base};`)}
  &:nth-child(2) {
    margin-left: 16px;
  }
`;
