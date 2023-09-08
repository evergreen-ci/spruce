import { useMemo, useRef } from "react";
import {
  Table,
  TableHead,
  HeaderRow,
  HeaderCell,
  TableBody,
  Row,
  Cell,
  LGColumnDef,
  useLeafyGreenTable,
  HeaderGroup,
  LeafyGreenTableRow,
  flexRender,
} from "@leafygreen-ui/table/new";
import { Subtitle } from "@leafygreen-ui/typography";
import { StyledLink } from "components/styles";
import { Unpacked } from "types/utils";
import { GroupedFiles } from "../types";

type GroupedFilesFile = Unpacked<GroupedFiles["files"]>;
interface GroupedFilesTableProps {
  files: GroupedFilesFile[];
  taskName?: string;
}
const GroupedFilesTable: React.FC<GroupedFilesTableProps> = ({
  files,
  taskName,
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<Array<LGColumnDef<GroupedFilesFile>>>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 60,
        enableSorting: true,
        cell: (value) => (
          <StyledLink href={value.row.original.link}>
            {value.getValue()}
          </StyledLink>
        ),
      },
    ],
    []
  );
  const table = useLeafyGreenTable<GroupedFilesFile>({
    containerRef: tableContainerRef,
    data: files,
    columns,
  });

  const { rows } = table.getRowModel();

  return (
    <>
      {taskName && <Subtitle>{taskName}</Subtitle>}
      <Table ref={tableContainerRef}>
        <TableHead>
          {table
            .getHeaderGroups()
            .map((headerGroup: HeaderGroup<GroupedFilesFile>) => (
              <HeaderRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <HeaderCell key={header.id} header={header}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </HeaderCell>
                ))}
              </HeaderRow>
            ))}
        </TableHead>
        <TableBody>
          {rows.map((row: LeafyGreenTableRow<GroupedFilesFile>) => (
            <Row key={row.id} row={row}>
              {row.getVisibleCells().map((cell) => (
                <Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Cell>
              ))}
            </Row>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default GroupedFilesTable;
