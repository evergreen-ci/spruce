import { useState } from "react";
import { ColumnProps } from "antd/es/table";
import { SortOrder } from "antd/es/table/interface";
import { SortDirection } from "gql/generated/types";

export const useSetColumnDefaultSortOrder = <T>(
  columns: ColumnProps<T>[],
  sortByValue: string,
  sortDirValue: string
) => {
  const [modifiedColumns, setModifiedColumns] = useState<ColumnProps<T>[]>();

  if (!modifiedColumns) {
    const columnsClone = columns.map((c) => ({
      ...c,
      ...(c.key === sortByValue && {
        defaultSortOrder: (sortDirValue === SortDirection.Asc
          ? "ascend"
          : "descend") as SortOrder,
      }),
    }));

    setModifiedColumns(columnsClone);
  }

  return modifiedColumns;
};
