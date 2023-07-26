import { LeafyGreenTableRow } from "@leafygreen-ui/table/new";
import { TableFilterPopover } from "components/TablePopover";
import { TreeDataEntry } from "components/TreeSelect";

type TreeSelectFilterProps = {
  "data-cy"?: string;
  tData: TreeDataEntry[];
  title: React.ReactNode;
};

export const getColumnTreeSelectFilterProps = ({
  "data-cy": dataCy,
  tData,
  title,
}: TreeSelectFilterProps) => ({
  filterFn: (
    row: LeafyGreenTableRow<any>,
    columnId: string,
    filterValue: string[]
  ) => {
    // If no filter is specified, show all rows
    if (!filterValue.length) {
      return true;
    }
    return filterValue.includes(row.getValue(columnId));
  },
  header: ({ column }) => {
    // Only present options that appear in the table
    const options = tData.filter(
      ({ value }) => !!column.getFacetedUniqueValues().get(value)
    );
    return (
      <>
        {title}
        <TableFilterPopover
          value={column?.getFilterValue() ?? []}
          options={options}
          onConfirm={(value) => {
            column.setFilterValue(value);
          }}
          data-cy={dataCy}
        />
      </>
    );
  },
});
