import styled from "@emotion/styled";
import { css } from "@leafygreen-ui/emotion";
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
} from "@leafygreen-ui/table";
import { RowData } from "@tanstack/react-table";
import {
  TableFilterPopover,
  TableSearchPopover,
} from "components/TablePopover";
import { TreeDataEntry } from "components/TreeSelect";
import TableLoader from "./TableLoader";

// Define typing of columns' meta field
// https://tanstack.com/table/v8/docs/api/core/column-def#meta
declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    search?: {
      "data-cy"?: string;
      placeholder?: string;
    };
    treeSelect?: {
      "data-cy"?: string;
      // Configures whether or not the tree select should be filtered to only represent values found in the table.
      // Note that this may not be very performant for large tables.
      filterOptions?: boolean;
      options: TreeDataEntry[];
    };
    // Overcome react-table's column width limitations
    // https://github.com/TanStack/table/discussions/4179#discussioncomment-3334470
    width?: string;
  }
}

type SpruceTableProps = {
  "data-cy-row"?: string;
  "data-cy-table"?: string;
  emptyComponent?: React.ReactNode;
  loading?: boolean;
  /** estimated number of rows the table will have */
  loadingRows?: number;
};

export const BaseTable = <T extends LGRowData>({
  "data-cy-row": dataCyRow,
  "data-cy-table": dataCyTable,
  emptyComponent,
  loading,
  loadingRows = 5,
  table,
  ...args
}: SpruceTableProps & TableProps<T>) => (
  <>
    <StyledTable data-cy={dataCyTable} table={table} {...args}>
      <TableHead>
        {table.getHeaderGroups().map((headerGroup) => (
          <HeaderRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const { columnDef } = header.column ?? {};
              const { meta } = columnDef;
              return (
                <HeaderCell
                  key={header.id}
                  header={header}
                  style={meta?.width && { width: columnDef?.meta?.width }}
                >
                  {flexRender(columnDef.header, header.getContext())}
                  {header.column.getCanFilter() &&
                    (meta?.treeSelect ? (
                      <TableFilterPopover
                        data-cy={meta.treeSelect?.["data-cy"]}
                        onConfirm={(value) =>
                          header.column.setFilterValue(value)
                        }
                        options={
                          meta.treeSelect?.filterOptions
                            ? meta.treeSelect.options.filter(
                                ({ value }) =>
                                  !!header.column
                                    .getFacetedUniqueValues()
                                    .get(value)
                              )
                            : meta.treeSelect.options
                        }
                        value={
                          (header?.column?.getFilterValue() as string[]) ?? []
                        }
                      />
                    ) : (
                      <TableSearchPopover
                        data-cy={meta?.search?.["data-cy"]}
                        onConfirm={(value) =>
                          header.column.setFilterValue(value)
                        }
                        placeholder={meta?.search?.placeholder}
                        value={
                          (header?.column?.getFilterValue() as string) ?? ""
                        }
                      />
                    ))}
                </HeaderCell>
              );
            })}
          </HeaderRow>
        ))}
      </TableHead>
      <TableBody>
        {loading && (
          <TableLoader
            numColumns={table.getAllColumns().length}
            numRows={loadingRows}
          />
        )}
        {table.getRowModel().rows.map((row) => (
          <Row
            key={row.id}
            row={row}
            data-cy="leafygreen-table-row"
            className={css`
              &[aria-hidden="false"] td > div {
                max-height: unset;
              }
            `}
          >
            {row.getVisibleCells().map((cell) => (
              <Cell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Cell>
            ))}
            {row.original.renderExpandedContent && (
              <ExpandedContent row={row} />
            )}
            {row.subRows &&
              row.subRows.map((subRow) => (
                <Row
                  key={subRow.id}
                  row={subRow}
                  className={css`
                    &[aria-hidden="false"] td > div[data-state="entered"] {
                      max-height: unset;
                    }
                  `}
                >
                  {subRow.getVisibleCells().map((cell) => (
                    <Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Cell>
                  ))}
                </Row>
              ))}
          </Row>
        ))}
      </TableBody>
    </StyledTable>

    {!loading &&
      table.getRowModel().rows.length === 0 &&
      (emptyComponent || "No data to display")}
  </>
);

const StyledTable = styled(Table)`
  transition: none !important;
`;
