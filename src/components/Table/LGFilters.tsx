import { LeafyGreenTableRow } from "@leafygreen-ui/table/new";
import {
  TableFilterPopover,
  TableSearchPopover,
  TableSortIcon,
} from "components/TablePopover";
import { TreeDataEntry } from "components/TreeSelect";

type TreeSelectFilterProps = {
  "data-cy"?: string;
  tData: TreeDataEntry[];
  onConfirm?: ({ id, value }: { id: string; value: string[] }) => void;
};

export const getColumnTreeSelectFilterProps = ({
  "data-cy": dataCy,
  onConfirm = () => {},
  tData,
}: TreeSelectFilterProps) => ({
  meta: {
    filterComponent: ({ column }) => {
      const filteredOptions = tData.filter(
        ({ value }) => !!column.getFacetedUniqueValues().get(value)
      );
      return (
        <TableFilterPopover
          value={column?.getFilterValue() ?? []}
          options={filteredOptions.length ? filteredOptions : tData}
          onConfirm={(newValue) => {
            column.setFilterValue(newValue);
            onConfirm({ id: column.id, value: newValue });
          }}
          data-cy={dataCy}
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

export const getColumnInputFilterProps = ({
  "data-cy": dataCy,
  onConfirm = () => {},
}: InputFilterProps) => ({
  meta: {
    filterComponent: ({ column }) => (
      <TableSearchPopover
        value={column?.getFilterValue() ?? ""}
        onConfirm={(newValue) => {
          column.setFilterValue(newValue);
          onConfirm({ id: column.id, value: newValue });
        }}
        data-cy={dataCy}
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

export const getColumnSortProps = ({
  "data-cy": dataCy,
  onToggle = () => {},
}: SortProps) => ({
  meta: {
    sortComponent: ({ column }) => (
      <TableSortIcon
        value={column.getIsSorted().toString()}
        onToggle={(newValue) => {
          column.toggleSorting();
          onToggle({ id: column.id, value: newValue });
        }}
        data-cy={dataCy}
      />
    ),
  },
});
