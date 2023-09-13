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
import { glyphs } from "components/Icon";
import { TablePlaceholder } from "./TablePlaceholder";

type SpruceTableProps = {
  "data-cy-row"?: string;
  "data-cy-table"?: string;
  noDataPlaceholder?: string;
  noDataGlyph?: keyof typeof glyphs;
  noDataSpinner?: boolean;
};

export const BaseTable = <T extends LGRowData>({
  "data-cy-row": dataCyRow,
  "data-cy-table": dataCyTable,
  noDataGlyph,
  noDataPlaceholder = "No data found",
  noDataSpinner = false,
  table,
  ...args
}: SpruceTableProps & TableProps<T>) => (
  <>
    <Table data-cy={dataCyTable} table={table} {...args}>
      <TableHead>
        {table.getHeaderGroups().map((headerGroup) => (
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
        {table.getRowModel().rows.map((row) => (
          <Row key={row.id} row={row} data-cy={dataCyRow}>
            {row.getVisibleCells().map((cell) => (
              <Cell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Cell>
            ))}
            {row.original.renderExpandedContent && (
              <ExpandedContent row={row} />
            )}
          </Row>
        ))}
      </TableBody>
    </Table>
    {table.getRowModel().rows.length === 0 && (
      <TablePlaceholder
        message={noDataPlaceholder}
        glyph={noDataGlyph}
        spin={noDataSpinner}
      />
    )}
  </>
);
