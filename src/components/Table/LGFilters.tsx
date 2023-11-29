import { LeafyGreenTableRow } from "@leafygreen-ui/table";
import {
  TableFilterPopover,
  TableSearchPopover,
  TableSortIcon,
} from "components/TablePopover";
import { TreeDataEntry } from "components/TreeSelect";

type TreeSelectFilterProps = {
  "data-cy"?: string;
  onConfirm?: ({ id, value }: { id: string; value: string[] }) => void;
  tData: TreeDataEntry[];
};

/*
 * @deprecated Use react-table's onColumnFiltersChange prop.
 */
export const getColumnTreeSelectFilterProps = ({
  "data-cy": dataCy,
  onConfirm = () => {},
  tData,
}: TreeSelectFilterProps) => ({
  enableColumnFilter: false,
  meta: {
    filterComponent: ({ column }) => {
      const filteredOptions = tData.filter(
        ({ value }) => !!column.getFacetedUniqueValues().get(value)
      );
      return (
        <TableFilterPopover
          data-cy={dataCy}
          onConfirm={(newValue) => {
            column.setFilterValue(newValue);
            onConfirm({ id: column.id, value: newValue });
          }}
          options={filteredOptions.length ? filteredOptions : tData}
          value={column?.getFilterValue() ?? []}
        />
      );
    },
  },
  filterFn: (
    row: LeafyGreenTableRow<any>,
    columnId: string,
    filterValue: string[]
  ) => {
    // If no filter is specified, show all rows.
    if (!filterValue.length) {
      return true;
    }
    return filterValue.includes(row.getValue(columnId));
  },
});

type InputFilterProps = {
  "data-cy"?: string;
  onConfirm?: ({ id, value }: { id: string; value: string }) => void;
};

/*
 * @deprecated Use react-table's onColumnFiltersChange prop.
 */
export const getColumnInputFilterProps = ({
  "data-cy": dataCy,
  onConfirm = () => {},
}: InputFilterProps) => ({
  enableColumnFilter: false,
  meta: {
    filterComponent: ({ column }) => (
      <TableSearchPopover
        data-cy={dataCy}
        onConfirm={(newValue) => {
          column.setFilterValue(newValue);
          onConfirm({ id: column.id, value: newValue });
        }}
        value={column?.getFilterValue() ?? ""}
      />
    ),
  },
  filterFn: (
    row: LeafyGreenTableRow<any>,
    columnId: string,
    filterValue: string
  ) => {
    // If no filter is specified, show all rows.
    if (!filterValue.length) {
      return true;
    }
    return (row.getValue(columnId) as string)
      .toLowerCase()
      .includes(filterValue.toLowerCase());
  },
});

type SortProps = {
  "data-cy"?: string;
  onToggle?: ({ id, value }: { id: string; value: string }) => void;
};

/*
 * @deprecated Use react-table's onSortingChange prop.
 */
export const getColumnSortProps = ({
  "data-cy": dataCy,
  onToggle = () => {},
}: SortProps) => ({
  meta: {
    sortComponent: ({ column }) => (
      <TableSortIcon
        data-cy={dataCy}
        onToggle={(newValue) => {
          column.toggleSorting();
          onToggle({ id: column.id, value: newValue });
        }}
        value={column.getIsSorted().toString()}
      />
    ),
  },
});
