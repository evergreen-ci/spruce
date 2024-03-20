import { useRef } from "react";
import { useLeafyGreenTable } from "@leafygreen-ui/table";
import { FileDiffText } from "components/CodeChangesBadge";
import { StyledLink, WordBreak } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import { FileDiffsFragment } from "gql/generated/types";

interface CodeChangesTableProps {
  fileDiffs: FileDiffsFragment[];
}
export const CodeChangesTable: React.FC<CodeChangesTableProps> = ({
  fileDiffs,
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable({
    columns,
    data: fileDiffs ?? [],
    containerRef: tableContainerRef,
    enableColumnFilters: false,
    enableSorting: false,
  });

  return (
    <BaseTable
      data-cy="code-changes-table"
      data-cy-row="code-changes-table-row"
      emptyComponent={<TablePlaceholder message="No diffs." />}
      table={table}
      shouldAlternateRowColor
    />
  );
};

const columns = [
  {
    id: "fileName",
    accessorKey: "fileName",
    header: "File Name",
    enableColumnFilter: true,
    cell: ({
      getValue,
      row: {
        original: { diffLink },
      },
    }) => (
      <StyledLink
        data-cy="fileLink"
        href={diffLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        <WordBreak>{getValue()}</WordBreak>
      </StyledLink>
    ),
  },
  {
    id: "additions",
    accessorKey: "additions",
    header: "Additions",
    cell: ({ getValue }) => <FileDiffText value={getValue()} type="+" />,
  },
  {
    id: "deletions",
    accessorKey: "deletions",
    header: "Deletions",
    cell: ({ getValue }) => <FileDiffText value={getValue()} type="-" />,
  },
];
