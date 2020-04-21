import React from "react";
import styled from "@emotion/styled";

import { Table } from "antd";
import { uiColors } from "@leafygreen-ui/palette";
import { FileDiff } from "types/patch";

export const CodeChangesTable: React.FC<{
  fileDiffs: FileDiff[];
  showHeader?: boolean;
}> = ({ fileDiffs, showHeader = true }) => (
  <StyledTable
    className="cy-code-changes-table"
    rowKey={rowKey}
    columns={columns(showHeader)}
    dataSource={fileDiffs}
    pagination={false}
    scroll={{ y: 300 }}
    showHeader={showHeader}
  />
);

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
    render: (text: number) => {
      if (text === 0) {
        return text;
      }
      return <Addition>+{text}</Addition>;
    },
  },
  {
    title: "Deletions",
    dataIndex: "deletions",
    key: "deletions",
    width: !showHeader && 80,
    render: (text: number) =>
      text === 0 ? text : <Deletion>-{text}</Deletion>,
  },
];
