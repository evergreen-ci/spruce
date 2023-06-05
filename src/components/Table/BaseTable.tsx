import {
  Cell,
  ExpandedContent,
  flexRender,
  HeaderCell,
  HeaderRow,
  type LGRowData,
  Row,
  Table,
  TableBody,
  type TableProps,
  TableHead,
} from "@leafygreen-ui/table/new";

export const BaseTable = <T extends LGRowData>({
  table,
  ...args
}: TableProps<T>) => (
  <Table table={table} {...args}>
    <TableHead>
      {table.getHeaderGroups().map((headerGroup) => (
        <HeaderRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <HeaderCell key={header.id} header={header}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </HeaderCell>
          ))}
        </HeaderRow>
      ))}
    </TableHead>
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <Row key={row.id} row={row} data-cy="subscription-row">
          {row.getVisibleCells().map((cell) => (
            <Cell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Cell>
          ))}
          {row.original.renderExpandedContent && <ExpandedContent row={row} />}
        </Row>
      ))}
    </TableBody>
  </Table>
);
