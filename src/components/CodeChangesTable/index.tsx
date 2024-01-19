import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { FileDiffText } from "components/CodeChangesBadge";
import { StyledLink, WordBreak } from "components/styles";
import { FileDiffsFragment } from "gql/generated/types";

interface CodeChangesTableProps {
  fileDiffs: FileDiffsFragment[];
  showHeader?: boolean;
}
export const CodeChangesTable: React.FC<CodeChangesTableProps> = ({
  fileDiffs,
  showHeader = true,
}) => (
  <Table
    data-cy="code-changes-table"
    rowKey={rowKey}
    columns={columns(showHeader)}
    dataSource={fileDiffs}
    pagination={false}
    showHeader={showHeader}
  />
);

const rowKey = (record: FileDiffsFragment): string =>
  `${record.diffLink}_code_table`;

const columns: (
  showHeader: boolean,
) => Array<ColumnProps<FileDiffsFragment>> = (showHeader: boolean) => [
  {
    title: <span data-cy="file-column">File</span>,
    width: "60%",
    dataIndex: "fileName",
    key: "fileName",
    render: (text: string, record: FileDiffsFragment): JSX.Element => (
      <StyledLink
        data-cy="fileLink"
        href={record.diffLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        <WordBreak>{text}</WordBreak>
      </StyledLink>
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
